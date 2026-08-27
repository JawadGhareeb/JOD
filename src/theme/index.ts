/**
 * Brand/system color — single JS-level source of truth, kept in sync with
 * the --color-primary CSS variable in app/global.css.
 */
export const PRIMARY_COLOR_LIGHT = "#4A9782";
export const PRIMARY_COLOR_DARK = "#4A9782";

export function getPrimaryColor(isDark: boolean): string {
  return isDark ? PRIMARY_COLOR_DARK : PRIMARY_COLOR_LIGHT;
}
