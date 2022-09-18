import http from 'http'
import express from 'express'

// *** CLASSES ***
export interface IFeeEstimator {
  getEstimate(n?: number): number
  isReady(): boolean
}

export interface IFeeEstimatorServer {
  listen(): void
  isListening(): boolean
}

export interface IFixedLengthQueue<T> {
  getRecent(n?: number): T[]
  insert(t: T): void
  length(): number
}


// *** LIBS ***
export interface IExpressApplication {
  get(
    path: string, callback: (req: IRequest, res: IResponse) => void
  ): void,
  listen(
    port: number, callback: () => void
  ): http.Server
}
export type IRequest = express.Request
export type IResponse = express.Response

export interface IWeb3 {
  eth: {
    getBlock(
      which: string, includeTransactionData: boolean
    ): Promise<{
      transactions: Array<{ gasPrice: string }>
    }>,
    subscribe(
      type: string, callback: (error: Error | null, log: any) => void
    ): void
  }
}
