import { IFixedLengthQueue } from '../interfaces'
import { FixedLengthQueue } from './fixedLengthQueue'

const MAX_QUEUE_LENGTH = 10

let queue: IFixedLengthQueue<number>
beforeEach(() => {
  queue = new FixedLengthQueue(MAX_QUEUE_LENGTH)
})

test('should return empty array if no elements inserted yet', () => {
  const returnedElements = queue.getRecent()

  expect(returnedElements.length).toBe(0)
})

test('should return the most recently inserted element by default', () => {
  queue.insert(1)
  queue.insert(2)

  const returnedElements = queue.getRecent()

  expect(returnedElements.length).toBe(1)
  expect(returnedElements[0]).toBe(2)
})

test('should return the correct length', () => {
  queue.insert(1)
  queue.insert(2)
  queue.insert(3)

  expect(queue.length()).toBe(3)
})

test('should return maximum the number of elements inserted, and no more', () => {
  queue.insert(1)
  queue.insert(2)

  const returnedElements = queue.getRecent(5)

  expect(returnedElements.length).toBe(2)
})

test('should return the elements in the correct order', () => {
  queue.insert(1)
  queue.insert(2)
  queue.insert(3)

  const returnedElements = queue.getRecent(5)

  expect(returnedElements[0]).toBe(3)
  expect(returnedElements[1]).toBe(2)
  expect(returnedElements[2]).toBe(1)
})

test('should store the correct number of elements at maximum, with correct first and last elements', () => {
  for (let i = 0; i < 12; ++i) {
    queue.insert(i)
  }

  const elements = queue.getRecent(MAX_QUEUE_LENGTH)

  expect(queue.length()).toBe(MAX_QUEUE_LENGTH)
  expect(elements[0]).toBe(11)
  expect(elements[9]).toBe(2)
})

