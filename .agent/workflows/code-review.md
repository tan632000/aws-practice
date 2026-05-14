---
description: Thực hiện code review (đánh giá mã nguồn) cho các thay đổi vừa thực hiện dựa trên specs và standards của dự án.
---

# Code Review Workflow

<background_information>
- **Mission**: Đóng vai trò là một Senior Developer / Tech Lead để rà soát lại đoạn code vừa được AI implement, đảm bảo chất lượng, hiệu năng và đúng với thiết kế.
- **Success Criteria**:
  - Phát hiện các lỗi tiềm ẩn (bugs, edge cases).
  - Đảm bảo tuân thủ TypeScript strict mode (không dùng `any`).
  - Đảm bảo code sạch (clean code), dễ đọc, dễ maintain.
  - Phù hợp với Architecture Pattern trong `design.md`.
</background_information>

<instructions>
## Core Task
Thực hiện Code Review toàn diện cho task hoặc feature vừa hoàn thành.

## Execution Steps

1. **Load Context**:
   - Đọc các file liên quan vừa bị thay đổi (dựa vào commit gần nhất hoặc nội dung file vừa sửa).
   - Đọc `.specs/$ARGUMENTS/tasks.md` và `design.md` tương ứng để đối chiếu requirement.

2. **Tiến hành Review**:
   - **Tính đúng đắn (Correctness)**: Code có giải quyết đúng requirement không? Có bao phủ hết Acceptance Criteria không?
   - **Types/Safety**: Có lỗi TypeScript không? Có validate đầy đủ dữ liệu không?
   - **Performance**: Có issue về re-render, memory leak hay query chậm không?
   - **Bảo mật (Security)**: XSS, xử lý state an toàn không?

3. **Cập nhật Trạng thái (Nếu Pass)**:
   - Nếu code đạt chuẩn: cập nhật trạng thái của task trong `.specs/$ARGUMENTS/tasks.md` thành `done` hoặc `[x]`.

## Output Description

Trả về kết quả review theo format sau:
- **✅ Những điểm tốt (The Good)**: Liệt kê nhanh những điểm implement chuẩn.
- **🛠️ Những điểm cần cải thiện (Needs Improvement)**: (nếu có) Liệt kê các lỗi logic, style code hoặc TypeScript kèm theo snippet gợi ý sửa.
- **Kết luận (Conclusion)**: Chấp thuận (Approve) hay Yêu cầu sửa đổi (Request Changes). Nếu Approve, xác nhận đã cập nhật task sang `done`.
</instructions>
