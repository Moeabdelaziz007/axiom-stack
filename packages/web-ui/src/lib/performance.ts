// Performance optimization utilities for the Axiom Command Center

// Debounce function to limit the rate at which a function is called
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to limit the rate at which a function is called
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoize function to cache results of expensive function calls
export function memoize<T>(func: (arg: T) => T): (arg: T) => T {
  const cache = new Map<string, T>();
  
  return function (arg: T): T {
    const key = JSON.stringify(arg);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(arg);
    cache.set(key, result);
    return result;
  };
}

// Format large numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format currency values
export function formatCurrency(value: number, currency: string = 'AXM'): string {
  return `${value.toFixed(2)} ${currency}`;
}

// Format percentages
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}