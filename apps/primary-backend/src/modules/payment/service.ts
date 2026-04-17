import { prisma } from "db";

const ONRAMP_AMOUNT = 400;

export abstract class PaymentService {
  static async onRamp(userId: number): Promise<number> {
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: ONRAMP_AMOUNT,
          },
        },
      }),
      prisma.onRampTransaction.create({
        data: {
          userId,
          amount: ONRAMP_AMOUNT,
          status: "SUCCESS",
        },
      }),
    ]);
    return user.credits;
  }
}
