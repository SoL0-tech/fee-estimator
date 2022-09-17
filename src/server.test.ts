import { FeeEstimatorServer } from './server'
import {
  estimator,
  mockExpress as express,
  mockGet,
  mockListen,
} from './mocks'
import { IFeeEstimatorServer } from './interfaces'

const TEST_PORT = 30000

let server: IFeeEstimatorServer
beforeEach(() => {
  express.reset()
  server = new FeeEstimatorServer(TEST_PORT, express, estimator)
})


test('should return false for isListening after setup', () => {
  expect(server.isListening()).toBe(false)
})

test('should return true for isListening after calling listen', () => {
  server.listen()
  expect(server.isListening()).toBe(true)
})

test('should call app.get twice for our routes upon instantiation', () => {
  expect(mockGet.mock.calls.length).toBe(2)
})

test('should call app.listen once with port argument and a callback', () => {
  server.listen()
  expect(mockListen.mock.calls.length).toBe(1)
  expect(mockListen.mock.calls[0][0]).toBe(TEST_PORT)
})
