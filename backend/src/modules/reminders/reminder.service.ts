import { prisma } from "../../prisma/client";

export const getAllReminders = async () => {
  return prisma.reminder.findMany({
    orderBy: {
      dueAt: "asc",
    },
    include: {
      lead: true,
      client: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};