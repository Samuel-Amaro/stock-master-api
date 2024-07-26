import jwt from '@elysiajs/jwt'
import Elysia from 'elysia'

export const jwtPlugin = new Elysia()
	.use(
		jwt({
			name: 'jwt',
			secret: import.meta.env.JWT_SECRET_KEY!,
			exp: '1 day'
		})
	)
	.decorate('jwt', jwt)
