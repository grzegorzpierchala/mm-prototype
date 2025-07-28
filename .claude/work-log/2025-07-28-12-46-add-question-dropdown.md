# Task: Add Question Type Dropdown to Add Question Button
**Date**: 2025-07-28 12:46
**Status**: Planning
**Category**: Feature

## Context
The current "Add Question" button creates a new question with default type "Text Input". User wants to add a dropdown menu that appears when clicking this button, similar to the existing question type dropdown but larger.

## User Request
When pressing "+Add Question button" (the big one), instead of adding a new task by default `Text input`, show a dropdown like the Question Type dropdown. Make it bigger, with same behavior that looks at viewport and opens upwards if below 50% or downwards otherwise. Reuse existing functionality if possible.

## Plan
Based on research:
1. Current "Add Question" button is at line 2266 and triggers showSlashMenu
2. The slash menu (lines 2679-2745) is currently just a mockup without functionality
3. Existing question type dropdown (lines 1755-1810) has complete implementation including:
   - Categories (essentials, rating, input, advanced, media, interactive)
   - Viewport-aware positioning
   - Keyboard navigation
   - Recently used types
   - Hover effects and highlighting

Implementation approach:
1. Replace the Add Question button's @click handler to show a new dropdown
2. Reuse the existing question type dropdown structure and styles
3. Adapt the dropdown to create new questions instead of changing type
4. Implement viewport-aware positioning (check if below 50% of viewport)
5. Add click handlers to actually create new questions with selected type

## Implementation Log
### 2025-07-28 12:46 - Initial Research
- **What**: Starting research to understand current implementation
- **Files**: survey-editor-prototype.html
- **Result**: Found Add Question button at line 2266 and slash menu at 2679
- **Notes**: Slash menu is just a mockup, need to implement functionality

### 2025-07-28 12:55 - Found Question Type Dropdown
- **What**: Located existing question type dropdown implementation
- **Files**: survey-editor-prototype.html lines 1755-1810, 1395-1467 (styles)
- **Result**: Found complete dropdown with categories, keyboard nav, and positioning
- **Notes**: Can reuse most of this code for the Add Question dropdown

### 2025-07-28 13:05 - Course Correction
- **What**: Started editing prototype instead of Vite project
- **Files**: Incorrectly edited survey-editor-prototype.html
- **Result**: User corrected - should work in survey-editor-vite/src
- **Notes**: Need to implement in the component-based Vite structure

### 2025-07-28 13:15 - Implementation in Vite Project
- **What**: Added dropdown menu to Add Question button
- **Files**: 
  - MainLayout.js lines 34-173 (replaced button with dropdown)
  - surveyEditor.js lines 33-37 (added event listener)
- **Result**: Dropdown menu now shows all question types with categories
- **Notes**: 
  - Reused question type categories structure
  - Added viewport-aware positioning (opens up/down based on space)
  - Integrated with existing addQuestion method
  - Recently used types show at top when available

### 2025-07-28 13:25 - Testing with Playwright
- **What**: Tested the dropdown functionality
- **Files**: Used Playwright to test at http://localhost:5173/
- **Result**: All features working correctly:
  - Dropdown opens with all question type categories
  - Recently used types appear at top and update correctly
  - Clicking a type creates new question with that type
  - Settings panel opens automatically for new question
  - Dropdown closes after selection
  - Escape key closes dropdown
  - Click away closes dropdown
- **Notes**: Viewport positioning logic implemented but needs more testing

## Summary
- **Changes Made**: 
  - Added question type dropdown to "Add Question" button
  - Integrated with existing addQuestion method
  - Added viewport-aware positioning (opens up/down based on space)
  - Connected event listener for 'add-question' event
- **Files Modified**: 
  - MainLayout.js lines 34-173 (replaced button with dropdown component)
  - surveyEditor.js lines 33-37 (added event listener)
- **Testing**: Successfully tested all functionality with Playwright
- **Outstanding Items**: 
  - Keyboard navigation support (arrow keys to navigate dropdown)
  - More thorough testing of viewport positioning when near edges