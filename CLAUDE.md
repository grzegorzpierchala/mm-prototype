# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goals (IMPORTANT)

This is a **high-fidelity prototype** focused on:
- **Rapid prototyping** - Quickly showcase functionality to stakeholders and users for feedback
- **Component-based architecture** - Break down large monolithic files into manageable, reusable components
- **Minimal behavior implementation** - Focus on UI/UX demonstration rather than full functionality
- **Zero to minimal backend** - Mock data and simulated interactions for demo purposes
- **Fast iteration cycles** - Quick changes based on stakeholder feedback

### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you write the plan to .claude/tasks/TASK_NAME.md
- The plan should be a detailed implementation plan, the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP unless I tell you to think more about it and spend more time on research.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

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