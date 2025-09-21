
import cache from "./cache"

// OK this is horrible, but it works for testing...
function sleep(ms: number) {
    const date = Date.now();
    var curDate = 0;
    do { curDate = Date.now(); }
    while(curDate - date < ms);
}

let stringCache = new cache

stringCache.set("foo", "bar")
stringCache.set("foo2", "bar2")

console.log(stringCache.get("foo") + " expect bar")
console.log(stringCache.get("foo2") + " expect bar2")

console.log(stringCache.has("foo") + " expect true")
console.log(stringCache.has("foo2") + " expect true")

stringCache.delete("foo")

console.log(stringCache.get("foo") + " expect undefined")
console.log(stringCache.get("foo2") + " expect bar2")

console.log(stringCache.has("foo") + " expect false")
console.log(stringCache.has("foo2") + " expect true")

stringCache.set("foo3", "bar3", 100) // kepp for 1 second
console.log(stringCache.has("foo3") + " expect true")
sleep(200)
console.log(stringCache.has("foo3") + " expect false; cache timeout")

console.log(stringCache.has("foo2") + " expect true")
stringCache.clear()
console.log(stringCache.has("foo2") + " expect false")
