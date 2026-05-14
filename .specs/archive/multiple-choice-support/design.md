# Design Document: Multiple Choice Support

---
**Purpose**: Provide sufficient detail to ensure implementation consistency across different implementers, preventing interpretation drift.

**Approach**:
- Include essential sections that directly inform implementation decisions
- Omit optional sections unless critical to preventing implementation errors
- Match detail level to feature complexity
- Use diagrams and tables over lengthy prose
---

## Overview 
**Purpose**: This feature delivers the ability to answer questions with multiple correct options (Multiple-Response) to the AWS SAA-C03 exam takers.
**Users**: Exam takers will utilize this for questions that require selecting 2 or more correct options, accurately mirroring the real AWS exam experience.
**Impact**: Changes the current `QuestionCard` and `ExamView` state logic to support both single-radio selection and multiple-checkbox toggling based on the question's correct answer count.

### Goals
- Automatically detect multiple-response questions from the existing `QuestionSchema`.
- Display checkboxes and instructional text (e.g., "Choose 2") for multiple-response questions.
- Update the active session state correctly (toggling IDs instead of overwriting) without breaking single-response radio questions.

### Non-Goals
- Changing the underlying data JSON schema or IndexedDB structure (the database already stores answers as an array of strings).
- Adding partial scoring (AWS exams award 0 points unless all required options are correctly selected, which is already handled by the current engine).

## Architecture

### Existing Architecture Analysis
The application is a React SPA where the entire exam JSON (including which options are correct) is loaded into the client's `ExamSession`. 
- `ExamView.tsx` manages the `currentAnswers` array state for the current question.
- `QuestionCard.tsx` renders the question and options. Currently, `input type="radio"` is hardcoded, and `ExamView` hardcodes replacing the `currentAnswers` array with `[optionId]`.

### Architecture Pattern & Boundary Map
**Architecture Integration**:
- Selected pattern: Minimal UI State update.
- Existing patterns preserved: The data contracts (`QuestionSchema`, `ExamSession`) remain completely untouched. IndexedDB `answers` schema (`Record<string, string[]>`) is already perfectly designed to hold multiple strings.

### Technology Stack
| Layer | Choice / Version | Role in Feature | Notes |
|-------|------------------|-----------------|-------|
| Frontend | React + TailwindCSS | UI Rendering | Pure functional component changes |

## Canonical Contracts & Invariants

| Contract Area | Canonical Decision | Applies To | Must Stay Consistent In |
|---------------|--------------------|------------|-------------------------|
| Data / persistence | `answers` array in IndexedDB must store all selected option IDs. | Client SPA | `ExamView.tsx` state updates |

## Requirements Traceability

| Requirement | Summary | Components | Interfaces |
|-------------|---------|------------|------------|
| 1.1, 1.2 | Question Classification (identify multiple correct options) | `ExamView`, `QuestionCard` | `QuestionSchema` |
| 2.1, 2.3 | UI toggling (Checkbox vs Radio) | `QuestionCard` | Component props |
| 2.2, 2.4 | Selection Logic (Toggle vs Overwrite) | `ExamView` | `handleOptionChange` |
| 3.1, 3.2 | Scoring & Storage | `ExamEngine` | `calculateScore` (No change needed) |

## Components and Interfaces

### Frontend Layer

#### ExamView

| Field | Detail |
|-------|--------|
| Intent | Manages the exam session state and orchestrates user inputs |
| Requirements | 1.1, 2.2, 2.4 |

**Responsibilities & Constraints**
- Determine if the current question is multiple-choice by calculating `const correctCount = currentQuestion.options.filter(o => o.isCorrect).length;`.
- Pass `isMultipleChoice` (or `correctCount`) down to `QuestionCard`.
- In `handleOptionChange(optionId: string)`, if `isMultipleChoice` is true, toggle the `optionId` within the `currentAnswers` array. If false, overwrite the array with `[optionId]`.

#### QuestionCard

| Field | Detail |
|-------|--------|
| Intent | Renders the question, options, and feedback |
| Requirements | 1.2, 2.1, 2.3 |

**Responsibilities & Constraints**
- Accept new prop `correctCount` or `isMultipleChoice`.
- If `correctCount > 1`, display an instruction e.g. `<span className="text-sm font-semibold text-orange-600">(Choose {correctCount})</span>` next to the question text.
- Render `<input type="checkbox">` if `isMultipleChoice`, otherwise `<input type="radio">`.
- Apply appropriate Tailwind styling to distinguish the checkbox visually (e.g. rounded squares instead of full circles).

**Implementation Notes**
- Ensure `disabled` states and evaluation styling (green/red backgrounds) still work identically for checkboxes.

## Data Models

**No Data Model Changes**: 
The existing IndexedDB schema and `ExamSession` interface already type `answers` as `Record<string, string[]>`, which natively supports both single and multiple selections. The existing `calculateScore` in `ExamEngine.ts` uses `selectedOptions.length === correctOptions.length && selectedOptions.every(id => correctOptions.includes(id))`, which correctly evaluates multiple choices without modification.

## Testing Strategy
- Unit Tests: Verify `QuestionCard` renders checkboxes when `correctCount > 1`.
- Integration Tests: Verify clicking multiple checkboxes correctly populates the array in `ExamView` state.

## Security Considerations
- Purely internal UI changes. No security impact.

## Performance & Scalability
- No impact. The `filter` operation to count correct options operates on arrays of typically 4-6 items and takes negligible time.
