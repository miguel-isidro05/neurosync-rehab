# Contributing to Sensoria

Thank you for your interest in contributing to the Sensoria BCI Neurorehabilitation System! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize patient safety and data privacy
- Follow biomedical engineering best practices

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the [Issues](https://github.com/miguel-isidro05/neurosync-rehab/issues) section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - System specifications (OS, Python version, Node version)

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/neurosync-rehab.git
   cd neurosync-rehab
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Test with the test client
   - Verify frontend functionality
   - Check for console errors

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference related issues
   - Include screenshots for UI changes

## Development Guidelines

### Python Backend

- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions and classes
- Keep functions focused and modular
- Log important events and errors

### TypeScript Frontend

- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable
- Add prop types and interfaces

### Commit Messages

Use conventional commit format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add adaptive difficulty algorithm`

## Areas for Contribution

### High Priority

- [ ] 3D game environment for rehabilitation
- [ ] Machine learning classification improvements
- [ ] Clinical database integration
- [ ] Performance optimization
- [ ] Comprehensive testing suite

### Documentation

- [ ] API documentation
- [ ] Clinical usage guidelines
- [ ] Video tutorials
- [ ] Translation to other languages

### Research

- [ ] New motor imagery paradigms
- [ ] Alternative feedback modalities
- [ ] Outcome metrics and analysis
- [ ] Integration with other EEG systems

## Questions?

Contact: [miguel.isidro@upch.pe](mailto:miguel.isidro@upch.pe)

Thank you for contributing to neurorehabilitation research!

