/*
3. Generic Cache (Intermediate)

From earlier: Implement a generic cache with set, get, has, delete, and clear. Support optional TTL (time-to-live expiration).
*/


interface cacheInterface<T> {
    key: string,
    value: T,
    expiration?: number,
}

class cache<T> {
    cachedObjects: cacheInterface<T>[] = [];

    set(key: string, value: T, expiration: number | undefined = undefined) {
        const newItem: cacheInterface<T> = {key, value}

        if (expiration) {
            const expiresAt = Date.now() + expiration
            newItem.expiration = expiresAt
        }

        // does it exists
        const found = this.cachedObjects.findIndex(item => item.key === key)
        if (found == -1) {
            // does not exist, add
            this.cachedObjects.push(newItem)
        } else {
            this.cachedObjects[found] = newItem
        }
    }

    get(key: string): T | undefined {
        const found = this.cachedObjects.findIndex(item => item.key === key)

        if (found === -1) {
            return undefined
        }

        const value = this.cachedObjects[found]?.value

        if (this.isNotExpired(found)) {
            return value
        }

        return undefined
    }

    has(key: string): boolean {
        const found = this.cachedObjects.findIndex(item => item.key === key)
        if (found == -1) {
            return false
        }
        return this.isNotExpired(found)
    }

    delete(key: string) {
        const found = this.cachedObjects.findIndex(item => item.key === key)
        if (found == -1) {
            // could throw an error, probably OK to just return... the key doesn't exist
            return
        }
        this.cachedObjects.splice(found, 1)
    }

    clear() {
        this.cachedObjects = []
    }

    isNotExpired(index: number): boolean {
        const expiration = this.cachedObjects[index]?.expiration;
        if (!expiration) {
            return true;
        }
        const now = Date.now();

        // not 100% sure how the cache expiration should be dealt with... but this seems reasonable
        if (now > expiration) {
            this.cachedObjects.splice(index, 1)
            return false
        }
        return true
    }
}

export default cache
