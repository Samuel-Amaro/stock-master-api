import Elysia, { t } from 'elysia'
import { Order } from '../types'

export const supplierDto = new Elysia().model({
	'register.supplier': t.Object({
		name: t.String({
			minLength: 1,
			format: 'regex',
			pattern: `^(?!\\s*$).+`,
			default: 'informe o nome de um fornecedor',
			error: 'o campo nome do fornecedor não pode ser vazio'
		}),
		email: t.String({
			format: 'email'
		}),
		cnpj: t.String({
			minLength: 1,
			maxLength: 18,
			format: 'regex',
			pattern: `^\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}$`,
			default: 'informe o cnpj de um fornecedor no seguinte formato 00.000.000/0000-00',
			error: 'o campo cnpj do fornecedor precisa estar no seguinte formato 00.000.000/0000-00'
		}),
		phone: t.String({
			minLength: 1,
			maxLength: 15,
			format: 'regex',
			pattern: `^\\(\\d{2}\\) 9\\d{4}-\\d{4}$`,
			default: 'telefone do fornecedor precisa estar no seguinte formato (00) 90000-0000',
			error: 'o campo telefone do fornecedor precisa estar no seguinte formato (00) 90000-0000'
		}),
		address: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe o endereço de um fornecedor',
				error: 'o campo endereço do fornecedor não pode ser vazio'
			})
		),
		city: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a cidade',
				error: 'o campo cidade não pode ser vazio'
			})
		),
		state: t.Optional(
			t.String({
				minLength: 1,
				maxLength: 2,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a sigla do estado com somente dois caracteres FF',
				error: 'informe a sigla do estado com somente dois caracteres FF'
			})
		),
		cep: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^\\d{5}-\\d{3}$`,
				default: 'informe o cep no seguinte formato 12345-123',
				error: 'informe o cep no seguinte formato 12345-123'
			})
		)
	}),
	'params.supplier': t.Object({
		id: t.Numeric({
			minimum: 1
		})
	}),
	'query.supplier': t.Partial(
		t.Object({
			order: t.Optional(t.Enum(Order, { default: Order.asc })),
			page: t.Optional(t.Numeric({ minimum: 1 })),
			pageSize: t.Optional(t.Numeric({ minimum: 1 }))
		})
	),
	'update.supplier': t.Object({
		name: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe o nome de um fornecedor',
				error: 'o campo nome do fornecedor não pode ser vazio'
			})
		),
		email: t.Optional(
			t.String({
				format: 'email'
			})
		),
		cnpj: t.Optional(
			t.String({
				minLength: 1,
				maxLength: 18,
				format: 'regex',
				pattern: `^\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}$`,
				default: 'informe o cnpj de um fornecedor no seguinte formato 00.000.000/0000-00',
				error: 'o campo cnpj do fornecedor precisa estar no seguinte formato 00.000.000/0000-00'
			})
		),
		phone: t.Optional(
			t.String({
				minLength: 1,
				maxLength: 15,
				format: 'regex',
				pattern: `^\\(\\d{2}\\) 9\\d{4}-\\d{4}$`,
				default: 'telefone do fornecedor precisa estar no seguinte formato (00) 90000-0000',
				error: 'o campo telefone do fornecedor precisa estar no seguinte formato (00) 90000-0000'
			})
		),
		address: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe o endereço de um fornecedor',
				error: 'o campo endereço do fornecedor não pode ser vazio'
			})
		),
		city: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a cidade',
				error: 'o campo cidade não pode ser vazio'
			})
		),
		state: t.Optional(
			t.String({
				minLength: 1,
				maxLength: 2,
				format: 'regex',
				pattern: `^(?!\\s*$).+`,
				default: 'informe a sigla do estado com somente dois caracteres FF',
				error: 'informe a sigla do estado com somente dois caracteres FF'
			})
		),
		cep: t.Optional(
			t.String({
				minLength: 1,
				format: 'regex',
				pattern: `^\\d{5}-\\d{3}$`,
				default: 'informe o cep no seguinte formato 12345-123',
				error: 'informe o cep no seguinte formato 12345-123'
			})
		)
	})
})
