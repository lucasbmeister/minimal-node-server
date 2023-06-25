import { IncomingMessage, ServerResponse } from 'node:http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
type HandlerFunction = (req: IncomingRequest, res: ServerResponse) => void
type Handlers = Record<HttpMethod, Record<string, HandlerFunction>>

export type IncomingRequest = {
	pathParams: Record<string, string>
} & IncomingMessage


export const PARAM_MATCHER = /\{.*?\}/g;

export class Router {

	private handlers!: Handlers


	constructor() {
		this.handlers = {} as Handlers
	}
	match(req: IncomingMessage, res: ServerResponse) {

		const segments = (req.url?.split('/') ?? []).map(segment => segment === '' ? '/' : segment)

		const method = req.method as HttpMethod
		const handlers = this.handlers[method]
		const route = this.getMatchedRoute(handlers, segments)
		const newReq = req as IncomingRequest


		if (route) {
			newReq.pathParams = route.pathParams
			handlers[route.route](newReq, res)
		} else {
			res.end('Not Found')
		}
	}

	private getMatchedRoute(handlers: Record<string, any>, segments: Array<string>): { route: string, pathParams: Record<string, string> } | undefined {

		const routes = Object.keys(handlers)
		const routesSegments = routes
			.map(route => route.split('/').map(r => r === '' ? '/' : r))

		const possible = routesSegments.filter((route) => route.length === segments.length)

		if (!possible.length) {
			return undefined
		}
		
		let found = ''
		const pathParams: Record<string, string> = {}

		let matchedSegments = 0

		for (let i = 0; i < possible.length; i++) {
			for (let j = 0; j < segments.length; j++) {
				if (possible[i][j] === segments[j]) {
					matchedSegments++
				}

				if (PARAM_MATCHER.test(possible[i][j])) {
					const param = possible[i][j].match(PARAM_MATCHER)?.[0].replace(/^\{|\}$/g, '') ?? ''
					pathParams[param] = segments[j]
					matchedSegments++
				}

				if (matchedSegments === segments.length) {
					found = possible[i].map(r => r === '/' ? '' : r).join('/')
					break
				}
			}
		}


		return found ? { route: found, pathParams } : undefined
	}

	get(path: string, handler: HandlerFunction) {
		this.addRoute('GET', path, handler)
	}

	post(path: string, handler: HandlerFunction) {
		this.addRoute('POST', path, handler)
	}
	put(path: string, handler: HandlerFunction) {
		this.addRoute('PUT', path, handler)
	}

	delete(path: string, handler: HandlerFunction) {
		this.addRoute('DELETE', path, handler)
	}

	private addRoute(method: HttpMethod, path: string, handler: HandlerFunction) {
		if (!this.handlers[method]) {
			this.handlers[method] = {}
		}
		this.handlers[method][path] = handler
	}
}

export default new Router()
