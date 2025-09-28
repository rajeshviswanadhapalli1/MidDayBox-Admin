/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string into a readable format
 * @param {string|number|Date} dateString - The date to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.showTime - Whether to show time (default: false)
 * @param {boolean} options.relative - Whether to show relative time (default: false)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const { showTime = false, relative = false } = options;
  
  try {
    // Handle null, undefined, or empty strings
    if (!dateString || dateString === "null" || dateString === "undefined") {
      return "N/A";
    }
    
    // Try to parse the date
    let date;
    
    // Handle different date formats
    if (typeof dateString === 'string') {
      // Remove any extra whitespace
      const cleanDateString = dateString.trim();
      
      // Try parsing as ISO string first
      date = new Date(cleanDateString);
      
      // If that fails, try other common formats
      if (isNaN(date.getTime())) {
        // Try parsing as timestamp
        const timestamp = parseInt(cleanDateString);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        } else {
          // Try parsing as date string without timezone
          const dateOnly = cleanDateString.split('T')[0];
          date = new Date(dateOnly);
        }
      }
    } else if (typeof dateString === 'number') {
      // Handle timestamp
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString);
      return "Invalid Date";
    }
    
    // If relative time is requested
    if (relative) {
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
          return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
          return date.toLocaleDateString();
        }
      }
    }
    
    // Format the date
    if (showTime) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateString);
    return "Invalid Date";
  }
};

/**
 * Formats a date for display in tables (short format)
 * @param {string|number|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export const formatTableDate = (dateString) => {
  return formatDate(dateString, { showTime: false });
};

/**
 * Formats a date for display in details (with time)
 * @param {string|number|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export const formatDetailDate = (dateString) => {
  return formatDate(dateString, { showTime: true });
};

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 * @param {string|number|Date} dateString - The date to format
 * @returns {string} Formatted relative time string
 */
export const formatRelativeDate = (dateString) => {
  return formatDate(dateString, { relative: true });
}; 