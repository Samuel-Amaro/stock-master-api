import swagger from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { authenticate, signOut } from './controllers/auth.controller'
import { jwtPlugin } from './setup'
import { TokenPayload } from './types'
import { userRoutes } from './controllers/user.controller'

const app = new Elysia({ prefix: '/api/v1' })
	.use(
		swagger({
			path: '/docs',
			documentation: {
				info: {
					title: 'Stock Master API Documentation',
					version: '1.0.0'
				}
			}
		})
	)
	.use(jwtPlugin)
	.use(authenticate)
	.guard(
		{
			async beforeHandle({ headers, jwt, error }) {
				const authToken = headers.authorization

				if (!authToken) {
					return error('Unauthorized', 'Não autorizado')
				}

				const [, token] = authToken.split(' ')

				try {
					const decoded = (await jwt.verify(token)) as TokenPayload
					headers.role = decoded.role

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (err: any) {
					return {
						message: err.message || 'invalid token'
					}
				}
			}
		},
		(app) => (app.use(signOut), app.use(userRoutes))
	)
	.listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
