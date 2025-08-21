# Rundown Studio Shared Types

## Install

```sh
echo "@rundown-studio:registry=https://npm.pkg.github.com" >> .npmrc

npm i @rundown-studio/types
```

## Type System Architecture

This package uses a three-tier type system for handling data transformations across the application stack:

### Type Naming Convention

For each entity (e.g., `Rundown`, `Cue`, `Team`), we define three distinct types:

1. **`EntityFirestore`** - Raw data from Firestore snapshots
   - Contains Firestore `Timestamp` objects
   - No `id`, `createdAt`, or `updatedAt` fields (these come from snapshot metadata)

2. **`EntitySerialized`** - Data serialized for API/network transmission
   - Contains ISO date strings instead of Date objects
   - Includes `id`, `createdAt`, and `updatedAt` fields

3. **`Entity`** - The primary type for application logic
   - Contains JavaScript `Date` objects
   - Includes `id`, `createdAt`, and `updatedAt` fields
   - This is what your application code should primarily work with

### Converter Functions

Each entity includes type-safe converter functions:

- `entityFromSnapshot(snapshot)` - Converts Firestore snapshot to `Entity`
- `entityFromSerialized(serialized)` - Converts `EntitySerialized` to `Entity`

### Example

```typescript
import { Rundown, RundownFirestore, RundownSerialized, rundownFromSnapshot, rundownFromSerialized } from '@rundown-studio/types'

// From Firestore
const snapshot: DocumentSnapshot<RundownFirestore> = // ...
const rundown: Rundown = rundownFromSnapshot(snapshot)

// From API
const apiData: RundownSerialized = // ...
const rundown: Rundown = rundownFromSerialized(apiData)
```

This approach eliminates type assertions and provides clear transformation boundaries throughout your application.

## Pinned Dependencies

- nanoid@3: Higher versions no longer work with `require` imports
