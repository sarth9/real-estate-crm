import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";

type ClientType = "BUYER" | "SELLER" | "INVESTOR" | "TENANT";

interface CreateClientInput {
  fullName: string;
  phone?: string;
  email?: string;
  clientType: ClientType;
  preferences?: string;
  notes?: string;
  linkedLeadId?: string;
}

interface UpdateClientInput {
  fullName?: string;
  phone?: string;
  email?: string;
  clientType?: ClientType;
  preferences?: string;
  notes?: string;
  linkedLeadId?: string;
}

export const createClient = async (payload: CreateClientInput) => {
  if (payload.linkedLeadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: payload.linkedLeadId },
    });

    if (!lead) {
      throw new ApiError(404, "Linked lead not found");
    }

    const existingClientForLead = await prisma.client.findUnique({
      where: { linkedLeadId: payload.linkedLeadId },
    });

    if (existingClientForLead) {
      throw new ApiError(409, "This lead is already linked to another client");
    }
  }

  return prisma.client.create({
    data: {
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email || null,
      clientType: payload.clientType,
      preferences: payload.preferences,
      notes: payload.notes,
      linkedLeadId: payload.linkedLeadId,
    },
    include: {
      linkedLead: true,
      interactions: true,
      deals: true,
      reminders: true,
    },
  });
};

export const getAllClients = async () => {
  return prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      linkedLead: true,
      interactions: true,
      deals: true,
      reminders: true,
    },
  });
};

export const getClientById = async (clientId: string) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      linkedLead: true,
      interactions: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      deals: true,
      documents: true,
      reminders: true,
    },
  });

  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  return client;
};

export const updateClient = async (
  clientId: string,
  payload: UpdateClientInput
) => {
  const existingClient = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!existingClient) {
    throw new ApiError(404, "Client not found");
  }

  if (payload.linkedLeadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: payload.linkedLeadId },
    });

    if (!lead) {
      throw new ApiError(404, "Linked lead not found");
    }

    const existingClientForLead = await prisma.client.findFirst({
      where: {
        linkedLeadId: payload.linkedLeadId,
        NOT: {
          id: clientId,
        },
      },
    });

    if (existingClientForLead) {
      throw new ApiError(409, "This lead is already linked to another client");
    }
  }

  return prisma.client.update({
    where: { id: clientId },
    data: {
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.email !== undefined && { email: payload.email || null }),
      ...(payload.clientType !== undefined && { clientType: payload.clientType }),
      ...(payload.preferences !== undefined && {
        preferences: payload.preferences,
      }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
      ...(payload.linkedLeadId !== undefined && {
        linkedLeadId: payload.linkedLeadId,
      }),
    },
    include: {
      linkedLead: true,
      interactions: true,
      deals: true,
      reminders: true,
    },
  });
};

export const deleteClient = async (clientId: string) => {
  const existingClient = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!existingClient) {
    throw new ApiError(404, "Client not found");
  }

  await prisma.client.delete({
    where: { id: clientId },
  });

  return {
    message: "Client deleted successfully",
  };
};