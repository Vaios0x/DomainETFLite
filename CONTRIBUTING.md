# Contributing to DomainETF Lite

Thank you for your interest in contributing to DomainETF Lite! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/domainetf-lite-frontend.git
   cd domainetf-lite-frontend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **conventional commits** for commit messages
- Write **meaningful variable and function names**
- Add **JSDoc comments** for complex functions

### Component Guidelines

- Use **functional components** with hooks
- Implement **proper TypeScript types**
- Follow **shadcn/ui** component patterns
- Ensure **accessibility** with proper ARIA labels
- Make components **responsive** and mobile-first

### Testing

- Write **unit tests** for utilities and hooks
- Add **integration tests** for complex features
- Maintain **>80% test coverage**
- Use **React Testing Library** for component tests

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Screenshots** if applicable
5. **Browser and OS** information
6. **Console errors** if any

## ✨ Feature Requests

For new features, please:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide mockups** if applicable
5. **Consider implementation** complexity

## 🔧 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
4. **Update CHANGELOG.md** with your changes
5. **Request review** from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🏗 Architecture

### Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── types/              # TypeScript definitions
├── zustand/            # State management
└── messages/           # Internationalization
```

### Key Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **wagmi** - Web3 interactions
- **Zustand** - State management
- **Chart.js** - Data visualization

## 🎯 Hackathon Context

This project was built for the **Doma Protocol Hackathon**. Key requirements:

- ✅ **Perpetual trading** on domain names
- ✅ **Real-time price feeds**
- ✅ **Liquidity provision**
- ✅ **Leaderboard system**
- ✅ **Mobile-first PWA**
- ✅ **Multi-language support**
- ✅ **Web3 integration**

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Doma Protocol Documentation](https://docs.doma.testnet)

## 🤝 Community

- **Discord**: [DomainETF Community](https://discord.gg/domainetf)
- **Twitter**: [@domainetf](https://twitter.com/domainetf)
- **GitHub**: [DomainETF Organization](https://github.com/domainetf)

## 📄 License

By contributing to DomainETF Lite, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to DomainETF Lite! 🚀**
