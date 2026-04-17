import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { authMiddleware } from "../authMiddleware";
import { PaymentModel } from "./model";
import { PaymentService } from "./service";

export const app = new Elysia({ prefix: "payments" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .resolve(authMiddleware)
  .post(
    "/onramp",
    async ({ userId, set }) => {
      try {
        const credits = await PaymentService.onRamp(Number(userId));
        return {
          message: "OnRamp successfull",
          credits,
        };
      } catch (error) {
        set.status = 411;
        return {
          message: "onRamp failed" as const,
        };
      }
    },
    {
      response: {
        200: PaymentModel.onRampResponseSchem,
        411: PaymentModel.onRampFailedResponseSchema,
      },
    },
  );
