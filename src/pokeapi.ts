import { Cache } from './pokecache.js';

export class PokeAPI {
  private static readonly baseURL = 'https://pokeapi.co/api/v2';
  private cache: Cache;

  constructor() {
    // Cache entries will be valid for 5 minutes
    const cacheInterval = 5 * 60 * 1000;
    this.cache = new Cache(cacheInterval);
  }

  /**
   * Fetches a list of locations from the PokeAPI.
   * @param pageURL - Optional URL to fetch locations from. If not provided, defaults to the base URL.
   * @returns A promise that resolves to a ShallowLocations object.
   */
  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;

    // Check for cached data first
    const cachedData = this.cache.get<ShallowLocations>(url);
    if (cachedData) {
      console.log('Cache hit!');
      return cachedData;
    }
    console.log('Cache miss!');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }

      const data = await response.json();
      // Add the new data to the cache
      this.cache.add(url, data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific location by name from the PokeAPI.
   * @param locationName - The name of the location to fetch.
   * @returns A promise that resolves to a Location object.
   */
  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location/${locationName}`;

    // Check for cached data first
    const cachedData = this.cache.get<Location>(url);
    if (cachedData) {
      console.log('Cache hit!');
      return cachedData;
    }
    console.log('Cache miss!');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }

      const data = await response.json();
      // Add the new data to the cache
      this.cache.add(url, data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }
}

// Type generated from the PokeAPI location-area endpoint
export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

// Type generated from a specific location endpoint
export type Location = {
  id: number;
  name: string;
  areas: {
    name: string;
    url: string;
  }[];
};
