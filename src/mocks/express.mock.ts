import { Express } from 'express'

export const mockGet = jest.fn((path: string, callback: Function) => {})
export const mockListen = jest.fn((port: number, callback: Function) => {
  return "TestServer" as any 
})

export const mockExpress = () => ({
	reset: () => {
		mockGet.mockClear()
		mockListen.mockClear()
	},
	get: mockGet,
	listen: mockListen,
}) as any as Express & { reset: Function }

