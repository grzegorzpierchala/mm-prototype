# Calendar Question

## About Calendar Questions

Calendar questions provide an intuitive date picker interface for respondents to select dates. This question type displays a visual calendar that makes it easy to choose specific dates, date ranges, or multiple dates depending on your configuration. It's particularly useful when you need precise date information or when asking about events, appointments, or time-sensitive topics.

## When to Use Calendar Questions

Calendar questions are ideal for:
- Event scheduling and registration
- Appointment booking
- Collecting birthdates or anniversaries  
- Tracking project timelines
- Recording purchase or experience dates
- Setting availability windows
- Historical date collection

## Calendar Features

### Date Selection Modes
- **Single Date**: Select one specific date
- **Date Range**: Choose a start and end date
- **Multiple Dates**: Select multiple individual dates
- **Blocked Dates**: Disable specific dates or ranges

### Display Options
- **Month View**: Traditional calendar grid
- **Week View**: Seven-day view
- **Year View**: Full year at a glance
- **Mini Calendar**: Compact date picker

### Customization Options
- **Start Day**: Choose Sunday or Monday as week start
- **Date Format**: MM/DD/YYYY, DD/MM/YYYY, etc.
- **Language**: Localized month and day names
- **Theme**: Match your survey's visual style

## Setting Up Calendar Questions

### Basic Configuration
1. Add a Calendar question to your survey
2. Choose selection mode (single, range, multiple)
3. Set date format preferences
4. Configure validation rules

### Date Restrictions
- **Minimum Date**: Earliest selectable date
- **Maximum Date**: Latest selectable date
- **Blocked Dates**: Specific dates to disable
- **Allowed Days**: Limit to certain days of the week

### Validation Options
- **Required**: Make date selection mandatory
- **Date Range**: Ensure selected dates fall within range
- **Future/Past Only**: Restrict to future or past dates
- **Business Days**: Exclude weekends

## Advanced Calendar Features

### Dynamic Date Restrictions
- Block dates based on previous answers
- Update available dates in real-time
- Set capacity limits for specific dates
- Show availability indicators

### Time Selection
- Add time picker to date selection
- Set time intervals (15, 30, 60 minutes)
- Configure time zones
- 12 or 24-hour format

### Calendar Integration
- Sync with external calendars
- Check availability against schedules
- Send calendar invites
- Update booking systems

## Best Practices

### Clear Instructions
- Specify date format expected
- Indicate any date restrictions
- Explain what the date represents
- Provide examples if needed

### Mobile Optimization
- Ensure calendar is touch-friendly
- Test swipe gestures
- Verify date tap targets are large enough
- Consider simplified mobile view

### Accessibility
- Provide keyboard navigation
- Include screen reader support
- Use clear date announcements
- Offer text input alternative

### International Considerations
- Use appropriate date formats for region
- Consider cultural week start preferences
- Localize month and day names
- Handle time zone differences

## Common Use Cases

### Event Registration
```
Please select your preferred workshop date:
[Calendar showing available dates highlighted]
```

### Appointment Booking
```
Choose your appointment date and time:
[Calendar with time slots]
Morning (9 AM - 12 PM)
Afternoon (1 PM - 5 PM)
```

### Date Range Selection
```
Select your vacation dates:
Start Date: [Calendar]
End Date: [Calendar]
Total Days: 7
```

### Multiple Date Selection
```
Which days are you available? (Select all that apply)
[Calendar with checkable dates]
```

## Data Analysis

### Date Formats in Export
- ISO format (YYYY-MM-DD)
- Locale-specific formats
- Unix timestamps
- Separate date components

### Analysis Options
- Group by day/week/month
- Calculate date differences
- Identify peak selection periods
- Track booking patterns

## Validation Messages

### Custom Error Messages
- "Please select a date"
- "Date must be in the future"
- "Selected date is not available"
- "Please choose a weekday"

### Helpful Hints
- Show number of days selected
- Display day of week for clarity
- Indicate holidays or special dates
- Show remaining availability

## Common Mistakes to Avoid

1. **No Date Restrictions**: Allowing impossible dates (e.g., meetings in the past)
2. **Confusing Format**: Not clearly indicating expected date format
3. **Missing Time Zones**: Not accounting for respondent location
4. **Over-Restriction**: Blocking too many dates unnecessarily
5. **Poor Mobile Experience**: Calendar too small or difficult to navigate on mobile