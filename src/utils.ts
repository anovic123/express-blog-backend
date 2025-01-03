export const HTTP_STATUSES = {
    OKK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    UNAUTHORIZED_401: 401,
    FORBIDDEN: 403,
    TOO_MANY_REQUEST_429: 429,
    INTERNAL_SERVER_ERROR_500: 500
}

export type HttpStatusKeys = keyof typeof HTTP_STATUSES
export type HttpStatusType = (typeof HTTP_STATUSES)[HttpStatusKeys]
