# Schema Changes

Changes made to PayloadCMS collections as part of the terminal redesign.

## Projects collection (`src/collections/Projects.ts`)

### Added fields

| Field    | Type     | Default    | Position | Description                        |
|----------|----------|------------|----------|------------------------------------|
| `status` | `select` | `"active"` | sidebar  | Project status: `active` or `archived`. Displayed as `● active` / `○ archived` on cards. |
| `year`   | `text`   | —          | sidebar  | Year label (e.g. `"2024"`). Falls back to `updatedAt` year if empty. |

### Migration notes

- Both fields are **additive** — existing projects are not broken.
- `status` defaults to `"active"`, so existing projects show as active automatically.
- `year` is optional; the frontend falls back to `new Date(project.updatedAt).getFullYear()`.

### After deploying

Run the following to regenerate TypeScript types:

```bash
pnpm payload generate:types
```

This will add `status` and `year` to the `Project` type in `src/payload-types.ts`.
Until then, these fields are accessed via `(project as any).status` and `(project as any).year`
in the project detail page (`src/app/(frontend)/[locale]/projects/[slug]/page.tsx`).
