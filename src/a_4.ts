/*4. Type-Safe Event Emitter (Intermediate)

Create a class EventEmitter that supports:
- on(event: string, listener: (...args: any[]) => void)
- emit(event: string, ...args: any[])

Enhance it with generics so events are type-safe (e.g., "login" always passes { userId: number }).
*/

class EventEmitterA<Events extends Record<string, any[]>> {
  // map event name -> array of listeners
  private listeners = new Map<keyof Events, Array<(...args: any[]) => void>>();

  // subscribe; returns an unsubscribe function
  on<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ): () => void {
    const arr = this.listeners.get(event) ?? [];
    arr.push(listener as (...args: any[]) => void);
    this.listeners.set(event, arr);
    // unsubscribe
    return () => {
      const cur = this.listeners.get(event);
      if (!cur) return;
      const idx = cur.indexOf(listener as any);
      if (idx !== -1) cur.splice(idx, 1);
      if (cur.length === 0) this.listeners.delete(event);
    };
  }

  // emit event with typed args
  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    const cur = this.listeners.get(event);
    if (!cur) return;
    // copy to avoid issues if listeners modify registration while iterating
    for (const l of cur.slice()) {
      (l as (...a: Events[K]) => void)(...args);
    }
  }
}


interface MyEvents {
  // "login" listeners get one arg: { userId: number }
  login: [{ userId: number }];

  // "message" listeners get two args: from: string, text: string
  message: [from: string, text: string];

  // "tick" has no args
  tick: [];

  // index signature for other potential events
  [k: string]: any[];
}

const ee = new EventEmitterA<MyEvents>();

// correct typing:
const unsubscribeLogin = ee.on("login", ({ userId }) => {
  // userId is typed as number
  console.log("user logged in:", userId);
});

ee.on("message", (from, text) => {
  // from: string, text: string
  console.log(from, "says:", text);
});

ee.on("tick", () => {
  console.log("tick received");
});

// emit with correct argument types:
ee.emit("login", { userId: 123 });
ee.emit("message", "alice", "hello!");
ee.emit("tick");

// Type errors (caught at compile time):
// ee.emit("login", { userId: "nope" });           // Error: string not assignable to number
// ee.on("message", (a: number) => {});             // Error: argument types not match [string, string]
// ee.emit("message", "onlyOneArg");                // Error: wrong arg count
