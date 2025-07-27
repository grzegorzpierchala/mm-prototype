# Side by Side Question

## About Side by Side Questions

Side by Side questions allow you to combine multiple question types into a single, organized table format. This powerful question type enables you to collect different types of data about the same items in one consolidated view. Each column can be a different question type (multiple choice, text entry, dropdown, etc.), making it ideal for complex data collection scenarios.

## When to Use Side by Side Questions

Side by Side questions are perfect for:
- Product comparisons with multiple attributes
- Employee evaluations with various criteria
- Course evaluations combining ratings and comments
- Inventory assessments with quantities and conditions
- Multi-dimensional feedback collection
- Research studies requiring varied response types
- Budget planning with amounts and justifications

## Side by Side Features

### Column Types
- **Multiple Choice**: Radio buttons or checkboxes
- **Text Entry**: Short or long text responses
- **Dropdown**: Select from predefined options
- **Scale Points**: Likert or numeric scales
- **Rank Order**: Ranking within the table
- **Constant Sum**: Distribute points across rows

### Table Structure
- **Rows**: Items being evaluated
- **Columns**: Different questions/attributes
- **Headers**: Column titles and descriptions
- **Sub-headers**: Additional column grouping

### Customization Options
- Column widths and alignment
- Conditional display logic
- Response requirements by column
- Mobile-responsive layouts
- Custom styling and colors

## Setting Up Side by Side Questions

### Basic Configuration
1. Define your row items
2. Add columns with question types
3. Configure each column's options
4. Set validation rules
5. Customize appearance

### Column Configuration
Each column can have:
- Unique question type
- Individual validation rules
- Custom choices or scales
- Required/optional settings
- Conditional logic

### Row Management
- Static row definitions
- Dynamic rows from previous questions
- Add/remove row functionality
- Row randomization options
- Category groupings

## Advanced Features

### Dynamic Columns
- Show/hide columns based on logic
- Carry forward from previous questions
- Calculate totals or averages
- Display running calculations

### Complex Validation
- Cross-column validation rules
- Sum constraints across rows
- Conditional requirements
- Pattern matching

### Data Piping
- Reference previous answers
- Insert calculated values
- Dynamic row/column labels
- Personalized content

## Common Configurations

### Product Evaluation
```
| Product | Rating | Price Willing to Pay | Comments |
|---------|--------|---------------------|----------|
| Item A  | ⭐⭐⭐⭐⭐ | $[    ] | [      ] |
| Item B  | ⭐⭐⭐⭐⭐ | $[    ] | [      ] |
| Item C  | ⭐⭐⭐⭐⭐ | $[    ] | [      ] |
```

### Employee Assessment
```
| Skill | Proficiency | Training Needed? | Priority |
|-------|-------------|------------------|----------|
| Excel | [Dropdown▼] | ☐ Yes ☐ No | [Rank] |
| Python| [Dropdown▼] | ☐ Yes ☐ No | [Rank] |
| SQL   | [Dropdown▼] | ☐ Yes ☐ No | [Rank] |
```

### Course Feedback
```
| Aspect | Satisfaction | Would Recommend? | Improvements |
|--------|--------------|------------------|--------------|
| Content| 😞😐😊😃😁 | ☐ Yes ☐ No | [        ] |
| Instructor| 😞😐😊😃😁 | ☐ Yes ☐ No | [        ] |
| Materials| 😞😐😊😃😁 | ☐ Yes ☐ No | [        ] |
```

## Best Practices

### Table Design
- Keep tables manageable (5-7 columns max)
- Use clear, concise headers
- Group related columns
- Consider screen width

### Mobile Optimization
- Test horizontal scrolling
- Consider accordion view
- Prioritize essential columns
- Use responsive design

### Data Quality
- Validate across columns
- Prevent contradictory responses
- Guide with helper text
- Use progress indicators

### User Experience
- Provide clear instructions
- Show examples if complex
- Use visual separators
- Enable save and return

## Mobile Considerations

### Display Options
- **Horizontal Scroll**: Swipe to see all columns
- **Accordion**: Expand rows individually
- **Stacked**: Convert to vertical layout
- **Essential**: Show priority columns only

### Touch Optimization
- Adequate tap targets
- Clear column boundaries
- Smooth scrolling
- Pinch to zoom support

## Data Analysis

### Export Options
- Wide format (one row per response)
- Long format (normalized data)
- Column-specific exports
- Filtered data sets

### Analysis Approaches
- Column-wise analysis
- Row comparisons
- Cross-tabulation
- Correlation analysis

### Visualization
- Heat maps
- Grouped bar charts
- Scatter plots
- Dashboard views

## Common Use Cases

### Budget Allocation
```
| Department | Current Budget | Proposed Budget | Justification |
|------------|---------------|-----------------|---------------|
| Marketing | $[      ] | $[      ] | [         ] |
| Sales | $[      ] | $[      ] | [         ] |
| R&D | $[      ] | $[      ] | [         ] |
```

### Vendor Comparison
```
| Vendor | Price Rating | Quality | Delivery | Select |
|--------|--------------|---------|----------|---------|
| Vendor A | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ☐ |
| Vendor B | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ☐ |
```

### Feature Prioritization
```
| Feature | Importance | Urgency | Resources | Include? |
|---------|------------|---------|-----------|----------|
| Feature 1 | [High▼] | [Low▼] | [$$▼] | ☐ Yes ☐ No |
| Feature 2 | [Medium▼] | [High▼] | [$$$▼] | ☐ Yes ☐ No |
```

## Common Mistakes to Avoid

1. **Too Many Columns**: Creating unwieldy tables that don't fit on screen
2. **Inconsistent Scales**: Using different rating scales in the same table
3. **Poor Mobile Design**: Not testing or optimizing for mobile devices
4. **Complex Instructions**: Not explaining how to complete the table
5. **No Validation**: Missing important cross-column validation rules
6. **Overwhelming Options**: Too many choices within dropdowns or scales
7. **Unclear Headers**: Column purposes not immediately obvious