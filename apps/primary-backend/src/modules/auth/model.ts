import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  signInSchema: t.Object({
    username: t.String(),
    password: t.String(),
  }),

  signInResponseSchema: t.Object({
    id: t.Number(),
    token: t.String(),
  }),

  signInInvalid: t.Literal("Invalid username or password"),

  signUpSchema: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),

  signUpResponseSchema: t.Object({
    id: t.Number(),
  }),

  signUpInValid: t.Literal("Invalid credentials"),
} as const;

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
