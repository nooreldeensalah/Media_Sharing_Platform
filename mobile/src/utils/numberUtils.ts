/**
 * Utility functions for number localization
 */

// Map of Western digits to Arabic-Indic digits
const arabicNumerals: { [key: string]: string } = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
};

/**
 * Convert Western numerals to Arabic-Indic numerals
 */
export const toArabicNumerals = (text: string): string => {
  return text.replace(/[0-9]/g, (digit) => arabicNumerals[digit] || digit);
};

/**
 * Format a number according to the current locale
 */
export const formatNumber = (number: number, locale: string): string => {
  const formatted = number.toString();
  return locale === "ar" ? toArabicNumerals(formatted) : formatted;
};

/**
 * Format any text containing numbers according to the current locale
 */
export const formatTextWithNumbers = (text: string, locale: string): string => {
  return locale === "ar" ? toArabicNumerals(text) : text;
};

/**
 * Check if the current locale is RTL
 */
export const isRTL = (locale: string): boolean => {
  return locale === "ar";
};

/**
 * Get the appropriate flex direction for the current locale
 */
export const getFlexDirection = (locale: string): "row" | "row-reverse" => {
  return isRTL(locale) ? "row-reverse" : "row";
};

/**
 * Get the appropriate chevron icon for previous button based on locale
 */
export const getPreviousChevron = (
  locale: string,
): "chevron-back" | "chevron-forward" => {
  return isRTL(locale) ? "chevron-forward" : "chevron-back";
};

/**
 * Get the appropriate chevron icon for next button based on locale
 */
export const getNextChevron = (
  locale: string,
): "chevron-back" | "chevron-forward" => {
  return isRTL(locale) ? "chevron-back" : "chevron-forward";
};

/**
 * Format a number range (e.g., "1 to 10") according to the current locale
 */
export const formatNumberRange = (
  start: number,
  end: number,
  total: number,
  locale: string,
): { start: string; end: string; total: string } => {
  if (locale === "ar") {
    return {
      start: toArabicNumerals(start.toString()),
      end: toArabicNumerals(end.toString()),
      total: toArabicNumerals(total.toString()),
    };
  }
  return {
    start: start.toString(),
    end: end.toString(),
    total: total.toString(),
  };
};
