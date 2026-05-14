# Task R1-01: Implement Multiple-Choice UI and State Logic

**Requirement:** R1, R2, R3 — Question Classification, User Interface, and Scoring Logic
**Status:** pending
**Priority:** P1
**Estimated Effort:** 2h
**Dependencies:** None
**Spec:** specs/multiple-choice-support/

## Objective

Nâng cấp giao diện làm bài thi (QuestionCard) và logic điều khiển trạng thái (ExamView) để hỗ trợ hoàn chỉnh các câu hỏi có nhiều đáp án đúng (Multiple-Response) mà không làm ảnh hưởng đến các câu hỏi 1 đáp án (Single-Response).

## Constraints

- **MUST**: Preserve existing IndexedDB data schemas (`answers` array).
- **MUST**: Fallback to radio buttons and single-select logic for questions with only 1 correct answer.
- **MUST NOT**: Add partial scoring. Points are only awarded if the user matches all correct options perfectly.

## Implementation Steps

- [x] 1. Cập nhật giao diện QuestionCard
  - [x] 1.1 Tính toán phân loại câu hỏi (Classification)
    - Tính toán `correctCount = question.options.filter(o => o.isCorrect).length`.
    - Xác định `isMultipleChoice = correctCount > 1`.
    - _Requirements: 1.1_
  - [x] 1.2 Hiển thị hướng dẫn chọn đáp án (Instruction)
    - Nếu `isMultipleChoice === true`, render dòng text nhỏ cạnh câu hỏi để hướng dẫn user (vd: `<span className="text-sm font-semibold text-orange-600">(Choose {correctCount})</span>`).
    - _Requirements: 1.2_
  - [x] 1.3 Chuyển đổi Input (Radio vs Checkbox)
    - Trong vòng lặp render options, nếu `isMultipleChoice`, render `<input type="checkbox">` với style Tailwind tương ứng (bo góc nhẹ thay vì bo tròn hoàn toàn).
    - Nếu không, giữ nguyên `<input type="radio">`.
    - Giữ nguyên các trạng thái `disabled`, `checked`, và logic CSS màu sắc (xanh/đỏ khi evaluated).
    - _Requirements: 2.1, 2.3_

- [x] 2. Cập nhật logic điều khiển trạng thái ở ExamView
  - [x] 2.1 Refactor hàm handleOptionChange
    - Tính `isMultipleChoice` của câu hỏi hiện tại.
    - Nếu là Single-Response: gán đè state bằng `[optionId]` (như hiện tại).
    - Nếu là Multiple-Response: kiểm tra xem `optionId` đã có trong mảng `currentAnswers` chưa. Nếu có thì xóa ra (toggle off), nếu chưa thì thêm vào (toggle on).
    - _Requirements: 2.2, 2.4, 3.1_

- [x] 3. Test coverage for R1, R2, R3
  - [x] 3.1 Unit tests for QuestionCard
    - Cập nhật test case cũ hoặc thêm mới để verify DOM render ra `checkbox` khi mock data có 2 option đúng, và `radio` khi có 1 option đúng.
    - _Requirements: 2.1, 2.3_
  - [x]* 3.2 Integration tests
    - Mô phỏng hành vi click 2 checkbox liên tiếp xem `onOptionChange` có đẩy mảng gồm 2 phần tử lên không.
    - _Requirements: 2.2_

## Related Files

| Path | Action | Description |
|---|---|---|
| `src/features/exam/components/QuestionCard.tsx` | Modify | Update to render checkbox and instruction |
| `src/features/exam/components/ExamView.tsx` | Modify | Update handleOptionChange to toggle arrays |
| `src/features/exam/components/QuestionCard.test.tsx` | Modify | Add tests for multiple choice render |

## Completion Criteria

- [ ] Câu hỏi có nhiều đáp án đúng hiển thị checkbox và chữ (Choose X).
- [ ] Câu hỏi 1 đáp án hiển thị radio button bình thường.
- [ ] Chọn nhiều checkbox sẽ gom đúng ID vào state mảng và lưu vào DB.
- [ ] Hàm chấm điểm báo đúng khi chọn chính xác tất cả các đáp án (không được sửa logic `calculateScore` cũ).

## Verification & Evidence

- [ ] Automated verification
  - Command(s): `npm run test`
  - Expected proof: All tests pass, including new checkbox rendering tests.
- [ ] Artifact / runtime verification
  - Inspect: Giao diện bài thi thực tế trên trình duyệt (Exam Dashboard -> Practice Mode).
  - Expect: Thấy rõ sự phân biệt giữa checkbox và radio tuỳ thuộc vào câu hỏi.
- [ ] Contract / negative-path verification
  - Check: Click 1 đáp án của câu multiple-choice sau đó submit bài.
  - Expect: Điểm không được cộng (đúng logic không chấm điểm thành phần).

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Lỗi CSS do chuyển từ radio sang checkbox (dị dạng UI) | Low | Sử dụng class utility có sẵn, đảm bảo `appearance-none` hoạt động đúng cho checkbox. |
| User chọn số lượng đáp án nhiều hơn quy định | Medium | Dù không cấm triệt để, nhưng logic chấm điểm luôn đánh trượt nếu số lượng chọn vượt/không khớp `correctCount`. Có thể thêm disable logic nếu dư thời gian, hiện tại UI không bắt buộc. |
