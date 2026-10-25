export function firstFormField(root: HTMLElement | null): HTMLElement | null {
  return root?.querySelector<HTMLElement>('input, select, textarea') ?? null;
}
