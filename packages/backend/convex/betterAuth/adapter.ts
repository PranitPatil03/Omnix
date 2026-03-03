import { createApi } from "@convex-dev/better-auth";
import { createAuthOptions } from "./auth";
import schema from "./schema";

const api: any = createApi(schema, createAuthOptions);

export const create = api.create;
export const findOne = api.findOne;
export const findMany = api.findMany;
export const updateOne = api.updateOne;
export const updateMany = api.updateMany;
export const deleteOne = api.deleteOne;
export const deleteMany = api.deleteMany;
