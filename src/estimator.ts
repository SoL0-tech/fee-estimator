import Web3 from 'web3'
import { Subscription } from 'web3-core-subscriptions'
import { BlockHeader } from 'web3-eth'

export class FeeEstimator {
	web3: Web3
	latestFeeEstimate: number
	subscription?: Subscription<BlockHeader>

	constructor(web3: Web3) {
		this.web3 = web3
		this.startSubscription()
		this.latestFeeEstimate = 0 // TODO initialize from last block
		// web3.eth.getBlock("latest", returnTransactionObjects] [, callback])
		this.startSubscription()
	}

	private async startSubscription() {
		this.web3.eth.subscribe("newBlockHeaders", (error, log) => {
			if (error) {
				console.log('Error in subscription callback:', error)
			}
			console.log(log)
		})
	}
}
