export function formatDate(dateString: string, format: string = "dd/mm/yyyy") {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return format
    .replace("dd", day)
    .replace("mm", month)
    .replace("yyyy", String(year));
}

export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = "en-US",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount.toString();
  }
}
