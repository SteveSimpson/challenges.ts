/*
6. Retry with Backoff (Intermediate → Advanced)

Write an async function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> that retries a failing async function with exponential backoff.
*/

async function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
    let attempt = 0;
    while (attempt <= retries) {
        try {
            return await fn();
        }
        catch (error) {
            if (attempt === retries) {
                throw error;
            }
            const backoffDelay = delay * Math.pow(2, attempt);
            await wait(backoffDelay);
            attempt++;
        }
    }
    throw new Error('Unreachable code');    
}

async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}   

// Example usage:

let count = 0;

async function unstableTask() {
    count++;
    if (count < 5) {
        console.log(`Attempt ${count}: Failing`);
        throw new Error('Failed attempt');
    }
    console.log(`Attempt ${count}: Succeeding`);
    return 'Success';
}

// this call will fail (it will run in || with next call, but faster)
retry(unstableTask, 2, 250)
    .then(result => console.log('Result:', result))
    .catch(error => console.error('Final Error:', error));

// this call will succeed
retry(unstableTask, 5, 1000)
    .then(result => console.log('Result:', result))
    .catch(error => console.error('Final Error:', error));


