/**
 * ============================================================================
 * VÕ LÂM IDLE OFFLINE — BATCH E EXTENSIONS
 * ============================================================================
 * E1. HỆ THỐNG GIFTCODE OFFLINE
 * E2. BẢNG TIN TỨC & CHANGELOG
 * E3. HỆ THỐNG THÀNH TÍCH (ACHIEVEMENT SYSTEM)
 * E5. NHIỆM VỤ HÀNG NGÀY MỞ RỘNG (DAILY QUEST SYSTEM)
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[BatchE] Đang khởi chạy hệ thống mở rộng Batch E...");

  function getJX() {
    return window.__JX || null;
  }

  function fmtNum(n) {
    if (n == null || isNaN(n)) return "0";
    if (n >= 1000000000) return (n / 1000000000).toFixed(1).replace(/\.0$/, "") + " tỷ";
    if (n >= 1000000)    return (n / 1000000).toFixed(1).replace(/\.0$/, "") + " triệu";
    if (n >= 10000)      return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return Math.round(n).toLocaleString("vi-VN");
  }

  // ============================================================================
  // E1. HỆ THỐNG GIFTCODE OFFLINE
  // ============================================================================
  const GiftcodeSystem = {
    _usedKey: "jx_used_giftcodes_v1",

    CODES: {
      "OFFLINE":        { gold: 50000000, knb: 10000, bch: 50,  label: "Gói Khởi Nghiệp" },
      "VOLAMOFFLINE":   { gold: 50000000, knb: 10000, bch: 50,  label: "Gói Khởi Nghiệp" },
      "VOLAM2026":      { gold: 5000000,  knb: 1000,  bch: 10,  label: "Gói 2026" },
      "TANTHU":         { gold: 5000000,  knb: 1000,  bch: 10,  label: "Tân Thư Khai Phái" },
      "VIP999":         { gold: 10000000, knb: 2000,  bch: 20,  hkbox: 1, label: "VIP 999" },
      "VIP888":         { gold: 10000000, knb: 2000,  bch: 20,  label: "VIP 888" },
      "VIP666":         { gold: 10000000, knb: 2000,  bch: 20,  label: "VIP 666" },
      "TANGTHU2026":    { attrPts: 20,    knb: 500,   shards: 5, label: "Tặng Thư 2026" },
      "KINHBACH":       { knb: 1000, shards: 15, godwep: 1,      label: "Kinh Bạch Thần Binh" },
      "VOLAMIDLE":      { gold: 20000000, knb: 5000,  shards: 20, label: "Võ Lâm Idle Fan" },
      "HOCHOI":         { gold: 3000000,  knb: 500,   bch: 5,   label: "Hỗ Trợ Học Chơi" },
      "THANHCONG":      { attrPts: 50,   knb: 3000,  shards: 30, label: "Đại Thành Công" },
      "MIENNAM":        { gold: 8000000,  knb: 1500,  shards: 10, label: "Miền Nam Hào Kiệt" },
      "MIENTRUNG":      { gold: 8000000,  knb: 1500,  shards: 10, label: "Miền Trung Hào Kiệt" },
      "MIENBAC":        { gold: 8000000,  knb: 1500,  shards: 10, label: "Miền Bắc Hào Kiệt" },
      "MONG2026":       { gold: 5000000,  knb: 888,   attrPts: 8, label: "Chúc Mừng Năm Mới" }
    },

    _getUsed: function() {
      try { return JSON.parse(localStorage.getItem(this._usedKey) || "[]"); } catch(e) { return []; }
    },

    _saveUsed: function(arr) {
      localStorage.setItem(this._usedKey, JSON.stringify(arr));
    },

    redeem: function(rawCode) {
      const code = (rawCode || "").trim().toUpperCase();
      if (!code) return { ok: false, msg: "Vui lòng nhập mã Giftcode!" };

      const used = this._getUsed();
      if (used.indexOf(code) !== -1) return { ok: false, msg: "⚠️ Mã \"" + code + "\" đã được sử dụng rồi!" };

      const reward = this.CODES[code];
      if (!reward) return { ok: false, msg: "❌ Mã \"" + code + "\" không hợp lệ hoặc đã hết hạn." };

      const JX = getJX();
      const l = JX ? JX.S : null;
      if (!l) return { ok: false, msg: "Không tìm thấy nhân vật! Hãy thử lại sau." };

      var lines = [];

      if (reward.gold)    { l.gold    = (l.gold    || 0) + reward.gold;    lines.push("+" + fmtNum(reward.gold) + " Ngân Lượng"); }
      if (reward.knb)     { l.knb     = (l.knb     || 0) + reward.knb;  l.knbV = (l.knbV || 0) + reward.knb;  lines.push("+" + reward.knb + " KNB"); }
      if (reward.attrPts) { l.attrPts = (l.attrPts || 0) + reward.attrPts; lines.push("+" + reward.attrPts + " Tiềm Năng"); }
      if (reward.shards && window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
        window.HtzItemGenerator.addHkShards(reward.shards);
        lines.push("+" + reward.shards + " Mảnh Hoàng Kim");
      }
      if (reward.hkbox && window.HtzItemGenerator && typeof window.HtzItemGenerator.makeHkItem === "function") {
        var hkItem = window.HtzItemGenerator.makeHkItem(l.fac, l.lvl);
        if (hkItem && l.inv && l.inv.length < (JX.invMax || 60)) l.inv.push(hkItem);
        lines.push("+1 Trang Bị Hoàng Kim");
      }
      if (reward.godwep && window.HtzItemGenerator && typeof window.HtzItemGenerator.makeGodWeapon === "function") {
        var godW = window.HtzItemGenerator.makeGodWeapon(l.fac, l.lvl);
        if (godW && l.inv && l.inv.length < (JX.invMax || 60)) l.inv.push(godW);
        lines.push("+1 Thần Binh 6 Dòng");
      }
      if (reward.bch) {
        // Bạch Câu Hoàn: offline time reward (hours)
        var offlineBonus = (reward.bch * 3600);
        var stored = parseInt(localStorage.getItem("jx_offline_bonus_sec") || "0", 10);
        localStorage.setItem("jx_offline_bonus_sec", stored + offlineBonus);
        lines.push("+" + reward.bch + "h Bạch Câu Hoàn");
      }

      // Ghi nhận đã dùng
      used.push(code);
      this._saveUsed(used);

      var h = JX ? (JX.R || window.h) : window.h;
      if (h) h.dirty = true;

      // Log game
      if (JX && JX.log) {
        JX.log('<b style="color:#ffd700">🎁 [GIFTCODE]:</b> Mã <b>' + code + '</b> — ' + (reward.label || "") + ' · Nhận: <b>' + lines.join(", ") + '</b>');
      }

      // Trigger achievement check
      if (window.AchievementSystem) window.AchievementSystem.check("giftcode");

      return { ok: true, msg: "🎉 Đổi thành công! Nhận: " + lines.join(", "), reward: reward };
    },

    openModal: function() {
      var existing = document.getElementById("giftcodeModal");
      if (existing) { existing.classList.remove("hidden"); this._renderModal(existing); return; }

      var modal = document.createElement("div");
      modal.id = "giftcodeModal";
      modal.className = "be-modal-overlay";
      modal.innerHTML = this._buildHTML();
      document.body.appendChild(modal);
      this._bindEvents(modal);
    },

    _buildHTML: function() {
      var used = this._getUsed();
      return '<div class="be-modal-box" style="max-width:460px;">' +
        '<div class="be-modal-header">' +
        '  <span>🎁 Nhập Giftcode</span>' +
        '  <button class="be-modal-close" id="gcModalClose">✕</button>' +
        '</div>' +
        '<div class="be-modal-body">' +
        '  <div style="text-align:center;margin-bottom:14px;">' +
        '    <p style="color:#ced4da;font-size:13px;margin:0 0 12px;">Nhập mã Giftcode để nhận quà đặc biệt từ Võ Lâm Idle Offline.</p>' +
        '    <div style="display:flex;gap:8px;">' +
        '      <input type="text" id="gcInput" placeholder="Nhập mã code (VD: OFFLINE)" style="flex:1;padding:10px 12px;background:#1a1a2e;border:1px solid #444;border-radius:6px;color:#fff;font-size:14px;text-transform:uppercase;" />' +
        '      <button id="gcRedeemBtn" style="padding:10px 18px;background:linear-gradient(135deg,#ffd700,#ff8c00);border:none;border-radius:6px;color:#000;font-weight:700;cursor:pointer;font-size:14px;">Đổi</button>' +
        '    </div>' +
        '    <div id="gcResult" style="margin-top:12px;min-height:32px;font-size:13px;padding:8px 12px;border-radius:6px;display:none;"></div>' +
        '  </div>' +
        '  <div style="border-top:1px solid #333;padding-top:12px;">' +
        '    <div style="font-size:11px;color:#888;margin-bottom:8px;">📋 Mã đã dùng (' + used.length + '/' + Object.keys(this.CODES).length + '):</div>' +
        '    <div id="gcUsedList" style="display:flex;flex-wrap:wrap;gap:4px;">' +
        (used.length ? used.map(function(c){ return '<span style="background:#2a2a3e;padding:2px 8px;border-radius:4px;font-size:11px;color:#888;">' + c + '</span>'; }).join("") : '<span style="color:#555;font-size:11px;">Chưa sử dụng mã nào.</span>') +
        '    </div>' +
        '  </div>' +
        '  <div style="margin-top:12px;padding:10px;background:#0f1520;border-radius:6px;">' +
        '    <div style="font-size:11px;color:#ffd700;margin-bottom:4px;">💡 Gợi ý mã miễn phí:</div>' +
        '    <div style="font-size:11px;color:#888;">OFFLINE · VOLAM2026 · VIP999 · HOCHOI · VOLAMIDLE</div>' +
        '  </div>' +
        '</div>' +
        '</div>';
    },

    _renderModal: function(modal) {
      modal.innerHTML = this._buildHTML();
      this._bindEvents(modal);
    },

    _bindEvents: function(modal) {
      var self = this;
      var closeBtn = document.getElementById("gcModalClose");
      if (closeBtn) closeBtn.onclick = function() { modal.classList.add("hidden"); };
      modal.onclick = function(e) { if (e.target === modal) modal.classList.add("hidden"); };

      var redeemBtn = document.getElementById("gcRedeemBtn");
      var input = document.getElementById("gcInput");
      var result = document.getElementById("gcResult");

      function doRedeem() {
        var code = input ? input.value : "";
        var res = self.redeem(code);
        if (result) {
          result.style.display = "block";
          result.style.background = res.ok ? "#1a3a1a" : "#2a1a1a";
          result.style.color = res.ok ? "#6fd46a" : "#ff6b6b";
          result.style.border = "1px solid " + (res.ok ? "#2d5a2d" : "#5a2d2d");
          result.textContent = res.msg;
        }
        if (res.ok && input) input.value = "";
        // Re-render used list
        setTimeout(function() { self._renderModal(modal); }, 800);
      }

      if (redeemBtn) redeemBtn.onclick = doRedeem;
      if (input) {
        input.onkeydown = function(e) { if (e.key === "Enter") doRedeem(); };
        // Auto uppercase
        input.oninput = function() { input.value = input.value.toUpperCase(); };
        setTimeout(function() { if (input) input.focus(); }, 200);
      }
    }
  };

  // ============================================================================
  // E2. BẢNG TIN TỨC & CHANGELOG
  // ============================================================================
  const NewsSystem = {
    _seenKey: "jx_news_seen_v1",

    NEWS: [
      {
        v: "Batch E", date: "2026-10-29", hot: true,
        title: "🎁 Tính Năng Mới: Giftcode, Thành Tích & Nhiệm Vụ Ngày!",
        body: "Thêm hệ thống nhập Giftcode offline (thử: OFFLINE, VIP999), Bảng Thành Tích 15 cột mốc, Nhiệm Vụ Hàng Ngày 6 task reset lúc 0:00, và Bảng Tin Tức này!"
      },
      {
        v: "Batch D", date: "2026-10-29",
        title: "⚔️ Liên Đấu & Tống Kim nâng cấp lớn",
        body: "Liên Đấu: Thưởng milestone Tứ Kết/Bán Kết, thưởng an ủi khi thua, preview đối thủ trước trận, thanh tiến trình vòng đấu. Tống Kim: Đại Nguyên Soái sóng 5 mạnh hơn 2.5x, banner chiến trường mỗi sóng, cooldown giảm."
      },
      {
        v: "Batch D", date: "2026-10-29",
        title: "🏪 Kỳ Trân Các mở rộng: 6 mặt hàng mới!",
        body: "Thêm: Mảnh HK x10, Mảnh HK x30, Rương HK Ngẫu Nhiên, Vũ Khí Tím 6 Dòng, Gói Chân Khí x200, Gói Tiềm Năng +5. Hồng Bao & Đại Hồng Bao giờ hoạt động offline!"
      },
      {
        v: "Batch C", date: "2026-10-28",
        title: "🐾 Đồng Hành & Kinh Mạch hoàn thiện",
        body: "8 đồng hành với passive buff đúng: Độc Cô Cầu Bại, Kiều Phong, Dương Quá, Tiểu Long Nữ, Hoàng Dung, Quách Tĩnh, Đoàn Dự. Kinh Mạch: Thêm nút Đả Thông Hết tất cả cùng lúc."
      },
      {
        v: "Batch B", date: "2026-10-27",
        title: "🏰 Tháp Thiên Ma 80 tầng & Boss 12 Đại Cao Thủ",
        body: "Tháp Thiên Ma mở rộng lên 80 tầng với 8 biome độc lập. Thêm 12 Boss Hoàng Kim: Độc Cô Cầu Bại, Kiều Phong, Hoàng Dược Sư, Trương Vô Kỵ,... Mỗi boss có loot table riêng."
      },
      {
        v: "Batch A", date: "2026-10-26",
        title: "🌐 Hệ thống offline hoàn chỉnh: Tống Kim, Liên Đấu, Sát Thủ",
        body: "Ra mắt phiên bản Offline đầy đủ: Chiến Trường Tống Kim 5 sóng, Liên Đấu 64 người, Bảng Sát Thủ, Kinh Mạch 8 mạch, Linh Thú 6 loại, Bảng Xếp Hạng Thế Giới."
      }
    ],

    _getSeen: function() {
      return localStorage.getItem(this._seenKey) === "1";
    },

    _markSeen: function() {
      localStorage.setItem(this._seenKey, "1");
    },

    openModal: function() {
      this._markSeen();
      this._updateDot();
      var existing = document.getElementById("newsModal");
      if (existing) { existing.classList.remove("hidden"); return; }

      var modal = document.createElement("div");
      modal.id = "newsModal";
      modal.className = "be-modal-overlay";
      modal.innerHTML = this._buildHTML();
      document.body.appendChild(modal);
      this._bindEvents(modal);
    },

    _buildHTML: function() {
      var items = this.NEWS.map(function(n) {
        return '<div style="border:1px solid ' + (n.hot ? "#ffd700" : "#333") + ';border-radius:8px;padding:12px 14px;margin-bottom:10px;background:' + (n.hot ? "#1a1500" : "#0f1520") + ';">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '  <span style="font-size:13px;font-weight:700;color:' + (n.hot ? "#ffd700" : "#88bbff") + ';">' + n.title + '</span>' +
          '  <span style="font-size:10px;color:#666;white-space:nowrap;margin-left:8px;">' + n.v + ' · ' + n.date + '</span>' +
          '</div>' +
          '<p style="font-size:12px;color:#aaa;margin:0;line-height:1.5;">' + n.body + '</p>' +
          '</div>';
      }).join("");

      return '<div class="be-modal-box" style="max-width:500px;max-height:85vh;overflow-y:auto;">' +
        '<div class="be-modal-header">' +
        '  <span>📰 Tin Tức & Cập Nhật</span>' +
        '  <button class="be-modal-close" id="newsModalClose">✕</button>' +
        '</div>' +
        '<div class="be-modal-body">' +
        '  <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:#0d1117;border-radius:8px;margin-bottom:14px;">' +
        '    <span style="font-size:24px;">⚔️</span>' +
        '    <div>' +
        '      <div style="font-weight:700;color:#ffd700;">Võ Lâm Idle — Offline Edition</div>' +
        '      <div style="font-size:11px;color:#888;">Base v959 · Custom Batch A→E · 2026</div>' +
        '    </div>' +
        '  </div>' +
        items +
        '  <div style="text-align:center;padding:10px 0;font-size:11px;color:#555;">— Hết tin tức —</div>' +
        '</div>' +
        '</div>';
    },

    _bindEvents: function(modal) {
      var closeBtn = document.getElementById("newsModalClose");
      if (closeBtn) closeBtn.onclick = function() { modal.classList.add("hidden"); };
      modal.onclick = function(e) { if (e.target === modal) modal.classList.add("hidden"); };
    },

    _updateDot: function() {
      var dot = document.getElementById("ribbonNewsDot");
      if (!dot) return;
      dot.style.display = this._getSeen() ? "none" : "block";
    },

    hasUnseen: function() {
      return !this._getSeen();
    }
  };

  // ============================================================================
  // E3. HỆ THỐNG THÀNH TÍCH (ACHIEVEMENT SYSTEM)
  // ============================================================================
  const AchievementSystem = {
    _stateKey: "jx_achievements_v1",

    ACHIEVEMENTS: [
      { id: "first_blood",   icon: "🐣", name: "Mầm Non Giang Hồ",      desc: "Đạt cấp 10",                       cond: "level10",   reward: { knb: 200 },                          secret: false },
      { id: "lv30",          icon: "🥋", name: "Võ Giả",                desc: "Đạt cấp 30",                       cond: "level30",   reward: { knb: 500 },                          secret: false },
      { id: "lv60",          icon: "🗡️", name: "Cao Thủ Giang Hồ",     desc: "Đạt cấp 60",                       cond: "level60",   reward: { knb: 1000, shards: 5 },              secret: false },
      { id: "lv100",         icon: "👑", name: "Tuyệt Thế Cao Nhân",    desc: "Đạt cấp 100",                      cond: "level100",  reward: { knb: 3000, shards: 15, attrPts: 10 }, secret: false },
      { id: "kill100",       icon: "⚔️", name: "Kiếm Khách",           desc: "Tiêu diệt 100 quái",               cond: "kills100",  reward: { knb: 300 },                          secret: false },
      { id: "kill1000",      icon: "💀", name: "Thần Sát",              desc: "Tiêu diệt 1000 quái",              cond: "kills1000", reward: { knb: 800, shards: 5 },               secret: false },
      { id: "kill10000",     icon: "🔪", name: "Đồ Sát Thần",          desc: "Tiêu diệt 10,000 quái",            cond: "kills10000",reward: { knb: 2000, shards: 15, attrPts: 5 }, secret: false },
      { id: "bounty5",       icon: "🎯", name: "Sát Thủ Bóng Đêm",     desc: "Hoàn thành 5 Bounty",              cond: "bounty5",   reward: { shards: 10, knb: 500 },              secret: false },
      { id: "bounty20",      icon: "☠️", name: "Ám Sát Đại Sư",       desc: "Hoàn thành 20 Bounty",             cond: "bounty20",  reward: { shards: 30, knb: 1500, attrPts: 5 }, secret: false },
      { id: "ld_champ",      icon: "🏆", name: "Minh Chủ Võ Lâm",      desc: "Vô địch Liên Đấu 64 người",        cond: "ld_champ",  reward: { knb: 5000, shards: 20, attrPts: 20 }, secret: false },
      { id: "sj_10wins",     icon: "🏯", name: "Thống Soái Chiến Trường",desc: "Thắng 10 trận Tống Kim",          cond: "sj10wins",  reward: { knb: 2000, attrPts: 10 },            secret: false },
      { id: "tower50",       icon: "💎", name: "Tháp Chủ",             desc: "Leo Tháp Thiên Ma tầng 50",         cond: "tower50",   reward: { knb: 2000, shards: 20 },             secret: false },
      { id: "tower80",       icon: "🌟", name: "Vô Song Thiên Hạ",     desc: "Leo Tháp Thiên Ma tầng 80",         cond: "tower80",   reward: { knb: 5000, shards: 50, attrPts: 30 }, secret: false },
      { id: "hk12boss",      icon: "🐉", name: "Đại Hiệp Truyền Kỳ",   desc: "Đánh bại cả 12 Boss Hoàng Kim",    cond: "hk12boss",  reward: { knb: 5000, shards: 30, attrPts: 15 }, secret: true  },
      { id: "meridian_max",  icon: "🌀", name: "Kinh Mạch Đại Thành",  desc: "Đả thông đủ 8 Kinh Mạch (lv≥5)",  cond: "meridian8", reward: { knb: 3000, attrPts: 25 },            secret: false },
      { id: "giftcode_used", icon: "🎁", name: "Hảo Hán Nhiệt Tình",   desc: "Sử dụng 1 Giftcode",               cond: "giftcode",  reward: { knb: 100 },                          secret: false },
      { id: "rich",          icon: "💰", name: "Phú Gia Địch Quốc",    desc: "Tích lũy 100 triệu Lượng",         cond: "gold100m",  reward: { knb: 1000 },                         secret: true  },
      { id: "knb1000",       icon: "💎", name: "Kim Nguyên Bảo Vương", desc: "Sở hữu 10,000 KNB",                cond: "knb10000",  reward: { attrPts: 10 },                       secret: true  }
    ],

    _getState: function() {
      try { return JSON.parse(localStorage.getItem(this._stateKey) || "{}"); } catch(e) { return {}; }
    },

    _saveState: function(st) {
      localStorage.setItem(this._stateKey, JSON.stringify(st));
    },

    _getUnlocked: function() {
      return this._getState().unlocked || [];
    },

    _isUnlocked: function(id) {
      return this._getUnlocked().indexOf(id) !== -1;
    },

    _unlock: function(id) {
      var st = this._getState();
      if (!st.unlocked) st.unlocked = [];
      if (st.unlocked.indexOf(id) !== -1) return false;
      st.unlocked.push(id);
      this._saveState(st);
      return true;
    },

    _giveReward: function(reward) {
      var JX = getJX();
      var l = JX ? JX.S : null;
      if (!l) return;
      if (reward.knb)     { l.knb = (l.knb || 0) + reward.knb; l.knbV = (l.knbV || 0) + reward.knb; }
      if (reward.attrPts) { l.attrPts = (l.attrPts || 0) + reward.attrPts; }
      if (reward.shards && window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
        window.HtzItemGenerator.addHkShards(reward.shards);
      }
      var h = JX ? (JX.R || window.h) : window.h;
      if (h) h.dirty = true;
    },

    _notify: function(ach) {
      var JX = getJX();
      if (JX && JX.toast) JX.toast("🏅 THÀNH TÍCH: " + ach.icon + " " + ach.name + "!");
      if (JX && JX.log) {
        var rwList = [];
        if (ach.reward.knb) rwList.push("+" + ach.reward.knb + " KNB");
        if (ach.reward.attrPts) rwList.push("+" + ach.reward.attrPts + " Tiềm Năng");
        if (ach.reward.shards) rwList.push("+" + ach.reward.shards + " Mảnh HK");
        JX.log('<b style="color:#ffd700">🏅 [Thành Tích]:</b> Mở khóa <b>' + ach.icon + " " + ach.name + '</b>! Nhận: <b>' + rwList.join(", ") + "</b>");
      }
      // Hiện badge dot
      this._updateDot();
    },

    check: function(cond) {
      var JX = getJX();
      var l = JX ? JX.S : null;
      var htz = window.HtzState;
      var self = this;

      this.ACHIEVEMENTS.forEach(function(ach) {
        if (self._isUnlocked(ach.id)) return;

        var met = false;
        var c = ach.cond;
        if (c === "level10"  && l && (l.lvl || 0) >= 10)     met = true;
        if (c === "level30"  && l && (l.lvl || 0) >= 30)     met = true;
        if (c === "level60"  && l && (l.lvl || 0) >= 60)     met = true;
        if (c === "level100" && l && (l.lvl || 0) >= 100)    met = true;
        if (c === "kills100"   && l && (l.kills || 0) >= 100)   met = true;
        if (c === "kills1000"  && l && (l.kills || 0) >= 1000)  met = true;
        if (c === "kills10000" && l && (l.kills || 0) >= 10000) met = true;
        if (c === "bounty5"  && htz && (htz.bountyKills || 0) >= 5)   met = true;
        if (c === "bounty20" && htz && (htz.bountyKills || 0) >= 20)  met = true;
        if (c === "ld_champ") {
          try { var ldSt = JSON.parse(localStorage.getItem("jx_tournament_v2") || "{}"); if (ldSt.totalChampions >= 1) met = true; } catch(e){}
        }
        if (c === "sj10wins" && htz && htz.songjin && (htz.songjin.wins || 0) >= 10) met = true;
        if (c === "tower50") {
          try { var twSt = JSON.parse(localStorage.getItem("jx_tower_enhanced_v1") || "{}"); if ((twSt.maxFloor || 0) >= 50) met = true; } catch(e){}
        }
        if (c === "tower80") {
          try { var twSt2 = JSON.parse(localStorage.getItem("jx_tower_enhanced_v1") || "{}"); if ((twSt2.maxFloor || 0) >= 80) met = true; } catch(e){}
        }
        if (c === "hk12boss") {
          try { var pkSt = JSON.parse(localStorage.getItem("jx_pk_boss_state") || "{}"); if ((pkSt.defeatedBosses || []).length >= 12) met = true; } catch(e){}
        }
        if (c === "meridian8" && htz && htz.meridians) {
          var mkeys = ["doc","nham","xung","doi","amkieu","duongkieu","amduy","duongduy"];
          var allMax = mkeys.every(function(k){ return (htz.meridians[k] || 0) >= 5; });
          if (allMax) met = true;
        }
        if (c === "giftcode") {
          try { var usedGc = JSON.parse(localStorage.getItem("jx_used_giftcodes_v1") || "[]"); if (usedGc.length >= 1) met = true; } catch(e){}
        }
        if (c === "gold100m" && l && (l.gold || 0) >= 100000000) met = true;
        if (c === "knb10000" && l && (l.knb  || 0) >= 10000)     met = true;

        if (met) {
          if (self._unlock(ach.id)) {
            self._giveReward(ach.reward);
            self._notify(ach);
          }
        }
      });
    },

    _updateDot: function() {
      var dot = document.getElementById("ribbonAchDot");
      if (!dot) return;
      var unlocked = this._getUnlocked().length;
      dot.textContent = unlocked;
      dot.style.display = unlocked > 0 ? "block" : "none";
    },

    openModal: function() {
      this._updateDot();
      var existing = document.getElementById("achievementModal");
      if (existing) { existing.classList.remove("hidden"); this._renderModal(existing); return; }

      var modal = document.createElement("div");
      modal.id = "achievementModal";
      modal.className = "be-modal-overlay";
      modal.innerHTML = this._buildHTML();
      document.body.appendChild(modal);
      this._bindEvents(modal);
    },

    _buildHTML: function() {
      var self = this;
      var unlocked = this._getUnlocked();
      var total = this.ACHIEVEMENTS.length;
      var done  = unlocked.length;
      var pct   = Math.round(done / total * 100);

      var rows = this.ACHIEVEMENTS.map(function(ach) {
        var isUnlocked = unlocked.indexOf(ach.id) !== -1;
        var isSecret = ach.secret && !isUnlocked;
        var rwList = [];
        if (ach.reward.knb) rwList.push("+" + ach.reward.knb + " KNB");
        if (ach.reward.attrPts) rwList.push("+" + ach.reward.attrPts + " TN");
        if (ach.reward.shards) rwList.push("+" + ach.reward.shards + " HK");

        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;margin-bottom:6px;background:' + (isUnlocked ? "#0d2a0d" : "#0f1520") + ';border:1px solid ' + (isUnlocked ? "#2d5a2d" : "#222") + ';opacity:' + (isUnlocked ? "1" : "0.7") + ';">' +
          '  <div style="font-size:24px;min-width:32px;text-align:center;' + (isUnlocked ? "" : "filter:grayscale(1);") + '">' + (isSecret ? "❓" : ach.icon) + '</div>' +
          '  <div style="flex:1;">' +
          '    <div style="font-size:13px;font-weight:700;color:' + (isUnlocked ? "#6fd46a" : "#ccc") + ';">' + (isSecret ? "???" : ach.name) + '</div>' +
          '    <div style="font-size:11px;color:#888;">' + (isSecret ? "Thành tích ẩn — hãy khám phá!" : ach.desc) + '</div>' +
          '    <div style="font-size:10px;color:#ffd700;margin-top:2px;">' + rwList.join(" · ") + '</div>' +
          '  </div>' +
          '  <div style="font-size:18px;">' + (isUnlocked ? "✅" : "🔒") + '</div>' +
          '</div>';
      }).join("");

      return '<div class="be-modal-box" style="max-width:480px;max-height:85vh;overflow-y:auto;">' +
        '<div class="be-modal-header">' +
        '  <span>🏅 Thành Tích</span>' +
        '  <button class="be-modal-close" id="achModalClose">✕</button>' +
        '</div>' +
        '<div class="be-modal-body">' +
        '  <div style="margin-bottom:14px;">' +
        '    <div style="display:flex;justify-content:space-between;font-size:12px;color:#aaa;margin-bottom:6px;">' +
        '      <span>Tiến Trình: <b style="color:#ffd700;">' + done + '/' + total + '</b> thành tích</span>' +
        '      <span style="color:#ffd700;">' + pct + '%</span>' +
        '    </div>' +
        '    <div style="height:8px;background:#1a1a2e;border-radius:4px;overflow:hidden;">' +
        '      <div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#ffd700,#ff6b35);border-radius:4px;transition:width 0.5s;"></div>' +
        '    </div>' +
        '  </div>' +
        rows +
        '</div>' +
        '</div>';
    },

    _renderModal: function(modal) {
      modal.innerHTML = this._buildHTML();
      this._bindEvents(modal);
    },

    _bindEvents: function(modal) {
      var closeBtn = document.getElementById("achModalClose");
      if (closeBtn) closeBtn.onclick = function() { modal.classList.add("hidden"); };
      modal.onclick = function(e) { if (e.target === modal) modal.classList.add("hidden"); };
    }
  };

  // ============================================================================
  // E5. NHIỆM VỤ HÀNG NGÀY (DAILY QUEST SYSTEM)
  // ============================================================================
  const DailyQuestSystem = {
    _stateKey: "jx_daily_quests_v1",

    QUESTS: [
      { id: "dq_kills",    icon: "⚔️", name: "Giang Hồ Tung Hoành",  desc: "Tiêu diệt 50 quái vật hôm nay",   target: 50,  type: "kills",   reward: { knb: 300, gold: 1000000 } },
      { id: "dq_bounty",   icon: "🎯", name: "Mật Lệnh Sát Thủ",     desc: "Hoàn thành 1 nhiệm vụ Bounty",    target: 1,   type: "bounty",  reward: { knb: 200, shards: 5 } },
      { id: "dq_tower",    icon: "🏯", name: "Chinh Phục Thiên Ma",   desc: "Vượt qua 3 tầng Tháp Thiên Ma",   target: 3,   type: "tower",   reward: { knb: 300, shards: 3 } },
      { id: "dq_songjin",  icon: "🚩", name: "Chiến Trường Anh Hùng", desc: "Tham gia 1 trận Chiến Trường Tống Kim", target: 1, type: "songjin", reward: { knb: 400, gold: 2000000 } },
      { id: "dq_ktc",      icon: "🏪", name: "Trân Bảo Sưu Tầm",     desc: "Mua 2 món đồ từ Kỳ Trân Các",     target: 2,   type: "ktc",     reward: { knb: 150, gold: 500000 } },
      { id: "dq_meridian", icon: "🌀", name: "Tu Luyện Kinh Mạch",   desc: "Đả thông 1 lần Kinh Mạch",         target: 1,   type: "meridian",reward: { knb: 150, qi: 300 } }
    ],

    _getState: function() {
      try { return JSON.parse(localStorage.getItem(this._stateKey) || "{}"); } catch(e) { return {}; }
    },

    _saveState: function(st) {
      localStorage.setItem(this._stateKey, JSON.stringify(st));
    },

    _getTodayKey: function() {
      var d = new Date();
      return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
    },

    _getDayState: function() {
      var st = this._getState();
      var today = this._getTodayKey();
      if (st.day !== today) {
        // Reset hàng ngày
        st.day = today;
        st.progress = {};
        st.claimed  = {};
        this._saveState(st);
      }
      return st;
    },

    progress: function(type, amount) {
      var st = this._getDayState();
      if (!st.progress) st.progress = {};
      st.progress[type] = (st.progress[type] || 0) + (amount || 1);
      this._saveState(st);
      // Kiểm tra hoàn thành
      var self = this;
      this.QUESTS.forEach(function(q) {
        if (q.type === type && (st.progress[type] || 0) >= q.target && !st.claimed[q.id]) {
          // Tự động claim reward
          self._claimReward(q, st);
        }
      });
      this._updateDot();
    },

    _claimReward: function(q, st) {
      st.claimed[q.id] = true;
      this._saveState(st);

      var JX = getJX();
      var l = JX ? JX.S : null;
      if (!l) return;

      var rwLines = [];
      if (q.reward.knb)    { l.knb = (l.knb || 0) + q.reward.knb; l.knbV = (l.knbV || 0) + q.reward.knb; rwLines.push("+" + q.reward.knb + " KNB"); }
      if (q.reward.gold)   { l.gold = (l.gold || 0) + q.reward.gold; rwLines.push("+" + fmtNum(q.reward.gold) + " Lượng"); }
      if (q.reward.shards && window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
        window.HtzItemGenerator.addHkShards(q.reward.shards); rwLines.push("+" + q.reward.shards + " Mảnh HK");
      }
      if (q.reward.qi && window.HtzState) { window.HtzState.qi = (window.HtzState.qi || 0) + q.reward.qi; rwLines.push("+" + q.reward.qi + " Chân Khí"); }

      var h = JX ? (JX.R || window.h) : window.h;
      if (h) h.dirty = true;

      if (JX && JX.toast) JX.toast("✅ NV Ngày: " + q.icon + " " + q.name + " hoàn thành! Nhận: " + rwLines.join(", "));
      if (JX && JX.log)   JX.log('<b style="color:#6fd46a">✅ [Nhiệm Vụ Ngày]:</b> <b>' + q.icon + " " + q.name + '</b> hoàn thành! Nhận: <b>' + rwLines.join(", ") + "</b>");
    },

    _updateDot: function() {
      var dot = document.getElementById("ribbonDailyDot");
      if (!dot) return;
      var st = this._getDayState();
      var pending = this.QUESTS.filter(function(q){ return !(st.claimed || {})[q.id]; }).length;
      dot.textContent = pending;
      dot.style.display = pending > 0 ? "block" : "none";
    },

    openModal: function() {
      var existing = document.getElementById("dailyQuestModal");
      if (existing) { existing.classList.remove("hidden"); this._renderModal(existing); return; }

      var modal = document.createElement("div");
      modal.id = "dailyQuestModal";
      modal.className = "be-modal-overlay";
      modal.innerHTML = this._buildHTML();
      document.body.appendChild(modal);
      this._bindEvents(modal);
    },

    _buildHTML: function() {
      var st = this._getDayState();
      var prog = st.progress || {};
      var claimed = st.claimed || {};
      var today = this._getTodayKey();
      var doneCnt = Object.keys(claimed).length;
      var totalCnt = this.QUESTS.length;

      var rows = this.QUESTS.map(function(q) {
        var cur = prog[q.type] || 0;
        var isDone = !!claimed[q.id];
        var barPct = Math.min(100, Math.round(cur / q.target * 100));
        var rwList = [];
        if (q.reward.knb)    rwList.push(q.reward.knb + " KNB");
        if (q.reward.gold)   rwList.push(fmtNum(q.reward.gold) + " Lượng");
        if (q.reward.shards) rwList.push(q.reward.shards + " Mảnh HK");
        if (q.reward.qi)     rwList.push(q.reward.qi + " Chân Khí");

        return '<div style="border:1px solid ' + (isDone ? "#2d5a2d" : "#333") + ';border-radius:8px;padding:10px 12px;margin-bottom:8px;background:' + (isDone ? "#0d2a0d" : "#0f1520") + ';">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
          '  <span style="font-size:20px;">' + q.icon + '</span>' +
          '  <div style="flex:1;">' +
          '    <div style="font-size:12px;font-weight:700;color:' + (isDone ? "#6fd46a" : "#ccc") + ';">' + q.name + '</div>' +
          '    <div style="font-size:11px;color:#888;">' + q.desc + '</div>' +
          '  </div>' +
          '  <div style="font-size:18px;">' + (isDone ? "✅" : (barPct >= 100 ? "🟡" : "🔒")) + '</div>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '  <div style="flex:1;margin-right:10px;">' +
          '    <div style="height:5px;background:#1a1a2e;border-radius:3px;overflow:hidden;">' +
          '      <div style="height:100%;width:' + barPct + '%;background:' + (isDone ? "#2d5a2d" : "#ffd700") + ';border-radius:3px;transition:width 0.5s;"></div>' +
          '    </div>' +
          '    <div style="font-size:10px;color:#888;margin-top:2px;">' + Math.min(cur, q.target) + '/' + q.target + '</div>' +
          '  </div>' +
          '  <div style="font-size:10px;color:#ffd700;text-align:right;">' + rwList.join(" · ") + '</div>' +
          '</div>' +
          '</div>';
      }).join("");

      return '<div class="be-modal-box" style="max-width:480px;max-height:85vh;overflow-y:auto;">' +
        '<div class="be-modal-header">' +
        '  <span>📋 Nhiệm Vụ Hàng Ngày</span>' +
        '  <button class="be-modal-close" id="dqModalClose">✕</button>' +
        '</div>' +
        '<div class="be-modal-body">' +
        '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '    <div style="font-size:12px;color:#aaa;">Hôm nay: <b style="color:#ffd700;">' + today + '</b> · Hoàn thành: <b style="color:#6fd46a;">' + doneCnt + '/' + totalCnt + '</b></div>' +
        '    <div style="font-size:11px;color:#555;">Reset lúc 0:00</div>' +
        '  </div>' +
        rows +
        '  <div style="text-align:center;padding:8px;font-size:11px;color:#555;">Tiến trình tự động cập nhật khi chơi game.</div>' +
        '</div>' +
        '</div>';
    },

    _renderModal: function(modal) {
      modal.innerHTML = this._buildHTML();
      this._bindEvents(modal);
    },

    _bindEvents: function(modal) {
      var closeBtn = document.getElementById("dqModalClose");
      if (closeBtn) closeBtn.onclick = function() { modal.classList.add("hidden"); };
      modal.onclick = function(e) { if (e.target === modal) modal.classList.add("hidden"); };
    }
  };

  // ============================================================================
  // KHỞI TẠO VÀ HOOK VÀO GAME
  // ============================================================================
  function injectBatchERibbon() {
    var ribbon = document.getElementById("actionRibbon");
    if (!ribbon || document.getElementById("ribbonGcBtn")) return;

    // Thêm 4 nút mới vào ribbon
    var extraBtns = document.createElement("div");
    extraBtns.innerHTML =
      '<button class="ribbon-btn highlight-gold" id="ribbonGcBtn" title="Nhập Giftcode Offline">' +
      '  <span class="ribbon-icon">🎁</span>' +
      '  <span class="ribbon-txt">Giftcode</span>' +
      '</button>' +
      '<button class="ribbon-btn" id="ribbonNewsBtn" title="Tin Tức & Cập Nhật">' +
      '  <span class="ribbon-icon">📰</span>' +
      '  <span class="ribbon-txt">Tin Tức</span>' +
      '  <em class="ribbon-dot" id="ribbonNewsDot" style="display:none;"></em>' +
      '</button>' +
      '<button class="ribbon-btn" id="ribbonAchBtn" title="Thành Tích">' +
      '  <span class="ribbon-icon">🏅</span>' +
      '  <span class="ribbon-txt">Thành Tích</span>' +
      '  <em class="ribbon-dot" id="ribbonAchDot" style="display:none;">0</em>' +
      '</button>' +
      '<button class="ribbon-btn highlight-green" id="ribbonDailyBtn" title="Nhiệm Vụ Hàng Ngày">' +
      '  <span class="ribbon-icon">📋</span>' +
      '  <span class="ribbon-txt">NV Ngày</span>' +
      '  <em class="ribbon-dot" id="ribbonDailyDot" style="display:none;">6</em>' +
      '</button>';

    Array.from(extraBtns.children).forEach(function(btn) {
      ribbon.appendChild(btn);
    });

    // Gắn sự kiện
    document.getElementById("ribbonGcBtn").onclick   = function() { GiftcodeSystem.openModal(); };
    document.getElementById("ribbonNewsBtn").onclick = function() { NewsSystem.openModal(); };
    document.getElementById("ribbonAchBtn").onclick  = function() { AchievementSystem.openModal(); };
    document.getElementById("ribbonDailyBtn").onclick = function() { DailyQuestSystem.openModal(); };

    // Cập nhật dots
    NewsSystem._updateDot();
    AchievementSystem._updateDot();
    DailyQuestSystem._updateDot();
  }

  // Hook achievement check vào game loop (mỗi 30 giây)
  function startGameHooks() {
    // Kiểm tra thành tích định kỳ
    setInterval(function() {
      try { AchievementSystem.check("periodic"); } catch(e) {}
    }, 30000);

    // Hook Daily Quest: theo dõi kill count
    var _lastKills = 0;
    var _lastBountyKills = 0;
    var _lastSjWins = 0;
    var _lastTowerFloor = 0;

    setInterval(function() {
      try {
        var JX = getJX();
        var l = JX ? JX.S : null;
        var htz = window.HtzState;

        if (l) {
          // Kill tracking
          var curKills = l.kills || 0;
          if (curKills > _lastKills) {
            DailyQuestSystem.progress("kills", curKills - _lastKills);
            _lastKills = curKills;
            // Achievement check
            AchievementSystem.check("kills");
          }
          // Level check
          AchievementSystem.check("level");
          // Gold/KNB check
          if ((l.gold || 0) >= 100000000 || (l.knb || 0) >= 10000) AchievementSystem.check("wealth");
        }

        if (htz) {
          // Bounty kills
          var curBounty = htz.bountyKills || 0;
          if (curBounty > _lastBountyKills) {
            DailyQuestSystem.progress("bounty", curBounty - _lastBountyKills);
            _lastBountyKills = curBounty;
            AchievementSystem.check("bounty");
          }
          // SongJin wins
          var curSjWins = (htz.songjin && htz.songjin.wins) || 0;
          if (curSjWins > _lastSjWins) {
            DailyQuestSystem.progress("songjin", curSjWins - _lastSjWins);
            _lastSjWins = curSjWins;
            AchievementSystem.check("songjin");
          }
        }

        // Tower floor
        try {
          var twSt = JSON.parse(localStorage.getItem("jx_tower_enhanced_v1") || "{}");
          var curFloor = twSt.maxFloor || 0;
          if (curFloor > _lastTowerFloor) {
            DailyQuestSystem.progress("tower", curFloor - _lastTowerFloor);
            _lastTowerFloor = curFloor;
            AchievementSystem.check("tower");
          }
        } catch(e) {}

        // Meridian achievement
        AchievementSystem.check("meridian");
      } catch(e) {}
    }, 10000);
  }

  // Hook KTC purchase tracking
  function hookKtcPurchase() {
    var origF1 = window.f1;
    if (!origF1 || !Array.isArray(origF1)) return;
    origF1.forEach(function(item) {
      if (!item || !item.use) return;
      var origUse = item.use;
      item.use = function() {
        var result = origUse.apply(this, arguments);
        DailyQuestSystem.progress("ktc", 1);
        return result;
      };
    });
  }

  // Hook Meridian upgrade
  function hookMeridianUpgrade() {
    if (!window.HtzMeridianSystem) return;
    var orig = window.HtzMeridianSystem.upgradeMeridian;
    if (!orig) return;
    window.HtzMeridianSystem.upgradeMeridian = function() {
      var r = orig.apply(this, arguments);
      DailyQuestSystem.progress("meridian", 1);
      AchievementSystem.check("meridian");
      return r;
    };
  }

  // Lắng nghe Liên Đấu champion event
  function hookLienDauChampion() {
    var origAward = window.TournamentSystem;
    // Sẽ được trigger qua window event
    window.addEventListener("lienDauChampion", function() {
      AchievementSystem.check("ld_champ");
      DailyQuestSystem.progress("liendau", 1);
    });
  }

  // Khởi động
  var _initInterval = setInterval(function() {
    if (!document.getElementById("actionRibbon")) return;

    injectBatchERibbon();
    startGameHooks();

    setTimeout(function() {
      try { hookKtcPurchase(); } catch(e) {}
      try { hookMeridianUpgrade(); } catch(e) {}
      try { hookLienDauChampion(); } catch(e) {}
      // Initial achievement check
      AchievementSystem.check("init");
    }, 3000);

    clearInterval(_initInterval);
    console.log("[BatchE] Khởi tạo hoàn tất: Giftcode, News, Achievement, DailyQuest.");
  }, 1500);

  // Expose global
  window.GiftcodeSystem    = GiftcodeSystem;
  window.NewsSystem        = NewsSystem;
  window.AchievementSystem = AchievementSystem;
  window.DailyQuestSystem  = DailyQuestSystem;

})();

