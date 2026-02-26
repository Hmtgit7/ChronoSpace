export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateUniqueSlug(title: string, suffix?: string): string {
  const base = generateSlug(title);
  return suffix ? `${base}-${suffix}` : base;
}
