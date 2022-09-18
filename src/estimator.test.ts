import { FeeEstimator } from './estimator'
import { IFeeEstimator } from './interfaces'
import { FixedLengthQueue } from './util'
import { web3 } from './mocks'

let estimator: IFeeEstimator
beforeEach(() => {
	estimator = new FeeEstimator(web3, new FixedLengthQueue<number>(10))
})

afterEach(() => {
	web3.reset()
})


test('should return ready after one block', async () => {
	await sleep(75)
	const ready = estimator.isReady()
	expect(ready).toBe(true)
})

test('should return correct estimate after one block', async () => {
	await sleep(75)
	const estimate = estimator.getEstimate()
	expect(estimate).toBe(20000000000)
})

test('should return correct estimate after two blocks', async () => {
	await sleep(110)
	const estimate = estimator.getEstimate()
	expect(estimate).toBe(30000000000)
})

test('should return correct estimate for avg(5) after five blocks', async () => {
	await sleep(275)
	const estimate = estimator.getEstimate(5)
	expect(estimate).toBe(40000000000)
})

test('should return correct estimate for avg(10) after ten blocks', async () => {
	await sleep(520)
	const estimate = estimator.getEstimate(5)
	expect(estimate).toBe(54000000000)
})


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
