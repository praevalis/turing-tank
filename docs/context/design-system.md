# Turing Tank Design System

## Design Intent

Turing Tank should make a founder feel like they are pitching to a high-stakes investor panel. The visual language gives a subtle nod to Shark Tank through the panel's presence, the pressure of a live question, and the moment an offer is made. This feeling should carry through the working flows as well as the public page.

Use a dark setting and restrained smoked-plum light for the live panel. Give the founder's answers and controls a clear place within that setting. Use lighter, document-like surfaces where the founder needs to study a report or inspect evidence. Controlled gradients and active status cues add a slight futuristic edge. Show the AI through the panel's responses and clear interface states, rather than a decorative AI symbol.

## Design Principles

- Design each screen around the founder's immediate task. Make the current question, decision, or next action easy to find without reading a block of promotional copy.
- Pair concise text with useful visual context. A panel view can show who is speaking, an offer can expose its terms, and a report can connect a finding to its evidence. Each visual should help the founder understand or act.
- Use a first-person perspective for the live panel. Frame the investors as the people the founder is facing, with the active question and answer controls in the same view. Keep enough conversation context visible to make a follow-up intelligible.
- Give different tasks different compositions. Preparing a pitch, answering the panel, considering an offer, and reviewing a report need their own hierarchy. Do not make every flow look like a variation of the landing-page hero or the same card grid.
- Use visual cues for real information and states. An active speaker, remaining time, an offer condition, or a cited source carries meaning. Generic arrows, timelines, and decorative diagrams do not stand in for those details.
- Build tension through framing, contrast, and the question itself. Keep stage lighting behind the panel where it establishes the setting. Avoid repeating spotlight effects across forms, reports, and ordinary navigation.
- Keep language direct and brief. Use text to identify an action or explain a consequence, then let the interaction show the rest. Longer reasoning belongs where the founder can inspect it, such as the report.

## Color

The palette starts with near-black blue rather than pure black. Smoked plum is the main accent and the color of the panel light. Light paper separates review work from the live setting. Use the accent to mark focus, active status, an important term, or a primary action. Keep large dark areas quiet so the content remains legible.

| Role | Color | Use |
| --- | --- | --- |
| Dark canvas | `#10141b` | Application background and the edges of the panel scene. |
| Dark surface | `#1b1e28` | Live interaction surfaces. |
| Raised surface | `#24232f` | Headers and controls inside dark panels. |
| Dark border | `#504757` | Secondary controls and restrained outlines. |
| Smoked plum | `#785a72` | Panel light and primary accent. |
| Light plum | `#b59ab4` | Focus, active status, and highlights on dark surfaces. |
| Light text | `#f3eee9` | Main text on dark surfaces. |
| Muted text | `#bdb7bd` | Supporting text on dark surfaces. |
| Report paper | `#e9e3e5` | Reports and other document-like surfaces. |
| Report ink | `#211e25` | Main text on light surfaces. |

The primary action draws from the panel lighting. Its gradient combines a dark plum base around `#3e3041` and `#29232f` with a focused `#785a72` to `#624760` glow. Keep its text light and its edge visible. Use the glow sparingly so primary actions remain easy to locate.

## Typography

Use Newsreader for expressive content such as a major heading, the active investor question, an offer amount, or a report finding. Use Bricolage Grotesque for navigation, instructions, answer controls, terms, body copy, and compact labels. Newsreader gives key moments weight. Bricolage keeps the working interface easy to read.

Size type according to the job it does and the space available. A question needs to stand above its supporting context, while an answer field, offer condition, and evidence source need comfortable reading sizes. Scale headings and body copy on narrow screens instead of carrying desktop sizes into a stacked layout. Small labels should name real information or states, not decorate a surface.

The production logo uses an outlined Bricolage wordmark. Display the asset rather than rebuilding its lettering with HTML text.

## Layout and Responsive Behavior

Let the active task determine the layout. The live panel needs room for the people being addressed, the current question, and the founder's response. An offer needs a clear reading order for terms and possible responses. A report needs room to scan findings and follow evidence. Shared navigation should support these layouts without making them all use the same composition.

Check interactive layouts down to 350 pixels wide. At 350 through 767 pixels, keep the task's reading and action order intact when content stacks. Tablet layouts cover 768 through 1023 pixels, and desktop layouts begin at 1024 pixels. Scale type and controls for the available width. Keep the active question, important terms, and primary action readable without horizontal scrolling.

Preserve the proportions of artwork and spatial cues. Crop or recompose a panel scene on narrow screens instead of stretching its chairs or desk. If part of the setting leaves the frame, the active content and controls still need to remain visible.

## Surfaces and Interaction

The live panel should suggest the founder's point of view. Investors face the founder from across the room, while the current question and answer area stay close enough to read and use together. Identify the active investor and preserve the context needed for a follow-up. The room supports the interaction rather than competing with it.

An offer should put amount, equity or valuation basis, conditions, and reasoning in a clear order. A founder's counter should visibly relate to the offer being answered. A report should read as a report on light paper, with a finding, the claim or answer it concerns, relevant evidence, investor reasoning, and a practical next step. These are different working surfaces and do not need the same visual treatment.

Use modest corners that match the surface. Frames can use about 4 pixels, buttons and slips about 6 to 7 pixels, and larger panels about 9 to 10 pixels. Use circles for small status marks and icon controls. Borders, shadows, and gradients should clarify depth or focus rather than make every element feel enclosed.

When a response is pending, an action fails, or information is unavailable, keep the surrounding task recognizable. Show the status near the affected content and make the available next action clear. Motion can draw attention to a response or state change. Respect reduced-motion preferences and avoid animation that runs only for atmosphere.

## Brand Assets

Use [`public/brand/logo.svg`](../../public/brand/logo.svg) for the extended logo on dark surfaces and [`public/brand/mark.svg`](../../public/brand/mark.svg) where the mark is enough. [`src/app/icon.svg`](../../src/app/icon.svg) is the transparent browser icon. The assets define the mark's shape, proportions, and colors. Do not redraw the mark in page CSS or add words or financial symbols to it.

On a light document surface, pair the mark with a compact Bricolage Grotesque wordmark in dark plum `#624760`. The extended SVG is colored for dark surfaces and should stay on those surfaces.

## Accessibility

Keep text readable against both dark and light surfaces. Do not use color alone to show an active state, an error, or a change in investor position. Interactive controls need a visible keyboard focus treatment. The established light-plum focus outline is 3 pixels wide with an offset that separates it from the control border.

Use semantic headings, controls, and accessible names for information shown by visual components. Give meaningful artwork a concise description. Preserve the information conveyed by the panel composition when the layout changes or artwork cannot be seen.

## Landing Page Reference

The landing page demonstrates the palette, type pairing, angular panel frame, and shadowed chair and desk artwork. Its hero uses a spotlight-like backdrop behind the silhouettes. The following sections use distinct compositions to show questioning, negotiation, and the report. Space and layout changes carry the page flow without horizontal rules or boxed section treatments.

The public page has a content width of up to 1376 pixels and side gutters of 56 pixels on desktop, 32 pixels on tablet, and 20 pixels on mobile. Its hero heading ranges from about 48 to 62 pixels on mobile and 62 to 82 pixels on desktop. Section headings range from about 34 to 40 pixels on mobile and 41 to 54 pixels on desktop. These dimensions describe the landing page, not every screen in the application.
