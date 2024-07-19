import Elysia from 'elysia'
import { supplierDto } from '../models/suppliers.model'
import { SupplierService } from '../services/suppliers.service'
import { Role } from '../types'
import { ServiceUtils } from '../services/utils.service'

export const supplierRoutes = new Elysia()
	.use(supplierDto)
	.post(
		'/supplier',
		async ({ body, error, set, request }) => {
			const supplier = await SupplierService.findByUniqueFields(
				body.email,
				body.cnpj,
				body.phone
			)

			if (supplier) {
				return error('Conflict', `Fornecedor inválido`)
			}

			const result = await SupplierService.create(body)

			set.status = 'OK'
			set.headers['location'] = `${request.url}/${result.insertedId}`

			return `Fornecedor: ${body.name} registrado com sucesso!`
		},
		{
			body: 'register.supplier',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.get(
		'/supplier/:id',
		async ({ params: { id }, error }) => {
			const result = await SupplierService.findById(id)

			if (!result) {
				return error('Not Found', 'Fornecedor não encontrado')
			}

			return result
		},
		{
			params: 'params.supplier'
		}
	)
	.get(
		'/supplier',
		async ({ query }) => {
			return await SupplierService.getAll(query.page, query.pageSize, query.order)
		},
		{
			query: 'query.supplier'
		}
	)
	.put(
		'/supplier/:id',
		async ({ body, params: { id }, error }) => {
			const valuesToUpdate = ServiceUtils.partialBody<
				{
					email: string
					name: string
					cnpj: string
					phone: string
					address: string
					city: string
					state: string
					cep: string
				},
				typeof body
			>(body)

			if (!ServiceUtils.hasKeys(valuesToUpdate)) {
				return error('Bad Request', 'Request com body inválido')
			}

			const supplier = await SupplierService.findById(id)

			if (!supplier) {
				return error('Not Found', 'Fornecedor não encontrado')
			}

			const result = await SupplierService.update(valuesToUpdate, id)

			return new Response(`Fornecedor com id: ${result.updatedId} atualizado com sucesso!`, {
				status: 200
			})
		},
		{
			body: 'update.supplier',
			params: 'params.supplier',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.delete(
		'/supplier/:id',
		async ({ params: { id }, error }) => {
			const supplier = await SupplierService.findById(id)

			if (!supplier) {
				return error('Not Found', 'Fornecedor não encontrado')
			}

			const result = await SupplierService.delete(id)

			return `Fornecedor com id: ${result.deletedId} excluido com sucesso!`
		},
		{
			params: 'params.supplier',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
