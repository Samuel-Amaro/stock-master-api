import Elysia from 'elysia'
import { AuthDTO } from '../models/auth.model'
import { jwtPlugin } from '../setup'
import { UserService } from '../services/user.service'

export const authenticate = new Elysia()
	.use(jwtPlugin)
	.use(AuthDTO)
	.post(
		'/authenticate',
		async ({ body, error, cookie: { auth }, jwt }) => {
			const userExists = await UserService.findByEmail(body.email)

			if (!userExists) {
				return error('Conflict', 'Credenciais inválidas')
			}

			const isPasswordValid = await Bun.password.verify(body.password, userExists.password)

			if (!isPasswordValid) {
				return error('Conflict', 'Credenciais inválidas')
			}

			auth.value = await jwt.sign({ sub: userExists.id.toString(), role: 'employee' })
			auth.maxAge = 1 * 86400
			auth.path = '/'
		},
		{ body: 'auth', cookie: 'auth.cookie' }
	)

export const signOut = new Elysia().use(AuthDTO).post(
  '/sign-out',
  async ({ cookie, cookie: { auth }, }) => {
    auth.remove();
    delete cookie.auth;
  },
  { cookie: 'auth.cookie' }
)
  