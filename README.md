# Budget-App-JavaScript

[![codecov](https://codecov.io/gh/kevinlasnh/Budget-app/branch/master/graph/badge.svg)](https://codecov.io/gh/kevinlasnh/Budget-app)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/kevinlasnh/Budget-app)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Welcome to the Budget App! This project is an enhanced budget management application that helps you efficiently track your income, expenses, and overall budget, with improved accessibility, internationalization, and security features.

## Demo
You can check out the live demo of the Budget App here.
**Online Demo of Project :**

<a href="https://smircodes.github.io/Budget-app/" title="Budget-App">Link to Budget App</a>

## Features

- **Income and Expense Tracking**: Enter your sources of income and expenses with categorization for better organization.

- **Budget Calculation**: Automatically calculates your budget by subtracting expenses from income, giving you a clear overview of your financial status.

- **Internationalization (i18n)**: Full support for English and Chinese languages with easy language switching.

- **Accessibility Compliant**: WCAG 2.1 Level AA compliant with proper labels, ARIA attributes, and color contrast.

- **Cookie Consent**: GDPR-compliant cookie banner with customizable preferences.

- **Privacy Policy**: Comprehensive privacy policy explaining data handling and user rights.

- **Input Validation**: Robust validation to prevent negative numbers and invalid inputs.

- **XSS Protection**: Secure implementation using textContent instead of innerHTML to prevent cross-site scripting attacks.

- **Test Coverage**: Comprehensive test suite with Jest achieving 80%+ code coverage.

- **Simple and Intuitive Interface**: User-friendly interface that's easy to navigate for users of all experience levels.

## Usage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kevinlasnh/Budget-app.git
   cd Budget-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Running Locally

1. Open the `index.html` file in your browser to run the Budget App locally.

2. Start by adding your income and expenses to track your budget. The app will automatically calculate your available budget.

3. Switch between English and Chinese using the language selector in the top-right corner.

4. Monitor your budget regularly and adjust your spending to achieve your financial goals.

## Technologies Used

The Budget App was built using the following technologies and tools:

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Core functionality with strict equality operators
- **Jest**: Testing framework with jsdom for DOM testing
- **CookieConsent**: GDPR-compliant cookie management
- **Codecov**: Code coverage reporting

## Accessibility Features

This application follows WCAG 2.1 Level AA guidelines:

- All form inputs have associated `<label>` elements
- Buttons use semantic HTML with `aria-label` attributes
- Color contrast ratios meet 4.5:1 minimum for normal text
- Canvas chart includes `aria-label` for screen readers
- Keyboard navigation fully supported

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:ci
```

## Code Quality Improvements

- **Strict Equality**: Uses `===` instead of `==` for type-safe comparisons
- **Input Validation**: Validates positive numbers and rejects invalid inputs
- **Named Constants**: Replaces magic numbers with descriptive constant names
- **XSS Prevention**: Uses `textContent` to safely handle user input
- **Error Handling**: Comprehensive validation with user-friendly error messages

## Credits

Original tutorial by [aaramiss](https://samiraatech.github.io/Budget-app/).

Enhanced with accessibility, i18n, security, and testing features for CPT304 Software Engineering coursework.

## License

The Budget App is released under the ISC License. You are free to use, modify, and distribute this project for personal and commercial purposes.

## Feedback and Support

If you have any questions, suggestions, or issues with the Budget App, feel free to reach out by creating an issue in the [GitHub repository](https://github.com/kevinlasnh/Budget-app/issues). We welcome any feedback to improve the app and make it even more useful for managing personal finances.

Happy budgeting!
