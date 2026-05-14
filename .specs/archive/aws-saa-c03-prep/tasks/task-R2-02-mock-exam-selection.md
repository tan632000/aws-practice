# Task R2-02: Mock Exam Selection & JSON Mapping

**Requirement:** R2 — Mock Exam Engine
**Status:** done
**Priority:** P1
**Estimated Effort:** 2 hours
**Dependencies:** None
**Spec:** specs/aws-saa-c03-prep/

## Objective

Extend the Exam Engine and Dashboard to support selecting and taking specific mock exams (Mock 1-6) from static JSON files, along with the existing Random Practice mode.

## Constraints

- **MUST**: Map the raw `examX.json` schema (`question`, string `options`, index `correct`) to the app's `QuestionSchema` (`text`, `options` array of objects with `isCorrect`).
- **MUST**: Preserve the exact 65 questions associated with the selected mock exam.
- **MUST NOT**: Overwrite an active session without explicit user confirmation or visual warning.

## Implementation Steps

- [ ] 1. Update Exam Engine
  - [ ] 1.1 Implement JSON Mapper
    - Tạo hàm tiện ích (hoặc logic trực tiếp trong engine) để fetch file `/data/exam{mockId}.json`.
    - Map dữ liệu từ file JSON thô sang `QuestionSchema[]` (chú ý `correct` array chuyển thành cờ `isCorrect` cho từng option).
    - _Requirements: 2.3_
  - [ ] 1.2 Implement `startMockExam` method
    - Hàm nhận tham số `mockId: number`, fetch file tương ứng, tạo `ExamSession` mới, lưu `mockId` vào session để track.
    - _Requirements: 2.3, 2.5, 2.6, 2.7, 2.8_
  - [ ] 1.3 Refactor `startExam` to `startRandomPractice`
    - Cập nhật hàm start hiện tại để rành mạch mục đích là thi ngẫu nhiên.
    - _Requirements: 2.4_

- [ ] 2. Update Dashboard UI
  - [ ] 2.1 Exam Selection Grid
    - Thay thế nút "Start Exam" hiện tại bằng danh sách (hoặc grid) 6 bài Mock Exam và 1 nút cho Random Practice.
    - _Requirements: 2.1, 2.2_
  - [ ] 2.2 Active Session Handling
    - Nếu có active session, hiển thị nút "Resume Exam" nổi bật.
    - _Requirements: 6.2_

- [ ] 3. Update App Routing & Logic
  - [ ] 3.1 Handle `mockId` parameter
    - Cập nhật `App.tsx` hoặc route `/exam` để nhận URL param hoặc state mang thông tin `mockId` từ Dashboard.
    - Kích hoạt `startMockExam(mockId)` hoặc `startRandomPractice()` tương ứng nếu không có session active.
    - _Requirements: 2.3, 2.4_

## Related Files

| Path | Action | Description |
|---|---|---|
| `src/features/exam/ExamEngine.ts` | Modify | Thêm logic mapping và `startMockExam` |
| `src/features/dashboard/Dashboard.tsx` | Modify | UI chọn đề thi |
| `src/App.tsx` | Modify | Xử lý logic route để kích hoạt đúng loại đề thi |
| `src/lib/types.ts` | Modify | Update ExamSession and ExamHistory to include `mockId` |

## Completion Criteria

- [ ] Dashboard hiển thị 6 lựa chọn Mock Exam và 1 tùy chọn Random Practice.
- [ ] Chọn Mock Exam 1 sẽ tải đúng câu hỏi từ `exam1.json`.
- [ ] Tính năng Random Practice vẫn hoạt động lấy ngẫu nhiên 65 câu từ DB.

## Verification & Evidence

- [ ] Automated verification
  - Command(s): `npm run build`
  - Expected proof: Build thành công không lỗi TypeScript.
- [ ] Artifact / runtime verification
  - Inspect: UI Dashboard `/`.
  - Expect: Hiện ra grid các lựa chọn đề thi.
- [ ] Contract / negative-path verification
  - Check: Bấm vào Mock Exam 6 (với `exam6.json` hợp lệ).
  - Expect: Đề thi hiển thị và format câu hỏi không bị lỗi.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Mapping sai format mảng options | Medium | Viết test hoặc log cẩn thận ở bước chuyển đổi `isCorrect` từ mảng `correct` index |
