# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

This is the `@rundown-studio/types` package - a standalone TypeScript package that provides shared type definitions for the entire Rundown Studio ecosystem. This package is published as a separate npm package and used across the monorepo.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Run tests
npm test               # Run tests in watch mode
npm run test:ci        # Run tests once (for CI)

# Build the package
npm run build          # Creates dist/ folder with compiled output
```

### Code Quality
```bash
# Lint code (uses ESLint with @stylistic/eslint-plugin)
npx eslint src/

# Type checking is handled by the build process
npm run build
```

## Architecture Overview

### Package Structure
- **src/**: TypeScript source files containing type definitions
  - **src/__tests__/**: Vitest files located close to the tested code
- **dist/**: Built output (created by `npm run build`)

### Key Type Categories
- **Core Entities**: `Rundown`, `Cue`, `Cell`, `Column` - main business objects
- **Team Management**: `Team` - user and team-related types
- **Scheduling**: `Runner`, `Scheduler` - timing and execution types
- **API**: `ApiV0` - API interface definitions
- **Firebase**: `FirebaseBuiltins` - Firebase-specific type extensions
- **Utilities**: Helper functions and default value generators

### Type Organization
All types are exported from `src/index.ts` and organized by domain:
- Each major entity has its own file (e.g., `Cue.ts`, `Rundown.ts`)
- Related utilities are co-located in the same files
- Common Firebase patterns are abstracted in `FirebaseBuiltins.ts`

## Development Guidelines

### Adding New Types
1. Create types in the appropriate domain file (e.g., new cue-related types go in `Cue.ts`)
2. Export the types from the domain file
3. Re-export from `src/index.ts`
4. Add tests if the types include utility functions

### Type Conventions
- Use PascalCase for type names
- Use descriptive names that reflect the business domain
- Include JSDoc comments for complex types
- Leverage TypeScript utility types for consistency

### Dependencies
- **@rundown-studio/consts**: Shared constants (external package)
- **date-fns**: Date manipulation utilities
- Only add dependencies that are essential for type definitions

## Build and Publishing

### Build Process
- Uses `tsup` for fast TypeScript compilation
- Generates both ESM and CommonJS outputs
- Creates TypeScript declaration files
- Output formats: `dist/index.js` (ESM), `dist/index.cjs` (CommonJS), `dist/index.d.ts` (types)

### Package Configuration
- Supports both `import` and `require` through dual package exports
- Main entry points defined in `package.json` exports field
- Published to GitHub Package Registry (@rundown-studio scope)

## Code Quality Requirements

### ESLint Configuration
Uses strict ESLint rules with @stylistic/eslint-plugin:
- **No semicolons** at end of statements
- **Single quotes** for strings
- **Trailing commas** required in multi-line structures
- **2-space indentation**
- **Space before function parentheses**
- **Object curly spacing** required

### TypeScript Configuration
- **Strict mode** enabled
- **ESNext modules** for modern JavaScript features
- **Node module resolution**
- Targets ES2016 for broad compatibility

## Testing Strategy
- Uses Vitest for fast TypeScript testing
- Focus on testing utility functions and type guards
- Tests are located in `__tests__/` directories close to the source files
- Vitest configuration automatically finds tests in any `__tests__/` directory
- Run tests with `npm test` (watch mode) or `npm run test:ci` (single run for CI)
- Tests are written in TypeScript with full type checking
