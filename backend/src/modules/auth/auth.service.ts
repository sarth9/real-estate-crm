import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";
import { signToken } from "../../utils/jwt";

type UserRole = "ADMIN" | "MANAGER" | "AGENT";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash: hashedPassword,
      phone: payload.phone,
      role: payload.role ?? "AGENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

export const loginUser = async (payload: LoginUserInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};