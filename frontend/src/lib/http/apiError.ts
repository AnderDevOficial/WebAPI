export interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  traceId?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly problem: ProblemDetails

  constructor(status: number, problem: ProblemDetails) {
    super(problem.detail ?? problem.title ?? 'Ocurrió un error inesperado.')
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }

  get fieldErrors(): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, messages] of Object.entries(this.problem.errors ?? {})) {
      const field = key.charAt(0).toLowerCase() + key.slice(1)
      if (messages.length > 0) result[field] = messages[0]
    }
    return result
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof TypeError) return 'No fue posible conectar con el servidor.'
  return 'Ocurrió un error inesperado.'
}
