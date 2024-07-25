import Elysia, { t } from 'elysia'
import { MovementType, Order, SearchFilterDate } from '../types'

export const inventoryMovementDto = new Elysia().model({
	'inventory.params': t.Object({
		id: t.Numeric({
			minimum: 1
		}),
		mov: t.Enum(MovementType)
	}),
	'inventory.params.id': t.Object({
		id: t.Numeric({
			minimum: 1
		})
	}),
	'inventory.params.mov': t.Object({
		mov: t.Enum(MovementType)
	}),
	'inventory.query': t.Partial(
		t.Object({
			order: t.Optional(t.Enum(Order, { default: Order.asc })),
			page: t.Optional(t.Numeric({ minimum: 1 })),
			pageSize: t.Optional(t.Numeric({ minimum: 1 }))
		})
	),
	'inventory.body': t.Object({
		idProduct: t.Numeric({
			minimum: 1
		}),
		quantity: t.Numeric({
			minimum: 1
		}),
		type: t.Enum(MovementType),
		description: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a descrição da movimentação',
				error: 'a descrição da movimentação não pode ser vazio'
			})
		)
	}),
	'inventory.query.filter': t.Partial(
		t.Object({
			search_filter: t.Optional(
				t.Enum(SearchFilterDate, {
					default: SearchFilterDate.year,
					examples:
						'informe o valor do filtro da data nos seguintes formatos: year(YYYY), month(DD), day(DD), full(YYYY-MM-DD)'
				})
			),
			value: t.Optional(
				t.String({
					minLength: 1,
					format: 'regex',
					pattern: `^(?!\\s*$).+`,
					default: new Date().getFullYear().toString(),
					examples:
						'informe o valor do filtro da data nos seguintes formatos: year(YYYY), month(DD), day(DD), full(YYYY-MM-DD)',
					error: 'o valor do filtro não pode ser vazio'
				})
			)
		})
	)
})
