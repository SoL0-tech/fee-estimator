import { IWeb3 } from "interfaces"

let numGetBlockCalls: number
let subscriptionTimer: NodeJS.Timer
const INTERVAL_IN_MS = 50

const web3 = {
	/**
	 * Helper function to reset state
	 */
	reset: () => {
		numGetBlockCalls = 0
		clearInterval(subscriptionTimer)
	},
	/**
	 * Mock eth Client API
	 */
	eth: {

		/**
		 * Mock the getBlock operation, and return deterministic test data with each invocation
		 */
		getBlock: jest.fn((
			which: 'latest', includeTransactionData: boolean
		) => {
			const vals = [
				10000000000, 20000000000, 30000000000,
				40000000000, 50000000000, 60000000000,
				70000000000, 80000000000, 90000000000,
				10000000000, 20000000000, 30000000000,
				40000000000, 50000000000, 60000000000,
				70000000000, 80000000000, 90000000000,
				10000000000, 20000000000, 30000000000,
				40000000000, 50000000000, 60000000000,
				70000000000, 80000000000, 90000000000,
			  10000000000, 20000000000, 30000000000,
			]

			// Next gasPrice value to return
			const valueToReturn = vals[numGetBlockCalls % vals.length] 
			// Increment counter for the function
			numGetBlockCalls += 1

			// Return 10 test transactions with the given gasPrice
			return {
				transactions: Array.from({
					length: 10
				}, () => ({
					gasPrice: valueToReturn,
				}))
			}
		}),

		/**
		 * Mock the subscribe operation, and emit test events at regular intervals
		 */
		subscribe: jest.fn((
			_type: string, callback: (error: Error | null, log: any) => void
		) => {
			let n = 1
			subscriptionTimer = setInterval(() => {
				callback(null, constructLogObject())
				n += 1
			}, INTERVAL_IN_MS)

			function constructLogObject() {
				return {
					number: n
				}
			}
		})
	}
} as any as IWeb3 & { reset: Function }

export = web3 
