/**
 * TimeoutScheduler is a utility class that manages the scheduling of actions with specified timeouts.
 * It allows you to set timeouts for actions and automatically handles the expiration of these timeouts.
 *
 * @param {number[]} timeouts - An array of timeout durations in milliseconds.
 * @param {number} [counterExpirationMs] - Optional duration in milliseconds after which the counter resets.
 *
 * Usage:
 *
 * const scheduler = new TimeoutScheduler([1000, 2000, 3000], 5000);
 *
 * scheduler.setTimeout(async () => {
 *   console.log('Action executed after timeout');
 * });
 *
 * // Reset the counter manually if needed
 * scheduler.resetCounter();
 *
 * // Dispose of the scheduler and clear all timeouts
 * scheduler[Symbol.dispose]();
 */
export class TimeoutScheduler implements Disposable {
  private counterExpirationWatcherId: ReturnType<typeof setTimeout> | undefined;
  private actionWatchers = new Set<ReturnType<typeof setTimeout>>();
  private _counter = 0;

  constructor(
    private readonly timeouts: number[],
    private readonly counterExpirationMs?: number
  ) {
  }

  get counter() {
    return this._counter;
  }

  private set counter(value: number) {
    this._counter = value;
  }

  [Symbol.dispose]() {
    if (this.counterExpirationWatcherId)
      clearTimeout(this.counterExpirationWatcherId);

    this.actionWatchers.forEach(watcher => clearTimeout(watcher));
  }

  setTimeout(action: () => void | Promise<void>): Promise<void> {
    return new Promise(resolve => {
      if (this.counterExpirationMs)
        this.resetCounterExpiration();

      const timeoutIndex = Math.min(this.counter, this.timeouts.length - 1);
      const timeout = this.timeouts[timeoutIndex];

      const watcherId = setTimeout(async () => {
        this.actionWatchers.delete(watcherId);
        clearTimeout(watcherId);
        await action();
        resolve();
      }, timeout);
      this.actionWatchers.add(watcherId);

      this.counter++;
    });
  }

  resetCounter() {
    this.counter = 0;
  }

  private resetCounterExpiration() {
    if (this.counterExpirationWatcherId)
      clearTimeout(this.counterExpirationWatcherId);

    this.counterExpirationWatcherId = setTimeout(() => {
      this.resetCounter();
      this.counterExpirationWatcherId = undefined;
    }, this.counterExpirationMs);
  }
}
