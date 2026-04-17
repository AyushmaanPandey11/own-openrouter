import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";
import { authMiddleware } from "../authMiddleware";

export const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "7d",
    }),
  )
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
    async ({ jwt, body, set }) => {
      const { password, username } = body;
      const { isCorrect, message, userId } = await AuthService.SignIn({
        username,
        password,
      });

      if (!isCorrect) {
        set.status = 400;
        return {
          message,
        } as any;
      } else {
        const token = await jwt.sign({
          id: userId,
        });
        return {
          token,
          message,
        };
      }
    },
    {
      body: AuthModel.signInSchema,
      response: {
        200: AuthModel.signInResponseSchema,
        400: AuthModel.signInInvalid,
      },
    },
  )
  .resolve(authMiddleware)
  .get(
    "/profile",
    async ({ userId, set }) => {
      const userData = await AuthService.getUserDetails(Number(userId));
      if (!userData) {
        set.status = 400;
        return {
          message: "Error while fetching user details",
        };
      }
      return {
        credits: userData.credits,
      };
    },
    {
      response: {
        200: AuthModel.profileResponseSchema,
        400: AuthModel.profileFailedResponseSchema,
      },
    },
  );
