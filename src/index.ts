import { config } from 'dotenv'
import Web3 from 'web3'
import express from 'express'

import { FeeEstimator } from './estimator'
import { FeeEstimatorServer } from './server'

// Load config values from .env file
config()

// Ensure the required config is set
ensureConfigValue('INFURA_WS_ENDPOINT')

// Initialize the web3 provider and client
const INFURA_WS_ENDPOINT = process.env.INFURA_WS_ENDPOINT as string
const web3 = new Web3(INFURA_WS_ENDPOINT)

// Initialize our Fee Estimator controller
const estimator = new FeeEstimator(web3)

// Initialize our Server and listen for connections
const server = new FeeEstimatorServer(3030, express(), estimator)
server.listen()


function ensureConfigValue(key: string) {
	if (!process.env[key]) {
		throw new Error(`Config value ${key} not set`)
	}
}

