import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance for server-side sanitization
const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window);

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes all HTML tags and dangerous content
 *
 * @param input - User input string to sanitize
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(input: string): string {
  // Configure DOMPurify to strip all HTML tags
  const sanitized = purify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });

  return sanitized.trim();
}

/**
 * Sanitizes an object's string properties
 *
 * @param obj - Object with string properties to sanitize
 * @returns New object with sanitized string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (value !== null && value !== undefined) {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
