/**
 * Type definitions for Gent Styleguide JavaScript libraries
 */

interface ResponsiveTableOptions {
  scrollableText?: string;
}

declare class ResponsiveTable {
  constructor(element: Element, options?: ResponsiveTableOptions);
}

interface Window {
  ResponsiveTable: typeof ResponsiveTable;
}
