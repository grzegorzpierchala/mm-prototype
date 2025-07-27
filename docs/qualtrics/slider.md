# Slider Question

## About Slider Questions

Slider questions allow respondents to select a value by dragging a handle along a continuous scale. This interactive question type provides a visual and intuitive way to collect ratings, percentages, or any numeric value within a defined range. Sliders are particularly effective when you want respondents to indicate their position on a continuum rather than selecting from discrete options.

## When to Use Slider Questions

Sliders work best for:
- Satisfaction or agreement ratings on a continuous scale
- Percentage allocations (0-100%)
- Age, income, or other numeric ranges
- Visual analog scales for pain or comfort assessment
- Budget allocation exercises
- Priority or importance rankings
- Any measurement where fine gradations matter

## Slider Features

### Scale Configuration
- **Minimum Value**: Starting point of the scale
- **Maximum Value**: Ending point of the scale
- **Decimal Places**: Precision of values (0, 1, or 2 decimal places)
- **Step Size**: Increment between selectable values

### Visual Options
- **Scale Labels**: Text labels at endpoints and intervals
- **Value Display**: Show current value as respondent drags
- **Grid Lines**: Visual markers along the scale
- **Custom Colors**: Match your brand or survey theme

### Slider Types
- **Single Slider**: One value selection
- **Multiple Sliders**: Several sliders in one question
- **Constant Sum Sliders**: Multiple sliders that must total 100%
- **Paired Comparison**: Two-ended slider for comparisons

## Setting Up Sliders

### Basic Configuration
1. Set minimum and maximum values
2. Choose number of decimal places
3. Add scale labels
4. Configure visual options

### Scale Labels
- **Endpoints**: Labels at min and max values
- **Center Point**: Optional middle label
- **Intervals**: Labels at regular intervals
- **Custom Points**: Labels at specific values

### Starting Position
- **No Default**: Slider handle not visible until clicked
- **Center Start**: Handle begins at midpoint
- **Custom Start**: Set specific starting value
- **Random Start**: Randomize initial position

## Advanced Slider Options

### Constant Sum Sliders
- Multiple sliders that must total a specific value
- Real-time updating as values change
- Automatic adjustment of remaining sliders
- Visual indication of total

### Custom Styling
- Handle shape and size
- Track colors and gradients
- Label fonts and positioning
- Animation effects

### Mobile Optimization
- Touch-friendly handle size
- Smooth dragging response
- Clear value display
- Appropriate scale for device

## Best Practices

### Clear Scale Definition
- Label endpoints clearly
- Use intuitive scale direction
- Provide context for values
- Include units if applicable

### Appropriate Scale Range
- Match range to expected responses
- Avoid overly wide ranges
- Consider psychological anchoring
- Use round numbers when possible

### Visual Clarity
- Ensure sufficient contrast
- Make handle easily grabbable
- Display current value prominently
- Use grid lines for reference

### Mobile Considerations
- Test on various devices
- Ensure smooth dragging
- Verify value visibility
- Consider vertical orientation

## Common Use Cases

### Satisfaction Rating
```
How satisfied are you with our service?
[Slider: 0 (Very Dissatisfied) -------- 100 (Very Satisfied)]
Current Value: 75
```

### Budget Allocation
```
Allocate your budget across these categories (must total 100%):
Marketing: [Slider: 0-100] 40%
Operations: [Slider: 0-100] 35%
R&D: [Slider: 0-100] 25%
Total: 100%
```

### Agreement Scale
```
To what extent do you agree with this statement?
[Slider: 0 (Strongly Disagree) -------- 10 (Strongly Agree)]
```

### Pain Assessment
```
Rate your current pain level:
[Slider: 0 (No Pain) -------- 10 (Worst Possible Pain)]
```

## Data Considerations

### Response Distribution
- Sliders may produce different distributions than radio buttons
- Consider clustering around round numbers
- Account for starting position bias
- Analyze full range utilization

### Missing Data
- Require interaction to record response
- Consider "not applicable" options
- Handle non-response appropriately
- Track slider interaction metrics

### Data Export
- Numeric values with specified precision
- Include scale parameters in metadata
- Consider normalizing across different scales
- Export interaction data if needed

## Accessibility

### Keyboard Navigation
- Arrow keys for fine adjustment
- Tab navigation between sliders
- Home/End keys for min/max
- Clear value announcement

### Screen Reader Support
- Announce current value
- Describe scale range
- Provide context for changes
- Alternative input method available

### Visual Alternatives
- High contrast mode
- Colorblind-friendly design
- Text input option
- Clear visual indicators

## Common Mistakes to Avoid

1. **Unclear Scale**: Not labeling what values represent
2. **Too Precise**: Using decimals when not needed
3. **No Starting Point**: Forcing selection without context
4. **Mobile Issues**: Handle too small for touch screens
5. **Bias Introduction**: Starting position influencing responses
6. **Missing Labels**: No indication of scale endpoints
7. **Constant Sum Errors**: Not validating totals properly