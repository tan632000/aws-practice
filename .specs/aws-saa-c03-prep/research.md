# Research & Design Decisions

## Summary
- **Feature**: `aws-saa-c03-prep`
- **Discovery Scope**: New Feature (Full Discovery)
- **Key Findings**:
  - The system is for a single user without authentication. Therefore, `localStorage` or `IndexedDB` is sufficient for tracking exam progress and storing the question bank.
  - SAA-C03 mock exams require 130 minutes for 65 questions. Session state needs to be persisted so closing the tab does not lose progress.
  - The crawler can be a standalone Node.js script (using `puppeteer` or `cheerio`/`axios`) that outputs a static `questions.json` file. The web application can load this JSON file on startup, avoiding the need for a complex backend server.

## Validation Log

### Session 1 — 2026-05-13
- Questions asked: 3

1. Rủi ro mất dữ liệu tiến độ (IndexedDB Data Loss)
   - Options: A (Export/Import thủ công) | B (Bỏ qua rủi ro)
   - Answer: A
   - Rationale: Cho phép người dùng chủ động sao lưu lịch sử thi, khắc phục nhược điểm mất dữ liệu khi trình duyệt bị xóa cache mà không cần hệ thống backend phức tạp.

2. Chiến lược Cào dữ liệu (Crawler Maintenance)
   - Options: A (Tách file cấu hình selectors.json) | B (Hard-code)
   - Answer: A
   - Rationale: Giúp việc bảo trì dễ dàng hơn khi web nguồn thay đổi giao diện, không cần chạm vào logic script Node.js.

3. Khung giao diện (UI Framework)
   - Options: A (React + Vite + TypeScript) | B (Next.js)
   - Answer: A
   - Rationale: Đảm bảo ứng dụng SPA siêu nhẹ, tốc độ build nhanh, hoàn hảo cho ứng dụng offline hoàn toàn.

#### Confirmed Decisions
- Thêm tính năng Export/Import JSON cho lịch sử bài thi.
- Crawler sử dụng file `selectors.json` độc lập để cấu hình.
- Ứng dụng Frontend sử dụng React + Vite + TypeScript.

#### Follow-up Actions
- [x] Cập nhật `requirements.md` để bổ sung tính năng Export/Import dữ liệu và cấu hình Crawler.
- [x] Cập nhật `design.md` để bổ sung `selectors.json` vào luồng Crawler và thêm tính năng Export/Import.

## Research Log

### Local Storage vs IndexedDB
- **Context**: Need to store progress, exam history, and current session state.
- **Findings**: `localStorage` has a typical limit of 5MB. Storing a few thousand questions (with explanations) might exceed 5MB. `IndexedDB` offers significantly larger storage limits (hundreds of MBs to GBs).
- **Implications**: The web app should fetch the `questions.json` and store the question bank and history in `IndexedDB` (using a wrapper like `idb` or `dexie`) to prevent quota exceeded errors.

### Crawler Strategy
- **Context**: How to extract questions from external sources.
- **Findings**: Many certification sites use SPA (Single Page Application) rendering, which means raw HTML scraping (`cheerio`) might not work. A headless browser like `Puppeteer` or `Playwright` is more reliable for dynamic content extraction.
- **Implications**: The job crawler will be implemented as a Node.js script using `Puppeteer`.

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Full Stack (React + Node + DB) | Client-server architecture with a local database (SQLite/PostgreSQL) | Robust, easy to extend | Overkill for a single-user offline app | Rejected due to unnecessary complexity |
| Serverless / Static + IndexedDB | React SPA that fetches a static `questions.json` and uses `IndexedDB` | Very fast, offline capable, no backend to manage | Browser data can be cleared | Selected. Best fit for single-user requirement |

## Design Decisions

### Decision: Client-Side Only Architecture
- **Context**: The app is for a single user and does not require auth.
- **Selected Approach**: A React SPA (built with Vite) that runs completely in the browser. It consumes a static JSON file containing the question bank.
- **Rationale**: Simplifies deployment and usage. The user just opens the app.
- **Trade-offs**: If the browser clears site data, progress is lost. (Mitigated by manual Export/Import feature).

## Risks & Mitigations
- Risk 1: Browser clears `IndexedDB` data resulting in lost progress — Mitigation: Implement a JSON export/import function for manual backup.
- Risk 2: Crawler breaks due to target site UI changes — Mitigation: Make the crawler script modular with explicit CSS selectors stored in `selectors.json`.
