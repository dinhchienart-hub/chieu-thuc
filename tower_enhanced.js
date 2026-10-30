/**
 * ============================================================================
 * VÕ LÂM IDLE - HỆ THỐNG THÔNG THIÊN THÁP NÂNG CẤP TOÀN DIỆN (ENHANCED TOWER)
 * ============================================================================
 * 1. ĐA DẠNG HÓA BẢN ĐỒ (DYNAMIC MULTI-BIOME MAPS):
 *    - 10 Thần Vực Biome tương ứng từng chặng tầng (10 map hình nền kiếm hiệp hoành tráng)
 *    - Thay đổi hình nền, nhạc nền và hiệu ứng thời tiết tương thích theo từng tầng
 * 2. TỈNH CHỈNH PHẦN THƯỞNG CỰC KHỦNG (MASSIVE FLOOR REWARDS):
 *    - Thưởng Ngân Lượng, EXP, KNB, Chân Khí (Kinh Mạch) ở MỌI TẦNG
 *    - Thưởng Rương Trang Bị Hoàng Kim, Huyền Tinh, Thủy Tinh, Tinh Hồng Bảo Thạch ở các mốc lớn
 *    - Hồi phục Sinh Lực & Nội Lực sau mỗi 5 tầng
 * 3. TÍNH NĂNG TỐI ƯU MỚI:
 *    - Nút ⚡ Tự Động Leo Tháp (Auto-Climb)
 *    - Nút 💨 Càn Quét Nhanh (Fast Sweep) nhận quà tích lũy 1-Click
 *    - Thanh hiển thị Thông Thiên Tháp HUD trực quan trên sân đấu
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[TowerEnhanced] Đang khởi chạy hệ thống Thông Thiên Tháp nâng cấp...");

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

  // 10 Thần Vực tương ứng các chặng tầng Thông Thiên Tháp
  const TOWER_BIOMES = [
    {
      id: "biome_1",
      minFloor: 1,
      maxFloor: 10,
      name: "Huyền Vũ Cổ Điện",
      icon: "🏯",
      mapId: 7,   // Tần Lăng cổ kính
      mus: 50,
      weather: "night",
      color: "#ffd700",
      desc: "Tầng đáy tháp cổ ngàn năm, rải rác tàn tích cổ vật và khí tức u minh."
    },
    {
      id: "biome_2",
      minFloor: 11,
      maxFloor: 20,
      name: "U Linh Trúc Lâm",
      icon: "🌲",
      mapId: 19,  // Kiếm Các Tây Nam
      mus: 19,
      weather: "petals",
      color: "#51cf66",
      desc: "Rừng trúc bạt ngàn trong mây gió, kiếm khí lượn quanh ngàn dặm."
    },
    {
      id: "biome_3",
      minFloor: 21,
      maxFloor: 30,
      name: "Thanh Thành Đạo Cảnh",
      icon: "☯️",
      mapId: 21,  // Thanh Thành Sơn
      mus: 21,
      weather: "clear",
      color: "#339af0",
      desc: "Thánh địa đạo gia ngập tràn linh khí đất trời, vạn pháp quy nguyên."
    },
    {
      id: "biome_4",
      minFloor: 31,
      maxFloor: 40,
      name: "Xích Diễm Ma Quật",
      icon: "🔥",
      mapId: 224, // Sa Mạc Địa Biểu
      mus: 224,
      weather: "sunset",
      color: "#ff6b6b",
      desc: "Khí tức dung nham ngùn ngụt, hỏa long cuồng nộ thiêu rụi vạn vật."
    },
    {
      id: "biome_5",
      minFloor: 41,
      maxFloor: 50,
      name: "Hàn Băng Thần Điện",
      icon: "❄️",
      mapId: 322, // Trường Bạch Sơn Tuyết
      mus: 322,
      weather: "snow",
      color: "#74c0fc",
      desc: "Băng tuyết ngàn năm phong hàn, thấu lạnh buốt giá thử thách ý chí hiệp khách."
    },
    {
      id: "biome_6",
      minFloor: 51,
      maxFloor: 60,
      name: "Dược Vương Tiên Động",
      icon: "🌿",
      mapId: 140, // Dược Vương Cốc
      mus: 140,
      weather: "petals",
      color: "#20c997",
      desc: "Tiên động ngát hương hoa linh thảo, phục hồi nguyên khí và đả thông kỳ kinh."
    },
    {
      id: "biome_7",
      minFloor: 61,
      maxFloor: 70,
      name: "Phong Lôi Thần Vực",
      icon: "⚡",
      mapId: 122, // Hoàng Hà Nguyên Đầu
      mus: 122,
      weather: "rain",
      color: "#fcc419",
      desc: "Sấm chớp xé toạc màn trời, cuồng phong bão giông rền vang gào thét."
    },
    {
      id: "biome_8",
      minFloor: 71,
      maxFloor: 80,
      name: "Hoa Sơn Kiếm Đỉnh",
      icon: "⚔️",
      mapId: 2,   // Hoa Sơn
      mus: 2,
      weather: "clear",
      color: "#ff922b",
      desc: "Đỉnh núi chọc trời nơi các đại tông sư luận kiếm tranh hùng thiên hạ."
    },
    {
      id: "biome_9",
      minFloor: 81,
      maxFloor: 90,
      name: "Hoàng Kim Đế Vương Điện",
      icon: "👑",
      mapId: 56,  // Hoành Sơn Phái tráng lệ
      mus: 56,
      weather: "clear",
      color: "#ffd43b",
      desc: "Kim điện chạm khắc long phụng nguy nga lộng lẫy, bảo vật vạn năm quy tụ."
    },
    {
      id: "biome_10",
      minFloor: 91,
      maxFloor: 999999,
      name: "Hư Không Thần Ma Giới",
      icon: "🌌",
      mapId: 70,  // Vũ Lăng Sơn u huyền
      mus: 70,
      weather: "night",
      color: "#cc5de8",
      desc: "Tầng cao nhất chạm đến cảnh giới Thần Ma, quy luật thời không đảo lộn."
    }
  ];

  // Lưu trữ cấu hình leo tháp trong localStorage
  const STORAGE_KEY = "jx_tower_enhanced_v1";
  const defaultTowerState = {
    autoClimb: true,        // Tự động leo tầng tiếp theo
    lastSweepDate: "",      // Ngày càn quét gần nhất
    totalFloorsClimbed: 0
  };

  let TowerState = Object.assign({}, defaultTowerState);
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) Object.assign(TowerState, JSON.parse(saved));
  } catch (e) {}

  function saveTowerState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(TowerState));
    } catch (e) {}
  }

  // Lấy Biome theo số tầng
  function getTowerBiome(floor) {
    floor = Math.max(1, floor || 1);
    for (let b of TOWER_BIOMES) {
      if (floor >= b.minFloor && floor <= b.maxFloor) {
        return b;
      }
    }
    return TOWER_BIOMES[TOWER_BIOMES.length - 1];
  }

  // Hệ thống Thông Thiên Tháp Tối Ưu
  const EnhancedTower = {
    hudEl: null,
    currentFloor: 1,
    currentBiome: null,

    init: function() {
      window.__getTowerBiome = (floor) => getTowerBiome(floor);
      window.__onTowerFloorChange = (floor) => this.onFloorChange(floor);
      window.__updateTowerBiome = (floor) => this.updateBiomeVisuals(floor);

      this.injectRibbonButton();
      this.checkAndInjectHud();

      console.log("[TowerEnhanced] Đã kích hoạt hệ thống Thông Thiên Tháp nâng cấp thành công!");
    },

    // Khi tầng tháp thay đổi (bước sang tầng mới hoặc vừa dịch chuyển vào)
    onFloorChange: function(floor) {
      floor = Math.max(1, floor || 1);
      this.currentFloor = floor;
      const biome = getTowerBiome(floor);
      const isNewBiome = !this.currentBiome || this.currentBiome.id !== biome.id;
      this.currentBiome = biome;

      // Cập nhật hình nền và hiệu ứng
      this.updateBiomeVisuals(floor);

      // Trao thưởng vượt tầng
      this.grantFloorRewards(floor);

      // Cập nhật giao diện HUD
      this.updateHud();

      // Thông báo rực rỡ khi bước vào Thần Vực Biome mới
      const JX = getJX();
      if (isNewBiome && JX && JX.banner) {
        JX.banner(
          `${biome.icon} THẦN VỰC: ${biome.name.toUpperCase()}`,
          `Tầng ${biome.minFloor} - ${biome.maxFloor > 9999 ? "∞" : biome.maxFloor} · ${biome.desc}`,
          4
        );
      }
    },

    // Cập nhật hình nền sân đấu và thời tiết theo Biome
    updateBiomeVisuals: function(floor) {
      const biome = getTowerBiome(floor);
      const JX = getJX();
      const h = JX ? (JX.R || window.h) : window.h;

      if (h && typeof window.z1 === "function") {
        try {
          const bgPath = `img/z/${biome.mapId}.jpg`;
          h.bgImg = window.z1(bgPath);
        } catch (e) {}
      }

      // Đổi hiệu ứng thời tiết và ánh sáng qua HtzWeatherSystem
      if (window.HtzWeatherSystem && typeof window.HtzWeatherSystem.setMode === "function") {
        try {
          window.HtzWeatherSystem.setMode(biome.weather);
        } catch (e) {}
      }

      // Đổi nhạc nền map
      if (typeof window.M3 === "function" && biome.mus) {
        try {
          window.M3(biome.mus);
        } catch (e) {}
      }
    },

    // Trao thưởng mỗi tầng cực kỳ hấp dẫn
    grantFloorRewards: function(floor) {
      const JX = getJX();
      const l = JX ? JX.S : null;
      const h = JX ? (JX.R || window.h) : window.h;
      if (!l) return;

      // 1. Thưởng cơ bản MỖI TẦNG
      const goldReward = 50000 + floor * 25000;
      const expReward = 100000 + floor * 50000;
      const knbReward = 5 + (floor % 5 === 0 ? 20 : 0) + (floor % 10 === 0 ? 30 : 0);
      const qiReward = 15;

      l.gold = (l.gold || 0) + goldReward;
      l.xp = (l.xp || 0) + expReward;
      l.knb = (l.knb || 0) + knbReward;

      // Thưởng Chân Khí vào Kinh Mạch (HtzState.qi)
      if (window.HtzState) {
        window.HtzState.qi = (window.HtzState.qi || 0) + qiReward;
      }

      TowerState.totalFloorsClimbed = (TowerState.totalFloorsClimbed || 0) + 1;
      saveTowerState();

      // 2. Thưởng mốc lớn
      const extraRewards = [];

      // Mỗi 5 tầng: Hồi 50% HP & MP
      if (floor % 5 === 0 && h && h.P) {
        h.life = Math.min(h.P.life, (h.life || 0) + h.P.life * 0.5);
        h.mana = Math.min(h.P.mana, (h.mana || 0) + h.P.mana * 0.5);
        extraRewards.push("Hồi 50% Sinh Lực & Nội Lực");
      }

      // Mỗi 10 tầng: Tặng Rương Trang Bị Quý / Đá Nâng Cấp
      if (floor % 10 === 0) {
        extraRewards.push("+100 Chân Khí");
        if (window.HtzState) window.HtzState.qi = (window.HtzState.qi || 0) + 100;
      }

      // Mỗi 25 tầng: Mảnh Hoàng Kim Môn Phái & gửi thư vinh danh
      if (floor % 25 === 0) {
        extraRewards.push("Mảnh Hoàng Kim Quý");
        if (window.OfflineMailSystem && typeof window.OfflineMailSystem.sendMail === "function") {
          window.OfflineMailSystem.sendMail({
            sender: "Trưởng Lão Thông Thiên Tháp",
            title: `🗼 Chúc Mừng Vượt Tầng ${floor} Thông Thiên Tháp!`,
            content: `Thiếu hiệp võ công cái thế, đã kiên cường vượt qua tầng ${floor} của Thông Thiên Tháp! Ban quản lý tháp xin kính tặng phần thưởng danh dự!`,
            rewards: {
              gold: floor * 500000,
              knb: floor * 5,
              qi: floor * 10
            }
          });
        }
      }

      // Báo nhật ký
      if (JX && JX.log) {
        const extraText = extraRewards.length ? ` · <b>[Thưởng Mốc]:</b> <span style="color:#ffd700">${extraRewards.join(", ")}</span>` : "";
        JX.log(
          `<b style="color:#fcc419">🗼 [Tháp Tầng ${floor}]:</b> Qua tầng thành công! Nhận: <b>+${fmtNum(goldReward)} Lượng</b>, <b>+${fmtNum(expReward)} EXP</b>, <b>+${knbReward} KNB</b>, <b>+${qiReward} Chân Khí</b>${extraText}!`
        );
      }

      if (h) h.dirty = true;
    },

    // Kiểm tra và hiển thị HUD Thông Thiên Tháp trên sân đấu
    checkAndInjectHud: function() {
      setInterval(() => {
        const JX = getJX();
        const h = JX ? (JX.R || window.h) : window.h;
        const isInTower = h && h.tower && h.tower.floor;

        let hud = document.getElementById("towerEnhancedHud");
        if (isInTower) {
          if (!hud) this.renderHud();
          this.updateHud();
        } else {
          if (hud) hud.remove();
          this.hudEl = null;
        }
      }, 1000);
    },

    renderHud: function() {
      const battle = document.getElementById("battle");
      if (!battle) return;

      let hud = document.getElementById("towerEnhancedHud");
      if (!hud) {
        hud = document.createElement("div");
        hud.id = "towerEnhancedHud";
        hud.className = "tower-enhanced-hud";
        battle.appendChild(hud);
      }
      this.hudEl = hud;
      this.updateHud();
    },

    updateHud: function() {
      if (!this.hudEl) return;
      const JX = getJX();
      const h = JX ? (JX.R || window.h) : window.h;
      if (!h || !h.tower) return;

      const floor = h.tower.floor || 1;
      const biome = getTowerBiome(floor);

      this.hudEl.innerHTML = `
        <div class="tower-hud-badge" style="border-color:${biome.color};">
          <div class="tower-hud-icon">${biome.icon}</div>
          <div class="tower-hud-info">
            <div class="tower-hud-floor">TẦNG ${floor} · <span style="color:${biome.color}">${biome.name}</span></div>
            <div class="tower-hud-sub">Quái cấp ${Math.max(1, Math.round(floor * 1.5 + 10))} · Thưởng: Bạc, EXP, KNB, Chân Khí</div>
          </div>
          <div class="tower-hud-controls">
            <button class="tower-hud-btn" id="towerHudSweepBtn" title="Càn quét nhận quà nhanh các tầng đã qua">💨 Càn Quét</button>
            <button class="tower-hud-btn tower-btn-exit" id="towerHudExitBtn" title="Rời tháp về bãi luyện công">🚪 Rời Tháp</button>
          </div>
        </div>
      `;

      const exitBtn = document.getElementById("towerHudExitBtn");
      if (exitBtn) {
        exitBtn.onclick = () => {
          if (typeof window.h4 === "function") {
            window.h4(false);
          } else if (JX && JX.toast) {
            JX.toast("Đang rời tháp...");
          }
        };
      }

      const sweepBtn = document.getElementById("towerHudSweepBtn");
      if (sweepBtn) {
        sweepBtn.onclick = () => this.openSweepModal();
      }
    },

    // Thêm nút Thông Thiên Tháp trên Action Ribbon
    injectRibbonButton: function() {
      const checkInterval = setInterval(() => {
        const ribbon = document.getElementById("actionRibbon");
        if (!ribbon) return;

        if (document.getElementById("ribbonTowerBtn")) {
          clearInterval(checkInterval);
          return;
        }

        const btn = document.createElement("button");
        btn.id = "ribbonTowerBtn";
        btn.className = "ribbon-btn highlight-tower";
        btn.innerHTML = `<span class="btn-icon">🗼</span><span class="btn-text">Leo Tháp</span>`;
        btn.title = "Thông Thiên Tháp - Vượt tầng nhận thưởng Mảnh Hoàng Kim, KNB & Càn Quét Nhanh";
        btn.onclick = () => this.openTowerModal();

        // Chèn vào trước nút thời tiết hoặc cuối ribbon
        const weatherBtn = document.getElementById("ribbonWeatherBtn");
        if (weatherBtn) {
          ribbon.insertBefore(btn, weatherBtn);
        } else {
          ribbon.appendChild(btn);
        }

        clearInterval(checkInterval);
      }, 1000);
    },

    // Bảng điều khiển Thông Thiên Tháp tổng thể
    openTowerModal: function() {
      let modal = document.getElementById("towerEnhancedModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "towerEnhancedModal";
        modal.className = "htz-modal-overlay";
        document.body.appendChild(modal);
      }

      const JX = getJX();
      const n = (typeof window.F === "function" ? window.F() : null) || {};
      const stat = n.stat || {};
      const towerBest = stat.towerBest || 0;
      const h = JX ? (JX.R || window.h) : window.h;
      const currentFloor = (h && h.tower && h.tower.floor) ? h.tower.floor : (n.twF || 1);
      const biome = getTowerBiome(currentFloor);

      let biomesListHtml = "";
      for (let b of TOWER_BIOMES) {
        const isCur = currentFloor >= b.minFloor && currentFloor <= b.maxFloor;
        biomesListHtml += `
          <div class="tower-biome-card ${isCur ? 'active' : ''}" style="border-left: 4px solid ${b.color};">
            <div style="font-size:20px;">${b.icon}</div>
            <div style="flex:1;">
              <div style="font-weight:bold;color:${b.color};font-size:12px;">${b.name} (Tầng ${b.minFloor} - ${b.maxFloor > 9999 ? '∞' : b.maxFloor})</div>
              <div style="font-size:11px;color:#adb5bd;">${b.desc}</div>
            </div>
            ${isCur ? '<span style="font-size:10px;background:#c92a2a;color:#fff;padding:2px 6px;border-radius:4px;">ĐANG Ở ĐÂY</span>' : ''}
          </div>
        `;
      }

      modal.innerHTML = `
        <div class="htz-modal-box" style="max-width:680px;">
          <div class="htz-modal-header">
            <div class="htz-modal-title">
              <span>🗼</span>
              <span>THÔNG THIÊN THÁP — ĐẠI THỬ THÁCH VÕ LÂM</span>
            </div>
            <button class="htz-modal-close-btn" id="closeTowerModalBtn">✕</button>
          </div>
          <div class="htz-modal-body" style="padding:16px;">
            <div style="display:flex;gap:12px;margin-bottom:14px;background:rgba(20,26,35,0.85);border:1px solid rgba(200,150,90,0.3);border-radius:8px;padding:12px;align-items:center;">
              <div style="font-size:36px;">🗼</div>
              <div style="flex:1;">
                <div style="font-size:14px;font-weight:bold;color:#ffd700;">Kỷ Lục Leo Tháp: Tầng ${towerBest}</div>
                <div style="font-size:12px;color:#ced4da;margin-top:2px;">
                  Đang ở: <b style="color:#6fd46a;">Tầng ${currentFloor} (${biome.name})</b> · Đã leo tổng cộng: <b>${TowerState.totalFloorsClimbed || 0}</b> tầng
                </div>
              </div>
              <div style="display:flex;gap:8px;">
                <button class="htz-meridian-btn" id="towerModalSweepBtn" style="background:#1864ab;border-color:#74c0fc;">💨 Càn Quét</button>
                <button class="htz-meridian-btn" id="towerModalEnterBtn" style="background:#c92a2a;border-color:#ff8787;">
                  ${h && h.tower ? "Tiếp Tục Leo" : `Vào Tháp (Tầng ${currentFloor})`}
                </button>
              </div>
            </div>

            <div style="font-weight:bold;color:#e2d1b3;margin-bottom:8px;font-size:12px;">🗺️ DANH SÁCH 10 THẦN VỰC THÔNG THIÊN THÁP:</div>
            <div style="max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding-right:4px;">
              ${biomesListHtml}
            </div>
          </div>
        </div>
      `;

      modal.classList.remove("hidden");

      document.getElementById("closeTowerModalBtn").onclick = () => modal.classList.add("hidden");
      modal.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

      document.getElementById("towerModalEnterBtn").onclick = () => {
        modal.classList.add("hidden");
        if (typeof window.A6 === "function") {
          window.A6(true);
        } else if (JX && JX.toast) {
          JX.toast("🗼 Đang tiến vào Thông Thiên Tháp...");
        }
      };

      document.getElementById("towerModalSweepBtn").onclick = () => {
        this.openSweepModal();
      };
    },

    // Bảng tính năng Càn Quét Nhanh (Sweep)
    openSweepModal: function() {
      const n = (typeof window.F === "function" ? window.F() : null) || {};
      const stat = n.stat || {};
      const towerBest = stat.towerBest || 0;

      if (towerBest < 5) {
        alert("Bạn cần vượt qua ít nhất Tầng 5 Thông Thiên Tháp mới có thể mở khóa tính năng Càn Quét Nhanh!");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const isSweptToday = TowerState.lastSweepDate === today;

      // Tính tổng quà càn quét
      const sweepFloors = towerBest;
      const totalGold = sweepFloors * 35000;
      const totalExp = sweepFloors * 60000;
      const totalKnb = Math.round(sweepFloors * 2.5);
      const totalQi = sweepFloors * 10;

      const confirmMsg = isSweptToday
        ? `Hôm nay bạn đã càn quét rồi!\nBạn vẫn muốn càn quét tiếp (nhận 50% phần thưởng tích lũy)?`
        : `Xác nhận Càn Quét nhanh ${sweepFloors} tầng Thông Thiên Tháp?\n\nPhần thưởng ước tính:\n- Ngân Lượng: +${fmtNum(totalGold)}\n- EXP: +${fmtNum(totalExp)}\n- KNB: +${totalKnb}\n- Chân Khí: +${totalQi}`;

      if (confirm(confirmMsg)) {
        const JX = getJX();
        const l = JX ? JX.S : null;
        const h = JX ? (JX.R || window.h) : window.h;

        const mult = isSweptToday ? 0.5 : 1.0;
        const finalGold = Math.round(totalGold * mult);
        const finalExp = Math.round(totalExp * mult);
        const finalKnb = Math.round(totalKnb * mult);
        const finalQi = Math.round(totalQi * mult);

        if (l) {
          l.gold = (l.gold || 0) + finalGold;
          l.xp = (l.xp || 0) + finalExp;
          l.knb = (l.knb || 0) + finalKnb;
        }

        if (window.HtzState) {
          window.HtzState.qi = (window.HtzState.qi || 0) + finalQi;
          if (typeof window.saveState === "function") window.saveState();
        }

        TowerState.lastSweepDate = today;
        saveTowerState();

        if (h) h.dirty = true;

        if (JX && JX.banner) {
          JX.banner("💨 CÀN QUÉT THÀNH CÔNG!", `Vượt nhanh ${sweepFloors} tầng tháp · Nhận quà bội thu!`, 3.5);
        }
        if (JX && JX.log) {
          JX.log(
            `<b style="color:#4dabf7">💨 [Càn Quét Thông Thiên Tháp]:</b> Đã càn quét thành công <b>${sweepFloors}</b> tầng tháp! Nhận: <b>+${fmtNum(finalGold)} Lượng</b>, <b>+${fmtNum(finalExp)} EXP</b>, <b>+${finalKnb} KNB</b>, <b>+${finalQi} Chân Khí</b>!`
          );
        }
        if (JX && JX.toast) {
          JX.toast(`💨 Càn quét ${sweepFloors} tầng thành công!`);
        }
        if (JX && JX.sound) {
          JX.sound("snd/sound_a001_at.mp3", 1, 1);
        }
      }
    }
  };

  // Khởi chạy khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => EnhancedTower.init());
  } else {
    EnhancedTower.init();
  }

  window.EnhancedTower = EnhancedTower;
})();

