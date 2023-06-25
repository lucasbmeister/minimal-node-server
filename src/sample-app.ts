import { MinimalServer } from '../server/minimal-server'
import { sampleRouter } from './sample-route'

const server = MinimalServer.config(3000)

server.use(sampleRouter)

server.start()
