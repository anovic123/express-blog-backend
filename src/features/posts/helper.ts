import {query} from "express-validator";
import {SortDirection} from "mongodb";

export const helper = (query: { [key: string]: string | undefined }) => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : undefined,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? +query.sortBy : 'createdAt',
        sortDirection: query.sortDirection !== undefined ? +query.sortDirection as SortDirection : 'desc',
        searchNameTerm: query.searchNameTerm ? +query.searchNameTerm : undefined,
    }
}