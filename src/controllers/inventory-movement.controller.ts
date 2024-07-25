import Elysia from 'elysia'
import { inventoryMovementDto } from '../models/inventory-movement.model'
import { InventoryMovementService } from '../services/inventory-movement.service'
import { MovementType, Role, SearchFilterDate, TokenPayload } from '../types'
import { ProductService } from '../services/product.service'
import { jwtPlugin } from '../setup'

export const inventoryMovementRoutes = new Elysia()
	.use(inventoryMovementDto)
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
		'/inventory',
		async ({ body, set, request, error, getCurrentUser }) => {
			const product = await ProductService.findById(body.idProduct)

			if (!product) {
				return error('Not Found', 'Produto não encontrado')
			}

			if (body.type === MovementType.exit) {
				const qtdProductMovemExit =
					await InventoryMovementService.findByMovementFromProduct(
						product.id,
						MovementType.exit
					)
				const qtdProductMovemEntry =
					await InventoryMovementService.findByMovementFromProduct(
						product.id,
						MovementType.entry
					)

				if (qtdProductMovemExit.qtdProductMov && qtdProductMovemEntry.qtdProductMov) {
					if (
						parseInt(qtdProductMovemExit.qtdProductMov) >
						parseInt(qtdProductMovemEntry.qtdProductMov)
					) {
						return error(
							'Conflict',
							'Alerta! Não e permitido deixar o estoque do produto negativo, so serão permitida movimentações de saida com até no maximo a quantidade armazenada no estoque'
						)
					}
				} else {
					return error(
						'Internal Server Error',
						'Ocorreu um erro no servidor tente novamente'
					)
				}
			}

			const payload = await getCurrentUser()
			const result = await InventoryMovementService.create({
				...body,
				idUser: parseInt(payload.sub)
			})

			set.status = 'OK'
			set.headers['location'] = `${request.url}/${result.insertedId}`
		},
		{
			body: 'inventory.body',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.get(
		'/inventory/:id',
		async ({ params: { id }, error }) => {
			const result = await InventoryMovementService.findById(id)

			if (!result) {
				return error('Not Found', 'Movimentação estoque não encontrada')
			}

			return result
		},
		{
			params: 'inventory.params.id'
		}
	)
	.get(
		'/inventory',
		async ({ query }) => {
			return await InventoryMovementService.getAll(query.page, query.pageSize, query.order)
		},
		{
			query: 'inventory.query'
		}
	)
	.get(
		'/inventory/product/:id/count/movement/:mov',
		async ({ params: { id, mov }, error }) => {
			const product = await ProductService.findById(id)

			if (!product) {
				error('Not Found', 'Produto não encontrado')
			}

			return await InventoryMovementService.findByMovementFromProduct(id, mov)
		},
		{
			params: 'inventory.params'
		}
	)
	.get(
		'/inventory/product/all/count/movement/:mov',
		async ({ params: { mov } }) => {
			return await InventoryMovementService.findByMovementFromAllProduct(mov)
		},
		{
			params: 'inventory.params.mov'
		}
	)
	.get(
		'/inventory/product/all/count/stock',
		async ({ query, error }) => {
			switch (query.search_filter) {
				case SearchFilterDate.year:
					if (query.value && !/\d{4}/.test(query.value)) {
						return error(422, 'informe o ano no seguinte formato: YYYY')
					}
					break
				case SearchFilterDate.day:
					if (query.value && !/(0[1-9]|[12][0-9]|3[01])/.test(query.value)) {
						return error(422, 'informe o dia no seguinte formato: DD')
					}
					break
				case SearchFilterDate.month:
					if (query.value && !/(0[1-9]|1[0-2])/.test(query.value)) {
						return error(422, 'informe o mês no seguinte formato: MM')
					}
					break
				case SearchFilterDate.full:
					if (
						query.value &&
						!/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/.test(query.value)
					) {
						return error(422, 'informe a data completa no seguinte formato: YYYY-MM-DD')
					}
					break
				default:
					break
			}

			return (await InventoryMovementService.getInventory(query.search_filter, query.value))
				.rows
		},
		{
			query: 'inventory.query.filter'
		}
	)
