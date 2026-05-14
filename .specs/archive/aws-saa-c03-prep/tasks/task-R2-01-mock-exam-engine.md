# Task R2-01 (P): Mock Exam Engine & Reliability

**Requirement:** R2 — Mock Exam Engine
**Status:** done
**Priority:** P1
**Estimated Effort:** 4 hours
**Dependencies:** tasks/task-R0-01-project-setup.md
**Spec:** specs/aws-saa-c03-prep/

## Objective

Develop the core exam engine that loads questions, handles the 130-minute timer, manages user selections, and ensures session auto-saving for reliability.

## Constraints

- **MUST**: Pull questions from IndexedDB (after fetching `questions.json`).
- **MUST**: Strictly enforce 65 questions randomly selected.
- **MUST**: Auto-save session state on every interaction.

## Implementation Steps

- [x] 1. Question Bank Initialization
  - [x] 1.1 Load JSON to DB
    - Viết hook `useQuestionBank` để fetch `data/questions.json` (nếu có) và import vào Dexie `questions` table khi app khởi động lần đầu.
    - _Requirements: 2.1_
  - [x] 1.2 Random Exam Generator
    - Lấy 65 câu hỏi ngẫu nhiên từ DB. Tạo bản ghi trong `activeSession`.
    - _Requirements: 2.1_

- [x] 2. Exam Lifecycle & Timer
  - [x] 2.1 Implement Countdown Timer
    - Viết hook/component đếm ngược 130 phút (7800 giây).
    - Khi hết giờ (00:00), tự động trigger submit exam.
    - _Requirements: 2.2, 2.5_
  - [x] 2.2 Submit and Score Logic
    - So sánh `answers` của user với `isCorrect` trong `questions` list.
    - Tính điểm (Score). Nếu điểm > 72% -> Passed. Dọn dẹp `activeSession`.
    - _Requirements: 2.5_

- [x] 3. User Interaction & Auto-Save
  - [x] 3.1 Question Navigation & Selection
    - Cho phép chọn 1 hoặc nhiều options (radio/checkbox tùy cấu trúc option).
    - Cho phép toggle cờ `Mark for Review`.
    - _Requirements: 2.3, 2.4_
  - [x] 3.2 Auto-Save Session
    - Mỗi lần user chọn answer hoặc đánh dấu, update bảng `activeSession` trong Dexie.
    - _Requirements: 6.1_
  - [x] 3.3 Resume Interrupted Exam
    - Khi app load lại, nếu có dữ liệu trong `activeSession`, hiển thị prompt: "Tiếp tục bài thi đang dở?".
    - Nếu chọn Yes, load lại state và thời gian còn lại.
    - _Requirements: 6.2_

- [x] 4. Test coverage for R2 & R6
  - [x] 4.1 Unit tests
    - Test hàm random picker đảm bảo trả về đúng 65 câu.
    - Test hàm chấm điểm (Scoring logic) với đáp án đúng/sai.
    - _Requirements: 2.1, 2.5_

## Related Files

| Path | Action | Description |
|---|---|---|
| `src/features/exam/ExamEngine.ts` | Create | Core logic quản lý session |
| `src/features/exam/hooks/useTimer.ts` | Create | Hook đếm giờ |
| `src/features/exam/components/ExamView.tsx` | Create | Giao diện làm bài thi |

## Completion Criteria

- [x] Bài thi luôn bắt đầu với chính xác 65 câu và đếm ngược từ 130:00.
- [x] Chọn đáp án hoặc refresh lại trang, bài thi không bị mất dữ liệu (vẫn giữ nguyên câu đang làm và thời gian).
- [x] Bấm Nộp bài trả về điểm số tính toán chính xác.

## Verification & Evidence

- [x] Automated verification
  - Command(s): `npm run test` (chạy Unit tests phần scoring)
  - Expected proof: Pass toàn bộ test cases.
- [x] Artifact / runtime verification
  - Inspect: Giao diện `/exam`.
  - Expect: Thấy timer đếm ngược, chọn đáp án xong F5 lại trang vẫn còn đáp án đã chọn.
- [x] Contract / negative-path verification
  - Check: Chỉnh thời gian timer về 0 (qua DevTools hoặc logic).
  - Expect: Hệ thống tự động block và submit bài thi ngay lập tức.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Đồng hồ bị lệch do setInterval delay | Medium | Lưu startTime và tính remainingSeconds dựa trên `Date.now() - startTime` thay vì trừ dần thủ công |
