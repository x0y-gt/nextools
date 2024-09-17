/**
 * Calling this function will return true if the current device is a mobile or tablet device.
 */
export function isMobile(): boolean {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|ipad|iphone|ipod|windows phone|tablet/i.test(userAgent);
  }

  return false;
}

/**
 * Calling this function will return true if we're in a browser environment
 * or false if we're in a Node.js environment.
 */
export function isBrowser() {
  return typeof window !== "undefined";
}

export function mergeClasses(...classes: (string | string[])[]) {
  return [...new Set(classes.flat().filter(Boolean))].join(" ");
}
