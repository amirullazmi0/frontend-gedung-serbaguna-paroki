export interface GlobalApiResponse<T> {
  status?: Number
  success: Boolean
  message: string
  data?: T
  errors?: any
}

export interface ErrorData {
  message?: string
  statusCode?: number
}
