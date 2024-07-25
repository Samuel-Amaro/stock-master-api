import Elysia, { t } from 'elysia'
import { Order } from '../types'

export const productDto = new Elysia().model({
	'product.register': t.Object({
		name: t.String({
			minLength: 1,
			format: 'regex',
			pattern: `^(?!\\s*$).+`,
			default: 'informe o nome do produto',
			error: 'o nome do produto não pode ser vazio'
		}),
		description: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a descrição do produto',
				error: 'a descrição do produto não pode ser vazio'
			})
		),
		price: t.String({
			minLength: 1,
			format: 'regex',
			pattern: `^\\d{1,7}(\\.\\d{1,2})?$`,
			default: 'informe o preço do produto',
			error: 'o preço do produto pode ter 1 a 7 numeros antes do (.), apos o (.) somente 2 numeros ex: 13.90 ou somente 13'
		}),
		quantity: t.Numeric({
			minimum: 1
		}),
		idCategory: t.Numeric({
			minimum: 1
		}),
		idSuppliers: t.Numeric({
			minimum: 1
		})
	}),
	'product.params': t.Object({
		id: t.Numeric({
			minimum: 1
		})
	}),
	'query.product': t.Partial(
		t.Object({
			order: t.Optional(t.Enum(Order, { default: Order.asc })),
			page: t.Optional(t.Numeric({ minimum: 1 })),
			pageSize: t.Optional(t.Numeric({ minimum: 1 }))
		})
	),
	'product.update': t.Object({
		name: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe o nome do produto',
				error: 'o nome do produto não pode ser vazio'
			})
		),
		description: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a descrição do produto',
				error: 'a descrição do produto não pode ser vazio'
			})
		),
		price: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^\\d{1,7}(\\.\\d{1,2})?$`,
				default: 'informe o preço do produto',
				error: 'o preço do produto pode ter 1 a 7 numeros antes do (.), apos o (.) somente 2 numeros ex: 13.90 ou somente 13'
			})
		),
		idCategory: t.Optional(
			t.Numeric({
				minimum: 1
			})
		),
		idSuppliers: t.Optional(
			t.Numeric({
				minimum: 1
			})
		)
	}),
	'product.update.batch': t.Object({
		products: t.Array(
			t.Object({
				name: t.Optional(
					t.String({
						minLength: 1,
						format: 'regex',
						pattern: `^(?!\\s*$).+`,
						default: 'informe o nome do produto',
						error: 'o nome do produto não pode ser vazio'
					})
				),
				description: t.Optional(
					t.String({
						minLength: 1,
						format: 'regex',
						pattern: `^(?!\\s*$).+`,
						default: 'informe a descrição do produto',
						error: 'a descrição do produto não pode ser vazio'
					})
				),
				price: t.Optional(
					t.String({
						minLength: 1,
						format: 'regex',
						pattern: `^\\d{1,7}(\\.\\d{1,2})?$`,
						default: 'informe o preço do produto',
						error: 'o preço do produto pode ter 1 a 7 numeros antes do (.), apos o (.) somente 2 numeros ex: 13.90 ou somente 13'
					})
				),
				idCategory: t.Optional(
					t.Numeric({
						minimum: 1
					})
				),
				idSuppliers: t.Optional(
					t.Numeric({
						minimum: 1
					})
				),
				id: t.Numeric({
					minimum: 1
				})
			}),
			{ minItems: 1 }
		)
	})
})
