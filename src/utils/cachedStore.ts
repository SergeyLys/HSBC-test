export class CachedStore<T> {
  private store = new Map<string, T>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  set(key: string, value: T, ttlMs: number) {
    this.clearTimer(key);

    this.store.set(key, value);

    const timer = setTimeout(() => {
      this.store.delete(key);
      this.timers.delete(key);
    }, ttlMs);

    this.timers.set(key, timer);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.store.clear();
  }

  private clearTimer(key: string) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }
}