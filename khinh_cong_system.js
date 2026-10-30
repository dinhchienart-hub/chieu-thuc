/**
 * ============================================================================
 * VÕ LÂM IDLE — HỆ THỐNG KHINH CÔNG (DODGE / DASH / AIR JUMP)
 * Tham chiếu chuẩn: volam.vinarpg.com (Build 20261029)
 * ============================================================================
 * - 3 lượt bay (charges: 3/3), hồi 1 lượt mỗi 15 giây.
 * - Phím tắt Space hoặc bấm nút [Khinh công] trên thanh điều khiển.
 * - Quỹ đạo Parabol trên không (z-axis), đẩy ảnh bóng mờ vào h.dashTrail.
 * - Giảm 80% mọi sát thương phải chịu khi đang ở trên không.
 * - Đồng bộ hoàn hảo hero._px / hero._py và chặn auto-combat giật lag.
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[KhinhCong] Đang khởi chạy hệ thống Khinh Công Võ Lâm Chuẩn...");

  const CONFIG = {
    maxCharges: 3,
    chargeCd: 15,    // 15 giây hồi 1 lượt
    range: 280,      // Cự ly bay
    minRange: 100,
    reduction: 0.80  // Giảm 80% sát thương khi bay
  };

  function getJX() {
    return window.__JX || null;
  }

  const KhinhCongSystem = {
    charges: CONFIG.maxCharges,
    rechargeT: 0,
    jump: null,      // { sx, sy, tx, ty, t, dur, h, ghostT }
    inited: false,

    init: function() {
      if (this.inited) return;
      this.inited = true;

      this.injectButton();
      this.bindEvents();
      this.startLoop();

      console.log("[KhinhCong] Kích hoạt thành công: Phím Space / Nút [Khinh công] (Đã tối ưu chuyển động 0 độ trễ)");
    },

    injectButton: function() {
      const pad = document.getElementById("pad");
      if (!pad || document.getElementById("bKhinhCong")) return;

      const btn = document.createElement("button");
      btn.className = "pbtn khinh-cong";
      btn.id = "bKhinhCong";
      btn.type = "button";
      btn.setAttribute("aria-label", "Khinh công");
      btn.title = "Khinh c?ng ? 3/3 l??t ? h?i 1 l??t m?i 15s ? gi?m 80% s?t th??ng khi bay ? Ph?m Space";
      btn.innerHTML = `
        <div class="cd"></div>
        <b class="charges">???</b>
        <span>Khinh c?ng</span>
        <small class="timer">Space</small>
      `;

      // Đặt vào cụm giữa (cạnh nút chiêu chính #bMain) để giữ hàng thuốc 3 nút nguyên vẹn
      const hbList = pad.querySelectorAll(".hb");
      const centerHb = hbList.length >= 2 ? hbList[1] : (hbList[0] || pad);
      const bMain = centerHb.querySelector("#bMain");

      if (bMain) {
        centerHb.insertBefore(btn, bMain); // Nằm ngay trước nút công chính
      } else {
        centerHb.appendChild(btn);
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.executeJump();
      });

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.executeJump();
      }, { passive: false });
    },

    bindEvents: function() {
      // Bắt phím Space
      window.addEventListener("keydown", (e) => {
        if (e.code === "Space" || e.key === " ") {
          // Bỏ qua nếu đang gõ chữ trong input, textarea
          const active = document.activeElement;
          if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
            return;
          }
          e.preventDefault();
          this.executeJump();
        }
      });
    },

    isJumping: function() {
      return !!this.jump;
    },

    executeJump: function(targetX, targetY) {
      const JX = getJX();
      if (!JX || !JX.H || !JX.R) return false;
      const hero = JX.H;
      const h = JX.R;
      const l = JX.S || {};

      if (h.deadT > 0 || (h.life || 0) <= 0 || hero.stunT > 0 || this.jump) {
        return false;
      }

      if (this.charges <= 0) {
        if (JX.toast) JX.toast(`⚠️ Khinh công đang hồi sau ${Math.ceil(this.rechargeT)}s`);
        return false;
      }

      // 1. Tự động xuống ngựa khi thi triển khinh công
      if (l.ride || hero.ride) {
        l.ride = false;
        hero.ride = false;
        h.dirty = true;
      }

      // 2. Tính điểm đích
      let tx = targetX;
      let ty = targetY;

      if (!Number.isFinite(tx) || !Number.isFinite(ty)) {
        // Hướng theo mục tiêu hoặc hướng nhân vật đang nhìn
        const d = (hero.dir != null ? hero.dir : 0);
        const nx = -Math.sin(d * (Math.PI / 4));
        const ny = Math.cos(d * (Math.PI / 4));

        tx = hero.x + nx * CONFIG.range;
        ty = hero.y + ny * CONFIG.range;

        // Gi? v? tr? trong b?n ?? v? tr?nh v?t c?n
        if (typeof JX.snapWalkable === "function") {
          const snapped = JX.snapWalkable(tx, ty);
          if (Array.isArray(snapped)) {
            tx = snapped[0];
            ty = snapped[1];
          }
        }
      }

      let dx = tx - hero.x;
      let dy = ty - hero.y;
      let dist = Math.hypot(dx, dy);
      if (dist < 1) {
        dx = 1; dy = 0; dist = 1;
      }

      let ux = dx / dist;
      let uy = dy / dist;
      let jumpDist = Math.min(CONFIG.range, Math.max(dist, CONFIG.minRange));

      // Kiểm tra điểm đặt chân an toàn (walkable)
      let landing = null;
      for (let d = jumpDist; d >= 60; d -= 20) {
        let checkX = hero.x + ux * d;
        let checkY = hero.y + uy * d;
        if (typeof JX.walkable === "function") {
          let walk = JX.walkable(checkX, checkY);
          if (walk && Math.abs(walk[0] - checkX) < 10 && Math.abs(walk[1] - checkY) < 10) {
            landing = { x: checkX, y: checkY };
            break;
          }
        } else {
          landing = { x: checkX, y: checkY };
          break;
        }
      }

      if (!landing) {
        landing = { x: hero.x + ux * 80, y: hero.y + uy * 80 };
      }

      // 3. Tiêu hao 1 lượt và khởi động hồi chiêu
      this.charges--;
      if (this.rechargeT <= 0) {
        this.rechargeT = CONFIG.chargeCd;
      }

      const totalDist = Math.hypot(landing.x - hero.x, landing.y - hero.y);
      this.jump = {
        sx: hero.x,
        sy: hero.y,
        tx: landing.x,
        ty: landing.y,
        t: 0,
        dur: 0.32 + totalDist / 920,
        h: 40 + totalDist * 0.18,
        ghostT: 0
      };

      // 4. Triệt tiêu ngay lập tức target để ngắt giằng xé với Auto-combat
      h.moveTo = null;
      h.pickTarget = null;
      h.manTgt = null;
      window.__isKhinhCongJumping = true;

      // 5. Cập nhật tư thế bay và hướng mặt
      hero.face = ux >= 0 ? 1 : -1;
      hero.act = "run";
      hero.actT = 0;

      // Đồng bộ ngay tọa độ vật lý để camera không giật
      hero._px = hero.x;
      hero._py = hero.y;
      hero.px = hero.x;
      hero.py = hero.y;

      // Hiệu ứng âm thanh gió vút
      this.playWooshSound();

      // Cập nhật UI
      this.updateUI();

      return true;
    },

    playWooshSound: function() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        osc.type = "sine";
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); ctx.close(); };
      } catch(e) {}
    },

    startLoop: function() {
      let lastTime = performance.now();

      const loop = (time) => {
        const dt = Math.min(0.1, (time - lastTime) / 1000);
        lastTime = time;

        const JX = getJX();
        const hero = JX ? JX.H : null;
        const h = JX ? JX.R : null;

        // 1. Hồi chiêu từng lượt
        if (this.charges < CONFIG.maxCharges) {
          this.rechargeT -= dt;
          if (this.rechargeT <= 0) {
            this.charges++;
            if (this.charges < CONFIG.maxCharges) {
              this.rechargeT += CONFIG.chargeCd;
            } else {
              this.rechargeT = 0;
            }
          }
          this.updateUI();
        }

        // 2. Di chuyển quỹ đạo nhảy Parabol trên không
        if (this.jump && hero && h) {
          const j = this.jump;
          j.t += dt;
          const r = Math.min(1, j.t / j.dur);

          // Cập nhật tọa độ mặt phẳng (X, Y)
          hero.x = j.sx + (j.tx - j.sx) * r;
          hero.y = j.sy + (j.ty - j.sy) * r;

          // Cập nhật độ cao trên không (Z) theo hình parabol: 4 * h * r * (1 - r)
          const zHeight = Math.max(0, 4 * j.h * r * (1 - r));
          hero.z = zHeight;

          // ĐỒNG BỘ TUYỆT ĐỐI _px, _py, px, py để triệt tiêu 100% rung lắc camera
          hero._px = hero.x;
          hero._py = hero.y;
          hero.px = hero.x;
          hero.py = hero.y;

          // Luôn giữ trạng thái bay và triệt tiêu pathing
          hero.act = "run";
          h.moveTo = null;
          h.pickTarget = null;
          window.__isKhinhCongJumping = true;

          // Thêm tàn ảnh vào hệ thống dashTrail chuẩn của game
          j.ghostT -= dt;
          if (j.ghostT <= 0) {
            j.ghostT = 0.04;
            h.dashTrail = h.dashTrail || [];
            h.dashTrail.push({
              x: hero.x,
              y: hero.y,
              z: zHeight,
              dir: hero.dir || 0,
              t: 0
            });
          }

          if (r >= 1) {
            // Tiếp đất an toàn
            hero.x = j.tx;
            hero.y = j.ty;
            hero._px = hero.x;
            hero._py = hero.y;
            hero.px = hero.x;
            hero.py = hero.y;
            hero.z = 0;
            hero.act = "st";
            hero.actT = 0;
            h.moveTo = null;
            h.pickTarget = null;

            this.jump = null;
            window.__isKhinhCongJumping = false;
            this.updateUI();
          }
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    },

    updateUI: function() {
      const btn = document.getElementById("bKhinhCong");
      if (!btn) return;

      const chargeDots = "?".repeat(this.charges) + "?".repeat(CONFIG.maxCharges - this.charges);
      const chargesEl = btn.querySelector(".charges");
      if (chargesEl) chargesEl.textContent = chargeDots;

      const timerEl = btn.querySelector(".timer");
      if (timerEl) {
        if (this.isJumping()) {
          timerEl.textContent = "?ang bay";
        } else if (this.rechargeT > 0 && this.charges < CONFIG.maxCharges) {
          timerEl.textContent = `${Math.ceil(this.rechargeT)}s`;
        } else {
          timerEl.textContent = "Space";
        }
      }

      const cdEl = btn.querySelector(".cd");
      if (cdEl && this.rechargeT > 0 && this.charges < CONFIG.maxCharges) {
        const pct = Math.round((this.rechargeT / CONFIG.chargeCd) * 100);
        cdEl.style.setProperty("--p", `${pct}%`);
      } else if (cdEl) {
        cdEl.style.removeProperty("--p");
      }

      btn.classList.toggle("recharging", this.charges <= 0);
      btn.classList.toggle("jumping", this.isJumping());
      btn.disabled = this.isJumping() || this.charges <= 0;
    }
  };

  // Khởi tạo khi game sẵn sàng
  const checkReady = setInterval(() => {
    if (window.__JX && window.__JX.H) {
      clearInterval(checkReady);
      KhinhCongSystem.init();
    }
  }, 300);

  window.KhinhCongSystem = KhinhCongSystem;

})();
