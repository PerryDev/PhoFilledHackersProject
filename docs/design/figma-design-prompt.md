# Figma Prompt: ETEST Compass UI System

Design a modern web app UI for **ETEST Compass**, a student-facing admissions advisory product for Vietnamese students applying to US universities.

The interface should feel like a **trusted admissions desk**: calm, structured, intelligent, and premium without feeling flashy. Avoid generic startup dashboard styling. The visual language should use quiet paper-like surfaces, deep academic blues, disciplined spacing, minimal chrome, and a small set of meaningful semantic colors.

## Product context

ETEST Compass helps students:

- build an admissions profile
- receive transparent university recommendations
- compare schools across Reach / Target / Safety
- understand Current Outlook vs Projected Outlook
- review budget, scholarship, and deadline tradeoffs
- request counselor support

The product should feel credible, source-aware, and human-guided. It supports decision-making, not hype.

## Design direction

- Use a **clean, editorial, app-first** layout style
- Keep the UI **card-light**
- Prefer sections, dividers, panels, and careful spacing over floating widgets
- Make information dense but readable
- Use strong hierarchy, not heavy decoration
- Keep copy short and product-oriented
- Prioritize clarity, provenance, and trust

Avoid:

- generic SaaS card grids
- neon gradients
- overly playful colors
- marketing-style dashboard hero banners inside the app
- thick borders around every region
- too many accent colors

## Core visual thesis

The UI should feel like:

- academic
- trustworthy
- calm
- analytical
- premium
- slightly editorial

## Typography

Use this type pairing:

- Primary UI font: **Manrope**
- Editorial accent font for hero or large headings only: **Source Serif 4**

Rules:

- Most product UI should stay in Manrope
- Use the serif sparingly for brand moments, section titles, or landing-page emphasis
- Keep forms, tables, recommendation details, and compare views in the sans font

## Spacing and shape

Use a restrained spacing system:

- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

Shape language:

- Small controls: 10-12px radius
- Standard panels: 16px radius
- Large dialogs or callouts: 24px radius
- Default system radius: 16px

## Color token system

Follow this token palette and semantic structure. Use these names directly in the design system.

### Core tokens

- `background`: warm paper app background
- `foreground`: deep ink text
- `card`: clean elevated work surface
- `popover`: highest-clarity overlay surface
- `primary`: academic blue for CTA, active nav, selected controls
- `secondary`: soft cool neutral support surface
- `muted`: quiet neutral for low-emphasis areas
- `accent`: sea-glass support tint for assistive or conversational moments
- `destructive`: severe blocker or dangerous action
- `border`: low-contrast structural boundary
- `input`: input border and control boundary
- `ring`: accessible focus color

### Semantic app tokens

- `success`: completion, positive state, confirmed progress
- `warning`: budget pressure, missing requirements, moderate urgency
- `info`: factual context, source details, assistant explanations

### Recommendation tokens

- `reach`: aspirational school label
- `target`: balanced-fit school label
- `safety`: high-likelihood school label
- `current`: present-state recommendation summary
- `projected`: future-state recommendation summary based on milestones
- `scholarship`: affordability support or aid label
- `deadline`: time pressure and application urgency

### Surface tokens

- `surface-soft`: quiet section background
- `surface-elevated`: cleaner elevated panel
- `surface-strong`: selected or emphasized panel background

## Exact token values

Use these exact values as the source of truth for the visual system.

### Light mode

```css
:root {
  --radius: 1rem;
  --background: oklch(0.985 0.006 88);
  --foreground: oklch(0.272 0.03 248);
  --card: oklch(0.996 0.003 88);
  --card-foreground: oklch(0.272 0.03 248);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.272 0.03 248);
  --primary: oklch(0.39 0.085 248);
  --primary-foreground: oklch(0.985 0.004 95);
  --secondary: oklch(0.95 0.015 212);
  --secondary-foreground: oklch(0.3 0.034 248);
  --muted: oklch(0.962 0.008 88);
  --muted-foreground: oklch(0.53 0.022 245);
  --accent: oklch(0.935 0.028 194);
  --accent-foreground: oklch(0.31 0.044 225);
  --destructive: oklch(0.63 0.205 28);
  --destructive-foreground: oklch(0.985 0.004 95);
  --border: oklch(0.892 0.01 88);
  --input: oklch(0.892 0.01 88);
  --ring: oklch(0.58 0.105 236);
  --chart-1: oklch(0.66 0.16 238);
  --chart-2: oklch(0.72 0.13 154);
  --chart-3: oklch(0.76 0.14 78);
  --chart-4: oklch(0.7 0.09 200);
  --chart-5: oklch(0.6 0.12 18);
  --sidebar-background: oklch(0.973 0.008 88);
  --sidebar-foreground: oklch(0.3 0.032 248);
  --sidebar-primary: oklch(0.39 0.085 248);
  --sidebar-primary-foreground: oklch(0.985 0.004 95);
  --sidebar-accent: oklch(0.945 0.016 212);
  --sidebar-accent-foreground: oklch(0.3 0.034 248);
  --sidebar-border: oklch(0.886 0.01 88);
  --sidebar-ring: oklch(0.58 0.105 236);
  --success: oklch(0.79 0.137 154);
  --success-foreground: oklch(0.275 0.05 155);
  --warning: oklch(0.84 0.145 82);
  --warning-foreground: oklch(0.33 0.055 62);
  --info: oklch(0.82 0.09 225);
  --info-foreground: oklch(0.29 0.045 238);
  --reach: oklch(0.85 0.105 74);
  --reach-foreground: oklch(0.35 0.05 60);
  --target: oklch(0.84 0.08 226);
  --target-foreground: oklch(0.29 0.045 238);
  --safety: oklch(0.84 0.1 156);
  --safety-foreground: oklch(0.28 0.05 155);
  --current: oklch(0.91 0.02 240);
  --current-foreground: oklch(0.31 0.035 248);
  --projected: oklch(0.9 0.04 196);
  --projected-foreground: oklch(0.31 0.046 224);
  --scholarship: oklch(0.91 0.056 152);
  --scholarship-foreground: oklch(0.28 0.05 155);
  --deadline: oklch(0.91 0.07 82);
  --deadline-foreground: oklch(0.35 0.05 60);
  --surface-elevated: oklch(0.994 0.002 88);
  --surface-soft: oklch(0.978 0.007 88);
  --surface-strong: oklch(0.952 0.014 212);
}
```

### Dark mode

```css
.dark {
  --background: oklch(0.205 0.02 248);
  --foreground: oklch(0.95 0.007 88);
  --card: oklch(0.245 0.022 248);
  --card-foreground: oklch(0.95 0.007 88);
  --popover: oklch(0.225 0.02 248);
  --popover-foreground: oklch(0.95 0.007 88);
  --primary: oklch(0.74 0.105 232);
  --primary-foreground: oklch(0.22 0.02 248);
  --secondary: oklch(0.295 0.02 244);
  --secondary-foreground: oklch(0.95 0.007 88);
  --muted: oklch(0.275 0.018 246);
  --muted-foreground: oklch(0.72 0.015 88);
  --accent: oklch(0.32 0.035 200);
  --accent-foreground: oklch(0.94 0.008 88);
  --destructive: oklch(0.7 0.19 28);
  --destructive-foreground: oklch(0.19 0.015 248);
  --border: oklch(0.34 0.015 246);
  --input: oklch(0.34 0.015 246);
  --ring: oklch(0.76 0.11 232);
  --chart-1: oklch(0.72 0.16 236);
  --chart-2: oklch(0.79 0.13 154);
  --chart-3: oklch(0.83 0.14 82);
  --chart-4: oklch(0.76 0.08 198);
  --chart-5: oklch(0.72 0.14 24);
  --sidebar-background: oklch(0.18 0.018 248);
  --sidebar-foreground: oklch(0.92 0.008 88);
  --sidebar-primary: oklch(0.74 0.105 232);
  --sidebar-primary-foreground: oklch(0.22 0.02 248);
  --sidebar-accent: oklch(0.275 0.02 246);
  --sidebar-accent-foreground: oklch(0.94 0.008 88);
  --sidebar-border: oklch(0.33 0.015 246);
  --sidebar-ring: oklch(0.76 0.11 232);
  --success: oklch(0.66 0.12 154);
  --success-foreground: oklch(0.96 0.008 88);
  --warning: oklch(0.73 0.12 82);
  --warning-foreground: oklch(0.18 0.012 60);
  --info: oklch(0.7 0.09 225);
  --info-foreground: oklch(0.96 0.008 88);
  --reach: oklch(0.72 0.11 74);
  --reach-foreground: oklch(0.17 0.012 60);
  --target: oklch(0.71 0.085 226);
  --target-foreground: oklch(0.96 0.008 88);
  --safety: oklch(0.7 0.09 156);
  --safety-foreground: oklch(0.96 0.008 88);
  --current: oklch(0.33 0.022 242);
  --current-foreground: oklch(0.94 0.008 88);
  --projected: oklch(0.34 0.04 196);
  --projected-foreground: oklch(0.94 0.008 88);
  --scholarship: oklch(0.35 0.05 152);
  --scholarship-foreground: oklch(0.95 0.008 88);
  --deadline: oklch(0.38 0.07 82);
  --deadline-foreground: oklch(0.95 0.008 88);
  --surface-elevated: oklch(0.245 0.022 248);
  --surface-soft: oklch(0.225 0.018 248);
  --surface-strong: oklch(0.3 0.022 244);
}
```

## Layout guidance

Design the product around these main work areas:

- profile builder
- recommendation workspace
- compare mode
- chat clarification panel
- counselor handoff flow
- admin and counselor review views

For app UI:

- Use a left navigation rail or clear top navigation
- Keep the main workspace dominant
- Use a right-side contextual panel only when it adds value
- Let tables, forms, chips, and structured explanation blocks do the work
- Avoid turning every content cluster into a bordered card

## Components to design

Create a design system and screen mocks for:

- button variants
- inputs and selects
- textarea
- radio group and checkbox group
- stepper or progress navigation
- tabs
- badges and chips
- alert banners
- school recommendation item
- comparison table
- chat message layout
- source citation row
- blocker list
- deadline warning panel
- counselor CTA area
- sidebar and top nav
- modal and drawer

## Key screen prompts

Design these screens:

1. Landing page
- Poster-like first viewport
- Brand first, headline second, supporting copy third, CTA fourth
- Strong editorial composition, not a boxed SaaS hero

2. Onboarding / profile builder
- Multi-step flow with clear progress
- Quiet surfaces, minimal distraction
- Strong guidance for missing information

3. Recommendation results
- Reach / Target / Safety grouping
- Each school shows transparent reasoning, blockers, budget fit, and source freshness
- Current Outlook and Projected Outlook must be visually distinct but related

4. Compare mode
- Side-by-side comparison of 2-3 schools
- Strong row hierarchy
- Easy scanning for budget, deadlines, requirements, and urgency

5. Chat assistant
- Helpful, factual, source-aware
- Should feel integrated into the product rather than like a generic chatbot

6. Counselor handoff / booking
- Clear summary of student state
- Conversion-oriented but trustworthy
- Strong confirmation state after submission

7. Admin / counselor console
- Neutral, operational, dense-but-readable
- Validation status, stale data, and lead review should be easy to scan

## Motion guidance

Use only restrained, meaningful motion:

- staged fade-and-slide reveals for onboarding and recommendation sections
- smooth transitions when adding or removing schools in compare mode
- subtle emphasis for warnings, blockers, and deadline states

Motion should support hierarchy and clarity, not decoration.

## shadcn alignment

This UI system should be easy to implement with **shadcn/ui** using CSS variables and semantic tokens. Keep component shapes simple, surfaces restrained, and layouts practical for a Next.js application.

Use a **New York style** shadcn baseline with custom tokens layered on top.

## Final output instruction

Produce:

- a cohesive design system page
- desktop app screens
- mobile responsive versions of key screens
- light mode first, with dark mode adaptations using the provided dark tokens

The final result should feel like a premium, trustworthy education decision platform, not a generic startup dashboard.
