# Task: Remove Dotted Border and Add Border Hover Effect
**Date**: 2025-07-28 15:40
**Status**: Completed
**Category**: Bug Fix

## Context
User wants to remove the dotted border that appears a few pixels away from the actual border when hovering over a question. Instead, they want a hover effect on the actual border using a lighter indigo color than the one used when the Settings panel is open.

## User Request
"I would like to get rid of this dotted border that is few pixels away from actual border of a question when you hover over it. Instead I want us to make an effect on the actual border. If you look though the code you will see that when you click a question to open Question Settings it gets this nice indigo border. it should be a slightly lighter indigo color than when we can see the settings tab"

## Plan
1. Search for the dotted border hover styles in the codebase
2. Find the indigo border color used for the selected state
3. Remove the dotted border styles
4. Add a hover effect with a lighter indigo border on the actual question card
5. Test the changes with Playwright

## Implementation Log
### 2025-07-28 15:41 - Initial Search
- **What**: Searching for dotted border and hover styles
- **Files**: Found in QuestionRenderer.js and style.css
- **Result**: 
  - Found dotted border in QuestionRenderer.js lines 167-168
  - Selected state uses 'ring-2 ring-indigo-500' (line 132)
  - Current hover only adds shadow-sm
- **Notes**: The dotted border is rendered as a separate absolute div with opacity transition

### 2025-07-28 15:45 - Removed Dotted Border and Updated Hover
- **What**: Removed the dotted border div and updated hover effect
- **Files**: 
  - survey-editor-vite/src/components/questions/QuestionRenderer.js (lines 165-169, 130-134)
- **Result**: 
  - Removed the visual drag indicator div completely
  - Changed border from 1px to 2px for better visibility
  - Added hover:border-indigo-300 for lighter indigo on hover
  - Selected state uses border-indigo-500 (darker)
- **Notes**: Using Tailwind's indigo-300 for hover (lighter) and indigo-500 for selected (darker)

### 2025-07-28 15:48 - Testing with Playwright
- **What**: Tested the new hover effect visually
- **Files**: None
- **Result**: 
  - Dotted border is removed
  - Hover effect shows light indigo border (indigo-300)
  - Selected state shows darker indigo border (indigo-500)
- **Notes**: The hover effect now works directly on the actual border

## Summary
- **Changes Made**: 
  - Removed the dotted border div completely from QuestionRenderer.js
  - Changed border from 1px to 2px for better visibility
  - Added hover:border-indigo-300 class for light indigo on hover
  - Selected state uses border-indigo-500 (darker indigo)
- **Files Modified**: 
  - survey-editor-vite/src/components/questions/QuestionRenderer.js (lines 165-169, 130-134)
- **Testing**: Verified hover and selected states work correctly with Playwright
- **Outstanding Items**: None