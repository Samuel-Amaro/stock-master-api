export abstract class ServiceUtils {
	static partialBody<T, I extends Partial<T>>(values: I) {
		const pb: Partial<T> = values
		return pb
	}

	static hasKeys<T extends object>(o: T) {
		return Object.keys(o).length > 0 ? true : false
	}

	static calculateTotalPages(totalItems: number, itemsPorPage: number) {
		return Math.ceil(totalItems / itemsPorPage)
	}
}
