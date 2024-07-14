import Elysia from 'elysia'
import { UserService } from '../services/user.service'
import { UserDTO } from '../models/user.model'
import { PartialUser, Role, TokenPayload } from '../types'
import { jwtPlugin } from '../setup'
import { ServiceUtils } from '../services/utils.service'

export const userRoutes = new Elysia()
	.use(UserDTO)
	.use(jwtPlugin)
	.derive(({ set, cookie: { auth }, jwt }) => {
		return {
			getCurrentUser: async () => {
				const payload = await jwt.verify(auth.value as unknown as string)

				if (!payload) {
					set.status = 401
					throw new Error('Unauthorized')
				}

				return payload as TokenPayload
			}
		}
	})
	.post(
		'/user',
		async ({ body, set, error, request, getCurrentUser }) => {
			const userExistsByEmail = await UserService.findByEmail(body.email)
			const userExistsByName = await UserService.findByName(body.name)

			if (userExistsByEmail) {
				return error('Conflict', `Email inválido`)
			}

			if (userExistsByName) {
				return error('Conflict', `Nome inválido`)
			}

			const payload = await getCurrentUser()

			const result = await UserService.create({
				...body,
				password: await Bun.password.hash(body.password),
				idAdmin: parseInt(payload.sub)
			})

			set.status = 'Created'
			set.headers['location'] = `${request.url}/${result[0].insertedId}`
		},
		{
			async beforeHandle({ headers, error }) {
				const role = headers.role as string
        console.log(role)

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			},
			body: 'register'
		}
	)
	.get(
		'/user/all',
		async ({ query, getCurrentUser }) => {
			const payload = await getCurrentUser()

			return await UserService.findAllByIdAdmin(
				query.page,
				query.pageSize,
				query.order,
				parseInt(payload.sub)
			)
		},
		{
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			},
			query: 'queryPagination'
		}
	)
	.get(
		'/user',
		async ({ error, getCurrentUser }) => {
			const payload = await getCurrentUser()

			const user = await UserService.findById(parseInt(payload.sub))

			if (!user) {
				return error('Not Found', 'Id inválido')
			}

			return user
		},
		{
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.put(
		'/user',
		async ({ body, error, cookie, cookie: { auth }, getCurrentUser }) => {
			const payload = await getCurrentUser()

			const valuesToUpdate = ServiceUtils.partialBody<PartialUser, typeof body>(body)

			if (!ServiceUtils.hasKeys(valuesToUpdate)) {
				return error('Bad Request', 'Solicitação com body inválido')
			}

			const user = await UserService.findById(parseInt(payload.sub))

			if (!user) {
				return error('Not Found', 'Usuário invalido')
			}

			const result = await UserService.update(
				{
					...valuesToUpdate,
					password: valuesToUpdate.password
						? await Bun.password.hash(valuesToUpdate.password)
						: undefined
				},
				parseInt(payload.sub)
			)

			if (valuesToUpdate.email || valuesToUpdate.password) {
				auth.remove()
				delete cookie.auth
				return new Response(
					`Ao atualizar email ou senha, e necessario fazer autenticação novamente.`,
					{ status: 401 }
				)
			}

			return new Response(`Usuário com id: ${result.updatedId} atualizado com sucesso!`, {
				status: 200
			})
		},
		{
			body: 'update',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.delete(
		'/user',
		async ({ getCurrentUser, error, cookie, cookie: { auth } }) => {
			const payload = await getCurrentUser()

			const user = await UserService.findById(parseInt(payload.sub))

			if (!user) {
				return error('Not Found', 'Id inválido')
			}

			const result = await UserService.delete(user.id)

			auth.remove()
			delete cookie.auth

			return new Response(`Usuário com id: ${result.deletedId} excluido com sucesso!`, {
				status: 200
			})
		},
		{
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.delete(
		'/user/batch-delete',
		async ({ body }) => {
			const usersExists = await Promise.all(
				body.usersIds.map((userId) => {
					return UserService.findById(userId)
				})
			)

			console.log(usersExists)

			const deletedUserIds = await Promise.all(
				usersExists.map((user) => {
					if (user) return UserService.delete(user.id)
					return undefined
				})
			)

			const filteredUsersNotDeleted = deletedUserIds.filter((user) => {
				if (user) return true
				return false
			})

			return {
				message: 'usuários deletados com sucesso',
				deletedUserIds: filteredUsersNotDeleted
			}
		},
		{
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			},
			body: 'delete.batch'
		}
	)
