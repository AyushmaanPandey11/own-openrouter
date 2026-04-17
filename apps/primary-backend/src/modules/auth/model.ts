import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  signInSchema: t.Object({
    username: t.String(),
    password: t.String(),
  }),

  signInResponseSchema: t.Object({
    id: t.String(),
    token: t.String(),
  }),

  signInInvalid: t.String(),

  signUpSchema: t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  }),

  signUpResponseSchema: t.Object({
    id: t.String(),
  }),

  profileResponseSchema: t.Object({
    credits: t.Number(),
  }),

  profileFailedResponseSchema: t.Object({
    message: t.Literal("Error while fetching user details"),
  }),

  signUpInValid: t.Literal("Invalid credentials"),
} as const;

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
