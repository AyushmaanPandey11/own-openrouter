import { t, UnwrapSchema } from "elysia";

export const PaymentModel = {
  onRampResponseSchem: t.Object({
    message: t.Literal("onRamp successfull"),
    credits: t.Number(),
  }),

  onRampFailedResponseSchema: t.Object({
    message: t.String(),
  }),
};

export type PaymentModel = {
  [key in keyof typeof PaymentModel]: UnwrapSchema<(typeof PaymentModel)[key]>;
};
