# Survey Editor Prototype (Vite + Alpine.js)

This is a component-based version of the survey editor prototype, migrated from a single 3595+ line HTML file to a maintainable component architecture.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
/src
  /components
    /questions      # Individual question type components (TextInput, MultipleChoice, etc.)
    /ui            # Reusable UI components (SettingsPanel, CommentThread, etc.)
    /layout        # Layout components (Header, TabNavigation, etc.)
  /stores          # Alpine.js stores for shared state
  /utils           # Helper functions and mock data
  main.js          # Entry point and Alpine setup
  style.css        # Tailwind CSS imports and custom styles
```

## Key Features

- **Component-based architecture** - Each question type and UI element is a separate component
- **Hot Module Replacement** - See changes instantly without page reload
- **Alpine.js reactivity** - Simple, declarative data binding
- **Tailwind CSS** - Utility-first styling
- **Mock data ready** - Easy to demonstrate functionality without backend

## Development Workflow

1. **Adding a new question type**: Create a new file in `/components/questions/`
2. **Creating UI components**: Add to `/components/ui/`
3. **Shared state**: Use Alpine stores in `/stores/`
4. **Styling**: Use Tailwind classes or add custom styles in `style.css`

## Benefits over Monolithic Version

- ✅ Easier to maintain and debug
- ✅ Components can be developed in isolation
- ✅ Better performance with code splitting
- ✅ Instant feedback with HMR
- ✅ Easier collaboration with clear file structure