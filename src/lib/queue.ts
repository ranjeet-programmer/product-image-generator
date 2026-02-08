export class RequestQueue {
  private queue: { task: () => Promise<void>; resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];
  private activeCount = 0;
  private concurrency: number;

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency;
  }

  /**
   * Add a task to the queue.
   * @param task A function that returns a promise (the operation to perform)
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task: async () => {
          try {
            const result = await task();
            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        resolve,
        reject,
      });
      this.process();
    });
  }

  private async process() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount++;

    try {
      await item.task();
    } finally {
      this.activeCount--;
      this.process(); // Trigger next item
    }
  }

  get pending() {
    return this.queue.length;
  }
}

// Global instance with concurrency 1 to prevent overloading the AI API
// HuggingFace Free tier can be sensitive to parallel requests
export const generationQueue = new RequestQueue(1);
