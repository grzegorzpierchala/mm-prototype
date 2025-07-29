# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goals (IMPORTANT)

This is a **high-fidelity prototype** focused on:
- **Rapid prototyping** - Quickly showcase functionality to stakeholders and users for feedback
- **Component-based architecture** - Break down large monolithic files into manageable, reusable components
- **Minimal behavior implementation** - Focus on UI/UX demonstration rather than full functionality
- **Zero to minimal backend** - Mock data and simulated interactions for demo purposes
- **Fast iteration cycles** - Quick changes based on stakeholder feedback

## Work Management & Audit Trail (MANDATORY)

### Project Structure
```
.claude/
  /backlog/           # Future work items (user stories)
  /work-log/          # Active and completed work with full audit trail
    YYYY-MM-DD-HH-MM-task-name.md
```

### CRITICAL: Work Documentation Process

**TRIGGER CONDITIONS** - Create work log file IMMEDIATELY when:
- User requests ANY new feature, bug fix, or modification
- User asks a "how to" question that requires implementation
- User requests research or investigation that leads to code changes
- Continuing work from a previous session

**WORKFLOW INTEGRATION**:
1. **Capture Phase** (When task is requested):
   - Create `.claude/work-log/YYYY-MM-DD-HH-MM-[descriptive-task-name].md`
   - Use Bash tool to get current date and time to make it's the same as user system
   - Document: Context, User Request, Initial Assessment
   - Enter plan mode if needed for complex tasks
   
2. **Planning Phase** (Before implementation):
   - Add detailed plan to the work log file
   - Use TodoWrite tool to create active task list
   - Get user approval if significant work
   
3. **Implementation Phase** (During work):
   - Keep TodoWrite tasks synchronized with progress
   - Update work log file after EACH significant action:
     - Commands run and their output
     - Files created/modified with line numbers
     - Decisions made and reasoning
     - Problems encountered and solutions
   
4. **Completion Phase** (After implementation):
   - Final summary of all changes
   - List of affected files
   - Testing performed by qa-playwright-tester agent
   - Apply/Fix any feedback provided by qa-playwright-tester agent
   - Next steps or follow-up items

### Work Log Template
```markdown
# Task: [Descriptive Name]
**Date**: YYYY-MM-DD HH:MM
**Status**: Planning | In Progress | Completed | Blocked
**Category**: Feature | Bug Fix | Refactor | Research

## Context
[Why this work was requested, any relevant background]

## User Request
[Exact user request or problem statement]

## Plan
[Detailed implementation plan with reasoning]

## Implementation Log
### [Timestamp] - [Action]
- **What**: [Description of action taken]
- **Files**: [Files affected with line numbers]
- **Result**: [Outcome of the action]
- **Notes**: [Any decisions, problems, or insights]

### [Timestamp] - [Next Action]
...

## Summary
- **Changes Made**: [List all modifications]
- **Files Modified**: [Complete list with line ranges]
- **Testing**: [What was tested and results]
- **Outstanding Items**: [Any unfinished work or future improvements]
```

### Enforcement Rules
- I MUST create a work log file BEFORE any implementation begins
- I MUST update the log after each significant action (not just at the end)
- I MUST use both TodoWrite (for active tracking) AND work log files (for audit trail)
- If I forget, I should immediately stop and create the documentation
- Work logs are permanent records - never delete, only update status

## Project Overview

This is a survey editor prototype being migrated from a single-page application to a component-based architecture using:
- **Vite** for fast development and hot module replacement
- **Alpine.js** for reactive UI components
- **Tailwind CSS** for styling
- **Component-based structure** for maintainability

## Architecture

### Current State (Monolithic)
The application is currently structured as a single HTML file (`survey-editor-prototype.html`) containing:
- 3595+ lines of code
- All components, styles, and logic in one file
- Becoming difficult to maintain and iterate quickly

### Target Architecture (Component-Based)
```
/src
  /components
    /questions      # Individual question type components
      - TextInput.js
      - MultipleChoice.js
      - Rating.js
      - etc.
    /ui            # Reusable UI components
      - SettingsPanel.js
      - CommentThread.js
      - VersionHistory.js
      - ToggleSwitch.js
    /layout        # Layout components
      - Header.js
      - TabNavigation.js
      - Sidebar.js
  /pages           # Main pages
    - SurveyEditor.js
    - Preview.js
  /stores          # Alpine.js stores for shared state
    - surveyStore.js
    - commentStore.js
  /utils           # Helper functions
    - mockData.js
    - validators.js
```

### Original Alpine.js Components:
1. **Main Alpine.js Components:**
   - `surveyEditor()` - Main application state and logic (will be refactored into stores)
   - `surveyBuilderData()` - Question management and validation logic (will be modularized)

2. **Key Features:**
   - Drag-and-drop survey builder with multiple question types
   - Real-time validation and duplicate question number detection
   - Comment/review system with thread management
   - Version history with diff visualization
   - Preview modes (desktop/tablet/mobile)
   - AI assistant integration
   - Auto-save functionality

3. **Data Models:**
   - Questions array with settings, validation rules, and options
   - Comments system with thread support
   - Version history tracking

## Development Commands

Since this is a standalone HTML file with no build process:

- **Run locally:** Open `survey-editor-prototype.html` directly in a web browser using playwright

## Key Implementation Details

- Question validation logic starts at line 42 (`validateQuestionNumber`)
- The UI uses Alpine.js x-data attributes for reactivity
- Tailwind CSS classes are used inline for styling
- Custom CSS overrides are injected at runtime (lines 95-100)
- The application simulates backend operations (save, restore) without actual API calls

## Prototyping Best Practices

When working on this prototype, follow these guidelines:

1. **Mock First, Implement Later**
   - Use mock data and simulated interactions
   - Focus on visual fidelity and user flow
   - Don't worry about backend integration

2. **Component Reusability**
   - Create components that can be easily duplicated and modified
   - Use props/parameters for variations
   - Keep components focused on single responsibilities

3. **Rapid Iteration**
   - Hot module replacement for instant feedback
   - Component showcase/library for quick testing
   - Easy A/B testing of different approaches

4. **Stakeholder-Friendly**
   - Clear visual hierarchy
   - Realistic interactions (even if mocked)
   - Easy to navigate and understand

## UI/UX Guidelines

Refer to `CLAUDE_UI_UX.md` for comprehensive design system and component patterns including:
- Notion-inspired block editing
- Ultrathin design aesthetic
- Tab-based workflow organization
- Settings panel implementation (380px width)
- Toggle switches and visual radio cards
- Progressive disclosure patterns