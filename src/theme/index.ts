/**
 * Brand/system color — single JS-level source of truth, kept in sync with
 * the --color-primary CSS variable in app/global.css. Needed anywhere a
 * plain hex string is required (e.g. icon `color` props) since those can't
 * read CSS custom properties directly.
 */
export const PRIMARY_COLOR_LIGHT = "#4A9782";
export const PRIMARY_COLOR_DARK = "#65B5A0";

export function getPrimaryColor(isDark: boolean): string {
  return isDark ? PRIMARY_COLOR_DARK : PRIMARY_COLOR_LIGHT;
}
