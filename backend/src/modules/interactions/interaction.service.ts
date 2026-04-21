import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";

type InteractionType = "CALL" | "SMS" | "EMAIL" | "VISIT" | "NOTE";

interface CreateInteractionInput {
  clientId?: string;
  leadId?: string;
  type: InteractionType;
  summary: string;
  happenedAt?: string;
}

export const createInteraction = async (
  payload: CreateInteractionInput,
  agentId: string
) => {
  if (!payload.clientId && !payload.leadId) {
    throw new ApiError(400, "Either clientId or leadId is required");
  }

  if (payload.clientId) {
    const client = await prisma.client.findUnique({
      where: { id: payload.clientId },
    });

    if (!client) {
      throw new ApiError(404, "Client not found");
    }
  }

  if (payload.leadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: payload.leadId },
    });

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }
  }

  return prisma.interaction.create({
    data: {
      clientId: payload.clientId,
      leadId: payload.leadId,
      type: payload.type,
      summary: payload.summary,
      happenedAt: payload.happenedAt ? new Date(payload.happenedAt) : new Date(),
      agentId,
    },
    include: {
      client: true,
      lead: true,
      agent: {
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

export const getAllInteractions = async () => {
  return prisma.interaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: true,
      lead: true,
      agent: {
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