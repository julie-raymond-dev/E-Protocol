/**
 * Utility functions for handling number parsing and formatting
 * Handles both French (comma) and English (dot) decimal separators
 */

/**
 * Parses a string value to a float, handling both comma and dot as decimal separators
 * @param {string} value - The string value to parse
 * @returns {number} The parsed number, or 0 if invalid
 */
export function parseLocalFloat(value: string): number {
  if (!value || value.trim() === '') {
    return 0;
  }

  // Replace comma with dot for parsing
  const normalizedValue = value.replace(',', '.');
  
  // Parse the value
  const parsed = parseFloat(normalizedValue);
  
  // Return 0 if NaN, otherwise return the parsed value
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a number for display, using locale-appropriate decimal separator
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

/**
 * Rounds a number to specified decimal places
 * @param {number} value - The number to round
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {number} Rounded number
 */
export function roundTo(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Validates if a string represents a valid number
 * @param {string} value - The string to validate
 * @returns {boolean} True if valid number, false otherwise
 */
export function isValidNumber(value: string): boolean {
  if (!value || value.trim() === '') {
    return false;
  }
  
  const normalizedValue = value.replace(',', '.');
  return !isNaN(parseFloat(normalizedValue)) && isFinite(parseFloat(normalizedValue));
}
