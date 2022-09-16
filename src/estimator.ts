import Web3 from 'web3'
import { Subscription } from 'web3-core-subscriptions'
import { BlockHeader } from 'web3-eth'

export class FeeEstimator {
	private web3: Web3
	private latestFeeEstimate: number = -1
	private subscription?: Subscription<BlockHeader>

	constructor(web3: Web3) {
		this.web3 = web3
		this.updateFeeEstimate()
		this.startSubscription()
	}

	/**
	 * @returns current fee estimate (in wei)
	 */
	public getEstimate(): number {
		return this.latestFeeEstimate
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

		console.log(`Updated fee estimate - ${(avgGas/(10**9)).toFixed(2)} GWei`)
		this.latestFeeEstimate = avgGas
	}
}
