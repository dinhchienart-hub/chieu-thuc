/**
 * ============================================================================
 * VÕ LÂM IDLE - GÓI NÂNG CẤP BỐN HỆ THỐNG CỐT LÕI (OFFLINE SYSTEMS PACK)
 * ============================================================================
 * 1. HỘP THƯ OFFLINE (Offline Mailbox & Fast Claim All)
 * 2. KỲ TRÂN CÁC MỞ RỘNG (Enhanced KTC with Rare Items & Lucky Packets)
 * 3. ĐỒNG HÀNH TRỢ CHIẾN TINH CHỈNH (Companion Mastery, Ultimate Burst & Smart Following)
 * 4. OẢN TÙ TÌ GIANG HỒ OFFLINE (Rock-Paper-Scissors Standalone Minigame)
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[OfflineSystems] Đang khởi chạy gói tính năng: Thư, Kỳ Trân Các, Đồng Hành, Oản Tù Tì...");

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

  // ==========================================================================
  // 1. HỆ THỐNG HỘP THƯ OFFLINE (OFFLINE MAILBOX)
  // ==========================================================================
  const MAIL_STORAGE_KEY = "jx_offline_mailbox_v1";

  const defaultMails = [
    {
      id: "mail_welcome",
      sender: "Võ Lâm Minh Chủ",
      title: "🎁 Quà Mừng Xuất Sư Tân Thủ Giang Hồ",
      date: "Khởi Đầu",
      content: "Chào mừng Đại Hiệp bước chân vào thế giới Võ Lâm Idle Phiên Bản Offline! Ban Quản Trị xin gửi tặng Đại Hiệp gói hành trang lộ phí khởi đầu để thuận buồm xuôi gió bôn tẩu giang hồ.",
      read: false,
      claimed: false,
      rewards: {
        gold: 20000000,
        knb: 3000,
        qi: 300,
        items: ["5x Tiên Thảo Lộ", "5x Bạch Câu Hoàn", "1x Rương Trang Bị Quý"]
      }
    },
    {
      id: "mail_weal",
      sender: "Đại Sứ Phúc Lợi",
      title: "📜 Phúc Lợi Thất Đại Môn Phái Hàng Tuần",
      date: "Tuần Này",
      content: "Phúc lợi rèn luyện võ học dành tặng chư vị hiệp khách chăm chỉ tu luyện, trừ gian diệt bạo, gìn giữ an nguy muôn dân trăm họ.",
      read: false,
      claimed: false,
      rewards: {
        gold: 10000000,
        knb: 1500,
        qi: 200,
        items: ["3x Thiên Sơn Bảo Lộ", "1x Thủy Tinh Ngũ Sắc"]
      }
    },
    {
      id: "mail_tower",
      sender: "Trưởng Lão Thông Thiên Tháp",
      title: "🗼 Thưởng Chinh Phục Cửu Trọng Thiên Giới",
      date: "Thường Trực",
      content: "Chúc mừng Đại Hiệp đã dũng cảm leo lên những tầng cao nhất của Thông Thiên Tháp. Khí phách kiên cường đáng khâm phục!",
      read: false,
      claimed: false,
      rewards: {
        gold: 15000000,
        knb: 2000,
        qi: 500,
        items: ["1x Mảnh Hoàng Kim Môn Phái", "2x Thần Bí Khoáng Thạch"]
      }
    }
  ];

  let OfflineMails = [];
  try {
    const saved = localStorage.getItem(MAIL_STORAGE_KEY);
    if (saved) {
      OfflineMails = JSON.parse(saved);
    } else {
      OfflineMails = JSON.parse(JSON.stringify(defaultMails));
      localStorage.setItem(MAIL_STORAGE_KEY, JSON.stringify(OfflineMails));
    }
  } catch (e) {
    OfflineMails = JSON.parse(JSON.stringify(defaultMails));
  }

  function saveMails() {
    try {
      localStorage.setItem(MAIL_STORAGE_KEY, JSON.stringify(OfflineMails));
      window.OfflineMails = OfflineMails;
    } catch (e) {}
    updateMailBadge();
  }

  function updateMailBadge() {
    window.OfflineMails = OfflineMails;
    const unread = OfflineMails.filter(m => !m.claimed).length;
    const dot = document.getElementById("ribbonMailDot");
    if (dot) {
      dot.classList.toggle("on", unread > 0);
      dot.textContent = unread > 0 ? unread : "";
    }
    const u20m = document.getElementById("u20mail");
    const u20mN = document.getElementById("u20mailN");
    if (u20m) {
      u20m.classList.toggle("on", unread > 0);
      u20m.style.display = "";
    }
    if (u20mN) {
      u20mN.textContent = unread > 0 ? (unread > 9 ? "9+" : unread) : "";
    }
  }

  const MailSystem = {
    sendMail: function(mailObj) {
      if (!mailObj) return;
      const newMail = {
        id: "mail_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        sender: mailObj.sender || "Hệ Thống Giang Hồ",
        title: mailObj.title || "Thư Mới",
        date: new Date().toLocaleDateString("vi-VN"),
        content: mailObj.content || "",
        claimed: false,
        read: false,
        rewards: {
          gold: mailObj.rewards && mailObj.rewards.gold ? mailObj.rewards.gold : 0,
          knb: mailObj.rewards && mailObj.rewards.knb ? mailObj.rewards.knb : 0,
          qi: mailObj.rewards && mailObj.rewards.qi ? mailObj.rewards.qi : 0,
          items: mailObj.rewards && mailObj.rewards.items ? mailObj.rewards.items : []
        }
      };
      OfflineMails.unshift(newMail);
      saveMails();
      const JX = getJX();
      if (JX && JX.toast) JX.toast(`📨 Thư mới từ ${newMail.sender}: ${newMail.title}!`);
    },

    openMailbox: function() {
      let modal = document.getElementById("offlineMailModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "offlineMailModal";
        modal.className = "htz-modal-overlay";
        document.body.appendChild(modal);
      }

      this.renderMailbox(modal);
      modal.classList.remove("hidden");
    },

    renderMailbox: function(modal) {
      const unreadCount = OfflineMails.filter(m => !m.claimed).length;
      let mailsListHtml = "";

      if (!OfflineMails.length) {
        mailsListHtml = `<div style="text-align:center;padding:40px;color:#adb5bd;">📭 Hộp thư hiện đang trống!</div>`;
      } else {
        OfflineMails.forEach((m, idx) => {
          mailsListHtml += `
            <div class="mail-item ${m.claimed ? 'claimed' : 'unclaimed'}" data-midx="${idx}">
              <div style="font-size:24px;">${m.claimed ? '📭' : '📬'}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:bold;color:${m.claimed ? '#ced4da' : '#ffd700'};font-size:13px;display:flex;justify-content:space-between;">
                  <span>${m.title}</span>
                  <span style="font-size:11px;color:#868e96;">${m.date}</span>
                </div>
                <div style="font-size:11px;color:#adb5bd;margin-top:2px;">Người gửi: <b style="color:#e2d1b3;">${m.sender}</b></div>
                <div class="mail-preview">${m.content}</div>
                <div class="mail-rewards-badge">
                  🎁 Phần thưởng: 
                  <b style="color:#ff8787;">+${fmtNum(m.rewards.gold)} Lượng</b> · 
                  <b style="color:#ffd700;">+${m.rewards.knb} KNB</b> · 
                  <b style="color:#6fd46a;">+${m.rewards.qi} Chân Khí</b>
                  ${m.rewards.items ? ` · <span style="color:#74c0fc;">${m.rewards.items.join(", ")}</span>` : ''}
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <button class="htz-meridian-btn mail-claim-single" data-midx="${idx}" ${m.claimed ? 'disabled' : ''} style="${m.claimed ? 'opacity:0.5;' : 'background:#2b8a3e;border-color:#51cf66;'}">
                  ${m.claimed ? "Đã Nhận" : "Nhận Quà"}
                </button>
              </div>
            </div>
          `;
        });
      }

      modal.innerHTML = `
        <div class="htz-modal-box" style="max-width:680px;">
          <div class="htz-modal-header">
            <div class="htz-modal-title">
              <span>📨</span>
              <span>HỘP THƯ BẰNG HỮU & GIANG HỒ OFFLINE</span>
            </div>
            <button class="htz-modal-close-btn" id="closeMailModalBtn">✕</button>
          </div>
          <div class="htz-modal-body" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;background:rgba(20,26,35,0.85);border:1px solid rgba(200,150,90,0.3);border-radius:6px;padding:8px 12px;">
              <span style="font-size:12px;color:#ced4da;">Hòm thư: <b>${OfflineMails.length}</b> bức thư · Chưa nhận: <b style="color:#ffd700;">${unreadCount}</b></span>
              <div style="display:flex;gap:8px;">
                <button class="htz-meridian-btn" id="mailClaimAllBtn" ${unreadCount === 0 ? 'disabled' : ''} style="background:#2b8a3e;border-color:#51cf66;">
                  🎁 Nhận Nhanh Tất Cả
                </button>
                <button class="htz-meridian-btn" id="mailClearClaimedBtn" style="background:#343a40;border-color:#495057;">
                  🗑 Xóa Thư Đã Nhận
                </button>
              </div>
            </div>
            <div class="mail-list-container" style="max-height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;">
              ${mailsListHtml}
            </div>
          </div>
        </div>
      `;

      document.getElementById("closeMailModalBtn").onclick = () => modal.classList.add("hidden");
      modal.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

      // Xử lý nhận đơn lẻ
      modal.querySelectorAll(".mail-claim-single").forEach(btn => {
        btn.onclick = (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-midx"), 10);
          this.claimMail(idx);
          this.renderMailbox(modal);
        };
      });

      // Nhận tất cả
      const claimAllBtn = document.getElementById("mailClaimAllBtn");
      if (claimAllBtn) {
        claimAllBtn.onclick = () => {
          this.claimAllMails();
          this.renderMailbox(modal);
        };
      }

      // Xóa thư đã nhận
      const clearBtn = document.getElementById("mailClearClaimedBtn");
      if (clearBtn) {
        clearBtn.onclick = () => {
          OfflineMails = OfflineMails.filter(m => !m.claimed);
          saveMails();
          this.renderMailbox(modal);
          const JX = getJX();
          if (JX && JX.toast) JX.toast("🗑 Đã xóa các thư đã nhận thưởng!");
        };
      }
    },

    claimMail: function(idx) {
      const mail = OfflineMails[idx];
      if (!mail || mail.claimed) return;

      const JX = getJX();
      const l = JX ? JX.S : null;
      const h = JX ? (JX.R || window.h) : window.h;

      if (l) {
        l.gold = (l.gold || 0) + (mail.rewards.gold || 0);
        l.knb = (l.knb || 0) + (mail.rewards.knb || 0);
      }

      if (window.HtzState && mail.rewards.qi) {
        window.HtzState.qi = (window.HtzState.qi || 0) + mail.rewards.qi;
        if (typeof window.saveState === "function") window.saveState();
      }

      mail.claimed = true;
      mail.read = true;
      saveMails();

      if (h) h.dirty = true;

      if (JX && JX.toast) JX.toast(`🎁 Đã nhận quà từ thư: ${mail.title}!`);
      if (JX && JX.sound) JX.sound("snd/sound_a001_at.mp3", 1, 1);
    },

    claimAllMails: function() {
      let totalGold = 0;
      let totalKnb = 0;
      let totalQi = 0;
      let count = 0;

      OfflineMails.forEach(m => {
        if (!m.claimed) {
          totalGold += m.rewards.gold || 0;
          totalKnb += m.rewards.knb || 0;
          totalQi += m.rewards.qi || 0;
          m.claimed = true;
          m.read = true;
          count++;
        }
      });

      if (count === 0) return;

      const JX = getJX();
      const l = JX ? JX.S : null;
      const h = JX ? (JX.R || window.h) : window.h;

      if (l) {
        l.gold = (l.gold || 0) + totalGold;
        l.knb = (l.knb || 0) + totalKnb;
      }

      if (window.HtzState && totalQi > 0) {
        window.HtzState.qi = (window.HtzState.qi || 0) + totalQi;
        if (typeof window.saveState === "function") window.saveState();
      }

      saveMails();

      if (h) h.dirty = true;

      if (JX && JX.banner) {
        JX.banner("🎁 NHẬN TOÀN BỘ THƯ THÀNH CÔNG!", `Đã nhận ${count} thư: +${fmtNum(totalGold)} Lượng · +${totalKnb} KNB · +${totalQi} Chân Khí!`, 4);
      }
      if (JX && JX.toast) JX.toast(`🎁 Đã thu nhận toàn bộ ${count} thư!`);
      if (JX && JX.sound) JX.sound("snd/sound_a001_die.mp3", 1, 1);
    }
  };

  // ==========================================================================
  // 2. KỲ TRÂN CÁC MỞ RỘNG (ENHANCED KTC)
  // ==========================================================================
  const KtcEnhancer = {
    init: function() {
      // Mở khóa các mặt hàng bị ẩn trong mảng f1 của game gốc
      this.unlockHiddenItems();

      // Hook nút KTC trên header và giao diện
      const checkKtc = setInterval(() => {
        const ktcBtn = document.getElementById("ktcBtn");
        if (ktcBtn) {
          const oldClick = ktcBtn.onclick;
          ktcBtn.onclick = (e) => {
            this.unlockHiddenItems();
            if (typeof oldClick === "function") oldClick(e);
          };
          clearInterval(checkKtc);
        }
      }, 1000);
    },

    unlockHiddenItems: function() {
      if (typeof window.f1 !== "undefined" && Array.isArray(window.f1)) {
        window.f1.forEach(item => {
          // Bỏ thuộc tính hide để các bảo vật xuất hiện trên Kỳ Trân Các
          if (item && item.hide) {
            item.hide = 0;
            if (item.k === "ttsp") item.knb = 5;
            if (item.k === "qht") item.knb = 3;
            if (item.k === "hb") {
              item.knb = 10;
              item.d = "Hồng Bao May Mắn: Mở nhận ngẫu nhiên 500k – 10 triệu Lượng!";
              item.srv = 0;
              if (!item.use) {
                item.use = function() {
                  var JX = window.JX || window._JX;
                  var l = JX ? JX.S : null;
                  if (!l) return "Không tìm thấy nhân vật!";
                  var gold = Math.floor(Math.random() * 9500000) + 500000;
                  l.gold = (l.gold || 0) + gold;
                  return "💰 Hồng Bao May Mắn: Nhận " + gold.toLocaleString() + " Lượng!";
                };
              }
            }
            if (item.k === "dhb") {
              item.knb = 25;
              item.d = "Đại Hồng Bao: Mở nhận ngẫu nhiên 50 – 500 Kim Nguyên Bảo!";
              item.srv = 0;
              if (!item.use) {
                item.use = function() {
                  var JX = window.JX || window._JX;
                  var l = JX ? JX.S : null;
                  if (!l) return "Không tìm thấy nhân vật!";
                  var knb = Math.floor(Math.random() * 451) + 50;
                  l.knb  = (l.knb  || 0) + knb;
                  l.knbV = (l.knbV || 0) + knb;
                  return "💎 Đại Hồng Bao: Nhận " + knb + " Kim Nguyên Bảo!";
                };
              }
            }
          }
        });

        // ── Thêm các mặt hàng đặc biệt offline nếu chưa có ──────────────────
        var existingKeys = window.f1.map(function(x){ return x && x.k; });

        if (existingKeys.indexOf("htz_hkshard10") === -1) {
          window.f1.push({
            k: "htz_hkshard10",
            n: "🌟 Mảnh Hoàng Kim x10",
            ic: "img/ep/knb.png",
            knb: 15,
            d: "Gói 10 Mảnh Hoàng Kim Môn Phái — dùng để ghép trang bị Hoàng Kim!",
            hide: 0, srv: 0,
            use: function() {
              if (window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
                window.HtzItemGenerator.addHkShards(10);
                return "🌟 Nhận 10 Mảnh Hoàng Kim!";
              }
              return "Lỗi: Không tìm thấy HtzItemGenerator!";
            }
          });
        }

        if (existingKeys.indexOf("htz_hkbox") === -1) {
          window.f1.push({
            k: "htz_hkbox",
            n: "📦 Rương Hoàng Kim Ngẫu Nhiên",
            ic: "img/ep/box2.png",
            knb: 30,
            d: "Mở ra 1 trang bị Hoàng Kim Môn Phái ngẫu nhiên tương ứng với môn phái của bạn!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (!window.HtzItemGenerator || typeof window.HtzItemGenerator.makeHkItem !== "function")
                return "Lỗi: Không tìm thấy HtzItemGenerator!";
              var item = window.HtzItemGenerator.makeHkItem(l.fac, l.lvl);
              if (!item) return "Lỗi tạo trang bị!";
              if (!l.inv) l.inv = [];
              if (l.inv.length >= (JX.invMax || 60)) return "Túi đồ đã đầy! Hãy bán bớt đồ trước.";
              l.inv.push(item);
              return "📦 Nhận 1 Trang Bị Hoàng Kim: " + (item.n || "Trang Bị HK") + "!";
            }
          });
        }

        if (existingKeys.indexOf("htz_godwep") === -1) {
          window.f1.push({
            k: "htz_godwep",
            n: "⚔️ Vũ Khí Tím 6 Dòng",
            ic: "img/ep/box2.png",
            knb: 50,
            d: "Nhận ngay 1 Vũ Khí Tím 6 Dòng cực phẩm tương ứng môn phái!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (!window.HtzItemGenerator || typeof window.HtzItemGenerator.makeGodWeapon !== "function")
                return "Lỗi: Không tìm thấy HtzItemGenerator!";
              var w = window.HtzItemGenerator.makeGodWeapon(l.fac, l.lvl);
              if (!w) return "Lỗi tạo vũ khí!";
              if (!l.inv) l.inv = [];
              if (l.inv.length >= (JX.invMax || 60)) return "Túi đồ đã đầy!";
              l.inv.push(w);
              return "⚔️ Nhận Vũ Khí Tím 6 Dòng: " + (w.n || "Thần Binh") + "!";
            }
          });
        }

        if (existingKeys.indexOf("htz_qipack") === -1) {
          window.f1.push({
            k: "htz_qipack",
            n: "🌀 Gói Chân Khí x200",
            ic: "img/ep/knb.png",
            knb: 5,
            d: "Bổ sung 200 điểm Chân Khí — dùng để tu luyện Kinh Mạch!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (window.HtzState && window.HtzState.meridian !== undefined) {
                window.HtzState.meridian = (window.HtzState.meridian || 0) + 200;
              }
              l.qi = (l.qi || 0) + 200;
              return "🌀 Nhận +200 Chân Khí!";
            }
          });
        }

        if (existingKeys.indexOf("htz_attrpack") === -1) {
          window.f1.push({
            k: "htz_attrpack",
            n: "💡 Gói Tiềm Năng +5",
            ic: "img/ep/knb.png",
            knb: 20,
            d: "Nhận ngay +5 Điểm Tiềm Năng Vĩnh Viễn để phân phối thuộc tính!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              l.attrPts = (l.attrPts || 0) + 5;
              return "💡 Nhận +5 Điểm Tiềm Năng!";
            }
          });
        }

        if (existingKeys.indexOf("htz_hkshard30") === -1) {
          window.f1.push({
            k: "htz_hkshard30",
            n: "🌟 Mảnh Hoàng Kim x30",
            ic: "img/ep/knb.png",
            knb: 40,
            d: "Gói 30 Mảnh Hoàng Kim — ghép nhiều trang bị cùng lúc!",
            hide: 0, srv: 0,
            use: function() {
              if (window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
                window.HtzItemGenerator.addHkShards(30);
                return "🌟 Nhận 30 Mảnh Hoàng Kim!";
              }
              return "Lỗi: Không tìm thấy HtzItemGenerator!";
            }
          });
        }

        if (existingKeys.indexOf("htz_platbox") === -1) {
          window.f1.push({
            k: "htz_platbox",
            n: "👑 Rương Bạch Kim Môn Phái",
            ic: "img/ep/box3.png",
            knb: 50,
            d: "Mở ra 1 trang bị Bạch Kim Chí Tôn tương ứng với môn phái của đại hiệp!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (!window.HtzItemGenerator || typeof window.HtzItemGenerator.makePlatinaItem !== "function")
                return "Lỗi: Không tìm thấy HtzItemGenerator.makePlatinaItem!";
              var item = window.HtzItemGenerator.makePlatinaItem(l.fac, l.lvl);
              if (!item) return "Lỗi tạo trang bị Bạch Kim!";
              if (!l.inv) l.inv = [];
              if (l.inv.length >= (JX.invMax || 60)) return "Túi đồ đã đầy! Hãy bán bớt đồ trước.";
              l.inv.push(item);
              return "👑 Mở nhận Trang Bị Bạch Kim: " + (item.n || "Bạch Kim") + "!";
            }
          });
        }

        if (existingKeys.indexOf("htz_wc10") === -1) {
          window.f1.push({
            k: "htz_wc10",
            n: "💎 Thủy Tinh Trắng x10",
            ic: "img/ep/tt.png",
            knb: 10,
            d: "Gói 10 Thủy Tinh Trắng — nguyên liệu thiết yếu để chế tạo và thăng cấp trang bị Bạch Kim!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (!l.mats) l.mats = { ht:{}, ore:{}, shard:{}, misc:{}, dp:{} };
              if (!l.mats.misc) l.mats.misc = {};
              l.mats.misc.ltt = (l.mats.misc.ltt || 0) + 10;
              l.mats.misc.lmt = (l.mats.misc.lmt || 0) + 10;
              l.mats.misc.ttt = (l.mats.misc.ttt || 0) + 10;
              return "?? Nh?n +10 B? Th?y Tinh (Lam, L?c, T?) ?? ch? t?o & th?ng c?p B?ch Kim!";
            }
          });
        }

        if (existingKeys.indexOf("htz_mys5") === -1) {
          window.f1.push({
            k: "htz_mys5",
            n: "🔮 Thần Bí Khoáng Thạch x5",
            ic: "img/ep/knb.png",
            knb: 15,
            d: "Gói 5 Thần Bí Khoáng Thạch — nguyên liệu quý giá dùng chế tác thần trang Bạch Kim!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (!l.mats) l.mats = { ht:{}, ore:{}, shard:{}, misc:{}, dp:{} };
              if (!l.mats.misc) l.mats.misc = {};
              l.mats.misc.mys = (l.mats.misc.mys || 0) + 5;
              return "?? Nh?n +5 Th?n B? Kho?ng Th?ch (Hi?n c?: " + l.mats.misc.mys + ")!";
            }
          });
        }

        if (existingKeys.indexOf("htz_bk120") === -1) {
          window.f1.push({
            k: "htz_bk120",
            n: "📜 Bí Kíp 120 Môn Phái x5",
            ic: "img/ep/box2.png",
            knb: 25,
            d: "Bộ Bí Kíp 120 Trấn Phái — dùng để lĩnh hội và đột phá chiêu thức 120!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              if (!l.mats) l.mats = { ht:{}, ore:{}, shard:{}, misc:{}, dp:{} };
              if (!l.mats.misc) l.mats.misc = {};
              l.mats.misc.bk120 = (l.mats.misc.bk120 || 0) + 5;
              return "?? Nh?n +5 B? K?p 120 (Hi?n c?: " + l.mats.misc.bk120 + ")!";
            }
          });
        }

        if (existingKeys.indexOf("htz_bk150") === -1) {
          window.f1.push({
            k: "htz_bk150",
            n: "?? B? K?p 150 M?n Ph?i x5",
            ic: "img/ep/box2.png",
            knb: 35,
            d: "B? B? K?p 150 ??nh Cao - d?ng ?? l?nh ng? tuy?t k? c?p 150 th?p ??i m?n ph?i!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Kh?ng t?m th?y nh?n v?t!";
              if (!l.mats) l.mats = { ht:{}, ore:{}, shard:{}, misc:{}, dp:{} };
              if (!l.mats.misc) l.mats.misc = {};
              l.mats.misc.bk150 = (l.mats.misc.bk150 || 0) + 5;
              return "?? Nh?n +5 B? K?p 150 (Hi?n c?: " + l.mats.misc.bk150 + ")!";
            }
          });
        }


        if (existingKeys.indexOf("htz_bk90_50") === -1) {
          window.f1.push({
            k: "htz_bk90_50",
            n: "📚 Tàn Quyển Tuyệt Kỹ 150 x50",
            ic: "img/ep/box2.png",
            knb: 20,
            d: "Gói 50 Tàn Quyển Bí Kíp — dùng để mở khóa và thăng cấp Tuyệt Kỹ 150!",
            hide: 0, srv: 0,
            use: function() {
              var JX = window.JX || window._JX;
              var l = JX ? JX.S : null;
              if (!l) return "Không tìm thấy nhân vật!";
              l.misc = l.misc || {};
              l.misc.bk90 = (l.misc.bk90 || 0) + 50;
              return "📚 Nhận +50 Tàn Quyển Tuyệt Kỹ (Hiện có: " + l.misc.bk90 + ")!";
            }
          });
        }
      }
    }
  };

  // ==========================================================================
  // 3. ĐỒNG HÀNH TRỢ CHIẾN TINH CHỈNH (COMPANION MASTERY & SMART FOLLOWING)
  // ==========================================================================
  const CompanionMastery = {
    rage: 0,
    maxRage: 100,

    init: function() {
      this.startSmartLoop();
    },

    startSmartLoop: function() {
      setInterval(() => {
        const comp = window.__pkCurrentCompanion;
        const JX = getJX();
        if (!comp || !JX || !JX.H) return;
        const hero = JX.H;

        // 1. Khoảng cách theo chân mượt mà — tự động dịch chuyển nếu cách xa > 350px
        const dist = Math.hypot(comp.x - hero.x, comp.y - hero.y);
        if (dist > 350) {
          comp.x = hero.x - 45;
          comp.y = hero.y + 20;
        }

        // 2. Tích tụ Nộ Khí Đồng Hành (Companion Rage)
        this.rage = Math.min(this.maxRage, this.rage + 2);

        // 3. Thi triển Nộ Chiêu khi đầy nộ
        if (this.rage >= this.maxRage) {
          this.triggerCompanionUltimate(comp);
          this.rage = 0;
        }
      }, 1000);
    },

    triggerCompanionUltimate: function(comp) {
      const JX = getJX();
      if (!JX || !JX.R) return;
      const h = JX.R;

      const compId = comp._compId || (window.__pkBossState && window.__pkBossState.selectedCompanion) || "emei";

      let burstName = "Phật Quang Phổ Độ";
      let color = "#ffd700";

      if (compId === "emei") {
        burstName = "🌸 [Nga My Nộ Chiêu] Từ Hàng Phổ Độ";
        color = "#ff79c6";
        if (h && h.P) {
          h.life = Math.min(h.P.life, (h.life || 0) + h.P.life * 0.35);
          h.mana = Math.min(h.P.mana, (h.mana || 0) + h.P.mana * 0.35);
        }
      } else if (compId === "shaolin") {
        burstName = "☸️ [Thiếu Lâm Nộ Chiêu] Kim Cang Bất Hoại";
        color = "#ffd700";
        window.__companionDefBuff = { mul: 1.5, until: Date.now() + 8000 };
      } else if (compId === "gaibang") {
        burstName = "🔥 [Cái Bang Nộ Chiêu] Giáng Long Thập Bát Chưởng";
        color = "#ff6b6b";
        window.__companionAtkBurst = { mul: 1.6, until: Date.now() + 6000 };
      } else if (compId === "wudang") {
        burstName = "☯️ [Võ Đang Nộ Chiêu] Thái Cực Kiếm Khí";
        color = "#74c0fc";
        window.__companionDebuff = { atkReduce: 0.35, until: Date.now() + 8000 };
      } else if (compId === "tangmen") {
        burstName = "🗡️ [Đường Môn Nộ Chiêu] Bạo Vũ Lê Hoa Châm";
        color = "#cc5de8";
        window.__companionPierce = { defIgnore: 0.5, mul: 2.2, until: Date.now() + 5000 };
      } else {
        burstName = "🐾 [Linh Thú Nộ Chiêu] Thần Thú Hộ Thể";
        color = "#51cf66";
      }

      if (JX && JX.toast) {
        JX.toast(burstName);
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_die.mp3", 0.8, 1);
      }
    }
  };

  // ==========================================================================
  // 4. OẢN TÙ TÌ GIANG HỒ OFFLINE (ROCK-PAPER-SCISSORS STANDALONE)
  // ==========================================================================
  const RPS_STORAGE_KEY = "jx_rps_offline_v1";

  const defaultRpsState = {
    streak: 0,
    bestStreak: 0,
    totalPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0
  };

  let RpsState = Object.assign({}, defaultRpsState);
  try {
    const saved = localStorage.getItem(RPS_STORAGE_KEY);
    if (saved) Object.assign(RpsState, JSON.parse(saved));
  } catch (e) {}

  function saveRpsState() {
    try {
      localStorage.setItem(RPS_STORAGE_KEY, JSON.stringify(RpsState));
    } catch (e) {}
  }

  const RpsGame = {
    betAmount: 500000, // Mặc định 50 vạn Lượng
    betType: "gold",   // "gold" hoặc "knb"

    openGame: function() {
      let modal = document.getElementById("offlineRpsModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "offlineRpsModal";
        modal.className = "htz-modal-overlay";
        document.body.appendChild(modal);
      }

      this.renderGame(modal);
      modal.classList.remove("hidden");
    },

    renderGame: function(modal) {
      const JX = getJX();
      const l = JX ? JX.S : null;
      const gold = l ? (l.gold || 0) : 0;
      const knb = l ? (l.knb || 0) : 0;

      modal.innerHTML = `
        <div class="htz-modal-box" style="max-width:540px;">
          <div class="htz-modal-header">
            <div class="htz-modal-title">
              <span>✊</span>
              <span>SÒNG BẠC GIANG HỒ — OẢN TÙ TÌ KIẾM HIỆP</span>
            </div>
            <button class="htz-modal-close-btn" id="closeRpsModalBtn">✕</button>
          </div>
          <div class="htz-modal-body" style="padding:16px;">
            <div style="display:flex;justify-content:space-around;background:rgba(20,26,35,0.85);border:1px solid rgba(200,150,90,0.3);border-radius:6px;padding:10px;margin-bottom:12px;font-size:12px;">
              <span>Tài sản: <b style="color:#ff8787;">${fmtNum(gold)} Lượng</b> · <b style="color:#ffd700;">${knb} KNB</b></span>
              <span>Chuỗi thắng: <b style="color:#6fd46a;">${RpsState.streak}</b> (Kỷ lục: ${RpsState.bestStreak})</span>
            </div>

            <!-- Khu vực đối kháng -->
            <div class="rps-arena">
              <div class="rps-fighter">
                <div class="rps-avatar">🧓</div>
                <div style="font-weight:bold;color:#ffd700;font-size:12px;">Thần Bài Tương Dương</div>
                <div class="rps-choice-display" id="opponentChoice">❔</div>
              </div>
              <div class="rps-vs">VS</div>
              <div class="rps-fighter">
                <div class="rps-avatar">🥷</div>
                <div style="font-weight:bold;color:#6fd46a;font-size:12px;">Đại Hiệp (Bạn)</div>
                <div class="rps-choice-display" id="playerChoice">❔</div>
              </div>
            </div>

            <!-- Kết quả ván đấu -->
            <div id="rpsResultNotice" class="rps-result-text">Hãy chọn mức cược và ra thế xuất chiêu!</div>

            <!-- Chọn cược -->
            <div style="margin:14px 0;">
              <div style="font-size:12px;color:#ced4da;margin-bottom:6px;">💰 Chọn mức cược:</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <button class="rps-bet-chip ${this.betType==='gold'&&this.betAmount===100000?'active':''}" data-type="gold" data-amt="100000">10 vạn Lượng</button>
                <button class="rps-bet-chip ${this.betType==='gold'&&this.betAmount===500000?'active':''}" data-type="gold" data-amt="500000">50 vạn Lượng</button>
                <button class="rps-bet-chip ${this.betType==='gold'&&this.betAmount===2000000?'active':''}" data-type="gold" data-amt="2000000">200 vạn Lượng</button>
                <button class="rps-bet-chip ${this.betType==='knb'&&this.betAmount===50?'active':''}" data-type="knb" data-amt="50">50 KNB</button>
                <button class="rps-bet-chip ${this.betType==='knb'&&this.betAmount===200?'active':''}" data-type="knb" data-amt="200">200 KNB</button>
              </div>
            </div>

            <!-- 3 Nút ra chiêu Búa Kéo Bao -->
            <div style="display:flex;gap:12px;margin-top:16px;">
              <button class="rps-move-btn" data-move="rock">
                <span style="font-size:32px;">✊</span>
                <span>BÚA (ĐAO)</span>
              </button>
              <button class="rps-move-btn" data-move="scissors">
                <span style="font-size:32px;">✌</span>
                <span>KÉO (KIẾM)</span>
              </button>
              <button class="rps-move-btn" data-move="paper">
                <span style="font-size:32px;">🖐</span>
                <span>BAO (CHƯỞNG)</span>
              </button>
            </div>

            <!-- Thống kê -->
            <div style="margin-top:14px;text-align:center;font-size:11px;color:#868e96;">
              Tổng ván: ${RpsState.totalPlayed} · Thắng: <b style="color:#6fd46a;">${RpsState.wins}</b> · Hòa: <b>${RpsState.draws}</b> · Thua: <b style="color:#ff6b6b;">${RpsState.losses}</b>
            </div>
          </div>
        </div>
      `;

      document.getElementById("closeRpsModalBtn").onclick = () => modal.classList.add("hidden");
      modal.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

      // Chọn cược
      modal.querySelectorAll(".rps-bet-chip").forEach(chip => {
        chip.onclick = () => {
          this.betType = chip.getAttribute("data-type");
          this.betAmount = parseInt(chip.getAttribute("data-amt"), 10);
          this.renderGame(modal);
        };
      });

      // Ra chiêu
      modal.querySelectorAll(".rps-move-btn").forEach(btn => {
        btn.onclick = () => {
          const move = btn.getAttribute("data-move");
          this.playRound(move, modal);
        };
      });
    },

    playRound: function(playerMove, modal) {
      const JX = getJX();
      const l = JX ? JX.S : null;
      const h = JX ? (JX.R || window.h) : window.h;

      if (!l) return;

      // Kiểm tra tiền cược
      if (this.betType === "gold" && (l.gold || 0) < this.betAmount) {
        alert(`Không đủ Ngân Lượng! Bạn cần ${fmtNum(this.betAmount)} Lượng để đặt cược.`);
        return;
      }
      if (this.betType === "knb" && (l.knb || 0) < this.betAmount) {
        alert(`Không đủ KNB! Bạn cần ${this.betAmount} KNB để đặt cược.`);
        return;
      }

      // Trừ cược ban đầu
      if (this.betType === "gold") l.gold -= this.betAmount;
      else l.knb -= this.betAmount;

      // Máy chủ ra chiêu ngẫu nhiên
      const moves = ["rock", "scissors", "paper"];
      const opponentMove = moves[Math.floor(Math.random() * moves.length)];

      const moveIcons = { rock: "✊", scissors: "✌", paper: "🖐" };

      const pDisplay = document.getElementById("playerChoice");
      const oDisplay = document.getElementById("opponentChoice");
      const resNotice = document.getElementById("rpsResultNotice");

      if (pDisplay) pDisplay.textContent = moveIcons[playerMove];
      if (oDisplay) oDisplay.textContent = moveIcons[opponentMove];

      RpsState.totalPlayed++;

      // Xác định kết quả
      let outcome = "draw"; // "win", "lose", "draw"
      if (playerMove === opponentMove) {
        outcome = "draw";
      } else if (
        (playerMove === "rock" && opponentMove === "scissors") ||
        (playerMove === "scissors" && opponentMove === "paper") ||
        (playerMove === "paper" && opponentMove === "rock")
      ) {
        outcome = "win";
      } else {
        outcome = "lose";
      }

      if (outcome === "win") {
        RpsState.wins++;
        RpsState.streak++;
        if (RpsState.streak > RpsState.bestStreak) RpsState.bestStreak = RpsState.streak;

        // Thắng x2 cược
        const payout = this.betAmount * 2;
        if (this.betType === "gold") l.gold += payout;
        else l.knb += payout;

        if (resNotice) {
          resNotice.className = "rps-result-text win";
          resNotice.innerHTML = `🏆 CHIẾN THẮNG! Nhận lại <b style="color:#ffd700;">+${this.betType==='gold'?fmtNum(payout)+' Lượng':payout+' KNB'}</b> (Lãi +${this.betType==='gold'?fmtNum(this.betAmount):this.betAmount})!`;
        }

        // Thưởng thêm theo chuỗi thắng
        if (RpsState.streak === 3) {
          l.knb = (l.knb || 0) + 100;
          if (JX && JX.toast) JX.toast("🔥 Chuỗi 3 trận thắng! Thưởng thêm +100 KNB!");
        } else if (RpsState.streak === 5) {
          l.knb = (l.knb || 0) + 300;
          if (JX && JX.toast) JX.toast("🔥 Chuỗi 5 trận thắng liên tiếp! Thưởng thêm +300 KNB!");
          MailSystem.sendMail({
            sender: "Thần Bài Tương Dương",
            title: "🏆 Thưởng Chuỗi Thắng 5 Trận Sòng Bạc",
            content: "Đại hiệp thật xuất sắc! Thắng liền 5 ván Oản Tù Tì liên tiếp, sòng bạc kính gửi 10.000.000 Lượng và 200 KNB làm quà tương kiến!",
            rewards: { gold: 10000000, knb: 200, qi: 150 }
          });
        }

        if (JX && JX.sound) JX.sound("snd/sound_a001_die.mp3", 1, 1);
      } else if (outcome === "draw") {
        RpsState.draws++;
        // Hòa: trả lại tiền cược
        if (this.betType === "gold") l.gold += this.betAmount;
        else l.knb += this.betAmount;

        if (resNotice) {
          resNotice.className = "rps-result-text draw";
          resNotice.textContent = "🤝 BẤT PHÂN THẮNG BẠI! Hoàn trả lại toàn bộ tiền cược.";
        }
      } else {
        RpsState.losses++;
        RpsState.streak = 0;

        if (resNotice) {
          resNotice.className = "rps-result-text lose";
          resNotice.textContent = `💀 THUA TRẬN! Mất ${this.betType==='gold'?fmtNum(this.betAmount)+' Lượng':this.betAmount+' KNB'}. Hãy phục hận ở ván sau!`;
        }

        if (JX && JX.sound) JX.sound("snd/sound_a001_at.mp3", 0.7, 1);
      }

      saveRpsState();
      if (h) h.dirty = true;
    }
  };

  // ==========================================================================
  // KHỞI ĐỘNG VÀ GẮN NÚT VÀO GIAO DIỆN CHÍNH
  // ==========================================================================
  function initAll() {
    MailSystem.updateMailBadge = updateMailBadge;
    KtcEnhancer.init();
    CompanionMastery.init();

    // Thay thế hàm Y$ của game gốc (vốn bị lỗi yêu cầu online) bằng Oản Tù Tì Offline
    window.Y$ = () => RpsGame.openGame();

    // Hook phím F6 để mở Hộp Thư Offline thay vì báo lỗi kết nối máy chủ
    window.addEventListener("keydown", (e) => {
      if (e.key === "F6") {
        e.preventDefault();
        e.stopPropagation();
        MailSystem.openMailbox();
      }
    }, true);

    // Chèn nút Thư & Oản Tù Tì vào Action Ribbon
    const checkRibbon = setInterval(() => {
      const ribbon = document.getElementById("actionRibbon");
      if (!ribbon) return;

      if (!document.getElementById("ribbonMailBtn")) {
        const mailBtn = document.createElement("button");
        mailBtn.id = "ribbonMailBtn";
        mailBtn.className = "ribbon-btn highlight-mail";
        mailBtn.innerHTML = `
          <span class="ribbon-icon">📨</span>
          <span class="ribbon-txt">Hộp Thư</span>
          <em class="ribbon-dot" id="ribbonMailDot"></em>
        `;
        mailBtn.title = "Hộp Thư Bằng Hữu & Giang Hồ (Nhận quà Tân Thủ & Thư Hệ Thống - Phím F6)";
        mailBtn.onclick = () => MailSystem.openMailbox();
        ribbon.appendChild(mailBtn);
      }

      if (!document.getElementById("ribbonRpsBtn")) {
        const rpsBtn = document.createElement("button");
        rpsBtn.id = "ribbonRpsBtn";
        rpsBtn.className = "ribbon-btn highlight-rps";
        rpsBtn.innerHTML = `
          <span class="ribbon-icon">✊</span>
          <span class="ribbon-txt">Oản Tù Tì</span>
        `;
        rpsBtn.title = "Oản Tù Tì Kiếm Hiệp - Sòng Bạc Thần Bài Tương Dương (Cược Lượng & KNB)";
        rpsBtn.onclick = () => RpsGame.openGame();
        ribbon.appendChild(rpsBtn);
      }

      updateMailBadge();
      clearInterval(checkRibbon);
    }, 1000);

    console.log("[OfflineSystems] Toàn bộ 4 hệ thống Thư, KTC, Đồng Hành, Oản Tù Tì đã hoạt động!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.OfflineMailSystem = MailSystem;
  window.OfflineMails = OfflineMails;
  window.OfflineRpsGame = RpsGame;
  window.OfflineCompanionMastery = CompanionMastery;
})();

