# Task R4-01: Progress Tracking & Data Portability

**Requirement:** R4 — Progress Tracking
**Status:** pending
**Priority:** P2
**Estimated Effort:** 3 hours
**Dependencies:** tasks/task-R2-01-mock-exam-engine.md
**Spec:** specs/aws-saa-c03-prep/

## Objective

Build the Dashboard to display the user's exam history, calculate overall learning statistics, and implement manual data export/import capabilities to prevent data loss.

## Constraints

- **MUST**: Read history data exclusively from IndexedDB.
- **MUST**: Generate a valid JSON file for the export feature containing `history` and `activeSession`.
- **MUST**: Validate the schema of the uploaded JSON file before importing.

## Implementation Steps

- [ ] 1. Save and Retrieve History
  - [ ] 1.1 Persist Exam Result
    - Khi submit bài thi ở R2, lưu object `ExamHistory` (gồm ID bài thi, Date, Score, Time Spent, Total Questions) vào bảng `history` của Dexie.
    - _Requirements: 4.1_

- [ ] 2. Dashboard UI & Statistics
  - [ ] 2.1 History Table
    - Render một danh sách/bảng liệt kê tất cả các bài thi đã hoàn thành, xếp theo ngày mới nhất lên đầu.
    - _Requirements: 4.2_
  - [ ] 2.2 Global Statistics
    - Tính toán và hiển thị điểm số trung bình (Average Score) và tổng số câu hỏi đã làm.
    - _Requirements: 4.3_

- [ ] 3. Data Export & Import
  - [ ] 3.1 Export Feature
    - Lấy toàn bộ dữ liệu từ bảng `history` (và `activeSession` nếu cần), parse thành JSON string.
    - Tạo Blob và trigger auto-download file `aws_prep_backup.json` cho user.
    - _Requirements: 4.4_
  - [ ] 3.2 Import Feature
    - Tạo input type file để user upload `aws_prep_backup.json`.
    - Đọc file bằng FileReader, parse JSON, và ghi đè/merge vào Dexie DB.
    - _Requirements: 4.4_

- [ ] 4. Test coverage for R4
  - [ ] 4.1 Unit tests
    - Test hàm tính toán Average Score.
    - _Requirements: 4.3_
  - [ ] 4.2 Integration tests
    - Giả lập import file JSON rỗng hoặc sai format để kiểm tra validation.
    - _Requirements: 4.4_

## Related Files

| Path | Action | Description |
|---|---|---|
| `src/features/dashboard/Dashboard.tsx` | Create | Trang chính hiển thị lịch sử |
| `src/lib/dataSync.ts` | Create | Logic cho Export/Import |

## Completion Criteria

- [ ] Người dùng thấy điểm số của mình hiển thị ở trang Dashboard sau khi làm xong một đề.
- [ ] Bấm Export sẽ tải về một file `.json` chứa data lịch sử.
- [ ] Xóa lịch sử trình duyệt, sau đó dùng file `.json` đã tải để Import sẽ khôi phục lại toàn bộ dữ liệu ở Dashboard.

## Verification & Evidence

- [ ] Automated verification
  - Command(s): `npm run typecheck`
  - Expected proof: Pass type check.
- [ ] Artifact / runtime verification
  - Inspect: Truy cập route `/` (Dashboard).
  - Expect: Hiển thị các block thống kê, bảng lịch sử và nút Export/Import.
- [ ] Contract / negative-path verification
  - Check: Thử upload một file text không phải JSON.
  - Expect: Hệ thống báo lỗi "Invalid backup file" và không làm crash app hay hỏng DB hiện tại.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Import đè mất dữ liệu hiện tại nếu user không để ý | High | Hiển thị cảnh báo xác nhận (Confirm modal) "Hành động này sẽ ghi đè lịch sử hiện tại, bạn có chắc chắn?" trước khi thực thi |
