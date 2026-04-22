# Leland Community Prototype — Claude Instructions

## Buttons

Always use the `Button` or `LinkButton` components from `src/components/Button.tsx`. Never write raw `<button>` or `<a>` elements styled to look like buttons.

```tsx
import { Button, LinkButton } from "../components/Button";
```

### Sizes
| Prop | Use for |
|------|---------|
| `size="sm"` | Compact UI, action rows, inline controls |
| `size="md"` | Default — use when unsure |
| `size="lg"` | Primary CTAs, empty states |

### Variants
| Prop | Use for |
|------|---------|
| `variant="primary"` | Main actions (green) |
| `variant="secondary"` | Secondary/gray actions |

### Examples
```tsx
<Button size="md" variant="primary">Save</Button>
<Button size="sm" variant="secondary">Cancel</Button>
<LinkButton size="lg" variant="primary" href="/courses">Browse courses</LinkButton>
```

All buttons are `font-medium` at `1.2` line height by default — do not override these.
