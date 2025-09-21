/*
8. Async Job Queue (Advanced)

Implement a class JobQueue that:
- Takes async jobs (() => Promise<any>).
- Runs them with a max concurrency limit.
- Resolves when all jobs are complete.
*/

type Job<T> = () => Promise<T>;

interface JobQueueType {
    jobs: Job<any>[];
    promoise: Promise<void>;
    state: number; // 0 - idle, 1 - running, 2 - finished
}


// dummy function to simulate async work
function sleep2s(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

class JobQueue {
    concurencyLimit = 3
    jobs: Job<any>[] = [];
    running = 0;

    add(job: Job<any>): Promise<void> {
        return new Promise((resolve, reject) => {
            // wrap the job to handle completion
            const wrappedJob = async () => {
                try {
                    await job();
                    resolve();
                } catch (error) {
                    reject(error);
                } finally {
                    this.running--;
                    this.runNext();
                }
            };
            this.jobs.push(wrappedJob);
            this.runNext();
        });
    }

    private runNext() {
        while (this.running < this.concurencyLimit && this.jobs.length > 0) {
            const job = this.jobs.shift();
            if (job) {
                this.running++;
                job();
            }
        }
    }

    async waitAll(): Promise<void> {
        while (this.running > 0 || this.jobs.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }       

}

// Example usage:

const jobQueue = new JobQueue();

const baseTime = Date.now();

// start at 10 so that columns align in output
for (let i = 10; i <= 30; i++) {
    jobQueue.add(async () => {
        console.log(`Starting job ${i}, time: ` + (Date.now() - baseTime) + 'ms');
        await sleep2s();
        console.log(`Finished job ${i}, time: ` + (Date.now() - baseTime) + 'ms');
    });
}

jobQueue.waitAll().then(() => {
    console.log('All jobs completed');
}); 
// Output will show that at most 3 jobs run concurrently


