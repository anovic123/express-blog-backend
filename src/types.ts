import { Request } from "express";

import {UserDBType} from "./db/user-db-type";

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
export type RequestWithQueryAndParams<T, B> = Request<B, {}, {}, T>

export interface RequestAuthModel extends Request {
    user?: UserDBType | null
}

export type RequestAuthModelWithParamsAndBody<T, B> = RequestAuthModel & RequestWithParamsAndBody<T, B>;
export type RequestAuthModelWithParams<T> = RequestAuthModel & RequestWithParams<T>
export type RequestAuthModelWithBody<T> = RequestAuthModel & RequestWithBody<T>