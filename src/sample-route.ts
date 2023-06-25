import router from '../server/router'

router.get('/hello', (req, res) => {
	res.end('Hello World')
})

router.get('/hello/{name}', (req, res) => {
	res.end(`Hello World${req.pathParams.name}`)
})

router.get('/hello/{name}/sobre/{sobre}', (req, res) => {
	res.end(`Meu nome é ${req.pathParams.name} sobre ${req.pathParams.sobre}`)
})


export { router as sampleRouter }

