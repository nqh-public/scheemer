# Contributing to Scheemer

Thank you for your interest in contributing to Scheemer! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Framer version, browser)

### Suggesting Features

Feature requests are welcome! Please:
- Check existing issues first to avoid duplicates
- Clearly describe the feature and its use case
- Explain why it would be valuable

### Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/scheemer.git
   cd scheemer
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   cd framer-plugin
   npm install
   ```

4. **Make your changes**
   - Write clear, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

5. **Test the plugin**
   ```bash
   npm run dev
   ```
   - Load in Framer and verify functionality
   - Test with various component types
   - Ensure exports work correctly

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit message format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide clear description of changes
   - Reference any related issues

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Framer Desktop App
- Code editor (VS Code recommended)

### Local Development

```bash
# Clone repository
git clone https://github.com/nqh-public/scheemer.git
cd scheemer/framer-plugin

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Package plugin
npm run pack
```

### Testing in Framer

1. Start dev server: `npm run dev`
2. Open Framer Desktop App
3. Go to Plugins → Development → Open Plugin URL
4. Enter: `https://localhost:5173`
5. Test your changes

## Code Style

- **TypeScript**: Use proper types, avoid `any`
- **React**: Functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Formatting**: Run ESLint before committing
- **File size**: Keep files under 500 lines

## Project Structure

```
scheemer/
├── framer-plugin/
│   ├── src/
│   │   ├── app.tsx              # Main plugin UI
│   │   ├── main.tsx             # Entry point
│   │   └── components/          # Reusable UI components
│   ├── public/
│   │   └── icon.svg             # Plugin icon
│   └── package.json
├── LICENSE
├── README.md
└── CONTRIBUTING.md (this file)
```

## Pull Request Guidelines

- **One feature per PR**: Keep changes focused
- **Clear description**: Explain what and why
- **Reference issues**: Link related issues with `#123`
- **Test thoroughly**: Ensure nothing breaks
- **Update docs**: If adding features, update README
- **Screenshots**: Add for UI changes

## Review Process

1. Maintainers review PRs within a few days
2. Address feedback promptly
3. CI checks must pass
4. At least one approval required
5. Squash and merge when approved

## Questions?

- Open an issue for questions
- Check existing issues/discussions first
- Be patient and respectful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
