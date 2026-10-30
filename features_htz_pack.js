/**
 * ============================================================================
 * VÕ LÂM IDLE - GÓI TÍNH NĂNG TINH HOA JX1 (THAM CHIẾU PLAY.HTZ.VN)
 * ============================================================================
 * 1. HỆ THỐNG THỜI TIẾT & NGÀY/ĐÊM ĐỘNG (Dynamic Weather System)
 * 2. NHIỆM VỤ SÁT THỦ NHIẾP THÍ TRẦN (Killer Bounty Board)
 * 3. ĐẢ THÔNG BÁT ĐẠI KINH MẠCH (Meridian Cultivation System)
 * 4. HỆ THỐNG LINH THÚ HỘ CHỦ & NHẶT ĐỒ TỰ ĐỘNG (Pet Companion & Smart Looter)
 * 5. ĐẠI CHIẾN TRƯỜNG TỐNG KIM (Song-Jin Battleground Simulation)
 * 6. BẢNG XẾP HẠNG CAO THỦ THẾ GIỚI (World Ladders & Hall of Fame)
 * 7. DANH HIỆU ĐỘNG BAY TRÊN ĐẦU NHÂN VẬT (Dynamic Overhead Titles)
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[HtzFeatures] Đang khởi chạy hệ thống tính năng tinh hoa Võ Lâm 1...");

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
  // DỮ LIỆU CỐT LÕI (STATE & DATABASE)
  // ==========================================================================
  const HTZ_STATE_KEY = "jx_htz_features_v1";

  const defaultState = {
    weatherMode: "auto", // auto, rain, snow, petals, night, clear
    meridians: {
      doc: 0,
      nham: 0,
      xung: 0,
      doi: 0,
      amkieu: 0,
      duongkieu: 0,
      amduy: 0,
      duongduy: 0
    },
    qi: 500, // Chân khí
    bountyPoints: 100, // Điểm Sát Thủ
    bountyKills: 0,
    activePet: "kylan", // kylan, soi, khuyen, hac, meo, gautruc
    petLevels: {
      kylan: 1,
      soi: 1,
      khuyen: 1,
      hac: 1,
      meo: 1,
      gautruc: 1
    },
    songjin: {
      camp: "song",
      rank: 1,
      points: 0,
      wins: 0,
      losses: 0
    },
    activeTitle: "Võ Lâm Chí Tôn",
    lastDailyWorship: 0
  };

  let HtzState = Object.assign({}, defaultState);

  function loadState() {
    try {
      const saved = localStorage.getItem(HTZ_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        HtzState = Object.assign({}, defaultState, parsed);
        HtzState.meridians = Object.assign({}, defaultState.meridians, parsed.meridians);
        HtzState.petLevels = Object.assign({}, defaultState.petLevels, parsed.petLevels);
        HtzState.songjin = Object.assign({}, defaultState.songjin, parsed.songjin);
      }
    } catch (e) {
      console.warn("[HtzFeatures] Không thể đọc state từ localStorage:", e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(HTZ_STATE_KEY, JSON.stringify(HtzState));
    } catch (e) {
      console.warn("[HtzFeatures] Không thể lưu state:", e);
    }
  }

  loadState();

  // ==========================================================================
  // 1. HỆ THỐNG THỜI TIẾT & CHIẾU SÁNG ĐỘNG (DYNAMIC WEATHER SYSTEM)
  // Tham chiếu: 3d0a6a8378.js trong play-htz-offline
  // ==========================================================================
  const HtzWeatherSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    mode: "disabled",
    init: function() {
      this.mode = "disabled";
      const oldCanvas = document.getElementById("htzWeatherCanvas");
      if (oldCanvas) oldCanvas.remove();
      const oldPill = document.getElementById("htzWeatherPill");
      if (oldPill) oldPill.remove();
      console.log("[HtzWeather] Đã tắt hoàn toàn hiệu ứng thời tiết.");
    },
    setupCanvas: function() {},
    resize: function() {},
    getEffectiveMode: function() { return "clear"; },
    initParticles: function() {},
    setMode: function() {},
    cycleMode: function() {},
    updatePillText: function() {},
    startLoop: function() {},
    draw: function() {}
  };

  // ==========================================================================
  // 2. NHIỆM VỤ SÁT THỦ NHIẾP THÍ TRẦN (KILLER BOUNTY BOARD)
  // Tham chiếu: 32bc4bfcc2.js trong play-htz-offline
  // ==========================================================================
  const BOUNTY_TARGETS = [
    // Sơ Cấp (Cấp 20 - 59)
    { id: "b1", name: "Hắc Phong Trại Chủ", title: "Lãnh Tụ Sơn Tặc", tier: "low", series: 0, level: 35, baseHp: 35000, rewardGold: 200000, rewardKnb: 50, rewardExp: 150000, points: 30, map: "Ba Lăng Huyện" },
    { id: "b2", name: "Lương Sơn Tiểu Tặc", title: "Phi Đao Đoạt Mệnh", tier: "low", series: 1, level: 45, baseHp: 55000, rewardGold: 300000, rewardKnb: 60, rewardExp: 220000, points: 35, map: "Giang Tân Thôn" },
    { id: "b3", name: "Phi Long Trại Đao Khách", title: "Đao Pháp Cuồng Loạn", tier: "low", series: 4, level: 55, baseHp: 85000, rewardGold: 450000, rewardKnb: 80, rewardExp: 350000, points: 40, map: "Vĩnh Lạc Trấn" },
    { id: "b4", name: "Xích Luyện Ma Nữ", title: "Độc Hỏa Thiêu Thân", tier: "low", series: 3, level: 59, baseHp: 110000, rewardGold: 600000, rewardKnb: 100, rewardExp: 500000, points: 50, map: "Thạch Cổ Trấn" },

    // Trung Cấp (Cấp 60 - 89)
    { id: "b5", name: "Đoạt Mệnh Kiếm Khách", title: "Kiếm Khí Lăng Lệ", tier: "mid", series: 2, level: 68, baseHp: 220000, rewardGold: 1000000, rewardKnb: 150, rewardExp: 1200000, points: 70, map: "Biện Kinh Phủ" },
    { id: "b6", name: "Huyết Đao Cuồng Tăng", title: "Ma Tăng Phá Giới", tier: "mid", series: 0, level: 75, baseHp: 320000, rewardGold: 1500000, rewardKnb: 200, rewardExp: 2000000, points: 85, map: "Phượng Tường Phủ" },
    { id: "b7", name: "Thất Sát Tướng Quân", title: "Hỏa Thương Trảm Tướng", tier: "mid", series: 3, level: 82, baseHp: 450000, rewardGold: 2200000, rewardKnb: 250, rewardExp: 3200000, points: 100, map: "Thành Đô Phủ" },
    { id: "b8", name: "Ma Giáo Hữu Sứ", title: "Huyền Thiết Trọng Quyền", tier: "mid", series: 4, level: 89, baseHp: 650000, rewardGold: 3000000, rewardKnb: 300, rewardExp: 5000000, points: 120, map: "Tương Dương Phủ" },

    // Cao Cấp (Cấp 90 - 150)
    { id: "b9", name: "Tuyệt Tình Ma Đầu", title: "Băng Tâm Tuyệt Hồn", tier: "high", series: 2, level: 98, baseHp: 1200000, rewardGold: 5000000, rewardKnb: 500, rewardExp: 10000000, points: 160, map: "Lâm An Phủ" },
    { id: "b10", name: "Vạn Độc Quỷ Mẫu", title: "Bách Độc Xuyên Tâm", tier: "high", series: 1, level: 108, baseHp: 1800000, rewardGold: 8000000, rewardKnb: 700, rewardExp: 18000000, points: 200, map: "Đại Lý Phủ" },
    { id: "b11", name: "U Linh Thần Tướng", title: "Hắc Binh Vô Địch", tier: "high", series: 0, level: 120, baseHp: 2800000, rewardGold: 12000000, rewardKnb: 1000, rewardExp: 30000000, points: 250, map: "Côn Lôn Sơn" },
    { id: "b12", name: "Độc Cô Nghịch Đồ", title: "Kiếm Ma Đệ Tử", tier: "high", series: 4, level: 135, baseHp: 4200000, rewardGold: 20000000, rewardKnb: 1500, rewardExp: 50000000, points: 350, map: "Hoa Sơn Đỉnh" }
  ];

  const HtzBountyKillerSystem = {
    activeHunt: null,

    startHunt: function(targetId) {
      // — MUTEX: Không cho spawn Sát Thủ khi đang có Boss/PK, Tống Kim hoặc đang săn Sát Thủ —
      if (window.__pkBossState && window.__pkBossState.activeFight) {
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast("⚠️ Đang có trận đấu Boss/PK! Kết thúc trận trước khi săn Sát Thủ.");
        HtzFeaturesHub.closeModal();
        return;
      }
      if (HtzSongJinBattle && HtzSongJinBattle.active) {
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast("⚠️ Đang trong Chiến Trường Tống Kim! Không thể săn Sát Thủ.");
        HtzFeaturesHub.closeModal();
        return;
      }
      if (this.activeHunt) {
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast("⚠️ Đang có Mật Lệnh Sát Thủ chưa hoàn thành! Hãy hạ gục ác tặc trước.");
        HtzFeaturesHub.closeModal();
        return;
      }

      const target = BOUNTY_TARGETS.find(t => t.id === targetId);
      if (!target) return;

      const JX = getJX();
      if (!JX || !JX.S || !JX.R) {
        alert("Game đang tải, vui lòng thử lại sau giây lát!");
        return;
      }

      const l = JX.S;
      const h = JX.R;
      const T = JX.H;

      // Spawn entity Sát Thủ vào h.enemies
      const spawnPos = typeof JX.walkable === "function" ? JX.walkable(T.x + 120, T.y + 40) : [T.x + 120, T.y + 40];

      let entity = null;
      if (typeof JX.spawn === "function") {
        entity = JX.spawn(141, target.level, "boss", spawnPos[0], spawnPos[1]);
      }

      if (!entity) {
        entity = {
          id: Math.random(),
          tid: 141,
          n: target.name,
          L: target.level,
          cls: "boss",
          series: target.series,
          hp: target.baseHp,
          max: target.baseHp,
          dmg: Math.round(target.level * 180 + 1200),
          def: 300,
          res: { phys: 40, cold: 40, fire: 40, light: 40, poison: 40 },
          x: spawnPos[0],
          y: spawnPos[1],
          r: 30,
          spd: 55,
          atkCd: 1,
          cd: 1.5,
          reach: 110
        };
      }

      entity.isBountyBoss = true;
      entity.bountyTargetId = target.id;
      entity.n = `[Sát Thủ] ${target.name}`;
      entity.hp = entity.max = target.baseHp;
      entity.dmg = Math.round(target.level * 180 + 1200);

      h.enemies = h.enemies || [];
      h.enemies.push(entity);

      this.activeHunt = {
        target: target,
        entity: entity
      };

      if (typeof JX.banner === "function") {
        JX.banner(`🎯 Lệnh Truy Nã Sát Thủ`, `Đã xuất hiện: ${target.name} (${target.title})!`, 3.5);
      }
      if (typeof JX.log === "function") {
        JX.log(`<b style="color:#ff6b6b">📜 [Mật Lệnh Sát Thủ]:</b> Bạn đã phát hiện tung tích <b style="color:#ffd700">${target.name}</b> (Cấp ${target.level} · ${target.map}). Mau trừ gian diệt ác!`);
      }
      if (typeof JX.toast === "function") {
        JX.toast(`🎯 Đã phát hiện Ác Tặc: ${target.name}!`);
      }
      if (typeof JX.sound === "function") {
        JX.sound("snd/sound_a001_die.mp3", 1, 1);
      }

      HtzFeaturesHub.closeModal();
    },

    onBountyKilled: function(targetId) {
      const target = BOUNTY_TARGETS.find(t => t.id === targetId);
      if (!target) return;

      const JX = getJX();
      const l = JX ? JX.S : null;

      // Cộng phần thưởng
      HtzState.bountyPoints += target.points;
      HtzState.bountyKills += 1;

      if (l) {
        l.gold = (l.gold || 0) + target.rewardGold;
        l.knb = (l.knb || 0) + target.rewardKnb;
        l.xp = (l.xp || 0) + target.rewardExp;
      }
      const h = JX ? (JX.R || window.h) : window.h;
      if (h) h.dirty = true;

      saveState();

      if (JX && JX.log) {
        JX.log(`<b style="color:#6fd46a">🏆 [Trảm Thủ Thành Công]:</b> Đã hạ gục ác bá <b style="color:#ffd700">${target.name}</b>! Nhận: <b>+${fmtNum(target.rewardGold)} Lượng</b>, <b>+${target.rewardKnb} KNB</b>, <b>+${fmtNum(target.rewardExp)} EXP</b>, <b>+${target.points} Điểm Sát Thủ</b>!`);
      }
      if (JX && JX.banner) {
        JX.banner("🏆 Hoàn Thành Mật Lệnh", `Trảm thủ thành công: ${target.name}!`, 3);
      }
      if (JX && JX.toast) {
        JX.toast(`🏆 Hoàn thành Mật Lệnh Sát Thủ (+${target.points} Điểm)!`);
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_at.mp3", 1, 1);
      }
    }
  };

  // ==========================================================================
  // 3. HỆ THỐNG ĐẢ THÔNG BÁT ĐẠI KINH MẠCH (MERIDIAN SYSTEM)
  // Tham chiếu: 857b6550bd.js trong play-htz-offline
  // ==========================================================================
  const MERIDIAN_INFO = [
    { key: "doc", name: "Đốc Mạch (Governing Vessel)", desc: "Chủ về dương khí toàn thân. Tăng mạnh Công Kích & Sát Thương Chí Mạng.", stat: "+80 Công Kích / +1% Bạo Kích mỗi tầng", costQi: 150, costGold: 100000 },
    { key: "nham", name: "Nhâm Mạch (Conception Vessel)", desc: "Chủ về âm huyết, biển của sinh mệnh. Tăng Sinh Lực Tối Đa & Hồi Phục.", stat: "+2.000 Sinh Lực / +50 Hồi Máu/giây mỗi tầng", costQi: 150, costGold: 100000 },
    { key: "xung", name: "Xung Mạch (Thoroughfare Vessel)", desc: "Biển của thập nhị kinh mạch, chứa nội lực dồi dào. Tăng Nội Lực & Hồi Phục.", stat: "+1.000 Nội Lực / +30 Hồi Mana/giây mỗi tầng", costQi: 120, costGold: 80000 },
    { key: "doi", name: "Đới Mạch (Girdle Vessel)", desc: "Buộc quanh bụng như đai ngọc, tăng thân pháp linh hoạt & khả năng né tránh.", stat: "+3 Tốc Chạy / +30 Thân Pháp mỗi tầng", costQi: 120, costGold: 80000 },
    { key: "amkieu", name: "Âm Kiều Mạch (Yin Heel Vessel)", desc: "Khai mở huyệt Chiếu Hải, bồi dưỡng thể chất chống đỡ ngoại lực và giá băng.", stat: "+4% Kháng Vật Lý / +4% Kháng Băng mỗi tầng", costQi: 180, costGold: 150000 },
    { key: "duongkieu", name: "Dương Kiều Mạch (Yang Heel Vessel)", desc: "Khai mở huyệt Thân Mạch, hóa giải sát thương hỏa diễm và lôi điện.", stat: "+4% Kháng Hỏa / +4% Kháng Lôi mỗi tầng", costQi: 180, costGold: 150000 },
    { key: "amduy", name: "Âm Duy Mạch (Yin Link Vessel)", desc: "Liên kết chư âm kinh, tẩy độc bài toan, giảm thời gian trúng độc giang hồ.", stat: "+5% Kháng Độc / -5% Thời Gian Trúng Độc mỗi tầng", costQi: 180, costGold: 150000 },
    { key: "duongduy", name: "Dương Duy Mạch (Yang Link Vessel)", desc: "Liên kết chư dương kinh, vạn pháp quy nguyên, tăng toàn bộ kháng tính và chống choáng.", stat: "+3% Toàn Bộ Kháng Tính / -5% Choáng mỗi tầng", costQi: 220, costGold: 200000 }
  ];

  const HtzMeridianSystem = {
    upgradeMeridian: function(key) {
      const info = MERIDIAN_INFO.find(m => m.key === key);
      if (!info) return;

      const currentLvl = HtzState.meridians[key] || 0;
      if (currentLvl >= 10) {
        alert("Kinh mạch này đã đạt cảnh giới tối đa (Tầng 10 - Viên Mãn)!");
        return;
      }

      const reqQi = info.costQi * (currentLvl + 1);
      const reqGold = info.costGold * (currentLvl + 1);

      const JX = getJX();
      const l = JX ? JX.S : null;

      if (HtzState.qi < reqQi) {
        alert(`Không đủ Chân Khí! Cần ${reqQi} Chân Khí (Hiện có: ${HtzState.qi}). Hãy train quái hoặc tụ khí để nhận thêm!`);
        return;
      }

      if (l && (l.gold || 0) < reqGold) {
        alert(`Không đủ Ngân Lượng! Cần ${fmtNum(reqGold)} Lượng.`);
        return;
      }

      // Trừ tài nguyên
      HtzState.qi -= reqQi;
      if (l) l.gold -= reqGold;
      HtzState.meridians[key] = currentLvl + 1;

      // Cộng thuộc tính vào nhân vật
      this.applyMeridianStats();
      saveState();

      if (JX && JX.toast) {
        JX.toast(`☸ Đả thông thành công ${info.name} (Tầng ${currentLvl + 1})!`);
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_die.mp3", 1, 1);
      }

      HtzFeaturesHub.renderTabContent("meridian");
    },

    meditateForQi: function() {
      // Dùng 100.000 Lượng đổi 150 Chân Khí
      const JX = getJX();
      const l = JX ? JX.S : null;
      const cost = 100000;

      if (!l || (l.gold || 0) < cost) {
        alert("Không đủ Ngân Lượng để thiền định quy nguyên (Cần 100.000 Lượng)!");
        return;
      }

      l.gold -= cost;
      HtzState.qi += 600;
      saveState();

      if (JX && JX.toast) {
        JX.toast("🧘 Thiền Định Quy Nguyên: Nhận +600 Chân Khí!");
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_at.mp3", 1, 1);
      }

      HtzFeaturesHub.renderTabContent("meridian");
    },

    upgradeAll: function() {
      const JX = getJX();
      const l = JX ? JX.S : null;
      let totalUpgrades = 0;
      let keepGoing = true;
      while (keepGoing) {
        keepGoing = false;
        for (const info of MERIDIAN_INFO) {
          const cur = HtzState.meridians[info.key] || 0;
          if (cur >= 10) continue;
          const reqQ = info.costQi * (cur + 1);
          const reqG = info.costGold * (cur + 1);
          if (HtzState.qi >= reqQ && (!l || (l.gold || 0) >= reqG)) {
            HtzState.qi -= reqQ;
            if (l) l.gold -= reqG;
            HtzState.meridians[info.key] = cur + 1;
            totalUpgrades++;
            keepGoing = true;
          }
        }
      }
      if (totalUpgrades > 0) {
        this.applyMeridianStats();
        saveState();
        if (JX && JX.toast) JX.toast(`✨ Đã đả thông liên tục ${totalUpgrades} tầng kinh mạch!`);
        if (JX && JX.sound) JX.sound("snd/sound_a001_die.mp3", 1, 1);
        HtzFeaturesHub.renderTabContent("meridian");
      } else {
        if (JX && JX.toast) JX.toast("Chưa đủ Chân Khí hoặc Bạc để nâng cấp thêm tầng nào!");
      }
    },

    applyMeridianStats: function() {
      const JX = getJX();
      const m = HtzState.meridians || {};
      const bonusHp = (m.nham || 0) * 2000;
      const bonusMp = (m.xung || 0) * 1000;

      // Tích hợp buff nội tại Bát Đại Kinh Mạch
      window.htzMeridianBonus = {
        atk: (m.doc || 0) * 80,
        crit: (m.doc || 0) * 1, // 1%
        hp: bonusHp,
        mp: bonusMp,
        regen: (m.nham || 0) * 50,
        manaRegen: (m.xung || 0) * 30,
        speed: (m.doi || 0) * 3, // 3%
        dex: (m.doi || 0) * 30,
        resPhys: ((m.amkieu || 0) * 4) + ((m.duongduy || 0) * 3),
        resCold: ((m.amkieu || 0) * 4) + ((m.duongduy || 0) * 3),
        resFire: ((m.duongkieu || 0) * 4) + ((m.duongduy || 0) * 3),
        resLight: ((m.duongkieu || 0) * 4) + ((m.duongduy || 0) * 3),
        resPoison: ((m.amduy || 0) * 5) + ((m.duongduy || 0) * 3),
        poisonRed: (m.amduy || 0) * 10,
        stunRed: (m.duongduy || 0) * 5
      };

      // Kích hoạt tính toán lại chỉ số nhân vật sau cập nhật kinh mạch
      try {
        var _jxm = getJX();
        var _hm = _jxm ? (_jxm.R || window.h) : window.h;
        if (_hm) _hm.dirty = true;
      } catch(_em) {}

      // Đăng ký hook vào engine để buff Kinh Mạch được áp dụng trong w1()
      window.__applyExternalCombatStats = function(p) {
        if (!p) return;

        // 1. Kinh Mạch (Meridian Bonus)
        const b = window.htzMeridianBonus;
        if (b) {
          if (b.hp) p.life = (p.life || 0) + b.hp;
          if (b.mp) p.mana = (p.mana || 0) + b.mp;
          if (b.regen) p.regen = (p.regen || 0) + b.regen;
          if (b.manaRegen) p.manaRegen = (p.manaRegen || 0) + b.manaRegen;
          if (b.atk) {
            p.wmin = (p.wmin || 0) + b.atk;
            p.wmax = Math.max(p.wmin, (p.wmax || 0) + b.atk);
          }
          if (b.crit) p.crit = Math.min(75, (p.crit || 0) + b.crit);
          if (b.speed) p.speed = (p.speed || 1) * (1 + (b.speed || 0) / 100);
          if (b.dex) p.dex = (p.dex || 0) + b.dex;
          if (b.poisonRed) p.poisonRed = Math.min(80, (p.poisonRed || 0) + b.poisonRed);
          if (b.stunRed) p.stunRed = Math.min(80, (p.stunRed || 0) + b.stunRed);

          if (p.res) {
            const mR = p.resMax || 75;
            if (b.resPhys) p.res.phys = Math.min(mR, (p.res.phys || 0) + b.resPhys);
            if (b.resCold) p.res.cold = Math.min(mR, (p.res.cold || 0) + b.resCold);
            if (b.resFire) p.res.fire = Math.min(mR, (p.res.fire || 0) + b.resFire);
            if (b.resLight) p.res.light = Math.min(mR, (p.res.light || 0) + b.resLight);
            if (b.resPoison) p.res.poison = Math.min(mR, (p.res.poison || 0) + b.resPoison);
          }
        }

        // 2. Linh Thú / Đồng Hành Bị Động (Pet Passive Bonus)
        const pb = window.htzPetBonus;
        if (pb) {
          if (pb.hpBonus) p.life = (p.life || 0) + pb.hpBonus;
          if (pb.hp) p.life = (p.life || 0) + pb.hp;
          if (pb.atk) {
            p.wmin = (p.wmin || 0) + pb.atk;
            p.wmax = Math.max(p.wmin, (p.wmax || 0) + pb.atk);
          }
          if (pb.def) p.def = (p.def || 0) + pb.def;
          if (pb.critBonus) p.crit = Math.min(75, (p.crit || 0) + Math.round(pb.critBonus * 100));
          if (pb.speedBonus) p.speed = (p.speed || 1) * (1 + pb.speedBonus);
          if (pb.manaBonus) p.mana = (p.mana || 0) + pb.manaBonus;
          if (pb.regenBonus) p.regen = (p.regen || 0) + pb.regenBonus;
        }

        // 3. Companion Ultimate Bursts (Đồng Hành Nộ Chiêu Tạm Thời)
        const now = Date.now();
        if (window.__companionAtkBurst && window.__companionAtkBurst.until > now) {
          p.wmin = Math.round((p.wmin || 0) * window.__companionAtkBurst.mul);
          p.wmax = Math.round((p.wmax || 0) * window.__companionAtkBurst.mul);
        }
        if (window.__companionDefBuff && window.__companionDefBuff.until > now) {
          if (p.res) {
            const mR = p.resMax || 85;
            p.res.phys = Math.min(mR, (p.res.phys || 0) + 20);
            p.res.cold = Math.min(mR, (p.res.cold || 0) + 20);
            p.res.fire = Math.min(mR, (p.res.fire || 0) + 20);
            p.res.light = Math.min(mR, (p.res.light || 0) + 20);
            p.res.poison = Math.min(mR, (p.res.poison || 0) + 20);
          }
          p.life = Math.round((p.life || 0) * 1.25);
        }
        if (window.__companionPierce && window.__companionPierce.until > now) {
          p.crit = Math.min(85, (p.crit || 0) + 25);
          p.wmax = Math.round((p.wmax || 0) * 1.35);
        }
      };

      // Đánh dirty để engine tự gọi w1() → hook sẽ kích hoạt
      const h = JX ? (JX.R || window.h) : window.h;
      if (h) h.dirty = true;
    }
  };

  // Tự động hồi phục Chân Khí theo thời gian (gom 6 chu kỳ ~60s mới ghi đĩa 1 lần)
  let _qiRegenTicks = 0;
  setInterval(() => {
    HtzState.qi = (HtzState.qi || 0) + 30; // Hồi 30 Chân Khí mỗi 10 giây (180 Qi/phút)
    _qiRegenTicks++;
    if (_qiRegenTicks >= 6) {
      _qiRegenTicks = 0;
      saveState();
    }
  }, 10000);

  // ==========================================================================
  // 4. HỆ THỐNG LINH THÚ HỘ CHỦ & NHẶT ĐỒ TỰ ĐỘNG (PET COMPANION & LOOTER)
  // Tham chiếu: cf511ea95c.js trong play-htz-offline
  // ==========================================================================
  const COMPANION_DATABASE = [
    // --- CAO THỦ ĐỒNG HÀNH VÕ LÂM ---
    { id: "doccocubai", name: "Độc Cô Cầu Bại", icon: "⚔️", series: "Kim", f: "wudang", desc: "Kiếm Ma tung hoành thiên hạ hơn ba mươi năm, cầu một lần bại chẳng được.", buffText: "+40% Tấn Công · +15% Bạo Kích · Vô Cực Kiếm Trận", radius: 450, skillName: "Vô Cực Kiếm Trận" },
    { id: "truongtamphong", name: "Trương Tam Phong", icon: "☯️", series: "Thổ", f: "wudang", desc: "Thái Cực Tông Sư Võ Đang, lấy tĩnh chế động, lấy nhu thắng cương.", buffText: "+35% Sinh Lực · +30 Kháng Tất Cả · Thái Cực Quyền", radius: 420, skillName: "Thái Cực Thần Công" },
    { id: "kieuphong", name: "Kiều Phong", icon: "🐉", series: "Hỏa", f: "gaibang", desc: "Bắc Kiều Phong cái thế anh hùng, Hàng Long Thập Bát Chưởng uy chấn giang hồ.", buffText: "+30% Sát Thương · +12% Hút Sinh Lực · Hàng Long Chưởng", radius: 400, skillName: "Hàng Long Thập Bát Chưởng" },
    { id: "duongqua", name: "Dương Quá", icon: "🦅", series: "Thủy", f: "cuiyan", desc: "Thần Điêu Đại Hiệp, kiếm pháp trầm trọng cương mãnh, Ám Nhiên Tiêu Hồn.", buffText: "+25% Tấn Công · +30% Tốc Đánh · Ám Nhiên Tiêu Hồn Chưởng", radius: 400, skillName: "Ám Nhiên Tiêu Hồn Chưởng" },
    { id: "tieulongnu", name: "Tiểu Long Nữ", icon: "🧝‍♀️", series: "Thủy", f: "emei", desc: "Cổ Mộ Tiên Tử thanh lệ thoát tục, thân pháp phiêu dật như tiên nữ giáng trần.", buffText: "+25% Né Tránh · +30% Hồi Máu · Ngọc Nữ Kiếm Pháp", radius: 380, skillName: "Ngọc Nữ Tâm Kinh" },
    { id: "hoangdung", name: "Hoàng Dung", icon: "🎋", series: "Mộc", f: "gaibang", desc: "Nữ hiệp thông minh cơ trí, Đả Cẩu Bổng Pháp biến hóa khôn lường.", buffText: "+35 May Mắn · +25% Tốc Chạy · Hút Vàng Bạc Rơi Cực Rộng", radius: 550, skillName: "Đả Cẩu Trận" },
    { id: "quachtinh", name: "Quách Tĩnh", icon: "🛡️", series: "Kim", f: "shaolin", desc: "Bắc Hiệp đại dũng, vì nước vì dân, Cửu Âm Chân Kinh hộ thể bất hoại.", buffText: "+40% Phòng Thủ · +35 Kháng Ngoại · Cửu Âm Chân Kinh", radius: 380, skillName: "Cửu Âm Chân Kinh" },
    { id: "doandu", name: "Đoàn Dự", icon: "⚡", series: "Thủy", f: "wudang", desc: "Thế tử Đại Lý tuấn tú nho nhã, Lục Mạch Thần Kiếm và Lăng Ba Vi Bộ vô song.", buffText: "+20% Bạo Kích · +25% Tốc Đánh · Lục Mạch Thần Kiếm", radius: 460, skillName: "Lục Mạch Thần Kiếm" },

    // --- LINH THÚ THƯỢNG CỔ HỘ MỆNH ---
    { id: "kylan", name: "Hỏa Kỳ Lân Con", icon: "🔥", series: "Hỏa", f: "tianren", desc: "Thần thú thượng cổ giáng trần, khí tức hỏa diễm bừng bừng.", buffText: "+Bạo kích · +Tấn công · Hút đồ 370–970px", radius: 370, skillName: "Liệt Hỏa Liêu Nguyên" },
    { id: "soi", name: "Tuyết Lang Vương", icon: "🐺", series: "Băng", f: "cuiyan", desc: "Sói tuyết ngàn năm trên đỉnh Tuyết Sơn, lướt gió như bay.", buffText: "+Tốc độ di chuyển · Bán kính 270–1070px", radius: 270, skillName: "Băng Thiên Tuyết Địa" },
    { id: "khuyen", name: "Hoàng Kim Thần Khuyển", icon: "🐕", series: "Kim", f: "tianwang", desc: "Thần tài hộ mệnh, dẫn lối nhặt ngọc tìm vàng.", buffText: "+Bạc/Vàng rơi thêm · Loot bonus · 300–1100px", radius: 300, skillName: "Chiêu Tài Tấn Bảo" },
    { id: "hac", name: "Tiên Hạc Côn Lôn", icon: "🕊️", series: "Lôi", f: "kunlun", desc: "Linh điểu thần thánh hộ thể, tỏa hào quang bảo mệnh.", buffText: "Hồi HP · +Phòng thủ · +HP tối đa · 280–1080px", radius: 280, skillName: "Hào Quang Hộ Chủ" },
    { id: "meo", name: "Kim Mao Chiêu Tài Miêu", icon: "🐱", series: "Mộc", f: "wudu", desc: "Mèo chiêu tài đắc lộc, tích tụ linh khí đất trời.", buffText: "+EXP nhận được · +Loot drop bonus · 280–1080px", radius: 280, skillName: "Linh Miêu Đoạt Bảo" },
    { id: "gautruc", name: "Hùng Miêu Kungfu", icon: "🐼", series: "Thổ", f: "shaolin", desc: "Đại hiệp gấu trúc mập mạp dũng mãnh, mình đồng da sắt.", buffText: "+HP tối đa tuyến tính · +Phòng thủ · 260–1060px", radius: 260, skillName: "Bàn Thạch Hộ Thể" }
  ];
  const PET_DATABASE = COMPANION_DATABASE;

  const HtzPetSystem = {
    badgeEl: null,

    init: function() {
      this.injectBadge();
      this.startLootLoop();
    },

    injectBadge: function() {
      const battle = document.getElementById("battle");
      if (!battle) return;

      let badge = document.getElementById("htzPetBadge");
      if (!badge) {
        badge = document.createElement("div");
        badge.id = "htzPetBadge";
        badge.className = "htz-pet-hud-badge";
        // Ưu tiên append vào widget bar (nếu đã có) để nằm cùng 1 row
        const bar = document.getElementById("htzQuickWidgetBar");
        if (bar) {
          bar.appendChild(badge);
        } else {
          // Widget bar chưa inject, đặt tạm sau #battle
          battle.insertAdjacentElement("afterend", badge);
        }
      }
      this.badgeEl = badge;
      this.updateBadge();
    },

    updateBadge: function() {
      if (!this.badgeEl) return;
      const pet = PET_DATABASE.find(p => p.id === HtzState.activePet) || PET_DATABASE[0];
      const lvl = HtzState.petLevels[pet.id] || 1;

      this.badgeEl.innerHTML = `
        <div class="htz-pet-avatar">${pet.icon}</div>
        <div class="htz-pet-info">
          <span class="htz-pet-name">${pet.name} (Lv.${lvl})</span>
          <span class="htz-pet-status">🐾 Đang hộ chủ & Tự nhặt đồ</span>
        </div>
      `;
      this.badgeEl.onclick = () => HtzFeaturesHub.openModal("pet");
    },

    setActivePet: function(petId) {
      HtzState.activePet = petId;
      saveState();

      // Đồng bộ sang pk_boss_system để đổi thực thể xuất chiến trên sân đấu ngay lập tức
      if (window.__pkBossState) {
        window.__pkBossState.selectedCompanion = petId;
        window.__pkBossState.companionEnabled = true;
      }
      if (typeof window.__pkEnsureCompanion === "function") {
        window.__pkEnsureCompanion();
      }

      this.updateBadge();
      this.applyPassiveBuff(); // Áp dụng buff ngay lập tức khi đổi đồng hành / linh thú

      const list = window.__pkBossCompanions || PET_DATABASE;
      const pet = list.find(p => p.id === petId) || PET_DATABASE.find(p => p.id === petId);
      const JX = getJX();
      if (JX && JX.toast && pet) {
        JX.toast(`🐾 Đã xuất chiến: ${pet.name}!`);
      }

      HtzFeaturesHub.renderTabContent("pet");
    },

    levelUpPet: function(petId) {
      const lvl = HtzState.petLevels[petId] || 1;
      if (lvl >= 100) {
        alert("Đồng hành đã đạt cảnh giới tối cao (Cấp 100)! Thiên Nhân Hợp Nhất!");
        return;
      }

      const cost = lvl * 150000 + 50000;
      const JX = getJX();
      const l = JX ? JX.S : null;

      if (!l || (l.gold || 0) < cost) {
        alert(`Không đủ Ngân Lượng để bồi dưỡng Đồng Hành! Cần ${fmtNum(cost)} Lượng.`);
        return;
      }

      l.gold -= cost;
      HtzState.petLevels[petId] = lvl + 1;
      saveState();
      this.applyPassiveBuff(); // Cập nhật buff ngay khi lên cấp

      // Cập nhật chỉ số thực thể chiến đấu
      if (typeof window.__pkEnsureCompanion === "function") {
        window.__pkEnsureCompanion();
      }

      if (JX && JX.toast) {
        JX.toast(`🐾 Bồi dưỡng thành công: ${petId} lên Cấp ${lvl + 1}!`);
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_at.mp3", 1, 1);
      }

      this.updateBadge();
      HtzFeaturesHub.renderTabContent("pet");
    },

    // Áp dụng buff bị động từ đồng hành & linh thú
    applyPassiveBuff: function() {
      const activeId = HtzState.activePet || (window.__pkBossState && window.__pkBossState.selectedCompanion) || "emei";
      const list = window.__pkBossCompanions || PET_DATABASE;
      const pet = list.find(function(p){ return p.id === activeId; }) || PET_DATABASE[0];
      const lvl = HtzState.petLevels[pet.id] || 1;
      const baseRadius = pet.radius || 280;
      const id = pet.id;

      // Milestone boost mỗi 10 cấp: +10% hiệu lực
      const ml = 1 + Math.floor(lvl / 10) * 0.1;

      // === Linh Thú (Beasts) ===
      const isBeastCrit  = (id==="kylan"||id==="gaibang"||id==="tangmen");
      const isBeastSpeed = (id==="soi"||id==="wudang");
      const isBeastGold  = (id==="khuyen"||id==="tangmen"||id==="gaibang");
      const isBeastHp    = (id==="gautruc"||id==="shaolin"||id==="hac");
      const isBeastHeal  = (id==="emei"||id==="hac");
      const isBeastAtk   = (id==="kylan"||id==="gaibang");
      const isBeastDef   = (id==="gautruc"||id==="shaolin"||id==="hac");
      const isBeastLoot  = (id==="meo"||id==="khuyen");

      // === Anh Hùng Huyền Thoại (Hero Companions) ===
      const isDocCo        = (id==="doccocubai");    // Độc Cô Cầu Bại
      const isTruong       = (id==="truongtamphong"); // Trương Tam Phong
      const isKieu         = (id==="kieuphong");     // Kiều Phong
      const isDuongQua     = (id==="duongqua");      // Dương Quá
      const isTieuLong     = (id==="tieulongnu");    // Tiểu Long Nữ
      const isHoangDung    = (id==="hoangdung");     // Hoàng Dung
      const isQuachTinh    = (id==="quachtinh");     // Quách Tĩnh
      const isDoanDu       = (id==="doandu");        // Đoàn Dự

      // Tính chỉ số buff
      const _critBonus  = (isBeastCrit||isDocCo||isDuongQua)
                            ? lvl*(isDocCo?0.02:isDuongQua?0.015:0.012)*ml : 0;
      const _speedBonus = (isBeastSpeed||isTieuLong)
                            ? lvl*(isTieuLong?0.022:0.018)*ml : 0;
      const _goldRate   = (isBeastGold||isHoangDung)
                            ? lvl*(isHoangDung?0.055:0.035)*ml : 0;
      const _hpBonus    = (isBeastHp||isTruong||isKieu||isQuachTinh)
                            ? lvl*(isTruong?800:isKieu?600:isQuachTinh?700:500)+lvl*lvl*20 : 0;
      const _healBonus  = (isBeastHeal||isTieuLong||isTruong)
                            ? lvl*(isTieuLong?0.035:isTruong?0.03:0.025)*ml : 0;
      const _atk        = (isBeastAtk||isDocCo||isKieu||isDuongQua)
                            ? lvl*(isDocCo?150:isKieu?120:isDuongQua?100:80)+Math.floor(lvl/10)*500 : 0;
      const _def        = (isBeastDef||isKieu||isQuachTinh)
                            ? lvl*(isKieu?50:isQuachTinh?45:30)+Math.floor(lvl/10)*200 : 0;
      const _lootBonus  = (isBeastLoot||isHoangDung)
                            ? (isHoangDung?0.1:0.05)+lvl*0.003 : 0;
      const _manaBonus  = isDoanDu ? lvl*800+lvl*lvl*15 : 0;
      const _regenBonus = (isDoanDu||isTruong) ? lvl*(isDoanDu?60:40) : 0;

      window.htzPetBonus = {
        petId: id,
        level: lvl,
        lootRadius: baseRadius + lvl * 8 + Math.floor(lvl / 10) * 20,
        critBonus:  _critBonus,
        speedBonus: _speedBonus,
        goldRate:   _goldRate,
        hpBonus:    _hpBonus,
        healBonus:  _healBonus,
        atk:        _atk,
        def:        _def,
        lootBonus:  _lootBonus,
        manaBonus:  _manaBonus,
        regenBonus: _regenBonus,
        desc: pet.desc
      };

      // Kích hoạt tính toán lại chỉ số nhân vật
      try {
        var _jxb = getJX();
        var _hb = _jxb ? (_jxb.R || window.h) : window.h;
        if (_hb) _hb.dirty = true;
      } catch(_e) {}
    },

    startLootLoop: function() {
      this.applyPassiveBuff();

      // Làm mới buff bị động mỗi 30 giây để đảm bảo đồng bộ sau khi lên cấp / đổi linh thú
      setInterval(() => {
        this.applyPassiveBuff();
      }, 30000);

      // Vòng lặp Hút Đồ Tự Động (Auto-Loot Magnetic Suction) — Tần số 180ms phản hồi mượt mà
      setInterval(() => {
        if (document.hidden) return;

        // Nếu đồng hành đang bật xuất chiến
        const isEnabled = window.__pkBossState ? window.__pkBossState.companionEnabled !== false : true;
        if (!isEnabled) return;

        const JX = getJX();
        if (!JX || !JX.R || !JX.H) return;
        const h = JX.R;
        const T = JX.H;

        if (!h.ground || !Array.isArray(h.ground) || !h.ground.length) return;
        if (h.town || h.inSafe) return; // Không hút trong thành

        const bonus = window.htzPetBonus;
        const radius = (bonus && bonus.lootRadius) ? bonus.lootRadius : 300;

        // Quét các vật phẩm trên mặt đất và hút về phía nhân vật / đồng hành
        const comp = window.__pkCurrentCompanion;
        const compX = comp ? comp.x : T.x;
        const compY = comp ? comp.y : T.y;

        // Lặp NGƯỢC để tránh lỗi index shift khi JX.pick gọi splice nội bộ
        for (let i = h.ground.length - 1; i >= 0; i--) {
          const item = h.ground[i];
          if (!item) continue;
          const distT = Math.hypot(item.x - T.x, item.y - T.y);
          const distC = comp ? Math.hypot(item.x - compX, item.y - compY) : distT;
          const minDist = Math.min(distT, distC);

          if (minDist <= 55) {
            // Đã chạm phạm vi nhặt -> Thực hiện nhặt tức thì (Instant Pick)
            // mb() tự splice nội bộ nên KHÔNG splice thêm ở đây
            if (typeof JX.pick === "function") {
              try { JX.pick(item, true); } catch(e) { /* bỏ qua */ }
            }
          } else if (minDist <= radius) {
            // Lực hút từ trường kéo vật phẩm bay mượt về chân người chơi
            item.x += (T.x - item.x) * 0.70;
            item.y += (T.y - item.y) * 0.70;
          }
        }
      }, 180);
    }
  };

  // ==========================================================================
  // 5. ĐẠI CHIẾN TRƯỜNG TỐNG KIM (SONG-JIN BATTLEGROUND) — HTZ Enhanced v2
  // Hệ thống chiến trường thực chiến: spawn địch thật, đếm kill thật,
  // sóng quân theo thời gian, tướng elite thưởng điểm cao, hồi chiêu.
  // ==========================================================================
  const SONGJIN_ENEMY_TIDS = {
    // tid, cls, scorePts, nameLabel, isGeneral
    soldier:  { tid: 180, cls: "normal",  pts: 15, label: "Binh Sĩ Địch",    isGeneral: false },
    elite:    { tid: 182, cls: "elite",   pts: 35, label: "Tinh Nhuệ Địch",   isGeneral: false },
    general:  { tid: 185, cls: "boss",    pts: 120, label: "Tướng Soái Địch", isGeneral: true  }
  };

  const HtzSongJinBattle = {
    active: false,
    timer: 180,           // 3 phút
    timerInterval: null,
    waveInterval: null,   // spawn sóng địch
    songScore: 0,
    kimScore: 0,
    playerKills: 0,       // đếm kill thật qua delta h.kills
    _lastHKills: 0,       // snapshot h.kills lúc bắt đầu
    wave: 0,              // sóng hiện tại (1-5)
    generalKills: 0,      // tướng bị trảm (thưởng bonus)
    hudEl: null,
    _cooldownUntil: 0,    // timestamp ms - cooldown giữa các trận

    // ── Cooldown helpers ──────────────────────────────────────────────────────
    isOnCooldown: function() {
      return Date.now() < this._cooldownUntil;
    },
    cooldownRemain: function() {
      return Math.max(0, Math.ceil((this._cooldownUntil - Date.now()) / 1000));
    },

    // ── Spawn một đợt quân địch vào h.enemies (Chiến trường Tống Kim tối ưu v3) ──
    spawnWave: function() {
      this.wave++;
      const JX = getJX();
      if (!JX || !JX.R || !JX.H) return;

      const h = JX.R;
      const hero = JX.H;
      if (!hero) return;

      h.enemies = h.enemies || [];
      h.allies = h.allies || [];

      const isSong = HtzState.songjin.camp === "song";
      const soldierCount = 2 + this.wave;
      const eliteCount   = this.wave >= 3 ? 2 : 1;
      const spawnGeneral = (this.wave === 3 || this.wave === 5);
      const isMarshal    = (this.wave === 5);

      const l = JX.S;
      const lvl = l ? (l.lvl || 30) : 30;

      const spawnRadius = 360;
      const baseX = hero.x + (isSong ? -spawnRadius : spawnRadius);
      const baseY = hero.y;

      const getEnemyLabel = (tidKey) => {
        if (tidKey === "soldier") return isSong ? "[Kim] Nữ Chân Binh Sĩ" : "[Tống] Nghĩa Quân Binh Sĩ";
        if (tidKey === "elite")   return isSong ? "[Kim] Thiết Kỵ Tiên Phong" : "[Tống] Thiết Chùy Tiên Phong";
        if (tidKey === "general") {
          if (isMarshal) return isSong ? "[Kim] Đại Nguyên Soái Hoàn Nhan Ngột Truật" : "[Tống] Đại Nguyên Soái Nhạc Phi";
          return isSong ? "[Kim] Tiên Phong Hoàn Nhan Trọng" : "[Tống] Đô Thống Dương Tái Hưng";
        }
        return "Quân Địch";
      };

      const _doSpawn = (tidKey, count, lvlMod) => {
        const cfg = SONGJIN_ENEMY_TIDS[tidKey];
        for (let i = 0; i < count; i++) {
          let ent = null;
          const sx = baseX + (Math.random() - 0.5) * 220;
          const sy = baseY + (Math.random() - 0.5) * 220;
          const enemyName = getEnemyLabel(tidKey);

          if (typeof JX.spawn === "function") {
            try { ent = JX.spawn(cfg.tid, Math.max(1, lvl + lvlMod), cfg.cls, sx, sy); } catch(e) {}
          }
          if (!ent) {
            ent = {
              id: Math.random(),
              tid: cfg.tid,
              n: enemyName,
              L: Math.max(1, lvl + lvlMod),
              cls: cfg.cls,
              hp: cfg.isGeneral ? (lvl * (isMarshal ? 2500 : 1200) + (isMarshal ? 80000 : 15000)) : (lvl * 160 + 1200),
              max: cfg.isGeneral ? (lvl * (isMarshal ? 2500 : 1200) + (isMarshal ? 80000 : 15000)) : (lvl * 160 + 1200),
              dmg: cfg.isGeneral ? (lvl * (isMarshal ? 22 : 12) + (isMarshal ? 200 : 80)) : (lvl * 4 + 25),
              def: cfg.isGeneral ? 50 : 20,
              res: { phys: 30, cold: 30, fire: 30, light: 30, poison: 30 },
              x: sx, y: sy,
              r: cfg.isGeneral ? 45 : 28,
              spd: cfg.isGeneral ? 52 : 60,
              atkCd: 1.1, cd: 1.5, reach: 110,
              ranged: false, born: h.clock || 0,
              stun: 0, slowT: 0, poison: 0, poisonDmg: 0, hitT: 0, face: 1
            };
          } else {
            ent.n = enemyName;
          }

          ent.isSongJin = true;
          ent.customBoss = true;
          ent.goldBoss = true;
          ent.songJinPts = cfg.pts * (isMarshal ? 3 : 1);
          ent.isGeneral = cfg.isGeneral;
          ent.isMarshal = isMarshal;

          h.enemies.push(ent);
        }
      };

      _doSpawn("soldier", soldierCount, 0);
      _doSpawn("elite",   eliteCount,   3);
      if (spawnGeneral) _doSpawn("general", 1, isMarshal ? 12 : 8);

      // Thêm Quân Đồng Minh cùng tham chiến (Allied Reinforcements)
      const maxAllies = 3;
      const curAllies = h.allies.filter(a => a && a.isSongJinAlly).length;
      if (curAllies < maxAllies) {
        const allySpawnCount = Math.min(2, maxAllies - curAllies);
        for (let j = 0; j < allySpawnCount; j++) {
          const allyName = isSong
            ? (j === 0 && this.wave >= 3 ? "[Tống] Tiên Phong Hiệu Úy" : "[Tống] Nghĩa Quân Dũng Sĩ")
            : (j === 0 && this.wave >= 3 ? "[Kim] Thiết Kỵ Bách Hộ" : "[Kim] Nữ Chân Dũng Sĩ");
          const allyEnt = {
            isSongJinAlly: true,
            n: allyName,
            f: isSong ? "shaolin" : "tianwang",
            s: 0,
            l: lvl,
            hpMax: lvl * 1500 + 10000,
            hp: lvl * 1500 + 10000,
            def: lvl * 25 + 200,
            res: 65,
            dps: Math.round(lvl * 110 + 600),
            d1: Math.round((lvl * 110 + 600) / 2),
            mel: true,
            se: isSong ? 0 : 3,
            el: "phys",
            id: 101,
            L: Math.min(20, Math.floor(lvl / 5)),
            nm: 1, rt: 1, pf: {}, stn: 0, ct: 0, bf: [], cu: [],
            x: hero.x + (Math.random() - 0.5) * 150,
            y: hero.y + (Math.random() - 0.5) * 150,
            _px: hero.x, _py: hero.y,
            dir: 0, t: 0, dead: false, resp: 0
          };
          h.allies.push(allyEnt);
        }
      }

      if (JX && JX.log) {
        const generalName = isMarshal
          ? (isSong ? "Hoàn Nhan Ngột Truật" : "Nhạc Phi")
          : (isSong ? "Hoàn Nhan Trọng" : "Dương Tái Hưng");
        const waveMsg = isMarshal
          ? `⚔ Sóng ${this.wave}: <b style="color:#ff3333;font-size:13px;">⚠ [ĐẠI NGUYÊN SOÁI ${generalName.toUpperCase()}] đích thân xuất trận! Mau hộ giá diệt địch!</b>`
          : (spawnGeneral
            ? `⚔ Sóng ${this.wave}: Tướng địch <b>${generalName}</b> xung trận! Quân đồng minh tiếp viện!`
            : `⚔ Sóng ${this.wave}: Quân địch tăng viện ồ ạt — Hiệp khách dũng mãnh xung phong!`);
        JX.log(`<b style="color:#ff6b6b">[Tống Kim]</b> ${waveMsg}`);
      }
      // Banner chiến trường mỗi sóng
      if (JX && JX.banner) {
        var _wBannerTitle = isMarshal ? "⚠ ĐẠI NGUYÊN SOÁI XUẤT TRẬN!" : (spawnGeneral ? "TƯỚNG ĐỊCH TIÊN PHONG!" : "CHIẾN TRƯỜNG TỐNG KIM");
        var _wBannerSub   = "Sóng " + this.wave + "/5" + (isMarshal ? " · Sóng Cuối — Toàn Lực Nghênh Địch!" : " · Quân địch đang tiến công!");
        JX.banner(_wBannerTitle, _wBannerSub, 2);
      }
      if (JX && JX.sound) JX.sound("snd/sound_a001_die.mp3", 0.7, 1);
    },

    // ── Đếm kill thực qua delta h.kills ─────────────────────────────────────
    _pollKills: function() {
      const JX = getJX();
      if (!JX || !JX.R) return;
      const h = JX.R;
      const currentKills = h.kills || 0;
      const delta = currentKills - this._lastHKills;
      if (delta > 0) {
        this._lastHKills = currentKills;
        this.playerKills += delta;

        // Kiểm tra quân Tống Kim (entities đã chết và có flag)
        let generalDied = false;
        if (h.enemies) {
          h.enemies.forEach(e => {
            if (e && e.isSongJin && e.dead && !e._sjCounted) {
              e._sjCounted = true;
              const ptsGain = e.songJinPts || 15;
              if (HtzState.songjin.camp === "song") this.songScore += ptsGain;
              else this.kimScore += ptsGain;
              if (e.isGeneral) {
                this.generalKills++;
                generalDied = true;
              }
            }
          });
        } else {
          // Không có enemy array — tính điểm mặc định mỗi kill
          const ptsPerKill = 20;
          if (HtzState.songjin.camp === "song") this.songScore += delta * ptsPerKill;
          else this.kimScore += delta * ptsPerKill;
        }

        if (generalDied) {
          const JX2 = getJX();
          if (JX2 && JX2.banner) JX2.banner("⚔ TƯỚNG ĐỊA BỊ TRẢM!", "Đại công! Điểm Quân Công +120 · Thưởng hậu hĩnh!", 3);
          if (JX2 && JX2.sound) JX2.sound("snd/sound_a001_at.mp3", 1, 1);
        }

        if (JX && JX.log && this.playerKills % 5 === 0) {
          JX.log(`<b style="color:#ff6b6b">⚔ [Tống Kim Liên Trảm]:</b> Đã liên trảm <b>${this.playerKills}</b> quân địch! Quân công tích lũy!`);
        }
      }
    },

    startBattle: function(camp) {
      // — Kiểm tra cooldown —
      if (this.isOnCooldown()) {
        const rem = this.cooldownRemain();
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast(`⏳ Hồi chiêu Tống Kim: còn ${rem}s. Nghỉ ngơi rồi xuất quân lại!`);
        return;
      }

      // — MUTEX: Không vào Tống Kim khi đang có Boss/PK hoặc đang săn Sát Thủ —
      if (window.__pkBossState && window.__pkBossState.activeFight) {
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast("⚠️ Đang có trận đấu Boss/PK! Kết thúc trận trước khi vào Chiến Trường Tống Kim.");
        HtzFeaturesHub.closeModal();
        return;
      }
      if (HtzBountyKillerSystem && HtzBountyKillerSystem.activeHunt) {
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast("⚠️ Đang có Mật Lệnh Sát Thủ! Hoàn thành hoặc hạ ác tặc trước khi vào Tống Kim.");
        HtzFeaturesHub.closeModal();
        return;
      }

      // Nếu đang có trận Tống Kim cũ, dừng hẳn trước khi bắt đầu mới
      if (this.active) {
        this._clearTimers();
        const oldHud = document.getElementById("htzSongJinHud");
        if (oldHud) { oldHud.remove(); this.hudEl = null; }
      }

      HtzState.songjin.camp = camp || "song";
      this.active = true;
      this.timer = 180;
      this.songScore = 0;
      this.kimScore = 0;
      this.playerKills = 0;
      this.generalKills = 0;
      this.wave = 0;

      // Snapshot h.kills để tính delta sau
      const JX = getJX();
      this._lastHKills = (JX && JX.R) ? (JX.R.kills || 0) : 0;

      if (JX && JX.banner) {
        JX.banner("🚩 ĐẠI CHIẾN TỐNG KIM", `Gia nhập phe: ${camp === "song" ? "ĐẠI TỐNG" : "ĐẠI KIM"} · Tiến lên trảm địch!`, 4);
      }
      if (JX && JX.log) {
        JX.log(`<b style="color:#ffd700">🚩 [Chiến Trường Tống Kim]:</b> Hồi còi xuất quân đã điểm! Bạn gia nhập phe <b style="${camp === 'song' ? 'color:#ff6b6b' : 'color:#4dabf7'}">${camp === 'song' ? 'Đại Tống (Cờ Đỏ)' : 'Đại Kim (Cờ Xanh)'}</b>! Xông lên đoạt cờ, trảm tướng!`);
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_die.mp3", 1, 1);
      }

      this.renderHud();
      this._startTimerLoop();
      this._startWaveLoop();
      HtzFeaturesHub.closeModal();
    },

    _clearTimers: function() {
      if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
      if (this.waveInterval)  { clearInterval(this.waveInterval);  this.waveInterval  = null; }
    },

    renderHud: function() {
      const battle = document.getElementById("battle") || document.body;
      let hud = document.getElementById("htzSongJinHud");
      if (!hud) {
        hud = document.createElement("div");
        hud.id = "htzSongJinHud";
        hud.className = "htz-songjin-hud";
        battle.appendChild(hud);
      }
      this.hudEl = hud;
      this.updateHud();
    },

    updateHud: function() {
      if (!this.hudEl) return;
      const mins = Math.floor(this.timer / 60);
      const secs = (this.timer % 60).toString().padStart(2, "0");
      const totalScore = this.songScore + this.kimScore || 1;
      const myCampScore = HtzState.songjin.camp === "song" ? this.songScore : this.kimScore;
      const myBarPct = Math.min(100, Math.round(myCampScore / totalScore * 100));

      this.hudEl.innerHTML = `
        <div class="htz-camp-box">
          <span class="htz-camp-name htz-camp-song">TỐNG</span>
          <span class="htz-camp-score" id="htzSongScore">${this.songScore}</span>
        </div>
        <div style="flex:1;padding:0 6px;">
          <div style="height:5px;background:#333;border-radius:3px;overflow:hidden;margin-bottom:2px;">
            <div style="height:100%;width:${myBarPct}%;background:${HtzState.songjin.camp==='song'?'#ff6b6b':'#4dabf7'};transition:width 0.5s;"></div>
          </div>
          <div style="text-align:center;font-size:10px;color:#ffd700;">⏳ ${mins}:${secs} · Sóng ${this.wave}/5</div>
        </div>
        <div class="htz-camp-box">
          <span class="htz-camp-score" id="htzKimScore">${this.kimScore}</span>
          <span class="htz-camp-name htz-camp-kim">KIM</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-left:4px;">
          <span style="font-size:11px;color:#ffd700;">⚔<b>${this.playerKills}</b> 🏅<b>${this.generalKills}</b></span>
          <button class="htz-sj-leave-btn" id="htzSjLeaveBtn">Rút lui</button>
        </div>
      `;

      document.getElementById("htzSjLeaveBtn").onclick = () => this.endBattle(false);
    },

    // ── Vòng đếm giờ + poll kills 1 giây/lần ───────────────────────────────
    _startTimerLoop: function() {
      if (this.timerInterval) clearInterval(this.timerInterval);

      this.timerInterval = setInterval(() => {
        if (!this.active) return;
        this.timer--;

        // Poll số kill thực tế từ h.kills
        this._pollKills();

        // Phe địch cũng kiếm điểm (ngẫu nhiên nhỏ, chỉ để tạo cảm giác cạnh tranh)
        if (Math.random() < 0.4) {
          if (HtzState.songjin.camp === "song") this.kimScore += Math.floor(Math.random() * 8 + 2);
          else this.songScore += Math.floor(Math.random() * 8 + 2);
        }

        this.updateHud();

        if (this.timer <= 0) {
          this.endBattle(true);
        }
      }, 1000);
    },

    // ── Spawn sóng quân: sóng 1 sau 5s, mỗi 35s tiếp theo ──────────────────
    _startWaveLoop: function() {
      if (this.waveInterval) clearInterval(this.waveInterval);

      // Sóng đầu sau 3 giây
      setTimeout(() => {
        if (this.active && this.wave < 5) this.spawnWave();
      }, 3000);

      // Sóng 2-5 cách nhau ~35 giây
      this.waveInterval = setInterval(() => {
        if (!this.active) { clearInterval(this.waveInterval); return; }
        if (this.wave >= 5) { clearInterval(this.waveInterval); return; }
        this.spawnWave();
      }, 35000);
    },

    startLoop: function() {
      // Legacy alias — redirects to new system
      this._startTimerLoop();
    },

    endBattle: function(completed) {
      this.active = false;
      this._clearTimers();

      const JX = getJX();
      if (JX && JX.R) {
        if (JX.R.enemies) JX.R.enemies = JX.R.enemies.filter(e => e && !e.isSongJin);
        if (JX.R.allies)  JX.R.allies  = JX.R.allies.filter(a => a && !a.isSongJinAlly);
      }

      if (this.hudEl) {
        this.hudEl.remove();
        this.hudEl = null;
      }

      this._pollKills();

      if (!completed) {
        this._cooldownUntil = Date.now() + 45000;
        const _jx = getJX();
        if (_jx && _jx.toast) _jx.toast("🚩 Đã rút lui khỏi Chiến Trường Tống Kim! Hồi chiêu 60 giây.");
        return;
      }

      const isSong = HtzState.songjin.camp === "song";
      const myCampScore = isSong ? this.songScore : this.kimScore;
      const oppScore    = isSong ? this.kimScore  : this.songScore;
      const victory     = myCampScore > oppScore;

      // Điểm quân công hấp dẫn
      const earnedPts  = this.playerKills * 50 + this.generalKills * 160 + (victory ? 600 : 250);
      const earnedGold = this.playerKills * 300000 + this.generalKills * 800000 + (victory ? 5000000 : 1500000);
      const earnedKnb  = victory ? 800 : 300;

      HtzState.songjin.points += earnedPts;
      if (victory) HtzState.songjin.wins++; else HtzState.songjin.losses++;

      // Thăng cấp quân hàm
      const pts = HtzState.songjin.points;
      if      (pts >= 15000) HtzState.songjin.rank = 6;
      else if (pts >= 7500)  HtzState.songjin.rank = 5;
      else if (pts >= 3500)  HtzState.songjin.rank = 4;
      else if (pts >= 1500)  HtzState.songjin.rank = 3;
      else if (pts >= 500)   HtzState.songjin.rank = 2;
      else                   HtzState.songjin.rank = 1;

      const l = JX ? JX.S : null;
      if (l) {
        l.gold = (l.gold || 0) + earnedGold;
        l.knb  = (l.knb  || 0) + earnedKnb;
        l.knbV = (l.knbV || 0) + earnedKnb;

        // Trao Mảnh Hoàng Kim Môn Phái có thể ghép đồ ngay
        const shardCount = victory ? (8 + Math.floor(Math.random() * 7)) : (3 + Math.floor(Math.random() * 3));
        if (window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
          window.HtzItemGenerator.addHkShards(shardCount);
        }

        // Thưởng 1 Rương Chiến Trường Tống Kim
        if (l.inv && l.inv.length < (JX.invMax || 60)) {
          const chestUid = (l.uid++) || Date.now();
          l.inv.push({
            uid: chestUid,
            n: "Rương Chiến Trường Tống Kim",
            d: 12,
            r: 3,
            ic: "img/ep/box3.png",
            price: 50000,
            desc: "Rương đại chiến Tống Kim: Chứa mảnh Hoàng Kim, Huyền Tinh, Thủy Tinh và KNB."
          });
        }
      }
      const h = JX ? (JX.R || window.h) : window.h;
      if (h) h.dirty = true;

      this._cooldownUntil = Date.now() + 90000;
      saveState();

      const rankNames = ["", "Binh Sĩ", "Bách Phu Trưởng", "Đô Thống", "Tiên Phong", "Thống Soái", "Đại Nguyên Soái Tống Kim"];
      const resultMsg  = victory ? "🏆 TOÀN THẮNG KHẢI HOÀN!" : "⚔ TRẬN CHIẾN KẾT THÚC!";

      if (JX && JX.banner) {
        JX.banner(resultMsg, `Trảm: ${this.playerKills} (${this.generalKills} Tướng) · Quân công: +${earnedPts} · Hàm: ${rankNames[HtzState.songjin.rank]}`, 6);
      }
      if (JX && JX.log) {
        var _campName = isSong ? "Đại Tống" : "Đại Kim";
        JX.log(`<b style="color:#ffd700">🏁 [Kết Thúc Tống Kim]:</b> ${resultMsg} Trảm <b>${this.playerKills}</b> binh + <b style="color:#ffd700">${this.generalKills} Tướng</b>! Phe <b>${_campName}</b>: ${myCampScore} điểm vs ${oppScore} điểm. Nhận: <b>+${fmtNum(earnedGold)} Lượng</b>, <b>+${earnedKnb} KNB</b>, <b>+${earnedPts} QC</b>, <b>+Mảnh Hoàng Kim & Rương Tống Kim</b>! Quân hàm: <b style="color:#ff6b6b">${rankNames[HtzState.songjin.rank]}</b>!`);
      }
      if (JX && JX.sound) JX.sound("snd/sound_a001_at.mp3", 1, 1);
    }
  };

  // ==========================================================================
  // 6. BẢNG XẾP HẠNG THẾ GIỚI (WORLD HALL OF FAME)
  // Tham chiếu: 72c2fea75f.js trong play-htz-offline
  // ==========================================================================
  const HALL_OF_FAME_MASTERS = [
    { rank: 1, name: "Độc Cô Cầu Bại", sect: "Võ Đang", level: 150, power: 999999, gold: 10000000000, bounty: 120, songjin: 28500 },
    { rank: 2, name: "Kiều Phong", sect: "Cái Bang", level: 145, power: 885000, gold: 8000000000, bounty: 98, songjin: 24200 },
    { rank: 3, name: "Trương Vô Kỵ", sect: "Côn Lôn", level: 142, power: 820000, gold: 7200000000, bounty: 85, songjin: 21000 },
    { rank: 4, name: "Lệnh Hồ Xung", sect: "Hoa Sơn", level: 138, power: 760000, gold: 6500000000, bounty: 76, songjin: 18500 },
    { rank: 5, name: "Hoàng Dược Sư", sect: "Đào Hoa Đảo", level: 135, power: 710000, gold: 5800000000, bounty: 68, songjin: 16000 },
    { rank: 6, name: "Dương Quá", sect: "Cổ Mộ", level: 132, power: 660000, gold: 5100000000, bounty: 60, songjin: 14200 },
    { rank: 7, name: "Tiểu Long Nữ", sect: "Nga My", level: 128, power: 610000, gold: 4500000000, bounty: 52, songjin: 12500 },
    { rank: 8, name: "Đoàn Dự", sect: "Đại Lý", level: 125, power: 570000, gold: 4000000000, bounty: 45, songjin: 10800 },
    { rank: 9, name: "Hư Trúc", sect: "Thiếu Lâm", level: 120, power: 520000, gold: 3500000000, bounty: 38, songjin: 9200 }
  ];

  const HtzHallOfFame = {
    worshipMasters: function() {
      const now = Date.now();
      const last = HtzState.lastDailyWorship || 0;
      // 1 ngày = 86400000 ms (hoặc 12 tiếng)
      if (now - last < 43200000) {
        const remainHours = Math.ceil((43200000 - (now - last)) / 3600000);
        alert(`Hôm nay bạn đã bái kiến chư vị Tiền Bối Cao Thủ rồi! Vui lòng quay lại sau ${remainHours} giờ nữa.`);
        return;
      }

      HtzState.lastDailyWorship = now;
      HtzState.qi = (HtzState.qi || 0) + 300;

      const JX = getJX();
      const l = JX ? JX.S : null;
      if (l) {
        l.gold = (l.gold || 0) + 500000;
        l.xp = (l.xp || 0) + 1500000;
        l.knb = (l.knb || 0) + 100;
      }

      saveState();

      if (JX && JX.toast) {
        JX.toast("🙏 Bái Kiến Cao Thủ: Nhận 500.000 Lượng + 100 KNB + 300 Chân Khí!");
      }
      if (JX && JX.sound) {
        JX.sound("snd/sound_a001_die.mp3", 1, 1);
      }

      HtzFeaturesHub.renderTabContent("ladder");
    }
  };

  // ==========================================================================
  // 7. DANH HIỆU ĐỘNG BAY TRÊN ĐẦU NHÂN VẬT (DYNAMIC OVERHEAD TITLES)
  // Tham chiếu: ead5ad0c0d.js trong play-htz-offline
  // ==========================================================================
  const HTZ_TITLES = [
    { title: "Võ Lâm Chí Tôn", colorClass: "htz-title-gold", desc: "Đệ nhất chí tôn giang hồ, vạn người quy phục" },
    { title: "Độc Cô Cầu Bại", colorClass: "htz-title-red", desc: "Cả đời tìm một người đánh bại mình mà không thể" },
    { title: "Đại Nguyên Soái Tống Kim", colorClass: "htz-title-gold", desc: "Thống soái ba quân, lập công đầu nơi trận địa" },
    { title: "Đệ Nhất Sát Thủ", colorClass: "htz-title-purple", desc: "Ám dạ vô ảnh, kiếm trảm ác tặc lưu danh muôn thuở" },
    { title: "Thiên Hạ Đệ Nhất Phú Hộ", colorClass: "htz-title-gold", desc: "Vàng bạc chất đầy non bộ, phú khả địch quốc" },
    { title: "Bát Mạch Quy Nguyên", colorClass: "htz-title-cyan", desc: "Kinh mạch đại thành, chân khí ngũ sắc tỏa sáng quanh thân" },
    { title: "Bách Chiến Bách Thắng", colorClass: "htz-title-red", desc: "Vào sinh ra tử, chưa từng nếm mùi chiến bại" }
  ];

  const HtzPlayerTitleSystem = {
    titleEl: null,

    init: function() {
      // Đã tắt thanh danh hiệu động trên sàn đấu theo yêu cầu người dùng (tránh che tầm nhìn)
      const old = document.getElementById("htzOverheadTitle");
      if (old) old.remove();
      this.titleEl = null;
    },

    injectTitleElement: function() {
      // Đã tắt thanh danh hiệu động trên sàn đấu
      const old = document.getElementById("htzOverheadTitle");
      if (old) old.remove();
      this.titleEl = null;
    },

    updateTitle: function() {
      // Đã tắt hiển thị danh hiệu trên đầu nhân vật sàn đấu
      const old = document.getElementById("htzOverheadTitle");
      if (old) old.remove();
      this.titleEl = null;
    },

    checkTitleUnlocked: function(tObj) {
      const JX = getJX();
      const l = JX ? JX.S : null;
      const lvl = l ? (l.lvl || 1) : 1;
      const gold = l ? (l.gold || 0) : 0;
      const m = HtzState.meridians || {};
      const allMerdianUpgraded = Object.values(m).length > 0 && Object.values(m).every(v => v >= 1);

      switch (tObj.title) {
        case "Võ Lâm Chí Tôn": return { unlocked: true };
        case "Độc Cô Cầu Bại": return { unlocked: lvl >= 100, req: "Cần đạt Cấp 100" };
        case "Đại Nguyên Soái Tống Kim": return { unlocked: (HtzState.songjin.rank >= 6), req: "Cần đạt hàm Đại Nguyên Soái" };
        case "Đệ Nhất Sát Thủ": return { unlocked: (HtzState.bountyKills >= 10), req: "Cần hạ 10 Ác Bá Sát Thủ" };
        case "Thiên Hạ Đệ Nhất Phú Hộ": return { unlocked: gold >= 10000000, req: "Cần sở hữu 10.000.000 Lượng" };
        case "Bát Mạch Quy Nguyên": return { unlocked: allMerdianUpgraded, req: "Cần đả thông cả 8 Kinh Mạch" };
        case "Bách Chiến Bách Thắng": return { unlocked: (HtzState.songjin.wins >= 10), req: "Cần 10 trận thắng Tống Kim" };
        default: return { unlocked: true };
      }
    },

    setTitle: function(tName) {
      const tObj = HTZ_TITLES.find(t => t.title === tName);
      if (tObj) {
        const check = this.checkTitleUnlocked(tObj);
        if (!check.unlocked) {
          const JX = getJX();
          if (JX && JX.toast) JX.toast(`🔒 Chưa mở khóa danh hiệu: ${check.req}`);
          return;
        }
      }
      HtzState.activeTitle = tName;
      saveState();
      this.updateTitle();

      const JX = getJX();
      if (JX && JX.toast) {
        JX.toast(`❖ Đã trang bị Danh Hiệu: ${tName}!`);
      }
      HtzFeaturesHub.renderTabContent("title");
    }
  };

  // ==========================================================================
  // TỔNG ĐÀN GIAO DIỆN CHÍNH (UNIFIED FEATURES HUB MODAL & WIDGETS)
  // ==========================================================================
  const HtzFeaturesHub = {
    currentTab: "songjin",
    modalEl: null,

    init: function() {
      this.injectTopButton();
      this.injectQuickWidgetBar();
      this.injectModal();
      console.log("[HtzFeaturesHub] Giao diện tổng đàn tính năng HTZ đã sẵn sàng.");
    },

    injectTopButton: function() {
      const top = document.getElementById("top");
      if (!top) return;

      if (document.getElementById("htzFeaturesTopBtn")) return;

      const btn = document.createElement("button");
      btn.id = "htzFeaturesTopBtn";
      btn.className = "htz-top-btn";
      btn.title = "Tổng Đàn Tính Năng Võ Lâm Truyền Kỳ 1 (HTZ Edition)";
      btn.innerHTML = `<span class="htz-btn-icon">❖</span><span>Tinh Hoa JX1</span>`;
      btn.onclick = () => this.openModal();

      // Đặt kế bên nút actBtn hoặc giftBtn
      const compactBtn = document.getElementById("compactBtn");
      if (compactBtn) {
        top.insertBefore(btn, compactBtn);
      } else {
        top.appendChild(btn);
      }
    },

    injectQuickWidgetBar: function() {
      const battle = document.getElementById("battle");
      if (!battle) return;

      if (document.getElementById("htzQuickWidgetBar")) return;

      const bar = document.createElement("div");
      bar.id = "htzQuickWidgetBar";
      bar.className = "htz-quick-widget-bar";

      bar.innerHTML = `
        <div class="htz-widget-pill" id="htzCompanionPill" title="Hệ Thống Đồng Hành Võ Lâm">
          <span class="pill-icon">🐾</span><span>Đồng Hành</span>
        </div>
        <div class="htz-widget-pill" id="htzSjPill" title="Đại Chiến Trường Tống Kim">
          <span class="pill-icon">🚩</span><span>Tống Kim</span>
        </div>
        <div class="htz-widget-pill" id="htzBountyPill" title="Bảng Mật Lệnh Sát Thủ">
          <span class="pill-icon">🎯</span><span>Sát Thủ</span>
        </div>
        <div class="htz-widget-pill" id="htzMeridianPill" title="Đả Thông Bát Đại Kinh Mạch">
          <span class="pill-icon">☸</span><span>Kinh Mạch</span>
        </div>
        <div class="htz-widget-pill" id="htzPetPill" title="Linh Thú Hộ Chủ">
          <span class="pill-icon">🐾</span><span>Linh Thú</span>
        </div>
      `;

      // Di chuyển ra NGOÀI #battle để không che bản đồ & Hành trang
      battle.insertAdjacentElement("afterend", bar);

      // Nếu htzPetBadge đã được tạo trước thì chuyển vào trong bar để cùng 1 hàng gọn gàng
      const existingBadge = document.getElementById("htzPetBadge");
      if (existingBadge && existingBadge.parentElement !== bar) {
        bar.appendChild(existingBadge);
      }

      const cPill = document.getElementById("htzCompanionPill"); if (cPill) cPill.onclick = () => this.openModal("pet");
      document.getElementById("htzSjPill").onclick = () => this.openModal("songjin");
      document.getElementById("htzBountyPill").onclick = () => this.openModal("bounty");
      document.getElementById("htzMeridianPill").onclick = () => this.openModal("meridian");
      document.getElementById("htzPetPill").onclick = () => this.openModal("pet");

      HtzWeatherSystem.updatePillText();
    },

    injectModal: function() {
      if (document.getElementById("htzFeaturesModal")) return;

      const modal = document.createElement("div");
      modal.id = "htzFeaturesModal";
      modal.className = "htz-modal-overlay hidden";

      modal.innerHTML = `
        <div class="htz-modal-box">
          <div class="htz-modal-header">
            <div class="htz-modal-title">
              <span>❖</span>
              <span>TỔNG ĐÀN TÍNH NĂNG VÕ LÂM TRUYỀN KỲ 1 (HTZ EDITION)</span>
            </div>
            <button class="htz-modal-close-btn" id="htzModalCloseBtn">✕</button>
          </div>
          <div class="htz-modal-nav">
            <button class="htz-nav-tab active" data-tab="songjin">🚩 Chiến Trường Tống Kim</button>
            <button class="htz-nav-tab" data-tab="bounty">🎯 Mật Lệnh Sát Thủ</button>
            <button class="htz-nav-tab" data-tab="meridian">☸ Bát Đại Kinh Mạch</button>
            <button class="htz-nav-tab" data-tab="pet">🐾 Đồng Hành & Linh Thú</button>
            <button class="htz-nav-tab" data-tab="ladder">🏆 Bảng Xếp Hạng</button>
            <button class="htz-nav-tab" data-tab="title">❖ Danh Hiệu Động</button>
            
          </div>
          <div class="htz-modal-body" id="htzModalBody"></div>
        </div>
      `;

      document.body.appendChild(modal);
      this.modalEl = modal;

      document.getElementById("htzModalCloseBtn").onclick = () => this.closeModal();

      modal.querySelectorAll(".htz-nav-tab").forEach(tab => {
        tab.onclick = () => {
          modal.querySelectorAll(".htz-nav-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          this.currentTab = tab.getAttribute("data-tab");
          this.renderTabContent(this.currentTab);
        };
      });

      // Nhấp ra ngoài để đóng
      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal();
      };
    },

    openModal: function(tabName) {
      if (!this.modalEl) return;
      this.modalEl.classList.remove("hidden");
      if (tabName) {
        this.currentTab = tabName;
        const targetBtn = this.modalEl.querySelector(`.htz-nav-tab[data-tab="${tabName}"]`);
        if (targetBtn) {
          this.modalEl.querySelectorAll(".htz-nav-tab").forEach(t => t.classList.remove("active"));
          targetBtn.classList.add("active");
        }
      }
      this.renderTabContent(this.currentTab);
    },

    closeModal: function() {
      if (this.modalEl) {
        this.modalEl.classList.add("hidden");
      }
    },

    renderTabContent: function(tab) {
      const body = document.getElementById("htzModalBody");
      if (!body) return;

      const JX = getJX();
      const l = JX ? JX.S : null;

      if (tab === "songjin") {
        const sj = HtzState.songjin;
        const rankNames = ["", "Binh Sĩ", "Bách Phu Trưởng", "Đô Thống", "Tiên Phong", "Thống Soái", "Đại Nguyên Soái Tống Kim"];

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">🚩 CHIẾN TRƯỜNG TỐNG KIM KINH ĐIỂN</span>
              <span style="color:#ffd700;font-size:11px;">Quân Hàm: <b>${rankNames[sj.rank] || "Binh Sĩ"}</b></span>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:12px;line-height:1.5;">
              Chiến trường rực lửa tái hiện cuộc đại chiến giữa <b>Đại Tống</b> và <b>Đại Kim</b>. Người chơi xung trận trảm binh tướng, cướp cờ soái, tích lũy điểm quân công nhận thưởng Rương Chiến Trường & Thăng cấp Quân hàm danh giá!
            </p>
            <div style="display:flex;gap:12px;margin-bottom:16px;">
              <div style="flex:1;background:rgba(255,107,107,0.1);border:1px solid #ff6b6b;border-radius:6px;padding:12px;text-align:center;">
                <h4 style="color:#ff6b6b;margin:0 0 8px 0;">🛡️ PHE ĐẠI TỐNG</h4>
                <p style="font-size:11px;color:#ced4da;margin-bottom:12px;">Trung quân ái quốc, bảo vệ bờ cõi giang sơn Đại Tống.</p>
                <button class="htz-meridian-btn" id="htzJoinSongBtn" style="background:#c92a2a;border-color:#ff8787;width:100%;">Xuất Quân Phe Tống</button>
              </div>
              <div style="flex:1;background:rgba(77,171,247,0.1);border:1px solid #4dabf7;border-radius:6px;padding:12px;text-align:center;">
                <h4 style="color:#4dabf7;margin:0 0 8px 0;">⚔️ PHE ĐẠI KIM</h4>
                <p style="font-size:11px;color:#ced4da;margin-bottom:12px;">Thiết kỵ phương Bắc dũng mãnh, khí thế ngút trời.</p>
                <button class="htz-meridian-btn" id="htzJoinKimBtn" style="background:#1864ab;border-color:#74c0fc;width:100%;">Xuất Quân Phe Kim</button>
              </div>
            </div>
            <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:6px;display:flex;justify-content:space-around;font-size:12px;">
              <span>Điểm Quân Công: <b style="color:#ffd700;">${sj.points}</b></span>
              <span>Thắng: <b style="color:#6fd46a;">${sj.wins}</b></span>
              <span>Bại: <b style="color:#ff6b6b;">${sj.losses}</b></span>
            </div>
          </div>
        `;

        document.getElementById("htzJoinSongBtn").onclick = () => HtzSongJinBattle.startBattle("song");
        document.getElementById("htzJoinKimBtn").onclick = () => HtzSongJinBattle.startBattle("kim");
      }

      else if (tab === "bounty") {
        const bp = HtzState.bountyPoints;
        const bk = HtzState.bountyKills;

        let listHtml = "";
        for (let target of BOUNTY_TARGETS) {
          const tierClass = target.tier === "low" ? "htz-tier-low" : target.tier === "mid" ? "htz-tier-mid" : "htz-tier-high";
          const tierName = target.tier === "low" ? "Sơ Cấp" : target.tier === "mid" ? "Trung Cấp" : "Cao Cấp";

          listHtml += `
            <div class="htz-bounty-card">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="htz-bounty-tier ${tierClass}">${tierName}</span>
                <span style="font-size:10px;color:#a49781;">${target.map}</span>
              </div>
              <div class="htz-bounty-name">${target.name}</div>
              <div style="font-size:11px;color:#ced4da;">Cấp ${target.level} · ${target.title}</div>
              <div class="htz-bounty-rewards">
                Thưởng: +${fmtNum(target.rewardGold)} Lượng<br>
                +${target.rewardKnb} KNB · +${target.points} Điểm ST
              </div>
              <button class="htz-bounty-hunt-btn" data-tid="${target.id}">🎯 Săn Lùng Ác Tặc</button>
            </div>
          `;
        }

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">🎯 BẢNG MẬT LỆNH SÁT THỦ NHIẾP THÍ TRẦN</span>
              <span style="color:#ffd700;font-size:11px;">Điểm Sát Thủ: <b>${bp}</b> · Đã diệt: <b>${bk} Ác Bá</b></span>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:10px;">
              Nhận Lệnh Truy Nã từ Nhiếp Thí Trần, trảm thủ các đầu mục thổ phỉ, ác nhân giang hồ để nhận Ngân Lượng, KNB, EXP khổng lồ và Điểm Sát Thủ đổi bảo vật!
            </p>
            <div class="htz-bounty-list">${listHtml}</div>
          </div>
        `;

        body.querySelectorAll(".htz-bounty-hunt-btn").forEach(btn => {
          btn.onclick = () => {
            const tid = btn.getAttribute("data-tid");
            HtzBountyKillerSystem.startHunt(tid);
          };
        });
      }

      else if (tab === "meridian") {
        const qi = HtzState.qi;
        let gridHtml = "";

        for (let m of MERIDIAN_INFO) {
          const lvl = HtzState.meridians[m.key] || 0;
          const reqQi = m.costQi * (lvl + 1);
          const reqGold = m.costGold * (lvl + 1);
          const isMax = lvl >= 10;

          gridHtml += `
            <div class="htz-meridian-item">
              <div class="htz-meridian-header">
                <span class="htz-meridian-name">${m.name}</span>
                <span class="htz-meridian-level">${lvl === 10 ? "Viên Mãn" : `Tầng ${lvl}/10`}</span>
              </div>
              <div class="htz-meridian-bar">
                <div class="htz-meridian-fill" style="width:${(lvl / 10) * 100}%;"></div>
              </div>
              <div style="font-size:11px;color:#ced4da;line-height:1.4;">${m.desc}</div>
              <div class="htz-meridian-effect">${m.stat}</div>
              <div class="htz-meridian-cost">
                <span>Cần: <b style="color:#6fd46a;">${isMax ? "Đã Tối Đa" : `${reqQi} Chân Khí + ${fmtNum(reqGold)} L`}</b></span>
                <button class="htz-meridian-btn" data-mkey="${m.key}" ${isMax ? "disabled" : ""}>
                  ${isMax ? "Viên Mãn" : "Đả Thông"}
                </button>
              </div>
            </div>
          `;
        }

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">☸ BÁT ĐẠI KINH MẠCH (CHU THIÊN VẬN HÀNH)</span>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                <span style="color:#6fd46a;font-size:12px;font-weight:bold;">Chân Khí: ${qi}</span>
                <button class="htz-meridian-btn" id="htzUpgradeAllBtn" style="background:linear-gradient(180deg,#c69532,#8a5e12);border-color:#ffd700;color:#fff;">⚡ Đả Thông Hết</button>
                <button class="htz-meridian-btn" id="htzMeditateBtn">🧘 Tụ Khí (+600)</button>
              </div>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:12px;">
              Đả thông 8 mạch võ học kinh điển giúp gia tăng vĩnh viễn sinh mệnh, nội lực, công kích và toàn bộ kháng tính. Chân khí tự động tích lũy khi tu luyện online hoặc cày cuốc!
            </p>
            <div class="htz-meridian-grid">${gridHtml}</div>
          </div>
        `;

        document.getElementById("htzMeditateBtn").onclick = () => HtzMeridianSystem.meditateForQi();
        const _upAllBtn = document.getElementById("htzUpgradeAllBtn");
        if (_upAllBtn) _upAllBtn.onclick = () => HtzMeridianSystem.upgradeAll();

        body.querySelectorAll(".htz-meridian-btn[data-mkey]").forEach(btn => {
          btn.onclick = () => {
            const key = btn.getAttribute("data-mkey");
            HtzMeridianSystem.upgradeMeridian(key);
          };
        });
      }

      else if (tab === "pet") {
        let petHtml = "";
        for (let p of COMPANION_DATABASE) {
          const isAct = p.id === HtzState.activePet;
          const lvl = HtzState.petLevels[p.id] || 1;
          const upgradeCost = Math.round((lvl * 150000 + 50000) * (1 + Math.floor(lvl/25) * 0.5));

          petHtml += `
            <div class="htz-pet-card ${isAct ? 'active' : ''}">
              <div class="htz-pet-icon-big">${p.icon}</div>
              <div class="htz-pet-card-name">${p.name} (Lv.${lvl})</div>
              <div style="font-size:10px;color:#ffd700;">Hệ: ${p.series} ${p.f ? '· Phái: ' + p.f.toUpperCase() : ''}</div>
              <div class="htz-pet-card-desc">${p.desc}</div>
              <div class="htz-pet-card-buff" style="color:#7fe36a;font-weight:bold;">${p.buffText}</div>
              <div style="font-size:9px;color:#ffcc00;margin:2px 0;">⚡ Tuyệt kỹ: ${p.skillName || "Chiến Kỹ"} · Tầm hút: ${(p.radius || 300) + lvl * 10}px</div>
              <div class="htz-pet-card-actions">
                <button class="htz-pet-act-btn ${isAct ? 'active-btn' : ''}" data-petact="${p.id}">
                  ${isAct ? "✔ Đang Ra Trận" : "Xuất Chiến"}
                </button>
                <button class="htz-pet-act-btn" data-petlvl="${p.id}" title="Chi phí: ${fmtNum(upgradeCost)} Lượng">
                  Bồi Dưỡng
                </button>
              </div>
            </div>
          `;
        }

        const activeCompanion = COMPANION_DATABASE.find(p => p.id === HtzState.activePet) || COMPANION_DATABASE[0];

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">🐾 HỆ THỐNG ĐỒNG HÀNH & LINH THÚ VÕ LÂM</span>
              <span style="color:#6fd46a;font-size:11px;">Đang xuất chiến: <b>${activeCompanion.name}</b></span>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:12px;line-height:1.5;">
              Đồng Hành và Linh Thú luôn sát cánh chiến đấu bên hiệp khách trên mọi chiến trường (Luyện công, Khiêu chiến Boss, Tống Kim, Lôi Đài). Đồng hành hỗ trợ xuất chiêu tiêu diệt kẻ địch, kích hoạt tuyệt kỹ môn phái, tự động hút nhặt ngân lượng và ban tặng thuộc tính vĩnh viễn!
            </p>
            <div class="htz-pet-grid">${petHtml}</div>
          </div>
        `;

        body.querySelectorAll(".htz-pet-act-btn[data-petact]").forEach(btn => {
          btn.onclick = () => {
            const pid = btn.getAttribute("data-petact");
            HtzPetSystem.setActivePet(pid);
          };
        });

        body.querySelectorAll(".htz-pet-act-btn[data-petlvl]").forEach(btn => {
          btn.onclick = () => {
            const pid = btn.getAttribute("data-petlvl");
            HtzPetSystem.levelUpPet(pid);
          };
        });
      }

      else if (tab === "ladder") {
        const pLevel = l ? l.lvl || 1 : 1;
        const pGold = l ? l.gold || 0 : 0;
        const pName = l ? l.name || "Đại Hiệp" : "Đại Hiệp";

        let rowsHtml = "";
        for (let m of HALL_OF_FAME_MASTERS) {
          const rankCls = m.rank === 1 ? "htz-rank-top1" : m.rank === 2 ? "htz-rank-top2" : m.rank === 3 ? "htz-rank-top3" : "";
          rowsHtml += `
            <tr>
              <td class="${rankCls}"><b>#${m.rank}</b></td>
              <td><b>${m.name}</b></td>
              <td>${m.sect}</td>
              <td style="color:#ffd700;">Lv.${m.level}</td>
              <td style="color:#6fd46a;">${fmtNum(m.power)}</td>
              <td style="color:#ff8787;">${fmtNum(m.gold)}</td>
              <td>${m.bounty}</td>
              <td>${m.songjin}</td>
            </tr>
          `;
        }

        // Hàng của người chơi
        rowsHtml += `
          <tr class="htz-is-self">
            <td style="color:#ffd700;"><b>#10</b></td>
            <td><b>${pName} (Bạn)</b></td>
            <td>Giang Hồ</td>
            <td style="color:#ffd700;">Lv.${pLevel}</td>
            <td style="color:#6fd46a;">${fmtNum(pLevel * 2500 + 15000)}</td>
            <td style="color:#ff8787;">${fmtNum(pGold)}</td>
            <td>${HtzState.bountyKills}</td>
            <td>${HtzState.songjin.points}</td>
          </tr>
        `;

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">🏆 BẢNG XẾP HẠNG THẬP ĐẠI CAO THỦ THẾ GIỚI</span>
              <button class="htz-meridian-btn" id="htzWorshipBtn">🙏 Bái Kiến Cao Thủ (Nhận Quà)</button>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:12px;">
              Vinh danh thập đại cao thủ huyền thoại giang hồ. Bái kiến tiền bối mỗi ngày để nhận quà tặng EXP, Ngân Lượng và Chân Khí!
            </p>
            <div style="overflow-x:auto;">
              <table class="htz-ladder-table">
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Nhân Vật</th>
                    <th>Môn Phái</th>
                    <th>Đẳng Cấp</th>
                    <th>Chiến Lực</th>
                    <th>Ngân Lượng</th>
                    <th>Sát Thủ</th>
                    <th>Tống Kim</th>
                  </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
              </table>
            </div>
          </div>
        `;

        document.getElementById("htzWorshipBtn").onclick = () => HtzHallOfFame.worshipMasters();
      }

      else if (tab === "title") {
        let titlesHtml = "";
        for (let t of HTZ_TITLES) {
          const isSel = t.title === HtzState.activeTitle;
          const check = HtzPlayerTitleSystem.checkTitleUnlocked(t);
          const btnText = isSel ? "Đang Đeo" : check.unlocked ? "Trang Bị" : "🔒 Chưa Mở";
          const btnStyle = !check.unlocked ? "opacity:0.6;filter:grayscale(0.6);" : "";

          titlesHtml += `
            <div style="background:rgba(18,22,28,0.85);border:1px solid ${isSel ? '#ffd700' : 'rgba(200,150,90,0.3)'};border-radius:6px;padding:12px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <div>
                <div class="htz-overhead-title ${t.colorClass}" style="position:static;transform:none;display:inline-block;margin-bottom:4px;">
                  ❖ ${t.title} ❖
                </div>
                <div style="font-size:11px;color:#adb5bd;">${t.desc}</div>
                ${!check.unlocked ? `<div style="font-size:10px;color:#ff8787;margin-top:3px;">🔒 ${check.req}</div>` : ''}
              </div>
              <button class="htz-pet-act-btn ${isSel ? 'active-btn' : ''}" data-titlename="${t.title}" ${!check.unlocked ? 'disabled' : ''} style="max-width:110px;${btnStyle}">
                ${btnText}
              </button>
            </div>
          `;
        }

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">❖ DANH HIỆU ĐỘNG BAY TRÊN ĐẦU NHÂN VẬT</span>
              <span style="color:#ffd700;font-size:11px;">Đang mang: <b>${HtzState.activeTitle}</b></span>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:12px;">
              Danh hiệu hiển thị lơ lửng rực rỡ trên đầu nhân vật ngay tại sân đấu, khẳng định uy thế và vị thế kiếm hiệp trong cõi giang hồ!
            </p>
            <div>${titlesHtml}</div>
          </div>
        `;

        body.querySelectorAll(".htz-pet-act-btn[data-titlename]").forEach(btn => {
          btn.onclick = () => {
            const tName = btn.getAttribute("data-titlename");
            HtzPlayerTitleSystem.setTitle(tName);
          };
        });
      }

      else if (tab === "weather") {
        const modes = [
          { key: "auto", name: "Tự Động (Theo giờ thực tế)", icon: "⛅", desc: "Ban ngày trong lành, hoàng hôn ráng đỏ, ban đêm ánh trăng bạc và đom đóm." },
          { key: "rain", name: "Mưa Giông & Sấm Chớp", icon: "🌧", desc: "Hạt mưa rơi rào rạt, sấm sét xé toạc màn trời, âm thanh sống động." },
          { key: "snow", name: "Tuyết Rơi Phong Hàn", icon: "❄", desc: "Bông tuyết trắng muốt bay lượn bồng bềnh như đỉnh Côn Lôn, Hoa Sơn tuyết phủ." },
          { key: "petals", name: "Hoa Đào & Lá Phong Rơi", icon: "🌸", desc: "Cánh hoa đào hồng phớt và lá phong đỏ rực rơi lãng đãng kiếm hiệp." },
          { key: "night", name: "Đêm Trăng Huyền Ảo", icon: "🌙", desc: "Màn đêm huyền bí, đom đóm dạ quang bay lượn tạo không gian tĩnh mịch." },
          { key: "clear", name: "Nắng Ráo Kiếm Hiệp", icon: "☀️", desc: "Trời quang mây tạnh, ánh nắng vàng chiếu rọi quang đãng." }
        ];

        let wHtml = "";
        for (let m of modes) {
          const isCur = HtzWeatherSystem.mode === m.key;
          wHtml += `
            <div style="background:rgba(18,22,28,0.85);border:1px solid ${isCur ? '#ffd700' : 'rgba(200,150,90,0.3)'};border-radius:6px;padding:12px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:24px;">${m.icon}</span>
                <div>
                  <div style="font-weight:bold;color:${isCur ? '#ffd700' : '#fff'};font-size:13px;">${m.name}</div>
                  <div style="font-size:11px;color:#adb5bd;">${m.desc}</div>
                </div>
              </div>
              <button class="htz-pet-act-btn ${isCur ? 'active-btn' : ''}" data-wmode="${m.key}" style="max-width:110px;">
                ${isCur ? "Đang Bật" : "Kích Hoạt"}
              </button>
            </div>
          `;
        }

        body.innerHTML = `
          <div class="htz-card">
            <div class="htz-card-header">
              <span class="htz-card-title">⛅ TÙY CHỈNH THỜI TIẾT & HIỆU ỨNG CHIẾU SÁNG</span>
              <span style="color:#ffd700;font-size:11px;">Hiện tại: <b>${HtzWeatherSystem.mode}</b></span>
            </div>
            <p style="font-size:12px;color:#adb5bd;margin-bottom:12px;">
              Hệ thống thời tiết động chuẩn JX1 (tham chiếu 3d0a6a8378.js) tái hiện không khí võ lâm chân thực. Bạn cũng có thể nhấp vào nút thời tiết ở góc trên sân đấu để chuyển đổi nhanh!
            </p>
            <div>${wHtml}</div>
          </div>
        `;

        body.querySelectorAll(".htz-pet-act-btn[data-wmode]").forEach(btn => {
          btn.onclick = () => {
            const wm = btn.getAttribute("data-wmode");
            HtzWeatherSystem.setMode(wm);
            this.renderTabContent("weather");
          };
        });
      }
    }
  };

  // ==========================================================================
  // HOOK VÀO TRẬN ĐÁNH & THEO DÕI BOSS SÁT THỦ
  // ==========================================================================
  function initCombatListener() {
    setInterval(() => {
      const JX = getJX();
      if (!JX || !JX.R) return;
      const h = JX.R;

      // Kiểm tra nếu có Boss Sát Thủ bị hạ gục
      if (HtzBountyKillerSystem.activeHunt) {
        const hunt = HtzBountyKillerSystem.activeHunt;
        const entity = hunt.entity;

        // Kiểm tra điều kiện hạ gục chuẩn xác
        const isDeadByFlag = entity.dead === true;
        const isDeadByHp   = typeof entity.hp === "number" && entity.hp <= 0;
        const isRemovedFromMap = Array.isArray(h.enemies) && !h.enemies.includes(entity);

        if (isDeadByFlag || isDeadByHp) {
          HtzBountyKillerSystem.onBountyKilled(hunt.target.id);
          HtzBountyKillerSystem.activeHunt = null;
        } else if (isRemovedFromMap) {
          // Bị mất dấu do rời map hoặc chuyển cảnh
          if (JX && JX.toast) {
            JX.toast("⚠️ Mật lệnh Sát Thủ bị hủy do mục tiêu đã rời khỏi tầm mắt!");
          }
          HtzBountyKillerSystem.activeHunt = null;
        }
      }
    }, 800);
  }

  // Khởi động toàn bộ các hệ thống
  function initAll() {
    try {
      // Tăng tỉ lệ rớt Mảnh Ghép Hoàn Kim trên mọi map (thêm 30% extra)
      window.__hkDropBoost = 0.30;

      HtzMeridianSystem.applyMeridianStats();
      HtzWeatherSystem.init();
      HtzFeaturesHub.init();
      HtzPetSystem.init();
      HtzPlayerTitleSystem.init();
      initCombatListener();

      // Dùng 1 interval duy nhất, tăng lên 5s, chỉ re-inject khi phần tử thực sự biến mất
      setInterval(() => {
        if (!document.getElementById("htzFeaturesTopBtn"))  HtzFeaturesHub.injectTopButton();
        if (!document.getElementById("htzQuickWidgetBar"))  HtzFeaturesHub.injectQuickWidgetBar();
        HtzPlayerTitleSystem.injectTitleElement();
        if (!document.getElementById("htzPetBadge"))        HtzPetSystem.injectBadge();
      }, 5000);

      // Gọi lại applyMeridianStats sau 3 giây để đảm bảo JX đã sẵn sàng
      setTimeout(() => {
        try { HtzMeridianSystem.applyMeridianStats(); } catch(e) {}
      }, 3000);
      // Re-apply mỗi 60 giây để đảm bảo buff luôn active
      setInterval(() => {
        try { HtzMeridianSystem.applyMeridianStats(); } catch(e) {}
      }, 60000);

      console.log("[HtzFeatures] Đã kích hoạt trọn vẹn toàn bộ tính năng tinh hoa JX1 thành công!");
    } catch (e) {
      console.error("[HtzFeatures] Lỗi khi khởi động:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Xuất ra window để tiện kiểm tra và gỡ lỗi
  window.HtzWeatherSystem = HtzWeatherSystem;
  window.HtzBountyKillerSystem = HtzBountyKillerSystem;
  window.HtzMeridianSystem = HtzMeridianSystem;
  window.HtzPetSystem = HtzPetSystem;
  window.HtzSongJinBattle = HtzSongJinBattle;
  window.HtzHallOfFame = HtzHallOfFame;
  window.HtzPlayerTitleSystem = HtzPlayerTitleSystem;
  window.HtzFeaturesHub = HtzFeaturesHub;

})();
