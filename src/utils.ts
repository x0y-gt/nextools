/**
 * Calling this function will return true if the current device is a mobile or tablet device.
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false; // SSR / Node

  const ua = navigator.userAgent || navigator.vendor || ""; // suficiente

  return /android|ipad|iphone|ipod|windows phone|tablet/i.test(ua);
}

/**
 * Calling this function will return true if we're in a browser environment
 * or false if we're in a Node.js environment.
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

export function mergeClasses(
  ...classes: (string | string[] | undefined)[]
): string {
  return [
    ...new Set(
      classes
        .flat()
        .map((cls) => (cls === undefined ? "undefined" : cls))
        .filter(Boolean),
    ),
  ].join(" ");
}
