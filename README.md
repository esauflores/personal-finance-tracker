# Personal Finance Tracker

Personal Finance Tracker as a web application

## Tech Stack

### Core

- React
- TypeScript
- Vite

## Available Scripts

| Command          | Description                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Start the development server                                                                              |
| `npm run build`  | Build the application for production                                                                      |
| `npm run format` | Format the code using Prettier and fix linting issues with ESLint                                         |
| `npm run lint`   | Check for linting issues with ESLint, formatting issues with Prettier, and analyze dependencies with Knip |

## Project Structure

```
src/
├── main.tsx
├── pages/              (pages of the application)
├── shared/             (shared components, utilities, etc.)
│   └── components/

```

## Feature Based Architecture

This project follows feature-based architecture, add new modlets in the `src` directory.

Each modlet should have the following structure:

```src/
├── modlet-name/
│   ├── types.ts        (types specific to the modlet)
│   ├── store.ts        (state management specific to the modlet)
│   ├── components/     (components specific to the modlet)
│   │   └── index.ts
│   ├── lib/            (core logic specific to the modlet)
│   │   └── index.ts
│   ├── hooks/          (custom hooks specific to the modlet)
│   │   └── index.ts
│   └── tests/          (tests specific to the modlet)
```

types.ts, store.ts are files at root for simplicity, but if modlet grows, they can be moved to folders:

```src/
├── modlet-name/
|   ...
│   ├── types/          (types specific to the modlet)
│   │   └── index.ts
│   ├── store/          (state management specific to the modlet)
│   │   └── index.ts
```

Each modlet subfolder should contain an `index.ts` file that exports all the necessary items.

How to import from a modlet:

Internal imports:

```ts
import { ComponentA } from './components/ComponentA'
import { useCustomHook } from './hooks/useCustomHook'
import { someFunction } from './lib/someFunction'
import { someStore } from './store'
import { SomeType } from './types'
```

External imports:

```ts
import { ComponentA } from '@/modlet-name/components'
import { useCustomHook } from '@/modlet-name/hooks'
import { someFunction } from '@/modlet-name/lib'
import { someStore } from '@/modlet-name/store'
import { SomeType } from '@/modlet-name/types'
```

## Commit Convention

This project follows the Conventional Commits specification. The commit message should be in the format:

```
<type>(<scope>): <description>

```

Types:

| Type     | Description                              |
| -------- | ---------------------------------------- |
| feat     | New feature or modlet                    |
| fix      | Bug fix                                  |
| refactor | Code change that is not a fix or feature |
| style    | Formatting, missing semicolons, etc.     |
| docs     | Documentation only                       |
| test     | Adding or updating tests                 |
| chore    | Build process, tooling, dependencies     |

Examples:

```
chore: init project structure
```

```
chore: add supabase client
feat(auth): add login functionality
fix(auth): handle error response correctly
refactor(auth): simplify authentication logic
test(auth): add tests for user authentication
docs: update README with new instructions
```
