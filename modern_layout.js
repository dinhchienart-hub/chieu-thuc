/**
 * ============================================================================
 * VÕ LÂM IDLE - LOGIC ĐIỀU PHỐI BỐ CỤC HIỆN ĐẠI (MODERN GAMEPLAY LAYOUT)
 * ============================================================================
 * Bước 1: Action Ribbon (Khiêu chiến, Tống Kim, Sát thủ, Phúc lợi, Bán đồ, Tốc độ, Lưu trữ, Thời tiết)
 *         + Collapsible Smart D-Pad (Tự thu gọn khi Auto, mở rộng khi PK)
 * Bước 2: F3 Character Sub-Tabs (Tích hợp Kinh Mạch, Linh Thú, Danh Hiệu)
 * Bước 3: Căn chỉnh Header & Bottom Navigation tiện dụng ngón tay cái
 * Bước 4: ⚡ Điều khiển Tốc Độ Trận Đánh (1x, 1.5x, 2x, 3x)
 * Bước 5: 💾 Quản Lý Sao Lưu 1-Click (Export/Import JSON & Auto-Snapshots)
 * Bước 6: 🛡️ Trợ Thủ Sinh Tồn AFK (Tự Bơm Máu, Cứu Nguy & Tự Trở Lại Bãi)
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[ModernLayout] Đang khởi tạo hệ thống bố cục & trợ thủ nâng cao cho Võ Lâm Idle...");

  function getJX() {
    return window.__JX || null;
  }

  const ModernLayout = {
    padCollapsed: true,
    survivalEnabled: true,
    lastTownRest: 0,

    init: function() {
      // 1. Tạo Dải Cầu Nối Action Ribbon
      this.initActionRibbon();

      // 2. Tái cấu trúc Smart Collapsible D-Pad
      this.initCollapsiblePad();

      // 3. Khởi tạo F3 Character Sub-Tabs
      this.initCharSubTabs();

      // 4. Tinh chỉnh Header & Bottom Navigation
      this.initErgonomics();

      // 5. Điều khiển Tốc Độ Trận Đánh
      this.initSpeedControl();

      // 6. Quản Lý Sao Lưu Lưu Trữ 1-Click & Snapshots
      this.initSaveManager();

      // 7. Trợ Thủ Sinh Tồn & Tự Động Trở Lại Bãi AFK
      this.initSurvivalAssistant();

      // Đồng bộ theo chu kỳ
      setInterval(() => {
        this.syncState();
      }, 1000);
    },

    // ========================================================================
    // BƯỚC 1: DẢI THAO TÁC NHANH (ACTION RIBBON)
    // ========================================================================
    initActionRibbon: function() {
      const app = document.getElementById("app");
      const battle = document.getElementById("battle");
      const panel = document.getElementById("panel");

      if (!app || !battle || !panel) return;
      if (document.getElementById("actionRibbon")) return;

      const ribbon = document.createElement("div");
      ribbon.id = "actionRibbon";
      ribbon.className = "action-ribbon";

      ribbon.innerHTML = `
        <button class="ribbon-btn highlight" id="ribbonPkBtn" title="Lôi Đài PK & Khiêu Chiến Boss">
          <span class="ribbon-icon">⚔️</span>
          <span class="ribbon-txt">Khiêu Chiến</span>
        </button>
        <button class="ribbon-btn highlight-gold" id="ribbonLienDauBtn" title="Đại Hội Võ Lâm Liên Đấu 64 Người">
          <span class="ribbon-icon">🏆</span>
          <span class="ribbon-txt">Liên Đấu</span>
        </button>
        <button class="ribbon-btn" id="ribbonSjBtn" title="Chiến Trường Tống Kim">
          <span class="ribbon-icon">🚩</span>
          <span class="ribbon-txt">Tống Kim</span>
        </button>
        <button class="ribbon-btn" id="ribbonBountyBtn" title="Mật Lệnh Sát Thủ">
          <span class="ribbon-icon">🎯</span>
          <span class="ribbon-txt">Sát Thủ</span>
        </button>
        <button class="ribbon-btn" id="ribbonGiftBtn" title="Nhận Thưởng Phúc Lợi Hàng Ngày">
          <span class="ribbon-icon">🎁</span>
          <span class="ribbon-txt">Phúc Lợi</span>
          <em class="ribbon-dot" id="ribbonGiftDot"></em>
        </button>
        <button class="ribbon-btn highlight-gold" id="ribbonAutoSellBtn" title="Cài Đặt Bán Đồ Tự Động & Chống Đầy Túi">
          <span class="ribbon-icon">💰</span>
          <span class="ribbon-txt">Bán Đồ</span>
          <span class="ribbon-badge safe" id="ribbonBagBadge">--</span>
        </button>
        <button class="ribbon-btn highlight-speed" id="ribbonSpeedBtn" title="Tốc Độ Chiến Đấu (1x / 1.5x / 2x / 3x)">
          <span class="ribbon-icon" id="ribbonSpeedIcon">⚡</span>
          <span class="ribbon-txt" id="ribbonSpeedTxt">1x</span>
        </button>
        <button class="ribbon-btn highlight-save" id="ribbonSaveBtn" title="Quản Lý Lưu File & Bản Phục Hồi">
          <span class="ribbon-icon">💾</span>
          <span class="ribbon-txt">Lưu Trữ</span>
        </button>
        <button class="ribbon-btn highlight" id="ribbonCompanionBtn" title="Hệ Thống Đồng Hành & Linh Thú Võ Lâm">
          <span class="ribbon-icon">🐾</span>
          <span class="ribbon-txt">Đồng Hành</span>
        </button>
      `;

      // Chèn giữa battle và panel
      battle.insertAdjacentElement("afterend", ribbon);

      // Cho phép cuộn ngang mượt mà bằng con lăn chuột (mouse wheel)
      ribbon.addEventListener("wheel", (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          ribbon.scrollLeft += e.deltaY;
        }
      }, { passive: false });

      // Gắn sự kiện click cho các nút trên Action Ribbon
      const autoSellBtn = document.getElementById("ribbonAutoSellBtn");
      if (autoSellBtn) {
        autoSellBtn.onclick = () => {
          if (window.__smartAutoSell && typeof window.__smartAutoSell.openModal === "function") {
            window.__smartAutoSell.openModal();
          }
        };
      }

      const pkBtn = document.getElementById("ribbonPkBtn");
      if (pkBtn) {
        pkBtn.onclick = () => {
          if (typeof window.openPkModal === "function") {
            window.openPkModal();
          } else {
            const b = document.getElementById("pkBossBtn");
            if (b) b.click();
          }
        };
      }

      const ldBtn = document.getElementById("ribbonLienDauBtn");
      if (ldBtn) {
        ldBtn.onclick = () => {
          if (window.TournamentSystem && typeof window.TournamentSystem.openModal === "function") {
            window.TournamentSystem.openModal();
          }
        };
      }

      const sjBtn = document.getElementById("ribbonSjBtn");
      if (sjBtn) {
        sjBtn.onclick = () => {
          if (window.HtzFeaturesHub && typeof window.HtzFeaturesHub.openModal === "function") {
            window.HtzFeaturesHub.openModal("songjin");
          }
        };
      }

      const bountyBtn = document.getElementById("ribbonBountyBtn");
      if (bountyBtn) {
        bountyBtn.onclick = () => {
          if (window.HtzFeaturesHub && typeof window.HtzFeaturesHub.openModal === "function") {
            window.HtzFeaturesHub.openModal("bounty");
          }
        };
      }

      const giftBtn = document.getElementById("ribbonGiftBtn");
      if (giftBtn) {
        giftBtn.onclick = () => {
          const g = document.getElementById("giftBtn");
          if (g) g.click();
        };
      }

      const compBtn = document.getElementById("ribbonCompanionBtn");
      if (compBtn) {
        compBtn.onclick = () => {
          if (window.HtzFeaturesHub && typeof window.HtzFeaturesHub.openModal === "function") {
            window.HtzFeaturesHub.openModal("pet");
          }
        };
      }

      console.log("[ModernLayout] Bước 1: Action Ribbon nâng cao đã gắn kết thành công.");
    },

    updateWeatherButton: function() {
      // Đã bỏ thời tiết
    },

    // ========================================================================
    // BƯỚC 1 (TIẾP TỤC): COLLAPSIBLE SMART D-PAD
    // ========================================================================
    initCollapsiblePad: function() {
      const pad = document.getElementById("pad");
      if (!pad) return;

      // Mặc định luôn mở đầy đủ phím chiến đấu Q-W-E-R và thuốc 1-2-3 (người chơi có thể bấm ▴/▾ để thu gọn nếu muốn)
      const saved = localStorage.getItem("jx_pad_collapsed_v2");
      this.padCollapsed = saved === "1";

      // Thêm nút toggle vào đầu #pad nếu chưa có
      if (!document.getElementById("padToggleBtn")) {
        const toggleBtn = document.createElement("button");
        toggleBtn.id = "padToggleBtn";
        toggleBtn.className = "pad-toggle-btn";
        toggleBtn.title = "Thu gọn / Mở rộng phím kỹ năng (Q-W-E-R)";
        toggleBtn.innerHTML = this.padCollapsed ? "▴" : "▾";

        toggleBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.togglePad();
        };

        pad.appendChild(toggleBtn);
      }

      this.applyPadState();

      // Hook vào nút Auto/Manual (#ctrlBtn): Nếu người chơi bấm chuyển sang Thủ Công, tự động mở rộng D-Pad
      const ctrlBtn = document.getElementById("ctrlBtn");
      if (ctrlBtn) {
        ctrlBtn.addEventListener("click", () => {
          setTimeout(() => {
            const isManual = ctrlBtn.classList.contains("on") === false;
            if (isManual && this.padCollapsed) {
              this.padCollapsed = false;
              this.applyPadState();
            }
          }, 50);
        });
      }

      console.log("[ModernLayout] Bước 1: Collapsible Smart D-Pad đã kích hoạt.");
    },

    togglePad: function() {
      this.padCollapsed = !this.padCollapsed;
      localStorage.setItem("jx_pad_collapsed_v2", this.padCollapsed ? "1" : "0");
      this.applyPadState();
    },

    applyPadState: function() {
      const pad = document.getElementById("pad");
      const toggleBtn = document.getElementById("padToggleBtn");
      if (!pad) return;

      if (this.padCollapsed) {
        pad.classList.add("collapsed");
        if (toggleBtn) toggleBtn.innerHTML = "▴";
      } else {
        pad.classList.remove("collapsed");
        if (toggleBtn) toggleBtn.innerHTML = "▾";
      }
    },

    // ========================================================================
    // BƯỚC 2: F3 CHARACTER SUB-TABS (TÍCH HỢP TRONG THẺ NHÂN VẬT)
    // ========================================================================
    initCharSubTabs: function() {
      const tChar = document.getElementById("t-char");
      if (!tChar) return;

      const observer = new MutationObserver(() => {
        this.renderCharSubNav();
      });

      observer.observe(tChar, { childList: true });
      this.renderCharSubNav();
      console.log("[ModernLayout] Bước 2: F3 Character Sub-Tabs đã sẵn sàng.");
    },

    renderCharSubNav: function() {
      const tChar = document.getElementById("t-char");
      if (!tChar || document.getElementById("charSubNav")) return;

      // Tạo thanh điều hướng Sub-Nav trên đỉnh thẻ nhân vật
      const subNav = document.createElement("div");
      subNav.id = "charSubNav";
      subNav.className = "char-sub-nav";

      subNav.innerHTML = `
        <button class="char-sub-tab active" data-sub="attr">🥋 Thuộc Tính</button>
        <button class="char-sub-tab" data-sub="meridian">☸ Kinh Mạch</button>
        <button class="char-sub-tab" data-sub="companion">🐾 Đồng Hành & Thú</button>
        <button class="char-sub-tab" data-sub="title">👑 Danh Hiệu</button>
      `;

      tChar.insertBefore(subNav, tChar.firstChild);

      // Tạo container cho các Sub-panel
      const subContent = document.createElement("div");
      subContent.id = "charSubContent";
      tChar.insertBefore(subContent, subNav.nextSibling);

      // Gắn sự kiện click chuyển sub-tab
      subNav.querySelectorAll(".char-sub-tab").forEach(tabBtn => {
        tabBtn.onclick = (e) => {
          e.preventDefault();
          const target = tabBtn.dataset.sub;

          subNav.querySelectorAll(".char-sub-tab").forEach(b => b.classList.remove("active"));
          tabBtn.classList.add("active");

          this.switchCharSubTab(target);
        };
      });
    },

    companionFilter: "all",

    switchCharSubTab: function(target) {
      const tChar = document.getElementById("t-char");
      const subContent = document.getElementById("charSubContent");
      if (!tChar || !subContent) return;

      // Thu gom các thẻ gốc của F3 (bảng đồ, thuộc tính)
      const f3OriginalCards = Array.from(tChar.children).filter(el => 
        el.id !== "charSubNav" && el.id !== "charSubContent"
      );

      // Giữ nguyên giao diện F3 gốc luôn hiển thị mượt mà
      f3OriginalCards.forEach(card => card.style.display = "");
      subContent.innerHTML = "";

      if (target === "meridian") {
        if (window.HtzFeaturesHub && typeof window.HtzFeaturesHub.openModal === "function") {
          window.HtzFeaturesHub.openModal("meridian");
        }
      } else if (target === "companion") {
        if (window.HtzFeaturesHub && typeof window.HtzFeaturesHub.openModal === "function") {
          window.HtzFeaturesHub.openModal("pet");
        }
      } else if (target === "title") {
        if (window.HtzFeaturesHub && typeof window.HtzFeaturesHub.openModal === "function") {
          window.HtzFeaturesHub.openModal("title");
        }
      }
    },

    renderCompanionView: function() {
      const subContent = document.getElementById("charSubContent");
      if (!subContent) return;

      const list = window.__pkBossCompanions || [];
      const JX = getJX();
      const l = JX ? JX.S : null;

      const activeId = (window.HtzState && window.HtzState.activePet) || (window.__pkBossState && window.__pkBossState.selectedCompanion) || "emei";
      const isEnabled = window.__pkBossState ? window.__pkBossState.companionEnabled !== false : true;
      const activeComp = list.find(c => c.id === activeId) || list[0] || {};

      const petLevels = (window.HtzState && window.HtzState.petLevels) || {};
      const curLvl = petLevels[activeComp.id] || 1;
      const upgradeCost = curLvl * 150000 + 50000;

      const pLvl = Math.max(1, (l && l.lvl) || 1);
      const estHp = Math.round((pLvl * 1500 + 10000) * (1 + (curLvl - 1) * 0.05));
      const estDps = Math.round((pLvl * 120 + 800) * (1 + (curLvl - 1) * 0.06));
      const estRadius = (activeComp.radius || 280) + curLvl * 6;

      const seriesClass = activeComp.series === 0 ? "s-kim" :
                          activeComp.series === 1 ? "s-moc" :
                          activeComp.series === 2 ? "s-thuy" :
                          activeComp.series === 3 ? "s-hoa" : "s-tho";

      const filteredList = list.filter(c => {
        if (this.companionFilter === "hero") return c.type === "hero";
        if (this.companionFilter === "beast") return c.type === "beast";
        return true;
      });

      subContent.innerHTML = `
        <div class="comp-active-banner">
          <div class="comp-header-row">
            <div class="comp-avatar-large">${activeComp.avatar || "🐾"}</div>
            <div class="comp-title-block">
              <div class="comp-name-line">
                <span class="comp-name-txt">${activeComp.name || "Đồng Hành"}</span>
                <span class="comp-badge-type">${activeComp.type === "beast" ? "Thần Thú" : "Hiệp Khách"}</span>
                <span class="comp-badge-series ${seriesClass}">Hệ ${activeComp.seriesName || "Ngũ Hành"}</span>
                <span style="color:#ffd700; font-size:12px; font-weight:700;">Lv.${curLvl}/50</span>
              </div>
              <div class="comp-role-line"><b>Vai trò:</b> ${activeComp.role || "Trợ chiến"} · <b>Tuyệt kỹ:</b> ${activeComp.skillName || "Võ công"}</div>
            </div>
          </div>

          <div class="comp-stat-grid">
            <div class="comp-stat-item"><span>Sinh lực (HP):</span> <b>${estHp.toLocaleString("vi-VN")}</b></div>
            <div class="comp-stat-item"><span>Sát thương (DPS):</span> <b>${estDps.toLocaleString("vi-VN")}</b></div>
            <div class="comp-stat-item"><span>Hút đồ tự động:</span> <b>${estRadius} px</b></div>
            <div class="comp-stat-item"><span>Trạng thái:</span> <b style="color:${isEnabled ? "#5fd35a" : "#ff7b62"}">${isEnabled ? "Đang Xuất Chiến" : "Nghỉ Ngơi"}</b></div>
          </div>

          <div class="comp-aura-box">
            <b>✨ Hào Quang Hỗ Trợ:</b> ${activeComp.desc || "Cộng hưởng sức mạnh kiếm hiệp cho chủ nhân."}
          </div>

          <div class="comp-actions-row">
            <button class="btn on" id="btnCompUpgrade" title="Nâng cấp cần ${upgradeCost.toLocaleString("vi-VN")} lượng">
              🌟 Bồi Dưỡng (+1 Cấp) · ${upgradeCost.toLocaleString("vi-VN")} Lượng
            </button>
            <button class="btn ${isEnabled ? "red" : "on"}" id="btnCompToggleActive">
              ${isEnabled ? "💤 Thu Hồi (Nghỉ)" : "⚔️ Xuất Chiến"}
            </button>
          </div>
        </div>

        <div class="comp-filter-bar">
          <button class="comp-filter-btn ${this.companionFilter === "all" ? "active" : ""}" data-cfilter="all">Tất Cả (${list.length})</button>
          <button class="comp-filter-btn ${this.companionFilter === "hero" ? "active" : ""}" data-cfilter="hero">Hiệp Khách (${list.filter(c => c.type === "hero").length})</button>
          <button class="comp-filter-btn ${this.companionFilter === "beast" ? "active" : ""}" data-cfilter="beast">Thần Thú (${list.filter(c => c.type === "beast").length})</button>
        </div>

        <div class="comp-grid">
          ${filteredList.map(c => {
            const isCur = c.id === activeComp.id;
            const cLvl = petLevels[c.id] || 1;
            const sCls = c.series === 0 ? "s-kim" : c.series === 1 ? "s-moc" : c.series === 2 ? "s-thuy" : c.series === 3 ? "s-hoa" : "s-tho";
            return `
              <div class="comp-card ${isCur ? "active-comp" : ""}">
                <div class="comp-card-top">
                  <div class="comp-card-avatar">${c.avatar || "🐾"}</div>
                  <div style="flex:1; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span class="comp-card-name">${c.name}</span>
                      <span class="comp-badge-series ${sCls}" style="font-size:9.5px;">Hệ ${c.seriesName || ""}</span>
                    </div>
                    <div style="font-size:11px; color:#ffd700; margin-top:2px;">Cấp ${cLvl} · <span style="color:#adb5bd;">${c.role}</span></div>
                  </div>
                </div>
                <div class="comp-card-desc">${c.desc}</div>
                <button class="comp-card-btn ${isCur ? "active" : ""}" data-comp-select="${c.id}">
                  ${isCur ? "✓ Đang Ra Trận" : "Xuất Chiến"}
                </button>
              </div>
            `;
          }).join("")}
        </div>
      `;

      // Gắn sự kiện
      const btnUpgrade = document.getElementById("btnCompUpgrade");
      if (btnUpgrade) {
        btnUpgrade.onclick = () => {
          if (window.HtzPetSystem && typeof window.HtzPetSystem.levelUpPet === "function") {
            window.HtzPetSystem.levelUpPet(activeComp.id);
            this.renderCompanionView();
          }
        };
      }

      const btnToggle = document.getElementById("btnCompToggleActive");
      if (btnToggle) {
        btnToggle.onclick = () => {
          if (window.__pkBossState) {
            window.__pkBossState.companionEnabled = !window.__pkBossState.companionEnabled;
            if (typeof window.__pkEnsureCompanion === "function") {
              window.__pkEnsureCompanion();
            }
            if (JX && JX.toast) {
              JX.toast(window.__pkBossState.companionEnabled ? "🐾 Đồng hành đã xuất chiến!" : "💤 Đồng hành đã thu hồi nghỉ ngơi.");
            }
            this.renderCompanionView();
          }
        };
      }

      // Bộ lọc
      subContent.querySelectorAll(".comp-filter-btn[data-cfilter]").forEach(btn => {
        btn.onclick = () => {
          this.companionFilter = btn.dataset.cfilter;
          this.renderCompanionView();
        };
      });

      // Nút xuất chiến từng con
      subContent.querySelectorAll(".comp-card-btn[data-comp-select]").forEach(btn => {
        btn.onclick = () => {
          const selId = btn.dataset.compSelect;
          if (window.HtzPetSystem && typeof window.HtzPetSystem.setActivePet === "function") {
            window.HtzPetSystem.setActivePet(selId);
          }
          this.renderCompanionView();
        };
      });
    },

    // ========================================================================
    // BƯỚC 3: TỐI ƯU HEADER & BOTTOM NAVIGATION (MOBILE ERGONOMICS)
    // ========================================================================
    initErgonomics: function() {
      // 1. Cụm tiền tệ Vàng + KNB click vào để mở nhanh Kỳ Trân Các
      const goldBox = document.querySelector("#top .gold");
      const ktcBtn = document.getElementById("ktcBtn");
      if (goldBox && ktcBtn) {
        goldBox.title = "Nhấp để mở Kỳ Trân Các";
        goldBox.onclick = () => ktcBtn.click();
      }

      // 2. Ẩn các nút trùng lặp đã đưa vào Ribbon
      const redundantIds = ["pkBossBtn", "htzHubBtn"];
      redundantIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
      });

      console.log("[ModernLayout] Bước 3: Tinh chỉnh Ergonomics hoàn tất.");
    },

    // ========================================================================
    // BƯỚC 4: ⚡ ĐIỀU KHIỂN TỐC ĐỘ TRẬN ĐÁNH (GAME SPEED CONTROLLER)
    // ========================================================================
    initSpeedControl: function() {
      const btn = document.getElementById("ribbonSpeedBtn");
      if (!btn) return;
      const speeds = [1, 1.5, 2, 3];

      const updateBtnUI = () => {
        const cur = window.__gameSpeed || 1;
        const txt = document.getElementById("ribbonSpeedTxt");
        if (txt) txt.textContent = cur + "x";
        btn.classList.toggle("active-speed", cur > 1);
      };

      btn.onclick = () => {
        const cur = window.__gameSpeed || 1;
        let nextIdx = speeds.indexOf(cur) + 1;
        if (nextIdx >= speeds.length || nextIdx < 0) nextIdx = 0;
        const newSpeed = speeds[nextIdx];

        const JX = getJX();
        if (JX && typeof JX.setSpeed === "function") {
          JX.setSpeed(newSpeed);
        } else {
          window.__gameSpeed = newSpeed;
          try { localStorage.setItem("jx_game_speed", newSpeed); } catch {}
        }
        updateBtnUI();
        if (JX && JX.toast) JX.toast(`⚡ Tốc độ chiến đấu: ${newSpeed}x`);
      };

      updateBtnUI();
      console.log("[ModernLayout] Bước 4: Điều khiển Tốc Độ Trận Đánh đã sẵn sàng.");
    },

    // ========================================================================
    // BƯỚC 5: 💾 QUẢN LÝ SAO LƯU LƯU TRỮ 1-CLICK (OFFLINE SAVE MANAGER)
    // ========================================================================
    initSaveManager: function() {
      const btn = document.getElementById("ribbonSaveBtn");
      if (btn) {
        btn.onclick = () => this.openSaveModal();
      }

      // Tự động tạo snapshot định kỳ mỗi 30 phút
      setInterval(() => {
        this.createAutoSnapshot();
      }, 30 * 60 * 1000);

      // Tạo snapshot đầu tiên sau 5 giây nếu nhân vật đã load
      setTimeout(() => {
        this.createAutoSnapshot(true);
      }, 5000);

      console.log("[ModernLayout] Bước 5: Quản lý Sao Lưu 1-Click & Auto-Snapshots đã kích hoạt.");
    },

    getSnapshots: function() {
      try {
        const raw = localStorage.getItem("jx_offline_snapshots");
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    saveSnapshots: function(list) {
      try {
        localStorage.setItem("jx_offline_snapshots", JSON.stringify(list));
      } catch (e) {
        console.warn("[SaveManager] Lỗi lưu snapshots:", e);
      }
    },

    createAutoSnapshot: function(isInitial) {
      const JX = getJX();
      if (!JX || !JX.S || !JX.S.name) return;
      const l = JX.S;

      const list = this.getSnapshots();
      // Nếu là khởi động và đã có snapshot trong vòng 20 phút qua thì bỏ qua
      if (isInitial && list.length > 0) {
        const last = list[0];
        if (Date.now() - (last.id || 0) < 20 * 60 * 1000) return;
      }

      const snap = {
        id: Date.now(),
        date: new Date().toLocaleString("vi-VN"),
        name: l.name,
        lvl: l.lvl || 1,
        gold: l.gold || 0,
        stage: l.stage || 1,
        rawChar: typeof JX.pack === "function" ? JX.pack() : null,
        htz: localStorage.getItem("jx_htz_features_v1"),
        pk: localStorage.getItem("pk_system_stats"),
        autoSell: localStorage.getItem("jx_smart_autosell_config_v1")
      };

      list.unshift(snap);
      if (list.length > 5) list.length = 5; // Giữ tối đa 5 bản phục hồi gần nhất
      this.saveSnapshots(list);
    },

    openSaveModal: function() {
      let modal = document.getElementById("saveManagerModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "saveManagerModal";
        modal.className = "save-modal-overlay hidden";
        document.body.appendChild(modal);
      }

      this.renderSaveModalContent();
      modal.classList.remove("hidden");
    },

    closeSaveModal: function() {
      const modal = document.getElementById("saveManagerModal");
      if (modal) modal.classList.add("hidden");
    },

    renderSaveModalContent: function() {
      const modal = document.getElementById("saveManagerModal");
      if (!modal) return;

      const JX = getJX();
      const l = JX ? JX.S : null;
      const snapshots = this.getSnapshots();

      // Danh sách Giftcode Offline có sẵn
      const GIFTCODES = [
        { code: "OFFLINE", desc: "50.000.000 Lượng + 10.000 KNB + 50 giờ Bạch Câu Hoàn" },
        { code: "VOLAM2026", desc: "5.000.000 Lượng + 1.000 KNB + 10 giờ Bạch Câu Hoàn" },
        { code: "TANTHU", desc: "5.000.000 Lượng + 1.000 KNB + 10 giờ Bạch Câu Hoàn" },
        { code: "VIP999", desc: "10.000.000 Lượng + 2.000 KNB + 20 giờ Bạch Câu Hoàn" },
        { code: "VIP888", desc: "10.000.000 Lượng + 2.000 KNB + 20 giờ Bạch Câu Hoàn" },
        { code: "VIP666", desc: "10.000.000 Lượng + 2.000 KNB + 20 giờ Bạch Câu Hoàn" }
      ];

      const redeemed = (l && Array.isArray(l.gCodes)) ? l.gCodes : [];

      modal.innerHTML = `
        <div class="save-modal-box">
          <div class="save-modal-header">
            <div class="save-modal-title">
              <span>💾</span>
              <span>QUẢN LÝ LƯU FILE & ĐIỂM PHỤC HỒI OFFLINE</span>
            </div>
            <button class="save-modal-close" id="saveModalCloseBtn">✕</button>
          </div>

          <div class="save-modal-body">
            <!-- 1. Tùy chọn sao lưu file JSON -->
            <div class="save-section">
              <div class="save-sec-title">📦 XUẤT / NHẬP FILE DỮ LIỆU NHÂN VẬT (.JSON)</div>
              <p class="save-sec-desc">
                Xuất toàn bộ thông tin nhân vật, võ công, kinh mạch, thú cưng và cài đặt ra file để lưu trữ an toàn trên máy tính hoặc chuyển sang máy khác.
              </p>
              <div class="save-action-row">
                <button class="btn on" id="btnExportSaveJson">📥 Xuất File Lưu (.json)</button>
                <button class="btn" id="btnTriggerImportJson">📂 Nhập File Lưu (.json)</button>
                <button class="btn highlight-speed" id="btnManualSnap">📸 Tạo Điểm Phục Hồi Ngay</button>
                <input type="file" id="fileSaveInput" accept=".json" style="display:none;">
              </div>
            </div>

            <!-- 2. Danh sách các bản phục hồi (Snapshots) -->
            <div class="save-section">
              <div class="save-sec-title">⏱️ ĐIỂM PHỤC HỒI TỰ ĐỘNG GẦN ĐÂY (${snapshots.length}/5)</div>
              <p class="save-sec-desc">
                Hệ thống tự động lưu bản sao lưu dự phòng mỗi 30 phút. Bạn có thể khôi phục lại bất kỳ lúc nào nếu xảy ra sự cố ép xịt đồ hoặc bán nhầm vật phẩm.
              </p>
              <div class="snap-list">
                ${snapshots.length === 0 ? `<div class="snap-empty">Chưa có bản phục hồi nào. Nhấp "Tạo Điểm Phục Hồi Ngay" ở trên để lưu.</div>` : ""}
                ${snapshots.map((s, idx) => `
                  <div class="snap-item">
                    <div class="snap-info">
                      <div class="snap-name"><b>${s.name || "Nhân Vật"}</b> (Cấp ${s.lvl || 1}) · Bản đồ ${s.stage || 1}</div>
                      <div class="snap-meta">Thời điểm: ${s.date} · Ngân lượng: ${(s.gold || 0).toLocaleString("vi-VN")} Lượng</div>
                    </div>
                    <button class="btn sm on" data-snap-restore="${s.id}">Khôi Phục</button>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- 3. Cài đặt trợ thủ sinh tồn AFK -->
            <div class="save-section">
              <div class="save-sec-title">🛡️ TRỢ THỦ CHIẾN ĐẤU & SINH TỒN AFK</div>
              <div class="save-toggle-item">
                <label for="checkSurvivalAssistant">
                  <b>Tự động dùng thuốc, cứu nguy khẩn cấp & Tự trở lại bãi luyện công</b>
                  <span>Bơm máu khi HP &lt; 45%, tự dùng Thổ Địa Phù khi HP &lt; 18%, và tự động bấm "Trở lại bãi" sau khi hồi phục trong thành.</span>
                </label>
                <input type="checkbox" id="checkSurvivalAssistant" ${this.survivalEnabled ? "checked" : ""}>
              </div>
            </div>

            <!-- 4. Mã Quà Tặng Offline -->
            <div class="save-section">
              <div class="save-sec-title">🎁 MÃ QUÀ TẶNG OFFLINE (GIFTCODES)</div>
              <div class="gift-grid">
                ${GIFTCODES.map(g => {
                  const isUsed = redeemed.includes(g.code);
                  return `
                    <div class="gift-card">
                      <div class="gift-head">
                        <span class="gift-code">${g.code}</span>
                        <span class="gift-status ${isUsed ? "used" : "ready"}">${isUsed ? "✓ Đã Nhận" : "Chưa Nhận"}</span>
                      </div>
                      <div class="gift-desc">${g.desc}</div>
                      <button class="btn sm ${isUsed ? "" : "on"}" data-gift-code="${g.code}" ${isUsed ? "disabled" : ""}>
                        ${isUsed ? "Đã Dùng" : "Nhận Quà ➔"}
                      </button>
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          </div>
        </div>
      `;

      // Gắn sự kiện đóng modal
      document.getElementById("saveModalCloseBtn").onclick = () => this.closeSaveModal();

      // Nút xuất file JSON
      document.getElementById("btnExportSaveJson").onclick = () => this.exportSaveFile();

      // Nút kích hoạt nhập file JSON
      const fileInput = document.getElementById("fileSaveInput");
      document.getElementById("btnTriggerImportJson").onclick = () => fileInput.click();
      fileInput.onchange = (e) => this.importSaveFile(e);

      // Nút tạo snapshot thủ công ngay lập tức
      document.getElementById("btnManualSnap").onclick = () => {
        this.createAutoSnapshot();
        if (JX && JX.toast) JX.toast("📸 Đã tạo điểm phục hồi mới thành công!");
        this.renderSaveModalContent();
      };

      // Nút khôi phục snapshot
      modal.querySelectorAll("[data-snap-restore]").forEach(btn => {
        btn.onclick = () => {
          const snapId = parseInt(btn.dataset.snapRestore, 10);
          this.restoreSnapshot(snapId);
        };
      });

      // Toggle trợ thủ sinh tồn
      const checkSurv = document.getElementById("checkSurvivalAssistant");
      if (checkSurv) {
        checkSurv.onchange = (e) => {
          this.survivalEnabled = !!e.target.checked;
          try { localStorage.setItem("jx_survival_assistant", this.survivalEnabled ? "1" : "0"); } catch {}
          if (JX && JX.toast) {
            JX.toast(this.survivalEnabled ? "🛡️ Đã bật Trợ Thủ Sinh Tồn & Tự Trở Lại Bãi!" : "Đã tắt Trợ Thủ Sinh Tồn.");
          }
        };
      }

      // Nút nhận Giftcode
      modal.querySelectorAll("[data-gift-code]").forEach(btn => {
        btn.onclick = () => {
          const code = btn.dataset.giftCode;
          this.claimGiftcode(code);
        };
      });
    },

    exportSaveFile: function() {
      const JX = getJX();
      if (!JX || !JX.S) {
        alert("Không thể xuất file: Dữ liệu game chưa sẵn sàng.");
        return;
      }
      const l = JX.S;

      const backupObj = {
        version: "volamidle-offline-v1",
        exportedAt: new Date().toISOString(),
        characterName: l.name,
        characterLevel: l.lvl,
        characterData: typeof JX.pack === "function" ? JX.pack() : null,
        htzState: localStorage.getItem("jx_htz_features_v1"),
        pkState: localStorage.getItem("pk_system_stats"),
        autoSellConfig: localStorage.getItem("jx_smart_autosell_config_v1"),
        gameSpeed: window.__gameSpeed || 1
      };

      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const safeName = (l.name || "nhanvat").replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, "_");
      const safeDate = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `volam_save_${safeName}_lv${l.lvl}_${safeDate}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (JX.toast) JX.toast("📥 Đã xuất file lưu trữ thành công!");
    },

    importSaveFile: function(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!parsed.characterData) {
            alert("File không hợp lệ: Không tìm thấy dữ liệu nhân vật!");
            return;
          }

          if (confirm(`Bạn có chắc muốn khôi phục nhân vật "${parsed.characterName || "Vô danh"}" (Cấp ${parsed.characterLevel || 1})? Dữ liệu hiện tại sẽ được thay thế.`)) {
            // Lưu dữ liệu vào slot hiện tại
            const slot = sessionStorage.getItem("jxidle_in") || "0";
            const charKey = "jxidle_char_" + slot;

            localStorage.setItem(charKey, parsed.characterData);
            if (parsed.htzState) localStorage.setItem("jx_htz_features_v1", parsed.htzState);
            if (parsed.pkState) localStorage.setItem("pk_system_stats", parsed.pkState);
            if (parsed.autoSellConfig) localStorage.setItem("jx_smart_autosell_config_v1", parsed.autoSellConfig);
            if (parsed.gameSpeed) localStorage.setItem("jx_game_speed", parsed.gameSpeed);

            alert("Khôi phục thành công! Trang web sẽ tự động làm mới để tải dữ liệu.");
            location.reload();
          }
        } catch (err) {
          alert("Lỗi khi đọc file sao lưu: " + (err.message || String(err)));
        }
      };
      reader.readAsText(file);
    },

    restoreSnapshot: function(snapId) {
      const snapshots = this.getSnapshots();
      const snap = snapshots.find(s => s.id === snapId);
      if (!snap || !snap.rawChar) {
        alert("Bản phục hồi không hợp lệ hoặc đã bị xóa!");
        return;
      }

      if (confirm(`Khôi phục lại thời điểm ${snap.date} cho nhân vật "${snap.name}" (Cấp ${snap.lvl})?`)) {
        const slot = sessionStorage.getItem("jxidle_in") || "0";
        const charKey = "jxidle_char_" + slot;

        localStorage.setItem(charKey, snap.rawChar);
        if (snap.htz) localStorage.setItem("jx_htz_features_v1", snap.htz);
        if (snap.pk) localStorage.setItem("pk_system_stats", snap.pk);
        if (snap.autoSell) localStorage.setItem("jx_smart_autosell_config_v1", snap.autoSell);

        alert("Đã khôi phục thành công! Trang web sẽ tải lại.");
        location.reload();
      }
    },

    claimGiftcode: function(code) {
      const JX = getJX();
      if (!JX || !JX.S) return;
      const l = JX.S;

      if (!l.gCodes) l.gCodes = [];
      if (l.gCodes.includes(code)) {
        if (JX.toast) JX.toast("Mã quà tặng này bạn đã nhận rồi!");
        return;
      }

      // Mô phỏng nhận mã quà tặng offline tương thích với logic gốc của game
      l.gCodes.push(code);
      let giftGold = 0, giftKnb = 0, giftBch = 0;
      let giftDesc = "";

      if (code === "OFFLINE" || code === "VOLAMOFFLINE") {
        giftGold = 50000000; giftKnb = 10000; giftBch = 50 * 3600;
        giftDesc = "50 triệu Lượng + 10.000 KNB + 50h Bạch Câu Hoàn";
      } else if (code === "VOLAM2026" || code === "TANTHU") {
        giftGold = 5000000; giftKnb = 1000; giftBch = 10 * 3600;
        giftDesc = "5 triệu Lượng + 1.000 KNB + 10h Bạch Câu Hoàn";
      } else if (code === "VIP999" || code === "VIP888" || code === "VIP666") {
        giftGold = 10000000; giftKnb = 2000; giftBch = 20 * 3600;
        giftDesc = "10 triệu Lượng + 2.000 KNB + 20h Bạch Câu Hoàn";
      }

      l.gold = (l.gold || 0) + giftGold;
      l.knb = (l.knb || 0) + giftKnb;
      if (giftBch > 0) {
        l.bch = Math.max(0, l.bch || 0) + giftBch;
      }

      if (JX.R) JX.R.dirty = true;
      if (typeof JX.save === "function") JX.save();

      if (JX.banner) JX.banner("🎁 NHẬN QUÀ THÀNH CÔNG!", giftDesc, 4);
      if (JX.log) JX.log(`<b style="color:#ffd700">🎁 [GIFTCODE]:</b> Đã kích hoạt mã <b>${code}</b>! Nhận: <b style="color:#ffd24a">${giftDesc}</b>`);
      if (JX.toast) JX.toast(`🎁 Đã nhận quà mã ${code}!`);

      this.renderSaveModalContent();
    },

    // ========================================================================
    // BƯỚC 6: 🛡️ TRỢ THỦ CHIẾN ĐẤU & SINH TỒN AFK (SURVIVAL ASSISTANT)
    // ========================================================================
    initSurvivalAssistant: function() {
      const saved = localStorage.getItem("jx_survival_assistant");
      // Mặc định TẮT (opt-in) để không can thiệp ngoài ý muốn của người chơi
      this.survivalEnabled = saved === "1";

      setInterval(() => {
        if (!this.survivalEnabled) return;
        const JX = getJX();
        if (!JX || !JX.S || !JX.R) return;
        const h = JX.R;
        const l = JX.S;
        const P = h.P || {};

        // Không can thiệp nếu chết, trong thành, hoặc trong các hoạt động PK / Phó bản / Liên Đấu / Tống Kim
        if (!l.fac || h.deadT > 0 || h.town || h.inSafe || h.dg || h.tower || h.liendau || h.tongkim || h.pkBoss || window.__pkActive) return;

        const curHp = h.life || 0;
        const maxHp = P.life || 1;
        const hpPct = (curHp / maxHp) * 100;

        const curMp = h.mana || 0;
        const maxMp = P.mana || 1;
        const mpPct = (curMp / maxMp) * 100;

        // 1. Tự động dùng Thuốc Sinh Lực khi HP < 45%
        if (hpPct < 45 && (!h.hot || !h.hot.lifeT || h.hot.lifeT <= 0)) {
          if (typeof JX.usePotion === "function") {
            JX.usePotion("life");
          } else {
            const bHp = document.getElementById("bHp");
            if (bHp) bHp.click();
          }
        }

        // 2. Tự động dùng Thuốc Nội Lực khi MP < 25%
        if (mpPct < 25 && (!h.hot || !h.hot.manaT || h.hot.manaT <= 0)) {
          if (typeof JX.usePotion === "function") {
            JX.usePotion("mana");
          } else {
            const bMp = document.getElementById("bMp");
            if (bMp) bMp.click();
          }
        }
      }, 1000);

      console.log("[ModernLayout] Bước 6: Trợ Thủ Sinh Tồn đã sẵn sàng (Mặc định tắt, an toàn tuyệt đối).");
    },

    // Đồng bộ chấm đỏ và trạng thái giao diện định kỳ
    syncState: function() {
      // Đồng bộ chấm đỏ phúc lợi từ giftBtn sang ribbonGiftBtn
      const giftBtn = document.getElementById("giftBtn");
      const ribbonDot = document.getElementById("ribbonGiftDot");
      if (giftBtn && ribbonDot) {
        const hasGift = giftBtn.classList.contains("on");
        ribbonDot.classList.toggle("on", hasGift);
      }

      this.updateWeatherButton();

      if (window.__smartAutoSell && typeof window.__smartAutoSell.updateUI === "function") {
        window.__smartAutoSell.updateUI();
      }
    }
  };

  // Tự động khởi chạy khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ModernLayout.init());
  } else {
    ModernLayout.init();
  }

  window.ModernLayout = ModernLayout;
})();
