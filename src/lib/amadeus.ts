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
  console.log('🔑 Fetching OAuth2 token from Amadeus...');
  console.log('📍 Token URL:', `${BASE_URL}/security/oauth2/token`);
  
  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    console.error('❌ Missing Amadeus credentials');
    throw new Error('Missing Amadeus credentials');
  }

  console.log('🔐 Using API Key:', AMADEUS_API_KEY ? `${AMADEUS_API_KEY.substring(0, 8)}...` : 'MISSING');

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', AMADEUS_API_KEY);
  params.append('client_secret', AMADEUS_API_SECRET);

  try {
    console.log('🚀 Making OAuth2 request...');
    const { data } = await axios.post(
      `${BASE_URL}/security/oauth2/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, expires_in } = data as { access_token: string; expires_in: number };
    cachedAccessToken = access_token;
    cachedTokenExpiryEpochMs = Date.now() + expires_in * 1000;
    
    console.log('✅ OAuth2 token received successfully');
    console.log('⏰ Token expires in:', expires_in, 'seconds');
    
    return access_token;
  } catch (error) {
    console.error('❌ OAuth2 token request failed:', error);
    if (axios.isAxiosError(error)) {
      console.error('📊 Response status:', error.response?.status);
      console.error('📄 Response data:', error.response?.data);
    }
    throw error;
  }
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

export type FlightDestinationsQuery = {
  origin: string;
  maxPrice?: number;
  departureDate?: string;
  oneWay?: boolean;
  duration?: string;
  nonStop?: boolean;
  viewBy?: 'DURATION' | 'WEEK' | 'COUNTRY';
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
    const { data } = await client.get('/shopping/flight-destinations', { params });
    return data;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    if (status === 401) {
      cachedAccessToken = null;
      cachedTokenExpiryEpochMs = null;
      client = await createAuthorizedClient();
      const { data } = await client.get('/shopping/flight-destinations', { params });
      return data;
    }
    throw e;
  }
}

export async function fetchFlightDestinations(query: FlightDestinationsQuery) {
  console.log('✈️  Fetching flight destinations from Amadeus...');
  console.log('📍 Origin:', query.origin);
  if (query.maxPrice) console.log('💰 Max Price:', query.maxPrice, 'EUR');
  
  const params: Record<string, string> = {
    origin: query.origin,
  };
  if (typeof query.maxPrice === 'number') params.maxPrice = String(Math.max(0, Math.floor(query.maxPrice)));
  if (query.departureDate) params.departureDate = query.departureDate;
  if (typeof query.oneWay === 'boolean') params.oneWay = String(query.oneWay);
  if (query.duration) params.duration = query.duration;
  if (typeof query.nonStop === 'boolean') params.nonStop = String(query.nonStop);
  if (query.viewBy) params.viewBy = query.viewBy;

  let client = await createAuthorizedClient();
  try {
    console.log('🚀 Making flight destinations request...');
    const { data } = await client.get('/shopping/flight-destinations', { params });
    console.log('✅ Flight destinations retrieved successfully');
    console.log('📊 Found', data.data?.length || 0, 'destinations');
    return data;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    console.error('❌ Flight destinations request failed:', status, e.response?.data);
    
    if (status === 401) {
      console.log('🔄 Token expired, refreshing and retrying...');
      cachedAccessToken = null;
      cachedTokenExpiryEpochMs = null;
      client = await createAuthorizedClient();
      const { data } = await client.get('/shopping/flight-destinations', { params });
      console.log('✅ Flight destinations retrieved successfully after token refresh');
      return data;
    }
    throw e;
  }
}
