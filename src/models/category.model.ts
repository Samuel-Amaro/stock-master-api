import Elysia, { t } from 'elysia'
import { Order } from '../types'

export const CategoryDto = new Elysia().model({
	'register.category': t.Object({
		name: t.String({
			minLength: 1,
			format: 'regex',
			pattern: `^(?!\\s*$).+`,
			default: 'nome de uma categoria',
			error: 'o campo nome não pode ser vazio'
		}),
		description: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'description de uma categoria',
				error: 'o campo description não pode ser vazio'
			})
		)
	}),
	'params.category': t.Object({
		id: t.Numeric({ minimum: 1 })
	}),
	'query.category': t.Partial(
		t.Object({
			order: t.Optional(t.Enum(Order, { default: Order.asc })),
			page: t.Optional(t.Numeric({ minimum: 1 })),
			pageSize: t.Optional(t.Numeric({ minimum: 1 }))
		})
	),
	'update.category': t.Object({
		name: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'nome de uma categoria',
				error: 'o campo nome não pode ser vazio'
			})
		),
		description: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'description de uma categoria',
				error: 'o campo description não pode ser vazio'
			})
		)
	})
})
