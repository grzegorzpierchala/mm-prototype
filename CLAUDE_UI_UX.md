# Mindful Metrics UI/UX Design System

> **🚨 IMPORTANT: Claude must keep this file updated when UI/UX changes are made.**
> **🎨 This document combines frontend architecture with design patterns for a cohesive UI/UX approach**

## Stack & Philosophy

### Technical Stack
- **HTMX**: Server-driven UI, minimal JavaScript
- **TailwindCSS**: Utility-first, fast development
- **Alpine.js**: Sprinkle of reactivity where needed
- **Go Templates**: Type-safe, fast rendering

### Design Philosophy: Notion-Inspired, AI-Enhanced, Ultrathin
- **Block-Based Editing**: Everything is a block, like Notion
- **Slash Commands**: Quick access to all features via `/`
- **Natural Language AI**: Floating chat widget for AI-powered creation
- **Progressive Disclosure**: Complexity hidden until needed
- **Tab-Based Workflow**: Logical organization of feature lifecycle
- **Auto-Save Everything**: Never lose work, no save buttons
- **Delightful Interactions**: Smooth animations and transitions
- **Ultrathin Aesthetic**: Clean, modern design with minimal borders and subtle shadows

## Core Design System

### Visual Design Tokens
```css
:root {
  /* Colors */
  --color-primary: #6366F1;      /* Indigo-500 */
  --color-primary-hover: #4F46E5; /* Indigo-600 */
  --color-secondary: #8B5CF6;     /* Purple-500 */
  --color-success: #10B981;       /* Emerald-500 */
  --color-warning: #F59E0B;       /* Amber-500 */
  --color-error: #EF4444;         /* Red-500 */
  
  /* Typography - Enhanced for readability */
  --font-heading: 'Inter', system-ui;
  --font-body: 'Inter', system-ui;
  --font-mono: 'Fira Code', monospace;
  
  /* Animations */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --duration-micro: 100ms;
  --duration-short: 200ms;
  --duration-medium: 300ms;
  
  /* Shadows - Ultrathin design */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Typography Scale
```
H1: 2rem (32px) - 600 weight - Major sections
H2: 1.5rem (24px) - 600 weight - Page titles
H3: 1.25rem (20px) - 500 weight - Card headers

Body Large: 1.25rem (20px) - Questions, important text
Body Base: 1rem (16px) - All UI text (never 14px)
Body Small: 0.875rem (14px) - Secondary info only
```

### Ultrathin Design Principles
1. **Minimal Borders**: gray-200 max, prefer gray-100
2. **Subtle Shadows**: shadow-sm default, shadow-md on hover only
3. **Generous Spacing**: p-4 minimum for containers
4. **Clean Typography**: 16px base size for all UI text
5. **Smooth Animations**: 200ms transitions, 10px movements

## Universal UI Patterns

### Tab-Based Navigation (All Features)
```html
<!-- Universal tab structure for surveys, interviews, usability tests -->
<div class="bg-white border-b border-gray-200">
    <div class="flex space-x-1 px-4">
        <button class="tab active">Build</button>
        <button class="tab">Preview</button>
        <button class="tab">Share</button>
        <button class="tab" disabled>Results</button>
        <button class="tab" disabled>Analytics</button>
        <button class="tab">Settings</button>
    </div>
</div>
```

**Tab Purposes Across Features**:
- **Build**: Main editor (survey builder, interview script, test tasks)
- **Preview**: Live preview with device frames
- **Share**: Distribution links, embed codes, participant invites
- **Results**: Response data, recordings, session replays
- **Analytics**: Charts, AI insights, heatmaps
- **Settings**: General, design, logic, integrations, danger zone

### Notion-Style Block Editor (Universal)
```html
<!-- Block structure used in all builders -->
<div class="block group relative bg-white rounded-lg mb-2 hover:shadow-sm">
    <div class="block-handle">⋮⋮</div>
    <div class="block-content">
        <!-- Content varies by feature -->
    </div>
    <div class="block-actions opacity-0 group-hover:opacity-100">
        <button class="block-action">+</button>
        <button class="block-action">⋮</button>
        <button class="block-action">🗑</button>
    </div>
</div>
```

### AI Assistant Widget (Universal)
```html
<!-- Floating AI assistant for all features -->
<div class="fixed bottom-6 right-6 z-50">
    <button class="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg flex items-center justify-center">
        <svg class="w-6 h-6 text-white"><!-- Lightning bolt icon --></svg>
    </button>
</div>
```

### Status Management (Universal)
```html
<!-- Header with status dropdown -->
<header class="border-b border-gray-100 px-6 py-4">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <a href="/surveys" class="text-gray-500 hover:text-gray-700">← Back</a>
            <h1 class="text-xl font-semibold">Feature Name</h1>
        </div>
        <div class="flex items-center space-x-4">
            <select class="px-3 py-1.5 bg-gray-100 rounded-md text-base">
                <option>Draft</option>
                <option>Published</option>
                <option>Archived</option>
            </select>
            <span class="text-base text-gray-500">Saved ✓</span>
        </div>
    </div>
</header>
```

## Feature-Specific Patterns

### Survey Builder

#### Question Type Selector
```html
<div x-show="showQuestionTypes" class="mt-4 p-4 bg-gray-50 rounded-lg">
    <h4 class="text-base font-medium text-gray-700 mb-3">Choose Question Type</h4>
    <div class="grid grid-cols-2 gap-3">
        <button @click="addQuestion('multiple_choice')" 
                class="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm text-left">
            <div class="flex items-center mb-1">
                <span class="text-lg mr-2">🔘</span>
                <span class="font-medium">Multiple Choice</span>
            </div>
            <div class="text-sm text-gray-500">Single or multiple selection</div>
        </button>
        <!-- More question types -->
    </div>
</div>
```

#### Enhanced Option Management
```html
<div class="ml-8 mt-4">
    <template x-for="option in question.options">
        <div class="flex items-center space-x-2 mb-2 group">
            <span class="text-gray-300 opacity-0 group-hover:opacity-100">⋮⋮</span>
            <input type="radio" disabled class="text-indigo-600">
            <input x-model="option.text" 
                   placeholder="Option text"
                   class="flex-1 px-3 py-1 border border-gray-200 rounded">
            <button @click="removeOption(option.id)"
                    class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4"><!-- X icon --></svg>
            </button>
        </div>
    </template>
    <button @click="addOption()" class="ml-7 mt-2 text-sm text-indigo-600 font-medium">
        + Add option
    </button>
</div>
```

#### Dynamic Question Settings Panel
```html
<!-- Slide-in settings panel with dynamic content based on question type -->
<div x-show="showSettings && currentQuestion" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75"></div>
    
    <!-- Panel (380px width for better spacing) -->
    <div class="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div class="w-[380px] bg-white shadow-xl flex flex-col">
            <!-- Header -->
            <div class="settings-header">
                <h3 class="text-lg font-semibold text-gray-900">Question Settings</h3>
                <button @click="showSettings = false" class="p-1.5 hover:bg-gray-100 rounded-lg">
                    <svg class="w-5 h-5 text-gray-500"><!-- X icon --></svg>
                </button>
            </div>
            
            <!-- Tab Navigation -->
            <nav class="settings-tabs">
                <button @click="activeTab = 'general'" :class="activeTab === 'general' ? 'active' : ''" class="settings-tab">General</button>
                <button @click="activeTab = 'validation'" :class="activeTab === 'validation' ? 'active' : ''" class="settings-tab">Validation</button>
                <button @click="activeTab = 'display'" :class="activeTab === 'display' ? 'active' : ''" class="settings-tab">Display</button>
                <button @click="activeTab = 'logic'" :class="activeTab === 'logic' ? 'active' : ''" 
                        x-show="['multiple_choice', 'dropdown', 'rating_scale'].includes(question.type)" 
                        class="settings-tab">Logic</button>
            </nav>
            
            <!-- Dynamic Content Based on Question Type -->
            <div class="settings-content overflow-y-auto flex-1">
                <!-- Tab content here -->
            </div>
        </div>
    </div>
</div>
```

##### Settings Panel Styles
```css
/* Header */
.settings-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

/* Tab Navigation */
.settings-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background: #fafafa;
    flex-shrink: 0;
}

.settings-tab {
    flex: 1;
    padding: 12px 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.settings-tab:hover {
    color: #4b5563;
    background: #f3f4f6;
}

.settings-tab.active {
    color: #4f46e5;
    background: white;
    border-bottom-color: #4f46e5;
}

.settings-content {
    padding: 24px;
}

.settings-section {
    margin-bottom: 24px;
}

.settings-section-title {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    margin-bottom: 16px;
}
```

##### Toggle Switch Component
```html
<!-- Settings Panel Usage (Full Size) -->
<div class="flex items-center justify-between">
    <div>
        <h4 class="text-base font-medium text-gray-900">Required Question</h4>
        <p class="text-sm text-gray-500 mt-1">Respondents must answer this question</p>
    </div>
    <label class="toggle-switch">
        <input type="checkbox" x-model="question.required">
        <span class="toggle-slider"></span>
    </label>
</div>

<!-- Quick Settings/Inline Usage (Compact Size) -->
<div class="flex items-center space-x-4 text-sm text-gray-600">
    <label class="flex items-center space-x-2 cursor-pointer">
        <span class="toggle-switch toggle-switch-sm">
            <input type="checkbox" x-model="question.required">
            <span class="toggle-slider"></span>
        </span>
        <span>Required</span>
    </label>
    <button class="hover:text-gray-700">Add Logic</button>
    <button class="hover:text-gray-700">Duplicate</button>
</div>
```

```css
/* Toggle Switch Styles */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: .2s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .2s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .toggle-slider {
    background-color: #6366f1;
}

input:checked + .toggle-slider:before {
    transform: translateX(20px);
}

/* Smaller toggle switch for inline/compact usage */
.toggle-switch-sm {
    width: 36px;
    height: 20px;
}

.toggle-switch-sm .toggle-slider:before {
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
}

.toggle-switch-sm input:checked + .toggle-slider:before {
    transform: translateX(16px);
}
```

##### Visual Radio Cards
```html
<!-- Display Format Selection -->
<div class="display-format-grid">
    <label class="display-format-card" :class="{ 'selected': question.settings.displayFormat === 'list' }">
        <input type="radio" name="displayFormat" value="list" x-model="question.settings.displayFormat">
        <div class="display-format-icon">
            <svg><!-- List icon --></svg>
        </div>
        <div class="display-format-label">List</div>
    </label>
    <!-- More format options -->
</div>
```

```css
/* Visual Radio Cards */
.display-format-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 12px;
}

.display-format-card {
    position: relative;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.display-format-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.display-format-card.selected {
    border-color: #6366f1;
    background-color: #eef2ff;
}

.display-format-card input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.display-format-icon {
    width: 32px;
    height: 32px;
    margin: 0 auto 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.display-format-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}
```

##### Question Type-Specific Settings Examples

**Multiple Choice Settings:**
```html
<!-- Display Tab Content for Multiple Choice -->
<div x-show="activeTab === 'display' && question.type === 'multiple_choice'">
    <div class="settings-section">
        <h4 class="settings-section-title">Display Options</h4>
        
        <!-- Allow Multiple Toggle -->
        <div class="flex items-center justify-between mb-4">
            <div>
                <h4 class="text-base font-medium text-gray-900">Multiple Selection</h4>
                <p class="text-sm text-gray-500 mt-1">Allow selecting multiple options</p>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" x-model="question.settings.allowMultiple">
                <span class="toggle-slider"></span>
            </label>
        </div>
        
        <!-- Randomize Toggle -->
        <div class="flex items-center justify-between">
            <div>
                <h4 class="text-base font-medium text-gray-900">Randomize Options</h4>
                <p class="text-sm text-gray-500 mt-1">Show options in random order</p>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" x-model="question.settings.randomizeOptions">
                <span class="toggle-slider"></span>
            </label>
        </div>
    </div>
    
    <div class="settings-section">
        <h4 class="settings-section-title">Display Format</h4>
        <div class="display-format-grid">
            <!-- Visual radio cards here -->
        </div>
    </div>
</div>
```

**Text Input Settings:**
```html
<!-- Display Tab Content for Text Input -->
<div x-show="activeTab === 'display' && question.type === 'text_input'">
    <div class="settings-section">
        <h4 class="settings-section-title">Input Type</h4>
        <select x-model="question.settings.inputType" class="w-full px-3 py-2 border border-gray-200 rounded-lg">
            <option value="text">Single line</option>
            <option value="textarea">Multi-line</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="url">URL</option>
            <option value="tel">Phone</option>
        </select>
    </div>
    
    <div class="settings-section">
        <h4 class="settings-section-title">Placeholder</h4>
        <input type="text" x-model="question.settings.placeholder" 
               placeholder="Enter placeholder text..."
               class="w-full px-3 py-2 border border-gray-200 rounded-lg">
    </div>
    
    <div class="settings-section" x-show="question.settings.inputType === 'textarea'">
        <h4 class="settings-section-title">Text Area Rows</h4>
        <input type="number" x-model="question.settings.rows" 
               min="2" max="10" placeholder="4"
               class="w-full px-3 py-2 border border-gray-200 rounded-lg">
    </div>
</div>
```

**Key Features**:
- **Progressive Disclosure**: Only show relevant settings for each question type
- **Consistent Layout**: Same visual structure across all 30+ question types
- **Toggle Switches**: Binary options use modern toggle switches with descriptive text
- **Visual Radio Cards**: Display formats use visual cards in a 2x2 grid with icons
- **Tabbed Organization**: Group related settings (General, Validation, Display, Logic)
- **Conditional Tab Display**: Logic tab only shows for question types that support it
- **Responsive Design**: Slide-in panel on desktop, full-screen modal on mobile
- **Ultrathin Aesthetic**: Minimal borders, subtle shadows, generous spacing

##### Progressive Disclosure Rules

**Tab Visibility by Question Type:**
- **General Tab**: Always visible for all question types
- **Validation Tab**: Always visible for all question types
- **Display Tab**: Always visible for all question types
- **Logic Tab**: Only visible for:
  - `multiple_choice`
  - `dropdown`
  - `rating_scale`
  - `matrix`
  - `ranking`

**Settings Content by Question Type:**

| Question Type | General Tab | Validation Tab | Display Tab | Logic Tab |
|--------------|-------------|----------------|-------------|------------|
| Multiple Choice | Question text, Required toggle | Min/max selections, Error messages | Multiple selection toggle, Randomize toggle, Display format cards | Conditional logic, Skip logic |
| Text Input | Question text, Required toggle | Character limit, Pattern regex, Error messages | Input type dropdown, Placeholder, Rows (for textarea) | N/A |
| Rating Scale | Question text, Required toggle | Required error message | Scale type (stars/numbers), Min/max values | Conditional logic |
| Yes/No | Question text, Required toggle | Required error message | Button style, Default value | Conditional logic |
| Dropdown | Question text, Required toggle | Required error message | Placeholder text, Search enable toggle | Conditional logic |
| Matrix | Question text, Required toggle | Required rows/columns | Grid layout options | Conditional logic |
| Date/Time | Question text, Required toggle | Date range, Time constraints | Format display, Calendar options | N/A |
| File Upload | Question text, Required toggle | File types, Max size | Multiple files toggle, Drag-drop enable | N/A |

### Interview Builder

#### Script Sections
```html
<div class="space-y-4">
    <!-- Introduction Section -->
    <div class="block">
        <h3 class="font-medium mb-2">Introduction</h3>
        <textarea x-model="script.introduction" 
                  placeholder="Welcome the participant..."
                  class="w-full p-3 border border-gray-200 rounded-lg"></textarea>
    </div>
    
    <!-- Question Blocks -->
    <template x-for="section in script.sections">
        <div class="block">
            <input x-model="section.title" 
                   placeholder="Section title"
                   class="font-medium mb-2">
            <!-- Questions within section -->
        </div>
    </template>
</div>
```

### Usability Test Builder

#### Task Cards
```html
<div class="space-y-3">
    <template x-for="task in test.tasks">
        <div class="bg-white rounded-lg border border-gray-100 p-4">
            <div class="flex items-start space-x-3">
                <span class="text-gray-400">⋮⋮</span>
                <div class="flex-1">
                    <input x-model="task.title" 
                           placeholder="Task title"
                           class="font-medium mb-2">
                    <textarea x-model="task.description" 
                              placeholder="What should the user do?"
                              class="w-full text-sm"></textarea>
                    <div class="mt-3 flex items-center space-x-4 text-sm">
                        <label>
                            <input type="checkbox" x-model="task.required">
                            Required
                        </label>
                        <input x-model="task.successCriteria" 
                               placeholder="Success criteria"
                               class="flex-1">
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
```

## Component Library

### Base Components (Used Everywhere)

#### Buttons
```css
.btn-primary {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
         focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg 
         hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 
         focus:ring-offset-2 transition-colors;
}

.btn-danger {
  @apply w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 
         transition-colors font-medium;
}
```

#### Cards
```html
<div class="bg-white rounded-lg shadow-sm border border-gray-100">
    <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-lg font-medium">Card Title</h3>
    </div>
    <div class="px-6 py-4">
        <!-- Content -->
    </div>
</div>
```

#### Form Inputs
```html
<div class="form-group">
    <label class="block text-base font-medium text-gray-700 mb-1.5">Label</label>
    <input type="text" 
           class="w-full px-3 py-2 border border-gray-200 rounded-lg 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
    <p class="mt-1 text-sm text-gray-500">Help text</p>
</div>
```

**Important Input Styling Notes:**
- Always use `border-gray-200` for input borders (not gray-300 or darker)
- Use `rounded-lg` for consistency (not rounded-md)
- Apply the same classes to `<input>`, `<select>`, and `<textarea>` elements
- The `focus:border-transparent` is crucial to prevent double borders with the focus ring

## HTMX Patterns

### Dynamic Loading
```html
<!-- Load content on page load -->
<div hx-get="/api/surveys/{{.ID}}/questions"
     hx-trigger="load"
     hx-swap="innerHTML">
    <div class="animate-pulse">Loading...</div>
</div>
```

### Inline Editing
```html
<!-- Click to edit pattern -->
<h3 hx-get="/api/{{.Type}}/{{.ID}}/edit-title"
    hx-trigger="click"
    hx-target="this"
    hx-swap="outerHTML"
    class="cursor-pointer hover:text-indigo-600">
    {{.Title}}
</h3>
```

### Real-time Search
```html
<input type="search" 
       name="q"
       hx-post="/api/search"
       hx-trigger="keyup changed delay:500ms"
       hx-target="#search-results"
       placeholder="Search...">
```

## Alpine.js Patterns

### Complex Data Initialization (Best Practice)
```javascript
// Define function BEFORE Alpine loads
window.featureBuilderData = function() {
    return {
        // State
        data: { /* matches backend schema */ },
        showSettings: false,
        saveStatus: 'saved',
        
        // Methods
        init() {
            // Initialize
        },
        
        async autosave() {
            this.saveStatus = 'saving';
            const response = await fetch('/api/save', {
                method: 'POST',
                body: JSON.stringify(this.data)
            });
            this.saveStatus = response.ok ? 'saved' : 'error';
        }
    }
}
```

### Modal Pattern
```html
<div x-data="{ open: false }" @keydown.escape="open = false">
    <button @click="open = true">Open Modal</button>
    
    <div x-show="open" 
         x-transition
         class="fixed inset-0 bg-black bg-opacity-50 z-50"
         @click="open = false">
        <div @click.stop class="bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
            <!-- Modal content -->
        </div>
    </div>
</div>
```

## Mobile Patterns

### Responsive Layout
```
Desktop (>1200px)     Tablet (768-1200px)    Mobile (<768px)
┌───┬────────┬───┐    ┌───┬────────────┐     ┌────────────┐
│ S │ Content│ P │    │ S │  Content   │     │  Content   │
│ i │        │ r │ →  │ i │            │  →  │            │
│ d │        │ o │    │ d │            │     ├────────────┤
│ e │        │ p │    └───┴────────────┘     │  Actions   │
└───┴────────┴───┘                           └────────────┘
```

### Touch Optimizations
- Minimum touch targets: 44x44px
- Swipe gestures for navigation
- Bottom sheets for mobile actions
- Sticky headers with key actions

## Performance Guidelines

### Simplicity First
- Single file components when possible
- Direct data binding over state management
- Schema-driven development
- Progressive enhancement

### Loading States
```html
<!-- Skeleton loader -->
<div class="animate-pulse">
    <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

### Optimization Checklist
- [ ] Use `hx-trigger="revealed"` for below-fold content
- [ ] Implement debounced autosave (500ms)
- [ ] Add loading indicators for all async operations
- [ ] Use CSS transforms for animations (GPU accelerated)
- [ ] Lazy load heavy components

## Accessibility Standards

### Keyboard Navigation
- Tab order follows visual hierarchy
- All interactive elements keyboard accessible
- Escape closes modals/dropdowns
- Arrow keys navigate within groups

### ARIA Requirements
```html
<!-- Properly labeled components -->
<button aria-label="Delete question" class="btn-icon">
    <svg aria-hidden="true"><!-- Icon --></svg>
</button>

<!-- Live regions for updates -->
<div aria-live="polite" aria-atomic="true">
    <span x-text="saveStatus"></span>
</div>
```

### Visual Accessibility
- 4.5:1 contrast ratio minimum
- Focus indicators: 2px solid outline
- Error states use icons + color
- Reduced motion respected

## Directory Structure
```
web/
├── templates/
│   ├── layouts/           # Base layouts
│   ├── partials/          # Reusable components
│   ├── pages/             # Full pages
│   └── components/        # UI component library
└── static/
    ├── css/              # Tailwind files
    ├── js/               # Alpine components
    └── images/           # Static assets
```

## Implementation Philosophy

### When to Keep It Simple
✅ CRUD operations (90% of features)
✅ Single user context
✅ Direct data mapping UI ↔ Backend
✅ Standard form interactions
✅ Performance critical

### When to Add Complexity
⚠️ Real-time collaboration
⚠️ Complex state machines
⚠️ Heavy animations
⚠️ Offline-first requirements
⚠️ Undo/redo functionality

### Settings Panel Best Practices
- **Width**: Use 380px for settings panels (not 320px or 448px) for optimal content spacing
- **Layout**: Use `flex flex-col` for proper section organization
- **Headers**: Include both title and close button with proper padding (20px 24px)
- **Tabs**: Show/hide tabs based on question capabilities, not just content
- **Toggles**: Always include descriptive text alongside toggle switches. Use standard size (44x24px) in settings panels, compact size (36x20px) for inline/quick settings
- **Cards**: Use 2-column grid for visual selection options
- **Sections**: Use uppercase section titles with proper spacing (13px font, 0.05em letter-spacing)
- **Delete Actions**: Always place destructive actions at the bottom with danger styling

### The Power of Simplicity
Our survey editor went from 47 files (50,000+ lines) to 1 file (400 lines):
- Direct data binding
- Schema-driven structure
- No state management layers
- 90% faster load times
- Instant developer onboarding

## Next Evolution

As we build new features (interviews, usability tests, etc.), we maintain:
1. **Consistent Patterns**: Same tabs, blocks, and interactions
2. **Ultrathin Aesthetic**: Clean, minimal, fast
3. **AI-First**: Natural language available everywhere
4. **Progressive Enhancement**: Start simple, enhance as needed
5. **User Delight**: Smooth animations, smart defaults

---

*This unified document ensures consistent UI/UX across all Mindful Metrics features while maintaining our commitment to simplicity and user experience.*