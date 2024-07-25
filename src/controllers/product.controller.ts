import Elysia from 'elysia'
import { productDto } from '../models/product.model'
import { MovementType, Role, TokenPayload } from '../types'
import { ProductService } from '../services/product.service'
import { CategoryService } from '../services/category.service'
import { SupplierService } from '../services/suppliers.service'
import { ServiceUtils } from '../services/utils.service'
import { jwtPlugin } from '../setup'
import { InventoryMovementService } from '../services/inventory-movement.service'

export const productRoutes = new Elysia()
	.use(productDto)
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
		'/product',
		async ({ body, error, set, request, getCurrentUser }) => {
			const product = await ProductService.findByName(body.name)

			if (product) {
				return error('Conflict', `Produto inválido`)
			}

			const category = await CategoryService.findById(body.idCategory)

			if (!category) {
				return error('Not Found', `Categoria inválida`)
			}

			const supplier = await SupplierService.findById(body.idSuppliers)

			if (!supplier) {
				return error('Not Found', `Fornecedor inválido`)
			}

			const payload = await getCurrentUser()
			const resultInsertProduct = await ProductService.create(body)
			await InventoryMovementService.create({
				idProduct: resultInsertProduct.insertedId,
				idUser: parseInt(payload.sub),
				quantity: body.quantity,
				type: MovementType.entry,
				description: `Movimentação: ${MovementType.entry} de ${body.quantity} unidade${body.quantity > 1 ? 's' : ''} de ${body.name}`
			})

			set.status = 'OK'
			set.headers['location'] = `${request.url}/${resultInsertProduct.insertedId}`

			return `Produto: ${body.name} registrado com sucesso!`
		},
		{
			body: 'product.register',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.get(
		'/product',
		async ({ query }) => {
			return await ProductService.getAll(query.page, query.pageSize, query.order)
		},
		{
			query: 'query.product'
		}
	)
	.get(
		'/product/:id',
		async ({ params: { id }, error }) => {
			const result = await ProductService.findById(id)

			if (!result) {
				return error('Not Found', 'Produto não encontrado')
			}

			return result
		},
		{
			params: 'product.params'
		}
	)
	.get(
		'/product/supplier/:id',
		async ({ params: { id }, error, query }) => {
			const supplier = await SupplierService.findById(id)

			if (!supplier) {
				return error('Not Found', 'Fornecedor não encontrado')
			}

			const result = await ProductService.findByIdAll(
				'idSupplier',
				id,
				query.page,
				query.pageSize,
				query.order
			)

			if (!result) {
				return error(
					'Not Found',
					`Produto não encontrado devido o fornecedor ser invalido com id: ${id}`
				)
			}

			return result
		},
		{
			params: 'product.params',
			query: 'query.product'
		}
	)
	.get(
		'/product/category/:id',
		async ({ params: { id }, error, query }) => {
			const category = await CategoryService.findById(id)

			if (!category) {
				return error('Not Found', 'Categoria não encontrada')
			}

			const result = await ProductService.findByIdAll(
				'idCategory',
				id,
				query.page,
				query.pageSize,
				query.order
			)

			if (!result) {
				return error(
					'Not Found',
					`Produto não encontrado devido a categoria ser invalido com id: ${id}`
				)
			}

			return result
		},
		{
			params: 'product.params',
			query: 'query.product'
		}
	)
	.put(
		'/product/:id',
		async ({ params: { id }, error, body }) => {
			const valuesToUpdate = ServiceUtils.partialBody<
				{
					name: string
					description: string
					price: string
					idCategory: number
					idSuppliers: number
				},
				typeof body
			>(body)

			if (!ServiceUtils.hasKeys(valuesToUpdate)) {
				return error('Bad Request', 'Request com body inválido')
			}

			const product = await ProductService.findById(id)

			if (!product) {
				return error('Not Found', 'Produto não encontrado')
			}

			const result = await ProductService.update(valuesToUpdate, id)

			return new Response(`Produto com id: ${result.updatedId} atualizado com sucesso!`, {
				status: 200
			})
		},
		{
			params: 'product.params',
			body: 'product.update',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
	.put(
		'/product/batch',
		async ({ body, error }) => {
			if (body.products.length === 0) {
				return error('Bad Request', 'Request com body inválido')
			}

			const productsFound = await Promise.all(
				body.products.map((prod) => {
					return ProductService.findById(prod.id)
				})
			)

			const filteredProductsFound = productsFound
				.filter((prod) => {
					if (prod) return true
					return false
				})
				.map((p) => {
					return p?.id
				})

			const updatedProductIds = await Promise.all(
				body.products.map((prod) => {
					const valuesToUpdate = ServiceUtils.partialBody<
						{
							name: string
							description: string
							price: string
							idCategory: number
							idSuppliers: number
						},
						typeof prod
					>(prod)

					if (filteredProductsFound.includes(prod.id) && ServiceUtils.hasKeys(prod)) {
						return ProductService.update(valuesToUpdate, prod.id)
					}
				})
			)

			return {
				message: 'produtos atualizados com sucesso',
				updatedProductIds: updatedProductIds
					.filter((prod) => {
						return prod ? true : false
					})
					.map((prod) => {
						return prod?.updatedId
					})
			}
		},
		{
			body: 'product.update.batch',
			async beforeHandle({ headers, error }) {
				const role = headers.role as string

				if (role !== Role.admin) {
					return error('Forbidden', 'Você não tem permissão para acessar este enpoint')
				}
			}
		}
	)
