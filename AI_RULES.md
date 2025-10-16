# AI Development Rules for Joule Academy

This document outlines the technical stack and development guidelines for AI developers working on this application. Adhering to these rules ensures consistency, maintainability, and quality.

## Tech Stack

This application is built with a modern, streamlined tech stack:

*   **Framework:** React with TypeScript for a type-safe and component-based user interface.
*   **Build Tool:** Vite provides a fast and efficient development experience and optimized production builds.
*   **Styling:** Tailwind CSS is used exclusively for styling. All UI is built using its utility-first classes.
*   **AI Integration:** The core AI features are powered by the Google Gemini API, accessed via the `@google/genai` library.
*   **UI Components:** We use `shadcn/ui` as our primary component library for building blocks like buttons, cards, and modals.
*   **Icons:** All icons are provided by the `@heroicons/react` library to maintain a consistent visual language.
*   **File Processing:** Client-side parsing of user-uploaded `.docx` and `.pdf` files is handled by Mammoth.js and PDF.js, respectively.
*   **State Management:** State is managed locally within components using React's built-in hooks (`useState`, `useEffect`, etc.).

## Development Guidelines & Library Usage

Follow these rules strictly when adding or modifying features.

1.  **UI Components:**
    *   **Primary Source:** ALWAYS use components from the `shadcn/ui` library for common UI patterns (Buttons, Dialogs, Inputs, Cards, etc.).
    *   **Customization:** Customize `shadcn/ui` components using Tailwind CSS utility classes.
    *   **New Components:** When a `shadcn/ui` component isn't suitable, build new components from scratch using React, TypeScript, and Tailwind CSS. Place each new component in its own file under `src/components/`.

2.  **Styling:**
    *   **Tailwind First:** All styling MUST be done with Tailwind CSS.
    *   **No Custom CSS:** Do not write custom CSS files or use inline `style` attributes unless it's for a dynamic value that cannot be achieved with Tailwind classes.

3.  **Icons:**
    *   **Heroicons Only:** Exclusively use icons from the `@heroicons/react` package. Do not introduce other icon libraries.

4.  **AI Logic:**
    *   **Centralized Service:** All calls to the Gemini API must be contained within `src/services/geminiService.ts`.
    *   **Schema Definition:** Clearly define the expected JSON schema for AI responses to ensure type safety and predictable results.

5.  **Code Structure:**
    *   **Components:** All reusable React components go into `src/components/`.
    *   **Services:** Business logic, especially third-party API interactions, should be in `src/services/`.
    *   **Types:** All TypeScript types and interfaces should be defined in `src/types.ts`.

6.  **Dependencies:**
    *   **No New Libraries:** Do not add new npm packages or third-party libraries without explicit approval. The current stack is intentionally minimal and should be sufficient for most tasks.