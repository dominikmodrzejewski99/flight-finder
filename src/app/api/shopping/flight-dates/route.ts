import type { AxiosError } from 'axios';
import { fetchFlightDestinations } from '@/lib/amadeus';

function computeDurationDays(startIso: string, endIso: string): number | null {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const ms = end.getTime() - start.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}

export async function GET(req: Request) {
  console.log('🛒 Shopping API Route called with env check:');
  console.log('AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY ? 'Present' : 'Missing');
  console.log('AMADEUS_API_SECRET:', process.env.AMADEUS_API_SECRET ? 'Present' : 'Missing');

  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    console.log('❌ Missing credentials, returning 503');
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
  const origin = rawOrigin.trim().toUpperCase();

  if (!origin) {
    return Response.json({ error: 'Origin is required' }, { status: 400 });
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
  const viewByQuery = searchParams.get('viewBy') as 'DURATION' | 'WEEK' | 'COUNTRY' | null;
  const viewBy = viewByQuery ?? 'DURATION';

  try {
    console.log('🛒 Calling Amadeus API with params:', {
      origin,
      departureDate: departureDateParam,
      oneWay,
      duration,
      nonStop: typeof nonStop === 'string' ? nonStop === 'true' : undefined,
      maxPrice: typeof maxPrice === 'string' ? Number(maxPrice) : undefined,
      viewBy,
    });

    const data = await fetchFlightDestinations({
      origin,
      departureDate: departureDateParam,
      oneWay,
      duration,
      nonStop: typeof nonStop === 'string' ? nonStop === 'true' : undefined,
      maxPrice: typeof maxPrice === 'string' ? Number(maxPrice) : undefined,
      viewBy,
    });

    console.log('✅ Amadeus API call successful');
    return Response.json(data, { status: 200 });
  } catch (e: unknown) {
    console.error('❌ Amadeus API call failed:', e);
    const status = (e as AxiosError)?.response?.status;
    const responseData = (e as AxiosError)?.response?.data;
    
    console.error('📊 Response status:', status);
    console.error('📄 Response data:', responseData);
    
    if (status === 400) {
      return Response.json({ 
        error: 'Invalid request', 
        details: responseData 
      }, { status: 400 });
    }
    return Response.json({ 
      error: 'Service unavailable', 
      details: responseData 
    }, { status: 502 });
  }
}
