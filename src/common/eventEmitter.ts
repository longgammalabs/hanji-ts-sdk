/**
 * PublicEventEmitter is an interface that defines the contract for an event emitter.
 * It allows adding, removing, and removing all event listeners.
 *
 * @template T - A tuple type representing the arguments for the event listeners.
 */
export interface PublicEventEmitter<T extends readonly unknown[]> {
  /**
   * Adds a listener to the event emitter.
   *
   * @param listener - The function to be called when the event is emitted.
   * @returns The instance of the event emitter.
   */
  addListener(listener: (...args: T) => void): this;

  /**
   * Removes a specific listener from the event emitter.
   *
   * @param listener - The function to be removed.
   * @returns The instance of the event emitter.
   */
  removeListener(listener: (...args: T) => void): this;

  /**
   * Removes all listeners from the event emitter.
   *
   * @returns The instance of the event emitter.
   */
  removeAllListeners(): this;
}

export class EventEmitter<T extends readonly unknown[]> implements PublicEventEmitter<T> {
  private listeners: Set<(...args: T) => void> = new Set();

  addListener(listener: (...args: T) => void) {
    this.listeners.add(listener);
    return this;
  }

  removeListener(listener: (...args: T) => void) {
    if (this.listeners.has(listener))
      this.listeners.delete(listener);
    return this;
  }

  removeAllListeners() {
    this.listeners = new Set();
    return this;
  }

  emit(...args: T) {
    if (!this.listeners.size)
      return;

    if (this.listeners.size === 1) {
      try {
        this.listeners.values().next().value(...args);
      }
      catch (error) {
        console.error(error);
      }
    }
    else {
      // We copy listeners to prevent an unbounded loop if there is the adding of a new event handler inside the handler;
      [...this.listeners].forEach(listener => {
        try {
          listener(...args);
        }
        catch (error) {
          console.error(error);
        }
      });
    }
  }
}

export type ToEventEmitter<T> = T extends PublicEventEmitter<infer TArgs> ? EventEmitter<TArgs> : never;
export type ToEventEmitters<T> = T extends Record<infer K, PublicEventEmitter<infer TArgs>> ? Record<K, EventEmitter<TArgs>> : never;
