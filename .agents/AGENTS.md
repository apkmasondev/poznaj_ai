# CSS Rules

<RULE>
## CSS Modification and Optimization
When working with CSS files in this project:
1. **Search Before You Add**: Always verify if a similar class, CSS variable, or styling solution already exists before adding new ones. Do not duplicate existing logic.
2. **Modify, Don't Add**: Prefer modifying and expanding existing selectors over appending new custom rules to the end of the file.
3. **Maintain Strict Order**: You must absolutely respect the existing file structure and Table of Contents (e.g. `[01] ZMIENNE CSS`, `[02] RESET`, etc.). Place elements in their correct logical groups.
4. **Group Media Queries**: Media queries should be consolidated in their dedicated group at the bottom of the file (or where currently specified in the file structure). Do not scatter `@media` rules throughout the document.
</RULE>

<RULE>
## General Coding Best Practices & Zero Technical Debt
When contributing to this codebase, strict adherence to quality is expected:
1. **Zero Technical Debt Policy**: Never apply "quick and dirty" fixes or temporary patches (tzw. "prowizorka"). Always solve the root cause of an issue. Refactor aggressively if you encounter messy code during your task.
2. **Leave It Better Than You Found It (Boy Scout Rule)**: If you touch a file and notice poor variable names, commented-out dead code (śmieci), unused imports, or missing `aria-` tags, clean it up as part of your commit. 
3. **Comment and Document Intent**: Ensure any complex or non-obvious logic is well-commented. If you change behavior, update `README.md` and `CHANGELOG.md` accordingly. 
4. **Performance & A11y First**: Do not compromise on 60fps performance (e.g., avoid `transition: all`, unbounded loops, memory leaks) and accessibility (`aria-` tags, keyboard navigation).
</RULE>

<RULE>
## HTML Semantics & JS Architecture
1. **Strict Semantic HTML**: Use the most appropriate HTML5 semantic tags (`<article>`, `<section>`, `<nav>`, `<button>`, `<ul>`). Never use a `<div>` with an `onclick` handler if a `<button>` is semantically correct.
2. **Safe DOM Manipulation**: Always prefer `textContent` over `innerHTML` to prevent XSS vulnerabilities. If building complex HTML in JS, use `document.createElement`.
3. **State via Classes/Data Attributes**: Do not use inline styles (`element.style...`) for state changes. Always toggle CSS classes (`.is-active`, `.is-hidden`) or `data-*` attributes and handle the visual changes purely in CSS.
4. **Event Delegation & Throttling**: For dynamically generated elements, use event delegation. High-frequency events (scroll, mousemove) MUST use `requestAnimationFrame` ticking or debouncing.
</RULE>

<RULE>
## Design System & UI Consistency
1. **Use Existing Design Tokens**: Never hardcode hex colors, arbitrary spacing, or typography (e.g., `#333`, `15px`). Always rigorously search for and use established CSS variables (e.g. `var(--text-color)`, `var(--spacing-md)`).
2. **Responsive by Default (Mobile-First)**: Any new UI element must be built mobile-first. Ensure touch targets are accessible (min. `44x44px`) and elements are readable on small screens.
</RULE>
