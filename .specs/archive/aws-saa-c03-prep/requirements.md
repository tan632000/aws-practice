# Requirements Document

## Introduction
Hệ thống web học và ôn luyện chứng chỉ AWS CERTIFIED SOLUTIONS ARCHITECT – ASSOCIATE (SAA-C03). 
Dự án được xây dựng mới hoàn toàn (Greenfield) với mục tiêu phục vụ một người dùng duy nhất luyện thi, ứng dụng các kĩ thuật crawl dữ liệu và mô phỏng chính xác bài thi 65 câu hỏi.

## Requirements

### Requirement 1: Data Crawling & Management (Job crawl)
**Objective:** As a system owner, I want to automatically fetch question data, so that I always have a rich, up-to-date AWS SAA-C03 question bank to practice with.

#### Acceptance Criteria
1.1 The Job Crawler shall fetch question text, options, correct answers, and explanations from the specified target source.
1.2 When the crawling job completes, the Database Engine shall save only the unique new questions into the local database to avoid duplicates.
1.3 If the source website is unreachable or times out, the Job Crawler shall log an error message and gracefully exit without crashing.
1.4 The Job Crawler shall extract embedded tips/tricks (if available in the source) and associate them with the respective question record.
1.5 The Job Crawler shall read target CSS selectors from an external `selectors.json` configuration file rather than hardcoding them.

### Requirement 2: Mock Exam Engine
**Objective:** As a learner, I want to simulate real exam conditions and choose specific mock exams or random practice, so that I can evaluate my readiness for the SAA-C03 exam effectively.

#### Acceptance Criteria
2.1 When the user views the Dashboard, the UI shall display the 6 available Mock Exams (Mock 1 to 6) as individual selectable options.
2.2 When the user views the Dashboard, the UI shall also display an option for a "Random Practice Exam".
2.3 When the user starts a specific Mock Exam, the Exam Engine shall load the exact 65 questions associated with that specific mock exam dataset.
2.4 When the user starts a "Random Practice Exam", the Exam Engine shall randomly select exactly 65 questions from the local database.
2.5 When a mock or practice exam begins, the Exam Engine shall start a countdown timer initialized to 130 minutes (standard SAA-C03 exam time).
2.6 While the exam is in progress, the Exam Engine shall allow the user to select one or multiple options depending on the specific question's requirements.
2.7 While the exam is in progress, the Exam Engine shall allow the user to mark a question for later review.
2.8 When the user clicks "Submit Exam" or the timer reaches 00:00, the Exam Engine shall immediately stop the exam, calculate the final score, and display the result summary.

### Requirement 3: Learning Experience & Immediate Feedback
**Objective:** As a learner, I want to see detailed explanations and tricks immediately after answering, so that I understand why an answer is correct or wrong and learn efficiently.

#### Acceptance Criteria
3.1 When the user submits an answer for a question in "Practice Mode", the UI shall immediately visually indicate whether the selected answer is correct or incorrect.
3.2 When an answer is evaluated, the UI shall display the detailed explanation for all options below the question.
3.3 Where a "trick/tip" is available for a question, the UI shall display a "Show Trick" button.
3.4 When the user clicks the "Show Trick" button, the UI shall reveal the specific tip/trick to solve the question faster.

### Requirement 4: Progress Tracking
**Objective:** As a learner, I want to track my learning progress without logging in, so that I can monitor my improvement over time efficiently.

#### Acceptance Criteria
4.1 When an exam session ends, the Progress Tracker shall save the final score, completion time, and date to the local storage (or local DB).
4.2 The Dashboard shall display a history list of all completed mock exams with their respective scores and dates.
4.3 The Dashboard shall display the overall average score and the total number of unique questions answered by the user.
4.4 The Dashboard shall provide an Export button to download the user's exam history as a JSON file, and an Import button to restore it.

## Non-Functional Requirements

### Requirement 5: Performance & Scalability
**Objective:** As a user, I want the system to be fast and responsive, so that my practice session is not interrupted by loading screens.

#### Acceptance Criteria
5.1 The Web Interface shall render the next question in the exam flow within 200 milliseconds.
5.2 The Job Crawler shall process and insert at least 10 questions per second during the data extraction and saving phase.

### Requirement 6: Reliability & Availability
**Objective:** As a user, I want the system to handle unexpected situations gracefully, so that I don't lose my exam progress if something goes wrong.

#### Acceptance Criteria
6.1 If the user reloads or closes the browser tab during an active exam, the Exam Engine shall save the current session state (current question, selected answers, and remaining time) to local storage.
6.2 When the user reopens the application after an interruption, the Exam Engine shall offer a prompt to resume the incomplete exam session from where they left off.
