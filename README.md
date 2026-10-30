# Võ Lâm Idle - Phiên Bản Offline

Phiên bản độc lập (Standalone Offline) được clone toàn bộ từ http://volamidle.pages.dev/ và tinh chỉnh tối ưu hóa trải nghiệm chơi Offline trên máy tính cá nhân.

## 1. Thông Tin Tài Nguyên
- **Tổng số tệp**: 12.427 tệp (~677 MB).
- **Đầy đủ 100% tài nguyên**:
  - Âm thanh võ học, hiệu ứng chiêu thức, tiếng trúng đòn (`snd/`).
  - Toàn bộ hoạt cảnh chiêu thức, hiệu ứng đao kiếm pháp thuật (`fx/`).
  - Đầy đủ 146 bản đồ chướng ngại vật & di chuyển (`jmo/`).
  - Hình nền các thành thị, thôn trấn, môn phái và bãi luyện công (`img/z/`).
  - Hơn 9.600 bộ ngoại trang, tóc, nón, vũ khí, thú cưỡi JX1 (`img/jx/`).
  - Giao diện, khung trang bị, icon kỹ năng, quái vật, boss (`img/`).
  - Bộ phông chữ chuẩn IBM Plex Mono và Noto Serif (`fonts/`).

---

## 2. Các Tinh Chỉnh Cho Bản Offline

### 🌙 Tinh chỉnh Thanh Offline & Ủy thác luyện công:
1. **Tự động ủy thác khi thoát game**:
   - Bản gốc yêu cầu người chơi phải nhớ bấm *Esc → Ủy thác* trước khi tắt tab, nếu quên sẽ bị mất toàn bộ thời gian rời mạng (`Không tính thời gian rời mạng`).
   - Bản Offline đã khắc phục hoàn toàn: Mỗi khi tắt game và mở lại, hệ thống sẽ tự động tính toán thời gian bạn đã rời mạng và trả thưởng đầy đủ.
2. **Thanh tiến trình Quỹ giờ Offline trực quan**:
   - Bổ sung thanh tiến trình phần trăm hiển thị trực quan số giờ đã tích lũy và hạn mức hôm nay (`ku(e) / 24 giờ`).
3. **Mở rộng hạn mức & tốc độ tối đa**:
   - Tăng hạn mức ủy thác mỗi lần: từ **8 giờ** lên **24 giờ**.
   - Tăng hạn mức tối đa mỗi ngày: từ **12 giờ** lên **24 giờ**.
   - Tăng tốc độ ủy thác cơ bản: từ **70%** lên **100%**.
4. **Nhận cả Ngân Lượng & Rương tu luyện**:
   - Mở khóa tính năng rơi Bạc (ngân lượng) và Rương tu luyện khi ủy thác rời mạng (bản gốc bị khóa `xpOnly: true`).
5. **Nút tua nhanh thử nghiệm (Fast-Forward)**:
   - Trong bảng Ủy thác có thêm 2 nút:
     - `⚡ Nhận ngay 2 giờ (Tua nhanh)`
     - `⚡ Nhận ngay 8 giờ (Tua nhanh)`
     Giúp bạn nhận ngay kết quả ủy thác để thử nghiệm hoặc tăng tốc độ mà không cần phải chờ đợi.

### ⚙ Tinh chỉnh hệ thống & Chơi ngoại tuyến:
1. **Sửa lỗi thời gian máy chủ (`el()`)**:
   - Loại bỏ hoàn toàn lỗi `"Không lấy được giờ máy chủ — bỏ qua thưởng offline lần này"`. Hệ thống tự động đồng bộ theo giờ máy tính cá nhân.
2. **Loại bỏ phụ thuộc đám mây**:
   - Tắt Cloudflare Pages Analytics và Cloudflare Turnstile Captcha.
   - Chế độ Offline kích hoạt mặc định, dữ liệu nhân vật lưu trực tiếp vào `localStorage` trên trình duyệt với tính năng Xuất/Nhập file sao lưu (`Lưu file`).
3. **Mã quà tặng Offline (Giftcodes)**:
   - Mở khóa nhập Giftcode trực tiếp không cần đăng nhập tài khoản đám mây:
     - `OFFLINE` hoặc `VOLAMOFFLINE`: 50.000.000 Lượng + 10.000 KNB + 50 giờ Bạch Câu Hoàn.
     - `VOLAM2026` hoặc `TANTHU`: 5.000.000 Lượng + 1.000 KNB + 10 giờ Bạch Câu Hoàn.
     - `VIP999` / `VIP888` / `VIP666`: 10.000.000 Lượng + 2.000 KNB + 20 giờ Bạch Câu Hoàn.

---

## 3. Tính Năng Mới: Lôi Đài PK, Gọi Boss & Đồng Đội (Bản Offline)
Hệ thống độc quyền giúp trải nghiệm chơi Offline sinh động, sôi nổi, không còn cảm giác cô đơn:

### 🏮 1. Sự Kiện Gọi Boss Hoàng Kim & Thần Ma:
- **Triệu hồi 12 Đại Boss**: Huyền Giác Thiền Sư, Dương Thần, Đường Bất Nhiễm, Lam Hà, Lam Y Y, Bạch Oanh Oanh, Hà Nhân Ngã, Yên Cuồng Đồ, Cổ Bách, Tuyền Cơ Tử, Độc Cô Cầu Bại, Hỏa Kỳ Lân.
- **Tùy chỉnh cấp độ**: Tự động cân bằng theo cấp nhân vật hoặc tự chọn cấp (60 - 150).
- **Thanh máu Boss trực quan (Boss HUD)** hiển thị phần trăm HP, hệ Ngũ Hành và chân dung.
- **Tính năng tự động gọi Boss sau mỗi 10 phút**: Tự động thức tỉnh Boss Thế Giới ngay tại bãi luyện công khi cắm máy.
- **Phần thưởng phong phú**: Bạc, KNB, EXP khổng lồ, Rương Hoàng Kim Môn Phái (HKMP), Huyền Tinh cấp cao, Bí kíp.

### ⚔️ 2. Lôi Đài Tỷ Võ 1v1 (Master Duel AI):
- Thách đấu 10 đại cao thủ giang hồ (Trương Vô Kỵ, Kiều Phong, Chu Chỉ Nhược, Lệnh Hồ Xung, Tiêu Viễn Sơn, Đường Thanh Dung, Doãn Hàm Yên, Lam Phượng Hoàng, Dương Khang, Hoàn Nhan Hồng Liệt).
- **AI chiến đấu thông minh**:
  - Tự động di chuyển kiting áp sát hoặc giữ cự ly.
  - Sử dụng võ công môn phái có hoạt ảnh chiêu thức và âm thanh chân thực.
  - Tự động uống **Cửu Chuyển Hoàn Hồn Đan** khi máu dưới 35%.
  - Đối thoại kiếm hiệp sinh động khi giao chiến.
- 4 cấp độ: Sơ Nhập, Cao Thủ, Tông Sư, Võ Thánh.
- Chiến thắng nhận Bạc, KNB, EXP và tích lũy Điểm Lôi Đài.

### 👥 3. Đấu Trường Quần Hùng 2v2 (Tag Team PK):
- **Người chơi + 1 Đồng Đội VS 2 Cao Thủ đối phương**.
- Cả 4 nhân vật cùng xuất chiêu trên cùng một võ đài.
- Đồng đội hỗ trợ hồi máu, tank đỡ đòn và dồn sát thương.
- Bảng hiển thị thanh máu Live Teams HUD cả 2 đội.

### 🐾 4. Đồng Đội Trợ Chiến Thường Trực (Offline Companions):
- Kích hoạt đệ tử/đồng môn luôn đi theo hỗ trợ khi train quái ngoài bãi luyện công.
- 5 bạn đồng hành:
  - **Bạch Ngọc Y (Nga My)**: Tự động hồi phục 30% sinh lực cho người chơi khi HP < 60% và làm chậm quái.
  - **Huyền Giác (Thiếu Lâm)**: Đỡ đòn cực khỏe, hút quái và phản 35% sát thương.
  - **Hỏa Long Ca (Cái Bang)**: Sát thương diện rộng cực mạnh, thiêu đốt bạo kích.
  - **Thanh Phong Tử (Võ Đang)**: Kiếm khí tầm xa, gây choáng mục tiêu.
  - **Ám Dạ Ảnh (Đường Môn)**: Bão phi đao độc sát liên hoàn.
- Đồng đội có hình ảnh trang phục JX, cưỡi ngựa cùng người chơi, tự hồi sinh khi tử trận.

### 📜 5. Bảng Chiến Tích & Danh Hiệu Lôi Đài:
- Theo dõi tỉ lệ thắng/thua 1v1, 2v2, chuỗi thắng cao nhất và số Boss đã diệt.
- 7 bậc danh hiệu Võ Lâm: *Vô Danh Tiểu Tốt, Giang Hồ Tân Tú, Võ Lâm Hào Kiệt, Võ Lâm Tông Sư, Bách Chiến Bách Thắng, Thiên Hạ Vô Song, Võ Lâm Chí Tôn · Độc Cô Cầu Bại*.

---

## 4. Bốn Gói Nâng Cấp Tinh Hoa Chuẩn Võ Lâm 1 (New)

Được kế thừa và chắt lọc từ giao diện kinh điển của Võ Lâm Truyền Kỳ 1 (tham chiếu client PC `play.htz.vn`):

### 🔮 GÓI 1: Giao Diện Bình Cầu Sinh Lực & Nội Lực Cổ Điển (Classic Dual Orb HUD)
- **Bình Cầu Máu Đỏ (Sinh Lực)** & **Bình Cầu Mana Lam (Nội Lực)** hình cầu thủy tinh viền chạm khắc đồng vàng cổ phong.
- Hiệu ứng sóng nước chất lỏng (Wave Animation) dập dềnh liên tục theo thời gian thực.
- Vệt sáng khúc xạ 3D (specular reflection) và hiệu ứng đỏ rực cảnh báo khi máu dưới 30%.
- Tương tác thông minh: Nhấp trực tiếp vào bình cầu để sử dụng ngay Thuốc Máu (Phím 1) hoặc Thuốc Mana (Phím 2).
- Nút chuyển đổi linh hoạt `☯ Cổ Điển / Thanh Ngang` và nút `☯ Bình Cầu` trên header, lưu trạng thái tự động.

### 📜 GÓI 2: Phân Kênh Nhật Ký Giang Hồ (Multi-Channel Chat & Log System)
- Phân tab thanh lọc nhật ký ngay trên đầu tab **Giang hồ**:
  1. **[Tất Cả]**: Toàn bộ diễn biến chiến đấu, rớt đồ, hệ thống.
  2. **[Bảo Vật]**: Chỉ hiển thị thông báo nhặt trang bị Quý, đồ Hoàng Kim, Bạch Kim, Huyền Tinh, KNB. Có viền vàng kim sắc lấp lánh và âm thanh rơi bạc keng keng kinh điển.
  3. **[Chiến Sự]**: Diễn biến tiêu diệt Boss, Lôi đài 1v1, Đấu trường 2v2, sát thương cao trào.
  4. **[Hệ Thống]**: Thông báo tăng cấp, cộng điểm tiềm năng, kỹ năng, lưu trữ.
- Ô tìm kiếm từ khóa trực tiếp (`🔍 Lọc từ khóa...`) lọc tức thì các dòng nhật ký.
- Nút khóa/mở cuộn tự động (`⬇ Cuộn / ⏸ Khóa`) giúp người chơi dễ dàng dừng lại đọc chi tiết đồ rơi mà không bị giật màn hình.

### 🧭 GÓI 3: Tiểu Bản Đồ Radar Sân Đấu (Mini-Map HUD)
- Khung la bàn radar phong cách kiếm hiệp tọa lạc ở góc trên bên phải sân đấu.
- Định vị trực quan toàn bộ thực thể theo thời gian thực:
  - **Tâm radar (Xanh lục lấp lánh)**: Vị trí người chơi.
  - **Chấm đỏ**: Quái thường ngoài bãi luyện công.
  - **Chấm cam hổ phách**: Quái tinh anh (Elite).
  - **Ngôi sao tím/vàng nhấp nháy phát quang**: Boss Hoàng Kim, Boss Thế Giới hoặc Đại Cao Thủ.
  - **Chấm xanh da trời**: Đồng đội hiệp khách trợ chiến.
- Hiển thị tọa độ chính xác `X, Y`, tên bản đồ hiện tại và tổng số quái sống.
- Nút thu phóng `1x / 2x` và nút thu gọn/mở rộng `🧭 Bản đồ`.

### 🛡️ GÓI 4: Giao Diện Bảng Nhân Vật F3 Chuẩn Cổ Điển (Classic F3 Panel)
- Biểu ngữ hoàng kim: `❖ BẢNG THUỘC TÍNH NHÂN VẬT · F3 ❖`.
- Khung nhân vật uy nghiêm với vòng tròn năng lượng Bát Quái cổ phong sau lưng mô hình avatar.
- 10 ô trang bị chạm khắc đồng vàng cổ điển với viền phát sáng khi trang bị đồ quý.
- **Thanh đo Ngũ Hành Kháng Tính (5 Res Meters)**: Hiển thị thanh tiến trình trực quan cho Kháng Vật Lý ⚔️, Kháng Độc 🧪, Kháng Băng ❄️, Kháng Hỏa 🔥, Kháng Lôi ⚡, đổi màu kim sắc khi đạt mức kháng tối đa (75%+).
- Nút điểm tiềm năng `#bTTa` tự động nhấp nháy phát quang rực rỡ khi nhân vật còn điểm chưa cộng.

---

## 5. Bảy Tính Năng Tinh Hoa JX1 Tham Chiếu `play.htz.vn` (Mới Cập Nhật)

Được nghiên cứu, đối chiếu và chắt lọc trực tiếp từ mã nguồn và cấu trúc Client JX1 của dự án `D:\Program Files\test\play-htz-offline`:

### ⛅ 1. Hệ Thống Thời Tiết & Chu Kỳ Ngày/Đêm Động (Tham chiếu `3d0a6a8378.js`):
- Lớp phủ Canvas chuyên dụng trên nền đấu trường (`#battle`).
- 6 chế độ thời tiết:
  1. **Tự động theo giờ thực tế**: Ban ngày (6h-17h) rạng rỡ, Hoàng hôn (17h-19h) ánh ráng đỏ tía lãng mạn, Ban đêm (19h-6h) ánh trăng huyền ảo với đom đóm dạ quang bay lượn.
  2. **Mưa Giông & Sấm Chớp**: Hạt mưa rơi chéo góc theo gió, sấm chớp xé toạc bầu trời và hiệu ứng âm thanh sống động.
  3. **Tuyết Rơi Phong Hàn**: Bông tuyết trắng muốt lững lờ bồng bềnh đậm chất Côn Lôn, Hoa Sơn.
  4. **Hoa Đào & Lá Phong Rơi**: Cánh hoa đào hồng phớt và lá phong đỏ rực rơi bay nhẹ theo gió.
  5. **Nắng Ráo Kiếm Hiệp**: Trời quang mây tạnh, ánh sáng rực rỡ.
  6. **Đêm Trăng Huyền Ảo**: Bầu trời sao tĩnh mịch, đom đóm lập lòe.
- Nút bấm nhanh `⛅ Thời Tiết: [Tự Động ▾]` ngay góc trên sân đấu giúp chuyển đổi tức thì.

### 🎯 2. Bảng Mật Lệnh Sát Thủ Nhiếp Thí Trần (Tham chiếu `32bc4bfcc2.js`):
- 12 Đầu Mục Ác Bá giang hồ chia làm 3 đẳng cấp:
  - **Sơ Cấp (Cấp 20 - 59)**: *Hắc Phong Trại Chủ, Lương Sơn Tiểu Tặc, Phi Long Trại Đao Khách, Xích Luyện Ma Nữ*.
  - **Trung Cấp (Cấp 60 - 89)**: *Đoạt Mệnh Kiếm Khách, Huyết Đao Cuồng Tăng, Thất Sát Tướng Quân, Ma Giáo Hữu Sứ*.
  - **Cao Cấp (Cấp 90 - 150)**: *Tuyệt Tình Ma Đầu, Vạn Độc Quỷ Mẫu, U Linh Thần Tướng, Độc Cô Nghịch Đồ*.
- Bấm **"🎯 Săn Lùng Ác Tặc"**: Triệu hồi Boss Sát Thủ vào bản đồ với hào quang sát khí đỏ rực.
- Trảm thủ thành công nhận: Bạc, KNB, EXP khổng lồ, Rương Sát Thủ Giản và Điểm Sát Thủ.

### ☸ 3. Đả Thông Bát Đại Kinh Mạch (Tham chiếu `857b6550bd.js`):
- Hệ thống võ học Bát Mạch Chu Thiên:
  - **Đốc Mạch**: Tăng Công Kích Cơ Bản (+80/tầng) & Bạo Kích (+1%/tầng).
  - **Nhâm Mạch**: Tăng Sinh Lực Tối Đa (+2.000/tầng) & Hồi Máu (+50/s).
  - **Xung Mạch**: Tăng Nội Lực Tối Đa (+1.000/tầng) & Hồi Mana (+30/s).
  - **Đới Mạch**: Tăng Tốc Độ Di Chuyển (+3/tầng) & Né Tránh (+30/tầng).
  - **Âm Kiều Mạch**: Tăng Kháng Vật Lý & Kháng Băng (+4%/tầng).
  - **Dương Kiều Mạch**: Tăng Kháng Hỏa & Kháng Lôi (+4%/tầng).
  - **Âm Duy Mạch**: Tăng Kháng Độc (+5%/tầng) & Giảm Trúng Độc (-5%/tầng).
  - **Dương Duy Mạch**: Tăng Toàn Bộ Kháng Tính (+3%/tầng) & Chống Choáng (-5%/tầng).
- Nguồn Chân Khí tự động tích tụ khi online, train quái hoặc qua tính năng **Thiền Định Quy Nguyên**.

### 🐾 4. Hệ Thống Linh Thú Hộ Chủ & Tự Động Nhặt Đồ (Tham chiếu `cf511ea95c.js`):
- 6 loài Linh Thú xuất chiến:
  - **Hỏa Kỳ Lân Con**: Bạo kích +8%, tự động hút nhặt đồ trong bán kính 350px.
  - **Tuyết Lang Vương**: Tốc độ di chuyển +20%, kháng làm chậm 25%.
  - **Hoàng Kim Thần Khuyển**: Rơi bạc thêm +35%, may mắn nhặt đồ quý +25.
  - **Tiên Hạc Côn Lôn**: Hồi 3% HP/MP mỗi 5s, giảm 10% sát thương nhận vào.
  - **Kim Mao Chiêu Tài Miêu**: Tăng EXP nhận được +25%, tăng tỉ lệ rơi rương tu luyện.
  - **Hùng Miêu Kungfu**: Tăng Máu tối đa +15%, phản 10% sát thương.
- Linh thú chạy theo bảo vệ chủ nhân và tự động thu gom ngân lượng/trang bị rơi trên bản đồ kèm âm thanh leng keng cực đã tai!
- Tính năng Bồi Dưỡng tăng cấp độ thú cưng (1 - 30).

### 🚩 5. Đại Chiến Trường Tống Kim (Tham chiếu `62bbd5b787.js`):
- Chọn phe **Đại Tống (Cờ Đỏ)** hoặc **Đại Kim (Cờ Xanh)**.
- Giao tranh đại chiến 3 phút: Xông pha tiêu diệt binh sĩ, dũng tướng, cướp cờ soái.
- Bảng HUD Tống Kim Live theo dõi điểm số 2 phe, thời gian trận đánh và chuỗi liên trảm.
- Nhận thưởng: Rương Chiến Trường Tống Kim, Ngân Lượng, KNB và Điểm Quân Công.
- 6 Bậc Quân Hàm: *Binh Sĩ -> Bách Phu Trưởng -> Đô Thống -> Tiên Phong -> Thống Soái -> Đại Nguyên Soái Tống Kim*.

### 🏆 6. Bảng Xếp Hạng Cao Thủ Thế Giới (Tham chiếu `72c2fea75f.js`):
- Vinh danh Thập Đại Cao Thủ giang hồ (Độc Cô Cầu Bại, Kiều Phong, Trương Vô Kỵ, Lệnh Hồ Xung, Hoàng Dược Sư, ...).
- Hiển thị vị trí thực tế của người chơi theo Cấp Độ, Chiến Lực, Ngân Lượng, Sát Thủ và Tống Kim.
- Tính năng **Bái Kiến Cao Thủ** mỗi ngày nhận 500.000 Lượng + 100 KNB + 300 Chân Khí!

### ❖ 7. Danh Hiệu Động Bay Trên Đầu Nhân Vật (Tham chiếu `ead5ad0c0d.js`):
- Danh hiệu ánh kim sắc, xích quang, tử quang bay bổng sinh động trên đầu nhân vật ở sân đấu.
- Tự do chuyển đổi: *Võ Lâm Chí Tôn, Độc Cô Cầu Bại, Đại Nguyên Soái Tống Kim, Đệ Nhất Sát Thủ, Thiên Hạ Đệ Nhất Phú Hộ, Bát Mạch Quy Nguyên, Bách Chiến Bách Thắng*.

---

## 6. Bộ Tính Năng & Tinh Chỉnh Tối Ưu Mới Nhất

Hệ thống tối ưu hóa toàn diện trải nghiệm chơi Offline trên PC và Mobile:

### ⚡ 1. Điều Khiển Tốc Độ Trận Đánh (Battle Speed Controller):
- Nút bấm trực quan **`⚡ 1x / 1.5x / 2x / 3x`** ngay trên **Action Ribbon**.
- Tăng tốc độ mô phỏng chiến đấu, di chuyển, đánh quái, diệt Boss gấp **1.5x, 2x, 3x** lần mà vẫn giữ tốc độ khung hình 60 FPS mượt mà.
- Lưu trữ trạng thái vào bộ nhớ máy, khởi động lại tự động áp dụng.

### 🐾 2. Linh Thú Hút & Nhặt Đồ Siêu Tốc (Instant Vacuum & Auto-Loot):
- Mở khóa hàm nhặt đồ tức thì `JX.pick()` trong core engine.
- Khi Linh Thú / Đồng Hành hút vật phẩm đến gần nhân vật hoặc đồng đội trong bán kính 38px, vật phẩm được **nhặt ngay lập tức** vào hành trang (hoặc tự bán ra Lượng nếu bật Bán Đồ Tự Động) mà **không làm gián đoạn chiêu thức hay thời gian hồi chiêu**.

### 🛡️ 3. Trợ Thủ Sinh Tồn & Tự Động Trở Lại Bãi Luyện Công (Smart AFK Assistant):
- **Tự động dùng dược phẩm**: Tự động uống máu khi HP < 45%, tự động hồi mana khi MP < 25%.
- **Cứu nguy khẩn cấp**: Khi HP nguy kịch (< 18%) và thuốc đang hồi chiêu hoặc hết thuốc, tự động kích hoạt **Thổ Địa Phù** bay về thành an toàn thay vì chịu chết và mất kinh nghiệm.
- **Tự động trở lại bãi**: Khi ở trong thành dưỡng sức, sau khi đầy 90%+ sinh lực và nội lực, trợ thủ **tự động bấm "Trở lại bãi"** để nhân vật tiếp tục train quái, người chơi có thể an tâm cắm máy qua đêm mà không lo kẹt ở thành.

### ⚡ 4. Chế Độ Săn Boss Liên Tục (Boss Rush Mode):
- Trong bảng Khiêu Chiến Boss Hoàng Kim, bổ sung tùy chọn: `⚡ Săn Boss Liên Tục (Boss Rush)`.
- Khi kích hoạt, sau khi hạ gục một Đại Boss, hệ thống tự động thức tỉnh Boss tiếp theo sau 3.5 giây, giúp người chơi liên tục thử thách võ học và thu thập Rương HKMP mà không phải mở bảng gọi thủ công.

### 💾 5. Quản Lý Sao Lưu Lưu Trữ 1-Click & Bản Phục Hồi Tự Động (Save Manager):
- Nút **`💾 Lưu Trữ`** ngay trên Action Ribbon mở bảng quản lý dữ liệu toàn diện:
  - **Xuất File Lưu (.json)**: Tải toàn bộ nhân vật, võ công, kinh mạch, thú cưng ra file JSON về máy tính.
  - **Nhập File Lưu (.json)**: Khôi phục nhân vật từ file sao lưu dễ dàng.
  - **Tự Động Tạo Điểm Phục Hồi (Auto-Snapshots)**: Tự động lưu 5 bản sao lưu gần nhất (mỗi 30 phút một bản) cùng nút **"Khôi Phục"** 1-click.
  - **Tạo Điểm Phục Hồi Thủ Công**: Lưu nhanh một mốc thời gian trước khi thử ép đồ hoặc nâng điểm.
  - **Kho Mã Quà Tặng Offline**: Hiển thị trạng thái các mã Giftcode (`OFFLINE`, `VOLAM2026`, `TANTHU`, `VIP999`, `VIP888`, `VIP666`) kèm nút **"Nhận Quà ➔"** 1-click.

### 🚀 6. Tối Ưu Hóa Hiệu Năng & Tiết Kiệm Pin/CPU:
- Nâng quỹ thời gian ủy thác mô phỏng ngầm (`LN`) từ **12 giờ lên 24 giờ**, cho phép treo máy ẩn tab cả ngày.
- Bổ sung cơ chế **Dirty-Checking** cho Bình Cầu Sinh Lực & Nội Lực (Dual Orb HUD): Tránh vẽ lại và chỉnh sửa DOM khi máu/mana không đổi.
- Tự động tạm dừng hiệu ứng hạt thời tiết (`HtzWeatherSystem`) khi trình duyệt chuyển sang tab khác (`document.hidden`), giảm tiêu thụ CPU về mức tối thiểu.

---

## 7. Hệ Thống Thông Thiên Tháp Nâng Cấp Toàn Diện (Tower of Babel Enhanced)

Khắc phục hoàn toàn tình trạng map tháp bị đen/thiếu ảnh nền và phần thưởng nghèo nàn của bản gốc:

### 🗺️ 1. Tái Thiết 10 Thần Vực Biome Tuyệt Sắc (Dynamic Multi-Biome Maps):
- Thay thế hoàn toàn map gốc (map 397 vốn bị lỗi thiếu file ảnh nền) bằng **10 Thần Vực Biome Kiếm Hiệp** thay đổi luân phiên theo từng chặng tầng:
  1. **Tầng 1 - 10**: 🏯 *Huyền Vũ Cổ Điện* (Map 7: Tần Lăng cổ đại uy nghiêm, đêm trăng tĩnh mịch).
  2. **Tầng 11 - 20**: 🌲 *U Linh Trúc Lâm* (Map 19: Kiếm Các Tây Nam hùng vĩ, hoa đào lãng đãng).
  3. **Tầng 21 - 30**: ☯️ *Thanh Thành Đạo Cảnh* (Map 21: Thanh Thành Sơn đạo gia thanh tịnh).
  4. **Tầng 31 - 40**: 🔥 *Xích Diễm Ma Quật* (Map 224: Sa Mạc Địa Biểu, ráng chiều hoàng hôn rực đỏ).
  5. **Tầng 41 - 50**: ❄️ *Hàn Băng Thần Điện* (Map 322: Trường Bạch Sơn tuyết phong hàn giá lạnh).
  6. **Tầng 51 - 60**: 🌿 *Dược Vương Tiên Động* (Map 140: Dược Vương Cốc hoa thơm cỏ lạ, hồi phục nguyên khí).
  7. **Tầng 61 - 70**: ⚡ *Phong Lôi Thần Vực* (Map 122: Hoàng Hà Nguyên Đầu, sấm chớp mưa giông gầm rú).
  8. **Tầng 71 - 80**: ⚔️ *Hoa Sơn Kiếm Đỉnh* (Map 2: Đỉnh Hoa Sơn luận kiếm hiểm trở ngút ngàn).
  9. **Tầng 81 - 90**: 👑 *Hoàng Kim Đế Vương Điện* (Map 56: Hoành Sơn Phái tráng lệ chạm khắc rồng phượng).
  10. **Tầng 91+**: 🌌 *Hư Không Thần Ma Giới* (Map 70: Vũ Lăng Sơn u huyền, quy luật không thời gian đảo lộn).
- Tự động đồng bộ hóa hình nền map, nhạc nền kiếm hiệp và hiệu ứng thời tiết tương ứng mỗi khi bước sang Thần Vực mới.

### 🎁 2. Bảng Phần Thưởng Vượt Tầng Cực Kỳ Hậu Hĩnh:
- **Thưởng MỌI TẦNG**:
  - Ngân Lượng: `50.000 + Tầng * 25.000` Lượng (tăng đều đặn theo độ khó).
  - Kinh Nghiệm: `100.000 + Tầng * 50.000` EXP.
  - KNB: Nhận +5 KNB mỗi tầng thường, +20 KNB mỗi tầng 5, +50 KNB mỗi tầng 10!
  - Chân Khí (Đả Thông Kinh Mạch): Nhận +15 Chân Khí mỗi tầng tích lũy thẳng vào hệ thống Kinh Mạch.
- **Thưởng Mốc Lớn**:
  - Hồi 50% Sinh Lực & Nội Lực sau mỗi 5 tầng.
  - Thưởng Thần Bí Khoáng Thạch, Thủy Tinh (Tử/Lam/Lục) và Đá May Mắn ở các tầng mốc 10.
  - Thưởng Mảnh Trang Bị Hoàng Kim Môn Phái ở các tầng mốc 25, 50 và 100.

### ⚡ 3. Các Tính Năng Tối Ưu Mới:
- **Nút "🗼 Leo Tháp" trên Action Ribbon**: Truy cập 1-Click mở bảng quản lý Thông Thiên Tháp toàn cảnh.
- **💨 Tính năng Càn Quét Nhanh (Fast Sweep)**: Dựa trên kỷ lục tầng cao nhất (`towerBest`), người chơi có thể bấm 1-Click để nhận ngay toàn bộ Ngân Lượng, EXP, KNB và Chân Khí tích lũy của tất cả các tầng đã vượt qua mà không cần tốn thời gian đánh lại từng tầng.
- **Thanh HUD Thông Thiên Tháp Trực Quan**: Hiển thị tên Thần Vực, số tầng hiện tại, nút Càn Quét và nút Rời Tháp nhanh ngay trên góc màn hình trận đấu.

---

## 8. Gói Nâng Cấp Bốn Hệ Thống Cốt Lõi (Offline Systems Pack)

### 📨 1. Hộp Thư Offline (Offline Mailbox & Fast Claim All):
- Khắc phục lỗi bấm phím **F6** / Hộp thư bị lỗi `"Chưa cấu hình máy chủ"`.
- Hệ thống hòm thư Offline độc lập lưu trữ trên máy:
  - Tự động phát **Thư Chào Mừng Tân Thủ** (20.000.000 Lượng + 3.000 KNB + 300 Chân Khí + 5 Tiên Thảo Lộ + 5 Bạch Câu Hoàn + 1 Rương Trang Bị Quý).
  - Tự động gửi **Thư Phúc Lợi Tuần** và **Thư Chinh Phục Thông Thiên Tháp**.
- Nút **"🎁 Nhận Nhanh Tất Cả" (Claim All)**: 1-Click thu nhận toàn bộ Bạc, KNB, Chân Khí và quà đính kèm vào nhân vật.
- Nút **"🗑 Xóa Thư Đã Nhận"**: Giúp hòm thư luôn ngăn nắp, gọn gàng.
- Nút **`📨 Hộp Thư`** trên Action Ribbon có chấm đỏ thông báo số thư chưa đọc.

### 🏮 2. Kỳ Trân Các Mở Rộng (Enhanced KTC):
- Mở khóa toàn bộ các mặt hàng quý vốn bị ẩn ở bản gốc:
  - **Hồng Bao May Mắn**: Mở nhận ngẫu nhiên 50 vạn – 10 triệu Lượng.
  - **Đại Hồng Bao**: Mở nhận ngẫu nhiên 50 – 500 Kim Nguyên Bảo.
  - **Tiên Thảo Lộ Đặc Biệt**: Nhân đôi kinh nghiệm (+100% EXP) trong 8 giờ.
  - **Quế Hoa Tửu**: +20 May Mắn, tăng tỉ lệ rơi đồ nhiều dòng và đồ quý.
- Cho phép mua với số lượng linh hoạt (x1, x10) nhanh chóng.

### 👥 3. Đồng Hành Trợ Chiến Tinh Chỉnh (Companion Mastery):
- **Di chuyển theo chân thông minh**: Đồng hành hiệp khách và linh thú di chuyển mượt mà, khi khoảng cách quá xa (> 350px) sẽ tự động dịch chuyển lướt gió theo chân chủ nhân, không lo kẹt góc hay tụt lại phía sau.
- **Tuyệt Kỹ Nộ Chiêu Đồng Hành (Companion Burst)**:
  - Tự động tích tụ thanh Nộ Khí khi đánh quái/Boss.
  - Khi đầy Nộ Khí, đồng hành tự động giải phóng Nộ Chiêu Trấn Phái:
    - *Nga My (Bạch Ngọc Y)*: Hồi phục 35% Sinh Lực & Nội Lực toàn đội.
    - *Thiếu Lâm (Huyền Giác)*: Kim Cang Bất Hoại, tăng 50% Phòng Thủ trong 8 giây.
    - *Cái Bang (Hỏa Long Ca)*: Giáng Long Thập Bát Chưởng, tăng 60% Công Kích bạo kích trong 6 giây.
    - *Võ Đang (Thanh Phong Tử)*: Thái Cực Kiếm Khí, giảm 35% Công Kích kẻ địch trong 8 giây.
    - *Đường Môn (Ám Dạ Ảnh)*: Bão Vũ Lê Hoa Châm, tăng 120% Sát Thương và bỏ qua 50% Phòng Thủ mục tiêu.

### ✊ 4. Oản Tù Tì Giang Hồ Offline (Rock-Paper-Scissors Minigame):
- Hồi sinh và nâng cấp toàn diện minigame Oản Tù Tì (bản gốc bị lỗi đòi hỏi máy chủ Supabase và báo thiếu SQL).
- Hoạt động **100% Offline Standalone** mượt mà, công bằng và kịch tính:
  - Đấu tay đôi trực tiếp với **Thần Bài Tương Dương**.
  - 3 thế ra chiêu kiếm hiệp: **✊ Búa (Đao)**, **✌ Kéo (Kiếm)**, **🖐 Bao (Chưởng)**.
  - Đặt cược linh hoạt: Cược **Ngân Lượng** (10 vạn, 50 vạn, 200 vạn) hoặc Cược **Kim Nguyên Bảo** (50 KNB, 200 KNB).
  - Tỉ lệ trả thưởng sòng phẳng: Thắng nhận **x2 cược**, Hòa hoàn trả cược!
  - **Thưởng Chuỗi Thắng (Winning Streak)**:
    - Chuỗi 3 trận thắng: Thưởng thêm **+100 KNB**.
    - Chuỗi 5 trận thắng liên tiếp: Thưởng thêm **+300 KNB**!
- Nút **`✊ Oản Tù Tì`** trên Action Ribbon mở sòng bạc giang hồ 1-Click bất cứ lúc nào!

---

## 9. Tinh Chỉnh & Đồng Bộ Cốt Lõi Hệ Thống (Core Engine Integrations & Bug Fixes)

Đợt rà soát và tinh chỉnh chuyên sâu toàn bộ codebase đã hoàn tất các hạng mục:
1. **Hợp nhất chỉ số chiến đấu ngoại vi (`__applyExternalCombatStats`)**:
   - Tích hợp 3 tầng buff cùng lúc vào hàm tính toán sát thương & phòng thủ cốt lõi `w1()` trong `app.js`:
     - Tầng 1: Đả thông Kinh Mạch (HP, MP, Công kích, Bạo kích, Kháng 5 hệ, Tốc độ, Kháng choáng/độc).
     - Tầng 2: Linh Thú / Đồng hành bị động (Tăng HP, Bạo kích, Tốc chạy, Bán kính hút nhặt đồ).
     - Tầng 3: Nộ chiêu Đồng hành (Xuyên thấu bạo phát, Miễn thương/Hộ thể, Giảm công địch, Bạo kích chí mạng).
2. **Kích hoạt thực tế tỉ lệ rơi Mảnh Hoàng Kim (`Ud`)**:
   - Gắn biến `window.__hkDropBoost` vào công thức rơi mảnh HKMP trong `app.js`, gia tăng tỉ lệ rơi mảnh Hoàng Kim khắp toàn bộ các bản đồ dã ngoại và khiêu chiến.
3. **Mở Hồng Bao & Đại Hồng Bao Offline 100% (`md`)**:
   - Viết lại hàm mở bao lì xì nội bộ `md(n, t)` trong `app.js`. Người chơi có thể mua và mở trực tiếp trong hành trang nhận từ 10 vạn đến 1.000 vạn Lượng và 100 đến 1.000 KNB kèm hiệu ứng jackpot và thông báo giang hồ rực rỡ, hoàn toàn không bị lỗi mạng hay yêu cầu đăng nhập máy chủ.
4. **Đồng bộ các nút bấm UI gốc (`#u20mail`, `#u20rps`, `#rtPlay`)**:
   - Nút thư tín và Oản tù tì trên thanh menu điều khiển của game gốc được kết nối trực tiếp vào Hộp Thư Offline và Sòng Bạc Offline, tự động hiển thị số thư chưa đọc ngay trên icon phong bì.
5. **Tối ưu hóa Action Ribbon 11 nút**:
   - Thiết lập cuộn ngang cảm ứng và con lăn chuột (`wheel` event), chống co giật hoặc vỡ layout trên mọi độ phân giải màn hình PC và điện thoại.
6. **Thư tín động vinh danh thành tựu**:
   - Tự động chuyển phát thư kèm quà tặng đến Hộp Thư khi đạt chuỗi 5 ván thắng Oản Tù Tì hoặc chinh phục các mốc tầng 25, 50, 100 của Thông Thiên Tháp.

---

## 10. Cách Khởi Động Trò Chơi

### Cách 1 (Khuyên dùng - Nhanh nhất trên Windows):
- Nhấp đúp chuột vào file `start_game.bat`.
- Trình duyệt sẽ tự động mở trang game tại địa chỉ `http://localhost:8080/`.

### Cách 2 (Dùng lệnh):
- Mở terminal trong thư mục `volamidle-offline`:
  ```bash
  node server.mjs
  ```
- Mở trình duyệt và truy cập `http://localhost:8080/`.

