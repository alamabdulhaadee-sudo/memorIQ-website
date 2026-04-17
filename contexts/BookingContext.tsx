'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';

import type { BookingState, BookingAction } from '@/types/booking';

// ── Initial state ─────────────────────────────────────────────
// packageId defaults to 'signature' per spec (most popular, pre-selected).
// depositAmount is always 10000 ($100) — never changes.

const initialState: BookingState = {
  eventDate:      null,
  packageId:      'signature',
  customerName:   '',
  customerEmail:  '',
  customerPhone:  '',
  eventType:      null,
  venueName:      '',
  venueAddress:   '',
  guestCount:     null,
  notes:          '',
  templateChoice: null,
  backdropChoice: null,
  selectedAddOns: [],
  subtotal:       0,
  depositAmount:  10000,
};


// ── Reducer ───────────────────────────────────────────────────

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_EVENT_DATE':
      return { ...state, eventDate: action.payload };
    case 'SET_PACKAGE_ID':
      return { ...state, packageId: action.payload };
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.payload };
    case 'SET_CUSTOMER_EMAIL':
      return { ...state, customerEmail: action.payload };
    case 'SET_CUSTOMER_PHONE':
      return { ...state, customerPhone: action.payload };
    case 'SET_EVENT_TYPE':
      return { ...state, eventType: action.payload };
    case 'SET_VENUE_NAME':
      return { ...state, venueName: action.payload };
    case 'SET_VENUE_ADDRESS':
      return { ...state, venueAddress: action.payload };
    case 'SET_GUEST_COUNT':
      return { ...state, guestCount: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_TEMPLATE_CHOICE':
      return { ...state, templateChoice: action.payload };
    case 'SET_BACKDROP_CHOICE':
      return { ...state, backdropChoice: action.payload };
    case 'SET_SELECTED_ADD_ONS':
      return { ...state, selectedAddOns: action.payload };
    case 'SET_SUBTOTAL':
      return { ...state, subtotal: action.payload };
    case 'RESET':
      return initialState;
    default:
      // Exhaustiveness check — TypeScript will error here if a case is missing
      action satisfies never;
      return state;
  }
}


// ── Context ───────────────────────────────────────────────────

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextValue | null>(null);


const SESSION_KEY = 'memoriq-booking';

function loadInitialState(): BookingState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BookingState;
      // Basic sanity: make sure it has the shape we expect
      if (typeof parsed === 'object' && parsed !== null) return { ...initialState, ...parsed };
    }
  } catch {
    // Corrupt or unavailable — fall through to initialState
  }
  return initialState;
}


// ── Provider ──────────────────────────────────────────────────

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, undefined, loadInitialState);

  // Persist to sessionStorage on every state change (SSR-safe)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage unavailable — silent fail
    }
  }, [state]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}


// ── Hook ──────────────────────────────────────────────────────

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (ctx === null) {
    throw new Error(
      'useBooking() must be called inside a <BookingProvider>. ' +
      'Make sure the component is rendered within app/book/layout.tsx.'
    );
  }
  return ctx;
}
