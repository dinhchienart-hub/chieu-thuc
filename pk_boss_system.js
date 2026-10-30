(function() {
  "use strict";

  // ========================================================
  // VÕ LÂM IDLE - HỆ THỐNG GỌI BOSS, LÔI ĐÀI PK & ĐỒNG ĐỘI
  // ========================================================

  console.log("[PkBossSystem] Khởi chạy hệ thống Gọi Boss, Lôi Đài PK & Đồng Đội...");

  // Bộ tạo vật phẩm Hoàng Kim Môn Phái & Vũ Khí Tím 6 Dòng chuẩn Võ Lâm 1
  window.HtzItemGenerator = {
    makePlatinaItem: function(facKey, playerLevel, playerUid) {
      const JX = window.JX;
      if (!JX || !JX.sets || !JX.sets.platina) return null;

      const facMap = {
        shaolin: 0, tianwang: 1, tangmen: 2, wudu: 3,
        emei: 4, cuiyan: 5, gaibang: 6, tianren: 7,
        wudang: 8, kunlun: 9, huashan: 10
      };
      const cleanFac = (function(fk){var vm={"vo0":"wudang","vo1":"wudang","vo2":"kunlun","vo3":"tangmen","vo4":"emei"};return vm[fk]||fk;})(facKey||"wudang");
      const facId = facMap[cleanFac] != null ? facMap[cleanFac] : 8;

      let matched = JX.sets.platina.filter(i =>
        (i.req || []).some(r => r[0] === 39 && r[1] === facId) &&
        !/[\u4e00-\u9fa5]/.test(i.n)
      );
      if (!matched.length) {
        matched = JX.sets.platina.filter(i => !/[\u4e00-\u9fa5]/.test(i.n));
      }
      const picked = matched[Math.floor(Math.random() * matched.length)] || matched[0];
      if (!picked) return null;

      const ge = JX.ge || {};
      const rollMag = (mId) => {
        const t = ge[mId];
        if (!t) return null;
        return {
          a: t.a,
          p: t.p.map(([e, a]) => (e === -1 && a === -1 ? -1 : Math.min(e, a) + Math.floor(Math.random() * (Math.abs(a - e) + 1)))),
          pre: 1
        };
      };

      return {
        uid: playerUid || (Date.now() + Math.floor(Math.random() * 10000)),
        d: picked.d,
        k: picked.k,
        n: picked.n,
        ic: picked.ic || "",
        lvl: picked.lvl || 10,
        s: picked.s || 0,
        price: 100000,
        base: (picked.base || []).map(c => c.slice()),
        req: (picked.req || []).map(c => c.slice()),
        r: 5, // Bạch Kim (Platina)
        plv: 0,
        set: {
          kind: "platina",
          grp: picked.grp || 1,
          n1: 5,
          n2: 5,
          sid: picked.sid || 1
        },
        mag: (picked.mag || []).map(rollMag).filter(Boolean),
        ext: (picked.ext || []).map(rollMag).filter(Boolean)
      };
    },

    makeHkItem: function(facKey, playerLevel, playerUid) {
      const JX = window.JX;
      if (!JX || !JX.sets || !JX.sets.gold) return null;

      const facMap = {
        shaolin: 0, tianwang: 1, tangmen: 2, wudu: 3,
        emei: 4, cuiyan: 5, gaibang: 6, tianren: 7,
        wudang: 8, kunlun: 9, huashan: 10
      };
      const cleanFac = (function(fk){var vm={"vo0":"wudang","vo1":"wudang","vo2":"kunlun","vo3":"tangmen","vo4":"emei"};return vm[fk]||fk;})(facKey||"wudang");
      const facId = facMap[cleanFac] != null ? facMap[cleanFac] : 8;

      let matched = JX.sets.gold.filter(i =>
        (i.req || []).some(r => r[0] === 39 && r[1] === facId) &&
        !/[\u4e00-\u9fa5]/.test(i.n)
      );
      if (!matched.length) {
        matched = JX.sets.gold.filter(i => !/[\u4e00-\u9fa5]/.test(i.n));
      }
      const picked = matched[Math.floor(Math.random() * matched.length)] || matched[0];
      if (!picked) return null;

      const ge = JX.ge || {};
      const rollMag = (mId) => {
        const t = ge[mId];
        if (!t) return null;
        return {
          a: t.a,
          p: t.p.map(([e, a]) => (e === -1 && a === -1 ? -1 : Math.min(e, a) + Math.floor(Math.random() * (Math.abs(a - e) + 1)))),
          pre: 1
        };
      };

      return {
        uid: playerUid || (Date.now() + Math.floor(Math.random() * 10000)),
        d: picked.d,
        k: picked.k,
        n: picked.n,
        ic: picked.ic || "",
        lvl: picked.lvl || 10,
        s: picked.s || 0,
        price: picked.price || 50000,
        base: (picked.base || []).map(c => c.slice()),
        req: (picked.req || []).map(c => c.slice()),
        r: 4,
        set: {
          kind: "gold",
          grp: picked.grp || 1,
          n1: 5,
          n2: 5,
          sid: picked.sid || 1
        },
        mag: (picked.mag || []).map(rollMag).filter(Boolean),
        ext: (picked.ext || []).map(rollMag).filter(Boolean)
      };
    },

    makeGodWeapon: function(facKey, playerLevel, playerUid) {
      const facWeapons = {
        shaolin:  [ { k: 0, name: "Huyền Thiết Trượng" }, { k: 1, name: "Kim Cang Đao" } ],
        tianwang: [ { k: 3, name: "Bá Vương Thương" }, { k: 4, name: "Phá Thiên Chùy" } ],
        tangmen:  [ { k: 5, name: "Toái Cốt Phi Đao" }, { k: 6, name: "Khổng Tước Phi Tiêu" } ],
        wudu:     [ { k: 1, name: "U Hồn Huyết Đao" }, { k: 0, name: "Độc Long Côn" } ],
        emei:     [ { k: 2, name: "Thanh Phong Kiếm" } ],
        cuiyan:   [ { k: 1, name: "Băng Phách Đao" } ],
        gaibang:  [ { k: 0, name: "Đả Cẩu Bổng" } ],
        tianren:  [ { k: 3, name: "Hỏa Vân Thương" }, { k: 1, name: "Ma Diễm Đao" } ],
        wudang:   [ { k: 2, name: "Thái Cực Kiếm" } ],
        kunlun:   [ { k: 1, name: "Côn Lôn Huyền Đao" }, { k: 2, name: "Lôi Đình Kiếm" } ],
        huashan:  [ { k: 2, name: "Dưỡng Ngô Kiếm" } ]
      };
      const cleanFac = (facKey || "wudang").replace(/^vo[0-4]$/, "wudang");
      const list = facWeapons[cleanFac] || [{ k: 2, name: "Hiên Viên Cổ Kiếm" }];
      const choice = list[Math.floor(Math.random() * list.length)];

      const godMag = [
        { a: 111, p: [30, 30], pre: 1 }, // Tốc độ đánh / xuất chiêu +30%
        { a: 68,  p: [120, 150], pre: 1 }, // Sát thương vật lý +120-150%
        { a: 69,  p: [8, 12], pre: 1 }, // Hút sinh lực 8-12%
        { a: 70,  p: [8, 12], pre: 1 }, // Hút nội lực 8-12%
        { a: 72,  p: [25, 30], pre: 1 }, // Đòn chí mạng 25-30%
        { a: 135, p: [2, 3], pre: 1 } // Kỹ năng tất cả môn phái +2-3
      ];

      return {
        uid: playerUid || (Date.now() + Math.floor(Math.random() * 10000)),
        d: 0,
        k: choice.k,
        n: "[Cực Phẩm] " + choice.name,
        ic: "img/i/wp" + choice.k + ".png",
        lvl: 10,
        s: 0,
        price: 35000,
        base: [ [ 28, 18, 18 ], [ 29, 140, 150 ], [ 43, 0, 0 ] ],
        req: [ [ 36, 90 ], [ 32, 120 ] ],
        r: 3, // Tím
        vio: 1,
        vslots: 6,
        mag: godMag,
        ext: []
      };
    },

    addHkShards: function(count) {
      const JX = window.__JX;
      if (!JX || !JX.S) return;
      const l = JX.S;
      l.mats = l.mats || {};
      l.mats.shard = l.mats.shard || {};
      
      const facKey = l.fac || "wudang";
      const facIdMap = {
        shaolin: 0, tianwang: 1, tangmen: 2, wudu: 3,
        emei: 4, cuiyan: 5, gaibang: 6, tianren: 7,
        wudang: 8, kunlun: 9,
        vo0: 0, vo1: 2, vo2: 4, vo3: 6, vo4: 8
      };
      const facId = facIdMap[facKey] !== undefined ? facIdMap[facKey] : 8;
      const goldList = (window.JX && window.JX.sets && window.JX.sets.gold) ? window.JX.sets.gold : [];
      const factionItems = goldList.filter(item => {
        const req = (item.req || []).find(r => r[0] === 39);
        return req && req[1] === facId && item.n && !/[一-鿿]/.test(item.n);
      });

      let s1 = "Phục Ma Tử Kim Côn", s2 = "Tứ Không Giáng Ma Giới Đao";
      if (factionItems.length >= 2) {
        const it1 = factionItems[Math.floor(Math.random() * factionItems.length)];
        let it2 = factionItems[Math.floor(Math.random() * factionItems.length)];
        if (it2.n === it1.n && factionItems.length > 1) {
          it2 = factionItems[(factionItems.indexOf(it1) + 1) % factionItems.length];
        }
        s1 = it1.n;
        s2 = it2.n;
      }

      const perShard = Math.max(1, Math.floor(count / 2));
      l.mats.shard[s1] = (l.mats.shard[s1] || 0) + perShard;
      l.mats.shard[s2] = (l.mats.shard[s2] || 0) + (count - perShard);
    }
  };

  // Dữ liệu Boss Môn Phái & Thần Ma
  const BOSS_DATA = [
    {
      id: "huyengiac",
      tid: 467,
      name: "Huyền Giác Thiền Sư",
      sect: "Thiếu Lâm",
      series: 0, // Kim
      icon: "img/m/enemy044.png",
      baseHp: 38000000,
      baseDmg: 2800,
      def: 800,
      res: 75,
      desc: "Ngoại công La Hán Quyền, Côn pháp cái thế, kim thân bất hoại, phản chấn sát thương.",
      drops: "Bảo Đao Thiếu Lâm, Rương Tu Luyện, Huyền Tinh cấp 6"
    },
    {
      id: "duongthan",
      tid: 111,
      name: "Dương Thần",
      sect: "Thiên Vương",
      series: 0, // Kim
      icon: "img/m/enemy084.png",
      baseHp: 42000000,
      baseDmg: 3200,
      def: 850,
      res: 70,
      desc: "Thương pháp cuồng bạo, tốc độ xuất chiêu kinh hồn, dồn sát thương cực hạn.",
      drops: "Thương Thiên Vương, Chiến Ngoa HKMP, Bạc Lượng"
    },
    {
      id: "duongbatnhiem",
      tid: 110,
      name: "Đường Bất Nhiễm",
      sect: "Đường Môn",
      series: 1, // Mộc
      icon: "img/m/enemy083.png",
      baseHp: 35000000,
      baseDmg: 3500,
      def: 600,
      res: 65,
      desc: "Truy Tâm Tiễn, bão táp phi đao, độc sát kịch liệt, cự ly tác chiến cực xa.",
      drops: "Ám Khí Đường Môn, Ngân Châm Độc Sát, Bí Kíp Môn Phái"
    },
    {
      id: "lamha",
      tid: 543,
      name: "Lam Hà Giáo Chủ",
      sect: "Ngũ Độc",
      series: 1, // Mộc
      icon: "img/m/enemy085.png",
      baseHp: 36000000,
      baseDmg: 3000,
      def: 620,
      res: 70,
      desc: "Vạn Độc Quy Tông, độc chưởng thấu xương, hút sinh lực và nội lực đối phương.",
      drops: "U Lung Hộ Uyển, Độc Dược Thần Bí, KNB"
    },
    {
      id: "lamyy",
      tid: 412,
      name: "Lam Y Y",
      sect: "Nga My",
      series: 2, // Thủy
      icon: "img/m/enemy177.png",
      baseHp: 37000000,
      baseDmg: 2700,
      def: 750,
      res: 80,
      desc: "Băng Phong Tuyết Vũ, làm chậm sâu, kiếm khí thanh khiết, hồi phục sinh lực.",
      drops: "Vô Ma Kiếm HKMP, Băng Tinh Thạch, Rương Hoàng Kim"
    },
    {
      id: "bachoanhoanh",
      tid: 561,
      name: "Bạch Oanh Oanh",
      sect: "Thúy Yên",
      series: 2, // Thủy
      icon: "img/m/enemy121.png",
      baseHp: 36000000,
      baseDmg: 3100,
      def: 680,
      res: 75,
      desc: "Song đao hoa lệ, Tuyết Hoa Tuyệt Sát, thoắt ẩn thoắt hiện chém bất ngờ.",
      drops: "Bích Hải Song Đao, Phù Chú Thúy Yên, KNB"
    },
    {
      id: "hanhannga",
      tid: 141,
      name: "Hà Nhân Ngã",
      sect: "Cái Bang",
      series: 3, // Hỏa
      icon: "img/m/enemy122.png",
      baseHp: 45000000,
      baseDmg: 3400,
      def: 720,
      res: 75,
      desc: "Giáng Long Thập Bát Chưởng, rồng lửa cuộn trào, sát thương bạo kích diện rộng.",
      drops: "Đồng Cừu Cái Y, Đả Cẩu Bổng, Rương Tu Luyện"
    },
    {
      id: "yencuongdo",
      tid: 545,
      name: "Yên Cuồng Đồ",
      sect: "Thiên Nhẫn",
      series: 3, // Hỏa
      icon: "img/m/enemy078.png",
      baseHp: 48000000,
      baseDmg: 3600,
      def: 700,
      res: 70,
      desc: "Ma Diễm Phần Thiên, biển lửa thiêu rụi vạn vật, sát thương chí mạng cực lớn.",
      drops: "Ma Sát Thần Thương, Huyết Giáp, Huyền Tinh cấp 7"
    },
    {
      id: "cobach",
      tid: 559,
      name: "Cổ Bách",
      sect: "Võ Đang",
      series: 4, // Thổ
      icon: "img/m/enemy137.png",
      baseHp: 40000000,
      baseDmg: 3100,
      def: 820,
      res: 80,
      desc: "Thái Cực Kiếm Khí, choáng và đẩy lùi liên hoàn, công thủ toàn diện.",
      drops: "Chân Vũ Kiếm HKMP, Tam Thanh Phù, Võ Lâm Mật Tịch"
    },
    {
      id: "tuyencotu",
      tid: 560,
      name: "Tuyền Cơ Tử",
      sect: "Côn Lôn",
      series: 4, // Thổ
      icon: "img/m/enemy141.png",
      baseHp: 39000000,
      baseDmg: 3300,
      def: 760,
      res: 75,
      desc: "Cửu Thiên Cuồng Lôi, lôi điện giáng xuống như mưa, tê liệt thần kinh đối thủ.",
      drops: "Sương Tinh Hàn Thiết, Băng Tung Cẩm Uyển, KNB"
    },
    {
      id: "doccocubai",
      tid: 542,
      name: "Độc Cô Cầu Bại",
      sect: "Vô Môn Phái",
      series: 4, // Thổ
      icon: "img/m/enemy105.png",
      baseHp: 65000000,
      baseDmg: 5500,
      def: 1200,
      res: 85,
      desc: "Kiếm Ma Độc Cô Cầu Bại, một đời bất bại, kiếm ý áp đảo quần hùng thiên hạ.",
      drops: "Võ Lâm Chí Tôn Thạch, Rương HKMP Tự Chọn, 500 KNB, 50.000.000 Lượng"
    },
    {
      id: "hoakylan",
      tid: 145,
      name: "Hỏa Kỳ Lân Cổ Thú",
      sect: "Thần Thú",
      series: 3, // Hỏa
      icon: "img/m/enemy126.png",
      baseHp: 75000000,
      baseDmg: 4800,
      def: 1400,
      res: 85,
      desc: "Thần thú viễn cổ trấn giữ linh địa, toàn thân bốc hỏa, sinh lực dồi dào vô tận.",
      drops: "Kỳ Lân Chi Lân, Thần Thú Tinh Hoa, 100.000.000 Lượng, 1000 KNB"
    }
  ];

  // Danh sách Cao Thủ Lôi Đài 1v1
  const PK_MASTERS = [
    { name: "Trương Vô Kỵ", sect: "Võ Đang", series: 4, f: "wudang", s: 0, icon: "img/m/enemy137.png", title: "Thái Cực Tông Sư" },
    { name: "Kiều Phong", sect: "Cái Bang", series: 3, f: "gaibang", s: 0, icon: "img/m/enemy122.png", title: "Bắc Kiều Phong" },
    { name: "Chu Chỉ Nhược", sect: "Nga My", series: 2, f: "emei", s: 1, icon: "img/m/enemy177.png", title: "Cửu Âm Chưởng Môn" },
    { name: "Lệnh Hồ Xung", sect: "Hoa Sơn", series: 4, f: "kunlun", s: 0, icon: "img/m/enemy105.png", title: "Độc Cô Kiếm Khách" },
    { name: "Tiêu Viễn Sơn", sect: "Thiếu Lâm", series: 0, f: "shaolin", s: 0, icon: "img/m/enemy044.png", title: "Thiếu Lâm Thần Tăng" },
    { name: "Đường Thanh Dung", sect: "Đường Môn", series: 1, f: "tangmen", s: 1, icon: "img/m/enemy083.png", title: "Bạo Vũ Tiễn Thần" },
    { name: "Doãn Hàm Yên", sect: "Thúy Yên", series: 2, f: "cuiyan", s: 1, icon: "img/m/enemy121.png", title: "Băng Tâm Tiên Tử" },
    { name: "Lam Phượng Hoàng", sect: "Ngũ Độc", series: 1, f: "wudu", s: 1, icon: "img/m/enemy085.png", title: "Vạn Độc Thánh Nữ" },
    { name: "Dương Khang", sect: "Thiên Vương", series: 0, f: "tianwang", s: 0, icon: "img/m/enemy084.png", title: "Thiên Vương Thiếu Chủ" },
    { name: "Hoàn Nhan Hồng Liệt", sect: "Thiên Nhẫn", series: 3, f: "tianren", s: 0, icon: "img/m/enemy078.png", title: "Thiên Nhẫn Ma Quân" }
  ];

  // Danh sách Đồng Đội & Linh Thú Trợ Chiến Hợp Nhất (Unified Companions & Spirit Beasts)
  const COMPANIONS = [
    // --- 0. CAO THỦ HUYỀN THOẠI VÕ LÂM ---
    {
      id: "doccocubai",
      type: "hero",
      name: "Độc Cô Cầu Bại",
      sect: "Kiếm Ma",
      series: 0, // Kim
      seriesName: "Kim",
      f: "wudang",
      s: 0,
      avatar: "⚔️",
      role: "Vô Cực Sát Thương",
      skillName: "Vô Cực Kiếm Trận",
      desc: "Kiếm Ma tung hoành thiên hạ, tăng 40% Tấn Công và 15% Bạo Kích cho chủ nhân. Quét kiếm khí sát thương toàn màn hình.",
      hlAmt: 0,
      radius: 450
    },
    {
      id: "truongtamphong",
      type: "hero",
      name: "Trương Tam Phong",
      sect: "Võ Đang",
      series: 4, // Thổ
      seriesName: "Thổ",
      f: "wudang",
      s: 0,
      avatar: "☯️",
      role: "Hộ Thể & Hồi Phục",
      skillName: "Thái Cực Thần Công",
      desc: "Thái Cực Tông Sư Võ Đang, tăng 35% Sinh Lực và 30 Kháng Tất Cả. Thi triển Thái Cực Quyền hộ thuẫn vô địch và hồi 25% máu.",
      hlAmt: 120000,
      radius: 420
    },
    {
      id: "kieuphong",
      type: "hero",
      name: "Kiều Phong",
      sect: "Cái Bang",
      series: 3, // Hỏa
      seriesName: "Hỏa",
      f: "gaibang",
      s: 0,
      avatar: "🐉",
      role: "Khống Chế & Hút Máu",
      skillName: "Hàng Long Thập Bát Chưởng",
      desc: "Bắc Kiều Phong dũng mãnh vô song, tăng 30% Sát Thương và 12% Hút Sinh Lực. Đánh ra Hàng Long Chưởng choáng kẻ địch 2s.",
      hlAmt: 0,
      radius: 400
    },
    {
      id: "duongqua",
      type: "hero",
      name: "Dương Quá",
      sect: "Cổ Mộ",
      series: 2, // Thủy
      seriesName: "Thủy",
      f: "cuiyan",
      s: 0,
      avatar: "🦅",
      role: "Cuồng Nộ Tốc Đánh",
      skillName: "Ám Nhiên Tiêu Hồn Chưởng",
      desc: "Thần Điêu Đại Hiệp, tăng 25% Tấn Công và 30% Tốc Đánh. Tung Ám Nhiên Tiêu Hồn Chưởng bạo kích nổ lan.",
      hlAmt: 0,
      radius: 400
    },
    {
      id: "tieulongnu",
      type: "hero",
      name: "Tiểu Long Nữ",
      sect: "Cổ Mộ",
      series: 2, // Thủy
      seriesName: "Thủy",
      f: "emei",
      s: 1,
      avatar: "🧝‍♀️",
      role: "Né Tránh & Băng Phong",
      skillName: "Ngọc Nữ Tâm Kinh",
      desc: "Cổ Mộ Tiên Tử, tăng 25% Né Tránh và 30% Hồi Máu. Đóng băng kẻ địch trong 2.5 giây.",
      hlAmt: 90000,
      radius: 380
    },
    {
      id: "hoangdung",
      type: "hero",
      name: "Hoàng Dung",
      sect: "Cái Bang",
      series: 1, // Mộc
      seriesName: "Mộc",
      f: "gaibang",
      s: 1,
      avatar: "🎋",
      role: "May Mắn & Hút Đồ Siêu Tốc",
      skillName: "Đả Cẩu Trận",
      desc: "Nữ hiệp thông minh cơ trí, tăng 35 May Mắn, 25% Tốc Chạy và bán kính nhặt bảo vật cực xa.",
      hlAmt: 0,
      radius: 550
    },
    {
      id: "quachtinh",
      type: "hero",
      name: "Quách Tĩnh",
      sect: "Đại Hiệp",
      series: 0, // Kim
      seriesName: "Kim",
      f: "shaolin",
      s: 0,
      avatar: "🛡️",
      role: "Thành Trì Phòng Ngự",
      skillName: "Cửu Âm Chân Kinh",
      desc: "Bắc Hiệp vì nước vì dân, tăng 40% Phòng Thủ và 35 Kháng Ngoại. Giảm 50% sát thương gánh chịu.",
      hlAmt: 0,
      radius: 380
    },
    {
      id: "doandu",
      type: "hero",
      name: "Đoàn Dự",
      sect: "Đại Lý",
      series: 2, // Thủy
      seriesName: "Thủy",
      f: "wudang",
      s: 0,
      avatar: "⚡",
      role: "Kiếm Khí Tầm Xa",
      skillName: "Lục Mạch Thần Kiếm",
      desc: "Thế tử Đại Lý, tăng 20% Bạo Kích và 25% Tốc Đánh. Bắn 6 luồng kiếm khí tầm xa liên hoàn.",
      hlAmt: 0,
      radius: 460
    },

    // --- 1. HIỆP KHÁCH GIANG HỒ ---
    {
      id: "emei",
      type: "hero",
      name: "Bạch Ngọc Y",
      sect: "Nga My",
      series: 2, // Thủy
      seriesName: "Thủy",
      f: "emei",
      s: 1,
      avatar: "🌸",
      role: "Hồi Máu & Khống Chế",
      skillName: "Từ Hàng Phổ Độ & Băng Phong",
      desc: "Tự động hồi 30% sinh lực cho người chơi khi HP < 60%. Tung Băng Phong Cầu làm chậm quái địch.",
      hlAmt: 80000,
      radius: 300
    },
    {
      id: "shaolin",
      type: "hero",
      name: "Huyền Giác Đại Sư",
      sect: "Thiếu Lâm",
      series: 0, // Kim
      seriesName: "Kim",
      f: "shaolin",
      s: 0,
      avatar: "📿",
      role: "Đỡ Đòn & Phản Sát Thương",
      skillName: "Kim Cang Bất Hoại",
      desc: "Sinh lực và phòng thủ cực cao, thu hút quái vật và phản lại 35% sát thương cận chiến.",
      hlAmt: 0,
      radius: 270
    },
    {
      id: "gaibang",
      type: "hero",
      name: "Hỏa Long Ca",
      sect: "Cái Bang",
      series: 3, // Hỏa
      seriesName: "Hỏa",
      f: "gaibang",
      s: 0,
      avatar: "🐉",
      role: "Sát Thương Bạo Kích",
      skillName: "Phi Long Tại Thiên",
      desc: "Tung Phi Long Tại Thiên, sát thương bạo kích diện rộng, thiêu đốt đối thủ.",
      hlAmt: 0,
      radius: 280
    },
    {
      id: "wudang",
      type: "hero",
      name: "Thanh Phong Tử",
      sect: "Võ Đang",
      series: 4, // Thổ
      seriesName: "Thổ",
      f: "wudang",
      s: 0,
      avatar: "☯️",
      role: "Khống Chế & Tầm Xa",
      skillName: "Vô Lượng Kiếm",
      desc: "Bắn Vô Lượng Kiếm từ xa, xác suất gây choáng mục tiêu trong 1.5 giây.",
      hlAmt: 0,
      radius: 280
    },
    {
      id: "tangmen",
      type: "hero",
      name: "Ám Dạ Ảnh",
      sect: "Đường Môn",
      series: 1, // Mộc
      seriesName: "Mộc",
      f: "tangmen",
      s: 1,
      avatar: "🗡️",
      role: "Xạ Thủ Độc Sát",
      skillName: "Mãn Thiên Hoa Vũ",
      desc: "Phóng bão phi đao liên hoàn, gây ngộ độc rút máu theo thời gian liên tục.",
      hlAmt: 0,
      radius: 290
    },

    // --- 2. THẦN THÚ THƯỢNG CỔ & LINH THÚ ---
    {
      id: "kylan",
      type: "beast",
      name: "Hỏa Kỳ Lân Con",
      sect: "Thần Thú",
      series: 3, // Hỏa
      seriesName: "Hỏa",
      f: "tianren",
      s: 0,
      avatar: "🔥",
      role: "Chân Hỏa & Hút Đồ Siêu Xa",
      skillName: "Kỳ Lân Liệt Diễm",
      desc: "Thần thú giáng thế, phun Chân Hỏa thiêu rụi quái vật. Sở hữu lực từ trường hút đồ cực rộng.",
      hlAmt: 0,
      radius: 360
    },
    {
      id: "soi",
      type: "beast",
      name: "Tuyết Lang Vương",
      sect: "Linh Thú",
      series: 2, // Băng
      seriesName: "Băng",
      f: "cuiyan",
      s: 0,
      avatar: "🐺",
      role: "Lướt Gió & Làm Chậm",
      skillName: "Hàn Băng Thần Khí",
      desc: "Sói tuyết cắn xé làm chậm quái vật, tăng mạnh tốc độ di chuyển và kháng làm chậm cho chủ nhân.",
      hlAmt: 0,
      radius: 280
    },
    {
      id: "khuyen",
      type: "beast",
      name: "Hoàng Kim Thần Khuyển",
      sect: "Linh Thú",
      series: 0, // Kim
      seriesName: "Kim",
      f: "tianwang",
      s: 0,
      avatar: "🐕",
      role: "Chiêu Tài & Nhặt Bảo Vật",
      skillName: "Phúc Tinh Chiếu Mệnh",
      desc: "Thần khuyển vượng tài, tăng 40% Bạc rơi thêm và tăng may mắn nhặt đồ Cực Phẩm.",
      hlAmt: 0,
      radius: 320
    },
    {
      id: "hac",
      type: "beast",
      name: "Tiên Hạc Côn Lôn",
      sect: "Linh Thú",
      series: 4, // Thổ / Lôi
      seriesName: "Lôi",
      f: "kunlun",
      s: 0,
      avatar: "🕊️",
      role: "Hào Quang Hộ Mệnh",
      skillName: "Thần Hạc Hộ Thể",
      desc: "Linh điểu thần thánh hồi 3% HP/MP mỗi 5s và giảm 12% toàn bộ sát thương gánh chịu.",
      hlAmt: 0,
      radius: 270
    },
    {
      id: "gautruc",
      type: "beast",
      name: "Hùng Miêu Kungfu",
      sect: "Linh Thú",
      series: 4, // Thổ
      seriesName: "Thổ",
      f: "wudang",
      s: 0,
      avatar: "🐼",
      role: "Mình Đồng & Đỡ Đòn",
      desc: "Gấu trúc quyền pháp dũng mãnh, tăng 20% sinh lực tối đa và phản lại sát thương quái.",
      hlAmt: 0,
      radius: 270
    }
  ];

  // Danh Hiệu PK
  const PK_RANKS = [
    { wins: 0, title: "Vô Danh Tiểu Tốt", color: "#8da49a" },
    { wins: 5, title: "Giang Hồ Tân Tú", color: "#5fb8ff" },
    { wins: 15, title: "Võ Lâm Hào Kiệt", color: "#6fd46a" },
    { wins: 30, title: "Võ Lâm Tông Sư", color: "#ffd24a" },
    { wins: 60, title: "Bách Chiến Bách Thắng", color: "#ff8533" },
    { wins: 100, title: "Thiên Hạ Vô Song", color: "#ff4d4d" },
    { wins: 200, title: "Võ Lâm Chí Tôn · Độc Cô Cầu Bại", color: "#e056fd" }
  ];

  // Trạng thái hệ thống
  const State = {
    activeFight: null, // { type: 'boss'|'1v1'|'2v2', timer: 0, opp1: null, opp2: null, ally: null, maxHp1: 1, maxHp2: 1 }
    autoTimerEnabled: false,
    bossRushEnabled: false,
    nextAutoBossAt: 0,
    companionEnabled: false,
    selectedCompanion: "emei",
    stats: {
      pk1v1Wins: 0,
      pk1v1Losses: 0,
      pk1v1Streak: 0,
      pk1v1BestStreak: 0,
      pk2v2Wins: 0,
      pk2v2Losses: 0,
      bossesDefeated: 0
    }
  };

  // Tải trạng thái từ localStorage
  function loadPersistedState() {
    try {
      State.autoTimerEnabled = localStorage.getItem("pk_boss_auto_timer") === "1";
      State.bossRushEnabled = localStorage.getItem("pk_boss_rush_enabled") === "1";
      State.companionEnabled = localStorage.getItem("pk_companion_active") === "1";
      const comp = localStorage.getItem("pk_selected_companion");
      if (comp) State.selectedCompanion = comp;

      const rawStats = localStorage.getItem("pk_system_stats");
      if (rawStats) {
        Object.assign(State.stats, JSON.parse(rawStats));
      }
    } catch (e) {
      console.warn("[PkBoss] Lỗi đọc state:", e);
    }
  }

  function savePersistedState() {
    try {
      localStorage.setItem("pk_boss_auto_timer", State.autoTimerEnabled ? "1" : "0");
      localStorage.setItem("pk_boss_rush_enabled", State.bossRushEnabled ? "1" : "0");
      localStorage.setItem("pk_companion_active", State.companionEnabled ? "1" : "0");
      localStorage.setItem("pk_selected_companion", State.selectedCompanion);
      localStorage.setItem("pk_system_stats", JSON.stringify(State.stats));
    } catch (e) {
      console.warn("[PkBoss] Lỗi lưu state:", e);
    }
  }

  // Lấy danh hiệu theo số trận thắng
  function getTitle(wins) {
    let current = PK_RANKS[0];
    for (const r of PK_RANKS) {
      if (wins >= r.wins) current = r;
    }
    return current;
  }

  // Kiểm tra __JX
  function getJX() {
    return window.__JX || null;
  }

  // ==========================================
  // LOGIC ĐỒNG ĐỘI NGOẠI TUYẾN (COMPANIONS)
  // ==========================================
  let lastCompanionCheck = 0;

  function ensureCompanion() {
    const JX = getJX();
    if (!JX || !JX.S || !JX.R || !JX.H) return;
    const h = JX.R;
    const l = JX.S;
    const T = JX.H;

    // Nếu đang trong thành, khu an toàn hoặc trong phó bản đặc biệt, không can thiệp
    if (h.town || h.tower || h.dg || h.inSafe) {
      if (h.allies && h.allies.length) {
        h.allies = h.allies.filter(a => !a.isOfflineCompanion);
        window.__pkCurrentCompanion = null; // Xóa ref khi companion bị thu hồi
      }
      return;
    }

    // Nếu đang trong Chiến Trường Tống Kim — xóa companion và trả về sớm
    const songJinActive = window.HtzSongJinBattle && window.HtzSongJinBattle.active;
    if (songJinActive) {
      if (h.allies && h.allies.length) {
        h.allies = h.allies.filter(a => !a.isOfflineCompanion);
      }
      return;
    }

    // Nếu người chơi bật đồng đội
    if (State.companionEnabled && !State.activeFight) {
      h.allies = h.allies || [];
      const compInfo = COMPANIONS.find(c => c.id === State.selectedCompanion) || COMPANIONS[0];
      const existing = h.allies.find(a => a.isOfflineCompanion);

      // Nếu người chơi đã đổi sang Đồng Hành khác, xóa thực thể cũ để tạo thực thể mới ngay lập tức
      if (existing && existing._compId !== compInfo.id) {
        h.allies = h.allies.filter(a => a !== existing);
      }

      if (!h.allies.some(a => a.isOfflineCompanion)) {
        const lvl = Math.max(1, l.lvl || 1);
        const compLevels = (window.HtzState && window.HtzState.petLevels) || {};
        const compLvl = compLevels[compInfo.id] || 1;

        // Máu và sát thương cộng thêm theo cấp bồi dưỡng đồng hành
        const hpBase = Math.round((lvl * 1500 + 10000) * (1 + (compLvl - 1) * 0.05));
        const dpsBase = Math.round((lvl * 120 + 800) * (1 + (compLvl - 1) * 0.06));
        const prefix = compInfo.type === "beast" ? "Linh Thú · " : "Đồng Đội · ";
        const allyName = `${prefix}${compInfo.name} (Lv.${compLvl})`;

        const allyEntity = {
          isOfflineCompanion: true,
          _compId: compInfo.id,
          n: allyName,
          f: compInfo.f,
          s: compInfo.s,
          l: lvl,
          hpMax: hpBase,
          hp: hpBase,
          def: Math.round(lvl * 25 + 200),
          res: 75,
          dps: dpsBase,
          d1: Math.round(dpsBase / 2),
          mel: compInfo.f === "shaolin" || compInfo.f === "gaibang" || compInfo.type === "beast",
          se: compInfo.series,
          el: compInfo.series === 0 ? "phys" : compInfo.series === 1 ? "poison" : compInfo.series === 2 ? "cold" : compInfo.series === 3 ? "fire" : "light",
          id: typeof JX.skillMax === "function" ? JX.skillMax(compInfo.f) : 101,
          L: Math.min(20, Math.max(1, Math.floor(lvl / 5))),
          nm: 1,
          rt: 1,
          pf: {},
          stn: 0,
          ct: 0,
          bf: [],
          cu: [],
          hl: compInfo.hlAmt > 0 ? [compInfo.id === "emei" ? 304 : 101, compInfo.hlAmt] : null,
          Jf: null,
          Jr: null,
          J: null,
          ride: compInfo.type === "hero" ? !!(T && T.ride) : false,
          x: T.x - 45,
          y: T.y + 15,
          _px: T.x - 45,
          _py: T.y + 15,
          dir: 0,
          t: 0,
          dead: false,
          resp: 0
        };

        h.allies.push(allyEntity);
        window.__pkCurrentCompanion = allyEntity; // Export để features_htz_pack.js dùng trong loot loop
        if (typeof JX.toast === "function") JX.toast(`🐾 ${allyEntity.n} đã xuất chiến cùng bạn!`);
        if (typeof JX.log === "function") JX.log(`<span style="color:#7fe36a">🐾 <b>${allyEntity.n}</b> (${compInfo.role}) đồng hành xuất chiến cùng bạn!</span>`);
      } else {
        const cur = h.allies.find(a => a.isOfflineCompanion);
        // Cập nhật vị trí / cưỡi ngựa nếu cần
        if (cur && T && compInfo.type === "hero" && cur.ride !== !!T.ride) {
          cur.ride = !!T.ride;
        }
        // Nga My tự động buff máu cho người chơi nếu máu thấp
        if (compInfo.id === "emei" && h.life < (h.P ? h.P.life * 0.6 : 5000) && !existing.dead) {
          const now = Date.now();
          if (!existing._lastHeal || now - existing._lastHeal > 8000) {
            existing._lastHeal = now;
            const healVal = Math.round(lvl * 600 + 4000);
            if (typeof JX.heal === "function") JX.heal(healVal);
            if (typeof JX.hitNum === "function") JX.hitNum(T.x, T.y - 45, "+" + healVal.toLocaleString("vi-VN") + " HP", "#5fd35a", 13, 1);
            if (typeof JX.log === "function") JX.log(`<span style="color:#5fd35a">🌸 <b>${existing.n}</b> thi triển Từ Hàng Phổ Độ hồi phục ${healVal.toLocaleString("vi-VN")} sinh lực!</span>`);
          }
        }
      }
    } else if (!State.companionEnabled && !State.activeFight) {
      // Nếu tắt đồng đội, loại bỏ khỏi h.allies
      if (h.allies && h.allies.length) {
        h.allies = h.allies.filter(a => !a.isOfflineCompanion);
      }
    }
  }

  // Kiểm tra xung đột trước khi bắt đầu bất kỳ hoạt động chiến đấu nào
  function checkFightAllowed(actionDesc) {
    const JX = getJX();
    if (State.activeFight) {
      if (JX && JX.toast) JX.toast(`⚠️ Đang trong trận đấu ${State.activeFight.name || "Boss/PK"}! Hãy kết thúc trận trước.`);
      return false;
    }
    if (window.HtzSongJinBattle && window.HtzSongJinBattle.active) {
      if (JX && JX.toast) JX.toast("⚠️ Đang trong Chiến Trường Tống Kim! Không thể mở thêm trận đấu.");
      return false;
    }
    if (window.HtzBountyKillerSystem && window.HtzBountyKillerSystem.activeHunt) {
      if (JX && JX.toast) JX.toast("⚠️ Đang có Mật Lệnh Sát Thủ! Vui lòng hoàn thành trước.");
      return false;
    }
    return true;
  }

  // ==========================================
  // TRIỆU HỒI BOSS HOÀNG KIM
  // ==========================================
  function summonBoss(bossId, customLevel) {
    if (!checkFightAllowed("Boss")) {
      closePkModal();
      return;
    }

    const JX = getJX();
    if (!JX || !JX.S || !JX.R || !JX.H) {
      alert("Game đang tải, vui lòng thử lại sau giây lát!");
      return;
    }

    const bData = BOSS_DATA.find(b => b.id === bossId);
    if (!bData) return;

    const l = JX.S;
    const h = JX.R;
    const T = JX.H;

    // Cấp độ boss: người chơi chọn hoặc lấy theo cấp nhân vật
    const bossLevel = customLevel ? parseInt(customLevel, 10) : Math.max(50, (l.lvl || 1) + 5);

    // Tìm tọa độ hợp lệ cạnh người chơi
    const spawnPos = typeof JX.walkable === "function" ? JX.walkable(T.x + 150, T.y + 50) : [T.x + 150, T.y + 50];

    // Tạo quái vật
    let bossEntity = null;
    if (typeof JX.spawn === "function") {
      bossEntity = JX.spawn(bData.tid || 141, bossLevel, "boss", spawnPos[0], spawnPos[1]);
    } else {
      bossEntity = {
        id: Math.random(),
        tid: bData.tid || 141,
        n: bData.name,
        L: bossLevel,
        cls: "boss",
        series: bData.series,
        hp: bData.baseHp,
        max: bData.baseHp,
        dmg: bData.baseDmg,
        def: bData.def,
        res: { phys: bData.res, cold: bData.res, fire: bData.res, light: bData.res, poison: bData.res },
        x: spawnPos[0],
        y: spawnPos[1],
        r: 35,
        spd: 55,
        atkCd: 1,
        cd: 1.5,
        reach: 120,
        ranged: false
      };
    }

    // Điều chỉnh thuộc tính Boss Hoàng Kim Chuẩn Khủng
    const scaleFactor = Math.max(1, Math.pow(bossLevel / 60, 1.5));
    bossEntity.goldBoss = true;
    bossEntity.customBoss = true;
    bossEntity.isRaidBoss = true;
    bossEntity.bossId = bData.id;
    bossEntity.n = "Boss Hoàng Kim · " + bData.name;
    // Cân bằng sát thương Boss: Khắc phục triệt để lỗi "boss đụng là chết"!
    Object.defineProperty(bossEntity, "dmg", {
      get: function() {
        const curP = (h && h.P && h.P.life) ? h.P.life : 5000;
        // Mỗi đòn Boss Hoàng Kim chỉ lấy đi khoảng 12% - 14% Max HP của người chơi (vừa đủ căng thẳng để người chơi bơm máu, không 1-hit chết)
        return Math.max(200, Math.round(curP * 0.13));
      },
      set: function() {},
      configurable: true,
      enumerable: true
    });
    bossEntity.series = bData.series;
    bossEntity.bonusDrop = 3; // Boss Hoàng Kim luôn thử rơi đồ 3 lần
    bossEntity.def = Math.round((bData.def || 800) * scaleFactor * 1.5);
    bossEntity.res = { phys: 75, cold: 75, fire: 75, light: 75, poison: 75 };

    // Cân bằng Boss Hoàng Kim: Máu tỉ lệ chuẩn theo cấp người chơi (350.000 - 850.000 HP), đánh 40s-60s kịch tính
    const calculatedHp = Math.round((bossLevel * 7500 + 120000) * Math.min(2.2, scaleFactor));
    let currentHp = calculatedHp;
    const maxHp = calculatedHp;
    Object.defineProperty(bossEntity, "hp", {
      get: function() { return currentHp; },
      set: function(newVal) {
        if (newVal < currentHp) {
          const rawDmg = currentHp - newVal;
          // Giảm 30% sát thương nhận vào (hộ thể boss)
          const mitigatedDmg = Math.max(1, rawDmg * 0.70);
          // Giới hạn sát thương tối đa mỗi hit không quá 3.5% Max HP (chống 1-hit chết Boss nhưng đánh vẫn thấm)
          const maxHitCap = Math.max(100, Math.round(maxHp * 0.035));
          const actualDmg = Math.min(mitigatedDmg, maxHitCap);
          currentHp = Math.max(0, currentHp - actualDmg);
          if (currentHp <= 0) {
            bossEntity.dead = true;
          }
        } else {
          currentHp = Math.min(maxHp, newVal);
        }
      },
      configurable: true,
      enumerable: true
    });
    bossEntity.max = maxHp;

    // Thêm vào h.enemies
    h.enemies = h.enemies || [];
    h.enemies.push(bossEntity);

    // Kích hoạt ActiveFight cho HUD
    State.activeFight = {
      type: "boss",
      entity: bossEntity,
      maxHp: bossEntity.max,
      name: bData.name,
      series: bData.series,
      level: bossLevel,
      bData: bData,
      stage: l ? l.stage : null
    };

    // Thông báo toàn server
    if (typeof JX.banner === "function") {
      JX.banner(`Boss Hoàng Kim ${bData.name}`, `Cấp ${bossLevel} · ${bData.sect} đã giáng thế!`, 3.5);
    }
    if (typeof JX.log === "function") {
      JX.log(`<b style="color:#ffb52e">📢 [Toàn Thể Giang Hồ]:</b> Người chơi <b>${l.name || "Đại Hiệp"}</b> đã thức tỉnh <b style="color:#ff5e5e">Boss Hoàng Kim ${bData.name}</b> (cấp ${bossLevel}) tại bản đồ! Mau cùng nhau chinh phục!`);
    }
    if (typeof JX.toast === "function") {
      JX.toast(`⚔️ Đã triệu hồi Boss Hoàng Kim ${bData.name}!`);
    }
    if (typeof JX.sound === "function") {
      JX.sound("snd/sound_a001_die.mp3", 1, 1);
    }

    renderBossHud(bossEntity, bData, bossLevel);
    closePkModal();
  }

  // ==========================================
  // LÔI ĐÀI TỶ VÕ 1v1 (SOLO MASTER PK)
  // ==========================================
  function start1v1PK(masterIndex, difficulty) {
    if (!checkFightAllowed("1v1")) {
      closePkModal();
      return;
    }

    const JX = getJX();
    if (!JX || !JX.S || !JX.R || !JX.H) return;

    const master = PK_MASTERS[masterIndex] || PK_MASTERS[0];
    const l = JX.S;
    const h = JX.R;
    const T = JX.H;

    const pLevel = Math.max(1, l.lvl || 1);
    const diffMulti = difficulty === "easy" ? 0.8 : difficulty === "hard" ? 1.35 : difficulty === "nightmare" ? 1.7 : 1.0;

    const curPlayerHp = (h && h.P && h.P.life) ? h.P.life : 5000;
    const hpMaster = Math.round((pLevel * 2000 + 15000) * diffMulti);
    const dmgMaster = Math.max(200, Math.round(curPlayerHp * 0.15 * diffMulti));

    // Dọn dẹp quái vật xung quanh tạm thời để không làm phiền lôi đài
    h.enemies = [];

    // Tọa độ đối diện người chơi
    const spawnPos = typeof JX.walkable === "function" ? JX.walkable(T.x + 180, T.y) : [T.x + 180, T.y];

    // Tạo thực thể đối thủ PK
    const oppEntity = {
      id: Math.random(),
      tid: 855,
      isPkMaster: true,
      n: `[${master.sect}] ${master.name}`,
      title: master.title,
      L: pLevel,
      cls: "boss",
      series: master.series,
      hp: hpMaster,
      max: hpMaster,
      dmg: dmgMaster,
      def: Math.round((pLevel * 30 + 250) * diffMulti),
      res: { phys: 60, cold: 60, fire: 60, light: 60, poison: 60 },
      x: spawnPos[0],
      y: spawnPos[1],
      r: 30,
      spd: 60 * diffMulti,
      atkCd: 1.2,
      cd: 1.4 / diffMulti,
      reach: master.f === "tangmen" || master.f === "kunlun" ? 220 : 90,
      ranged: master.f === "tangmen" || master.f === "kunlun",
      potionsLeft: difficulty === "nightmare" ? 3 : difficulty === "hard" ? 2 : 1,
      lastPotionTime: 0,
      animKey: master.f ? "pl_" + master.f : null
    };

    h.enemies.push(oppEntity);

    State.activeFight = {
      type: "1v1",
      opp1: oppEntity,
      master: master,
      name: `1v1: ${master.name} (${master.sect})`,
      difficulty: difficulty,
      stage: l ? l.stage : null,
      startTime: Date.now()
    };

    if (typeof JX.banner === "function") {
      JX.banner(`Lôi Đài 1v1 · Khởi Chiến!`, `${l.name || "Đại Hiệp"} VS ${master.name} (${master.sect})`, 3);
    }
    if (typeof JX.log === "function") {
      JX.log(`<b style="color:#5fb8ff">⚔️ [Lôi Đài Khởi Động]:</b> <b>${l.name || "Đại Hiệp"}</b> bước lên lôi đài tỷ võ cùng <b>${master.name}</b> (${master.title} · ${master.sect})!`);
    }
    if (typeof JX.sound === "function") {
      JX.sound("snd/sound_a003_at.mp3", 1, 1);
    }

    render1v1Hud(oppEntity, master);
    closePkModal();
  }

  // ==========================================
  // ĐẤU TRƯỜNG TRANH BÁ 2v2 (TAG TEAM PK)
  // ==========================================
  function start2v2PK(companionId, difficulty) {
    if (!checkFightAllowed("2v2")) {
      closePkModal();
      return;
    }

    const JX = getJX();
    if (!JX || !JX.S || !JX.R || !JX.H) return;

    const l = JX.S;
    const h = JX.R;
    const T = JX.H;

    const pLevel = Math.max(1, l.lvl || 1);
    const diffMulti = difficulty === "easy" ? 0.8 : difficulty === "hard" ? 1.3 : difficulty === "nightmare" ? 1.6 : 1.0;

    // Chọn 2 đối thủ ngẫu nhiên
    const shuffled = [...PK_MASTERS].sort(() => 0.5 - Math.random());
    const opp1Info = shuffled[0];
    const opp2Info = shuffled[1];

    const compInfo = COMPANIONS.find(c => c.id === companionId) || COMPANIONS[0];

    // Dọn dẹp quái vật xung quanh
    h.enemies = [];
    h.allies = [];

    // Tạo Đồng Đội Trợ Chiến 2v2
    const allyHp = Math.round((pLevel * 1800 + 12000) * 1.1);
    const allyDps = Math.round(pLevel * 130 + 850);
    const allyEntity = {
      isPkAlly: true,
      n: "Đồng Đội · " + compInfo.name,
      f: compInfo.f,
      s: compInfo.s,
      l: pLevel,
      hpMax: allyHp,
      hp: allyHp,
      def: Math.round(pLevel * 25 + 250),
      res: 75,
      dps: allyDps,
      d1: Math.round(allyDps / 2),
      mel: compInfo.f === "shaolin" || compInfo.f === "gaibang",
      se: compInfo.series,
      el: compInfo.series === 0 ? "phys" : compInfo.series === 1 ? "poison" : compInfo.series === 2 ? "cold" : compInfo.series === 3 ? "fire" : "light",
      id: typeof JX.skillMax === "function" ? JX.skillMax(compInfo.f) : 101,
      L: Math.min(20, Math.max(1, Math.floor(pLevel / 5))),
      nm: 1,
      rt: 1,
      pf: {},
      stn: 0,
      ct: 0,
      bf: [],
      cu: [],
      hl: compInfo.hlAmt > 0 ? [compInfo.id === "emei" ? 304 : 101, compInfo.hlAmt] : null,
      Jf: null,
      Jr: null,
      J: null,
      ride: false,
      x: T.x - 40,
      y: T.y + 30,
      _px: T.x - 40,
      _py: T.y + 30,
      dir: 0,
      t: 0,
      dead: false,
      resp: 0
    };
    h.allies.push(allyEntity);

    // Tạo 2 Đối Thủ
    const curPlayerHp2 = (h && h.P && h.P.life) ? h.P.life : 5000;
    const oppHp = Math.round((pLevel * 1700 + 11000) * diffMulti);
    const oppDmg = Math.max(150, Math.round(curPlayerHp2 * 0.12 * diffMulti));

    const pos1 = typeof JX.walkable === "function" ? JX.walkable(T.x + 190, T.y - 30) : [T.x + 190, T.y - 30];
    const pos2 = typeof JX.walkable === "function" ? JX.walkable(T.x + 190, T.y + 50) : [T.x + 190, T.y + 50];

    const opp1 = {
      id: Math.random(),
      tid: 855,
      isPk2v2: true,
      n: `[${opp1Info.sect}] ${opp1Info.name}`,
      L: pLevel,
      cls: "boss",
      series: opp1Info.series,
      hp: oppHp,
      max: oppHp,
      dmg: oppDmg,
      def: Math.round(pLevel * 25 + 200),
      res: { phys: 60, cold: 60, fire: 60, light: 60, poison: 60 },
      x: pos1[0],
      y: pos1[1],
      r: 30,
      spd: 55,
      atkCd: 1.2,
      cd: 1.4,
      reach: 110,
      ranged: false,
      potionsLeft: 1
    };

    const opp2 = {
      id: Math.random(),
      tid: 856,
      isPk2v2: true,
      n: `[${opp2Info.sect}] ${opp2Info.name}`,
      L: pLevel,
      cls: "boss",
      series: opp2Info.series,
      hp: oppHp,
      max: oppHp,
      dmg: oppDmg,
      def: Math.round(pLevel * 25 + 200),
      res: { phys: 60, cold: 60, fire: 60, light: 60, poison: 60 },
      x: pos2[0],
      y: pos2[1],
      r: 30,
      spd: 55,
      atkCd: 1.2,
      cd: 1.4,
      reach: 110,
      ranged: false,
      potionsLeft: 1
    };

    // Đối thủ 1 nhắm vào người chơi, đối thủ 2 nhắm vào đồng đội!
    opp2.tgtA = allyEntity;

    h.enemies.push(opp1, opp2);

    State.activeFight = {
      type: "2v2",
      ally: allyEntity,
      opp1: opp1,
      opp2: opp2,
      opp1Info: opp1Info,
      opp2Info: opp2Info,
      compInfo: compInfo,
      name: `2v2: ${opp1Info.name} & ${opp2Info.name}`,
      stage: l ? l.stage : null,
      startTime: Date.now()
    };

    if (typeof JX.banner === "function") {
      JX.banner(`Đấu Trường 2v2 · Khởi Chiến!`, `Đội Bạn VS ${opp1Info.name} & ${opp2Info.name}`, 3);
    }
    if (typeof JX.log === "function") {
      JX.log(`<b style="color:#d4af37">⚔️ [Đấu Trường 2v2]:</b> Cặp đôi <b>${l.name || "Đại Hiệp"} & ${compInfo.name}</b> đại chiến cùng <b>${opp1Info.name} & ${opp2Info.name}</b>!`);
    }
    if (typeof JX.sound === "function") {
      JX.sound("snd/sound_a003_at.mp3", 1, 1);
    }

    render2v2Hud(allyEntity, opp1, opp2);
    closePkModal();
  }

  // ==========================================
  // XỬ LÝ FRAME TICK (SMART AI & HUD UPDATE)
  // ==========================================
  function onTick(dt) {
    const JX = getJX();
    if (!JX || !JX.S || !JX.R || !JX.H) return;

    const h = JX.R;
    const l = JX.S;
    const T = JX.H;

    // Kiểm tra và cộng 300 tiềm năng chia đều nếu nhân vật chưa nhận
    if (l && l.fac && !l.init300Attr) {
      l.init300Attr = 1;
      l.attr = l.attr || { str: 0, dex: 0, vit: 0, eng: 0 };
      l.attr.str = (l.attr.str || 0) + 75;
      l.attr.dex = (l.attr.dex || 0) + 75;
      l.attr.vit = (l.attr.vit || 0) + 75;
      l.attr.eng = (l.attr.eng || 0) + 75;
      if (typeof JX.recalc === "function") JX.recalc();
      if (typeof JX.save === "function") JX.save();
      if (typeof JX.toast === "function") JX.toast("✨ Nhận 300 điểm tiềm năng khởi đầu (+75 mỗi chỉ số)!");
      if (typeof JX.log === "function") JX.log("✨ <b>Khởi tạo:</b> Nhận <b>300 điểm tiềm năng</b> (+75 Sức Mạnh, Thân Pháp, Sinh Khí, Nội Công)!");
    }

    // 1. Kiểm tra duy trì Đồng Đội thường trực
    const now = Date.now();
    if (now - lastCompanionCheck > 1500) {
      lastCompanionCheck = now;
      ensureCompanion();
    }

    // 2. Kiểm tra Timer tự động gọi Boss thế giới định kỳ
    // Không kích hoạt khi đang trong Chiến Trường Tống Kim
    const songJinActive = window.HtzSongJinBattle && window.HtzSongJinBattle.active;
    if (State.autoTimerEnabled && !State.activeFight && !songJinActive && !h.town && !h.tower && !h.dg) {
      if (now >= State.nextAutoBossAt) {
        State.nextAutoBossAt = now + 10 * 60 * 1000; // 10 phút sau
        const randomBoss = BOSS_DATA[Math.floor(Math.random() * BOSS_DATA.length)];
        summonBoss(randomBoss.id, null);
      }
    }

    // 3. Nếu đang trong trận đấu Boss / 1v1 / 2v2
    if (State.activeFight) {
      const fight = State.activeFight;

      // Thoát nếu người chơi về thành thị, vào khu an toàn, phó bản, tháp, hoặc đổi bản đồ (stage)
      if (h.town || h.inSafe || h.dg || h.tower || (fight.stage != null && l && l.stage !== fight.stage)) {
        cancelActiveFight("Đã rời khu vực chiến đấu — kết thúc hoạt động.");
        return;
      }

      // Thoát nếu người chơi trọng thương (chết)
      if (h.life <= 0 || (h.deadT && h.deadT > 0)) {
        finishFight(false, fight.type);
        return;
      }

      // Xử lý trận đấu BOSS
      if (fight.type === "boss") {
        const b = fight.entity;
        // BẢO VỆ BOSS: Nếu Boss còn sống mà bị wave reset xóa khỏi h.enemies, tự động đưa lại vào h.enemies ngay!
        if (b && !b.dead && b.hp > 0) {
          if (Array.isArray(h.enemies) && !h.enemies.includes(b)) {
            h.enemies.push(b);
          }
        }

        // Chỉ kết thúc trận thắng khi Boss thực sự cạn máu
        if (!b || b.dead || b.hp <= 0) {
          finishFight(true, "boss");
          return;
        }

        // Cập nhật Boss HUD Bar
        updateBossHud(b);
      }

      // Xử lý trận đấu 1v1
      else if (fight.type === "1v1") {
        const opp = fight.opp1;
        // Kiểm tra đối thủ chết -> Thắng, nếu rời đi -> Thoát
        if (!opp || opp.dead || opp.hp <= 0 || (Array.isArray(h.enemies) && !h.enemies.includes(opp))) {
          if (opp && (opp.dead || opp.hp <= 0)) {
            finishFight(true, "1v1");
          } else {
            cancelActiveFight("Đối thủ đã rời khỏi lôi đài.");
          }
          return;
        }

        // Smart AI: Kiting & Di chuyển khéo léo
        handleMasterAI(opp, T, dt);
        update1v1Hud(opp);
      }

      // Xử lý trận đấu 2v2
      else if (fight.type === "2v2") {
        const opp1 = fight.opp1;
        const opp2 = fight.opp2;
        const ally = fight.ally;

        const opp1Dead = !opp1 || opp1.dead || opp1.hp <= 0 || (Array.isArray(h.enemies) && !h.enemies.includes(opp1));
        const opp2Dead = !opp2 || opp2.dead || opp2.hp <= 0 || (Array.isArray(h.enemies) && !h.enemies.includes(opp2));

        // Cả 2 đối thủ chết -> Thắng
        if (opp1Dead && opp2Dead) {
          finishFight(true, "2v2");
          return;
        }

        // Cập nhật AI đối thủ
        if (!opp1Dead) handleMasterAI(opp1, ally && !ally.dead && Math.random() < 0.4 ? ally : T, dt);
        if (!opp2Dead) handleMasterAI(opp2, ally && !ally.dead && Math.random() < 0.6 ? ally : T, dt);

        update2v2Hud(ally, opp1, opp2);
      }
    } else {
      // Đảm bảo không bao giờ có thanh trạng thái mồ côi (ghost HUD)
      if (document.getElementById("pkBossHud") || document.getElementById("pk2v2Hud")) {
        removeHuds();
      }
    }
  }

  // Trí tuệ nhân tạo (AI) Cao Thủ PK
  function handleMasterAI(opp, target, dt) {
    const JX = getJX();
    if (!JX || !opp || !target || opp.dead) return;

    // Khoảng cách tới mục tiêu
    const dist = Math.hypot(opp.x - target.x, opp.y - target.y);

    // Kiting thông minh cho xạ thủ / nội công tầm xa
    if (opp.ranged) {
      if (dist < 100) {
        // Quá gần! Lùi lại tạo khoảng cách
        const angle = Math.atan2(opp.y - target.y, opp.x - target.x);
        opp.x += Math.cos(angle) * opp.spd * dt;
        opp.y += Math.sin(angle) * opp.spd * dt;
      }
    }

    // Uống thuốc cứu mạng khi HP < 35%
    if (opp.hp < opp.max * 0.35 && opp.potionsLeft > 0) {
      const now = Date.now();
      if (now - (opp.lastPotionTime || 0) > 10000) {
        opp.lastPotionTime = now;
        opp.potionsLeft--;
        const healAmt = Math.round(opp.max * 0.35);
        opp.hp = Math.min(opp.max, opp.hp + healAmt);

        if (typeof JX.hitNum === "function") {
          JX.hitNum(opp.x, opp.y - 45, `+${healAmt.toLocaleString("vi-VN")} Dược Phẩm`, "#5fd35a", 13, 1);
        }
        if (typeof JX.sound === "function") {
          JX.sound("snd/sound_a002_at.mp3", 1, 1);
        }
        if (typeof JX.log === "function") {
          JX.log(`<span style="color:#5fd35a">💊 <b>${opp.n}</b> uống Cửu Chuyển Hoàn Hồn Đan, hồi phục ${healAmt.toLocaleString("vi-VN")} sinh lực!</span>`);
        }
      }
    }
  }

  // Hủy và dọn dẹp trận đấu khi người chơi thoát hoặc rút lui
  function cancelActiveFight(reason) {
    const fight = State.activeFight;
    State.activeFight = null;

    const JX = getJX();
    const h = JX ? JX.R : null;

    // 1. Dọn dẹp quái vật / boss / đối thủ của sự kiện
    if (h && Array.isArray(h.enemies)) {
      h.enemies = h.enemies.filter(e => !e.customBoss && !e.isPkMaster && !e.isPk2v2 && !e.isLienDauOpponent && (!fight || (e !== fight.entity && e !== fight.opp1 && e !== fight.opp2)));
    }

    // 2. Dọn dẹp đồng đội 2v2
    if (h && Array.isArray(h.allies)) {
      h.allies = h.allies.filter(a => !a.isPkAlly);
    }

    // 3. Xóa triệt để các thanh trạng thái HUD
    removeHuds();

    // 4. Đóng modal kết quả nếu đang mở
    const res = document.getElementById("pkResultOverlay");
    if (res) res.remove();

    if (reason && JX && typeof JX.toast === "function") {
      JX.toast(reason);
    }
    if (reason && JX && typeof JX.log === "function") {
      JX.log(`<span style="color:#e57373">🚪 ${reason}</span>`);
    }
  }

  // Kết thúc trận chiến (Chiến thắng hoặc Thất bại)
  function finishFight(isVictory, fightType) {
    const JX = getJX();
    const l = JX ? JX.S : null;
    const h = JX ? JX.R : null;
    const T = JX ? JX.H : null;

    const currentFight = State.activeFight;
    State.activeFight = null;

    // Dọn dẹp quái vật và đối thủ của sự kiện khỏi h.enemies
    if (h && Array.isArray(h.enemies)) {
      h.enemies = h.enemies.filter(e => !e.customBoss && !e.isPkMaster && !e.isPk2v2 && !e.isLienDauOpponent && (!currentFight || (e !== currentFight.entity && e !== currentFight.opp1 && e !== currentFight.opp2)));
    }
    // Dọn dẹp đồng đội 2v2 khỏi h.allies
    if (h && Array.isArray(h.allies)) {
      h.allies = h.allies.filter(a => !a.isPkAlly);
    }

    removeHuds();

    if (isVictory) {
      // Âm thanh chiến thắng
      if (JX && typeof JX.sound === "function") JX.sound("snd/sound_a001_die.mp3", 1, 1);

      let rewardGold = 0;
      let rewardKnb = 0;
      let rewardExp = 0;
      let rewardDesc = "";

      if (fightType === "boss") {
        State.stats.bossesDefeated++;
        const bossData = currentFight.bData || {};
        const bossLvl = currentFight.level || 60;
        const tierBonus = Math.max(1, bossLvl / 60);

        // BỎ TIỀN VẠN THEO YÊU CẦU NGƯỜI DÙNG (Không cần tiền vạn)
        rewardGold = 0;
        rewardKnb = Math.round(1500 + Math.floor(bossLvl / 10) * 80);
        rewardExp = Math.round((l && l.lvl ? l.lvl * 250000 : 2500000) * 5 * tierBonus);

        // 1. Rơi Trang Bị Hoàng Kim Môn Phái hoàn chỉnh
        let droppedHk = null;
        if (window.HtzItemGenerator && typeof window.HtzItemGenerator.makeHkItem === "function") {
          droppedHk = window.HtzItemGenerator.makeHkItem(l ? l.fac : "wudang", bossLvl);
          if (droppedHk && l && l.inv && l.inv.length < JX.invMax) {
            l.inv.push(droppedHk);
          }
        }

        // 1b. Boss cấp cao (>= 100 hoặc Tier 3+) có 40% cơ hội rơi Trang Bị Bạch Kim Cực Phẩm
        let droppedPlat = null;
        if (bossLvl >= 100 && Math.random() < 0.40 && window.HtzItemGenerator && typeof window.HtzItemGenerator.makePlatinaItem === "function") {
          droppedPlat = window.HtzItemGenerator.makePlatinaItem(l ? l.fac : "wudang", bossLvl);
          if (droppedPlat && l && l.inv && l.inv.length < JX.invMax) {
            l.inv.push(droppedPlat);
          }
        }

        // Nguyên liệu chế Bạch Kim: Thủy Tinh (lmt = Lam) & Thần Bí Khoáng Thạch (mys)
        // Dùng misc.lmt (Lam Thủy Tinh) thay vì misc.wc để hoạt động ngay trong session
        if (l) {
          if (!l.mats) l.mats = { ht:{}, ore:{}, shard:{}, misc:{}, dp:{} };
          if (!l.mats.misc) l.mats.misc = {};
          var _wcAmt = bossLvl >= 120 ? Math.floor(Math.random() * 5 + 3) :
                       bossLvl >= 100 ? Math.floor(Math.random() * 3 + 2) : 1;
          var _mysAmt = bossLvl >= 120 ? Math.floor(Math.random() * 3 + 1) :
                        bossLvl >= 100 ? Math.floor(Math.random() * 2 + 1) : 0;
          l.mats.misc.ltt = (l.mats.misc.ltt || 0) + _wcAmt; // Lam Th?y Tinh
          l.mats.misc.lmt = (l.mats.misc.lmt || 0) + _wcAmt; // L?c Th?y Tinh
          l.mats.misc.ttt = (l.mats.misc.ttt || 0) + _wcAmt; // T? Th?y Tinh
          if (_mysAmt > 0) l.mats.misc.mys = (l.mats.misc.mys || 0) + _mysAmt;
          if (bossLvl >= 120 && Math.random() < 0.6) {
            l.mats.misc.bk120 = (l.mats.misc.bk120 || 0) + Math.floor(Math.random() * 2 + 1);
          }
          if (bossLvl >= 140 && Math.random() < 0.4) {
            l.mats.misc.bk150 = (l.mats.misc.bk150 || 0) + 1;
          }
        }

        // 2. Rơi Vũ Khí Tím 6 Dòng Cực Phẩm (Max Opts)
        let droppedWep = null;
        if (window.HtzItemGenerator && typeof window.HtzItemGenerator.makeGodWeapon === "function") {
          droppedWep = window.HtzItemGenerator.makeGodWeapon(l ? l.fac : "wudang", bossLvl);
          if (droppedWep && l && l.inv && l.inv.length < JX.invMax) {
            l.inv.push(droppedWep);
          }
        }

        // 3. Rơi 5 - 10 Mảnh Hoàng Kim
        const shardQty = 5 + Math.floor(Math.random() * 6);
        if (window.HtzItemGenerator && typeof window.HtzItemGenerator.addHkShards === "function") {
          window.HtzItemGenerator.addHkShards(shardQty);
        }

        rewardDesc = `1 Trang Bị Hoàng Kim [${droppedHk ? droppedHk.n : "HKMP"}], 1 Vũ Khí Tím 6 Dòng, ${shardQty} Mảnh Hoàng Kim, ${rewardKnb} KNB`;

        // Gửi thư vinh danh hạ boss
        if (typeof window.OfflineMailSystem !== "undefined" && typeof window.OfflineMailSystem.sendMail === "function") {
          window.OfflineMailSystem.sendMail({
            sender: "Võ Lâm Minh Giới",
            title: `🏆 Chiến Báo Hạ Gục ${bossData.name || "Boss Hoàng Kim"}!`,
            content: `Đại hiệp ${l ? l.name || "Vô Danh" : "Vô Danh"} đã anh dũng hạ gục Boss Hoàng Kim ${bossData.name || ""} (cấp ${bossLvl}). Nhận thưởng Trang Bị Hoàng Kim, Vũ Khí Tím 6 Dòng Cực Phẩm và ${shardQty} Mảnh Ghép!`,
            rewards: { knb: 500, qi: bossLvl * 10 }
          });
        }

        if (JX && typeof JX.banner === "function") {
          JX.banner("CHIẾN THẮNG HUY HOÀNG!", `Hạ gục ${currentFight.name} · Nhận Đồ Hoàng Kim & Vũ Khí 6 Dòng!`, 3.5);
        }
        if (JX && typeof JX.log === "function") {
          JX.log(`<b style="color:#ffd700">🎉 [THẮNG BOSS]:</b> Đại hiệp đã xuất sắc hạ gục <b>${currentFight.name}</b>! Nhận thưởng: <b style="color:#ffd24a">${rewardDesc}</b>`);
        }
        if (State.bossRushEnabled && isVictory) {
          setTimeout(() => {
            const curH = JX ? JX.R : null;
            if (curH && !curH.town && !curH.inSafe && !curH.deadT && !State.activeFight) {
              const nextBoss = BOSS_DATA[Math.floor(Math.random() * BOSS_DATA.length)];
              if (JX && JX.toast) JX.toast(`⚡ [Boss Rush] ${nextBoss.name} giáng lâm!`);
              summonBoss(nextBoss.id);
            }
          }, 3500);
        }
      } else if (fightType === "1v1") {
        State.stats.pk1v1Wins++;
        State.stats.pk1v1Streak++;
        if (State.stats.pk1v1Streak > State.stats.pk1v1BestStreak) {
          State.stats.pk1v1BestStreak = State.stats.pk1v1Streak;
        }

        rewardGold = Math.round(1000000 + Math.random() * 1500000);
        rewardKnb = 100;
        rewardExp = Math.round(l && l.lvl ? l.lvl * 120000 : 900000);
        rewardDesc = `100 Điểm Lôi Đài, ${rewardKnb} KNB, ${rewardGold.toLocaleString("vi-VN")} Lượng`;

        if (JX && typeof JX.banner === "function") {
          JX.banner("LÔI ĐÀI CHIẾN THẮNG!", `Đánh bại ${currentFight.master.name}! (Chuỗi ${State.stats.pk1v1Streak})`, 3.5);
        }
        if (JX && typeof JX.log === "function") {
          JX.log(`<b style="color:#ffd700">🏆 [LÔI ĐÀI THẮNG]:</b> Chiến thắng thuyết phục trước <b>${currentFight.master.name}</b>! Nhận: <b style="color:#ffd24a">${rewardDesc}</b>`);
        }
      } else if (fightType === "2v2") {
        State.stats.pk2v2Wins++;
        rewardGold = Math.round(2500000 + Math.random() * 2000000);
        rewardKnb = 250;
        rewardExp = Math.round(l && l.lvl ? l.lvl * 70000 : 600000);
        rewardDesc = `Rương Quần Hùng, ${rewardKnb} KNB, ${rewardGold.toLocaleString("vi-VN")} Lượng`;

        if (JX && typeof JX.banner === "function") {
          JX.banner("ĐẤU TRƯỜNG 2v2 TOÀN THẮNG!", `Đội của bạn đã giành quán quân!`, 3.5);
        }
        if (JX && typeof JX.log === "function") {
          JX.log(`<b style="color:#ffd700">🏆 [2v2 TOÀN THẮNG]:</b> Đội của bạn phối hợp xuất sắc, hạ gục cả 2 cao thủ đối phương! Nhận: <b style="color:#ffd24a">${rewardDesc}</b>`);
        }
      }

      // Trao thưởng vào nhân vật
      if (l) {
        if (rewardGold > 0) l.gold = (l.gold || 0) + rewardGold;
        l.knb = (l.knb || 0) + rewardKnb;
        l.knbV = (l.knbV || 0) + rewardKnb;
      }
      if (T && JX && typeof JX.hitNum === "function") {
        if (rewardGold > 0) JX.hitNum(T.x, T.y - 60, `+${rewardGold.toLocaleString("vi-VN")} Lượng`, "#ffd700", 14);
        JX.hitNum(T.x, T.y - 80, `+${rewardKnb} KNB`, "#00e5ff", 14);
      }

      savePersistedState();

      // Cross-link: Dat moc thang 1v1 tu dong mo khoa HTZ Danh Hieu
      if (fightType === "1v1") {
        const wins = State.stats.pk1v1Wins;
        const titleUnlocks = [
          { wins: 30,  title: "Bach Chien Bach Thang" },
          { wins: 100, title: "Doc Co Cau Bai" }
        ];
        titleUnlocks.forEach(({ wins: needed, title }) => {
          if (wins >= needed) {
            const key = "vlIdle_unlockedTitle_" + title.replace(/\s/g, "_");
            if (!localStorage.getItem(key)) {
              localStorage.setItem(key, "1");
              if (JX && typeof JX.toast === "function") {
                JX.toast("\u2756 Danh Hieu Mo Khoa: " + title);
              }
              if (JX && typeof JX.log === "function") {
                JX.log("<b style=\"color:#e056fd\">\u2756 [Danh Hieu Moi]: " + wins + " thang Loi Dai -> " + title + "</b>");
              }
            }
          }
        });
      }
      showResultModal(true, fightType, rewardDesc);
    } else {
      // Thất bại
      if (fightType === "1v1") {
        State.stats.pk1v1Losses++;
        State.stats.pk1v1Streak = 0;
      } else if (fightType === "2v2") {
        State.stats.pk2v2Losses++;
      }

      // Hồi máu người chơi đầy lại
      if (h && h.P) {
        h.life = h.P.life;
        h.mana = h.P.mana;
      }

      if (JX && typeof JX.banner === "function") {
        JX.banner("BẠI TRẬN - KHÔNG SAO CẢ", "Võ học vô biên, hãy rèn luyện thêm!", 3);
      }
      if (JX && typeof JX.log === "function") {
        JX.log(`<span style="color:#e74c3c">⚔️ <b>Thất bại là mẹ thành công!</b> Đối thủ võ công cao thâm, các hạ đã được hồi sinh lực đầy đủ để tiếp tục tu luyện.</span>`);
      }

      savePersistedState();
      showResultModal(false, fightType, "Được hồi phục toàn bộ Sinh Lực & Nội Lực. Hãy thử lại khi nâng cấp võ công!");
    }

    // Lưu game
    if (JX && typeof JX.save === "function") JX.save();
  }

  // ==========================================
  // HUD OVERLAYS (THANH MÁU TRỰC QUAN TRÊN ARENA)
  // ==========================================
  function renderBossHud(boss, bData, level) {
    removeHuds();
    const hud = document.createElement("div");
    hud.id = "pkBossHud";
    hud.innerHTML = `
      <div class="pk-hud-top">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="pk-hud-name">👑 ${bData.name} <small style="color:#ffd700">(Cấp ${level})</small></span>
          <span class="pk-hud-sub">${bData.sect}</span>
        </div>
        <button class="pk-hud-exit-btn" id="pkExitFightBtn" title="Rút lui / Thoát trận đấu">✕ Rút lui</button>
      </div>
      <div class="pk-hud-bar-wrap">
        <div class="pk-hud-bar-fill" id="pkBossBarFill" style="width: 100%;"></div>
        <div class="pk-hud-bar-text" id="pkBossBarTxt">100%</div>
      </div>
    `;
    const battle = document.getElementById("battle") || document.body;
    battle.appendChild(hud);

    const btn = document.getElementById("pkExitFightBtn");
    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        cancelActiveFight("Đã rút lui khỏi trận đấu Boss!");
      };
    }
  }

  function updateBossHud(boss) {
    const fill = document.getElementById("pkBossBarFill");
    const txt = document.getElementById("pkBossBarTxt");
    if (!fill || !txt) return;

    const pct = Math.max(0, Math.min(100, Math.round((boss.hp / boss.max) * 100)));
    fill.style.width = pct + "%";
    txt.textContent = `${pct}% (${Math.max(0, Math.round(boss.hp)).toLocaleString("vi-VN")}/${Math.round(boss.max).toLocaleString("vi-VN")})`;
  }

  function render1v1Hud(opp, master) {
    removeHuds();
    const hud = document.createElement("div");
    hud.id = "pkBossHud";
    hud.innerHTML = `
      <div class="pk-hud-top">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="pk-hud-name">⚔️ ${master.name} <small style="color:#ffd700">(${master.title})</small></span>
          <span class="pk-hud-sub">${master.sect}</span>
        </div>
        <button class="pk-hud-exit-btn" id="pkExitFightBtn" title="Rút lui / Thoát lôi đài">✕ Rút lui</button>
      </div>
      <div class="pk-hud-bar-wrap">
        <div class="pk-hud-bar-fill" id="pkBossBarFill" style="width: 100%;"></div>
        <div class="pk-hud-bar-text" id="pkBossBarTxt">100%</div>
      </div>
    `;
    const battle = document.getElementById("battle") || document.body;
    battle.appendChild(hud);

    const btn = document.getElementById("pkExitFightBtn");
    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        cancelActiveFight("Đã rút lui khỏi lôi đài 1v1!");
      };
    }
  }

  function update1v1Hud(opp) {
    const fill = document.getElementById("pkBossBarFill");
    const txt = document.getElementById("pkBossBarTxt");
    if (!fill || !txt) return;

    const pct = Math.max(0, Math.min(100, Math.round((opp.hp / opp.max) * 100)));
    fill.style.width = pct + "%";
    txt.textContent = `${pct}% (${Math.max(0, Math.round(opp.hp)).toLocaleString("vi-VN")})`;
  }

  function render2v2Hud(ally, opp1, opp2) {
    removeHuds();
    const JX = getJX();
    const pName = JX && JX.S ? JX.S.name || "Đại Hiệp" : "Đại Hiệp";

    const hud = document.createElement("div");
    hud.id = "pk2v2Hud";
    hud.innerHTML = `
      <div class="pk-2v2-header">
        <span style="font-size:11px; font-weight:700; color:#ffd700;">⚔️ QUẦN HÙNG TRANH BÁ 2v2</span>
        <button class="pk-hud-exit-btn" id="pkExit2v2Btn" title="Rút lui / Thoát đấu trường">✕ Rút lui</button>
      </div>
      <div class="pk-2v2-teams-wrap">
        <div class="pk-team-card team-blue">
          <div class="pk-team-fighter">
            <div class="pk-fighter-info"><span>🔵 ${pName}</span><span id="pk2v2P1Txt">100%</span></div>
            <div class="pk-fighter-bar"><div class="pk-fighter-bar-fill" id="pk2v2P1Bar"></div></div>
          </div>
          <div class="pk-team-fighter">
            <div class="pk-fighter-info"><span>🐾 ${ally ? ally.n.replace("Đồng Đội · ", "") : "Đồng Đội"}</span><span id="pk2v2AllyTxt">100%</span></div>
            <div class="pk-fighter-bar"><div class="pk-fighter-bar-fill" id="pk2v2AllyBar"></div></div>
          </div>
        </div>
        <div class="pk-team-card team-red">
          <div class="pk-team-fighter">
            <div class="pk-fighter-info"><span>🔴 ${opp1.n}</span><span id="pk2v2Opp1Txt">100%</span></div>
            <div class="pk-fighter-bar"><div class="pk-fighter-bar-fill" id="pk2v2Opp1Bar"></div></div>
          </div>
          <div class="pk-team-fighter">
            <div class="pk-fighter-info"><span>🔴 ${opp2.n}</span><span id="pk2v2Opp2Txt">100%</span></div>
            <div class="pk-fighter-bar"><div class="pk-fighter-bar-fill" id="pk2v2Opp2Bar"></div></div>
          </div>
        </div>
      </div>
    `;
    const battle = document.getElementById("battle") || document.body;
    battle.appendChild(hud);

    const btn = document.getElementById("pkExit2v2Btn");
    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        cancelActiveFight("Đã rút lui khỏi đấu trường 2v2!");
      };
    }
  }

  function update2v2Hud(ally, opp1, opp2) {
    const JX = getJX();
    const h = JX ? JX.R : null;

    if (h && h.P) {
      const pPct = Math.max(0, Math.min(100, Math.round((h.life / h.P.life) * 100)));
      const b1 = document.getElementById("pk2v2P1Bar");
      const t1 = document.getElementById("pk2v2P1Txt");
      if (b1) b1.style.width = pPct + "%";
      if (t1) t1.textContent = pPct + "%";
    }

    if (ally) {
      const aPct = ally.dead ? 0 : Math.max(0, Math.min(100, Math.round((ally.hp / ally.hpMax) * 100)));
      const bA = document.getElementById("pk2v2AllyBar");
      const tA = document.getElementById("pk2v2AllyTxt");
      if (bA) bA.style.width = aPct + "%";
      if (tA) tA.textContent = aPct + "%";
    }

    if (opp1) {
      const o1Pct = opp1.dead ? 0 : Math.max(0, Math.min(100, Math.round((opp1.hp / opp1.max) * 100)));
      const bO1 = document.getElementById("pk2v2Opp1Bar");
      const tO1 = document.getElementById("pk2v2Opp1Txt");
      if (bO1) bO1.style.width = o1Pct + "%";
      if (tO1) tO1.textContent = o1Pct + "%";
    }

    if (opp2) {
      const o2Pct = opp2.dead ? 0 : Math.max(0, Math.min(100, Math.round((opp2.hp / opp2.max) * 100)));
      const bO2 = document.getElementById("pk2v2Opp2Bar");
      const tO2 = document.getElementById("pk2v2Opp2Txt");
      if (bO2) bO2.style.width = o2Pct + "%";
      if (tO2) tO2.textContent = o2Pct + "%";
    }
  }

  function removeHuds() {
    const bHud = document.getElementById("pkBossHud");
    if (bHud) bHud.remove();
    const tHud = document.getElementById("pk2v2Hud");
    if (tHud) tHud.remove();
    const res = document.getElementById("pkResultOverlay");
    if (res) res.remove();
  }

  function showResultModal(isWin, type, rewardDesc) {
    const existing = document.getElementById("pkResultOverlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "pkResultOverlay";
    overlay.innerHTML = `
      <div class="pk-result-card ${isWin ? "pk-result-win" : "pk-result-lose"}">
        <div class="pk-result-title">${isWin ? "🏆 CHIẾN THẮNG!" : "⚔️ BẠI TRẬN!"}</div>
        <p style="font-size: 13px; line-height: 1.5; color: #ddd;">
          ${isWin ? "Chúc mừng đại hiệp đã giành chiến thắng vang dội trên võ đài!" : "Đối thủ bản lĩnh cao cường. Hãy tôi luyện thêm võ công rồi khiêu chiến lại!"}
        </p>
        <div class="pk-result-rewards">
          <b>${isWin ? "🎁 Phần Thưởng Nhận Được:" : "💡 Lưu Ý:"}</b><br>
          ${rewardDesc}
        </div>
        <button class="pk-result-btn" id="pkResultCloseBtn">Xác Nhận</button>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("pkResultCloseBtn").onclick = () => {
      overlay.remove();
      removeHuds();
    };
  }

  // ==========================================
  // GIAO DIỆN CHÍNH (MODAL LÔI ĐÀI & GỌI BOSS)
  // ==========================================
  let selectedBossId = BOSS_DATA[0].id;
  let selected1v1MasterIdx = 0;
  let selected1v1Diff = "normal";
  let selected2v2CompId = "emei";
  let selected2v2Diff = "normal";

  function injectPkButton() {
    // Thêm nút trên Top Bar
    const top = document.getElementById("top");
    if (top && !document.getElementById("pkBossBtn")) {
      const btn = document.createElement("button");
      btn.id = "pkBossBtn";
      btn.className = "pk-boss-btn";
      btn.title = "Lôi Đài PK & Gọi Boss";
      btn.innerHTML = "⚔️ Lôi Đài · Boss";
      btn.onclick = openPkModal;

      // Chèn trước actBtn
      const actBtn = document.getElementById("actBtn");
      if (actBtn) {
        top.insertBefore(btn, actBtn);
      } else {
        top.appendChild(btn);
      }
    }

    // Gắn hook vào nút "Tổ đội" ở navtabs
    const tabRide = document.getElementById("tabRide");
    if (tabRide) {
      tabRide.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openPkModal();
        switchTab("companion");
      };
    }
  }

  function createModalHtml() {
    if (document.getElementById("pkBossModal")) return;

    const modal = document.createElement("div");
    modal.id = "pkBossModal";
    modal.className = "hidden";
    modal.innerHTML = `
      <div class="pk-modal-box">
        <div class="pk-modal-header">
          <div class="pk-modal-title">
            <span>⚔️ VÕ LÂM LÔI ĐÀI & GỌI BOSS</span>
            <span class="badge">OFFLINE ĐẶC SẮC</span>
          </div>
          <button class="pk-modal-close" id="pkModalCloseBtn" title="Đóng">✕</button>
        </div>
        <div class="pk-nav-tabs">
          <button class="pk-nav-tab active" data-tab="boss">🏮 Gọi Boss</button>
          <button class="pk-nav-tab" data-tab="1v1">⚔️ Lôi Đài 1v1</button>
          <button class="pk-nav-tab" data-tab="2v2">👥 Đấu Trường 2v2</button>
          <button class="pk-nav-tab" data-tab="companion">🐾 Đồng Đội</button>
          <button class="pk-nav-tab" data-tab="stats">📜 Chiến Tích</button>
        </div>
        <div class="pk-modal-content" id="pkModalContent">
          <!-- Nội dung sẽ được render động theo tab -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Bắt sự kiện đóng
    document.getElementById("pkModalCloseBtn").onclick = closePkModal;
    modal.onclick = (e) => {
      if (e.target === modal) closePkModal();
    };

    // Bắt sự kiện chuyển Tab
    modal.querySelectorAll(".pk-nav-tab").forEach(tab => {
      tab.onclick = () => {
        modal.querySelectorAll(".pk-nav-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderTabContent(tab.dataset.tab);
      };
    });
  }

  function openPkModal() {
    createModalHtml();
    const modal = document.getElementById("pkBossModal");
    if (modal) {
      modal.classList.remove("hidden");
      // Mặc định render tab đang active
      const activeTab = modal.querySelector(".pk-nav-tab.active");
      renderTabContent(activeTab ? activeTab.dataset.tab : "boss");
    }
  }

  function closePkModal() {
    const modal = document.getElementById("pkBossModal");
    if (modal) modal.classList.add("hidden");
  }

  function switchTab(tabName) {
    const modal = document.getElementById("pkBossModal");
    if (!modal) return;
    const tabBtn = modal.querySelector(`.pk-nav-tab[data-tab="${tabName}"]`);
    if (tabBtn) {
      modal.querySelectorAll(".pk-nav-tab").forEach(t => t.classList.remove("active"));
      tabBtn.classList.add("active");
      renderTabContent(tabName);
    }
  }

  // Render nội dung từng tab
  function renderTabContent(tabKey) {
    const container = document.getElementById("pkModalContent");
    if (!container) return;

    const JX = getJX();
    const l = JX ? JX.S : null;
    const pLvl = l && l.lvl ? l.lvl : 1;

    let activeFightHtml = "";
    if (State.activeFight) {
      activeFightHtml = `
        <div class="pk-active-fight-banner">
          <div class="pk-active-fight-info">
            <span class="pk-pulsing-dot"></span>
            <span>Đang diễn ra: <b style="color:#ffd700;">${State.activeFight.name || "Hoạt động"}</b></span>
          </div>
          <button class="btn sm red" id="pkCancelFightInModalBtn" style="font-weight:700;">✕ Rút lui ngay</button>
        </div>
      `;
    }

    if (tabKey === "boss") {
      container.innerHTML = `
        ${activeFightHtml}
        <div class="pk-banner-box">
          🏮 <b>Sự kiện Gọi Boss Hoàng Kim & Thần Ma</b><br>
          <span style="color:#8da49a; font-size:11px;">
            Dùng Lệnh Bài Thần Ma đánh thức các Boss huyền thoại từ Thập Đại Môn Phái đến Kiếm Ma Độc Cô Cầu Bại. Đánh bại nhận Bạc, KNB, EXP và Rương HKMP!
          </span>
        </div>

        <div class="pk-toggle-row">
          <label for="pkAutoBossCheck">
            <b>⏰ Tự Động Xuất Hiện Boss (10 phút/lần)</b>
            <span>Boss thế giới định kỳ xuất hiện bất ngờ tại bãi luyện công</span>
          </label>
          <label class="pk-switch">
            <input type="checkbox" id="pkAutoBossCheck" ${State.autoTimerEnabled ? "checked" : ""}>
            <span class="pk-slider"></span>
          </label>
        </div>

        <div class="pk-toggle-row">
          <label for="pkBossRushCheck">
            <b>⚡ Săn Boss Liên Tục (Boss Rush)</b>
            <span>Tự động thức tỉnh Boss tiếp theo sau 3.5 giây khi Boss trước bị diệt</span>
          </label>
          <label class="pk-switch">
            <input type="checkbox" id="pkBossRushCheck" ${State.bossRushEnabled ? "checked" : ""}>
            <span class="pk-slider"></span>
          </label>
        </div>

        <div class="pk-section-title">
          <span>DANH SÁCH BOSS HOÀNG KIM (${BOSS_DATA.length})</span>
          <span style="font-size:10px; color:#aaa;">Cấp đề xuất: Cấp ${pLvl}</span>
        </div>

        <div class="pk-card-grid">
          ${BOSS_DATA.map(b => {
            const seriesTag = b.series === 0 ? "tag-kim" : b.series === 1 ? "tag-moc" : b.series === 2 ? "tag-thuy" : b.series === 3 ? "tag-hoa" : "tag-tho";
            const seriesName = b.series === 0 ? "Hệ Kim" : b.series === 1 ? "Hệ Mộc" : b.series === 2 ? "Hệ Thủy" : b.series === 3 ? "Hệ Hỏa" : "Hệ Thổ";
            const isSel = b.id === selectedBossId;
            return `
              <div class="pk-card ${isSel ? "selected" : ""}" data-boss-id="${b.id}">
                <div class="pk-card-title">${b.name}</div>
                <div class="pk-card-sub">${b.sect} · <span class="pk-card-tag ${seriesTag}">${seriesName}</span></div>
                <div class="pk-card-sub" style="margin-top:4px; font-size:9.5px; color:#7f9d92;">${b.desc}</div>
                <div style="margin-top:6px; font-size:9.5px; color:#ffd24a;">🎁 ${b.drops}</div>
              </div>
            `;
          }).join("")}
        </div>

        <div style="display:flex; gap:10px; align-items:center; margin-bottom:12px;">
          <label style="font-weight:700; color:#ddd; font-size:11px;">Cấp Độ Boss:</label>
          <select id="pkBossLevelSelect" style="flex:1; background:#1c2b26; color:#ffd700; border:1px solid #3d564c; padding:6px; border-radius:4px; font-family:inherit;">
            <option value="">Theo Cấp Hiện Tại (${pLvl})</option>
            <option value="60">Cấp 60 (Sơ Nhập)</option>
            <option value="80">Cấp 80 (Cao Thủ)</option>
            <option value="100">Cấp 100 (Tông Sư)</option>
            <option value="120">Cấp 120 (Huyền Thoại)</option>
            <option value="150">Cấp 150 (Võ Thánh)</option>
          </select>
        </div>

        <button class="pk-btn-primary" id="pkSummonBossBtn">⚡ TRIỆU HỒI BOSS NGAY</button>
      `;

      // Chọn card boss
      container.querySelectorAll(".pk-card[data-boss-id]").forEach(card => {
        card.onclick = () => {
          container.querySelectorAll(".pk-card[data-boss-id]").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          selectedBossId = card.dataset.bossId;
        };
      });

      // Bật/tắt Săn Boss Liên Tục (Boss Rush)
      const rushCheck = document.getElementById("pkBossRushCheck");
      if (rushCheck) {
        rushCheck.onchange = () => {
          State.bossRushEnabled = rushCheck.checked;
          if (JX && typeof JX.toast === "function") {
            JX.toast(State.bossRushEnabled ? "⚡ Đã kích hoạt chế độ Săn Boss Liên Tục (Boss Rush)!" : "Đã tắt Săn Boss Liên Tục.");
          }
          savePersistedState();
        };
      }

      // Bật/tắt auto boss timer
      const autoCheck = document.getElementById("pkAutoBossCheck");
      if (autoCheck) {
        autoCheck.onchange = () => {
          State.autoTimerEnabled = autoCheck.checked;
          if (State.autoTimerEnabled) {
            State.nextAutoBossAt = Date.now() + 10 * 60 * 1000;
            if (JX && typeof JX.toast === "function") JX.toast("⏰ Đã bật tự động gọi Boss sau mỗi 10 phút!");
          } else {
            if (JX && typeof JX.toast === "function") JX.toast("Đã tắt tự động gọi Boss.");
          }
          savePersistedState();
        };
      }

      // Nút Triệu Hồi
      document.getElementById("pkSummonBossBtn").onclick = () => {
        const customLvl = document.getElementById("pkBossLevelSelect").value;
        summonBoss(selectedBossId, customLvl);
      };
    } else if (tabKey === "1v1") {
      container.innerHTML = `
        ${activeFightHtml}
        <div class="pk-banner-box">
          ⚔️ <b>Võ Lâm Lôi Đài · Tỷ Võ 1v1</b><br>
          <span style="color:#8da49a; font-size:11px;">
            Khiêu chiến các Cao Thủ Môn Phái có trí tuệ nhân tạo (AI): tự động né tránh, kiting tầm xa, tung chiêu thức ngũ hành, và uống Cửu Chuyển Hoàn Hồn Đan khi yếu thế!
          </span>
        </div>

        <div class="pk-section-title">
          <span>CHỌN CAO THỦ THÁCH ĐẤU</span>
        </div>

        <div class="pk-card-grid">
          ${PK_MASTERS.map((m, idx) => {
            const isSel = idx === selected1v1MasterIdx;
            const seriesTag = m.series === 0 ? "tag-kim" : m.series === 1 ? "tag-moc" : m.series === 2 ? "tag-thuy" : m.series === 3 ? "tag-hoa" : "tag-tho";
            return `
              <div class="pk-card ${isSel ? "selected" : ""}" data-master-idx="${idx}">
                <div class="pk-card-title">${m.name}</div>
                <div class="pk-card-sub">${m.sect} · <span class="pk-card-tag ${seriesTag}">${m.title}</span></div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="pk-section-title">
          <span>ĐỘ KHÓ THỬ THÁCH</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-bottom:12px;">
          <button class="btn sm ${selected1v1Diff === "easy" ? "on" : ""}" data-diff="easy">Sơ Nhập</button>
          <button class="btn sm ${selected1v1Diff === "normal" ? "on" : ""}" data-diff="normal">Cao Thủ</button>
          <button class="btn sm ${selected1v1Diff === "hard" ? "on" : ""}" data-diff="hard">Tông Sư</button>
          <button class="btn sm ${selected1v1Diff === "nightmare" ? "on" : ""}" data-diff="nightmare">Võ Thánh</button>
        </div>

        <button class="pk-btn-primary" id="pkStart1v1Btn">⚔️ VÀO LÔI ĐÀI TỶ VÕ</button>
      `;

      container.querySelectorAll(".pk-card[data-master-idx]").forEach(card => {
        card.onclick = () => {
          container.querySelectorAll(".pk-card[data-master-idx]").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          selected1v1MasterIdx = parseInt(card.dataset.masterIdx, 10);
        };
      });

      container.querySelectorAll("button[data-diff]").forEach(btn => {
        btn.onclick = () => {
          container.querySelectorAll("button[data-diff]").forEach(b => b.classList.remove("on"));
          btn.classList.add("on");
          selected1v1Diff = btn.dataset.diff;
        };
      });

      document.getElementById("pkStart1v1Btn").onclick = () => {
        start1v1PK(selected1v1MasterIdx, selected1v1Diff);
      };
    } else if (tabKey === "2v2") {
      container.innerHTML = `
        ${activeFightHtml}
        <div class="pk-banner-box">
          👥 <b>Quần Hùng Tranh Bá · Đấu Trường 2v2</b><br>
          <span style="color:#8da49a; font-size:11px;">
            Bạn và 1 Đồng Đội (Ally) cùng kề vai chiến đấu đối đầu với 2 Cao Thủ giang hồ! Tinh thần phối hợp đồng đội, hồi phục, tanker che chắn và sát thương bộc phá!
          </span>
        </div>

        <div class="pk-section-title">
          <span>CHỌN ĐỒNG ĐỘI XUẤT CHIẾN CÙNG BẠN</span>
        </div>

        <div class="pk-card-grid">
          ${COMPANIONS.map(c => {
            const isSel = c.id === selected2v2CompId;
            return `
              <div class="pk-card ${isSel ? "selected" : ""}" data-comp-id="${c.id}">
                <div class="pk-card-title">${c.name}</div>
                <div class="pk-card-sub">${c.sect} · <b style="color:#ffd700;">${c.role}</b></div>
                <div class="pk-card-sub" style="margin-top:3px; font-size:9.5px;">${c.desc}</div>
              </div>
            `;
          }).join("")}
        </div>

        <div class="pk-section-title">
          <span>ĐỘ KHÓ ĐỐI THỦ 2v2</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-bottom:12px;">
          <button class="btn sm ${selected2v2Diff === "easy" ? "on" : ""}" data-2v2-diff="easy">Cân Bằng</button>
          <button class="btn sm ${selected2v2Diff === "normal" ? "on" : ""}" data-2v2-diff="normal">Hào Kiệt</button>
          <button class="btn sm ${selected2v2Diff === "hard" ? "on" : ""}" data-2v2-diff="hard">Kỳ Phùng</button>
          <button class="btn sm ${selected2v2Diff === "nightmare" ? "on" : ""}" data-2v2-diff="nightmare">Tuyệt Kỹ</button>
        </div>

        <button class="pk-btn-primary" id="pkStart2v2Btn">👥 KHỞI CHIẾN ĐẤU TRƯỜNG 2v2</button>
      `;

      container.querySelectorAll(".pk-card[data-comp-id]").forEach(card => {
        card.onclick = () => {
          container.querySelectorAll(".pk-card[data-comp-id]").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          selected2v2CompId = card.dataset.compId;
        };
      });

      container.querySelectorAll("button[data-2v2-diff]").forEach(btn => {
        btn.onclick = () => {
          container.querySelectorAll("button[data-2v2-diff]").forEach(b => b.classList.remove("on"));
          btn.classList.add("on");
          selected2v2Diff = btn.dataset["2v2Diff"];
        };
      });

      document.getElementById("pkStart2v2Btn").onclick = () => {
        start2v2PK(selected2v2CompId, selected2v2Diff);
      };
    } else if (tabKey === "companion") {
      container.innerHTML = `
        <div class="pk-banner-box">
          🐾 <b>Đồng Hành Trợ Chiến Thường Trực</b><br>
          <span style="color:#8da49a; font-size:11px;">
            Xua tan cảm giác cô đơn khi chơi Offline! Kích hoạt đệ tử/đồng môn luôn đi theo bạn tại mọi bãi quái, cùng cưỡi ngựa, chiến đấu và hỗ trợ buff máu!
          </span>
        </div>

        <div class="pk-toggle-row">
          <label for="pkCompanionToggle">
            <b>🐾 Bật Đồng Đội Luôn Đi Cùng Luyện Công</b>
            <span>Đồng đội sẽ xuất hiện cạnh bạn và cùng đánh quái</span>
          </label>
          <label class="pk-switch">
            <input type="checkbox" id="pkCompanionToggle" ${State.companionEnabled ? "checked" : ""}>
            <span class="pk-slider"></span>
          </label>
        </div>

        <div class="pk-section-title">
          <span>CHỌN ĐỒNG ĐỘI ĐỒNG HÀNH</span>
        </div>

        <div class="pk-card-grid">
          ${COMPANIONS.map(c => {
            const isSel = c.id === State.selectedCompanion;
            return `
              <div class="pk-card ${isSel ? "selected" : ""}" data-offline-comp="${c.id}">
                <div class="pk-card-title">${c.name}</div>
                <div class="pk-card-sub">${c.sect} · <b style="color:#ffd700;">${c.role}</b></div>
                <div class="pk-card-sub" style="margin-top:4px;">${c.desc}</div>
              </div>
            `;
          }).join("")}
        </div>
      `;

      const compToggle = document.getElementById("pkCompanionToggle");
      if (compToggle) {
        compToggle.onchange = () => {
          State.companionEnabled = compToggle.checked;
          savePersistedState();
          ensureCompanion();
          if (State.companionEnabled) {
            if (JX && typeof JX.toast === "function") JX.toast("🐾 Đã kích hoạt đồng đội trợ chiến!");
          } else {
            if (JX && typeof JX.toast === "function") JX.toast("Đã cho đồng đội về thôn nghỉ ngơi.");
          }
        };
      }

      container.querySelectorAll(".pk-card[data-offline-comp]").forEach(card => {
        card.onclick = () => {
          container.querySelectorAll(".pk-card[data-offline-comp]").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          State.selectedCompanion = card.dataset.offlineComp;
          savePersistedState();

          // Cập nhật lại đồng đội trên map
          if (JX && JX.R && JX.R.allies) {
            JX.R.allies = JX.R.allies.filter(a => !a.isOfflineCompanion);
          }
          ensureCompanion();
        };
      });
    } else if (tabKey === "stats") {
      const curTitle = getTitle(State.stats.pk1v1Wins);
      const total1v1 = State.stats.pk1v1Wins + State.stats.pk1v1Losses;
      const winRate1v1 = total1v1 > 0 ? Math.round((State.stats.pk1v1Wins / total1v1) * 100) : 0;

      container.innerHTML = `
        <div class="pk-banner-box" style="text-align:center; padding:16px;">
          <div style="font-size:12px; color:#aaa; margin-bottom:4px;">DANH HIỆU LÔI ĐÀI HIỆN TẠI</div>
          <div style="font-size:20px; font-weight:800; color:${curTitle.color}; text-shadow:0 0 10px ${curTitle.color};">
            ★ ${curTitle.title} ★
          </div>
          <div style="font-size:11px; color:#ddd; margin-top:6px;">Số trận thắng Lôi Đài: <b>${State.stats.pk1v1Wins}</b></div>
        </div>

        <div class="pk-section-title">
          <span>THỐNG KÊ CHIẾN TÍCH</span>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:14px;">
          <div class="pk-card" style="cursor:default;">
            <div style="font-size:11px; color:#aaa;">Lôi Đài 1v1 Thắng</div>
            <div style="font-size:18px; font-weight:700; color:#2ecc71;">${State.stats.pk1v1Wins} trận</div>
            <div style="font-size:10px; color:#888;">Tỉ lệ thắng: ${winRate1v1}%</div>
          </div>
          <div class="pk-card" style="cursor:default;">
            <div style="font-size:11px; color:#aaa;">Chuỗi Thắng Cao Nhất</div>
            <div style="font-size:18px; font-weight:700; color:#ffd700;">${State.stats.pk1v1BestStreak} liên thắng</div>
            <div style="font-size:10px; color:#888;">Hiện tại: ${State.stats.pk1v1Streak}</div>
          </div>
          <div class="pk-card" style="cursor:default;">
            <div style="font-size:11px; color:#aaa;">Đấu Trường 2v2 Thắng</div>
            <div style="font-size:18px; font-weight:700; color:#3498db;">${State.stats.pk2v2Wins} trận</div>
            <div style="font-size:10px; color:#888;">Thất bại: ${State.stats.pk2v2Losses}</div>
          </div>
          <div class="pk-card" style="cursor:default;">
            <div style="font-size:11px; color:#aaa;">Boss Hoàng Kim Đã Diệt</div>
            <div style="font-size:18px; font-weight:700; color:#e74c3c;">${State.stats.bossesDefeated} Boss</div>
            <div style="font-size:10px; color:#888;">Đã lĩnh thưởng dồi dào</div>
          </div>
        </div>

        <div class="pk-section-title">
          <span>HỆ THỐNG CÁC CẤP BẬC DANH HIỆU</span>
        </div>

        <div style="background:rgba(0,0,0,0.3); border:1px solid #2e473d; border-radius:6px; overflow:hidden;">
          ${PK_RANKS.map(r => `
            <div style="display:flex; justify-content:space-between; padding:8px 10px; border-bottom:1px solid rgba(255,255,255,0.05); font-size:11px;">
              <span style="color:${r.color}; font-weight:700;">${r.title}</span>
              <span style="color:#aaa;">Cần ${r.wins} trận thắng</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    // Gắn sự kiện nút Hủy trận trong modal nếu có
    const cancelInModal = document.getElementById("pkCancelFightInModalBtn");
    if (cancelInModal) {
      cancelInModal.onclick = () => {
        cancelActiveFight("Đã hủy và rút lui khỏi hoạt động!");
        renderTabContent(tabKey);
      };
    }
  }

  // ==========================================
  // KHỞI TẠO VÀ GẮN HOOK ENGINE
  // ==========================================
  function init() {
    loadPersistedState();
    removeHuds();
    injectPkButton();
    createModalHtml();

    // Hook vào vòng lặp game thông qua othTick
    const oldOthTick = window.othTick;
    window.othTick = function(dt) {
      if (typeof oldOthTick === "function") {
        try { oldOthTick(dt); } catch (e) { console.error(e); }
      }
      try {
        onTick(dt);
      } catch (e) {
        console.error("[PkBoss] Lỗi onTick:", e);
      }
    };

    // Phím tắt ESC để đóng modal và dọn dẹp HUD
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePkModal();
        const res = document.getElementById("pkResultOverlay");
        if (res) res.remove();
      }
    });

    // === OPTIMIZATION 1: Tự động mở so sánh trang bị trực quan ===
    function initComparisonObserver() {
      const modal = document.getElementById("modal");
      if (!modal) return;
      const observer = new MutationObserver(() => {
        if (!modal.classList.contains("hidden")) {
          const eqCurs = modal.querySelectorAll("details.eqcur");
          eqCurs.forEach(d => {
            if (!d.hasAttribute("data-auto-opened")) {
              d.setAttribute("data-auto-opened", "1");
              d.open = true;
            }
          });
        }
      });
      observer.observe(modal, { attributes: true, childList: true, subtree: true });
    }

    // === OPTIMIZATION 2: Đồng hồ đo hiệu suất cày cuốc (Farm Speedometer) ===
    function initFarmSpeedometer() {
      let lastXp = 0;
      let lastGold = 0;
      let lastTime = Date.now();
      let history = [];

      function updateSpeedometer() {
        const tLog = document.getElementById("t-log");
        if (!tLog || !window.l) return;

        const now = Date.now();
        const dt = (now - lastTime) / 1000;
        if (dt < 1) return;

        const curXp = window.l.xp || 0;
        const curGold = window.l.gold || 0;

        if (lastXp > 0 && curXp >= lastXp) {
          const xpDiff = curXp - lastXp;
          const goldDiff = curGold >= lastGold ? (curGold - lastGold) : 0;
          history.push({ xpDiff, goldDiff, dt });
          if (history.length > 20) history.shift();
        }

        lastXp = curXp;
        lastGold = curGold;
        lastTime = now;

        const totalDt = history.reduce((sum, h) => sum + h.dt, 0);
        let xpPerMin = 0;
        let goldPerMin = 0;
        if (totalDt > 0) {
          const totalXp = history.reduce((sum, h) => sum + h.xpDiff, 0);
          const totalGold = history.reduce((sum, h) => sum + h.goldDiff, 0);
          xpPerMin = Math.round((totalXp / totalDt) * 60);
          goldPerMin = Math.round((totalGold / totalDt) * 60);
        }

        let speedo = document.getElementById("farmSpeedometer");
        if (!speedo) {
          speedo = document.createElement("div");
          speedo.id = "farmSpeedometer";
          // Inject SAU logChannelBar (nếu có) để không vướng layout nhật ký
          const chanBar = document.getElementById("logChannelBar");
          if (chanBar && chanBar.parentNode === tLog) {
            chanBar.insertAdjacentElement("afterend", speedo);
          } else {
            tLog.insertAdjacentElement("afterbegin", speedo);
          }
        }

        const luckyVal = (window.h && window.h.P && window.h.P.lucky != null) ? window.h.P.lucky : 200;

        speedo.innerHTML = `
          <div class="farm-stat">
            <span class="farm-lbl">Tốc Độ Exp</span>
            <span class="farm-val val-exp">+${xpPerMin.toLocaleString()} / p</span>
          </div>
          <div class="farm-stat">
            <span class="farm-lbl">Bạc Rơi</span>
            <span class="farm-val val-gold">+${goldPerMin.toLocaleString()} / p</span>
          </div>
          <div class="farm-stat">
            <span class="farm-lbl">May Mắn</span>
            <span class="farm-val val-kill">${luckyVal} ☘</span>
          </div>
        `;
      }

      setInterval(updateSpeedometer, 3000);
    }

    // Kích hoạt các module tối ưu
    initComparisonObserver();
    initFarmSpeedometer();

    // Định kỳ kiểm tra nút bấm phòng trường hợp DOM bị render lại
    setInterval(injectPkButton, 3000);

    window.pkCancelActiveFight = cancelActiveFight;
    window.pkRemoveHuds = removeHuds;
    // Chia sẻ State và COMPANIONS ra window để các pack khác (features_htz_pack / modern_layout) đồng bộ
    window.__pkBossState = State;
    window.__pkBossCompanions = COMPANIONS;
    window.__pkEnsureCompanion = ensureCompanion;

    console.log("[PkBossSystem] Hệ thống đã sẵn sàng với tối ưu UI/UX!");
  }

  // Chạy khi DOM và window đã tải
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
