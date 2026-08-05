import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { apiKey } from "./modules/apiKeys";
import { model } from "./modules/models";

export const app = new Elysia().use(auth).use(apiKey).use(model);

export type AppTypes = typeof app;
