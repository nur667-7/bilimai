# DESIGN.md — BilimAI Design System (Quiet Academic Paper & Deep Slate)

## 1. Aesthetic Direction & Domain Character
**«Quiet Academic Paper & Deep Slate» — Calm, High-Contrast Textbook & Diagnostic Workbench:**
- Designed for sustained cognitive focus during mathematical, scientific, and historical reading across all 12 UNT subjects.
- **No AI Slop:** Zero neon purple/cyan blobs, zero decorative glassmorphism, zero fake metrics, and zero thick left-border "side-tab" stripes (`border-left: 3px solid`).
- **Surface Hierarchy via 1px Perimeter Borders & Tonal Elevation:**
  - Cards, rule callouts (`.rule`), solution boxes (`.exam-solution-box`), and inline feedback banners (`.feedback`, `.step-inline-feedback`) use clean `1px solid` semantic borders and subtle tinted surfaces (`--bilimai-surface-raised`, `--bilimai-success-bg`, `--bilimai-warning-bg`, `--bilimai-error-bg`) with consistent `R_inner = max(0, R_outer - padding)` radii.

## 2. Explicit Dual-Theme Token System (`--bilimai-*`)
All surfaces, text hierarchies, and interactive states use unambiguous paired CSS custom properties verified for WCAG AA ($\ge 4.5:1$ normal text, $\ge 3:1$ large text and UI controls):

| Token Role | Light (`Quiet Paper`) | Dark (`Deep Slate`) |
|---|---|---|
| `--bilimai-bg` | `#F6F7FB` | `#0B1020` |
| `--bilimai-surface` | `#FFFFFF` | `#11192E` |
| `--bilimai-surface-raised` | `#EEF2F9` | `#17223B` |
| `--bilimai-text` | `#0F172A` | `#F8FAFC` |
| `--bilimai-text-muted` | `#475569` | `#CBD5E1` |
| `--bilimai-border` | `#D8E0EE` | `#263554` |
| `--bilimai-brand` | `#254EDB` | `#2952E8` |
| `--bilimai-selected-bg` | `#E0E7FF` | `#1E2F5D` |
| `--bilimai-selected-text` | `#1E3A8A` | `#F8FAFC` |
| `--bilimai-success-bg` / `-border` / `-text` | `#ECFDF5` / `#059669` / `#065F46` | `#062E22` / `#10B981` / `#A7F3D0` |
| `--bilimai-warning-bg` / `-border` / `-text` | `#FFFBEB` / `#D97706` / `#92400E` | `#332008` / `#FBBF24` / `#FDE68A` |
| `--bilimai-error-bg` / `-border` / `-text` | `#FEF2F2` / `#DC2626` / `#991B1B` | `#351319` / `#F87171` / `#FECACA` |

## 3. Typography & Mathematical Readability
- **UI & Editorial Copy (`--font-sans`):** `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif` with comfortable reading measure (`<= 70ch`) and `font-variant-numeric: tabular-nums` on all counters, timers, question numbers, and scores.
- **Formulas, Equations & Problem Stems (`--font-math`):** `"STIX Two Math", "Cambria Math", "Times New Roman", Georgia, serif` (`clamp(20px, 2.6vw, 26px)`) with `overflow-wrap: anywhere` so complex equations never overflow mobile screens.

## 4. Information Architecture & Interactive Ergonomics
- **1-to-3 Action Hierarchy:** Every stage exposes one primary action button (`--bilimai-brand` with `#FFFFFF` label) and quiet secondary navigation.
- **8-State Interactive Controls:** Explicit `default`, `hover`, `:focus-visible` (high-contrast ring), `:active` (`scale(0.99)` tactile response), `selected`, `disabled` (`cursor: not-allowed`), `correct`, and `wrong` states.
- **Responsive Multi-Viewport Discipline (`375px`, `768px`, `1024px`, `1440px`):** Strict zero horizontal overflow (`scrollWidth <= clientWidth`), collapsible mobile drawers for topics and exam question grids, and $\ge 44\times44\text{px}$ touch targets on mobile.
