import Elysia from 'elysia'
import { CategoryDto } from '../models/category.model'
import { CategoryService } from '../services/category.service'
import { ServiceUtils } from '../services/utils.service'
import { Role } from '../types'

export const categoryRoutes = new Elysia()
	.use(CategoryDto)
	.post(
		'/category',
		async ({ body, error, set, request }) => {
			const categoryFound = await CategoryService.findByName(body.name)

			if (categoryFound) {
				return error('Conflict', `Categoria inválida`)
			}

			const result = await CategoryService.create({ ...body })

			set.status = 'OK'
			set.headers['location'] = `${request.url}/${result.insertedId}`

			return `Categoria: ${body.name} criada com sucesso!`
		},
		{
			body: 'register.category',
      async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.get(
		'/category/:id',
		async ({ params: { id }, error }) => {
			const category = await CategoryService.findById(id)

			if (!category) {
				return error('Not Found', 'Id inválido')
			}

			return category
		},
		{
			params: 'params.category'
		}
	)
	.get(
		'/category/all',
		async ({ query }) => {
			return await CategoryService.getAll(query.page, query.pageSize, query.order)
		},
		{
			query: 'query.category'
		}
	)
	.put(
		'/category/:id',
		async ({ body, params: { id }, error }) => {
			const valuesToUpdate = ServiceUtils.partialBody<
				{ name: string; description: string },
				typeof body
			>(body)

			if (!ServiceUtils.hasKeys(valuesToUpdate)) {
				return error('Bad Request', 'Request com body inválido')
			}

			const category = await CategoryService.findById(id)

			if (!category) {
				return error('Not Found', 'Categoria inválida')
			}

			const result = await CategoryService.update(valuesToUpdate, id)

			return new Response(`Categoria com id: ${result.updatedId} atualizado com sucesso!`, {
				status: 200
			})
		},
		{
			body: 'update.category',
			params: 'params.category',
      async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.delete(
		'/category/:id',
		async ({ params: { id }, error }) => {
			const category = await CategoryService.findById(id)

			if (!category) {
				return error('Not Found', 'Categoria inválida')
			}

			const result = await CategoryService.delete(id)

			return new Response(`Categoria com id: ${result.deletedId} excluido com sucesso!`, {
				status: 200
			})
		},
		{
			params: 'params.category',
      async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
