/**
 * Format date using locale via Intl.DateTimeFormat.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @param {Date} date Date to format.
 * @param {string} [locale='is'] Locale to use for formatting.
 * @returns Date formatted for locale.
 */
export function formatDate(date, locale = 'is') {
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  return formatter.format(date);
}
