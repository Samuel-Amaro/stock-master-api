export type TokenPayload = {
	sub: string
	role: string
}

export enum Role {
	employee = 'employee',
	admin = 'admin'
}