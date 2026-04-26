type EventCallback = (...args: unknown[]) => void

class EventBus {
  private events: Map<string, EventCallback[]> = new Map()

  on(event: string, callback: EventCallback): () => void {
    const callbacks = this.events.get(event) || []
    callbacks.push(callback)
    this.events.set(event, callbacks)

    return () => this.off(event, callback)
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event) || []
    const index = callbacks.indexOf(callback)
    if (index > -1) {
      callbacks.splice(index, 1)
      this.events.set(event, callbacks)
    }
  }

  emit(event: string, ...args: unknown[]): void {
    const callbacks = this.events.get(event) || []
    callbacks.forEach((cb) => cb(...args))
  }
}

export const eventBus = new EventBus()
