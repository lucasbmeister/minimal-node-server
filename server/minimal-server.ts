import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http'
import { Router } from './router'

export class MinimalServer {

	httpServer!: Server
	port!: number

	constructor() {
		this.routes = []
	}

	routes: Array<Router>
	use(router: Router) {
		this.routes.push(router)
	}

	match(req: IncomingMessage, res: ServerResponse) {
		this.routes.forEach(router => router.match(req, res))
	}

	start() {
		createServer(this.match.bind(this)).listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`)
		})
	}

	private setPort(port = 3000) {
		this.port = port
	}

	static config(port?: number) {
		const instance = new MinimalServer()
		instance.setPort(port)
		return instance
	}
}

