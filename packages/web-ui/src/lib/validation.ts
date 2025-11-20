// Validation utilities for the Axiom Command Center

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationService {
  // Validate wallet address format
  static validateWalletAddress(address: string): boolean {
    // Basic Solana address validation (Base58, 32-44 characters)
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address);
  }

  // Validate required fields
  static validateRequired(value: string | number | null | undefined, fieldName: string): ValidationError | null {
    if (value === null || value === undefined || value === '') {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  }

  // Validate string length
  static validateStringLength(
    value: string,
    fieldName: string,
    min: number = 1,
    max: number = 100
  ): ValidationError | null {
    if (value.length < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min} characters` };
    }
    if (value.length > max) {
      return { field: fieldName, message: `${fieldName} must be no more than ${max} characters` };
    }
    return null;
  }

  // Validate number range
  static validateNumberRange(
    value: number,
    fieldName: string,
    min: number = 0,
    max: number = Number.MAX_SAFE_INTEGER
  ): ValidationError | null {
    if (value < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min}` };
    }
    if (value > max) {
      return { field: fieldName, message: `${fieldName} must be no more than ${max}` };
    }
    return null;
  }

  // Validate email format
  static validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Invalid email format' };
    }
    return null;
  }

  // Validate URL format
  static validateUrl(url: string): ValidationError | null {
    try {
      new URL(url);
      return null;
    } catch {
      return { field: 'url', message: 'Invalid URL format' };
    }
  }
}

// Type-safe validation helper
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: { [K in keyof T]?: (value: T[K]) => ValidationError | null }
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    if (validator) {
      const error = validator(data[field as keyof T]);
      if (error) {
        errors.push(error);
      }
    }
  }
  
  return errors;
}