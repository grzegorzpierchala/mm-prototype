# CSS Comparison: style.css vs originalStyles.css

## 1. DUPLICATE CLASSES WITH DIFFERENCES

### `.comment-indicator`
**style.css (lines 59-67):**
```css
position: absolute;
right: -40px;
top: 16px;
cursor: pointer;
opacity: 0;
transition: opacity 0.2s;
z-index: 10;
```

**originalStyles.css (lines 4-16):**
```css
position: absolute;
right: -40px;
top: 16px;
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
opacity: 0;
transition: opacity 0.2s;
```

**Differences:** originalStyles.css adds `width: 32px`, `height: 32px`, `display: flex`, `align-items: center`, `justify-content: center`. style.css adds `z-index: 10`.

### `.comment-bubble`
**style.css (lines 1509-1522):**
```css
width: 28px;
height: 28px;
border-radius: 50%;
background: #f3f4f6;
display: flex;
align-items: center;
justify-content: center;
transition: all 0.2s;
cursor: pointer;
position: relative;
```

**originalStyles.css (lines 23-33):**
```css
width: 28px;
height: 28px;
border-radius: 50%;
background: #f3f4f6;
display: flex;
align-items: center;
justify-content: center;
transition: all 0.2s;
position: relative;
```

**Differences:** style.css adds `cursor: pointer`.

### `.comment-count`
**style.css (lines 1550-1567):**
```css
position: absolute;
top: -4px;
right: -4px;
background: #ef4444;
color: white;
font-size: 11px;
font-weight: 600;
padding: 1px 5px;
border-radius: 10px;
min-width: 18px;
height: 18px;
display: flex;
align-items: center;
justify-content: center;
line-height: 1;
text-align: center;
```

**originalStyles.css (lines 50-62):**
```css
position: absolute;
top: -4px;
right: -4px;
background: #ef4444;
color: white;
font-size: 11px;
font-weight: 600;
padding: 2px 5px;
border-radius: 10px;
min-width: 18px;
text-align: center;
```

**Differences:** style.css changes padding to `1px 5px` (vs `2px 5px`), adds `height: 18px`, `display: flex`, `align-items: center`, `justify-content: center`, `line-height: 1`.

### `.question-option`
**style.css (lines 1314-1329):**
```css
display: flex;
align-items: center;
gap: 12px;
padding: 8px 0;
background: transparent;
border: none;
transition: background 0.2s ease;
position: relative;
margin-left: -8px;
margin-right: -8px;
padding-left: 8px;
padding-right: 8px;
border-radius: 6px;
```

**originalStyles.css (lines 65-77):**
```css
position: relative;
display: flex;
align-items: center;
gap: 8px;
margin-bottom: 8px;
padding: 8px;
padding-left: 40px;
padding-right: 40px;
background: transparent;
border-radius: 6px;
transition: all 0.2s;
```

**Differences:** 
- gap: `12px` vs `8px`
- padding: `8px 0` + padding-left/right: `8px` vs `8px` + padding-left/right: `40px`
- transition: `background 0.2s ease` vs `all 0.2s`
- originalStyles.css has `margin-bottom: 8px`
- style.css has `border: none`, negative margins

### `.question-option:hover`
**style.css (lines 1332-1334):**
```css
background: #F9FAFB;
```

**originalStyles.css (lines 84-86):**
```css
background: #f3f4f6;
```

**Differences:** Different background colors - `#F9FAFB` vs `#f3f4f6`

### `.option-drag-handle`
**style.css (lines 1346-1352):**
```css
cursor: move;
color: #9CA3AF;
opacity: 0;
transition: opacity 0.2s ease;
```

**originalStyles.css (lines 88-98):**
```css
position: absolute;
left: 8px;
top: 50%;
transform: translateY(-50%);
color: #9ca3af;
cursor: move;
padding: 4px;
opacity: 0;
transition: opacity 0.2s;
```

**Differences:** originalStyles.css adds positioning (`position: absolute`, `left: 8px`, `top: 50%`, `transform: translateY(-50%)`), `padding: 4px`

### `.add-option-button`
**style.css (lines 1390-1408):**
```css
display: flex;
align-items: center;
gap: 8px;
width: 100%;
padding: 12px;
border: 2px dashed #E5E7EB;
border-radius: 8px;
color: #6B7280;
background: transparent;
cursor: pointer;
transition: all 0.2s ease;
```

**originalStyles.css (lines 125-138):**
```css
display: flex;
align-items: center;
gap: 8px;
padding: 8px 12px;
color: #6366f1;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s;
background: transparent;
border: none;
outline: none;
```

**Differences:** Completely different styling approach - style.css uses dashed border design, originalStyles.css uses minimal text button design

### `.block-handle`
**style.css (lines 23-25):**
```css
@apply opacity-0 transition-opacity;
```

**originalStyles.css (lines 147-150):**
```css
opacity: 0;
transition: opacity 0.2s;
```

**Differences:** style.css uses Tailwind `@apply`, originalStyles.css uses plain CSS

### `.settings-panel`
**style.css (lines 41-43, 230-232):**
```css
@apply fixed right-0 top-0 w-96 h-full bg-white border-l border-gray-200 shadow-lg transform translate-x-full transition-transform z-50 flex flex-col;
/* Later: */
width: 380px;
```

**originalStyles.css (lines 163-177):**
```css
position: fixed;
right: 0;
top: 0;
width: 380px;
height: 100vh;
background: white;
border-left: 1px solid #e5e7eb;
box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
transform: translateX(100%);
transition: transform 0.3s ease-out;
z-index: 50;
display: flex;
flex-direction: column;
```

**Differences:** Different widths (w-96/384px then overridden to 380px vs 380px), different shadows, different transition timing

### `.settings-panel.show`
**style.css (lines 45-47):**
```css
@apply translate-x-0;
```

**originalStyles.css (lines 179-181):**
```css
transform: translateX(0);
```

**Differences:** style.css uses Tailwind, same effect

### `.question-card`
**style.css (lines 32-34):**
```css
@apply bg-white border border-gray-200 rounded-lg p-4 mb-3 relative transition-all;
```

**originalStyles.css (lines 246-254):**
```css
background: white;
border: 1px solid #e5e7eb;
border-radius: 8px;
padding: 16px;
margin-bottom: 12px;
position: relative;
transition: all 0.2s;
```

**Differences:** style.css uses Tailwind classes, originalStyles.css uses plain CSS

### `.toggle-switch`
**style.css (lines 93-98):**
```css
position: relative;
display: inline-block;
width: 44px;
height: 24px;
```

**originalStyles.css (lines 330-335):**
```css
position: relative;
display: inline-block;
width: 44px;
height: 24px;
```

**Differences:** Identical

### `.kbd`
**style.css (lines 971-982):**
```css
display: inline-block;
padding: 2px 6px;
font-size: 11px;
font-weight: 500;
line-height: 1;
color: #374151;
background-color: #F3F4F6;
border: 1px solid #D1D5DB;
border-radius: 4px;
font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

**originalStyles.css (lines 319-327, 652-668):**
```css
/* First definition: */
background: #f3f4f6;
border: 1px solid #d1d5db;
border-radius: 4px;
padding: 2px 6px;
font-size: 14px;
font-family: monospace;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);

/* Second definition: */
display: inline-flex;
align-items: center;
justify-content: center;
padding: 3px 8px;
min-width: 24px;
height: 24px;
font-size: 12px;
font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
color: #374151;
background-color: #f3f4f6;
border: 1px solid #e5e7eb;
border-radius: 4px;
box-shadow: 0 1px 0 0 #e5e7eb;
margin: 0 2px;
line-height: 1;
```

**Differences:** originalStyles.css has two different definitions with different styling

### `.display-format-grid`
**style.css (lines 289-293):**
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
```

**originalStyles.css (lines 395-400):**
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 12px;
margin-top: 12px;
```

**Differences:** originalStyles.css adds `margin-top: 12px`

### `.question-type-dropdown`
**style.css (lines 1411-1423):**
```css
position: absolute;
top: 100%;
left: 0;
z-index: 50;
margin-top: 8px;
width: 300px;
background: white;
border: 1px solid #E5E7EB;
border-radius: 12px;
box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
overflow: hidden;
```

**originalStyles.css (lines 445-458):**
```css
position: absolute;
top: 100%;
left: 0;
margin-top: 6px;
width: 260px;
max-height: 380px;
background: white;
border: 1px solid #e5e7eb;
border-radius: 12px;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
overflow: hidden;
z-index: 50;
```

**Differences:** Different widths (300px vs 260px), different shadows, margin-top (8px vs 6px), originalStyles.css has max-height

## 2. CLASSES UNIQUE TO originalStyles.css

### Block and animation classes:
- `.block` (animation)
- `.block-actions`
- `@keyframes fadeIn`
- `@keyframes slideUp`
- `@keyframes diffPulse`

### Option-specific classes:
- `.option-remove`
- `.question-option input[type="text"]`

### Settings panel variations:
- `.settings-tab:hover`

### Question card variations:
- `.question-card.selected`

### Toggle switch variations:
- `.toggle-switch input[type="checkbox"]`

### Visual radio card details:
- `.display-format-card input[type="radio"]`

### Question type dropdown specific:
- `.question-type-dropdown-content` (different from style.css)
- `.question-type-section` (different styling)
- `.question-type-section:first-child`
- `.question-type-section:last-child`
- `.question-type-section + .question-type-section`
- `.question-type-item` (vs `.question-type-option` in style.css)
- `.question-type-item:hover`
- `.question-type-item.highlighted`
- `.question-type-item:hover::before`
- `.question-type-item.highlighted::before`
- `.question-type-item-icon`
- `.question-type-item:hover .question-type-item-icon`
- `.question-type-item.highlighted .question-type-item-icon`
- `.question-type-item-name`
- `.question-type-item:hover .question-type-item-name`
- `.question-type-item.highlighted .question-type-item-name`
- `.question-type-star`

### Collaboration features:
- `.collab-avatars`
- `.collab-avatar`
- `.collab-avatar:not([class*="bg-"])`
- `.collab-avatar:first-child`
- `.collab-avatar:nth-child(1-4)`
- `.activity-dot`

### Version badge variations:
- `.version-badge:hover`
- `.version-badge span:first-child`

### Input styling:
- `.question-text-input`
- `.question-text-input:focus`

### Other unique classes:
- `.save-indicator`
- `.option-drag-handle:hover`

## 3. KEY RECOMMENDATIONS

1. **Use originalStyles.css versions for these classes** (they have more complete styling):
   - `.comment-indicator` (adds flexbox centering)
   - `.comment-count` (better flexbox alignment)
   - `.question-option` (proper padding for drag handles)
   - `.option-drag-handle` (includes positioning)
   - `.add-option-button` (if you want the minimal text button style)
   - `.question-type-dropdown` and all related classes

2. **Add missing classes from originalStyles.css**:
   - All collaboration avatar styles
   - Block animations
   - Question type dropdown item styles
   - Option remove button styles

3. **Resolve conflicts**:
   - `.kbd` has two different definitions in originalStyles.css
   - Settings panel width (380px vs 384px/w-96)
   - Background colors for hover states