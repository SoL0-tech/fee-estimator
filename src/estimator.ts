import { Subscription } from 'web3-core-subscriptions'
import { BlockHeader } from 'web3-eth'
import {
	IFeeEstimator,
	IFixedLengthQueue,
	IWeb3,
} from './interfaces'

/**
 * Controller for making, keeping, and providing an up-to-date fee estimates
 */
export class FeeEstimator implements IFeeEstimator {
	private web3: IWeb3
	private estimates: IFixedLengthQueue<number>
	private subscription?: Subscription<BlockHeader>

	constructor(
    web3: IWeb3,
    estimatesQueue: IFixedLengthQueue<number>,
  ) {
		this.web3 = web3
    this.estimates = estimatesQueue
		this.updateFeeEstimate()
		this.startSubscription()
	}

	/**
	 * @returns fee estimate (in wei), using the
	 *          average of the last n blocks
	 * @throws Error if n > numberOfBlocksRead
	 */
	public getEstimate(n = 1): number {
		if (!this.isReady()) {
			throw new Error('Estimator not yet ready. Wait a bit and try again')
		}

		if (n > this.estimates.length()) {
			throw new Error(`Last ${n} blocks not available. Max ${this.estimates.length()}.`)
		}

		const total = this.estimates.getRecent(n).reduce((total, estimate) => (
			total + estimate
		), 0)

		return total / n
	}

	/**
	 * @returns true if the estimator has made its first estimate,
	 * 					false otherwise
	 */
	public isReady(): boolean {
		return this.estimates.length() > 0
	}

	/**
	 * Starts the subscription to trigger an estimate update
	 * after each new block
	 */
	private async startSubscription() {
		this.web3.eth.subscribe("newBlockHeaders", async (error, log) => {
			if (error) {
				console.error('Error in subscription callback:', error)
			}

			console.log(`Block #${log.number} published`)

			await this.updateFeeEstimate()
		})
	}

	/**
	 * Fetches transactions from the most recent block,
	 * calculates average gas fee and updates the estimate.
	 */
	private async updateFeeEstimate() {
		const blockData = await this.web3.eth.getBlock("latest", true)
		const totalGasPrice = blockData.transactions
			.reduce((total, transaction) => (
				total + parseInt(transaction.gasPrice)
			), 0)

		const avgGas = totalGasPrice / blockData.transactions.length

		this.addEstimate(avgGas)
		this.logEstimates()
	}

  /**
   * Adds the estimate to the estimates data structure
   */
	private addEstimate(estimate: number): void {
    this.estimates.insert(estimate)
	}

	/**
	 * Logs the avg(1), avg(5) and avg(30) estimates to the console
	 */
	private logEstimates(): void {
		let avg: { [key: string]: string | null } = {}
		for (let n of ['1', '5', '30']) {
			try {
				avg[n] = (this.getEstimate(parseInt(n))/(10**9)).toFixed(2)
			} catch (e) {
				avg[n] = null
			}
		}

		let logLine = `Fee estimates - ${avg['1']} GWei (last)`
    if (avg['5']) {
			logLine += `, ${avg['5']} Gwei (avg. 5)`
		}
		if (avg['30']) {
      logLine += `, ${avg['30']} Gwei (avg. 30)`
		}

		console.log(logLine)
	}
}
