import Elysia, { t } from 'elysia'

export const AuthDTO = new Elysia().model({
	auth: t.Object({
		name: t.String({
			minLength: 1,
			format: 'regex',
			pattern: `^(?!\\s*$).+`,
			default: 'Name user',
			error: 'o campo nome não pode ser vazio'
		}),
		password: t.String({
			minLength: 8,
			format: 'regex',
			pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])\\S{8,15}$`,
			default: 'Name user',
			error: 'A senha deve ter entre 8 a 15 caracteres, Pelo menos uma letra maiúscula, Pelo menos uma letra minúscula, Pelo menos um número, Pelo menos um caractere especial (@, $, !, %, *, ?, &)'
		}),
		email: t.String({
			format: 'email'
		})
	}),
	'auth.cookie': t.Cookie({
    value: t.Optional(t.String())
	})
})
