import React from 'react';
import './forms.css';

/**
 * Shared FormField component for text, tel, email, date, select, textarea, checkbox, and radio-group.
 * Implements full accessibility: visible label, aria-invalid, aria-describedby,
 * role="alert" for error messages, min-height 44px, and 16px minimum font size.
 */
export function FormField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  hint,
  error,
  options = [],
  rows = 4,
  min,
  className = '',
  inputRef,
  ...rest
}) {
  const fieldId = id || `form-field-${name}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  // Radio Group rendering inside fieldset with legend
  if (type === 'radio-group') {
    return (
      <fieldset className={`form-field form-field--radio-group ${error ? 'has-error' : ''} ${className}`}>
        {label && (
          <legend className="form-label">
            {label}
            {required && <span className="form-required" aria-hidden="true">*</span>}
          </legend>
        )}
        {hint && <p id={hintId} className="form-hint">{hint}</p>}

        <div className="form-radio-pills" role="radiogroup">
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isChecked = value === optVal;
            const radioId = `${fieldId}-${optVal}`;

            return (
              <label
                key={optVal}
                htmlFor={radioId}
                className={`form-radio-pill ${isChecked ? 'is-checked' : ''}`}
              >
                <input
                  type="radio"
                  id={radioId}
                  name={name}
                  value={optVal}
                  checked={isChecked}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="form-radio-input sr-only"
                  aria-describedby={describedBy}
                  {...rest}
                />
                <span className="form-radio-text">{optLabel}</span>
              </label>
            );
          })}
        </div>

        {error && (
          <p id={errorId} className="form-error" role="alert">
            <span className="form-error__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="var(--ink)" strokeWidth="2" fill="var(--tint-pink)" />
                <path d="M8 4.5v4M8 11.5h.01" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span>{error}</span>
          </p>
        )}
      </fieldset>
    );
  }

  // Checkbox type rendering with custom styled box and real accessible input
  if (type === 'checkbox') {
    return (
      <div className={`form-field form-field--checkbox ${error ? 'has-error' : ''} ${className}`}>
        <label htmlFor={fieldId} className="form-checkbox-label">
          <input
            ref={inputRef}
            type="checkbox"
            id={fieldId}
            name={name}
            checked={Boolean(value)}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className="form-checkbox-input sr-only"
            {...rest}
          />
          <span className={`form-checkbox-box ${value ? 'is-checked' : ''}`} aria-hidden="true">
            {Boolean(value) && (
              <svg width="12" height="10" viewBox="0 0 14 11" fill="none">
                <path d="M1.5 5.5L5 9L12.5 1.5" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="form-checkbox-text">
            {label}
            {required && <span className="form-required" aria-hidden="true">*</span>}
          </span>
        </label>

        {hint && <p id={hintId} className="form-hint">{hint}</p>}

        {error && (
          <p id={errorId} className="form-error" role="alert">
            <span className="form-error__icon" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="var(--ink)" strokeWidth="2" fill="var(--tint-pink)" />
                <path d="M8 4.5v4M8 11.5h.01" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`form-field form-field--${type} ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="form-required" aria-hidden="true">*</span>}
        </label>
      )}

      {hint && <p id={hintId} className="form-hint">{hint}</p>}

      <div className="form-control-wrap">
        {type === 'textarea' ? (
          <textarea
            ref={inputRef}
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className="form-control form-textarea"
            {...rest}
          />
        ) : type === 'select' ? (
          <div className="form-select-wrap">
            <select
              ref={inputRef}
              id={fieldId}
              name={name}
              value={value || ''}
              onChange={onChange}
              onBlur={onBlur}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              className="form-control form-select"
              {...rest}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((opt) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={optVal} value={optVal}>
                    {optLabel}
                  </option>
                );
              })}
            </select>
            <span className="form-select-arrow" aria-hidden="true">▼</span>
          </div>
        ) : (
          <input
            ref={inputRef}
            type={type}
            id={fieldId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            min={min}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className="form-control form-input"
            {...rest}
          />
        )}
      </div>

      {error && (
        <p id={errorId} className="form-error" role="alert">
          <span className="form-error__icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="var(--ink)" strokeWidth="2" fill="var(--tint-pink)" />
              <path d="M8 4.5v4M8 11.5h.01" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export default FormField;
