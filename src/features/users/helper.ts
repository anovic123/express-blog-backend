import { SortDirection } from "mongodb";

export const getUsersHelper = (query: { [ key: string ]: string | undefined }) => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection !== undefined ? query.sortDirection as SortDirection : 'desc',
        searchLoginTerm: query.searchLoginTerm !== undefined ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm !== undefined ? query.searchEmailTerm : null
    }
}