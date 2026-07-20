# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-07-20
### Fixed (Performance Audit)
- **CSS**: Replaced remaining `transition: all` on `.cta-button` with explicit properties to avoid layout thrashing.
- **CSS**: Fixed bare `transition: 0.2s` shorthand on `nav a` — added explicit `color` property and easing function.
- **CSS**: Removed `filter: drop-shadow()` from continuously running `@keyframes iconWiggle` — filter repaints entire compositing layer every frame.
- **CSS**: Added `contain: layout style` on `.img-interactive-container` to isolate repaints from glow overlay.
- **CSS**: Added `will-change: background` to `.mouse-spotlight` which repaints on every mouse move.
- **JS**: Eliminated inline `style.transition` manipulation on CTA card tilt (violated "State via CSS classes" rule) — CSS handles transitions natively.
- **JS**: Added `requestAnimationFrame` throttle to image glow `mousemove` handler — previously fired on every pixel of mouse movement causing excessive style recalculations.

## [Unreleased] - 2026-07-09
### Changed & Optimized
- **Advanced CSS Optimizations**:
  - Replaced CPU-heavy `transition: all` with targeted properties to prevent layout thrashing (reflow).
  - Consolidated and grouped all `@media` queries sequentially at the bottom of the CSS file.
  - Eliminated redundant `will-change` hardware acceleration flags to free up memory on mobile devices.
  - Re-encoded CSS comments from ANSI to flat ASCII to resolve formatting artifacts ("krzaki").
  - Minified structural CSS spacing (removed redundant empty lines) and reorganized the Table of Contents dynamically.
- **JavaScript Efficiency**: 
  - Refactored the Hero fountain sparks from an unbounded `requestAnimationFrame` loop to a lightweight `setInterval(300ms)` cycle, significantly lowering idle CPU usage.
  - Implemented `requestAnimationFrame` "ticking" pattern for high-frequency `scroll` and `mousemove` event listeners, eliminating scroll jank and layout thrashing to enforce stable 60fps performance.
- **HTML Semantics & Clean Code**: 
  - Eradicated inline CSS styling (`style="..."`) in favor of proper CSS classes (e.g., `.start-node`).
  - Refactored pseudo-lists utilizing `<br><br>` into fully semantic and accessible `<ul>` lists with SVG icons (`.feature-list`).

### Added
- **Technical Audit Fixes (Performance & A11y)**: Addressed issues found during technical audit:
  - Fixed significant memory leaks in `app.js` related to unbounded particle generation and non-stop `setInterval` execution for the timeline start node.
  - Resolved Flash of Unstyled Content (FOUC) by shifting theme restoration script to `<head>`.
  - Removed duplicated CSS variables and centralized theme colors using custom properties and RGB components.
  - Implemented missing `aria-label` and `aria-hidden` tags for full accessibility compliance.
  - Extended `@media (prefers-reduced-motion: reduce)` logic to disable distracting animations.
  - Added SEO files (`robots.txt`, `sitemap.xml`) and Structured Data (JSON-LD).
  - Obfuscated mailto link to prevent scraping.
- **Premium UI Enhancements**:
  - Implemented pure CSS animated Tooltips for inline brand badges (ChatGPT, Gemini, Claude) with full ARIA accessibility support (`aria-describedby`, `role="button"`).
  - Designed an interactive "Glitch" animation for the Hallucinations text to visually emphasize the concept of AI errors.
  - Revamped the final CTA section into a "Premium Editorial Quote" layout with a subtle watermark quote.
  - Upgraded standard text links to dynamic "Ghost Pill Buttons" with hover translation and color-fill interactions.
- **Agent Rules Upgrade**: Expanded `.agents/AGENTS.md` with strict rules for Semantic HTML, JS Event Delegation, and Design System adherence.

## [0.1.0] - 2026-07-08

### Added
- **AI Blob Sync Effect**: The background blob in the Hero section now pulsates and changes size synchronously with the typewriter animation.
  - **Dynamic Shrink**: Added a feature where the blob proportionally shrinks (`scale`) and dims as the text is deleted, mapping exactly to the length of the removed prompt.
  - **Typewriter Flare**: The glow intensity (brightness and box shadow) of the blob now flickers dynamically with each keystroke in JS, creating an organic electrical computing effect.
- **Interactive Prompt Slider**: The Before/After prompt comparison box was upgraded to an interactive slider utilizing CSS `clip-path` (later refactored to a cross-fade track slider).
- **Timeline Start Node**: Added a glowing, glassmorphism "Start Node" at the very beginning of the central timeline. It acts as an active energy source, continuously emitting a fountain of glowing sparks once the timeline begins drawing.
- **AI Chat Bubble Micro-Interactions**: Enhanced the Hero chat bubble with functional, highly-performant CSS animations:
  - **Thinking State**: Displays bouncing "typing indicator" dots (`...`) while hiding the text cursor during the pause between phrases, mimicking real AI generation delay.
  - **Active Typing State**: The SVG spark icon gently rotates and glows exclusively while the AI is actively typing characters.
- **Dynamic Image Hover Glow**: Round images now have an advanced `mix-blend-mode` glow overlay that dynamically follows the user's cursor position.
- **Particle Trail**: The vertical scroll timeline progress bar now generates an advanced particle system of glowing light sparks as the user scrolls.

### Changed
- Re-architected `.step-round-img` CSS classes, creating `.img-interactive-container` to support complex cursor-tracking overlays without layout thrashing.
