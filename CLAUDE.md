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

# Lint code
npm run lint           # Check for linting errors
npm run lint:fix       # Auto-fix linting errors where possible

# Build the package
npm run build          # Creates dist/ folder with compiled output
```

### Code Quality
```bash
# Lint and format code (uses Biome)
npm run lint           # Check for linting/formatting errors
npm run lint:fix       # Auto-fix errors where possible (biome check --write)

# Type checking
npm run typecheck      # tsc --noEmit
```

**IMPORTANT**: Always run `npm run lint` after making code changes to ensure code follows the project's Biome rules.

If there are linting errors:
1. First try auto-fix: `npm run lint:fix`
2. Manually address any remaining issues that can't be auto-fixed

## Architecture Overview

### Package Structure
```
src/
├── index.ts          # Main export file
├── types/           # All type definitions
│   ├── ApiV0.ts
│   ├── Cell.ts
│   ├── Column.ts
│   ├── Cue.ts
│   ├── FirebaseBuiltins.ts
│   ├── Mention.ts
│   ├── Rundown.ts
│   ├── Runner.ts
│   ├── Scheduler.ts
│   └── Team.ts
└── utils/           # All utility functions
    ├── converters.ts
    ├── generateSalt.ts
    ├── typeUtils.ts
    └── useDefaults.ts
```

### Three-Tier Type System
Each entity follows a consistent three-tier pattern:

1. **Main Type** (e.g., `Rundown`) - Application logic with JavaScript `Date` objects
2. **Firestore Type** (e.g., `RundownFirestore`) - Raw Firestore data with `Timestamp` objects
3. **Serialized Type** (e.g., `RundownSerialized`) - API/network data with ISO strings

### Key Type Categories
- **Core Entities**: `Rundown`, `Cue`, `Cell`, `Column`, `Mention` - main business objects
- **Team Management**: `Team` - user and team-related types
- **Scheduling**: `Runner`, `Scheduler` - timing and execution types
- **API**: `ApiV0` - External API interface definitions
- **Firebase**: `FirebaseBuiltins` - Firebase-specific type extensions
- **Utilities**: Generic converters, type transformations, and helpers

### Type Organization
- All types are exported from `src/index.ts`
- Types are organized by domain in the `types/` folder
- Utilities are centralized in the `utils/` folder
- Generic converters (`fromSnapshot`, `fromSerialized`) with entity-specific wrappers

## Development Guidelines

### Adding New Types
1. Create types in the appropriate domain file in `src/types/` (e.g., new cue-related types go in `types/Cue.ts`)
2. Follow the three-tier pattern: Main type, EntityFirestore, EntitySerialized
3. Add entity-specific converter functions using the generic converters
4. Export the types from the domain file
5. Re-export from `src/index.ts`
6. Add tests if the types include utility functions

### Adding New Entities
When adding a completely new entity:
1. Create `types/NewEntity.ts` following the established pattern
2. Use the generic converters from `utils/converters.ts`
3. Add type transformations using utilities from `utils/typeUtils.ts`
4. Add to `ApiV0.ts` if it needs external API exposure

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
- Uses `tsdown` (Rolldown-powered) for fast TypeScript compilation
- Generates both ESM and CommonJS outputs
- Creates TypeScript declaration files for each format
- Output formats: `dist/index.mjs` (ESM), `dist/index.cjs` (CommonJS), `dist/index.d.mts` + `dist/index.d.cts` (types)

### Package Configuration
- Supports both `import` and `require` through dual package exports
- Main entry points defined in `package.json` exports field
- Published to GitHub Package Registry (@rundown-studio scope)

## Code Quality Requirements

### Biome Configuration
Linting and formatting are handled by Biome (`biome.json`):
- **No semicolons** at end of statements (`semicolons: asNeeded`)
- **Single quotes** for strings
- **Trailing commas** required in multi-line structures (`trailingCommas: all`)
- **2-space indentation**
- **120 character line width**
- `noExplicitAny` is off; tests disable `noUnusedExpressions`

### TypeScript Configuration
- **Strict mode** enabled
- **ESNext modules** for modern JavaScript features
- **Bundler module resolution**
- Targets ES2022

## Testing Strategy
- Uses Vitest for fast TypeScript testing
- Focus on testing utility functions and type guards
- Tests are located in `__tests__/` directories close to the source files
- Vitest configuration automatically finds tests in any `__tests__/` directory
- Run tests with `npm test` (watch mode) or `npm run test:ci` (single run for CI)
- Tests are written in TypeScript with full type checking
