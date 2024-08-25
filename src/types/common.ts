import { Request } from "express";

import {UserAccountDBType} from "../features/auth/domain/auth.entity";

import { HttpStatusType } from "../utils";

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
export type RequestWithQueryAndParams<T, B> = Request<B, {}, {}, T>

export interface RequestAuthModel extends Request {
    user?: UserAccountDBType | null
}

export type RequestAuthModelWithParamsAndBody<T, B> = RequestAuthModel & RequestWithParamsAndBody<T, B>;
export type RequestAuthModelWithParams<T> = RequestAuthModel & RequestWithParams<T>
export type RequestAuthModelWithBody<T> = RequestAuthModel & RequestWithBody<T>

export type RequestResult<T> = {
    statusCode: HttpStatusType,
    data: T
}