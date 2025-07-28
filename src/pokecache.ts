export type CacheEntry<T> = {
  createdAt: number;
  val: T;
};

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  constructor(interval: number = 10000) {
    this.#interval = interval;
    this.#startReapLoop();
  }

  /**
   * Adds a value to the cache with the current timestamp.
   * @param key - The key under which to store the value.
   * @param val - The value to store in the cache.
   */
  add<T>(key: string, val: T): void {
    this.#cache.set(key, { createdAt: Date.now(), val });
  }

  /**
   * Checks if a value exists in the cache.
   * @param key - The key to check in the cache.
   * @returns true if the value exists, false otherwise.
   */
  get<T>(key: string): T | undefined {
    const entry = this.#cache.get(key);
    return entry?.val as T | undefined;
  }

  #reap() {
    const now = Date.now();
    for (const [key, entry] of this.#cache.entries()) {
      if (now - this.#interval > entry.createdAt) {
        this.#cache.delete(key);
        console.log(`Reaped expired cache entry for: ${key}`);
      }
    }
  }

  #startReapLoop() {
    if (this.#reapIntervalId) return;
    this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
  }

  stopReapLoop() {
    if (this.#reapIntervalId) {
      clearInterval(this.#reapIntervalId);
      this.#reapIntervalId = undefined;
    }
  }
}
