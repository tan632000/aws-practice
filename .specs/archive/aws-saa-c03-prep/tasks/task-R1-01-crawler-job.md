# Task R1-01 (P): Data Crawling Job

**Requirement:** R1 — Data Crawling & Management
**Status:** done
**Priority:** P1
**Estimated Effort:** 3 hours
**Dependencies:** none
**Spec:** specs/aws-saa-c03-prep/

## Objective

Build a standalone Node.js web crawler using Puppeteer to extract SAA-C03 questions from an external source and save them into a `questions.json` file.

## Constraints

- **MUST**: Read CSS selectors dynamically from an external `selectors.json` file.
- **MUST**: Output a JSON file that matches `QuestionSchema`.
- **MUST NOT**: Hardcode CSS selectors inside the scraping logic.

## Implementation Steps

- [x] 1. Set up Node.js Crawler Project
  - [x] 1.1 Initialize scraper directory
    - Tạo thư mục `scraper/` và cài đặt `puppeteer`.
    - _Requirements: 1.1_
  - [x] 1.2 Create `selectors.json` configuration
    - Tạo cấu trúc JSON chứa các keys mapping cho question title, options, explanation, trick.
    - _Requirements: 1.5_

- [x] 2. Implement Scraping Logic
  - [x] 2.1 Fetch and extract data
    - Sử dụng Puppeteer để mở target URL, dùng `page.evaluate()` kết hợp với cấu hình từ `selectors.json` để trích xuất dữ liệu.
    - Trích xuất text câu hỏi, mảng options (kèm trạng thái đúng/sai), và phần explanation/trick.
    - _Requirements: 1.1, 1.4_
  - [x] 2.2 Error handling and resiliency
    - Bọc logic fetch trong try-catch. Nếu timeout/unreachable, log lỗi ra console và `process.exit(0)` một cách an toàn.
    - _Requirements: 1.3_

- [x] 3. Data Processing and Export
  - [x] 3.1 Deduplicate and Save
    - Lọc các câu hỏi trùng lặp dựa vào Hash của nội dung câu hỏi. Đảm bảo parse > 10 câu/giây (logic xử lý nội bộ Node).
    - Ghi mảng kết quả ra `public/data/questions.json` theo đúng chuẩn `QuestionSchema`.
    - _Requirements: 1.2, 5.2_

- [x] 4. Test coverage for R1
  - [x] 4.1 Unit tests
    - Test hàm lọc trùng lặp với mock data.
    - _Requirements: 1.2_
  - [x] 4.2 Integration tests
    - Chạy scraper với file html local tĩnh để kiểm chứng selector config hoạt động.
    - _Requirements: 1.5_

## Related Files

| Path | Action | Description |
|---|---|---|
| `scraper/package.json` | Create | Config cho job crawl |
| `scraper/selectors.json` | Create | Cấu hình DOM selectors |
| `scraper/index.js` | Create | Logic scraping chính |
| `public/data/questions.json` | Create | Output file |

## Completion Criteria

- [x] Script có thể chạy bằng lệnh `npm run scrape` trong thư mục `scraper`.
- [x] Nếu đổi `selectors.json` thành sai, script không ném unhandled exception mà xử lý và báo thiếu data.
- [x] Output `questions.json` chứa data đúng schema (câu hỏi, options, isCorrect, explanation).

## Verification & Evidence

- [x] Automated verification
  - Command(s): `node scraper/index.js` (hoặc test command)
  - Expected proof: In ra thông báo scrape thành công X câu hỏi.
- [x] Artifact / runtime verification
  - Inspect: `public/data/questions.json`
  - Expect: Chứa cấu trúc JSON mảng các câu hỏi đầy đủ thuộc tính.
- [x] Contract / negative-path verification
  - Check: Tắt mạng và chạy script.
  - Expect: Script in ra log lỗi network và thoát gracefully không bị crash stack trace.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Trang web nguồn dùng Captcha | High | Thêm config delay trong Puppeteer hoặc yêu cầu bấm tay ban đầu |
| Cấu trúc HTML phức tạp | Medium | Cho phép selector config dùng cả JS function dưới dạng text nếu cần (thay vì string đơn thuần) |
