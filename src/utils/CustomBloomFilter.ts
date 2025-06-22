export class CustomBloomFilter {
  private bitArray: Uint8Array;
  private setBits: number = 0;
  private readonly M: number; // size of bit array
  private readonly K: number; // number of hash functions

  constructor(M: number, K: number) {
    this.M = M;
    this.K = K;
    this.bitArray = new Uint8Array(M); // initialize with zeros
  }

  add(email: string): void {
    if (this.getFillRatio() >= 0.75) {
      console.log("Bloom filter saturated. Resetting...");
      this.reset();
    }
    for (let i = 0; i < this.K; i++) {
      const index = this.getHash(email, i) % this.M;
      if (this.bitArray[index] === 0) {
        this.bitArray[index] = 1;
        this.setBits++; // increment only if changing from 0 → 1
      }
    }
  }

  mightContain(email: string): boolean {
    for (let i = 0; i < this.K; i++) {
      const index = this.getHash(email, i) % this.M;
      if (this.bitArray[index] === 0) return false; // definitely not present
    }
    return true; // might be present
  }

  private getHash(data: string, seed: number): number {
    // Simple hash: (hashCode + seed) % M
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = (hash * 31 + data.charCodeAt(i) + seed) >>> 0;
    }
    console.log(hash);

    return Math.abs(hash);
  }

  private getFillRatio(): number {
    return this.setBits / this.M;
  }

  private reset(): void {
    this.bitArray = new Uint8Array(this.M);
    this.setBits = 0;
  }
}
