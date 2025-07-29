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
   * Fetches a list of location areas from the PokeAPI.
   * @param pageURL - Optional URL to fetch location areas from. If not provided, defaults to the base URL.
   * @returns A promise that resolves to a ShallowLocations object.
   */
  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;

    const cachedData = this.cache.get<ShallowLocations>(url);
    if (cachedData) {
      // console.log('Cache hit!');
      return cachedData;
    }
    // console.log('Cache miss!');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }

      const data = await response.json();
      this.cache.add(url, data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific location area by name from the PokeAPI.
   * @param locationAreaName - The name of the location area to fetch.
   * @returns A promise that resolves to a LocationArea object, or null if not found.
   */
  async fetchLocationArea(
    locationAreaName: string
  ): Promise<LocationArea | null> {
    const url = `${PokeAPI.baseURL}/location-area/${locationAreaName}`;

    // Check for cached data first
    const cachedData = this.cache.get<LocationArea>(url);
    if (cachedData) {
      // console.log('Cache hit!');
      return cachedData;
    }
    // console.log('Cache miss!');

    try {
      const response = await fetch(url);
      if (response.status === 404) {
        return null; // Not found
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }

      const data: LocationArea = await response.json();
      // Add the new data to the cache
      this.cache.add(url, data);
      return data;
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }
}

// Type generated from the PokeAPI location-area list endpoint
export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

// Type generated from a specific location-area endpoint (e.g. /location-area/pastoria-city-area)
export type LocationArea = {
  id: number;
  name: string;
  pokemon_encounters: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
};
