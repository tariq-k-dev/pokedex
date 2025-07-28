export class PokeAPI {
  private static readonly baseURL = 'https://pokeapi.co/api/v2';

  async fetchLocations(pageURL?: string | null): Promise<ShallowLocations> {
    const url = pageURL || `${PokeAPI.baseURL}/location-area`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location/${locationName}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }
      return await response.json();
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
