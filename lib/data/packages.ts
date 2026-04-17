// ============================================================
// Shared package data — used by the homepage Pricing section
// AND the booking flow Step 02 package selection page.
// ============================================================

import type { PackageId } from '@/types/booking';

export interface HomepagePackage {
  id: PackageId;
  index: string;
  slug: string;
  label: string;
  price: string;
  meta: string;
  features: string[];
  cta: string;
  elevated: boolean;
  badge: string | null;
}

export const PACKAGES: HomepagePackage[] = [
  {
    id: 'essential',
    index: '01',
    slug: 'essential',
    label: 'Essential',
    price: '$400',
    meta: '2 hours · starts here',
    features: [
      'DSLR booth + studio lighting',
      'Standard backdrop',
      'Unlimited prints + digital',
      'Dedicated attendant',
      'Setup + teardown',
    ],
    cta: 'Select essential →',
    elevated: false,
    badge: null,
  },
  {
    id: 'signature',
    index: '02',
    slug: 'signature',
    label: 'Signature',
    price: '$550',
    meta: '3 hours · the one most people want',
    features: [
      'Everything in Essential',
      'Custom template design',
      'Premium backdrop library',
      'Digital gallery post-event',
      'GIF + boomerang mode',
    ],
    cta: 'Select signature →',
    elevated: true,
    badge: 'Most booked',
  },
  {
    id: 'full_takeover',
    index: '03',
    slug: 'full-takeover',
    label: 'Full Takeover',
    price: '$700',
    meta: '4 hours · no limits',
    features: [
      'Everything in Signature',
      'Premium prop collection',
      'Guest book with prints',
      'Priority weekend slots',
      'Second photographer option',
    ],
    cta: 'Select full takeover →',
    elevated: false,
    badge: null,
  },
];
