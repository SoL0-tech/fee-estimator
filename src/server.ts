import http from 'http'
import { AddressInfo } from 'net'
import {
	IExpressApplication,
	IFeeEstimator,
	IFeeEstimatorServer,
} from './interfaces'

/**
 * Server for exposing the Estimator estimates to REST clients
 */
export class FeeEstimatorServer implements IFeeEstimatorServer {
	private app: IExpressApplication
	private port: number
	private server?: http.Server
	private estimator: IFeeEstimator

	constructor(
		port: number,
		app: IExpressApplication,
		estimator: IFeeEstimator,
	) {
		this.app = app
		this.setupRoutes()
		this.port = port
		this.estimator = estimator
	}

	/**
	 * Sets up the routes for our server
	 */
	private setupRoutes(): void {
		this.app.get('/', (req, res) => {
			res.send(`Welcome to the app. Available endpoints:\n
GET /fee-estimate  (responds with the average gas fee over the past 1, 5 and 30 blocks) `)
		})

		this.app.get('/fee-estimate', (req, res) => {
			let avg1 = 0, avg5 = 0, avg30 = 0
			try {
				avg1 = this.estimator.getEstimate()
				avg5 = this.estimator.getEstimate(5)
				avg30 = this.estimator.getEstimate(30)
			} catch (e) {
			} finally {
				res.json({
					gasFeeEstimate: avg1,
					...(avg5 ? { gasFeeEstimateAvg5: avg5 } : {}),
					...(avg30 ? { gasFeeEstimateAvg30: avg30 } : {}),
				})
			}
		})
	}

	/**
	 * Starts listening for incoming connections
	 */
	public listen(): void {
		this.server = this.app.listen(
			this.port,
			() => {
				const host = ((this.server as http.Server).address() as AddressInfo).address
				console.log('Server listening at http://%s:%s', host, this.port)
			}
		)
	}

	/**
	 * @returns true if the server is listening, false otherwise
	 */
	public isListening(): boolean {
		return !!this.server
	}
}

