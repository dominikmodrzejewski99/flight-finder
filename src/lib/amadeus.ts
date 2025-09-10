import axios, { AxiosInstance, AxiosError } from 'axios';

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY as string;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET as string;
const AMADEUS_ENV = (process.env.AMADEUS_ENV || 'test') as 'test' | 'production';
const AMADEUS_BASE_URL_ENV = process.env.AMADEUS_BASE_URL as string | undefined;


function normalizeBaseUrl(url: string): string {
  let u = url.trim();
  if (!u.startsWith('http')) {
    u = `https://${u}`;
  }
  if (u.endsWith('/')) {
    u = u.slice(0, -1);
  }
  return u;
}

const BASE_URL = AMADEUS_BASE_URL_ENV
  ? normalizeBaseUrl(AMADEUS_BASE_URL_ENV)
  : normalizeBaseUrl(AMADEUS_ENV === 'production' ? 'api.amadeus.com/v1' : 'test.api.amadeus.com/v1');


let cachedAccessToken: string | null = null;
let cachedTokenExpiryEpochMs: number | null = null;

function isTokenValid(): boolean {
  if (!cachedAccessToken || !cachedTokenExpiryEpochMs) return false;
  const now = Date.now();
  return now < cachedTokenExpiryEpochMs - 60_000;
}

async function fetchAccessToken(): Promise<string> {

  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    throw new Error('Missing Amadeus credentials');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', AMADEUS_API_KEY);
  params.append('client_secret', AMADEUS_API_SECRET);

  const { data } = await axios.post(
    `${BASE_URL}/security/oauth2/token`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const { access_token, expires_in } = data as { access_token: string; expires_in: number };
  cachedAccessToken = access_token;
  cachedTokenExpiryEpochMs = Date.now() + expires_in * 1000;
  return access_token;
}

async function getAccessToken(): Promise<string> {
  if (isTokenValid()) return cachedAccessToken as string;
  return fetchAccessToken();
}

async function createAuthorizedClient(): Promise<AxiosInstance> {
  const token = await getAccessToken();
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.amadeus+json',
    },
    timeout: 15_000,
  });
}

export type CheapestDateQuery = {
  origin: string;
  destination: string;
  departureDate?: string;
  oneWay?: boolean;
  duration?: string;
  nonStop?: boolean;
  maxPrice?: number;
  viewBy?: 'DATE' | 'DURATION' | 'WEEK';
};

export async function fetchCheapestFlightDates(query: CheapestDateQuery) {
  const params: Record<string, string> = {
    origin: query.origin,
    destination: query.destination,
  };
  if (query.departureDate) params.departureDate = query.departureDate;
  if (typeof query.oneWay === 'boolean') params.oneWay = String(query.oneWay);
  if (query.duration) params.duration = query.duration;
  if (typeof query.nonStop === 'boolean') params.nonStop = String(query.nonStop);
  if (typeof query.maxPrice === 'number') params.maxPrice = String(Math.max(0, Math.floor(query.maxPrice)));
  if (query.viewBy) params.viewBy = query.viewBy;

  let client = await createAuthorizedClient();
  try {
    const { data } = await client.get('/shopping/flight-dates', { params });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    if (status === 401) {
      cachedAccessToken = null;
      cachedTokenExpiryEpochMs = null;
      client = await createAuthorizedClient();
      const { data } = await client.get('/shopping/flight-dates', { params });
      return data;
    }
    throw e;
  }
}
