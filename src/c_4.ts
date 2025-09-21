/*4. Type-Safe Event Emitter (Intermediate)

Create a class EventEmitter that supports:
- on(event: string, listener: (...args: any[]) => void)
- emit(event: string, ...args: any[])

Enhance it with generics so events are type-safe (e.g., "login" always passes { userId: number }).
*/

// interface LocalEventArg<T> {
//     arg: T
// }

interface LocalEvent<T> {
    name: string,
    actions: T, //LocalEventArg<T>[], // I really don't like this... will loop back to type if I have time
}

function logger(message: string) {
    console.log("logging: " + message);
}

function processMyEvent(callback: (...args: any[]) => any, args: any[]) {
    callback(args);
}

class EventEmitter {
    events: LocalEvent<any>[] = []

    on(event: string, listener: (...args: any[]) => void) {
        const found = this.events.findIndex(myevent => myevent.name ===  event);

        const newEvent: LocalEvent<typeof listener> = {
            name: event,
            actions: listener
        }

        if (found == -1) {
            // adding new event
            this.events.push(newEvent)
        } else {
            // replaciung an existing event
            this.events[found] = newEvent
        }
        console.log(this.events)
    }

    emit(event: string, ...args: any[]) {
        const found = this.events.findIndex(myevent => myevent.name ===  event);
        if (found > -1) {
            console.log("found " + found.toString())
            if (typeof this.events[found]?.actions == (typeof args)) {
                processMyEvent(this.events[found]?.actions, args)
            } else {
                console.log("type error", typeof args, typeof this.events[found]?.actions)
            }
            
        } else {
            console.log("emit not found: " + event )
        }
    }
}

const myEvents = new EventEmitter

myEvents.on("log", (message: string) => logger(message))
myEvents.on("log2", (message: string) => logger(message))
myEvents.on("log", (message: string) => logger(message))

myEvents.emit("log", "Should work")
myEvents.emit("log", "probably ", "not")
myEvents.emit("foo", "This is a test2")
myEvents.emit("log", 0)

