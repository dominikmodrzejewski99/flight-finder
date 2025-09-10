import type { AxiosError } from 'axios';
import { fetchCheapestFlightDates } from '@/lib/amadeus';

function computeDurationDays(startIso: string, endIso: string): number | null {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const ms = end.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}

export async function GET(req: Request) {
  console.log('API Route called with env check:');
  console.log('AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY ? 'Present' : 'Missing');
  console.log('AMADEUS_API_SECRET:', process.env.AMADEUS_API_SECRET ? 'Present' : 'Missing');

  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    console.log('Missing credentials, returning 503');
    return Response.json({ 
      error: 'Service unavailable', 
      debug: {
        hasApiKey: !!process.env.AMADEUS_API_KEY,
        hasApiSecret: !!process.env.AMADEUS_API_SECRET
      }
    }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);

  const rawOrigin = searchParams.get('origin') || searchParams.get('from') || '';
  const rawDestination = searchParams.get('destination') || searchParams.get('to') || '';

  const origin = rawOrigin.trim().toUpperCase();
  const destination = rawDestination.trim().toUpperCase();

  if (!origin || !destination) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const departureDateParam = searchParams.get('departureDate') || searchParams.get('departure') || undefined;
  const returnDateParam = searchParams.get('returnDate') || searchParams.get('return') || undefined;

  const oneWayParam = searchParams.get('oneWay');
  const tripType = searchParams.get('tripType');

  const oneWayFromTripType = tripType === 'one-way' ? true : tripType === 'round-trip' ? false : undefined;
  const oneWay = typeof oneWayParam === 'string' ? oneWayParam === 'true' : (oneWayFromTripType ?? (returnDateParam ? false : undefined));

  const durationParam = searchParams.get('duration') || undefined;
  let duration = durationParam;
  if (!duration && departureDateParam && returnDateParam && (oneWay === false || oneWay === undefined)) {
    const days = computeDurationDays(departureDateParam, returnDateParam);
    if (days !== null) duration = String(days);
  }

  const nonStop = searchParams.get('nonStop');
  const maxPrice = searchParams.get('maxPrice');
  const viewByQuery = searchParams.get('viewBy') as 'DATE' | 'DURATION' | 'WEEK' | null;
  const viewBy = viewByQuery ?? (oneWay === true ? 'DATE' : 'DURATION');

  try {
    const data = await fetchCheapestFlightDates({
      origin,
      destination,
      departureDate: departureDateParam,
      oneWay,
      duration,
      nonStop: typeof nonStop === 'string' ? nonStop === 'true' : undefined,
      maxPrice: typeof maxPrice === 'string' ? Number(maxPrice) : undefined,
      viewBy,
    });

    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    const status = (e as AxiosError)?.response?.status;
    if (status === 400) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }
    return Response.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
