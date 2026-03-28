import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/sign-up",
    async ({ body }) => {
      const { email, password, username } = body;
      const response = await AuthService.SignUp({ email, password, username });

      return response;
    },
    {
      body: AuthModel.signUpSchema,
      response: {
        200: AuthModel.signUpResponseSchema,
        400: AuthModel.signUpInValid,
      },
    },
  )
  .post(
    "sign-in",
    async ({ body }) => {
      const { password, username } = body;
      const response = await AuthService.SignIn({ username, password });
      return response;
    },
    {
      body: AuthModel.signInSchema,
      response: {
        200: AuthModel.signInResponseSchema,
        400: AuthModel.signInInvalid,
      },
    },
  );
