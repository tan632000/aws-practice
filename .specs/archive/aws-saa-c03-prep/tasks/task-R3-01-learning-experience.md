# Task R3-01: Learning Experience & Immediate Feedback

**Requirement:** R3 — Learning Experience & Immediate Feedback
**Status:** done
**Priority:** P2
**Estimated Effort:** 2 hours
**Dependencies:** tasks/task-R2-01-mock-exam-engine.md
**Spec:** specs/aws-saa-c03-prep/

## Objective

Build the "Practice Mode" UI components that provide immediate feedback on correctness, detailed explanations, and tips to improve learning efficiency.

## Constraints

- **MUST**: Visually differentiate correct (green) and incorrect (red) answers immediately after submission in practice mode.
- **SHOULD**: Use markdown rendering for explanations if they contain formatting.

## Implementation Steps

- [x] 1. Immediate Evaluation UI
  - [x] 1.1 Correct/Incorrect Highlights
    - Sau khi user bấm Submit một câu (trong chế độ luyện tập), tô xanh đáp án đúng và bôi đỏ đáp án sai mà user đã chọn.
    - _Requirements: 3.1_

- [x] 2. Explanations and Tricks
  - [x] 2.1 Display Explanation
    - Render text `explanation` nằm dưới block câu hỏi sau khi evaluate.
    - _Requirements: 3.2_
  - [x] 2.2 Trick Toggle Button
    - Kiểm tra nếu `trick` có tồn tại trong data câu hỏi, hiển thị nút "Show Trick".
    - Khi click, toggle hiển thị nội dung `trick`.
    - _Requirements: 3.3, 3.4_

- [x] 3. Test coverage for R3
  - [x] 3.1 Unit tests
    - Test component QuestionCard đảm bảo render đúng màu khi truyền state `evaluated`.
    - _Requirements: 3.1_

## Related Files

| Path | Action | Description |
|---|---|---|
| `src/features/exam/components/QuestionCard.tsx` | Modify | Thêm logic highlight đúng/sai |
| `src/features/exam/components/FeedbackPanel.tsx` | Create | Hiển thị Explanation và Trick |

## Completion Criteria

- [x] User thấy ngay lập tức màu xanh/đỏ phản hồi kết quả câu mình vừa chọn.
- [x] Phần giải thích được hiển thị rõ ràng bên dưới đáp án.
- [x] Nút "Show Trick" hoạt động ẩn/hiện mẹo giải quyết câu hỏi.

## Verification & Evidence

- [x] Automated verification
  - Command(s): `npm run typecheck`
  - Expected proof: Pass type check.
- [x] Artifact / runtime verification
  - Inspect: UI chế độ luyện tập (Practice Mode).
  - Expect: Click trả lời -> Hiện xanh/đỏ -> Hiện giải thích.
- [x] Contract / negative-path verification
  - Check: Render một câu hỏi KHÔNG có trường `trick`.
  - Expect: Nút "Show Trick" hoàn toàn không xuất hiện trên DOM.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Dữ liệu explanation bị dính HTML tags từ trang gốc | Medium | Sử dụng thư viện sanitize-html để chống XSS hoặc chỉ lưu plain text |
