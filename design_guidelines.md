# QR Code Generator - Design Guidelines

## Design Approach

**Selected Approach**: Design System - Material Design inspired utility tool
**Justification**: This is a function-first application where clarity, efficiency, and instant usability are paramount. Users need to generate QR codes quickly without friction. The interface should feel modern, clean, and trustworthy.

**Key Design Principles**:
- Immediate clarity: Users should understand how to use the tool within 2 seconds
- Progressive disclosure: Show options only when relevant
- Visual feedback: Real-time QR code generation as users type
- Scannable QR codes: Ensure high contrast and proper sizing for all generated codes

---

## Core Design Elements

### Typography
- **Primary Font**: Inter or DM Sans (Google Fonts)
- **Headings**: 
  - H1: 32px/40px (mobile), 48px/56px (desktop), font-weight 700
  - H2: 24px/32px, font-weight 600
- **Body Text**: 16px/24px, font-weight 400
- **Labels**: 14px/20px, font-weight 500
- **Buttons**: 16px, font-weight 600, uppercase or sentence case

### Layout System
**Spacing Scale**: Use Tailwind units: 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section gaps: gap-8 to gap-12
- Form field spacing: space-y-6
- Button padding: px-6 py-3

**Container Structure**:
- Max-width: max-w-4xl centered for main content
- Two-column layout on desktop (lg:grid-cols-2): Input panel | Preview panel
- Single column on mobile with preview below input

---

## Component Library

### Navigation/Header
- Minimal header with logo/title on left
- Tagline: "Generate QR Codes Instantly - No Signup Required"
- Optional: GitHub link or info icon on right
- Height: h-16, with border-bottom

### Tab Navigation (QR Type Selector)
- Horizontal tabs: URL, Text, PDF, Image, Link List
- Active state: bold text with bottom border (border-b-2)
- Responsive: Scrollable horizontal on mobile, full width on desktop
- Spacing: gap-4 to gap-6 between tabs

### Input Panel
**URL/Text Input**:
- Large textarea or text input (min-h-32 for text type)
- Clear placeholder text: "Enter your URL here..." or "Type or paste your text..."
- Character counter for text input
- Real-time validation feedback

**File Upload (PDF/Image)**:
- Drag-and-drop zone with dashed border
- File type indicator and size limit display
- Upload button as secondary action
- Preview thumbnail of uploaded file

**Link List Builder**:
- Add/remove link interface
- Each link input with label field + URL field
- "Add Another Link" button
- List preview showing all entered links

### QR Code Preview Panel
- **Container**: Elevated card with subtle shadow, white/light background
- **QR Code Display**: 
  - Centered QR code image (256x256px default display)
  - High contrast: black QR on white background
  - 16px padding around QR code for scanning margin
  - Responsive sizing: scales down on mobile while maintaining aspect ratio

**Action Buttons**:
- Primary: "Download QR Code" (prominent, full width on mobile)
- Secondary: "Copy to Clipboard" 
- Button group with gap-3
- Icon + Text format for clarity

**Download Options**:
- Size selector dropdown: Small (256px), Medium (512px), Large (1024px), XL (2048px)
- Format selector (if implementing): PNG (default), SVG
- Positioned above action buttons

### Empty State
- Centered icon (QR code placeholder graphic)
- Instructional text: "Enter content above to generate your QR code"
- Light gray background to distinguish inactive state

---

## Page Layout Structure

### Desktop (lg: breakpoint)
```
[Header - full width]

[Main Container - max-w-4xl]
  [Tab Navigation]
  
  Two Columns (grid-cols-2, gap-8):
  Left Column:              Right Column:
  - Input Form              - QR Preview Card
  - Type-specific fields    - Action Buttons
  - Customization options   - Download Options
```

### Mobile (base)
```
[Header]
[Tab Navigation - horizontal scroll]
[Input Section - full width]
[QR Preview Section - full width, mt-8]
[Action Buttons - stacked]
```

---

## Interaction Patterns

**Real-time Generation**:
- Debounced input (300ms) triggers QR regeneration
- Loading indicator during generation
- Smooth fade-in when QR code appears

**Copy Functionality**:
- Click "Copy" button → Brief success toast notification
- Button text briefly changes: "Copy to Clipboard" → "Copied!" → back
- Subtle checkmark icon animation

**File Upload**:
- Drag highlight state on drag-over
- Progress indicator during processing
- Error states with helpful messages

---

## Accessibility
- All form inputs have associated labels
- QR code has alt text describing encoded content
- Tab navigation keyboard accessible
- Focus states visible on all interactive elements
- Error messages announced to screen readers

---

## Images
**No large hero image needed** - This is a utility tool focused on the interface itself.

Optional: Small decorative QR code pattern in header background (subtle, low opacity) for brand reinforcement.