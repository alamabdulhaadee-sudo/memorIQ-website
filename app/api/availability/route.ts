import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/server';

export interface AvailabilityDate {
  date: string;   // ISO date string "YYYY-MM-DD"
  status: 'booked' | 'limited';
}

export interface AvailabilityResponse {
  dates: AvailabilityDate[];
}

/**
 * GET /api/availability?year=2026&month=6
 *
 * Returns all blocked/limited dates for the given month.
 * Dates NOT returned are available by default.
 * month is 1-indexed (1 = January, 12 = December).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;

  const year  = Number(searchParams.get('year'));
  const month = Number(searchParams.get('month')); // 1-indexed

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json<AvailabilityResponse>({ dates: [] }, { status: 400 });
  }

  // Build the inclusive date range for the requested month
  const mm    = String(month).padStart(2, '0');
  const from  = `${year}-${mm}-01`;
  // Last day of month: set day=0 of the next month
  const lastDay = new Date(year, month, 0).getDate();
  const to    = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('date, status')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: true });

    if (error) {
      console.error('[availability] Supabase query error:', error.message);
      return NextResponse.json<AvailabilityResponse>({ dates: [] });
    }

    return NextResponse.json<AvailabilityResponse>({
      dates: (data ?? []) as AvailabilityDate[],
    });
  } catch (err) {
    console.error('[availability] Unexpected error:', err);
    return NextResponse.json<AvailabilityResponse>({ dates: [] });
  }
}
