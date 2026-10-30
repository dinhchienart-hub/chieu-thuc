/**
 * ============================================================================
 * VÕ LÂM IDLE - GÓI NÂNG CẤP TÍNH NĂNG & GIAO DIỆN CHUẨN VÕ LÂM 1
 * Tham chiếu thiết kế: Võ Lâm Truyền Kỳ 1 (Kingsoft JX Online 1 / play.htz.vn)
 * ============================================================================
 */

(function () {
  "use strict";

  console.log("[UpgradesPack] Đang khởi chạy hệ thống nâng cấp giao diện & tính năng Võ Lâm 1...");

  // ==========================================================================
  // SHARED UTILS — Xuất ra window.__vlUtils để các pack sau dùng chung
  // ==========================================================================
  function getJX() {
    return window.__JX || null;
  }

  // fmtNum chuẩn đầy đủ (có tỷ/triệu tiếng Việt) — pack này sử dụng và export
  function fmtNum(n) {
    if (n == null || isNaN(n)) return "0";
    if (n >= 1000000000) return (n / 1000000000).toFixed(1).replace(/\.0$/, "") + " tỷ";
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + " triệu";
    if (n >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return Math.round(n).toLocaleString("vi-VN");
  }

  // Xuất shared utils — pk_boss_system và features_htz_pack sử dụng window.__vlUtils
  window.__vlUtils = { getJX, fmtNum };

  // ==========================================================================
  // GÓI 1: GIAO DIỆN BÌNH CẦU SINH LỰC & NỘI LỰC CỔ ĐIỂN (CLASSIC DUAL ORB HUD)
  // ==========================================================================
  const DualOrbHud = {
    active: true,
    elContainer: null,
    elHpVal: null,
    elHpPct: null,
    elHpLiquid: null,
    elHpOrb: null,
    elMpVal: null,
    elMpPct: null,
    elMpLiquid: null,
    elMpOrb: null,
    lastUpdate: 0,

    init: function () {
      // Đọc thiết lập đã lưu
      const saved = localStorage.getItem("jx_dual_orbs_active");
      const isMobile = window.innerWidth <= 640 || window.innerHeight > window.innerWidth;
      if (saved !== null) {
        this.active = saved === "1";
      } else {
        // Trên điện thoại (màn hình dọc), mặc định tắt bình cầu nổi để tránh vướng màn hình game
        this.active = !isMobile;
      }

      this.injectMarkup();
      this.bindEvents();
      this.startLoop();
      console.log("[UpgradesPack] Gói 1: Bình Cầu Sinh Lực & Nội Lực đã kích hoạt thành công.");
    },

    injectMarkup: function () {
      const battle = document.getElementById("battle");
      if (!battle) return;

      if (document.getElementById("dualOrbContainer")) return;

      const container = document.createElement("div");
      container.id = "dualOrbContainer";
      if (!this.active) container.classList.add("orb-hidden");

      container.innerHTML = `
        <!-- Bình Cầu Sinh Lực (HP) -->
        <div class="orb-wrapper orb-hp" id="orbHp" title="Bình Cầu Sinh Lực (Nhấp hoặc nhấn Phím 1 để hồi máu)">
          <div class="orb-outer-ring">
            <div class="orb-glass">
              <div class="orb-liquid hp-liquid" id="orbHpLiquid" style="height: 100%;">
                <svg class="orb-wave" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M 0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" fill="currentColor"/>
                </svg>
                <div class="orb-liquid-body"></div>
              </div>
              <div class="orb-specular"></div>
              <div class="orb-inner-shadow"></div>
              <div class="orb-info">
                <div class="orb-title">Sinh Lực</div>
                <div class="orb-val" id="orbHpVal">0 / 0</div>
                <div class="orb-pct" id="orbHpPct">100%</div>
              </div>
            </div>
          </div>
          <div class="orb-hotkey">[ 1 ]</div>
        </div>

        <!-- Cụm chuyển đổi chế độ -->
        <div class="orb-center-toggle">
          <button id="toggleOrbHudBtn" class="orb-toggle-btn" title="Chuyển đổi giao diện Bình Cầu Cổ Điển / Thanh Ngang">
            <span class="orb-toggle-icon">☯</span>
            <span class="orb-toggle-text">Cổ Điển</span>
          </button>
          <button id="closeOrbHudBtn" class="orb-close-btn" title="Thu gọn bình cầu để không vướng màn hình">✕</button>
        </div>

        <!-- Bình Cầu Nội Lực (MP) -->
        <div class="orb-wrapper orb-mp" id="orbMp" title="Bình Cầu Nội Lực (Nhấp hoặc nhấn Phím 2 để hồi mana)">
          <div class="orb-outer-ring">
            <div class="orb-glass">
              <div class="orb-liquid mp-liquid" id="orbMpLiquid" style="height: 100%;">
                <svg class="orb-wave" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M 0 10 Q 25 20 50 10 T 100 10 V 20 H 0 Z" fill="currentColor"/>
                </svg>
                <div class="orb-liquid-body"></div>
              </div>
              <div class="orb-specular"></div>
              <div class="orb-inner-shadow"></div>
              <div class="orb-info">
                <div class="orb-title">Nội Lực</div>
                <div class="orb-val" id="orbMpVal">0 / 0</div>
                <div class="orb-pct" id="orbMpPct">100%</div>
              </div>
            </div>
          </div>
          <div class="orb-hotkey">[ 2 ]</div>
        </div>
      `;

      battle.appendChild(container);

      // Thêm nút bật tắt nhanh trên thanh header nếu chưa có
      const header = document.getElementById("top");
      if (header && !document.getElementById("headerOrbSwitch")) {
        const switchBtn = document.createElement("button");
        switchBtn.id = "headerOrbSwitch";
        switchBtn.title = "Bật/Tắt Bình Cầu Sinh Lực & Nội Lực VLTK1";
        switchBtn.textContent = "☯ Bình Cầu";
        switchBtn.onclick = () => this.toggle();
        header.appendChild(switchBtn);
      }

      // Cache DOM references
      this.elContainer = container;
      this.elHpOrb = document.getElementById("orbHp");
      this.elHpVal = document.getElementById("orbHpVal");
      this.elHpPct = document.getElementById("orbHpPct");
      this.elHpLiquid = document.getElementById("orbHpLiquid");

      this.elMpOrb = document.getElementById("orbMp");
      this.elMpVal = document.getElementById("orbMpVal");
      this.elMpPct = document.getElementById("orbMpPct");
      this.elMpLiquid = document.getElementById("orbMpLiquid");
    },

    bindEvents: function () {
      // Nhấp bình máu -> Dùng thuốc máu (phím 1)
      if (this.elHpOrb) {
        this.elHpOrb.onclick = (e) => {
          e.stopPropagation();
          const bHp = document.getElementById("bHp");
          if (bHp) bHp.click();
        };
      }

      // Nhấp bình mana -> Dùng thuốc mana (phím 2)
      if (this.elMpOrb) {
        this.elMpOrb.onclick = (e) => {
          e.stopPropagation();
          const bMp = document.getElementById("bMp");
          if (bMp) bMp.click();
        };
      }

      // Nút chuyển đổi
      const toggleBtn = document.getElementById("toggleOrbHudBtn");
      if (toggleBtn) {
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          this.toggle();
        };
      }

      // Nút đóng nhanh bình cầu
      const closeBtn = document.getElementById("closeOrbHudBtn");
      if (closeBtn) {
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          this.toggle();
        };
      }
    },

    toggle: function () {
      this.active = !this.active;
      localStorage.setItem("jx_dual_orbs_active", this.active ? "1" : "0");
      if (this.elContainer) {
        this.elContainer.classList.toggle("orb-hidden", !this.active);
      }
      const switchBtn = document.getElementById("headerOrbSwitch");
      if (switchBtn) {
        switchBtn.style.color = this.active ? "#fef08a" : "#71717a";
      }
      if (window.$) {
        window.$(`Chế độ Bình Cầu Cổ Điển: ${this.active ? "BẬT" : "TẮT"}`);
      }
    },

    update: function () {
      if (document.hidden) return;
      if (!this.active && this.elContainer && this.elContainer.classList.contains("orb-hidden")) {
        return;
      }

      const JX = getJX();
      if (!JX || !JX.R) return;

      const h = JX.R;
      const P = h.P || {};

      const curHp = Math.max(0, Math.round(h.life || 0));
      const maxHp = Math.max(1, Math.round(P.life || 1));
      const hpPct = Math.min(100, Math.max(0, (curHp / maxHp) * 100));

      const curMp = Math.max(0, Math.round(h.mana || 0));
      const maxMp = Math.max(1, Math.round(P.mana || 1));
      const mpPct = Math.min(100, Math.max(0, (curMp / maxMp) * 100));

      // Dirty check: Bỏ qua DOM updates nếu máu và mana không đổi
      if (curHp === this._lastHp && maxHp === this._lastMaxHp && curMp === this._lastMp && maxMp === this._lastMaxMp) {
        return;
      }
      this._lastHp = curHp;
      this._lastMaxHp = maxHp;
      this._lastMp = curMp;
      this._lastMaxMp = maxMp;

      // Cập nhật Bình Sinh Lực
      if (this.elHpLiquid) {
        this.elHpLiquid.style.height = `${hpPct.toFixed(1)}%`;
      }
      if (this.elHpVal) {
        this.elHpVal.textContent = `${fmtNum(curHp)}/${fmtNum(maxHp)}`;
        this.elHpVal.title = `${curHp.toLocaleString()} / ${maxHp.toLocaleString()}`;
      }
      if (this.elHpPct) {
        this.elHpPct.textContent = `${Math.round(hpPct)}%`;
      }

      // Cảnh báo máu thấp (< 30%)
      if (this.elHpOrb) {
        this.elHpOrb.classList.toggle("orb-danger", hpPct < 30);
      }

      // Cập nhật Bình Nội Lực
      if (this.elMpLiquid) {
        this.elMpLiquid.style.height = `${mpPct.toFixed(1)}%`;
      }
      if (this.elMpVal) {
        this.elMpVal.textContent = `${fmtNum(curMp)}/${fmtNum(maxMp)}`;
        this.elMpVal.title = `${curMp.toLocaleString()} / ${maxMp.toLocaleString()}`;
      }
      if (this.elMpPct) {
        this.elMpPct.textContent = `${Math.round(mpPct)}%`;
      }
    },

    startLoop: function () {
      const raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 50); };
      const tick = () => {
        this.update();
        raf(tick);
      };
      raf(tick);
    }
  };

  // ==========================================================================
  // GÓI 2: PHÂN KÊNH NHẬT KÝ GIANG HỒ (MULTI-CHANNEL LOG & CHAT SYSTEM)
  // ==========================================================================
  const MultiChannelLog = {
    currentChannel: "all",
    searchText: "",
    autoScroll: true,
    audioLoaded: false,
    audioEl: null,
    observer: null,
    lastSeenCount: 0,

    init: function () {
      this.injectMarkup();
      this.bindEvents();
      this.initObserver();
      this.initAudio();
      console.log("[UpgradesPack] Gói 2: Phân Kênh Nhật Ký Giang Hồ đã kích hoạt thành công.");
    },

    initAudio: function () {
      try {
        this.audioEl = new Audio("snd/sound_i001.mp3");
        this.audioEl.volume = 0.4;
        this.audioLoaded = true;
      } catch (e) {
        // Trình duyệt không hỗ trợ audio
      }
    },

    playLootSound: function () {
      if (!this.audioLoaded || !this.audioEl) return;
      try {
        const sound = this.audioEl.cloneNode();
        sound.volume = 0.4;
        sound.play().catch(() => { });
      } catch (e) { }
    },

    injectMarkup: function () {
      const tLog = document.getElementById("t-log");
      if (!tLog) return;

      if (document.getElementById("logChannelBar")) return;

      const bar = document.createElement("div");
      bar.id = "logChannelBar";
      bar.innerHTML = `
        <div class="log-tabs">
          <button class="log-tab-btn active" data-ch="all">
            <span>📜 Tất Cả</span>
            <span class="lt-badge" id="badgeAll">0</span>
          </button>
          <button class="log-tab-btn" data-ch="loot">
            <span class="badge-loot">🎁 Bảo Vật</span>
            <span class="lt-badge badge-loot" id="badgeLoot">0</span>
          </button>
          <button class="log-tab-btn" data-ch="combat">
            <span class="badge-combat">⚔️ Chiến Sự</span>
            <span class="lt-badge badge-combat" id="badgeCombat">0</span>
          </button>
          <button class="log-tab-btn" data-ch="system">
            <span class="badge-system">⚙️ Hệ Thống</span>
            <span class="lt-badge badge-system" id="badgeSystem">0</span>
          </button>
        </div>
        <div class="log-tools">
          <div class="log-search-wrap">
            <input type="text" id="logSearchInput" placeholder="🔍 Lọc từ khóa..." />
            <button id="logSearchClear" class="log-clear-btn" title="Xóa từ khóa">✕</button>
          </div>
          <button id="logScrollBtn" class="log-tool-btn on" title="Tự động cuộn xuống dòng mới nhất">
            <span>⬇ Cuộn</span>
          </button>
          <button id="logClearBtn" class="log-tool-btn" title="Làm sạch hiển thị nhật ký">
            <span>🧹 Xóa</span>
          </button>
        </div>
      `;

      // Đặt thanh phân kênh ngay trước logBox hoặc sau farmSpeedometer
      const logBox = document.getElementById("logBox");
      if (logBox) {
        logBox.insertAdjacentElement("beforebegin", bar);
      } else {
        tLog.appendChild(bar);
      }
    },

    bindEvents: function () {
      // Bắt sự kiện chuyển Tab kênh
      const tabBtns = document.querySelectorAll("#logChannelBar .log-tab-btn");
      tabBtns.forEach(btn => {
        btn.onclick = () => {
          tabBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.setChannel(btn.dataset.ch);
        };
      });

      // Tìm kiếm lọc text
      const searchInput = document.getElementById("logSearchInput");
      const clearBtn = document.getElementById("logSearchClear");
      if (searchInput) {
        searchInput.oninput = (e) => {
          this.searchText = (e.target.value || "").trim().toLowerCase();
          this.applyFilters();
        };
      }
      if (clearBtn && searchInput) {
        clearBtn.onclick = () => {
          searchInput.value = "";
          this.searchText = "";
          this.applyFilters();
        };
      }

      // Nút khóa/mở cuộn tự động
      const scrollBtn = document.getElementById("logScrollBtn");
      if (scrollBtn) {
        scrollBtn.onclick = () => {
          this.autoScroll = !this.autoScroll;
          scrollBtn.classList.toggle("on", this.autoScroll);
          scrollBtn.innerHTML = this.autoScroll ? "<span>⬇ Cuộn</span>" : "<span>⏸ Khóa</span>";
        };
      }

      // Nút xóa log
      const clearLogBtn = document.getElementById("logClearBtn");
      if (clearLogBtn) {
        clearLogBtn.onclick = () => {
          const logBox = document.getElementById("logBox");
          if (logBox) logBox.innerHTML = "";
          const JX = getJX();
          if (JX && JX.R && Array.isArray(JX.R.logs)) {
            JX.R.logs.length = 0;
          }
          this.updateBadges(0, 0, 0, 0);
        };
      }
    },

    setChannel: function (channel) {
      this.currentChannel = channel || "all";
      const logBox = document.getElementById("logBox");
      if (!logBox) return;

      logBox.classList.remove("channel-loot", "channel-combat", "channel-system");
      if (this.currentChannel !== "all") {
        logBox.classList.add(`channel-${this.currentChannel}`);
      }

      this.applyFilters();
      if (this.autoScroll) this.scrollToBottom();
    },

    initObserver: function () {
      const logBox = document.getElementById("logBox");
      if (!logBox) return;

      const LOOT_REG = /nhặt|rơi|rương|huyền tinh|knb|lượng|bạc|kim nguyên bảo|hoàng kim|bạch kim|định quốc|an bang|trang bị|vũ khí|phi đao|ngân châm|bí kíp|đan|thú cưỡi|phi phong/i;
      const RARE_REG = /hoàng kim|bạch kim|huyền tinh cấp [5-9]|định quốc|an bang|bảo đao|thần kiếm/i;
      const COMBAT_REG = /hạ gục|tiêu diệt|boss|lôi đài|tỷ võ|trảm|sát thương|khiêu chiến|đấu trường|tử trận|chiến thắng|thất bại|bất tỉnh|phục sinh|vong mạng|vạn độc|hỏa kỳ lân/i;
      const BOSS_REG = /boss|triệu hồi|đại cao thủ|độc cô cầu bại|hỏa kỳ lân|thần ma/i;
      const SYS_REG = /lên cấp|tiềm năng|kỹ năng|hệ thống|đồng bộ|ủy thác|lưu file|kỳ trân các|võ lâm idle|rời mạng|quỹ giờ/i;

      const processLines = () => {
        const divs = logBox.querySelectorAll("div");
        let totalCount = divs.length;
        let lootCount = 0;
        let combatCount = 0;
        let sysCount = 0;
        let hasNewRare = false;

        for (let i = 0; i < divs.length; i++) {
          const div = divs[i];
          const text = (div.textContent || "").toLowerCase();

          // Phân loại nếu chưa được gắn class
          if (!div.dataset.classified) {
            div.dataset.classified = "1";

            const isLoot = LOOT_REG.test(text);
            const isCombat = COMBAT_REG.test(text);
            const isSys = SYS_REG.test(text);

            if (isLoot) {
              div.classList.add("log-item-loot");
              if (RARE_REG.test(text)) {
                div.classList.add("log-item-rare");
                hasNewRare = true;
              }
            } else if (isCombat) {
              div.classList.add("log-item-combat");
              if (BOSS_REG.test(text)) div.classList.add("log-item-boss");
            } else if (isSys) {
              div.classList.add("log-item-system");
            } else {
              // Mặc định cho các dòng hội thoại hoặc chiến đấu chung
              div.classList.add("log-item-combat");
            }
          }

          if (div.classList.contains("log-item-loot")) lootCount++;
          if (div.classList.contains("log-item-combat")) combatCount++;
          if (div.classList.contains("log-item-system")) sysCount++;

          // Lọc tìm kiếm
          if (this.searchText) {
            const matchesSearch = text.includes(this.searchText);
            div.classList.toggle("log-item-hidden", !matchesSearch);
          } else {
            div.classList.remove("log-item-hidden");
          }
        }

        // Phát âm thanh nếu có đồ quý mới xuất hiện
        if (hasNewRare && divs.length > this.lastSeenCount) {
          this.playLootSound();
        }
        this.lastSeenCount = divs.length;

        // Cập nhật số đếm trên badge
        this.updateBadges(totalCount, lootCount, combatCount, sysCount);

        // Cuộn xuống dòng cuối nếu bật auto-scroll
        if (this.autoScroll) {
          this.scrollToBottom();
        }
      };

      // Chạy lần đầu
      processLines();

      // Quan sát DOM thay đổi của logBox
      this.observer = new MutationObserver(() => {
        processLines();
      });

      this._observedNode = logBox;
      this.observer.observe(logBox, { childList: true });

      // Định kỳ đồng bộ lại đề phòng log bị ghi đè
      setInterval(() => {
        if (!document.getElementById("logChannelBar")) {
          this.injectMarkup();
          this.bindEvents();
        }
        // Nếu logBox bị morphdom thay thế (node mới), gắn lại observer vào node mới
        const currentLogBox = document.getElementById("logBox");
        if (currentLogBox && this.observer && currentLogBox !== this._observedNode) {
          this.observer.disconnect();
          this._observedNode = currentLogBox;
          this.observer.observe(currentLogBox, { childList: true });
        }
      }, 3000);
    },

    updateBadges: function (all, loot, combat, sys) {
      const bAll = document.getElementById("badgeAll");
      const bLoot = document.getElementById("badgeLoot");
      const bCombat = document.getElementById("badgeCombat");
      const bSys = document.getElementById("badgeSystem");

      if (bAll) bAll.textContent = String(all > 999 ? "999+" : all);
      if (bLoot) bLoot.textContent = String(loot > 999 ? "999+" : loot);
      if (bCombat) bCombat.textContent = String(combat > 999 ? "999+" : combat);
      if (bSys) bSys.textContent = String(sys > 999 ? "999+" : sys);
    },

    applyFilters: function () {
      const logBox = document.getElementById("logBox");
      if (!logBox) return;

      const divs = logBox.querySelectorAll("div");
      for (const div of divs) {
        if (!this.searchText) {
          div.classList.remove("log-item-hidden");
        } else {
          const text = (div.textContent || "").toLowerCase();
          div.classList.toggle("log-item-hidden", !text.includes(this.searchText));
        }
      }
    },

    scrollToBottom: function () {
      const logBox = document.getElementById("logBox");
      if (logBox) {
        logBox.scrollTop = logBox.scrollHeight;
      }
    }
  };

  // ==========================================================================
  // GÓI 3: TIỂU BẢN ĐỒ RADAR (MINI-MAP HUD TRÊN SÂN ĐẤU)
  // ==========================================================================
  const MiniMapRadar = {
    visible: false,
    zoomLevel: 1, // 1: 500px range, 2: 900px range
    canvas: null,
    ctx: null,
    elHud: null,
    elCollapsedBtn: null,
    elCoords: null,
    elStage: null,
    elEnemyCount: null,
    lastDrawTime: 0,

    init: function () {
      // Đã tắt bỏ hoàn toàn thanh radar mini theo yêu cầu (đã có bản đồ, tránh dư thừa)
      this.visible = false;
      const hud = document.getElementById("miniMapHud");
      if (hud) hud.remove();
      const btn = document.getElementById("mmCollapsedBtn");
      if (btn) btn.remove();
      return;
    },

    injectMarkup: function () {
      const hud = document.getElementById("miniMapHud");
      if (hud) hud.remove();
      const btn = document.getElementById("mmCollapsedBtn");
      if (btn) btn.remove();
      return;
    },

    bindEvents: function () { },
    setVisible: function () { this.visible = false; },
    render: function () { },
    startLoop: function () { }
  };

  // ==========================================================================
  // GÓI 4: GIAO DIỆN BẢNG NHÂN VẬT F3 CHUẨN CỔ ĐIỂN (CLASSIC F3 PANEL)
  // ==========================================================================
  const ClassicF3Panel = {
    observer: null,

    init: function () {
      this.initObserver();
      this.enhanceF3();
      console.log("[UpgradesPack] Gói 4: Bảng Nhân Vật F3 Chuẩn Cổ Điển đã kích hoạt thành công.");
    },

    enhanceF3: function () {
      const tChar = document.getElementById("t-char");
      if (!tChar) return;

      const u2char = tChar.querySelector(".u2char");
      if (!u2char) return;

      // 1. Chèn Biểu ngữ F3 Cổ Điển nếu chưa có
      if (!u2char.querySelector(".f3-header-banner")) {
        const banner = document.createElement("div");
        banner.className = "f3-header-banner";
        banner.innerHTML = `<span class="f3-banner-title">❖ BẢNG THUỘC TÍNH NHÂN VẬT · F3 ❖</span>`;
        u2char.insertAdjacentElement("afterbegin", banner);
      }

      // 2. Nâng cấp 5 dòng kháng ngũ hành (.c2r)
      const resElements = u2char.querySelectorAll(".c2r");
      const elemIcons = {
        "Vật lý": "⚔️",
        "Độc sát": "🧪",
        "Băng sát": "❄️",
        "Hỏa sát": "🔥",
        "Lôi sát": "⚡"
      };

      resElements.forEach(r => {
        const iTag = r.querySelector("i");
        const bTag = r.querySelector("b");
        if (!iTag || !bTag) return;

        const resTxt = iTag.textContent.trim();
        const icon = elemIcons[resTxt];
        if (icon && !iTag.dataset.hasIcon) {
          iTag.dataset.hasIcon = "1";
          iTag.innerHTML = `<span>${icon}</span> ${resTxt}`;
        }

        const val = parseInt(bTag.textContent, 10) || 0;

        // Gắn thanh đo phần trăm kháng (tối đa 75%)
        let meter = r.querySelector(".res-meter-bar");
        if (!meter) {
          meter = document.createElement("div");
          meter.className = "res-meter-bar";
          r.appendChild(meter);
        }
        const pct = Math.min(100, Math.max(0, (val / 75) * 100));
        meter.style.width = `${pct}%`;

        // Nếu đạt mức kháng tối đa 75%+
        r.classList.toggle("res-max", val >= 75);
      });

      // 3. Hiệu ứng nhấp nháy điểm tiềm năng chưa cộng (#bTTa)
      const JX = getJX();
      const l = JX ? JX.S : window.l;
      const bTTa = document.getElementById("bTTa");
      if (bTTa && l) {
        bTTa.classList.toggle("has-points-glow", (l.attrPts || 0) > 0);
      }
    },

    initObserver: function () {
      const tChar = document.getElementById("t-char");
      if (!tChar) return;

      this.observer = new MutationObserver(() => {
        this.enhanceF3();
      });

      this.observer.observe(tChar, { childList: true, subtree: true });

      // Bắt sự kiện khi người chơi chuyển sang tab Nhân vật
      const charTabBtn = document.querySelector('button[data-t="char"]');
      if (charTabBtn) {
        charTabBtn.addEventListener("click", () => {
          setTimeout(() => this.enhanceF3(), 150); // 150ms: đủ morphdom render xong
        });
      }
    }
  };

  // ==========================================================================
  // GÓI 5: TÍNH NĂNG TỰ MẶC ĐỒ & THAY THẾ ĐỒ TỐT HƠN (SMART AUTO EQUIP)
  // ==========================================================================
  const SmartAutoEquip = {
    observer: null,
    intervalId: null,

    init: function () {
      this.initObserver();
      this.startLoop();
      console.log("[UpgradesPack] Gói 5: Tự Mặc Đồ & Thay Đồ Tốt Hơn đã kích hoạt thành công.");
    },

    // Quét hành trang tìm trang bị tốt hơn đồ đang mặc
    findBetterGear: function () {
      const JX = getJX();
      if (!JX || !JX.S) return [];
      const l = JX.S;
      if (!l || !l.inv || !l.eq) return [];

      const inv = l.inv || [];
      const betterList = [];

      for (let i = 0; i < inv.length; i++) {
        const item = inv[i];
        if (!item || item.pack || item.ktc) continue;

        // 1. Kiểm tra đủ điều kiện mặc (cấp, điểm thuộc tính, giới tính)
        if (typeof window.e1 === "function" && !window.e1(item)) continue;

        // 2. Kiểm tra vũ khí có phù hợp với môn phái
        if (typeof window.B1 !== "undefined" && window.B1[item.d] === "weapon") {
          const fac = JX.factions ? JX.factions[l.fac] : (window.D ? window.D[l.fac] : null);
          if (fac && typeof window.Gn === "function" && !window.Gn(item)) continue;
        }

        // 3. Đánh giá độ mạnh bằng hàm V2 hoặc kl của game
        let isBetter = false;
        if (typeof window.V2 === "function") {
          isBetter = window.V2(item);
        }
        if (!isBetter && typeof window.kl === "function") {
          const powerDiff = window.kl(item);
          isBetter = powerDiff > 0.005;
        }

        // 4. So sánh phẩm chất và chỉ số cơ bản nếu không có V2/kl
        if (!isBetter && typeof window.mn === "function") {
          const slot = window.mn(item);
          const cur = l.eq[slot];
          if (!cur) {
            isBetter = true;
          } else {
            const curLvl = cur.lvl || 0;
            const itemLvl = item.lvl || 0;
            const curR = cur.r || 0;
            const itemR = item.r || 0;
            if (item.set && !cur.set) isBetter = true;
            else if (item.vio && !cur.vio && !cur.set) isBetter = true;
            else if (itemR > curR && itemLvl >= curLvl) isBetter = true;
            else if (itemLvl > curLvl && itemR >= curR) isBetter = true;
          }
        }

        if (isBetter) {
          betterList.push(item);
        }
      }

      return betterList;
    },

    // Thực hiện tự động mặc tất cả đồ tốt hơn
    equipAllBetter: function (notify = true) {
      const JX = getJX();
      if (!JX || !JX.S) return 0;
      const l = JX.S;

      let equippedCount = 0;

      // Ưu tiên dùng hàm Wt của game
      if (typeof window.Wt === "function") {
        const prevAuto = l.autoEquip;
        l.autoEquip = true;
        equippedCount = window.Wt();
        l.autoEquip = prevAuto;
      }

      // Nếu Wt chưa trang bị hết hoặc game không có Wt, tự thay thế an toàn
      if (equippedCount === 0) {
        const betterList = this.findBetterGear();
        for (const item of betterList) {
          if (typeof window.xt === "function") {
            window.xt(item, true);
            equippedCount++;
          } else if (typeof window.mn === "function") {
            const slot = window.mn(item);
            const old = l.eq[slot];
            l.inv = l.inv.filter(x => x !== item);
            if (old) l.inv.unshift(old);
            l.eq[slot] = item;
            equippedCount++;
          }
        }
      }

      if (equippedCount > 0) {
        const h = JX.R || window.h;
        if (h) h.dirty = true;
        if (typeof window._0 === "function") window._0();
        if (typeof window.S === "function") window.S();
        if (typeof window.J === "function") window.J();
        if (typeof window.Z1 === "function") window.Z1();

        const msg = `⚡ Đã tự động thay thế ${equippedCount} món đồ tốt hơn!`;
        if (window.$) window.$(msg);
        if (window.N) window.N(`<b class="up">${msg}</b>`);
      } else if (notify) {
        if (window.$) window.$("Trang bị hiện tại đang là tốt nhất!");
      }

      this.updateUI();
      return equippedCount;
    },

    // Cập nhật giao diện thanh Tự mặc đồ
    updateUI: function () {
      const JX = getJX();
      if (!JX || !JX.S) return;
      const l = JX.S;

      const betterItems = this.findBetterGear();
      const count = betterItems.length;

      const bars = document.querySelectorAll(".smart-equip-bar");
      bars.forEach(bar => {
        const chk = bar.querySelector(".chk-auto-equip");
        if (chk) chk.checked = !!l.autoEquip;

        const badge = bar.querySelector(".eq-badge");
        if (badge) {
          if (count > 0) {
            badge.textContent = `${count}`;
            badge.classList.remove("hidden");
          } else {
            badge.classList.add("hidden");
          }
        }

        const btn = bar.querySelector(".btn-smart-equip");
        if (btn) {
          btn.classList.toggle("has-better-glow", count > 0);
          btn.title = count > 0 ? `Có ${count} món mạnh hơn trong túi! Bấm để tự động thay` : "Mặc đồ tốt nhất";
        }
      });
    },

    // Bơm thanh điều khiển vào Hành trang (#t-inv) và Nhân vật (#t-char)
    injectUI: function () {
      const JX = getJX();
      const l = JX ? JX.S : window.l;
      if (!l) return;

      const createBarHtml = () => `
        <div class="smart-equip-bar">
          <button class="btn-smart-equip" title="So sánh và tự động mặc các trang bị mạnh nhất trong túi">
            <span class="eq-icon">⚡</span>
            <span class="eq-label">Mặc Đồ Tốt Nhất</span>
            <span class="eq-badge hidden">0</span>
          </button>
          <label class="auto-equip-toggle-label" title="Tự động kiểm tra và thay đồ mạnh hơn khi nhặt được">
            <input type="checkbox" class="chk-auto-equip" ${l.autoEquip ? "checked" : ""}>
            <span>Tự thay đồ tốt hơn</span>
          </label>
        </div>
      `;

      // 1. Thẻ Hành Trang (#t-inv)
      const tInv = document.getElementById("t-inv");
      if (tInv && !tInv.querySelector(".smart-equip-bar")) {
        const barWrap = document.createElement("div");
        barWrap.innerHTML = createBarHtml();
        const bar = barWrap.firstElementChild;
        tInv.insertAdjacentElement("afterbegin", bar);
        this.bindBarEvents(bar);
      }

      // 2. Thẻ Nhân Vật (#t-char)
      const tChar = document.getElementById("t-char");
      if (tChar && !tChar.querySelector(".smart-equip-bar")) {
        const banner = tChar.querySelector(".f3-header-banner");
        const barWrap = document.createElement("div");
        barWrap.innerHTML = createBarHtml();
        const bar = barWrap.firstElementChild;
        if (banner) {
          banner.insertAdjacentElement("afterend", bar);
        } else {
          tChar.insertAdjacentElement("afterbegin", bar);
        }
        this.bindBarEvents(bar);
      }

      this.updateUI();
    },

    bindBarEvents: function (bar) {
      const btn = bar.querySelector(".btn-smart-equip");
      const chk = bar.querySelector(".chk-auto-equip");

      if (btn) {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.equipAllBetter(true);
        };
      }

      if (chk) {
        chk.onchange = (e) => {
          const JX = getJX();
          const l = JX ? JX.S : window.l;
          if (l) {
            l.autoEquip = e.target.checked;
            if (typeof window.S === "function") window.S();
            if (window.$) window.$(`Tự động thay đồ tốt hơn: ${l.autoEquip ? "BẬT" : "TẮT"}`);
            document.querySelectorAll(".chk-auto-equip").forEach(c => {
              c.checked = !!l.autoEquip;
            });
            if (l.autoEquip) {
              this.equipAllBetter(false);
            }
          }
        };
      }
    },

    initObserver: function () {
      const observeTab = (tabId) => {
        const tab = document.getElementById(tabId);
        if (!tab) return;
        const obs = new MutationObserver(() => {
          if (!tab.querySelector(".smart-equip-bar")) {
            this.injectUI();
          }
        });
        obs.observe(tab, { childList: true });
      };

      observeTab("t-inv");
      observeTab("t-char");

      document.querySelectorAll('#tabs button[data-t="inv"], #tabs button[data-t="char"]').forEach(btn => {
        btn.addEventListener("click", () => {
          setTimeout(() => this.injectUI(), 150); // 150ms để đợi morphdom
        });
      });
    },

    startLoop: function () {
      // Tự động kiểm tra thay đồ định kỳ nếu người chơi bật autoEquip
      this.intervalId = setInterval(() => {
        const JX = getJX();
        const l = JX ? JX.S : window.l;
        if (l && l.autoEquip) {
          const better = this.findBetterGear();
          if (better.length > 0) {
            this.equipAllBetter(false);
          }
        }
        this.updateUI();
      }, 3500);
    }
  };

  // ==========================================================================
  // GÓI 6: GỢI Ý CỘNG TIỀM NĂNG & KỸ NĂNG 2 NHÁNH (NỘI CÔNG / NGOẠI CÔNG)
  // ==========================================================================
  const BranchAdvisor = {
    currentSkillFilter: "all", // 'all' | 'phys' | 'mag'
    observer: null,

    // Cấu hình chuẩn phân nhánh cho 10 môn phái Võ Lâm Truyền Kỳ 1
    FACTIONS: {
      shaolin: {
        name: "Thiếu Lâm",
        phys: {
          title: "Đao / Côn Ngoại Công",
          sub: "Sức Mạnh (60%) + Thân Pháp (20%) + Sinh Khí (20%)",
          ratio: { str: 0.60, dex: 0.20, vit: 0.20, eng: 0 },
          skills: [4, 6, 10, 11, 14, 15, 19, 20, 271, 318, 319]
        },
        mag: {
          title: "Quyền Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [8, 10, 11, 14, 16, 21, 273, 321]
        }
      },
      tianwang: {
        name: "Thiên Vương",
        phys: {
          title: "Thương / Chùy / Đao Ngoại Công",
          sub: "Sức Mạnh (65%) + Thân Pháp (20%) + Sinh Khí (15%)",
          ratio: { str: 0.65, dex: 0.20, vit: 0.15, eng: 0 },
          skills: [23, 24, 26, 29, 30, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42, 322, 323, 324, 325]
        },
        mag: {
          title: "Thiên Vương Tăng Sinh Khí",
          sub: "Sức Mạnh (50%) + Sinh Khí (35%) + Thân Pháp (15%)",
          ratio: { str: 0.50, dex: 0.15, vit: 0.35, eng: 0 },
          skills: [23, 24, 26, 30, 31, 32, 40, 41, 322, 324]
        }
      },
      tangmen: {
        name: "Đường Môn",
        phys: {
          title: "Nỏ / Phi Đao / Phi Tiêu Ngoại Công",
          sub: "Thân Pháp (60%) + Sức Mạnh (25%) + Sinh Khí (15%)",
          ratio: { str: 0.25, dex: 0.60, vit: 0.15, eng: 0 },
          skills: [43, 45, 47, 50, 54, 343, 345, 347, 349]
        },
        mag: {
          title: "Bẫy / Hãm Tịnh Nội Lực",
          sub: "Sinh Khí (50%) + Nội Lực (30%) + Thân Pháp (20%)",
          ratio: { str: 0, dex: 0.20, vit: 0.50, eng: 0.30 },
          skills: [48, 58, 249, 302, 303, 339, 341, 342, 351]
        }
      },
      wudu: {
        name: "Ngũ Độc",
        phys: {
          title: "Ngũ Độc Đao Ngoại Công",
          sub: "Sức Mạnh (55%) + Thân Pháp (25%) + Sinh Khí (20%)",
          ratio: { str: 0.55, dex: 0.25, vit: 0.20, eng: 0 },
          skills: [62, 64, 65, 68, 71, 353, 390]
        },
        mag: {
          title: "Ngũ Độc Chưởng / Bùa Nội Công",
          sub: "Nội Công (60%) + Sinh Khí (35%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [60, 63, 66, 67, 69, 70, 72, 73, 74, 75, 355, 356, 384]
        }
      },
      emei: {
        name: "Nga My",
        phys: {
          title: "Nga My Kiếm Ngoại Công",
          sub: "Sức Mạnh (55%) + Thân Pháp (25%) + Sinh Khí (20%)",
          ratio: { str: 0.55, dex: 0.25, vit: 0.20, eng: 0 },
          skills: [77, 79, 82, 85, 91, 380, 385]
        },
        mag: {
          title: "Nga My Chưởng / Khí Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [77, 80, 86, 88, 89, 92, 93, 252, 282, 328, 332]
        }
      },
      cuiyan: {
        name: "Thúy Yên",
        phys: {
          title: "Thúy Yên Đao Ngoại Công",
          sub: "Sức Mạnh (55%) + Thân Pháp (25%) + Sinh Khí (20%)",
          ratio: { str: 0.55, dex: 0.25, vit: 0.20, eng: 0 },
          skills: [97, 100, 105, 108, 109, 114, 336]
        },
        mag: {
          title: "Thúy Yên Kiếm Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [95, 99, 100, 102, 111, 113, 114, 269, 337]
        }
      },
      gaibang: {
        name: "Cái Bang",
        phys: {
          title: "Cái Bang Bổng Ngoại Công",
          sub: "Sức Mạnh (60%) + Thân Pháp (20%) + Sinh Khí (20%)",
          ratio: { str: 0.60, dex: 0.20, vit: 0.20, eng: 0 },
          skills: [115, 119, 124, 125, 129, 130, 277, 359, 360]
        },
        mag: {
          title: "Cái Bang Chưởng (Rồng) Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [116, 122, 128, 129, 130, 274, 277, 357, 360]
        }
      },
      tianren: {
        name: "Thiên Nhẫn",
        phys: {
          title: "Thiên Nhẫn Kích Ngoại Công",
          sub: "Sức Mạnh (60%) + Thân Pháp (20%) + Sinh Khí (20%)",
          ratio: { str: 0.60, dex: 0.20, vit: 0.20, eng: 0 },
          skills: [132, 137, 140, 142, 143, 150, 361]
        },
        mag: {
          title: "Thiên Nhẫn Đao (Ma Nhẫn) Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [131, 135, 136, 138, 141, 145, 148, 150, 362, 364, 391]
        }
      },
      wudang: {
        name: "Võ Đang",
        phys: {
          title: "Võ Đang Kiếm Ngoại Công",
          sub: "Sức Mạnh (55%) + Thân Pháp (25%) + Sinh Khí (20%)",
          ratio: { str: 0.55, dex: 0.25, vit: 0.20, eng: 0 },
          skills: [151, 155, 157, 158, 159, 160, 166, 267, 368]
        },
        mag: {
          title: "Võ Đang Khí (Quyền) Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [152, 153, 157, 159, 160, 164, 165, 166, 365]
        }
      },
      kunlun: {
        name: "Côn Lôn",
        phys: {
          title: "Côn Lôn Đao Ngoại Công",
          sub: "Sức Mạnh (55%) + Thân Pháp (25%) + Sinh Khí (20%)",
          ratio: { str: 0.55, dex: 0.25, vit: 0.20, eng: 0 },
          skills: [167, 171, 173, 175, 176, 275, 372, 630]
        },
        mag: {
          title: "Côn Lôn Kiếm Nội Công",
          sub: "Nội Công (65%) + Sinh Khí (30%) + Thân Pháp (5%)",
          ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 },
          skills: [168, 169, 171, 172, 173, 174, 178, 179, 181, 182, 275, 375, 392, 393, 394, 630]
        }
      }
    },

    init: function () {
      this.initObserver();
      this.injectAttrUI();
      this.injectSkillUI();
      console.log("[UpgradesPack] Gói 6: Gợi Ý Tiềm Năng & Kỹ Năng 2 Nhánh đã kích hoạt thành công.");
    },

    // 1. Phân bổ điểm tiềm năng theo nhánh
    applyAttrBranch: function (branchType) {
      const JX = getJX();
      const l = JX ? JX.S : window.l;
      const h = JX ? JX.R : window.h;
      if (!l) return;

      const total = l.attrPts || 0;
      if (total <= 0) {
        if (window.$) window.$("Không có điểm tiềm năng chưa cộng. Hãy dùng Tẩy Tủy nếu muốn phân phối lại!");
        return;
      }

      const facConfig = this.FACTIONS[l.fac] || {
        phys: { title: "Ngoại Công", ratio: { str: 0.60, dex: 0.20, vit: 0.20, eng: 0 } },
        mag: { title: "Nội Công", ratio: { str: 0, dex: 0.05, vit: 0.35, eng: 0.60 } }
      };

      const branch = facConfig[branchType];
      if (!branch) return;

      let addStr = 0, addDex = 0, addVit = 0, addEng = 0;

      if (branchType === "phys") {
        addStr = Math.round(total * branch.ratio.str);
        addDex = Math.round(total * branch.ratio.dex);
        addVit = total - addStr - addDex;
        addEng = 0;
      } else {
        addEng = Math.round(total * branch.ratio.eng);
        addVit = Math.round(total * branch.ratio.vit);
        addDex = total - addEng - addVit;
        addStr = 0;
      }

      l.attr.str = (l.attr.str || 0) + addStr;
      l.attr.dex = (l.attr.dex || 0) + addDex;
      l.attr.vit = (l.attr.vit || 0) + addVit;
      l.attr.eng = (l.attr.eng || 0) + addEng;
      l.attrPts = 0;

      if (h) h.dirty = true;
      if (typeof window._0 === "function") window._0();
      if (typeof window.F5 === "function") window.F5();
      if (typeof window.Z1 === "function") window.Z1();
      if (typeof window.S === "function") window.S();
      if (typeof window.J === "function") window.J();

      const branchName = branchType === "phys" ? "Ngoại Công" : "Nội Công";
      const detailStr = branchType === "phys"
        ? `+${addStr} Sức Mạnh, +${addDex} Thân Pháp, +${addVit} Sinh Khí`
        : `+${addEng} Nội Công, +${addVit} Sinh Khí, +${addDex} Thân Pháp`;

      const msg = `⚔️ Gợi ý [${branchName}]: Đã phân bổ ${total} điểm (${detailStr})!`;
      if (window.$) window.$(msg);
      if (window.N) window.N(`<b class="up">${msg}</b>`);
      if (typeof window.d0 === "function") window.d0("levelup");
    },

    // 2. Gợi ý cộng điểm kỹ năng theo nhánh
    applySkillBranch: function (branchType) {
      const JX = getJX();
      const l = JX ? JX.S : window.l;
      if (!l) return;

      if (!l.skPts || l.skPts <= 0) {
        if (window.$) window.$("Không có điểm kỹ năng chưa cộng!");
        return;
      }

      const facConfig = this.FACTIONS[l.fac];
      if (!facConfig) {
        if (window.$) window.$("Chưa gia nhập môn phái để phân nhánh kỹ năng!");
        return;
      }

      const branch = facConfig[branchType];
      if (!branch) return;

      let added = 0;
      const maxPass = 80;
      let pass = 0;

      // Cộng lần lượt từng điểm vào các chiêu thuộc nhánh
      while (l.skPts > 0 && pass < maxPass) {
        pass++;
        let anyAdded = false;
        for (const sid of branch.skills) {
          if (l.skPts <= 0) break;
          const btn = document.querySelector(`#t-skill .plus[data-id="${sid}"]`);
          if (btn) {
            btn.click();
            added++;
            anyAdded = true;
          }
        }
        if (!anyAdded) break;
      }

      const branchName = branchType === "phys" ? "Ngoại Công" : "Nội Công";
      if (added > 0) {
        const msg = `✨ Đã cộng ${added} điểm kỹ năng nhánh [${branchName}: ${branch.title}]!`;
        if (window.$) window.$(msg);
        if (window.N) window.N(`<b class="up">${msg}</b>`);
      } else {
        if (window.$) window.$(`Các kỹ năng nhánh ${branchName} đã đạt tối đa cấp hiện tại!`);
      }

      this.applySkillFilter(this.currentSkillFilter);
    },

    // 3. Lọc hiển thị và gắn thẻ cho kỹ năng
    applySkillFilter: function (filter) {
      this.currentSkillFilter = filter || "all";
      const JX = getJX();
      const l = JX ? JX.S : window.l;
      if (!l) return;

      const facConfig = this.FACTIONS[l.fac];
      const physSkills = facConfig ? facConfig.phys.skills : [];
      const magSkills = facConfig ? facConfig.mag.skills : [];

      const skillNodes = document.querySelectorAll("#t-skill .u2k[data-id]");
      skillNodes.forEach(node => {
        const sid = parseInt(node.dataset.id, 10);
        const isPhys = physSkills.includes(sid);
        const isMag = magSkills.includes(sid);

        // Gắn nhãn badge Ngoại / Nội
        let badge = node.querySelector(".sk-badge-tag");
        if (!badge && (isPhys || isMag)) {
          badge = document.createElement("span");
          badge.className = `sk-badge-tag ${isPhys ? "sk-badge-phys" : "sk-badge-mag"}`;
          badge.textContent = isPhys ? "Ngoại" : "Nội";
          node.appendChild(badge);
        }

        // Lọc ẩn hiện theo tab
        let show = true;
        if (filter === "phys") {
          show = isPhys;
        } else if (filter === "mag") {
          show = isMag;
        }

        node.classList.toggle("sk-hidden", !show);
      });

      // Cập nhật trạng thái nút tab lọc
      document.querySelectorAll(".sk-filter-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.filter === this.currentSkillFilter);
      });
    },

    // Bơm giao diện gợi ý tiềm năng vào tab Nhân vật
    injectAttrUI: function () {
      const tChar = document.getElementById("t-char");
      if (!tChar) return;

      if (tChar.querySelector(".f3-attr-suggest")) return;

      const suggestBox = document.createElement("div");
      suggestBox.className = "f3-attr-suggest";
      suggestBox.innerHTML = `
        <button class="f3-suggest-btn btn-phys-branch" id="btnAttrPhys" title="Phân bổ điểm tiềm năng theo nhánh Ngoại Công (Sức Mạnh + Thân Pháp + Sinh Khí)">
          <span>⚔️ Gợi ý Ngoại Công</span>
        </button>
        <button class="f3-suggest-btn btn-mag-branch" id="btnAttrMag" title="Phân bổ điểm tiềm năng theo nhánh Nội Công (Nội Công + Sinh Khí + Thân Pháp)">
          <span>🔮 Gợi ý Nội Công</span>
        </button>
      `;

      // Chèn ngay trước danh sách điểm tiềm năng (.u2box hoặc .card)
      const u2box = tChar.querySelector(".u2box, .card");
      if (u2box) {
        u2box.insertAdjacentElement("beforebegin", suggestBox);
      } else {
        tChar.appendChild(suggestBox);
      }

      const btnPhys = suggestBox.querySelector("#btnAttrPhys");
      const btnMag = suggestBox.querySelector("#btnAttrMag");

      if (btnPhys) btnPhys.onclick = () => this.applyAttrBranch("phys");
      if (btnMag) btnMag.onclick = () => this.applyAttrBranch("mag");
    },

    // Bơm giao diện gợi ý kỹ năng vào tab Võ công
    injectSkillUI: function () {
      const tSkill = document.getElementById("t-skill");
      if (!tSkill) return;

      if (tSkill.querySelector(".skill-branch-bar")) {
        this.applySkillFilter(this.currentSkillFilter);
        return;
      }

      const bar = document.createElement("div");
      bar.className = "skill-branch-bar";
      bar.innerHTML = `
        <div class="sk-branch-actions">
          <button class="sk-branch-btn sk-btn-phys" id="btnSkPhys" title="Tự động cộng điểm vào các kỹ năng nhánh Ngoại Công của môn phái">
            <span>⚔️ Gợi ý Ngoại Công</span>
          </button>
          <button class="sk-branch-btn sk-btn-mag" id="btnSkMag" title="Tự động cộng điểm vào các kỹ năng nhánh Nội Công của môn phái">
            <span>🔮 Gợi ý Nội Công</span>
          </button>
        </div>
        <div class="sk-filter-tabs">
          <button class="sk-filter-tab active" data-filter="all">📜 Tất Cả</button>
          <button class="sk-filter-tab" data-filter="phys">⚔️ Ngoại Công</button>
          <button class="sk-filter-tab" data-filter="mag">🔮 Nội Công</button>
        </div>
      `;

      // Chèn ở đầu tab kỹ năng
      const firstChild = tSkill.firstElementChild;
      if (firstChild) {
        tSkill.insertBefore(bar, firstChild.nextSibling);
      } else {
        tSkill.appendChild(bar);
      }

      const btnPhys = bar.querySelector("#btnSkPhys");
      const btnMag = bar.querySelector("#btnSkMag");
      if (btnPhys) btnPhys.onclick = () => this.applySkillBranch("phys");
      if (btnMag) btnMag.onclick = () => this.applySkillBranch("mag");

      bar.querySelectorAll(".sk-filter-tab").forEach(tab => {
        tab.onclick = () => this.applySkillFilter(tab.dataset.filter);
      });

      this.applySkillFilter(this.currentSkillFilter);
    },

    initObserver: function () {
      // Quan sát tab Nhân vật và Võ công để re-inject khi DOM được morph/update
      const tChar = document.getElementById("t-char");
      if (tChar) {
        new MutationObserver(() => {
          if (!tChar.querySelector(".f3-attr-suggest")) {
            this.injectAttrUI();
          }
        }).observe(tChar, { childList: true });
      }

      const tSkill = document.getElementById("t-skill");
      if (tSkill) {
        new MutationObserver(() => {
          if (!tSkill.querySelector(".skill-branch-bar")) {
            this.injectSkillUI();
          }
        }).observe(tSkill, { childList: true });
      }

      document.querySelectorAll('#tabs button[data-t="char"], #tabs button[data-t="skill"]').forEach(btn => {
        btn.addEventListener("click", () => {
          setTimeout(() => {
            this.injectAttrUI();
            this.injectSkillUI();
          }, 150); // 150ms: đủ game render xong tab
        });
      });
    }
  };

  // Khởi động khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      DualOrbHud.init();
      MultiChannelLog.init();
      MiniMapRadar.init();
      ClassicF3Panel.init();
      SmartAutoEquip.init();
      BranchAdvisor.init();
    });
  } else {
    DualOrbHud.init();
    MultiChannelLog.init();
    MiniMapRadar.init();
    ClassicF3Panel.init();
    SmartAutoEquip.init();
    BranchAdvisor.init();
  }

  // Xuất ra window để tiện kiểm tra
  window.DualOrbHud = DualOrbHud;
  window.MultiChannelLog = MultiChannelLog;
  window.MiniMapRadar = MiniMapRadar;
  window.ClassicF3Panel = ClassicF3Panel;
  window.SmartAutoEquip = SmartAutoEquip;
  window.BranchAdvisor = BranchAdvisor;

})();
