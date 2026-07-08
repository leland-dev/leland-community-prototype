// Turn a display name into a profile-template slug, e.g.
// "Samantha Parker" → "samantha-parker". Kept in its own module (no imports)
// so both the feed (Home) and the people registry can use it without a cycle.
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
