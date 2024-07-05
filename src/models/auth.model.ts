import Elysia, { t } from 'elysia'

export const AuthDTO = new Elysia().model({
	auth: t.Object({
		name: t.String({
			minLength: 1,
			maxLength: 100,
			format: 'regex',
			pattern: `^(?!\\s*$).+`,
			default: 'nome completo com quantidade máxima de até 100 caracteres',
			error: 'o campo nome não pode ser vazio'
		}),
		password: t.String({
			minLength: 8,
			maxLength: 15,
			format: 'regex',
			pattern: `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])\\S{8,15}$`,
			default:
				'A senha deve ter entre 8 a 15 caracteres, Pelo menos uma letra maiúscula, Pelo menos uma letra minúscula, Pelo menos um número, Pelo menos um caractere especial (@, $, !, %, *, ?, &)',
			error: 'A senha deve ter entre 8 a 15 caracteres, Pelo menos uma letra maiúscula, Pelo menos uma letra minúscula, Pelo menos um número, Pelo menos um caractere especial (@, $, !, %, *, ?, &)'
		}),
		email: t.String({
			format: 'email',
			default: 'informe um email ex: test@email.com'
		})
	}),
	'auth.cookie': t.Cookie({
		value: t.Optional(t.String())
	})
})
