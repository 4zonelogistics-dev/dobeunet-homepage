import { useState, useCallback, useMemo } from 'react';

export interface ValidationRule<T = string> {
  validate: (value: T) => boolean;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: ValidationRule[];
}

export interface FieldState {
  value: string;
  error: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState {
  [key: string]: FieldState;
}

export interface FormValidationConfig {
  [key: string]: FieldValidation;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\(\)\+]+$/;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.trim().replace(/\D/g, '');
}

function validateField(value: string, rules: FieldValidation): string {
  const trimmedValue = value.trim();

  if (rules.required && !trimmedValue) {
    return 'This field is required';
  }

  if (!trimmedValue) {
    return '';
  }

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`;
  }

  if (rules.email && !EMAIL_REGEX.test(normalizeEmail(trimmedValue))) {
    return 'Please enter a valid email address';
  }

  if (rules.phone && !PHONE_REGEX.test(trimmedValue)) {
    return 'Please enter a valid phone number';
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return 'Please enter a valid value';
  }

  if (rules.custom) {
    for (const rule of rules.custom) {
      if (!rule.validate(trimmedValue)) {
        return rule.message;
      }
    }
  }

  return '';
}

export function useFormValidation(config: FormValidationConfig) {
  const [formState, setFormState] = useState<FormState>(() => {
    const initialState: FormState = {};
    Object.keys(config).forEach(field => {
      initialState[field] = {
        value: '',
        error: '',
        touched: false,
        dirty: false,
      };
    });
    return initialState;
  });

  const setValue = useCallback((field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        dirty: true,
      },
    }));
  }, []);

  const setTouched = useCallback((field: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched: true,
      },
    }));
  }, []);

  const validateFieldByName = useCallback((field: string): boolean => {
    const fieldState = formState[field];
    const fieldConfig = config[field];

    if (!fieldState || !fieldConfig) {
      return true;
    }

    const error = validateField(fieldState.value, fieldConfig);

    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error,
      },
    }));

    return !error;
  }, [formState, config]);

  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newState = { ...formState };

    Object.keys(config).forEach(field => {
      const error = validateField(formState[field].value, config[field]);
      newState[field] = {
        ...newState[field],
        error,
        touched: true,
      };
      if (error) {
        isValid = false;
      }
    });

    setFormState(newState);
    return isValid;
  }, [formState, config]);

  const resetForm = useCallback(() => {
    const resetState: FormState = {};
    Object.keys(config).forEach(field => {
      resetState[field] = {
        value: '',
        error: '',
        touched: false,
        dirty: false,
      };
    });
    setFormState(resetState);
  }, [config]);

  const getFieldProps = useCallback((field: string) => {
    return {
      value: formState[field]?.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValue(field, e.target.value);
      },
      onBlur: () => {
        setTouched(field);
        validateFieldByName(field);
      },
    };
  }, [formState, setValue, setTouched, validateFieldByName]);

  const getNormalizedValues = useCallback(() => {
    const normalized: Record<string, string> = {};
    Object.keys(formState).forEach(field => {
      let value = formState[field].value.trim();
      if (config[field]?.email) {
        value = normalizeEmail(value);
      } else if (config[field]?.phone) {
        value = normalizePhone(value);
      }
      normalized[field] = value;
    });
    return normalized;
  }, [formState, config]);

  const isValid = useMemo(() => {
    return Object.values(formState).every(field => !field.error);
  }, [formState]);

  const isDirty = useMemo(() => {
    return Object.values(formState).some(field => field.dirty);
  }, [formState]);

  return {
    formState,
    setValue,
    setTouched,
    validateField: validateFieldByName,
    validateForm,
    resetForm,
    getFieldProps,
    getNormalizedValues,
    isValid,
    isDirty,
  };
}
