export function mergeClasses(...classes: (string | string[])[]) {
  return [...new Set(classes.flat().filter(Boolean))].join(" ");
}
