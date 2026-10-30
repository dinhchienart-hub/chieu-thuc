/**
 * ============================================================================
 * VÕ LÂM IDLE - HỆ THỐNG BÁN ĐỒ TỰ ĐỘNG & CHỐNG ĐẦY TÚI TREO MÁY TOÀN DIỆN
 * SMART AUTO-SELL & ANTI-BAG-FULL SYSTEM (HTZ / JX1 ADVANCED ENGINE)
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[SmartAutoSell] Đang khởi chạy hệ thống bán đồ tự động thông minh...");

  const STORAGE_KEY = "jx_smart_autosell_config_v1";

  const defaultConfig = {
    enabled: true,              // Bật tự động dọn túi thông minh
    sellOnPick: true,           // Bán ngay khi nhặt nếu là đồ rác (không tốn ô túi)
    fallbackSellBox: true,      // Khi Kho Rèn đầy, tự động bán đồ rác (chống kẹt túi)
    autoCleanThreshold: 85,     // Tự động dọn khi túi đầy >= 85% (hoặc còn < 3 ô)
    sellWhite: true,            // Bán trang bị trắng
    sellBlueJunk: true,         // Bán trang bị xanh cấp thấp / không dòng hiếm
    protectUpgradeGear: true,   // Giữ trang bị có dòng cao hơn đồ đang mặc
    protectGemsAndMats: true,   // Bảo vệ huyền tinh, dược phẩm, bí kíp
    stats: {
      totalSold: 0,
      totalGold: 0,
      lastCleanTime: 0
    }
  };

  function getJX() {
    return window.__JX || null;
  }

  function fmtNum(n) {
    if (n == null || isNaN(n)) return "0";
    if (n >= 1000000000) return (n / 1000000000).toFixed(1).replace(/\.0$/, "") + " tỷ";
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + " triệu";
    if (n >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return Math.round(n).toLocaleString("vi-VN");
  }

  const SmartAutoSell = {
    config: Object.assign({}, defaultConfig),
    modalEl: null,
    inited: false,

    loadConfig: function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.config = Object.assign({}, defaultConfig, parsed);
          this.config.stats = Object.assign({}, defaultConfig.stats, parsed.stats || {});
        }
      } catch (e) {
        console.warn("[SmartAutoSell] Lỗi đọc config từ localStorage:", e);
      }
    },

    saveConfig: function() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      } catch (e) {
        console.warn("[SmartAutoSell] Lỗi lưu config:", e);
      }
    },

    // Kiểm tra xem một vật phẩm có phải là đồ rác được phép bán hay không
    isJunk: function(item) {
      if (!item) return false;
      const JX = getJX();
      if (!JX || !JX.S) return false;
      const l = JX.S;

      // 1. Đang mặc trên người -> Tuyệt đối không bán
      if (l.eq && Object.values(l.eq).includes(item)) return false;

      // 2. Đã khóa -> Không bán
      if (item.lock) return false;

      // 3. Vật phẩm đặc biệt được game bảo vệ (HKMP, set kích hoạt, phi phong, thần mã, gói quà)
      if (typeof JX.isProtected === "function" && JX.isProtected(item)) return false;
      if (item.set || item.vio || item.plv || item.thanma || item.ktc || item.pack || item.d === 10 || item.r >= 2) return false;

      // 4. Tiêu hao, dược phẩm, nguyên liệu quý
      if (typeof E1 === "function" && E1(item)) return false;

      // 5. Nếu cấu hình bảo vệ đồ có tiềm năng nâng cấp (chỉ số cao hơn đồ đang mặc)
      if (this.config.protectUpgradeGear && typeof JX.canKeep === "function") {
        if (JX.canKeep(item)) return false;
      }

      // 6. Kiểm tra trang bị trắng (r === 0 hoặc không có thuộc tính ma pháp mag)
      const hasMag = Array.isArray(item.mag) && item.mag.length > 0;
      if (!hasMag || item.r === 0) {
        return !!this.config.sellWhite;
      }

      // 7. Trang bị xanh (r === 1) mà không được bộ lọc giữ lại
      if (item.r === 1) {
        return !!this.config.sellBlueJunk;
      }

      return false;
    },

    // Lấy danh sách các món rác trong túi
    getJunkItems: function() {
      const JX = getJX();
      if (!JX || !JX.S || !Array.isArray(JX.S.inv)) return [];
      
      // Kết hợp cả hàm mặc định của game và bộ lọc thông minh
      const defaultJunk = (typeof JX.getJunk === "function") ? JX.getJunk() : [];
      const set = new Set(defaultJunk);

      // Quét thêm theo tiêu chí isJunk của SmartAutoSell
      for (const item of JX.S.inv) {
        if (this.isJunk(item)) {
          set.add(item);
        }
      }

      return Array.from(set);
    },

    // Thực hiện dọn túi: cất phôi vào Kho Rèn và bán sạch đồ rác
    cleanBag: function(silent = false) {
      const JX = getJX();
      if (!JX || !JX.S) return { count: 0, gold: 0 };
      const l = JX.S;
      const h = JX.R;

      let stashed = 0;
      // Nếu bật fallback và có thể cất Kho Rèn
      if (typeof JX.getBoxItems === "function" && typeof JX.boxMax === "number") {
        const boxItems = JX.boxItems;
        const boxMax = JX.boxMax;
        if (Array.isArray(boxItems) && boxItems.length < boxMax) {
          const eligible = JX.getBoxItems();
          for (const item of eligible) {
            if (boxItems.length >= boxMax) break;
            const idx = l.inv.indexOf(item);
            if (idx >= 0) {
              l.inv.splice(idx, 1);
              boxItems.push(item);
              stashed++;
            }
          }
        }
      }

      // Bán đồ rác còn lại trong túi
      const junkList = this.getJunkItems();
      if (!junkList.length) {
        if (!silent && typeof JX.toast === "function") {
          JX.toast(stashed ? `Đã cất ${stashed} món vào Kho Rèn. Không có đồ rác để bán!` : "Hành trang gọn gàng, không có đồ rác!");
        }
        return { count: 0, gold: 0, stashed };
      }

      let goldEarned = 0;
      for (const item of junkList) {
        const price = (typeof JX.itemPrice === "function") ? JX.itemPrice(item) : 0;
        goldEarned += (price || 0);
      }

      // Loại bỏ đồ rác khỏi hành trang
      l.inv = l.inv.filter(item => !junkList.includes(item));
      l.gold = (l.gold || 0) + goldEarned;

      // Cập nhật thống kê
      this.config.stats.totalSold += junkList.length;
      this.config.stats.totalGold += goldEarned;
      this.config.stats.lastCleanTime = Date.now();
      this.saveConfig();

      // Đồng bộ trạng thái game
      if (h) h.dirty = true;
      if (typeof JX.save === "function") JX.save();

      const invMax = JX.invMax || 50;
      const msg = `Đã dọn <b style="color:#ffd700;">${junkList.length}</b> món rác, thu về <b style="color:#51cf66;">+${fmtNum(goldEarned)}</b> lượng.${stashed ? ` Cất ${stashed} phôi.` : ""} Túi: <b>${l.inv.length}/${invMax}</b>.`;

      if (typeof JX.log === "function" && (!silent || junkList.length >= 5)) {
        JX.log(`<span style="color:#ffd700;">[Auto Bán Đồ]</span> ${msg}`);
      }
      if (!silent && typeof JX.toast === "function") {
        JX.toast(`Đã bán ${junkList.length} món rác (+${fmtNum(goldEarned)} lượng)`);
      }

      this.updateUI();
      return { count: junkList.length, gold: goldEarned, stashed };
    },

    // Cất nhanh toàn bộ phôi vào Kho Rèn
    stashToBox: function() {
      const JX = getJX();
      if (!JX || !JX.S) return 0;
      const l = JX.S;
      if (typeof JX.getBoxItems !== "function" || typeof JX.boxMax !== "number") return 0;

      const boxItems = JX.boxItems;
      const boxMax = JX.boxMax;
      if (!Array.isArray(boxItems) || boxItems.length >= boxMax) {
        if (typeof JX.toast === "function") JX.toast("Kho Rèn đã đầy!");
        return 0;
      }

      let count = 0;
      const eligible = JX.getBoxItems();
      for (const item of eligible) {
        if (boxItems.length >= boxMax) break;
        const idx = l.inv.indexOf(item);
        if (idx >= 0) {
          l.inv.splice(idx, 1);
          boxItems.push(item);
          count++;
        }
      }

      if (count > 0) {
        if (JX.R) JX.R.dirty = true;
        if (typeof JX.save === "function") JX.save();
        if (typeof JX.toast === "function") JX.toast(`Đã cất ${count} món vào Kho Rèn (${boxItems.length}/${boxMax})`);
        if (typeof JX.log === "function") JX.log(`<span class="dim">Đã cất ${count} món vào Kho Rèn.</span>`);
        this.updateUI();
      } else {
        if (typeof JX.toast === "function") JX.toast("Không có món nào phù hợp để cất Kho Rèn");
      }
      return count;
    },

    // Vòng lặp chủ động chống kẹt túi khi AFK
    checkProactive: function() {
      if (!this.config.enabled) return;
      const JX = getJX();
      if (!JX || !JX.S) return;
      const l = JX.S;
      const invMax = JX.invMax || 50;

      if (!l.inv || !Array.isArray(l.inv)) return;

      const capacityPct = (l.inv.length / invMax) * 100;
      const threshold = this.config.autoCleanThreshold || 85;

      // Khi dung lượng đạt ngưỡng (mặc định >= 85%) hoặc túi còn <= 2 ô trống
      if (capacityPct >= threshold || l.inv.length >= invMax - 2) {
        this.cleanBag(true);
      }
    },

    // Cập nhật giao diện thanh trạng thái và nút trên Action Ribbon
    updateUI: function() {
      const JX = getJX();
      if (!JX || !JX.S) return;
      const l = JX.S;
      const invMax = JX.invMax || 50;
      const current = l.inv ? l.inv.length : 0;
      const pct = Math.round((current / invMax) * 100);

      // Cập nhật Badge trên Action Ribbon
      const badge = document.getElementById("ribbonBagBadge");
      if (badge) {
        badge.textContent = `${current}/${invMax}`;
        badge.className = "ribbon-badge " + (pct >= 90 ? "danger" : pct >= 75 ? "warn" : "safe");
      }

      // Cập nhật thanh Hành Trang nếu đang mở
      const barFill = document.getElementById("invAutoSellProgressFill");
      const barTxt = document.getElementById("invAutoSellCapacityTxt");
      const junkBtn = document.getElementById("invAutoSellQuickBtn");

      if (barFill && barTxt) {
        barTxt.textContent = `Túi: ${current}/${invMax} ô (${pct}%)`;
        barFill.style.width = `${Math.min(100, pct)}%`;
        barFill.style.background = pct >= 90 ? "linear-gradient(90deg, #ff6b6b, #c92a2a)" :
                                   pct >= 75 ? "linear-gradient(90deg, #ffd43b, #f59e0b)" :
                                               "linear-gradient(90deg, #51cf66, #2b8a3e)";
      }

      if (junkBtn) {
        const junkCount = this.getJunkItems().length;
        junkBtn.innerHTML = `<span>🧹 Dọn Rác (${junkCount})</span>`;
        junkBtn.style.opacity = junkCount > 0 ? "1" : "0.6";
      }

      // Cập nhật Modal nếu đang mở
      this.updateModalStats();
    },

    updateModalStats: function() {
      if (!this.modalEl || !this.modalEl.classList.contains("active")) return;
      const JX = getJX();
      if (!JX || !JX.S) return;
      const l = JX.S;
      const invMax = JX.invMax || 50;
      const boxMax = JX.boxMax || 50;
      const invCur = l.inv ? l.inv.length : 0;
      const boxCur = JX.boxItems ? JX.boxItems.length : 0;

      const elInvVal = document.getElementById("smartModalInvVal");
      const elInvFill = document.getElementById("smartModalInvFill");
      const elBoxVal = document.getElementById("smartModalBoxVal");
      const elBoxFill = document.getElementById("smartModalBoxFill");
      const elSoldVal = document.getElementById("smartModalSoldVal");
      const elGoldVal = document.getElementById("smartModalGoldVal");

      if (elInvVal) elInvVal.textContent = `${invCur} / ${invMax} ô`;
      if (elInvFill) {
        const p = Math.min(100, (invCur / invMax) * 100);
        elInvFill.style.width = `${p}%`;
        elInvFill.style.background = p >= 90 ? "#ff6b6b" : p >= 75 ? "#ffd43b" : "#51cf66";
      }

      if (elBoxVal) elBoxVal.textContent = `${boxCur} / ${boxMax} ô`;
      if (elBoxFill) {
        const p = Math.min(100, (boxCur / boxMax) * 100);
        elBoxFill.style.width = `${p}%`;
        elBoxFill.style.background = p >= 90 ? "#ff6b6b" : "#4dabf7";
      }

      if (elSoldVal) elSoldVal.textContent = `${this.config.stats.totalSold} món`;
      if (elGoldVal) elGoldVal.textContent = `${fmtNum(this.config.stats.totalGold)} lượng`;
    },

    // Khởi tạo Modal Cài Đặt
    initModal: function() {
      if (document.getElementById("smartAutoSellModal")) return;

      const modal = document.createElement("div");
      modal.id = "smartAutoSellModal";
      modal.className = "smart-autosell-modal";

      modal.innerHTML = `
        <div class="smart-autosell-box">
          <div class="smart-autosell-header">
            <h3><span>💰</span><span>Bán Đồ Tự Động & Chống Đầy Túi</span></h3>
            <button class="smart-autosell-close" id="smartAutoSellCloseBtn">&times;</button>
          </div>
          <div class="smart-autosell-body">
            <!-- Bảng thống kê sức chứa -->
            <div class="autosell-stat-cards">
              <div class="autosell-stat-card">
                <span class="label">Sức Chứa Hành Trang</span>
                <span class="value" id="smartModalInvVal">0/50</span>
                <div class="sub-bar"><div class="sub-fill" id="smartModalInvFill" style="width:0%"></div></div>
              </div>
              <div class="autosell-stat-card">
                <span class="label">Dung Lượng Kho Rèn</span>
                <span class="value" id="smartModalBoxVal">0/50</span>
                <div class="sub-bar"><div class="sub-fill" id="smartModalBoxFill" style="width:0%"></div></div>
              </div>
              <div class="autosell-stat-card">
                <span class="label">Đã Tự Động Bán</span>
                <span class="value" id="smartModalSoldVal">0 món</span>
              </div>
              <div class="autosell-stat-card">
                <span class="label">Tổng Ngân Lượng Thu Về</span>
                <span class="value" id="smartModalGoldVal">0 lượng</span>
              </div>
            </div>

            <!-- Thiết lập cơ chế tự động -->
            <div class="autosell-group-title">Cơ Chế Bán Đồ Thông Minh</div>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Bật Hệ Thống Auto Bán Đồ</span>
                <span class="autosell-switch-desc">Kích hoạt toàn bộ tính năng tự động dọn túi và chống đầy</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartEnabled">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Bán Tức Thì Khi Nhặt (Sell on Pick)</span>
                <span class="autosell-switch-desc">Đồ rác rơi ra khi nhặt sẽ tự bán thành tiền, không chiếm 1 ô túi nào</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartSellOnPick">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Kho Rèn Đầy: Tự Bán Đồ Rác</span>
                <span class="autosell-switch-desc">Nếu chọn cất Kho Rèn nhưng kho đã đầy, tự động bán rác thay vì treo máy ngừng nhặt</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartFallbackBox">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Chủ Động Dọn Túi Khi Đạt 85%</span>
                <span class="autosell-switch-desc">Tự quét và dọn đồ rác định kỳ mỗi 2 giây, không bao giờ để túi chạm mốc 100%</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartAutoClean">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>

            <div class="autosell-group-title">Bộ Lọc Phân Loại Vật Phẩm</div>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Bán Trang Bị Trắng</span>
                <span class="autosell-switch-desc">Tự động bán tất cả trang bị trắng không có thuộc tính</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartSellWhite">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Bán Trang Bị Xanh Rác</span>
                <span class="autosell-switch-desc">Bán đồ xanh có điểm thuộc tính thấp hơn đồ đang mặc và không có dòng quý</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartSellBlue">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>

            <label class="autosell-switch-row">
              <div class="autosell-switch-info">
                <span class="autosell-switch-title">Bảo Vệ Trang Bị Nâng Cấp</span>
                <span class="autosell-switch-desc">Tuyệt đối không bán trang bị có thuộc tính cao hơn đồ trên người hoặc có tiềm năng nâng cấp</span>
              </div>
              <div class="smart-toggle">
                <input type="checkbox" id="swSmartProtectUpgrade">
                <span class="smart-toggle-slider"></span>
              </div>
            </label>
          </div>

          <div class="smart-autosell-footer">
            <button class="btn-smart-action" id="smartModalCleanNowBtn">
              <span>🧹</span><span>Dọn Rác Ngay</span>
            </button>
            <button class="btn-smart-action secondary" id="smartModalStashBoxBtn">
              <span>📦</span><span>Cất Vào Kho Rèn</span>
            </button>
            <button class="btn-smart-action reset" id="smartModalResetBtn">
              <span>🔄</span><span>Mặc Định</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      this.modalEl = modal;

      // Gắn sự kiện đóng
      document.getElementById("smartAutoSellCloseBtn").onclick = () => this.closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal();
      };

      // Gắn sự kiện toggles
      const bindToggle = (id, prop) => {
        const el = document.getElementById(id);
        if (el) {
          el.checked = !!this.config[prop];
          el.onchange = () => {
            this.config[prop] = el.checked;
            this.saveConfig();
            this.syncGameSettings();
          };
        }
      };

      bindToggle("swSmartEnabled", "enabled");
      bindToggle("swSmartSellOnPick", "sellOnPick");
      bindToggle("swSmartFallbackBox", "fallbackSellBox");
      bindToggle("swSmartSellWhite", "sellWhite");
      bindToggle("swSmartSellBlue", "sellBlueJunk");
      bindToggle("swSmartProtectUpgrade", "protectUpgradeGear");

      const swClean = document.getElementById("swSmartAutoClean");
      if (swClean) {
        swClean.checked = (this.config.autoCleanThreshold > 0);
        swClean.onchange = () => {
          this.config.autoCleanThreshold = swClean.checked ? 85 : 0;
          this.saveConfig();
        };
      }

      // Gắn sự kiện nút thao tác
      document.getElementById("smartModalCleanNowBtn").onclick = () => {
        this.cleanBag(false);
      };

      document.getElementById("smartModalStashBoxBtn").onclick = () => {
        this.stashToBox();
      };

      document.getElementById("smartModalResetBtn").onclick = () => {
        this.config = Object.assign({}, defaultConfig);
        this.saveConfig();
        this.syncInputs();
        this.syncGameSettings();
        const JX = getJX();
        if (JX && typeof JX.toast === "function") JX.toast("Đã khôi phục cài đặt bán đồ chuẩn khuyên dùng!");
      };
    },

    syncInputs: function() {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!val;
      };
      setVal("swSmartEnabled", this.config.enabled);
      setVal("swSmartSellOnPick", this.config.sellOnPick);
      setVal("swSmartFallbackBox", this.config.fallbackSellBox);
      setVal("swSmartAutoClean", this.config.autoCleanThreshold > 0);
      setVal("swSmartSellWhite", this.config.sellWhite);
      setVal("swSmartSellBlue", this.config.sellBlueJunk);
      setVal("swSmartProtectUpgrade", this.config.protectUpgradeGear);
    },

    // Đồng bộ cài đặt với v2() của game core nếu cần
    syncGameSettings: function() {
      const JX = getJX();
      if (!JX || typeof JX.cfg !== "function") return;
      const cfg = JX.cfg();
      if (cfg && this.config.sellOnPick) {
        cfg.sellAt = "pick";
      }
      if (JX.S) {
        JX.S.autoJunk = this.config.enabled;
      }
    },

    openModal: function() {
      if (!this.modalEl) this.initModal();
      this.syncInputs();
      this.modalEl.classList.add("active");
      this.updateModalStats();
    },

    closeModal: function() {
      if (this.modalEl) {
        this.modalEl.classList.remove("active");
      }
    },

    // Chèn thanh thao tác nhanh vào Tab Hành Trang
    injectInvQuickBar: function() {
      const invTab = document.getElementById("t-inv");
      if (!invTab || document.getElementById("invAutoSellBar")) return;

      const bar = document.createElement("div");
      bar.id = "invAutoSellBar";
      bar.className = "inv-autosell-bar";

      bar.innerHTML = `
        <div class="inv-capacity-info">
          <span class="inv-capacity-txt" id="invAutoSellCapacityTxt">Túi: --/-- ô</span>
          <div class="inv-progress-track">
            <div class="inv-progress-fill" id="invAutoSellProgressFill" style="width:0%"></div>
          </div>
        </div>
        <div class="inv-actions">
          <button class="btn-autosell-quick" id="invAutoSellQuickBtn" title="Bán ngay toàn bộ đồ rác trong túi">
            <span>🧹 Dọn Rác</span>
          </button>
          <button class="btn-autosell-cfg" id="invAutoSellCfgBtn" title="Cài đặt tự động bán đồ">
            <span>⚙️ Auto Bán</span>
          </button>
        </div>
      `;

      invTab.insertBefore(bar, invTab.firstChild);

      // E4: Thêm Bộ Lọc Hành Trang Nâng Cao (Advanced Inventory Filter Bar)
      if (!document.getElementById("invFilterBar")) {
        const filterBar = document.createElement("div");
        filterBar.id = "invFilterBar";
        filterBar.className = "inv-filter-bar";
        filterBar.innerHTML = `
          <button class="inv-flt-chip active" data-flt="all">Tất cả</button>
          <button class="inv-flt-chip" data-flt="weapon">⚔️ Vũ khí</button>
          <button class="inv-flt-chip" data-flt="armor">🛡️ Phòng cụ</button>
          <button class="inv-flt-chip" data-flt="acc">💍 Trang sức</button>
          <button class="inv-flt-chip" data-flt="hk">🌟 Hoàng Kim</button>
          <button class="inv-flt-chip" data-flt="purple">🔮 Đồ Tím</button>
          <button class="inv-flt-chip" data-flt="lock">🔒 Đang Khóa</button>
          <button class="inv-flt-chip special" id="bLockAllHk" title="Khóa toàn bộ trang bị Hoàng Kim chưa khóa">🔒 Khóa Hết HK</button>
        `;
        bar.insertAdjacentElement("afterend", filterBar);

        this._activeFilter = "all";
        filterBar.querySelectorAll(".inv-flt-chip[data-flt]").forEach(chip => {
          chip.onclick = () => {
            filterBar.querySelectorAll(".inv-flt-chip[data-flt]").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            this._activeFilter = chip.getAttribute("data-flt");
            this.applyInvFilter();
          };
        });

        const lockHkBtn = document.getElementById("bLockAllHk");
        if (lockHkBtn) {
          lockHkBtn.onclick = () => {
            const JX = getJX();
            const l = JX ? JX.S : null;
            if (!l || !Array.isArray(l.inv)) return;
            let lockedCount = 0;
            l.inv.forEach(it => {
              if (it && (it.r === 3 || it.set || it.vio) && !it.lock) {
                it.lock = true;
                lockedCount++;
              }
            });
            if (lockedCount > 0) {
              const h = JX ? (JX.R || window.h) : window.h;
              if (h) h.dirty = true;
              if (typeof window.S === "function") window.S();
              if (typeof window.lu === "function") window.lu();
              if (JX && JX.toast) JX.toast(`🔒 Đã khóa an toàn ${lockedCount} món Hoàng Kim!`);
            } else {
              if (JX && JX.toast) JX.toast("Tất cả trang bị Hoàng Kim đã được khóa từ trước.");
            }
          };
        }

        // Lắng nghe thay đổi DOM của .invgrid để tự động áp lại filter khi túi cập nhật
        try {
          const invGrid = invTab.querySelector(".invgrid");
          if (invGrid && window.MutationObserver) {
            const obs = new MutationObserver(() => {
              if (this._activeFilter && this._activeFilter !== "all") {
                this.applyInvFilter();
              }
            });
            obs.observe(invGrid, { childList: true });
          }
        } catch(e) {}
      }

      document.getElementById("invAutoSellQuickBtn").onclick = () => {
        this.cleanBag(false);
      };

      document.getElementById("invAutoSellCfgBtn").onclick = () => {
        this.openModal();
      };

      this.updateUI();
    },

    applyInvFilter: function() {
      const flt = this._activeFilter || "all";
      const JX = getJX();
      const l = JX ? JX.S : null;
      if (!l || !Array.isArray(l.inv)) return;

      const items = document.querySelectorAll("#t-inv .invgrid .it[data-uid]");
      items.forEach(el => {
        if (flt === "all") {
          el.style.display = "";
          return;
        }
        const uid = +el.dataset.uid;
        const it = l.inv.find(item => item && item.uid === uid);
        if (!it) {
          el.style.display = "";
          return;
        }

        let show = false;
        if (flt === "weapon") show = (it.d === 0 || it.d === 10);
        else if (flt === "armor") show = [1, 2, 3, 4, 7].includes(it.d);
        else if (flt === "acc") show = [5, 6, 8, 9].includes(it.d);
        else if (flt === "hk") show = (it.r === 3 || !!it.set || !!it.vio);
        else if (flt === "purple") show = (it.r === 2);
        else if (flt === "lock") show = !!it.lock;

        el.style.display = show ? "" : "none";
      });
    },

    // Chèn nút Bán Đồ vào Action Ribbon
    injectRibbonButton: function() {
      const ribbon = document.getElementById("actionRibbon");
      if (!ribbon || document.getElementById("ribbonAutoSellBtn")) return;

      const btn = document.createElement("button");
      btn.className = "ribbon-btn highlight-gold";
      btn.id = "ribbonAutoSellBtn";
      btn.title = "Cài Đặt Tự Động Bán Đồ & Chống Đầy Túi Treo Máy";

      btn.innerHTML = `
        <span class="ribbon-icon">💰</span>
        <span class="ribbon-txt">Bán Đồ</span>
        <span class="ribbon-badge safe" id="ribbonBagBadge">--</span>
      `;

      btn.onclick = () => this.openModal();

      // Chèn sau nút Gift hoặc cuối ribbon
      const giftBtn = document.getElementById("ribbonGiftBtn");
      if (giftBtn && giftBtn.nextSibling) {
        ribbon.insertBefore(btn, giftBtn.nextSibling);
      } else {
        ribbon.appendChild(btn);
      }

      this.updateUI();
    },

    // Khởi tạo vòng lặp và hook
    init: function() {
      if (this.inited) return;
      this.loadConfig();

      // Gán vào window để app.js (mb) và các module khác truy cập trực tiếp
      window.__smartAutoSell = this;

      // Khởi tạo UI
      this.initModal();
      this.injectRibbonButton();
      this.injectInvQuickBar();

      // Hook tab switch để inject thanh Hành Trang khi người chơi bấm vào tab inv
      const navButtons = document.querySelectorAll("nav button[data-t]");
      navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.dataset.t === "inv") {
            setTimeout(() => this.injectInvQuickBar(), 50);
          }
        });
      });

      // Vòng lặp quét bảo vệ hành trang định kỳ mỗi 2 giây
      setInterval(() => {
        this.checkProactive();
        this.updateUI();
      }, 2000);

      this.inited = true;
      console.log("[SmartAutoSell] Hệ thống Bán Đồ Tự Động & Chống Đầy Túi đã kích hoạt thành công!");
    }
  };

  // Đảm bảo khởi chạy khi DOM và game sẵn sàng
  function tryBootstrap() {
    if (window.__JX && window.__JX.S) {
      SmartAutoSell.init();
    } else {
      setTimeout(tryBootstrap, 200);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryBootstrap);
  } else {
    tryBootstrap();
  }

})();
