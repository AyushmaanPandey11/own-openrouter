import { prisma } from "db";
import type { AuthModel } from "./model";

export abstract class AuthService {
  static async SignIn({
    username,
    password,
  }: AuthModel["signInSchema"]): Promise<{
    isCorrect: Boolean;
    userId: string;
    message: string;
  }> {
    const response = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        password: true,
        id: true,
      },
    });

    if (response == null) {
      return {
        isCorrect: false,
        userId: "",
        message: "User doesn't exists!",
      };
    }

    if (!(await Bun.password.verify(password, response.password))) {
      return {
        isCorrect: false,
        userId: "",
        message: "Invalid credentials",
      };
    }

    return {
      isCorrect: true,
      userId: response.id.toString(),
      message: "User signed in successfully",
    };
  }

  static async SignUp({
    username,
    password,
    email,
  }: AuthModel["signUpSchema"]) {
    const response = await prisma.user.create({
      data: {
        email: email,
        password: await Bun.password.hash(password),
        username: username,
      },
    });
    return {
      id: response.id.toString(),
      message: "User created successfully",
    };
  }
}
