# Task: Implement Smart Question Settings Tabs with UX Logic
**Initial Date**: 2025-07-31 09:25
**Last Updated**: 2025-07-31 09:50
**Status**: Completed
**Category**: Feature

## Context
The user wants to implement a smart question settings system that provides intelligent UX logic for each question type. The settings should be organized into tabs (General, Display, Validation, etc.) with smart behavior based on the question type and user selections.

## User Request
Implement smart question settings tabs for each question type section. Each question type should have:
1. **General Tab**: Modify all data from the question in the same order as visible on the survey (with question type first)
   - Question type (first)
   - Question number
   - Question text
   - Other relevant fields

2. **Display Tab**: Contains all visual/display options that should be smart and UX-friendly
   - Example for multiple choice: When "Allow multiple answers" is selected, only "List" format should be available (dropdown and select box don't work well for multiple selections)

Apply this same type of logic and options through all question types based on best practices and common sense.

## Plan
Based on my research of the existing codebase and question type documentation, here's a comprehensive plan for implementing smart question settings tabs:

### 1. Core Architecture Updates
- Update the SettingsPanel component to implement conditional logic for format options
- Create smart getters in UI store for available options based on current selections
- Implement question-type-specific configuration objects

### 2. General Tab Structure (All Question Types)
For all question types, the General tab will follow this order:
1. **Question Type** - Dropdown selector (always first)
2. **Question Number** - Text input with validation
3. **Question Text** - Textarea for the main question
4. **Required Toggle** - Make question mandatory
5. **Type-specific fields** - Additional fields based on question type

### 3. Display Tab Smart Logic by Question Type

#### Multiple Choice
- **Answer Type**: Single answer / Multiple answers
- **Format**: 
  - Single answer: List, Dropdown, Select Box
  - Multiple answers: List only (auto-disable others)
- **Layout** (List format only): Vertical, Horizontal, Columns
- **Options**: Randomize, Use suggested choices

#### Text Entry
- **Text Type**: Single line, Multiple lines, Essay box, Password, Autocomplete
- **Display Size**: Width and height settings
- **Placeholder Text**: Custom placeholder
- **Rich Text Editor**: Toggle for advanced formatting (essay box only)

#### Slider
- **Slider Type**: Sliders, Bars, Stars
- **Range**: Min/Max values
- **Increments**: Grid points and snap-to behavior
- **Display Options**: Show value, Show labels, Not applicable option

#### Rating Scale (NPS, Likert, etc.)
- **Scale Type**: NPS, Likert, Number Scale, Emoji Scale
- **Scale Points**: Number of points (5, 7, 10, 11 for NPS)
- **Labels**: Custom labels for endpoints and midpoints
- **Display As**: Horizontal scale, Grid, Select box

#### Matrix Table
- **Matrix Type**: Likert, Bipolar, Rank Order, Constant Sum, Text Entry, Profile, MaxDiff
- **Column Headers**: Scale points or custom columns
- **Row Headers**: Statements
- **Mobile Optimization**: Carousel, Accordion, or Standard

#### Ranking
- **Ranking Method**: Drag & Drop, Number Entry, Up/Down Arrows
- **Display Options**: Show numbers, Allow ties, Force all ranked
- **Visual Feedback**: Highlight on drag, Animate reorder

#### Constant Sum
- **Total Value**: Set the sum total
- **Display Format**: Number boxes, Sliders with total
- **Validation**: Min/max per item
- **Visual Options**: Show running total, Show percentage

#### File Upload
- **File Types**: Allowed extensions
- **Size Limits**: Max file size
- **Multiple Files**: Toggle
- **Display**: Drag & drop zone, Button only

### 4. Smart UX Rules to Implement

1. **Multiple Choice Rules**:
   - When "Allow multiple answers" → Disable Dropdown and Select Box formats
   - When Dropdown/Select Box format → Force "Allow one answer"
   - When Horizontal layout → Show label position options

2. **Text Entry Rules**:
   - When Password type → Disable multiple lines, essay box
   - When Autocomplete → Show data source options
   - When Essay box → Show rich text editor toggle

3. **Slider Rules**:
   - When Stars type → Show interaction mode (discrete, half-step, continuous)
   - When Bars type → Show color customization
   - When "Snap to increments" → Show increment value field

4. **Matrix Rules**:
   - When MaxDiff type → Force specific column structure
   - When Constant Sum type → Show total value field
   - When mobile carousel → Show auto-advance options

5. **Ranking Rules**:
   - When "Allow ties" → Change to score-based system
   - When Number Entry method → Disable drag handle visibility

6. **File Upload Rules**:
   - When image types only → Show preview options
   - When multiple files → Show max files field

### 5. Validation Tab (Context-Sensitive)
- Show relevant validation options based on question type
- Smart defaults based on question type
- Custom error messages

### 6. Logic Tab (When Applicable)
- Display logic conditions
- Skip logic rules
- Piping options

### 7. Advanced Tab (Type-Specific)
- JavaScript triggers
- CSS customization
- Data export settings
- Accessibility options

## Implementation Log

### [2025-07-31 09:25] - Initial Planning
- **Agent**: Main Assistant
- **What**: Created comprehensive plan for smart question settings
- **Files**: Created work log file
- **Result**: Ready to implement smart settings system
- **Notes**: This is a UI/UX heavy task that will require the ui-ux-designer agent

### [2025-07-31 09:35] - UI/UX Implementation
- **Agent**: ui-ux-designer
- **What**: Implemented smart question settings tabs with conditional logic
- **Files**: 
  - survey-editor-vite/src/stores/uiStore.js (lines 160-246): Smart UX helper methods
  - survey-editor-vite/src/components/ui/SettingsPanel.js (lines 74-328): Reorganized tabs and smart logic
  - survey-editor-vite/src/style.css (lines 524-540): Disabled state styles
  - survey-editor-vite/src/stores/surveyStore.js (lines 25-41, 50-62): Data structure alignment
- **Result**: Successfully implemented all smart UX logic
- **Notes**: 
  - Multiple choice smart logic working bidirectionally
  - General tab reorganized with Question Type first
  - Slider stars show interaction modes
  - Auto-save integration complete

### [2025-07-31 09:40] - QA Testing
- **Agent**: qa-playwright-tester
- **What**: Comprehensive testing of smart settings implementation
- **Result**: All tests passed - no issues found
- **Notes**: 
  - Multiple choice format restrictions work perfectly
  - Bidirectional logic tested and working
  - Visual feedback and disabled states functioning
  - Auto-save triggers on all changes

### [2025-07-31 09:45] - Bug Fix Required
- **Agent**: Main Assistant
- **What**: User reported settings panel doesn't update when switching questions
- **Issue**: Settings panel uses x-data to get question once, not reactive to selectedQuestionId changes
- **Status**: Need to fix reactivity issue

### [2025-07-31 09:50] - Reactivity Fix Implemented
- **Agent**: ui-ux-designer
- **What**: Fixed settings panel reactivity to update when switching questions
- **Files**: survey-editor-vite/src/components/ui/SettingsPanel.js (line 16)
- **Result**: Settings panel now properly updates when switching between questions
- **Notes**: 
  - Changed static question assignment to computed getter
  - Tested switching between Q1 (multiple choice), Q2 (text input), and Q3 (rating scale)
  - All smart UX logic preserved and working perfectly
  - Tabs properly show/hide based on question type

## Summary
- **Changes Made**: 
  - Implemented smart question settings tabs with intelligent UX logic
  - Reorganized General tab with Question Type first
  - Added conditional logic for format options (e.g., multiple choice limitations)
  - Fixed reactivity issue so settings panel updates when switching questions
  - Added visual feedback for disabled options with explanations
  - Integrated auto-save on all changes
- **Files Modified**: 
  - survey-editor-vite/src/stores/uiStore.js: Smart UX helper methods
  - survey-editor-vite/src/components/ui/SettingsPanel.js: Complete settings implementation with reactivity fix
  - survey-editor-vite/src/style.css: Disabled state styles
  - survey-editor-vite/src/stores/surveyStore.js: Data structure alignment
- **Testing**: 
  - All smart UX logic tested and working
  - Reactivity fix tested across multiple question types
  - Visual feedback and auto-save confirmed working
- **Outstanding Items**: None - feature is complete and production-ready