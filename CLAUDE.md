# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a survey editor prototype built as a single-page application using:
- **Alpine.js** for reactive UI components
- **Tailwind CSS** for styling
- Pure HTML/JavaScript (no build process required)

## Architecture

The application is structured as a single HTML file (`survey-editor-prototype.html`) containing:

1. **Main Alpine.js Components:**
   - `surveyEditor()` - Main application state and logic (lines 3595+)
   - `surveyBuilderData()` - Question management and validation logic (lines 10-86)

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

## UI/UX Guidelines

Refer to `CLAUDE_UI_UX.md` for comprehensive design system and component patterns including:
- Notion-inspired block editing
- Ultrathin design aesthetic
- Tab-based workflow organization
- Settings panel implementation (380px width)
- Toggle switches and visual radio cards
- Progressive disclosure patterns