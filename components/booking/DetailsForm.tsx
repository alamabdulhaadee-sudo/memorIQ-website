'use client';

import { useEffect, type ReactNode } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import type { EventType } from '@/types/booking';

// ── Phone formatting ───────────────────────────────────────────

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ── Validation ─────────────────────────────────────────────────

function isValidEmail(v: string): boolean {
  const parts = v.split('@');
  return parts.length === 2 && parts[1].includes('.');
}

function isValidPhone(v: string): boolean {
  return v.replace(/\D/g, '').length === 10;
}

interface ValidationErrors {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  eventType: string | null;
  venueAddress: string | null;
}

function getErrors(state: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: EventType | null;
  venueAddress: string;
}): ValidationErrors {
  return {
    customerName:  state.customerName.trim() === '' ? 'Name is required.' : null,
    customerEmail: state.customerEmail.trim() === ''
      ? 'Email is required.'
      : !isValidEmail(state.customerEmail)
      ? 'Enter a valid email address.'
      : null,
    customerPhone: state.customerPhone.trim() === ''
      ? 'Phone is required.'
      : !isValidPhone(state.customerPhone)
      ? 'Enter a 10-digit phone number.'
      : null,
    eventType:    state.eventType === null ? 'Select an event type.' : null,
    venueAddress: state.venueAddress.trim() === '' ? 'Venue address is required.' : null,
  };
}

// ── CheckIcon ──────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="7.5" stroke="#2e7d52" strokeWidth="1" />
      <path
        d="M4.5 8.25L6.75 10.5L11.5 5.5"
        stroke="#2e7d52"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Shared input styles ────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-bone)',
  border: '0.5px solid var(--color-border-light)',
  borderRadius: '4px',
  padding: '12px 16px',
  fontSize: '15px',
  color: 'var(--color-ink-soft)',
  outline: 'none',
  fontFamily: 'inherit',
};

// ── FormField wrapper ──────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  touched: boolean;
  error: string | null;
  showCheck: boolean;
  children: ReactNode;
}

function FormField({ label, required = false, touched, error, showCheck, children }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          style={{
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-warm-gray)',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-clay)', marginLeft: '3px' }} aria-hidden="true">*</span>
          )}
        </label>
        {showCheck && touched && !error && <CheckIcon />}
      </div>

      {/* Input slot */}
      {children}

      {/* Error */}
      {touched && error && (
        <p
          role="alert"
          style={{
            fontSize: '12px',
            color: 'var(--color-error)',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── Chevron data URI for select ────────────────────────────────

const chevronDataUri =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%238A7B68' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

// ── DetailsForm ────────────────────────────────────────────────

interface DetailsFormProps {
  onValidityChange: (valid: boolean) => void;
}

// Touched state shape
interface TouchedState {
  customerName: boolean;
  customerEmail: boolean;
  customerPhone: boolean;
  eventType: boolean;
  venueAddress: boolean;
}

import { useState } from 'react';

export function DetailsForm({ onValidityChange }: DetailsFormProps) {
  const { state, dispatch } = useBooking();

  const [touched, setTouched] = useState<TouchedState>({
    customerName:  false,
    customerEmail: false,
    customerPhone: false,
    eventType:     false,
    venueAddress:  false,
  });

  // Focus-border toggle state per field
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Local display value for the phone input — formatted for the user to read,
  // while the raw 10-digit string is what we store in BookingContext.
  // Initialise from context in case the user is navigating back.
  const [phoneDisplay, setPhoneDisplay] = useState<string>(() =>
    formatPhone(state.customerPhone),
  );

  const errors = getErrors(state);
  const isFormValid = Object.values(errors).every((e) => e === null);

  // Notify parent whenever validity changes
  useEffect(() => {
    onValidityChange(isFormValid);
  }, [isFormValid, onValidityChange]);

  function touch(field: keyof TouchedState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function inputStyle(field: string): React.CSSProperties {
    return {
      ...inputBase,
      borderColor: focusedField === field ? 'var(--color-clay)' : 'var(--color-border-light)',
    };
  }

  function selectStyle(field: string): React.CSSProperties {
    return {
      ...inputBase,
      borderColor: focusedField === field ? 'var(--color-clay)' : 'var(--color-border-light)',
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: chevronDataUri,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center',
      paddingRight: '40px',
      cursor: 'pointer',
    };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* 1. Your name */}
      <FormField
        label="Your name"
        required
        touched={touched.customerName}
        error={errors.customerName}
        showCheck
      >
        <input
          type="text"
          autoComplete="name"
          value={state.customerName}
          style={inputStyle('customerName')}
          onFocus={() => setFocusedField('customerName')}
          onBlur={() => { setFocusedField(null); touch('customerName'); }}
          onChange={(e) => dispatch({ type: 'SET_CUSTOMER_NAME', payload: e.target.value })}
        />
      </FormField>

      {/* 2. Email */}
      <FormField
        label="Email"
        required
        touched={touched.customerEmail}
        error={errors.customerEmail}
        showCheck
      >
        <input
          type="email"
          autoComplete="email"
          value={state.customerEmail}
          style={inputStyle('customerEmail')}
          onFocus={() => setFocusedField('customerEmail')}
          onBlur={() => { setFocusedField(null); touch('customerEmail'); }}
          onChange={(e) => dispatch({ type: 'SET_CUSTOMER_EMAIL', payload: e.target.value })}
        />
      </FormField>

      {/* 3. Phone */}
      <FormField
        label="Phone"
        required
        touched={touched.customerPhone}
        error={errors.customerPhone}
        showCheck
      >
        <input
          type="tel"
          autoComplete="tel"
          value={phoneDisplay}
          placeholder="(416) 555-0100"
          style={inputStyle('customerPhone')}
          onFocus={() => setFocusedField('customerPhone')}
          onBlur={() => { setFocusedField(null); touch('customerPhone'); }}
          onChange={(e) => {
            // Extract raw digits only (max 10), store in context; show formatted in input
            const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
            setPhoneDisplay(formatPhone(raw));
            dispatch({ type: 'SET_CUSTOMER_PHONE', payload: raw });
          }}
        />
      </FormField>

      {/* 4. Event type */}
      <FormField
        label="Event type"
        required
        touched={touched.eventType}
        error={errors.eventType}
        showCheck
      >
        <select
          value={state.eventType ?? ''}
          style={selectStyle('eventType')}
          onFocus={() => setFocusedField('eventType')}
          onBlur={() => { setFocusedField(null); touch('eventType'); }}
          onChange={(e) =>
            dispatch({
              type: 'SET_EVENT_TYPE',
              payload: (e.target.value as EventType) || null,
            })
          }
        >
          <option value="" disabled>Select one</option>
          <option value="wedding">Wedding</option>
          <option value="corporate">Corporate</option>
          <option value="birthday">Birthday</option>
          <option value="other">Other</option>
        </select>
      </FormField>

      {/* 5. Venue name (optional) */}
      <FormField
        label="Venue name"
        required={false}
        touched={false}
        error={null}
        showCheck={false}
      >
        <input
          type="text"
          autoComplete="off"
          value={state.venueName}
          placeholder="Optional"
          style={inputStyle('venueName')}
          onFocus={() => setFocusedField('venueName')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => dispatch({ type: 'SET_VENUE_NAME', payload: e.target.value })}
        />
      </FormField>

      {/* 6. Venue address */}
      <FormField
        label="Venue address"
        required
        touched={touched.venueAddress}
        error={errors.venueAddress}
        showCheck
      >
        <input
          type="text"
          autoComplete="street-address"
          value={state.venueAddress}
          style={inputStyle('venueAddress')}
          onFocus={() => setFocusedField('venueAddress')}
          onBlur={() => { setFocusedField(null); touch('venueAddress'); }}
          onChange={(e) => dispatch({ type: 'SET_VENUE_ADDRESS', payload: e.target.value })}
        />
      </FormField>

      {/* 7. Guest count (optional) */}
      <FormField
        label="Expected guest count"
        required={false}
        touched={false}
        error={null}
        showCheck={false}
      >
        <input
          type="number"
          min={1}
          value={state.guestCount ?? ''}
          placeholder="Optional"
          style={inputStyle('guestCount')}
          onFocus={() => setFocusedField('guestCount')}
          onBlur={() => setFocusedField(null)}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            dispatch({ type: 'SET_GUEST_COUNT', payload: isNaN(parsed) ? null : parsed });
          }}
        />
      </FormField>

      {/* 8. Notes (optional) */}
      <FormField
        label="Anything else we should know?"
        required={false}
        touched={false}
        error={null}
        showCheck={false}
      >
        <div style={{ position: 'relative' }}>
          <textarea
            rows={4}
            maxLength={500}
            value={state.notes}
            style={{
              ...inputStyle('notes'),
              resize: 'vertical',
              lineHeight: 1.55,
            }}
            onFocus={() => setFocusedField('notes')}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
          />
          <p
            style={{
              fontSize: '11px',
              color: 'var(--color-warm-gray)',
              textAlign: 'right',
              margin: '4px 0 0',
            }}
          >
            {state.notes.length} / 500
          </p>
        </div>
      </FormField>
    </div>
  );
}
