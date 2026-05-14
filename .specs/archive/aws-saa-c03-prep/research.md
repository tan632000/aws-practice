# Research Log

## Summary
**Scope**: Light Discovery for extending the Exam Engine to support selecting from 6 specific Mock Exams and one Random Practice Exam.
**Key Findings**:
1. The new mock exams (`exam1.json` to `exam6.json`) use a different schema for their questions (`question` instead of `text`, `options` as string array, `correct` as index array). This requires an adapter/mapper function when loading the JSON into the application's `QuestionSchema`.
2. The Dashboard needs to be expanded to show available exams, which can be hardcoded as 6 Mock Exams + 1 Random Practice for simplicity, or fetched from a metadata file.
3. The `ExamSession` needs a `mockId` to track which exam is being taken.

## Investigations

### Topic: JSON Schema Mapping
**Finding**: The application's `QuestionSchema` expects options as objects with `id`, `text`, and `isCorrect`. The new mock exam JSON provides options as an array of strings, and a `correct` array of correct indices.
**Implication**: We need a mapping function in `ExamEngine.ts` to convert the mock JSON format into the application's `QuestionSchema` before initializing the session.

### Topic: Dashboard UI Changes
**Finding**: Dashboard currently only has a single "Start Exam" button.
**Implication**: We need to replace it with a grid of cards for each Mock Exam (1-6) and one for Random Practice. Clicking one should invoke the engine with the specific exam ID.

### Topic: Exam Engine Updates
**Finding**: `startExam()` currently fetches random questions from the DB. 
**Implication**: We should create `startMockExam(mockId: number)` to fetch a specific `/data/exam{mockId}.json`, map the questions, and create the session. We should also rename the old `startExam` to `startRandomPractice()` or similar.
