class Emitter {
  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    if (!this.listeners[event])
      this.listeners[event] = new Set();
    const listeners = this.listeners[event];
    listeners.add(fn);
    return _ => listeners.delete(fn);
  }

  emit(event, value) {
    if (!this.listeners[event])
      return;
    // cloning set so that any new set entries would be ignored
    const listeners = new Set(this.listeners[event]);
    listeners.forEach(fn => fn(value));
  }

  destroy() {
    for (var event in this.listeners) {
      const listeners = this.listeners[event];
      listeners.forEach(fn => listeners.delete(fn));
    }
  }
}

export default Emitter;