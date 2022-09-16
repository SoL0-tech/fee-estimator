import express from 'express'
import http from 'http'
import { AddressInfo } from 'net'
import { FeeEstimator } from './estimator'

export class FeeEstimatorServer {
	private app: express.Application
	private port: number
	private server?: http.Server
	private estimator: FeeEstimator

	constructor(
		port: number,
		express: () => express.Express,
		estimator: FeeEstimator,
	) {
		this.app = express()
		this.setupRoutes()
		this.port = port
		this.estimator = estimator
	}

	private setupRoutes() {
		this.app.get('/', (req: express.Request, res: express.Response) => {
			res.send(`Welcome to the app. Available endpoints:\n
							 `)
		})

		this.app.get('/fee-estimate', (req: express.Request, res: express.Response) => {
			res.json({
				gasFeeEstimate: this.estimator.getEstimate(),
			})
		})
	}

	public listen() {
		this.server = this.app.listen(
			this.port,
			() => {
				const host = ((this.server as http.Server).address() as AddressInfo).address
				console.log('Server listening at http://%s:%s', host, this.port)
			}
		)
	}

	public isListening() {
		return !!this.server
	}
}
