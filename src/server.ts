import express from 'express'
import http from 'http'
import { AddressInfo } from 'net'

export class FeeEstimatorServer {
	private app: express.Application
	private port: number
	private server?: http.Server

	constructor(port: number) {
		this.app = express()
		this.setupRoutes()
		this.port = port
	}

	private setupRoutes() {
		this.app.get('/', (req: express.Request, res: express.Response) => {
			res.send(`Welcome to the app. Available endpoints:\n
							 `)
		})

		this.app.get('/feeEstimate', (req: express.Request, res: express.Response) => {

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
