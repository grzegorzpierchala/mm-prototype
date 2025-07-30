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

**SINGLE WORK-LOG PER FEATURE RULE**:
- Each feature/task should have ONE work-log file that gets continuously updated
- Agents MUST check for existing work-log files for the current feature before creating new ones
- Update existing work-log files with new timestamps instead of creating duplicates

**TRIGGER CONDITIONS** - Create OR UPDATE work log file IMMEDIATELY when:
- User requests ANY new feature, bug fix, or modification
- User asks a "how to" question that requires implementation
- User requests research or investigation that leads to code changes
- Continuing work from a previous session
- An agent is delegated to work on an existing feature

**WORKFLOW INTEGRATION**:
1. **Capture Phase** (When task is requested):
   - FIRST: Check if a work-log file already exists for this feature/task
   - If EXISTS: Update the existing file with new timestamp sections
   - If NEW: Create `.claude/work-log/YYYY-MM-DD-HH-MM-[descriptive-task-name].md`
   - Use Bash tool to get current date and time to make it's the same as user system
   - Document: Context, User Request, Initial Assessment
   - Enter plan mode if needed for complex tasks
   
2. **Planning Phase** (Before implementation):
   - Add detailed plan to the work log file
   - Use TodoWrite tool to create active task list
   - Get user approval if significant work
   
3. **Implementation Phase** (During work):
   - Keep TodoWrite tasks synchronized with progress
   - **CRITICAL**: Check if task involves UI/UX work
     - If YES → Delegate to ui-ux-designer agent (pass existing work-log filename)
     - If NO → Proceed with direct implementation
   - Update THE SAME work log file after EACH significant action:
     - Add new timestamp section for each update
     - Commands run and their output
     - Files created/modified with line numbers
     - Decisions made and reasoning
     - Problems encountered and solutions
     - Agent delegations and their results
   
4. **Completion Phase** (After implementation):
   - Final summary of all changes
   - List of affected files
   - Testing performed by qa-playwright-tester agent
   - Apply/Fix any feedback provided by qa-playwright-tester agent
   - Next steps or follow-up items
   
### Agent Collaboration Workflow
For UI/UX tasks, follow this sequence:
1. **ui-ux-designer** → Creates/improves the UI
2. **qa-playwright-tester** → Tests the implementation
3. **ui-ux-designer** → Fixes any UI issues found
4. **qa-playwright-tester** → Verifies the fixes

### Work Log Template
```markdown
# Task: [Descriptive Name]
**Initial Date**: YYYY-MM-DD HH:MM
**Last Updated**: YYYY-MM-DD HH:MM
**Status**: Planning | In Progress | Completed | Blocked
**Category**: Feature | Bug Fix | Refactor | Research

## Context
[Why this work was requested, any relevant background]

## User Request
[Exact user request or problem statement]

## Plan
[Detailed implementation plan with reasoning]

## Implementation Log

### [YYYY-MM-DD HH:MM] - Initial Implementation
- **Agent**: [Name of agent or "Main Assistant"]
- **What**: [Description of action taken]
- **Files**: [Files affected with line numbers]
- **Result**: [Outcome of the action]
- **Notes**: [Any decisions, problems, or insights]

### [YYYY-MM-DD HH:MM] - UI/UX Designer Updates
- **Agent**: ui-ux-designer
- **What**: [UI improvements made]
- **Files**: [Files affected with line numbers]
- **Result**: [Visual changes and improvements]
- **Notes**: [Design decisions and rationale]

### [YYYY-MM-DD HH:MM] - QA Testing Results
- **Agent**: qa-playwright-tester
- **What**: [Testing performed]
- **Issues Found**: [List of issues discovered]
- **Fixes Applied**: [How issues were resolved]
- **Notes**: [Testing insights]

## Summary
- **Changes Made**: [List all modifications]
- **Files Modified**: [Complete list with line ranges]
- **Testing**: [What was tested and results]
- **Outstanding Items**: [Any unfinished work or future improvements]
```

### Enforcement Rules
- I MUST check for existing work-log files for the feature BEFORE creating new ones
- I MUST update existing work-log files rather than creating duplicates
- I MUST create a work log file BEFORE any implementation begins (if none exists)
- I MUST update the log after each significant action (not just at the end)
- I MUST use both TodoWrite (for active tracking) AND work log files (for audit trail)
- If I forget, I should immediately stop and create/update the documentation
- Work logs are permanent records - never delete, only update status and add new sections
- Agents MUST append to existing work-log files with new timestamp sections

## Agent Delegation (CRITICAL)

### UI/UX Work Delegation
ALL user interface and user experience related tasks MUST be delegated to the `ui-ux-designer` agent. This includes:

**When to Use ui-ux-designer Agent:**
- Creating new UI components or screens
- Improving existing layouts or user interfaces
- Implementing responsive designs
- Ensuring accessibility standards
- Applying design system patterns
- Creating or modifying visual elements
- Improving user flows or interactions
- Implementing hover states, transitions, or animations
- Working with the ultrathin design aesthetic
- Any task involving Tailwind CSS styling

**Delegation Process:**
1. Identify if the task involves UI/UX work
2. Check for existing work-log file for the current feature
3. Use the Task tool with `subagent_type: "ui-ux-designer"`
4. Include the work-log filename in the prompt so the agent updates the same file
5. Provide clear context about the design requirements
6. Let the agent handle implementation following design system guidelines
7. Review and test the implementation with qa-playwright-tester (using same work-log)

**Example Delegations:**

1. **Creating New Component:**
```
Task(
  description="Create settings panel for survey options",
  prompt="Design and implement a settings panel for configuring survey options following our ultrathin design system. Update the existing work-log file: .claude/work-log/2025-07-30-14-00-settings-panel-feature.md",
  subagent_type="ui-ux-designer"
)
```

2. **Improving Existing UI:**
```
Task(
  description="Improve question card layout",
  prompt="The question cards need better spacing and visual hierarchy. Improve the layout following our design system guidelines. Update the existing work-log file: .claude/work-log/2025-07-30-13-00-question-card-improvements.md",
  subagent_type="ui-ux-designer"
)
```

3. **Fixing UI Issues:**
```
Task(
  description="Fix hover state issues",
  prompt="Fix the hover states on version items that are causing layout shifts. Ensure smooth transitions without content jumping. Update the existing work-log file: .claude/work-log/2025-07-29-13-46-fix-version-history-spacing.md",
  subagent_type="ui-ux-designer"
)
```

**DO NOT attempt to:**
- Write CSS or Tailwind classes directly
- Create UI components without delegation
- Make visual design decisions independently
- Implement animations or transitions manually

## Project Overview

This is a survey editor prototype being migrated from a single-page application to a component-based architecture using:
- **Vite** for fast development and hot module replacement
- **Alpine.js** for reactive UI components
- **Tailwind CSS** for styling
- **Component-based structure** for maintainability
- Server is running on http://localhost:5173/

## Architecture

### Current Component Architecture
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

### Question Types Documentation
Comprehensive documentation for all Qualtrics question types available in `/question-types-doc/` including:
- Implementation details
- Configuration options
- Validation rules
- UI/UX patterns
- Screenshots and examples

## Development Commands

### Survey Editor Vite Project
```bash
# Install dependencies
npm install

# Run development server (hot reload enabled)
npm run dev
# Opens at http://localhost:5173/

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
- **UI Testing**: Use the qa-playwright-tester agent after implementing features
- **Manual Testing**: Use Playwright MCP server to interact with the running application
- **No automated tests configured** - This is a prototype focused on rapid iteration

## Key Implementation Details

### Alpine.js Architecture
- **Global Stores** (`/src/stores/`): Centralized state management
  - `surveyStore.js`: Survey data, questions, CRUD operations
  - `uiStore.js`: UI state, panels, tabs, auto-save functionality
  - `commentStore.js`: Comments, threads, review system
  - `versionStore.js`: Version history and comparison
  - `validationStore.js`: Real-time validation and error tracking

### Component Structure
- **Layout Components** (`/src/components/layout/`): Page structure
- **UI Components** (`/src/components/ui/`): Reusable interface elements
- **Question Components** (`/src/components/questions/`): Individual question types
- **Utility Functions** (`/src/utils/`): Validation, drag-drop, keyboard shortcuts

### Key Features
- Drag-and-drop question reordering (using @alpinejs/sort)
- Real-time validation with duplicate question number detection
- Mock data and simulated backend operations
- Component-based architecture replacing 3595+ line monolithic file

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

## Common Tasks and Patterns

### Adding a New Question Type
1. Create component in `/src/components/questions/[QuestionType].js`
2. Export a function that returns HTML template with Alpine.js directives
3. Add to question type mapping in `QuestionRenderer.js`
4. Reference documentation in `/question-types-doc/` for implementation details

### Working with Alpine.js Stores
```javascript
// Access store data in components
$store.survey.questions
$store.ui.activeTab
$store.validation.getErrorsForQuestion(questionId)

// Trigger store actions
$store.survey.addQuestion(type)
$store.ui.toggleSettingsPanel()
$store.validation.validateAllQuestions()
```

### Component Communication
- Use Alpine.js events: `$dispatch()` and `@custom-event`
- Store shared state in global stores
- Pass data via x-data attributes for component initialization

## Important Notes

- **No package-lock.json** is tracked in git - run `npm install` fresh
- **Windows Development**: Project uses Windows paths (M:\Projects\mm-prototype)
- **Prototype Focus**: Prioritize visual fidelity over full functionality
- **Agent Collaboration**: Always test UI changes with qa-playwright-tester