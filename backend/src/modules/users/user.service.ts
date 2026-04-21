import { prisma } from "../../prisma/client";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      assignedLeads: {
        select: {
          id: true,
        },
      },
      deals: {
        select: {
          id: true,
          stage: true,
          dealValue: true,
          commissionAmount: true,
        },
      },
    },
  });
};