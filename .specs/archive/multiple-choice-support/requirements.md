# Requirements Document

## Introduction
Dự án hiện tại đã có bộ khung `ExamEngine`, lưu trữ `QuestionSchema` và giao diện `QuestionCard` hỗ trợ làm bài thi. Tuy nhiên, giao diện hiện tại đang fix cứng input là `radio` button, dẫn đến việc người dùng không thể chọn nhiều đáp án cho các câu hỏi Multiple Response (chọn 2 hoặc 3 đáp án đúng). Các yêu cầu dưới đây tập trung vào việc nâng cấp UI và logic điều khiển để hỗ trợ trọn vẹn dạng câu hỏi này.

## Project Description (Input)
Khi làm bài thi tôi phát hiện các câu hỏi chưa hỗ trợ chọn multiple answer

## Requirements

### 1. Phân loại câu hỏi (Question Classification)
- **1.1** `While` a question has more than one correct answer, `the system shall` identify it as a multiple-response question.
- **1.2** `While` a question is identified as a multiple-response question, `the system shall` inform the user about the expected number of correct choices (if this data is available).

### 2. Giao diện người dùng (User Interface)
- **2.1** `While` rendering a multiple-response question, `the system shall` display checkbox inputs instead of radio buttons for the options.
- **2.2** `When` the user clicks on an option of a multiple-response question, `the system shall` toggle its selected state without deselecting other currently selected options.
- **2.3** `While` rendering a single-response question, `the system shall` continue to display radio buttons.
- **2.4** `When` the user selects an option on a single-response question, `the system shall` select the new option and automatically deselect any previously selected option.

### 3. Logic chấm điểm & Lưu trữ (Scoring & Storage)
- **3.1** `The system shall` maintain the selected array of option IDs for multiple-response questions in the active session storage.
- **3.2** `When` evaluating a multiple-response question, `the system shall` mark it as correct only if the user's selected options exactly match all the correct options (no partial credit).
*(Ghi chú: Logic chấm điểm hiện tại đã hỗ trợ so khớp mảng, cần đảm bảo không bị ảnh hưởng khi nâng cấp UI).*
