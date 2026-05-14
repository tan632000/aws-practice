# UI/UX Redesign Implementation Plan

## Goal Description
The current UI is functional but lacks a cohesive layout and premium feel. The objective is to overhaul the user interface to deliver a "WOW" experience using modern web design principles: deep, vibrant aesthetics, smooth micro-animations, glassmorphism, and structured layouts.

> [!WARNING]
> **User Review Required: Styling Framework Decision**
> The project currently has TailwindCSS installed. However, per standard guidelines, we default to Vanilla CSS for maximum flexibility and rich aesthetics unless TailwindCSS is explicitly requested. 
> 
> **Question 1**: Do you want to stick with **TailwindCSS (v4.3.0)** for this redesign, or should we switch to **Vanilla CSS** with CSS variables for maximum control over gradients and animations?
> 
> **Question 2**: Do you prefer a **Dark Mode Theme** (deep blues/blacks with vibrant neon accents) or a **Light Premium Theme** (soft grays, glassmorphism, and bold primary colors)?

## Proposed Changes

### Global Styling (Vanilla CSS / Tailwind)
- Redefine color palette: Primary (AWS Orange/Blue), Backgrounds (Dark/Light gradients), Surfaces (Glassmorphic cards).
- Use modern typography: `Inter` or `Outfit` via Google Fonts.
- Implement CSS variables for easy theming.

### Component Updates

#### [MODIFY] `src/features/dashboard/Dashboard.tsx`
- Replace plain white cards with glassmorphic panels.
- Add a hero section welcoming the user.
- Add hover micro-animations to the statistic cards (lift up effect).
- Style the History Table with modern padding, subtle borders, and distinct status badges.

#### [MODIFY] `src/features/exam/components/ExamView.tsx`
- Implement a "Focus Mode" layout with a sticky header for the timer.
- Redesign the Question layout to be more readable with better line height and typography.
- Smooth transitions when switching questions.

#### [MODIFY] `src/features/exam/components/QuestionCard.tsx`
- Improve radio button custom styles (hide native radio, use custom styled circles).
- Enhance the Correct/Incorrect states with background fading and animated borders.

#### [MODIFY] `src/features/exam/components/FeedbackPanel.tsx`
- Add slide-down animations for the trick panel.
- Style the explanation text to look like a premium markdown render.

## Verification Plan
### Manual Verification
- Start the dev server.
- Verify the Dashboard looks visually stunning and structured.
- Take a mock exam to ensure animations run smoothly and answers are highlighted clearly without layout shifts.
