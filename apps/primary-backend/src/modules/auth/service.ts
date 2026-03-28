import { prisma } from "db";
import type { AuthModel } from "./model";
import { status } from "elysia";

export abstract class AuthService {
  static async SignIn({ username, password }: AuthModel["signInSchema"]) {
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
      throw status(
        40,
        "Invalid credentials" satisfies AuthModel["signUpInValid"],
      );
    }

    if (await Bun.password.verify(password, response.password)) {
      throw status(
        400,
        "Invalid credentials" satisfies AuthModel["signUpInValid"],
      );
    }

    return {
      id: response?.id,
      token: "token123",
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
        password: password,
        username: username,
      },
    });
    return {
      id: response.id,
      message: "User created successfully",
    };
  }
}
