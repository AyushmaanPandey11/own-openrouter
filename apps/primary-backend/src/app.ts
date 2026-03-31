import { Elysia } from "elysia";
import { auth } from "./modules/auth";
import { apiKey } from "./modules/apiKeys";

export const app = new Elysia().use(auth).use(apiKey);

export type AppTypes = typeof app;
