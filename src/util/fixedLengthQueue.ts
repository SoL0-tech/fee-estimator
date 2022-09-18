import { IFixedLengthQueue } from '../interfaces'

/**
 * A queue that has a max length.
 * First in, first dropped
 */
export class FixedLengthQueue<T> implements IFixedLengthQueue<T> {
  private maxLength: number
  private elements: T[] = []

  constructor (maxLength: number) {
    this.maxLength = maxLength
  }

	/**
	 * Inserts the given element at the beginning of the
	 * array and discards elements older than maxLength
	 */
  insert(e: T): void {
    const endIndex = Math.min(this.maxLength-1, this.elements.length)

    this.elements = [
      e,
      ...this.elements.slice(0, endIndex)
    ]
  }

  /**
   * @returns an array of the most recently inserted n elements
   * Returned array is of shorter length if n > numElements
   */
  getRecent(n: number = 1): T[] {
    const endIndex = Math.min(n, this.elements.length)

    return this.elements.slice(0, endIndex)
  }

  /**
   * Returns the number of elements stored
   */
  length(): number {
    return this.elements.length
  }
}
