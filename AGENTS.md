# Project Time – Agent Guidelines

## 1. Build / Lint / Test Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server (hot‑reload, SPA). |
| `npm run build` | Compile production assets to `/dist`. |
| `npm run preview` | Serve the built bundle locally for inspection. |
| `npm run lint` | Run ESLint on all `.js`, `.vue` files in `src`. |
| `npm run typecheck` | Type‑script type‑checking with Vue TS support (`vue-tsc`). |

### Running a single test
The project currently has no dedicated test framework. If you add Vitest or Jest, the following patterns work:
```bash
# Vitest – add to scripts
"test:single": "vitest run <file>"
```
Replace `<file>` with the relative path.
If using Jest:
```bash
"test:single": "jest --runTestsByPath <file>"
```
If no test framework is present, create a temporary `tests` folder and add a simple Vitest config.

## 2. Code Style Guidelines

### Imports & Module Resolution
- Use absolute imports from the project root (`src/...`).
- Prefer named imports; avoid wildcard imports unless re‑exporting.
- Keep import order: **Vue core → third‑party libs → local modules**.
- End each file with a single newline.

### Formatting
- Run `npm run lint` before committing – it enforces Prettier via ESLint.
- Indentation: 2 spaces, no tabs.
- Line length: max 120 characters.
- Trailing commas are required in multi‑line objects/arrays.

### Types & Interfaces
- All public APIs should be typed (`.ts` or `.vue` with `<script lang="ts">`).
- Prefer `interface` over `type` for object shapes that may extend.
- Use `readonly` where appropriate (e.g., props, state constants).
- Avoid `any`; use `unknown` and narrow types.

### Naming Conventions
| Context | Convention |
|---------|------------|
| Components | PascalCase (`MyComponent.vue`) |
| Props & data | camelCase |
| Constants | UPPER_SNAKE_CASE |
| Functions | camelCase |
| Types / Interfaces | PascalCase |

### Error Handling
- Use `try/catch` around async operations that may reject.
- Log errors to console with context (`console.error('Failed to fetch', err)`).
- Do not swallow errors silently; surface them or rethrow.

### Vue Specifics
- Keep `<script setup>` for composition API.
- Use `defineProps`, `defineEmits` for type safety.
- Avoid global state unless necessary – prefer Pinia store (`src/store.ts`).
- Re‑use components via `<component :is="..." />` when dynamic rendering is needed.

## 3. Additional Rules

### Cursor Rules
No `.cursor/rules/` directory found.

### Copilot Instructions
No `.github/copilot-instructions.md` present.

## 4. Tooling & Configuration

### ESLint
The project uses the following rule set (see `eslint.config.ts`):
```ts
import { defineConfig } from 'eslint-define-config';
export default defineConfig({
  extends: ['plugin:vue/vue3-recommended', 'prettier'],
  rules: {
    // Vue specific
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    // TypeScript
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
});
```
Adjustments should preserve the `prettier` integration.

### Prettier
Configuration lives in `.prettierrc`. Key settings:
```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "endOfLine": "lf"
}
```
Run `npm run lint` to format automatically.

### TypeScript
The project uses a hybrid setup: `tsconfig.json` for Node, `tsconfig.app.json` for the Vite build. Ensure `strict` mode is enabled and `noImplicitAny` is true.

## 5. Environment Variables & Secrets

If your application requires API keys or secrets, place them in a `.env` file at the project root. Example:
```
VITE_API_KEY=your_api_key_here
```
The Vite build will expose variables prefixed with `VITE_`. Never commit real secrets.

## 6. Commit & Pull Request Guidelines

- Follow Conventional Commits: `feat`, `fix`, `docs`, `style`, etc.
- Run `npm run lint` and `npm run typecheck` before pushing.
- Use the GitHub Actions workflow in `.github/workflows/pages.yml` to deploy the site.

---
End of guidelines. Happy coding!
