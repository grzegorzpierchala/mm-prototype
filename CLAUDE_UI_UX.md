# Mindful Metrics UI/UX Design System

> **🚨 IMPORTANT: Claude must keep this file updated when UI/UX changes are made.**
> **📍 Reference Implementation: survey-editor-vite (Component-based architecture)**
> **🔧 Development Server: http://localhost:5173/**

## Core Design Philosophy

**Notion-Inspired • AI-Enhanced • Ultrathin Aesthetic**

### Key Principles
1. **Block-Based**: Everything is a composable block
2. **Progressive Disclosure**: Complexity revealed as needed  
3. **Ultrathin Design**: Minimal borders, subtle shadows, generous spacing
4. **Auto-Save**: No save buttons, continuous sync
5. **Natural Language AI**: Floating assistant for all features

## Pattern Language System

### 🎨 Design Tokens

```css
/* Core Variables */
--color-primary: #6366F1;      /* Indigo-500 */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--border-default: 1px solid #e5e7eb; /* gray-200 ONLY */
--radius-default: 8px;         /* rounded-lg */
--text-base: 16px;            /* Never 14px for UI text */
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--duration-default: 200ms;
```

### 📐 Component Matrix

| Component | Sizes | States | Variants | Reference |
|-----------|-------|--------|----------|-----------|
| **Button** | `base` `sm` | `default` `hover` `active` `disabled` | `primary` `secondary` `danger` `ghost` | Lines 625-642 |
| **Input** | `base` | `default` `focus` `error` `disabled` | `text` `textarea` `select` `number` | Lines 657-673 |
| **Toggle** | `base` `sm` | `off` `on` `disabled` | - | Lines 886-947 |
| **Card** | `base` | `default` `hover` `selected` | `plain` `bordered` `elevated` | Lines 644-654 |
| **Tab** | `base` | `default` `active` `disabled` | `underline` `pill` | Lines 834-864 |

### 🧩 Base Patterns

#### 1. **Container Pattern**
```html
<!-- Universal container with consistent spacing -->
<div class="bg-white rounded-lg border border-gray-200 p-6">
  <!-- Content -->
</div>
```

#### 2. **Interactive Element Pattern**
```html
<!-- Hover states and transitions -->
<element class="transition-all duration-200 hover:shadow-sm hover:border-gray-300">
```

#### 3. **Progressive Reveal Pattern**
```html
<!-- Show/hide with Alpine.js -->
<div x-show="condition" x-transition class="mt-4">
```

## UI Organisms

### 📋 Universal Tab Navigation
**Used in:** All features (surveys, interviews, tests)  
**Implementation:** `/src/components/layout/TabNavigation.js`

```
Build → Flow → Preview → Share → Results* → Analytics* → Settings
(*disabled until data exists)
```

**New Addition:** Flow tab for visual survey logic editor

### 🎛️ Settings Panel (380px width)
**Implementation:** `/src/components/ui/SettingsPanel.js`

#### Structure
1. **Header** - Title + close button (20px 24px padding)
2. **Tabs** - Conditional based on context
3. **Content** - Scrollable with sections
4. **Actions** - Delete at bottom (danger zone)

#### Dynamic Tab Visibility
```javascript
// Show Logic tab only for these types (line 2312)
['multiple_choice', 'dropdown', 'rating_scale', 'matrix', 'ranking']
```

### 🎯 Question Type System
**Implementation:** `/src/components/questions/QuestionRenderer.js`

#### Categories & Icons
- **Essentials**: 💬📝🔘☑️▼👍
- **Rating**: ⭐🔢🎯📊🎚️😊  
- **Input**: 💯✉️📱🌐📅🕐
- **Advanced**: ⊞📋💯⚖️📊🗂️
- **Media**: 📎🖼️✍️🎨📹🎤
- **Interactive**: 🔥🎯📍⊞

### 🏗️ Block Editor Pattern
**Implementation:** `/src/components/questions/QuestionRenderer.js`

```html
<div class="block group relative">
  <!-- Drag Handle (hidden until hover) -->
  <div class="block-handle">⋮⋮</div>
  
  <!-- Content -->
  <div class="block-content">
    <!-- Question-specific content -->
  </div>
  
  <!-- Actions (hidden until hover) -->
  <div class="block-actions">
    <button>+</button>
    <button>⋮</button>
    <button>🗑</button>
  </div>
</div>
```

## Quick Reference

### States & Modifiers

| State | Class Pattern | Example |
|-------|--------------|---------|
| Hover | `hover:property-value` | `hover:shadow-sm` |
| Focus | `focus:ring-2 focus:ring-indigo-500` | All inputs |
| Active | `bg-indigo-600 text-white` | Selected items |
| Disabled | `opacity-50 cursor-not-allowed` | Inactive elements |

### Spacing Scale

```
p-2 (8px) → p-3 (12px) → p-4 (16px) → p-6 (24px) → p-8 (32px)
```

### Component Composition

```
Atom:     Toggle Switch
Molecule: Toggle + Label + Description  
Organism: Settings Section with multiple toggles
Template: Complete Settings Panel
```

## Implementation Patterns

### Alpine.js Data Structure
```javascript
// Question object schema (maintained in stores)
{
  id: 'q1',
  questionNumber: 'Q1',
  type: 'multiple_choice',
  text: 'Question text',
  required: true,
  options: [{id: 'o1', text: 'Option'}],
  settings: {
    // Type-specific settings
  },
  validation: {
    // Validation rules
  }
}
```

### Store Architecture
- `/src/stores/surveyStore.js` - Survey data and CRUD operations
- `/src/stores/uiStore.js` - UI state, panels, auto-save
- `/src/stores/commentStore.js` - Comments and review system
- `/src/stores/versionStore.js` - Version history
- `/src/stores/validationStore.js` - Real-time validation
- `/src/stores/flowStore.js` - Flow editor state

### Event Handling
```javascript
// Debounced autosave pattern
@input="$store.ui.debouncedAutoSave()"

// Drag and drop for questions
@dragstart="handleQuestionDragStart($event, question.id)"
@dragend="handleQuestionDragEnd($event)"

// Page break insertion
@click="$store.survey.addPageBreak(prevQuestionId)"
```

### State Management
```javascript
// Store initialization in main.js
import './stores/surveyStore'
import './stores/uiStore'
// ... other stores

// Auto-save initialization
Alpine.store('ui').initAutoSave()
```

## Visual Components

### Toggle Switch
```css
/* Base: 44x24px, Small: 36x20px */
.toggle-switch { width: 44px; height: 24px; }
.toggle-switch-sm { width: 36px; height: 20px; }
```

### Visual Radio Cards (2x2 Grid)
```html
<div class="display-format-grid"> <!-- grid-cols-2 gap-3 -->
  <label class="display-format-card" :class="{'selected': condition}">
    <input type="radio" hidden>
    <div class="display-format-icon"><!-- 32x32px --></div>
    <div class="display-format-label">Label</div>
  </label>
</div>
```

## Feature-Specific Patterns

### Comment System
**Implementation:** `/src/components/ui/CommentSidebar.js`
- Thread-based discussions
- 6 comment types with badges
- Sidebar overlay (380px desktop, bottom sheet mobile)

### Version History  
**Implementation:** `/src/components/ui/VersionHistory.js`
- Timeline visualization with change previews
- Visual diff comparison (split screen)
- Hover previews for changes
- Expandable panel (520px default, full-width when expanded)

### AI Assistant
**Implementation:** `/src/components/ui/AIAssistant.js`
- Fixed bottom-right (60px button)
- Suggestion cards
- Chat interface (380px window)

## Mobile Adaptations

| Desktop | Tablet | Mobile |
|---------|--------|--------|
| 3-column layout | 2-column | Single column |
| Hover states | Touch areas 44px+ | Bottom sheets |
| Sidebars | Modals | Full screen |
| Inline editing | Focused forms | Step-by-step |

## Performance Optimizations

1. **Use x-show over x-if** for frequently toggled elements
2. **Debounce autosave** at 500ms intervals
3. **Lazy load with hx-trigger="revealed"** for below-fold
4. **Single file components** when possible
5. **CSS transforms** for animations (GPU accelerated)

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] 4.5:1 contrast ratio minimum
- [ ] Focus indicators (2px solid outline)
- [ ] ARIA labels for icon-only buttons
- [ ] Escape key closes modals/dropdowns
- [ ] Error states use icons + color

## Where to Find in Implementation

| Pattern | Location | Description |
|---------|----------|-------------|
| Tab Navigation | `/src/components/layout/TabNavigation.js` | Main navigation tabs with Flow addition |
| Question Builder | `/src/components/questions/QuestionRenderer.js` | Block editor with drag-drop |
| Settings Panel | `/src/components/ui/SettingsPanel.js` | Dynamic contextual settings (380px) |
| Question Types | `/src/components/questions/` | Individual question components |
| Comment System | `/src/components/ui/CommentSidebar.js` | Thread management |
| Version History | `/src/components/ui/VersionHistory.js` | Change tracking UI |
| Flow Editor | `/src/components/ui/FlowEditor.js` | Visual survey flow designer |
| Page Breaks | `/src/components/ui/PageBreak.js` | Hover zones for page insertion |
| Alpine.js Stores | `/src/stores/` | Modular state management |
| Styles | `/src/style.css` | Tailwind + custom CSS |

## New Components in Vite Implementation

### 🔀 Flow Editor
**Implementation:** `/src/components/ui/FlowEditor.js` & `/src/components/pages/FlowPage.js`
- Canvas-based visual flow designer
- Drag-and-drop element palette
- Connection system between elements
- Zoom controls (10% increments)
- Pan functionality
- Element types: Start, End, Block, Branch, Randomizer, Embedded

### 📄 Page Break System
**Implementation:** `/src/components/ui/PageBreak.js`
- Hover zones between questions
- Visual indicator with dashed line
- "+ Add page break" button on hover
- Remove functionality when hovering existing breaks

### 🎮 Keyboard Shortcuts Modal
**Implementation:** `/src/components/ui/KeyboardHelp.js`
- Modal overlay with shortcut reference
- Categorized by action type
- Visual kbd elements

---

*This document provides a complete design system for the Vite-based implementation. All patterns are preserved with updated implementation references.*