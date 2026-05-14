# Task R0-01: Project Setup & Foundation

**Requirement:** R0 — Foundation & Infrastructure
**Status:** done
**Priority:** P0
**Estimated Effort:** 2 hours
**Dependencies:** none
**Spec:** specs/aws-saa-c03-prep/

## Objective

Set up the base Vite + React + TypeScript project and configure the IndexedDB storage layer using Dexie.js so that feature tasks have a solid foundation to build upon.

## Constraints

- **MUST**: Use Vite and React with strict TypeScript mode.
- **MUST**: Define data schemas mirroring the canonical contracts in `design.md`.
- **SHOULD**: Organize code into features (e.g., `src/features/exam`, `src/features/storage`).
- **MUST NOT**: Build any UI components yet.

## Implementation Steps

- [x] 1. Initialize Frontend Workspace
  - [x] 1.1 Create Vite + React + TS project
    - Chạy lệnh `npm create vite@latest . -- --template react-ts`.
    - Dọn dẹp boilerplate code.
    - _Requirements: 0.0_
  - [x] 1.2 Install core dependencies
    - Cài đặt `dexie`, `react-router-dom` (nếu cần), và các thư viện UI (TailwindCSS nếu có).
    - _Requirements: 0.0_

- [x] 2. Implement Storage Layer
  - [x] 2.1 Define TypeScript Interfaces
    - Khai báo `QuestionSchema`, `ExamSession`, `ExamHistory` theo thiết kế trong `design.md`.
    - _Requirements: 0.0_
  - [x] 2.2 Setup Dexie.js Database
    - Tạo file `src/lib/db.ts` khai báo Dexie instance với các bảng: `questions`, `history`, `activeSession`.
    - Cấu hình index cho các bảng để query nhanh chóng.
    - _Requirements: 5.1_

- [x] 3. Test coverage for R0
  - [x] 3.1 Unit tests
    - Viết test đảm bảo Dexie schema khởi tạo thành công mà không lỗi.
    - _Requirements: 0.0_

## Related Files

| Path | Action | Description |
|---|---|---|
| `package.json` | Modify | Thêm dependencies |
| `src/lib/types.ts` | Create | Canonical interfaces |
| `src/lib/db.ts` | Create | Dexie DB setup |

## Completion Criteria

- [x] Dự án build thành công với TypeScript không báo lỗi (`npm run build`).
- [x] Schema IndexedDB được khởi tạo thành công khi mở ứng dụng trên trình duyệt.
- [x] Các interfaces chuẩn được định nghĩa và có thể import ở các module khác.

## Verification & Evidence

- [x] Automated verification
  - Command(s): `npm run typecheck && npm run build`
  - Expected proof: Báo cáo thành công, không có lỗi TS.
- [x] Artifact / runtime verification
  - Inspect: Mở tab Application -> IndexedDB trên Chrome DevTools.
  - Expect: Thấy database được tạo với 3 object stores (`questions`, `history`, `activeSession`).
- [x] Contract / negative-path verification
  - Check: Thử insert sai kiểu dữ liệu vào Dexie.
  - Expect: TypeScript báo lỗi compile-time.

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Xung đột phiên bản thư viện | Low | Cố định version trong package.json |
