/**
 * Shared date formatting utilities.
 * Centralised here to avoid duplication across components.
 */

/** Short date: "15 Jan 2025" */
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

/** Long date with time: "15 January 2025, 03:45 PM" */
export const formatDateTime = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
