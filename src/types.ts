import { Request } from "express";
import {UserDBType} from "./db/user-db-type";

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export interface RequestAuthModel extends Request {
    user?: UserDBType | null
}