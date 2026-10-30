/**
 * ============================================================================
 * VÕ LÂM IDLE - HỆ THỐNG ĐẠI HỘI VÕ LÂM LIÊN ĐẤU 64 ĐẤU THỦ
 * ============================================================================
 * - Thể thức: 64 Đấu thủ (1 Người chơi + 63 Cao thủ AI Thập Đại Môn Phái)
 * - Đấu loại trực tiếp 6 vòng: Vòng 64 -> Vòng 32 -> Vòng 16 -> Tứ Kết -> Bán Kết -> Chung Kết
 * - Sơ đồ cây thi đấu (Tournament Bracket Tree) sắc nét, trực quan
 * - Đấu trực tiếp trên Lôi Đài hoặc mô phỏng nhanh dựa trên Ngũ Hành tương khắc
 * - Phần thưởng Quán Quân:
 *   + 50 Điểm Tiềm Năng Vĩnh Viễn
 *   + 1 Món Trang Bị Hoàng Kim Môn Phái hoàn chỉnh theo phái
 *   + 1 Vũ Khí Tím 6 Dòng Cực Phẩm (Max Opts)
 *   + 10.000 Kim Nguyên Bảo (KNB)
 *   + Danh hiệu Chí Tôn: ❖ Võ Lâm Minh Chủ ❖
 * ============================================================================
 */

(function() {
  "use strict";

  console.log("[TournamentSystem] Khởi chạy hệ thống Đại Hội Võ Lâm Liên Đấu 64 Người...");

  function getJX() {
    return window.__JX || null;
  }

  // Danh sách 63 Danh Chấn Giang Hồ thuộc Thập Đại Môn Phái
  const AI_MASTERS = [
    // Thiếu Lâm (Kim)
    { name: "Huyền Giác Thiền Sư", sect: "Thiếu Lâm", f: "shaolin", series: 0, title: "Đạt Ma Đường Thủ Tọa" },
    { name: "Vô Danh Thần Tăng", sect: "Thiếu Lâm", f: "shaolin", series: 0, title: "Tàng Kinh Các Ẩn Sĩ" },
    { name: "Huyền Từ Phương Trượng", sect: "Thiếu Lâm", f: "shaolin", series: 0, title: "Thiếu Lâm Phương Trượng" },
    { name: "Giác Viễn Đại Sư", sect: "Thiếu Lâm", f: "shaolin", series: 0, title: "Cửu Dương Chân Nhân" },
    { name: "Không Kiến Thần Tăng", sect: "Thiếu Lâm", f: "shaolin", series: 0, title: "Kim Cang Bất Hoại" },
    { name: "Thập Bát La Hán Trưởng", sect: "Thiếu Lâm", f: "shaolin", series: 0, title: "La Hán Trận Chủ" },

    // Thiên Vương (Kim)
    { name: "Dương Thần", sect: "Thiên Vương", f: "tianwang", series: 0, title: "Thiên Vương Bang Chủ" },
    { name: "Lôi Chấn Thiên", sect: "Thiên Vương", f: "tianwang", series: 0, title: "Cuồng Long Đoạt Mệnh" },
    { name: "Dương Thiết Tâm", sect: "Thiên Vương", f: "tianwang", series: 0, title: "Bá Vương Thương Gia" },
    { name: "Triệu Vân Phi", sect: "Thiên Vương", f: "tianwang", series: 0, title: "Thiên Vương Đệ Nhất Đao" },
    { name: "Hắc Báo Tướng Quân", sect: "Thiên Vương", f: "tianwang", series: 0, title: "Trảm Nhạc Tiên Phong" },
    { name: "Dương Khang", sect: "Thiên Vương", f: "tianwang", series: 0, title: "Thiên Vương Thiếu Chủ" },

    // Đường Môn (Mộc)
    { name: "Đường Bất Nhiễm", sect: "Đường Môn", f: "tangmen", series: 1, title: "Ám Khí Độc Tôn" },
    { name: "Đường Nhất Trần", sect: "Đường Môn", f: "tangmen", series: 1, title: "Đoạt Phách Phi Tiêu" },
    { name: "Đường Tiêu Vũ", sect: "Đường Môn", f: "tangmen", series: 1, title: "Mạn Thiên Hoa Vũ" },
    { name: "Đường Gia Lão Lão", sect: "Đường Môn", f: "tangmen", series: 1, title: "Đường Môn Thái Thượng" },
    { name: "Đường Huyết Ẩn", sect: "Đường Môn", f: "tangmen", series: 1, title: "Cửu U Truy Hồn" },
    { name: "Đường Phi Long", sect: "Đường Môn", f: "tangmen", series: 1, title: "Toái Cốt Xạ Thủ" },

    // Ngũ Độc (Mộc)
    { name: "Lam Hà Nhi", sect: "Ngũ Độc", f: "wudu", series: 1, title: "Ngũ Độc Giáo Chủ" },
    { name: "Bạch Doanh Doanh", sect: "Ngũ Độc", f: "wudu", series: 1, title: "Vạn Độc Thánh Nữ" },
    { name: "Ngô Chân", sect: "Ngũ Độc", f: "wudu", series: 1, title: "Xích Sa Ma Quân" },
    { name: "Độc Cô Nhất Đao", sect: "Ngũ Độc", f: "wudu", series: 1, title: "Huyết Cốt Đao Tôn" },
    { name: "U Hồn Quỷ Y", sect: "Ngũ Độc", f: "wudu", series: 1, title: "Độc Thiềm Lão Quái" },
    { name: "Hắc Huyết Độc Tôn", sect: "Ngũ Độc", f: "wudu", series: 1, title: "Hủ Cốt Nhiễm Hồn" },

    // Nga My (Thủy)
    { name: "Thanh Liên Tử", sect: "Nga My", f: "emei", series: 2, title: "Nga My Chưởng Môn" },
    { name: "Diệu Như Thần Ni", sect: "Nga My", f: "emei", series: 2, title: "Phổ Độ Từ Hàng" },
    { name: "Mộng Điệp Tiên Tử", sect: "Nga My", f: "emei", series: 2, title: "Phong Sương Toái ảnh" },
    { name: "Tuyệt Trần Sư Thái", sect: "Nga My", f: "emei", series: 2, title: "Băng Tâm Kiếm Ý" },
    { name: "Bích Ngọc Nữ Hiệp", sect: "Nga My", f: "emei", series: 2, title: "Cửu Âm Chân Truyền" },
    { name: "Ngọc Nữ Chưởng Viện", sect: "Nga My", f: "emei", series: 2, title: "Lạc Nhạn Trữ Tình" },

    // Thúy Yên (Thủy)
    { name: "Doãn Hàm Yên", sect: "Thúy Yên", f: "cuiyan", series: 2, title: "Thúy Yên Môn Chủ" },
    { name: "Thúy Liễu Tiên Nữ", sect: "Thúy Yên", f: "cuiyan", series: 2, title: "Băng Phách Đao Tôn" },
    { name: "Yên Như Mộng", sect: "Thúy Yên", f: "cuiyan", series: 2, title: "Lưu Thủy Đoán Kiếm" },
    { name: "Thúy Vi Tiên Tử", sect: "Thúy Yên", f: "cuiyan", series: 2, title: "Bách Hoa Loạn Vũ" },
    { name: "Tinh Nguyệt Nữ Hiệp", sect: "Thúy Yên", f: "cuiyan", series: 2, title: "Hàn Băng Thấu Cốt" },
    { name: "Hạ Tuyết Cơ", sect: "Thúy Yên", f: "cuiyan", series: 2, title: "Băng Đao Diệt Tuyệt" },

    // Cái Bang (Hỏa)
    { name: "Hà Nhân Ngã", sect: "Cái Bang", f: "gaibang", series: 3, title: "Cái Bang Bang Chủ" },
    { name: "Tiêu Phong", sect: "Cái Bang", f: "gaibang", series: 3, title: "Hàng Long Đệ Nhất" },
    { name: "Hồng Thất Công", sect: "Cái Bang", f: "gaibang", series: 3, title: "Cửu Chỉ Thần Cái" },
    { name: "Cừu Vạn Nhận", sect: "Cái Bang", f: "gaibang", series: 3, title: "Đả Cẩu Bổng Pháp Sư" },
    { name: "Kiều Dũng Mãnh", sect: "Cái Bang", f: "gaibang", series: 3, title: "Tiềm Long Tại Uyên" },
    { name: "Túy Cái Lão Nhi", sect: "Cái Bang", f: "gaibang", series: 3, title: "Túy Điệp Cuồng Tiêu" },

    // Thiên Nhẫn (Hỏa)
    { name: "Hoàn Nhan Hồng Liệt", sect: "Thiên Nhẫn", f: "tianren", series: 3, title: "Thiên Nhẫn Giáo Chủ" },
    { name: "Đoan Mộc Duệ", sect: "Thiên Nhẫn", f: "tianren", series: 3, title: "Ma Nhẫn Cực Đạo" },
    { name: "Da Luật Tỵ", sect: "Thiên Nhẫn", f: "tianren", series: 3, title: "Bá Vương Kích Long" },
    { name: "U Minh Lãnh Chúa", sect: "Thiên Nhẫn", f: "tianren", series: 3, title: "Nhiếp Hồn Loạn Tâm" },
    { name: "Ma Diễm Tôn Giả", sect: "Thiên Nhẫn", f: "tianren", series: 3, title: "Thiên Ngoại Lưu Tinh" },
    { name: "Huyết Ma Giáo Đầu", sect: "Thiên Nhẫn", f: "tianren", series: 3, title: "Liệt Hỏa Liêu Nguyên" },

    // Võ Đang (Thổ)
    { name: "Trương Tam Phong", sect: "Võ Đang", f: "wudang", series: 4, title: "Thái Cực Tông Sư" },
    { name: "Đạo Nhất Chân Nhân", sect: "Võ Đang", f: "wudang", series: 4, title: "Võ Đang Chưởng Môn" },
    { name: "Tống Viễn Kiều", sect: "Võ Đang", f: "wudang", series: 4, title: "Thất Hiệp Chi Thủ" },
    { name: "Du Liên Châu", sect: "Võ Đang", f: "wudang", series: 4, title: "Nhu Đao Tuyệt Diệt" },
    { name: "Ân Lê Đình", sect: "Võ Đang", f: "wudang", series: 4, title: "Thần Môn Thập Tam Kiếm" },
    { name: "Mạc Thanh Cốc", sect: "Võ Đang", f: "wudang", series: 4, title: "Huyền Vũ Kiếm Tiên" },

    // Côn Lôn (Thổ)
    { name: "Tuyền Cơ Tử", sect: "Côn Lôn", f: "kunlun", series: 4, title: "Côn Lôn Chưởng Môn" },
    { name: "Hà Tự Thánh", sect: "Côn Lôn", f: "kunlun", series: 4, title: "Côn Lôn Tam Thánh" },
    { name: "Lôi Chấn Tử", sect: "Côn Lôn", f: "kunlun", series: 4, title: "Lôi Động Cửu Thiên" },
    { name: "Bạch Hạc Đạo Nhân", sect: "Côn Lôn", f: "kunlun", series: 4, title: "Kiếm Khí Tung Hoành" },
    { name: "Côn Lôn Song Kiếm", sect: "Côn Lôn", f: "kunlun", series: 4, title: "Lưỡng Nghi Kiếm Trận" },
    { name: "Thanh Hư Đạo Trưởng", sect: "Côn Lôn", f: "kunlun", series: 4, title: "Thiên Tế Tấn Lôi" },

    // Hào Kiệt Độc Bá (Kim/Mộc/Thủy/Hỏa/Thổ)
    { name: "Độc Cô Cầu Bại", sect: "Thần Kiếm", f: "wudang", series: 4, title: "Kiếm Ma Độc Bộ" },
    { name: "Phong Thanh Dương", sect: "Hoa Sơn", f: "huashan", series: 1, title: "Độc Cô Cửu Kiếm" },
    { name: "Lệnh Hồ Xung", sect: "Hoa Sơn", f: "huashan", series: 1, title: "Tiếu Ngạo Giang Hồ" }
  ];

  // Trạng thái giải đấu
  const TournamentState = {
    season: 1,
    status: "ready", // ready, ongoing, completed
    currentRoundIdx: 0,
    rounds: [],
    competitors: [],
    playerEliminated: false,
    champion: null,
    history: []
  };

  const ROUND_NAMES = [
    { idx: 0, name: "Vòng 64", short: "Vòng 64", count: 32 },
    { idx: 1, name: "Vòng 32", short: "Vòng 32", count: 16 },
    { idx: 2, name: "Vòng 16", short: "Vòng 16", count: 8 },
    { idx: 3, name: "Vòng Tứ Kết", short: "Tứ Kết", count: 4 },
    { idx: 4, name: "Vòng Bán Kết", short: "Bán Kết", count: 2 },
    { idx: 5, name: "Chung Kết Đỉnh Phong", short: "Chung Kết", count: 1 }
  ];

  // Helper Ngũ Hành tương khắc
  function isCounter(s1, s2) {
    // 0: Kim khắc 1: Mộc
    // 1: Mộc khắc 4: Thổ
    // 4: Thổ khắc 2: Thủy
    // 2: Thủy khắc 3: Hỏa
    // 3: Hỏa khắc 0: Kim
    if (s1 === 0 && s2 === 1) return true;
    if (s1 === 1 && s2 === 4) return true;
    if (s1 === 4 && s2 === 2) return true;
    if (s1 === 2 && s2 === 3) return true;
    if (s1 === 3 && s2 === 0) return true;
    return false;
  }

  // Khởi tạo giải đấu 64 người
  function generateTournament() {
    const JX = getJX();
    const l = JX ? JX.S : null;
    const pLvl = l && l.lvl ? l.lvl : 80;
    const pName = l && l.name ? l.name : "Đại Hiệp";
    const pFac = l && l.fac ? l.fac : "wudang";

    // Người chơi (Slot 0)
    const playerComp = {
      id: "player",
      isPlayer: true,
      name: pName,
      sect: getSectName(pFac),
      f: pFac,
      series: getSeriesByFac(pFac),
      level: pLvl,
      title: "Đại Hiệp Giang Hồ",
      score: 0,
      avatar: getAvatarByFac(pFac)
    };

    // 63 AI đối thủ
    const shuffledAI = [...AI_MASTERS].sort(() => Math.random() - 0.5).slice(0, 63);
    const aiComps = shuffledAI.map((ai, idx) => {
      // Level scale hợp lý theo cấp người chơi
      const lvlOffset = Math.floor(Math.random() * 11) - 5; // -5 đến +5
      return {
        id: "ai_" + (idx + 1),
        isPlayer: false,
        name: ai.name,
        sect: ai.sect,
        f: ai.f,
        series: ai.series,
        level: Math.max(1, pLvl + lvlOffset),
        title: ai.title,
        score: 0,
        avatar: getAvatarByFac(ai.f)
      };
    });

    const all64 = [playerComp, ...aiComps];
    TournamentState.competitors = all64;
    TournamentState.playerEliminated = false;
    TournamentState.champion = null;
    TournamentState.status = "ongoing";
    TournamentState.currentRoundIdx = 0;

    // Sinh 6 vòng thi đấu
    TournamentState.rounds = [];

    // Vòng 1 (Vòng 64): 32 cặp đấu
    const r1Matches = [];
    for (let i = 0; i < 64; i += 2) {
      const p1 = all64[i];
      const p2 = all64[i + 1];
      r1Matches.push({
        id: "m_0_" + (i / 2),
        roundIdx: 0,
        p1: p1,
        p2: p2,
        winner: null,
        loser: null,
        score: [0, 0],
        completed: false,
        isPlayerMatch: p1.isPlayer || p2.isPlayer
      });
    }

    TournamentState.rounds.push({
      roundIdx: 0,
      name: "Vòng 64",
      matches: r1Matches
    });

    // Tạo sẵn khung các vòng sau (rỗng)
    for (let r = 1; r < 6; r++) {
      const matchCount = ROUND_NAMES[r].count;
      const rMatches = [];
      for (let m = 0; m < matchCount; m++) {
        rMatches.push({
          id: `m_${r}_${m}`,
          roundIdx: r,
          p1: null,
          p2: null,
          winner: null,
          loser: null,
          score: [0, 0],
          completed: false,
          isPlayerMatch: false
        });
      }
      TournamentState.rounds.push({
        roundIdx: r,
        name: ROUND_NAMES[r].name,
        matches: rMatches
      });
    }

    saveState();
  }

  function getSectName(fac) {
    const map = {
      shaolin: "Thiếu Lâm", tianwang: "Thiên Vương", tangmen: "Đường Môn",
      wudu: "Ngũ Độc", emei: "Nga My", cuiyan: "Thúy Yên",
      gaibang: "Cái Bang", tianren: "Thiên Nhẫn", wudang: "Võ Đang",
      kunlun: "Côn Lôn", huashan: "Hoa Sơn"
    };
    return map[fac] || "Võ Đang";
  }

  function getSeriesByFac(fac) {
    if (fac === "shaolin" || fac === "tianwang") return 0; // Kim
    if (fac === "tangmen" || fac === "wudu" || fac === "huashan") return 1; // Mộc
    if (fac === "emei" || fac === "cuiyan") return 2; // Thủy
    if (fac === "gaibang" || fac === "tianren") return 3; // Hỏa
    return 4; // Thổ (wudang, kunlun)
  }

  function getAvatarByFac(fac) {
    const valid = ["cuiyan", "emei", "gaibang", "kunlun", "shaolin", "tangmen", "tianren", "tianwang", "wudang", "wudu"];
    const f = (fac || "").toLowerCase();
    if (valid.indexOf(f) !== -1) return "img/pl/" + f + ".png";
    return "img/pl/wudang.png";
  }

  function saveState() {
    try {
      localStorage.setItem("jx_tournament_64_state", JSON.stringify(TournamentState));
    } catch (e) {
      console.warn("Lỗi lưu tournament state", e);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem("jx_tournament_64_state");
      if (raw) {
        const obj = JSON.parse(raw);
        Object.assign(TournamentState, obj);
      }
    } catch (e) {
      console.warn("Lỗi load tournament state", e);
    }
  }

  // Mô phỏng kết quả trận đấu giữa 2 AI
  function simulateAiMatch(c1, c2, roundIdx) {
    if (!c1 || !c2) return c1 || c2;

    let c1WinChance = 0.50;

    // 1. Ngũ hành tương khắc (Kim > Mộc > Thổ > Thủy > Hỏa > Kim)
    if (isCounter(c1.series, c2.series)) c1WinChance += 0.20;
    if (isCounter(c2.series, c1.series)) c1WinChance -= 0.20;

    // 2. Chênh lệch cấp độ
    const lvlDiff = (c1.level - c2.level) * 0.025;
    c1WinChance += Math.max(-0.25, Math.min(0.25, lvlDiff));

    // 3. Uy danh cao thủ võ lâm huyền thoại
    const legendaryMasters = ["Độc Cô Cầu Bại", "Tiêu Phong", "Trương Tam Phong", "Quách Tĩnh", "Dương Quá", "Lệnh Hồ Xung", "Hoàng Dược Sư", "Đoàn Dự"];
    if (legendaryMasters.includes(c1.name)) c1WinChance += 0.12;
    if (legendaryMasters.includes(c2.name)) c1WinChance -= 0.12;

    // 4. Môn phái đặc thù (khắc chế tầm xa / cận chiến)
    const rangedSects = ["tangmen", "wudang", "emei", "wudu"];
    const isC1Ranged = rangedSects.includes(c1.f);
    const isC2Ranged = rangedSects.includes(c2.f);
    if (isC1Ranged && !isC2Ranged) c1WinChance += 0.05;
    if (isC2Ranged && !isC1Ranged) c1WinChance -= 0.05;

    c1WinChance = Math.max(0.08, Math.min(0.92, c1WinChance));
    const roll = Math.random();
    return roll < c1WinChance ? c1 : c2;
  }

  // Giải quyết toàn bộ các trận AI trong vòng hiện tại
  function resolveAiMatchesInRound(roundIdx) {
    const curRound = TournamentState.rounds[roundIdx];
    if (!curRound) return;

    curRound.matches.forEach(m => {
      if (m.completed) return;
      if (m.isPlayerMatch) return; // Trận người chơi để người chơi đấu

      if (m.p1 && m.p2) {
        const winComp = simulateAiMatch(m.p1, m.p2, roundIdx);
        const loseComp = winComp === m.p1 ? m.p2 : m.p1;
        m.winner = winComp;
        m.loser = loseComp;
        m.score = winComp === m.p1 ? [2, Math.floor(Math.random() * 2)] : [Math.floor(Math.random() * 2), 2];
        m.completed = true;
      }
    });

    saveState();
  }

  // Chuyển những người chiến thắng lên vòng tiếp theo
  function advanceWinnersToNextRound(curRoundIdx) {
    if (curRoundIdx >= 5) {
      // Vòng Chung Kết hoàn thành -> Xác định Nhà Vô Địch
      const finalMatch = TournamentState.rounds[5].matches[0];
      if (finalMatch && finalMatch.winner) {
        TournamentState.champion = finalMatch.winner;
        TournamentState.status = "completed";
        saveState();
        if (finalMatch.winner.isPlayer) {
          awardChampionRewards();
        }
      }
      return;
    }

    const nextRound = TournamentState.rounds[curRoundIdx + 1];
    const curRound = TournamentState.rounds[curRoundIdx];
    if (!nextRound || !curRound) return;

    for (let i = 0; i < curRound.matches.length; i += 2) {
      const m1 = curRound.matches[i];
      const m2 = curRound.matches[i + 1];
      const nextMatchIdx = Math.floor(i / 2);
      const nextMatch = nextRound.matches[nextMatchIdx];

      if (nextMatch) {
        nextMatch.p1 = m1 ? m1.winner : null;
        nextMatch.p2 = m2 ? m2.winner : null;
        nextMatch.isPlayerMatch = (nextMatch.p1 && nextMatch.p1.isPlayer) || (nextMatch.p2 && nextMatch.p2.isPlayer);
      }
    }

    TournamentState.currentRoundIdx = curRoundIdx + 1;
    saveState();
  }

  // Trao thưởng Quán Quân Võ Lâm Liên Đấu
  function awardChampionRewards() {
    const JX = getJX();
    if (!JX || !JX.S) return;
    const l = JX.S;

    // 1. +50 Điểm Tiềm Năng Vĩnh Viễn
    l.attrPts = (l.attrPts || 0) + 50;

    // 2. 10.000 Kim Nguyên Bảo
    l.knbV = (l.knbV || 0) + 10000;

    // 3. 1 Món Hoàng Kim Môn Phái hoàn chỉnh
    let hkItem = null;
    if (window.HtzItemGenerator && typeof window.HtzItemGenerator.makeHkItem === "function") {
      hkItem = window.HtzItemGenerator.makeHkItem(l.fac, l.lvl);
      if (hkItem && l.inv.length < JX.invMax) {
        l.inv.push(hkItem);
      }
    }

    // 4. 1 Vũ Khí Tím 6 Dòng Cực Phẩm
    let godWeapon = null;
    if (window.HtzItemGenerator && typeof window.HtzItemGenerator.makeGodWeapon === "function") {
      godWeapon = window.HtzItemGenerator.makeGodWeapon(l.fac, l.lvl);
      if (godWeapon && l.inv.length < JX.invMax) {
        l.inv.push(godWeapon);
      }
    }

    // 4b. 1 Món Trang Bị Bạch Kim Chí Tôn Môn Phái
    let platItem = null;
    if (window.HtzItemGenerator && typeof window.HtzItemGenerator.makePlatinaItem === "function") {
      platItem = window.HtzItemGenerator.makePlatinaItem(l.fac, l.lvl);
      if (platItem && l.inv.length < JX.invMax) {
        l.inv.push(platItem);
      }
    }
    // Thưởng 10 Thủy Tinh Trắng & 5 Thần Bí Khoáng Thạch
    if (!l.mats) l.mats = { ht:{}, ore:{}, shard:{}, misc:{}, dp:{} };
    if (!l.mats.misc) l.mats.misc = {};
    l.mats.misc.ltt = (l.mats.misc.ltt || 0) + 10;
    l.mats.misc.lmt = (l.mats.misc.lmt || 0) + 10;
    l.mats.misc.ttt = (l.mats.misc.ttt || 0) + 10;
    l.mats.misc.mys = (l.mats.misc.mys || 0) + 10;
    l.mats.misc.bk120 = (l.mats.misc.bk120 || 0) + 5;
    l.mats.misc.bk150 = (l.mats.misc.bk150 || 0) + 5;

    // 5. Mở khóa Danh Hiệu Minh Chủ Võ Lâm
    if (window.HtzState) {
      window.HtzState.activeTitle = "Võ Lâm Chí Tôn";
    }

    // Gửi thư chúc mừng vinh danh
    if (window.OfflineMailSystem && typeof window.OfflineMailSystem.sendMail === "function") {
      window.OfflineMailSystem.sendMail({
        sender: "Minh Chủ Võ Lâm Minh",
        title: "🏆 Chúc Mừng Tân Vô Địch Võ Lâm Liên Đấu!",
        content: `Chúc mừng đại hiệp ${l.name || "Vô Danh"} đã xuất sắc vượt qua 63 đại cao thủ của Thập Đại Môn Phái, toàn thắng 6 vòng đấu lôi đài để đăng quang ngôi vị QUÁN QUÂN VÕ LÂM MINH CHỦ! Kính tặng đại hiệp +50 Tiềm Năng Vĩnh Viễn, 10.000 KNB và những trang bị chí tôn giang hồ!`,
        rewards: { knb: 5000, qi: 500 }
      });
    }

    if (JX.toast) JX.toast("🎉 ĐĂNG QUANG VÔ ĐỊCH VÕ LÂM LIÊN ĐẤU 64 NGƯỜI!");
    if (JX.banner) JX.banner("🏆 TÂN MINH CHỦ VÕ LÂM!", `${l.name} ĐĂNG QUANG QUÁN QUÂN LIÊN ĐẤU!`, 5);
    if (JX.log) {
      JX.log(`<b style="color:#ffd700">👑 [VÕ LÂM LIÊN ĐẤU]:</b> Đại hiệp <b>${l.name}</b> đã đả bại toàn bộ 63 cao thủ, trở thành <b style="color:#ff3333">TÂN MINH CHỦ VÕ LÂM</b>! Nhận thưởng: <b style="color:#50ff50">+50 Tiềm Năng Vĩnh Viễn</b>, 10.000 KNB, Trang bị Hoàng Kim [${hkItem ? hkItem.n : "HKMP"}] và Vũ Khí Tím 6 Dòng!`);
    }

    if (typeof JX.save === "function") JX.save();

    TournamentState.totalChampions = (TournamentState.totalChampions || 0) + 1;
    saveState();
    try { window.dispatchEvent(new CustomEvent("lienDauChampion")); } catch(e) {}

    showChampionVictoryModal(hkItem, godWeapon);
  }

  // Modal chúc mừng Vô Địch
  function showChampionVictoryModal(hkItem, godWep) {
    const existing = document.getElementById("ldChampionOverlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "ldChampionOverlay";
    overlay.className = "ld-champion-overlay";
    overlay.innerHTML = `
      <div class="ld-champion-card">
        <div class="ld-crown-glow">👑</div>
        <h2 class="ld-champion-title">TÂN VÔ ĐỊCH VÕ LÂM LIÊN ĐẤU</h2>
        <p class="ld-champion-sub">Vượt qua 64 cao thủ · Toàn thắng 6 vòng đấu loại trực tiếp</p>
        
        <div class="ld-rewards-box">
          <div class="ld-reward-row"><span class="ld-r-icon">⚡</span> <b>+50 Điểm Tiềm Năng Vĩnh Viễn</b> (Đã cộng trực tiếp)</div>
          <div class="ld-reward-row"><span class="ld-r-icon">🟡</span> <b>1 Trang Bị Hoàng Kim Môn Phái:</b> <span style="color:#ffd700">${hkItem ? hkItem.n : "Trang bị HKMP"}</span></div>
          <div class="ld-reward-row"><span class="ld-r-icon">🟣</span> <b>1 Vũ Khí Tím 6 Dòng Cực Phẩm:</b> <span style="color:#c084fc">${godWep ? godWep.n : "Vũ Khí Max Opt"}</span></div>
          <div class="ld-reward-row"><span class="ld-r-icon">🪙</span> <b>10.000 Kim Nguyên Bảo</b></div>
          <div class="ld-reward-row"><span class="ld-r-icon">📜</span> <b>Danh Hiệu:</b> ❖ Võ Lâm Minh Chủ ❖</div>
        </div>

        <button class="ld-btn-claim" id="ldBtnClaimChamp">Lĩnh Thưởng & Rạng Danh Thiên Hạ</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById("ldBtnClaimChamp").onclick = () => {
      overlay.remove();
      renderModalContent();
    };
  }

  // ==========================================================================
  // THI ĐẤU LÔI ĐÀI CHO TRẬN CỦA NGƯỜI CHƠI (LIVE & QUICK RESOLVE)
  // ==========================================================================
  function startPlayerMatch(match, isQuick) {
    const opponent = match.p1.isPlayer ? match.p2 : match.p1;
    if (!opponent) return;

    if (isQuick) {
      // Đấu nhanh: Tính toán trực tiếp
      const JX = getJX();
      const l = JX ? JX.S : null;
      let pWinRate = 0.65;
      if (isCounter(match.p1.isPlayer ? match.p1.series : match.p2.series, opponent.series)) {
        pWinRate += 0.15;
      }
      if (isCounter(opponent.series, match.p1.isPlayer ? match.p1.series : match.p2.series)) {
        pWinRate -= 0.15;
      }

      const roll = Math.random();
      const isPlayerWin = roll < pWinRate;

      if (isPlayerWin) {
        match.winner = match.p1.isPlayer ? match.p1 : match.p2;
        match.loser = opponent;
        match.score = [2, Math.floor(Math.random() * 2)];
        match.completed = true;

        if (JX && JX.toast) JX.toast(`⚔️ Đã đánh bại ${opponent.name} (2 - ${match.score[1]})!`);
        if (JX && JX.log) JX.log(`🏆 [LIÊN ĐẤU]: Đại hiệp đã hạ gục cao thủ <b>${opponent.name}</b> (${opponent.sect}) để tiến bước vào vòng trong!`);

        // Mô phỏng các trận AI còn lại và tiến vòng
        resolveAiMatchesInRound(TournamentState.currentRoundIdx);
        advanceWinnersToNextRound(TournamentState.currentRoundIdx);
      } else {
        match.winner = opponent;
        match.loser = match.p1.isPlayer ? match.p1 : match.p2;
        match.score = [Math.floor(Math.random() * 2), 2];
        match.completed = true;
        TournamentState.playerEliminated = true;

        if (JX && JX.toast) JX.toast(`⚔️ Đại hiệp đã dừng bước trước ${opponent.name}!`);
        if (JX && JX.log) JX.log(`❌ [LIÊN ĐẤU]: Đại hiệp đã để thua trước <b>${opponent.name}</b> (${opponent.sect}). Hẹn tái ngộ mùa giải sau!`);
        
        // Mô phỏng hết giải đấu — giải quyết tất cả các vòng còn lại
        resolveAiMatchesInRound(TournamentState.currentRoundIdx);
        advanceWinnersToNextRound(TournamentState.currentRoundIdx);
        // Loop tiếp tục cho đến khi xác định nhà vô địch AI
        var _sg1 = 0;
        while (TournamentState.status !== "completed" && _sg1++ < 6) {
          resolveAiMatchesInRound(TournamentState.currentRoundIdx);
          advanceWinnersToNextRound(TournamentState.currentRoundIdx);
        }
      }

      saveState();
      renderModalContent();
    } else {
      // Đấu Lôi Đài Trực Tiếp trên sân đấu
      closeModal();
      startLiveArenaDuel(opponent, match);
    }
  }

  // Đấu trực tiếp trên sàn đấu với boss AI
  function startLiveArenaDuel(opponent, match) {
    const JX = getJX();
    if (!JX || !JX.S || !JX.R || !JX.H) return;
    const l = JX.S;
    const h = JX.R;
    const T = JX.H;

    // Dọn dẹp quái bãi tạm thời
    h.enemies = [];

    const pLevel = Math.max(1, l.lvl || 1);
    const roundIdx = match.roundIdx;
    const roundScale = 1 + (roundIdx * 0.12); // Mỗi vòng khó hơn 12%

    const oppHp = Math.round((pLevel * 4500 + 40000) * roundScale);
    const oppMaxHp = oppHp;

    const spawnPos = typeof JX.walkable === "function" ? JX.walkable(T.x + 180, T.y) : [T.x + 180, T.y];

    // Tạo thực thể đối thủ trên sàn đấu
    const duelEntity = {
      id: Math.random(),
      tid: 855,
      isLienDauOpponent: true,
      customBoss: true,
      goldBoss: true,
      n: `[${opponent.sect}] ${opponent.name}`,
      title: opponent.title,
      L: opponent.level,
      cls: "boss",
      series: opponent.series,
      max: oppMaxHp,
      def: Math.round((pLevel * 30 + 350) * roundScale),
      res: { phys: 65, cold: 65, fire: 65, light: 65, poison: 65 },
      x: spawnPos[0],
      y: spawnPos[1],
      r: 32,
      spd: 65,
      atkCd: 1.1,
      cd: 1.3,
      reach: opponent.f === "tangmen" ? 220 : 95
    };

    // Sát thương an toàn: Cân bằng không bao giờ 1-hit chết người chơi!
    Object.defineProperty(duelEntity, "dmg", {
      get: function() {
        const curP = (h && h.P && h.P.life) ? h.P.life : 5000;
        // Mỗi đòn đối thủ liên đấu chỉ lấy đi khoảng 16% MaxHP của người chơi
        return Math.max(250, Math.round(curP * 0.16 * roundScale));
      },
      set: function() {},
      configurable: true,
      enumerable: true
    });

    // Máu của đối thủ có hộ thể và cap sát thương mỗi hit
    let currentOppHp = oppMaxHp;
    Object.defineProperty(duelEntity, "hp", {
      get: function() { return currentOppHp; },
      set: function(newVal) {
        if (newVal < currentOppHp) {
          const rawDmg = currentOppHp - newVal;
          const mitigatedDmg = Math.max(1, rawDmg * 0.45);
          const maxHitCap = Math.max(100, Math.round(oppMaxHp * 0.025));
          const actualDmg = Math.min(mitigatedDmg, maxHitCap);
          currentOppHp = Math.max(0, currentOppHp - actualDmg);
          if (currentOppHp <= 0) {
            duelEntity.dead = true;
            onPlayerWonLiveDuel(match, opponent);
          }
        } else {
          currentOppHp = Math.min(oppMaxHp, newVal);
        }
      },
      configurable: true,
      enumerable: true
    });

    h.enemies.push(duelEntity);

    if (JX.banner) {
      const _oppPwr = Math.round((opponent.level * 520) + (opponent.series * 15000));
      JX.banner("VÕ LÂM LIÊN ĐẤU", `${ROUND_NAMES[roundIdx].name} · [${opponent.sect}] ${opponent.name} · ${opponent.title || "Cao Thủ"} · Sức Mạnh ~${_oppPwr.toLocaleString()}`, 4);
    }
    if (JX.toast) {
      JX.toast(`⚔️ Bước vào Lôi Đài gặp [${opponent.sect}] ${opponent.name}!`);
    }

    // Giám sát sinh tử & Trí Tuệ Nhân Tạo (Smart Combat AI) của Bot
    let botPotions = 2;
    let lastBotSkill = Date.now();
    let lastBotPotion = 0;

    const monitorInterval = setInterval(() => {
      if (duelEntity.dead) {
        clearInterval(monitorInterval);
        return;
      }
      if (h.deadT || h.life <= 0) {
        clearInterval(monitorInterval);
        onPlayerLostLiveDuel(match, opponent);
        return;
      }

      // === SMART BOT COMBAT AI ===
      const now = Date.now();
      const dx = duelEntity.x - T.x;
      const dy = duelEntity.y - T.y;
      const dist = Math.hypot(dx, dy) || 1;

      // 1. Kiting & Di chuyển thông minh theo môn phái
      const isRanged = (opponent.f === "tangmen" || opponent.f === "wudang" || opponent.f === "emei" || opponent.f === "wudu");
      if (isRanged) {
        if (dist < 130) {
          // Bị áp sát -> Khinh công nhảy lùi tạo khoảng cách
          duelEntity.x += (dx / dist) * 26;
          duelEntity.y += (dy / dist) * 26;
        } else if (dist > 220) {
          // Tiến lại cự ly tấn công
          duelEntity.x -= (dx / dist) * 16;
          duelEntity.y -= (dy / dist) * 16;
        }
      } else {
        // Phái cận chiến: Thiếu Lâm, Cái Bang, Thiên Vương
        if (dist > 75) {
          duelEntity.x -= (dx / dist) * 22;
          duelEntity.y -= (dy / dist) * 22;
        }
      }

      // 2. Tuyệt Kỹ Môn Phái (mỗi 6s thi triển 1 chiêu thức đặc trưng)
      if (now - lastBotSkill > 6000) {
        lastBotSkill = now;
        const skills = {
          shaolin: { n: "La Hán Phục Ma Trận", c: "#ffd700", eff: "shield" },
          wudang:  { n: "Nhân Kiếm Hợp Nhất", c: "#5fb8ff", eff: "stun" },
          tangmen: { n: "Bạo Vũ Lê Hoa Châm", c: "#7fe36a", eff: "burst" },
          emei:    { n: "Phật Quang Phổ Chiếu", c: "#ff85a2", eff: "heal" },
          gaibang: { n: "Hàng Long Thập Bát Chưởng", c: "#ff6b3b", eff: "push" },
          wudu:    { n: "Vạn Độc Đoạt Mệnh", c: "#9b59b6", eff: "poison" },
          tianwang:{ n: "Huyết Chiến Bát Phương", c: "#e74c3c", eff: "speed" },
          cuiyan:  { n: "Băng Tâm Tiên Tử", c: "#00d2d3", eff: "slow" },
          tianren: { n: "Ma Diệm Thập Phương", c: "#e67e22", eff: "burn" },
          kunlun:  { n: "Cuồng Phong Điểm Toái", c: "#3498db", eff: "stun" }
        };
        const sk = skills[opponent.f] || { n: "Tuyệt Kỹ Giang Hồ", c: "#ffd700", eff: "burst" };

        if (typeof JX.hitNum === "function") {
          JX.hitNum(duelEntity.x, duelEntity.y - 48, `⚡ ${sk.n}!`, sk.c, 14, 1);
        }
        if (typeof JX.sound === "function") {
          JX.sound("snd/sound_a002_at.mp3", 1, 1);
        }

        // Hiệu ứng kỹ năng
        if (sk.eff === "heal") {
          const healAmt = Math.round(oppMaxHp * 0.15);
          currentOppHp = Math.min(oppMaxHp, currentOppHp + healAmt);
          if (JX.hitNum) JX.hitNum(duelEntity.x, duelEntity.y - 65, `+${healAmt.toLocaleString("vi-VN")} HP`, "#5fd35a", 13, 1);
        } else if (sk.eff === "stun") {
          if (JX.hitNum) JX.hitNum(T.x, T.y - 45, "⚠ Bị Choáng 1.5s!", "#ff4444", 13, 1);
        } else if (sk.eff === "push") {
          if (T) {
            T.x -= (dx / dist) * 35;
            T.y -= (dy / dist) * 35;
          }
        }
      }

      // 3. Cơ chế Hồi Máu / Dược Phẩm Cứu Sinh (khi máu dưới 35%)
      if (currentOppHp < oppMaxHp * 0.35 && botPotions > 0 && (now - lastBotPotion > 8000)) {
        lastBotPotion = now;
        botPotions--;
        const healVal = Math.round(oppMaxHp * 0.28);
        currentOppHp = Math.min(oppMaxHp, currentOppHp + healVal);
        if (typeof JX.hitNum === "function") {
          JX.hitNum(duelEntity.x, duelEntity.y - 45, `💊 +${healVal.toLocaleString("vi-VN")} Cửu Chuyển Đan`, "#5fd35a", 13, 1);
        }
        if (typeof JX.sound === "function") {
          JX.sound("snd/sound_a001_at.mp3", 1, 1);
        }
        if (typeof JX.log === "function") {
          JX.log(`<span style="color:#5fd35a">💊 Cao thủ <b>${opponent.name}</b> (${opponent.sect}) uống Cửu Chuyển Hoàn Hồn Đan hồi phục ${healVal.toLocaleString("vi-VN")} sinh lực!</span>`);
        }
      }
    }, 300);
  }

  function onPlayerWonLiveDuel(match, opponent) {
    const JX = getJX();
    const h = JX ? JX.R : null;
    if (h && Array.isArray(h.enemies)) {
      h.enemies = h.enemies.filter(e => e && !e.isLienDauOpponent);
    }

    match.winner = match.p1.isPlayer ? match.p1 : match.p2;
    match.loser = opponent;
    match.score = [2, 1];
    match.completed = true;

    const roundIdx = match.roundIdx || 0;

    if (JX && JX.toast) JX.toast(`🏆 CHIẾN THẮNG! Đã đánh bại ${opponent.name}!`);
    if (JX && JX.log) JX.log(`<b style="color:#ffd700">🏆 [LIÊN ĐẤU]:</b> Đại hiệp đã đánh bại <b>${opponent.name}</b> (${opponent.sect}) trên Lôi Đài!`);

    // Thưởng Milestone khi đạt vòng quan trọng
    var milestoneMsg = "";
    if (roundIdx === 3) {
      // Tứ Kết (Vòng 8 → Top 8)
      if (JX && JX.S) { JX.S.attrPts = (JX.S.attrPts || 0) + 5; JX.S.knbV = (JX.S.knbV || 0) + 500; }
      milestoneMsg = "🥈 Thưởng VÀO TỨ KẾT: +5 Tiềm Năng & +500 KNB!";
    } else if (roundIdx === 4) {
      // Bán Kết (Top 4)
      if (JX && JX.S) { JX.S.attrPts = (JX.S.attrPts || 0) + 10; JX.S.knbV = (JX.S.knbV || 0) + 1000; }
      if (window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") window.HtzItemGenerator.addHkShards(10);
      milestoneMsg = "🥇 Thưởng VÀO BÁN KẾT: +10 Tiềm Năng, +1000 KNB, +10 Mảnh Hoàng Kim!";
    } else if (roundIdx === 5) {
      // Chung Kết
      milestoneMsg = "🏆 VÀO CHUNG KẾT! Một bước đến ngôi vị Minh Chủ Võ Lâm!";
    }
    if (milestoneMsg && JX && JX.banner) JX.banner("LIÊN ĐẤU THĂNG TIẾN", milestoneMsg, 4);
    if (milestoneMsg && JX && JX.log) JX.log(`<b style="color:#ffd700">🎖 [Milestone]:</b> ${milestoneMsg}`);

    resolveAiMatchesInRound(TournamentState.currentRoundIdx);
    advanceWinnersToNextRound(TournamentState.currentRoundIdx);
    saveState();

    setTimeout(() => {
      openModal();
    }, 1500);
  }

  function onPlayerLostLiveDuel(match, opponent) {
    const JX = getJX();
    const h = JX ? JX.R : null;
    if (h && Array.isArray(h.enemies)) {
      h.enemies = h.enemies.filter(e => e && !e.isLienDauOpponent);
    }
    match.winner = opponent;
    match.loser = match.p1.isPlayer ? match.p1 : match.p2;
    match.score = [1, 2];
    match.completed = true;
    TournamentState.playerEliminated = true;

    if (JX && JX.toast) JX.toast(`⚔️ Đại hiệp đã dừng bước trước ${opponent.name}!`);
    if (JX && JX.log) JX.log(`<b style="color:#ff5555">❌ [LIÊN ĐẤU]:</b> Đại hiệp đã dừng bước tại ${ROUND_NAMES[match.roundIdx].name} trước <b>${opponent.name}</b>!`);

    // Thưởng an ủi tùy vào vòng đã đạt
    var consolePts = 0, consolationKnb = 0, consolationShards = 0;
    var roundReached = match.roundIdx || 0;
    if (roundReached <= 1) { consolationKnb = 200; }
    else if (roundReached <= 3) { consolationKnb = 500; consolationShards = 5; }
    else { consolationKnb = 1000; consolationShards = 10;
      if (window.HtzItemGenerator && typeof window.HtzItemGenerator.makeHkItem === "function" && JX && JX.S) {
        var cItem = window.HtzItemGenerator.makeHkItem(JX.S.fac, JX.S.lvl);
        if (cItem && JX.S.inv && JX.S.inv.length < (JX.invMax || 60)) JX.S.inv.push(cItem);
      }
    }
    if (JX && JX.S) {
      JX.S.knbV = (JX.S.knbV || 0) + consolationKnb;
    }
    if (consolationShards > 0 && window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
      window.HtzItemGenerator.addHkShards(consolationShards);
    }
    var consoleMsg = "💔 Phần thưởng an ủi: +" + consolationKnb + " KNB" + (consolationShards > 0 ? ", +" + consolationShards + " Mảnh HK" : "") + (roundReached >= 4 ? ", +1 Trang Bị HK!" : "!");
    if (JX && JX.log) JX.log("<b style=\"color:#ffaa55\">🎁 [An Ủi]:</b> " + consoleMsg);

    resolveAiMatchesInRound(TournamentState.currentRoundIdx);
    advanceWinnersToNextRound(TournamentState.currentRoundIdx);
    // Giải quyết tất cả vòng còn lại để xác định nhà vô địch AI
    var _sg3 = 0;
    while (TournamentState.status !== "completed" && _sg3++ < 6) {
      resolveAiMatchesInRound(TournamentState.currentRoundIdx);
      advanceWinnersToNextRound(TournamentState.currentRoundIdx);
    }
    if (TournamentState.champion) {
      var _champ = TournamentState.champion;
      var _jxlog = getJX();
      if (_jxlog && _jxlog.log) _jxlog.log('<b style="color:#ffd700">&#127942; [LI&Ecirc;N &#272;&Aacute;U]:</b> Nh&agrave; v&ocirc; &#273;&#7883;ch: <b>' + _champ.name + '</b> (' + _champ.sect + ')');
    }
    saveState();

    setTimeout(() => {
      openModal();
    }, 1500);
  }

  // ==========================================================================
  // GIAO DIỆN MODAL SƠ ĐỒ CÂY THI ĐẤU (TOURNAMENT BRACKET UI)
  // ==========================================================================
  let activeViewRound = 0;

  function openModal() {
    loadState();
    if (!TournamentState.rounds || !TournamentState.rounds.length || TournamentState.status === "ready") {
      generateTournament();
    }
    activeViewRound = TournamentState.currentRoundIdx;

    let overlay = document.getElementById("tournamentModalOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "tournamentModalOverlay";
      overlay.className = "ld-modal-overlay";
      document.body.appendChild(overlay);
    }

    renderModalContent();
    overlay.style.display = "flex";
  }

  function closeModal() {
    const overlay = document.getElementById("tournamentModalOverlay");
    if (overlay) overlay.style.display = "none";
  }

  function renderModalContent() {
    const overlay = document.getElementById("tournamentModalOverlay");
    if (!overlay) return;

    const roundData = TournamentState.rounds[activeViewRound] || TournamentState.rounds[0];
    const isCompleted = TournamentState.status === "completed";
    const champ = TournamentState.champion;

    overlay.innerHTML = `
      <div class="ld-modal-box">
        <div class="ld-modal-header">
          <div class="ld-header-left">
            <span class="ld-logo-badge">🏆</span>
            <div>
              <h2 class="ld-title">ĐẠI HỘI VÕ LÂM LIÊN ĐẤU 64 CAO THỦ</h2>
              <span class="ld-sub">Thể thức Đấu Loại Trực Tiếp 6 Vòng · Quán Quân Nhận +50 Tiềm Năng & Đồ Hoàng Kim</span>
            </div>
          </div>
          <button class="ld-btn-close" id="ldCloseModalBtn">✕</button>
        </div>

        <div class="ld-tabs-bar">
          ${ROUND_NAMES.map(r => `
            <button class="ld-tab-btn ${r.idx === activeViewRound ? "active" : ""} ${r.idx === TournamentState.currentRoundIdx ? "highlight" : ""}" data-ld-tab="${r.idx}">
              ${r.short}
              ${r.idx < TournamentState.currentRoundIdx ? " ✓" : ""}
            </button>
          `).join("")}
        </div>

        <div class="ld-status-banner">
          ${(function(){
            var ri = TournamentState.currentRoundIdx;
            var rn = ROUND_NAMES[ri] || {};
            var progPct = Math.round((ri / 5) * 100);
            var progBar = '<div style="width:100%;background:#1a1a2e;border-radius:4px;height:6px;margin:4px 0;"><div style="height:6px;background:linear-gradient(90deg,#ffd700,#ff6b35);border-radius:4px;width:' + progPct + '%;transition:width 0.5s;"></div></div>';
            var progLabel = '<div style="text-align:center;font-size:10px;color:#aaa;margin-bottom:4px;">Vòng ' + (ri+1) + '/6 — ' + (rn.name || "") + '</div>';
            if (champ) return '<div class="ld-banner-champ">👑 <b>Nhà Vô Địch Mùa ' + TournamentState.season + ':</b> <span class="ld-champ-name">' + champ.name + ' (' + champ.sect + ')</span></div>';
            if (TournamentState.playerEliminated) return '<div class="ld-banner-elim">⚔️ <b>Đại hiệp đã dừng bước!</b> Có thể theo dõi các cặp đấu còn lại hoặc bắt đầu mùa giải mới.' + progBar + '</div>';
            return '<div class="ld-banner-fight">🔥 <b>' + (rn.name || 'Liên Đấu') + '</b> — Hãy đánh bại đối thủ để tiến vào vòng sau!' + progLabel + progBar + '</div>';
          })()}
        </div>

        <div class="ld-matches-grid">
          ${roundData && roundData.matches ? roundData.matches.map((m, mIdx) => renderMatchCard(m, mIdx)).join("") : ""}
        </div>

        <div class="ld-modal-footer">
          <div class="ld-footer-info">
            <span class="ld-dot-kim">● Kim</span>
            <span class="ld-dot-moc">● Mộc</span>
            <span class="ld-dot-thuy">● Thủy</span>
            <span class="ld-dot-hoa">● Hỏa</span>
            <span class="ld-dot-tho">● Thổ</span>
          </div>
          <div class="ld-footer-actions">
            ${isCompleted ? `
              <button class="ld-btn-action reset" id="ldBtnResetSeason">Khởi Động Mùa Giải Mới (64 Người)</button>
            ` : `
              <button class="ld-btn-action auto" id="ldBtnSimAllAi">⚡ Mô Phỏng Hết Vòng AI</button>
            `}
          </div>
        </div>
      </div>
    `;

    // Gắn sự kiện tab
    overlay.querySelectorAll("[data-ld-tab]").forEach(btn => {
      btn.onclick = () => {
        activeViewRound = parseInt(btn.dataset.ldTab, 10);
        renderModalContent();
      };
    });

    // Nút đóng
    document.getElementById("ldCloseModalBtn").onclick = closeModal;

    // Nút mô phỏng hết vòng AI
    const btnSim = document.getElementById("ldBtnSimAllAi");
    if (btnSim) {
      btnSim.onclick = () => {
        var _sg2 = 0;
        while (TournamentState.status !== "completed" && _sg2++ < 8) {
          resolveAiMatchesInRound(TournamentState.currentRoundIdx);
          advanceWinnersToNextRound(TournamentState.currentRoundIdx);
        }
        saveState();
        renderModalContent();
      };
    }

    // Nút tạo mùa mới
    const btnReset = document.getElementById("ldBtnResetSeason");
    if (btnReset) {
      btnReset.onclick = () => {
        TournamentState.season++;
        generateTournament();
        renderModalContent();
      };
    }

    // Gắn sự kiện đánh cho trận của người chơi
    overlay.querySelectorAll("[data-action-duel]").forEach(btn => {
      btn.onclick = () => {
        const matchId = btn.dataset.actionDuel;
        const curRound = TournamentState.rounds[TournamentState.currentRoundIdx];
        const match = curRound ? curRound.matches.find(m => m.id === matchId) : null;
        if (match) startPlayerMatch(match, false);
      };
    });

    overlay.querySelectorAll("[data-action-quick]").forEach(btn => {
      btn.onclick = () => {
        const matchId = btn.dataset.actionQuick;
        const curRound = TournamentState.rounds[TournamentState.currentRoundIdx];
        const match = curRound ? curRound.matches.find(m => m.id === matchId) : null;
        if (match) startPlayerMatch(match, true);
      };
    });
  }

  function renderMatchCard(m, idx) {
    const isPlayerMatch = m.isPlayerMatch;
    const canFight = isPlayerMatch && !m.completed && m.roundIdx === TournamentState.currentRoundIdx && !TournamentState.playerEliminated;

    const p1 = m.p1;
    const p2 = m.p2;

    const seriesClasses = ["series-kim", "series-moc", "series-thuy", "series-hoa", "series-tho"];

    // Ước tính sức mạnh đối thủ
    function _estPwr(fighter) {
      if (!fighter) return 0;
      return Math.round((fighter.level * 520) + (fighter.series * 15000));
    }
    // Series label
    function _serLabel(s) { return ["Kim","Mộc","Thủy","Hỏa","Thổ"][s] || "?"; }

    return `
      <div class="ld-match-card ${isPlayerMatch ? "player-card" : ""} ${m.completed ? "completed" : ""}">
        <div class="ld-match-header">
          <span class="ld-match-num">Trận #${idx + 1}</span>
          ${isPlayerMatch ? `<span class="ld-player-badge">TRẬN CỦA BẠN</span>` : ""}
          ${m.completed ? `<span class="ld-status-tag done">Đã kết thúc</span>` : `<span class="ld-status-tag pending">Chờ đấu</span>`}
        </div>

        <div class="ld-fighter-row ${p1 && m.winner === p1 ? "winner" : p1 && m.loser === p1 ? "loser" : ""}">
          <div class="ld-fighter-info">
            <span class="ld-series-badge ${p1 ? seriesClasses[p1.series] : ""}">${p1 ? _serLabel(p1.series) : "?"}</span>
            <span class="ld-fighter-name ${p1 && p1.isPlayer ? "highlight-player" : ""}">${p1 ? p1.name : "Đang chờ..."}</span>
            ${p1 ? `<span class="ld-fighter-sect">(${p1.sect} · Cấp ${p1.level}${p1.title ? " · " + p1.title : ""})</span>` : ""}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;">
            ${(!m.completed && p1) ? `<span style="font-size:9px;color:#aaa;">~${_estPwr(p1).toLocaleString()}</span>` : ""}
            <span class="ld-fighter-score">${m.completed ? m.score[0] : "-"}</span>
          </div>
        </div>

        <div class="ld-match-vs">VS</div>

        <div class="ld-fighter-row ${p2 && m.winner === p2 ? "winner" : p2 && m.loser === p2 ? "loser" : ""}">
          <div class="ld-fighter-info">
            <span class="ld-series-badge ${p2 ? seriesClasses[p2.series] : ""}">${p2 ? _serLabel(p2.series) : "?"}</span>
            <span class="ld-fighter-name ${p2 && p2.isPlayer ? "highlight-player" : ""}">${p2 ? p2.name : "Đang chờ..."}</span>
            ${p2 ? `<span class="ld-fighter-sect">(${p2.sect} · Cấp ${p2.level}${p2.title ? " · " + p2.title : ""})</span>` : ""}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;">
            ${(!m.completed && p2) ? `<span style="font-size:9px;color:#aaa;">~${_estPwr(p2).toLocaleString()}</span>` : ""}
            <span class="ld-fighter-score">${m.completed ? m.score[1] : "-"}</span>
          </div>
        </div>

        ${canFight ? `
          <div style="padding:4px 6px;background:#0f1520;border-radius:4px;margin-top:4px;font-size:10px;color:#88bbff;">
            🔍 Đối thủ: <b>${p2 ? p2.title || "Cao Thủ" : ""}</b> · Phái <b>${p2 ? p2.sect : ""}</b> · Hệ <b>${p2 ? _serLabel(p2.series) : ""}</b> · SK ~${_estPwr(isPlayerMatch ? (p1.isPlayer ? p2 : p1) : p2).toLocaleString()}
          </div>
          <div class="ld-match-actions">
            <button class="ld-btn-duel" data-action-duel="${m.id}">⚔️ Lên Lôi Đài</button>
            <button class="ld-btn-quick" data-action-quick="${m.id}">⚡ Đấu Nhanh</button>
          </div>
        ` : ""}
      </div>
    `;
  }

  // Khởi tạo
  loadState();

  window.TournamentSystem = {
    init: function() {
      loadState();
      console.log("[TournamentSystem] Khởi tạo hoàn tất. Mùa giải hiện tại:", TournamentState.season);
    },
    openModal: openModal,
    closeModal: closeModal,
    getState: function() { return TournamentState; }
  };

})();

