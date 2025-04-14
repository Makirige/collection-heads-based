# UI Library Integration

This document outlines the integration of Bootstrap into the Collection Heads tool.

## Why Bootstrap?

Bootstrap was chosen for the following reasons:
- Well-established and widely used UI framework
- Comprehensive component library that reduces the need for custom implementations
- Compatible with vanilla JavaScript
- Good browser compatibility
- Extensive documentation and community support

## Implementation

The implementation strategy is as follows:

1. Bootstrap CSS and JS are imported in the main entry point
2. Custom components are gradually replaced with Bootstrap equivalents
3. Existing styles are adapted to work with Bootstrap classes

## Components Mapping

| Custom Component | Bootstrap Equivalent |
|------------------|----------------------|
| Dropdown.js | Bootstrap Dropdown |
| ModList.js | Bootstrap Cards + Grid |
| RaceModal.js | Bootstrap Modal |
| Custom buttons | Bootstrap Buttons |

## Usage Guidelines

When modifying or adding new UI elements:
- Use Bootstrap's built-in classes whenever possible
- Minimize custom CSS overrides
- Follow Bootstrap's component structure and naming conventions

## References

- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Bootstrap Components](https://getbootstrap.com/docs/5.3/components/)
- [Bootstrap Utilities](https://getbootstrap.com/docs/5.3/utilities/)