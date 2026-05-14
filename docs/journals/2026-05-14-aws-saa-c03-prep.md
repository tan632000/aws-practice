# Technical Journal: AWS SAA-C03 Prep
**Date:** 2026-05-14
**Feature:** aws-saa-c03-prep
**Status:** Completed & Archived

## Overview
Dự án được khởi tạo với mục tiêu xây dựng một nền tảng Web học và ôn luyện chứng chỉ AWS Certified Solutions Architect – Associate (SAA-C03). Ứng dụng hoạt động hoàn toàn dưới dạng Client-side (SPA) không yêu cầu backend phức tạp.

## Key Decisions & Architecture
- **Tech Stack:** React, Vite, TypeScript, TailwindCSS.
- **Data Storage:** Lựa chọn `Dexie.js` (IndexedDB) làm nguồn lưu trữ chính cho `questions`, `activeSession` và `history` để vượt qua giới hạn dung lượng 5MB của LocalStorage và đảm bảo trải nghiệm thi offline trơn tru.
- **Data Crawler:** Xây dựng module Node.js/Puppeteer (`scraper/index.js`) để tự động thu thập bộ câu hỏi.
- **Mock Exam Engine:**
  - Hỗ trợ thi theo cấu trúc đề thi mô phỏng cố định (`exam1.json` - `exam6.json`).
  - Hỗ trợ thi ngẫu nhiên (Random Practice) bốc 65 câu từ ngân hàng DB.
  - Implement JSON Mapper linh hoạt để chuyển đổi format raw data về internal `QuestionSchema`.
  - Bộ đếm ngược tự động nộp bài và lưu tiến độ `activeSession` ngay cả khi tải lại trang.

## Milestones & Impact
1. **Thiết lập Core & DB:** Thiết kế sơ đồ quan hệ cho các phiên làm bài (active session) với khả năng tiếp tục bài làm đang dang dở (Resume Exam).
2. **Giao diện Dashboard trực quan:** Xây dựng giao diện hiển thị danh sách Mock Exam và thống kê kết quả học tập (Exams Taken, Average Score).
3. **Sao lưu dữ liệu:** Implement chức năng Export/Import (JSON) để người dùng có thể dễ dàng backup và di chuyển dữ liệu lịch sử bài làm sang thiết bị khác.

## Future Considerations
- Mở rộng ngân hàng câu hỏi bằng cách cải tiến Crawler job.
- Thêm các tính năng Tips/Tricks riêng cho từng dạng câu hỏi (đã có trong Design, có thể phát triển thêm về mặt UI).
