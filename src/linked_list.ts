/* 10. Generic Linked List (Expert)

Implement a generic LinkedList<T> class with methods:
- append(value: T)
- prepend(value: T)
- find(value: T): ListNode<T> | null
- remove(value: T): boolean
- Iteration support (for...of).
*/

function testListExpect<T>(test: T, expect: T, desc: string) {
    if (test === expect) {
        console.log("Pass: " + desc)
    } else {
        console.log("Fail:  " + desc)
    }
}

function testListExpectNull<T>(test: T | undefined, desc: string) {
    if (test === undefined) {
        console.log("Pass: " + desc)
    } else {
        console.log("Fail:  " + desc)
    }
}

interface ListNode<T> {
    value: T,
    next: ListNode<T> | undefined,
}

class LinkedList<T> {
    start: ListNode<T> | undefined = undefined
    last: ListNode<T> | undefined = undefined
    count: number = 0
    current: ListNode<T> | undefined = undefined

    append(value: T) {
        const newNode: ListNode<T> = { value, next: undefined }
        if (!this.start) {
            this.start = newNode
            this.last = newNode
        } else {
            this.last!.next = newNode
            this.last = newNode
        }
        this.count++
    }
    prepend(value: T) {
        const newNode: ListNode<T> = { value, next: undefined }
        if (!this.start) {
            this.start = newNode
            this.last = newNode
        } else {
            // set old start next
            newNode.next = this.start
            this.start = newNode
        }
        this.count++
    }
    find(value: T): ListNode<T> | undefined {
        let node = this.start
        while (node) {
            if (node.value === value) {
                return node
            }
            node = node.next
        }   
        return undefined
    }
    remove(value: T): boolean {
        // would love to just call list.find and then remove it, but need to keep track of previous
        let node = this.start
        let previous: ListNode<T> | undefined = undefined
        while (node) {
            if (node.value === value) {
                // found it
                if (previous) {
                    previous.next = node.next
                } else {
                    // removing start
                    this.start = node.next
                }   
                if (node === this.last) {
                    this.last = previous
                }
                this.count--
                return true
            }
            previous = node
            node = node.next
        }
        return false
    }
    next(): ListNode<T> | undefined {
        if (!this.current) {
            this.current = this.start
        } else {
            this.current = this.current.next
        }
        if (this.current) {
            return this.current
        }
        return undefined
    }
    reset(): void {
        this.current = undefined
    }
    size(): number {
        return this.count
    }
}

let list = new LinkedList<number>()
list.append(1)
list.append(2)
list.append(3)
list.prepend(0)

for (let run = 0; run < 2; run++) {
    let i = 0
    for (let node = list.next(); node; node = list.next()) {
        testListExpect(node.value, i, "walk node i=" + i.toString() + ", run: " + run.toString() )
        i++
    }
    list.reset()
}
testListExpect(list.size(), 4, "validate the list size")
testListExpect(list.find(2)?.value, 2, "Find a value")
testListExpect(list.remove(1), true, "Confirm removing a value")
testListExpect(list.size(), 3, "validate the list size after remove")
testListExpectNull(list.find(1), "Try to find a value that doesn't exist")
testListExpect(list.remove(5), false, "Try to remove a value that doesn't exist")
