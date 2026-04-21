import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";

type DealStage = "NEGOTIATION" | "AGREEMENT" | "CLOSED";

interface CreateDealInput {
  title: string;
  clientId: string;
  propertyId: string;
  agentId: string;
  stage?: DealStage;
  dealValue: number;
  commissionPercent: number;
  expectedCloseDate?: string;
  closedAt?: string;
  notes?: string;
}

interface UpdateDealInput {
  title?: string;
  clientId?: string;
  propertyId?: string;
  agentId?: string;
  stage?: DealStage;
  dealValue?: number;
  commissionPercent?: number;
  expectedCloseDate?: string;
  closedAt?: string;
  notes?: string;
}

const calculateCommission = (dealValue: number, commissionPercent: number) => {
  return (dealValue * commissionPercent) / 100;
};

const validateLinkedEntities = async (
  clientId?: string,
  propertyId?: string,
  agentId?: string
) => {
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new ApiError(404, "Client not found");
    }
  }

  if (propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, "Property not found");
    }
  }

  if (agentId) {
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      throw new ApiError(404, "Agent not found");
    }
  }
};

export const createDeal = async (payload: CreateDealInput) => {
  await validateLinkedEntities(payload.clientId, payload.propertyId, payload.agentId);

  const commissionAmount = calculateCommission(
    payload.dealValue,
    payload.commissionPercent
  );

  return prisma.deal.create({
    data: {
      title: payload.title,
      clientId: payload.clientId,
      propertyId: payload.propertyId,
      agentId: payload.agentId,
      stage: payload.stage ?? "NEGOTIATION",
      dealValue: payload.dealValue,
      commissionPercent: payload.commissionPercent,
      commissionAmount,
      expectedCloseDate: payload.expectedCloseDate
        ? new Date(payload.expectedCloseDate)
        : null,
      closedAt: payload.closedAt ? new Date(payload.closedAt) : null,
      notes: payload.notes,
    },
    include: {
      client: true,
      property: true,
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      documents: true,
    },
  });
};

export const getAllDeals = async () => {
  return prisma.deal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: true,
      property: true,
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      documents: true,
    },
  });
};

export const getDealById = async (dealId: string) => {
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      client: true,
      property: true,
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      documents: true,
    },
  });

  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  return deal;
};

export const updateDeal = async (dealId: string, payload: UpdateDealInput) => {
  const existingDeal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!existingDeal) {
    throw new ApiError(404, "Deal not found");
  }

  await validateLinkedEntities(payload.clientId, payload.propertyId, payload.agentId);

  const dealValue = payload.dealValue ?? existingDeal.dealValue;
  const commissionPercent =
    payload.commissionPercent ?? existingDeal.commissionPercent;

  const commissionAmount = calculateCommission(dealValue, commissionPercent);

  return prisma.deal.update({
    where: { id: dealId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.clientId !== undefined && { clientId: payload.clientId }),
      ...(payload.propertyId !== undefined && { propertyId: payload.propertyId }),
      ...(payload.agentId !== undefined && { agentId: payload.agentId }),
      ...(payload.stage !== undefined && { stage: payload.stage }),
      ...(payload.dealValue !== undefined && { dealValue: payload.dealValue }),
      ...(payload.commissionPercent !== undefined && {
        commissionPercent: payload.commissionPercent,
      }),
      commissionAmount,
      ...(payload.expectedCloseDate !== undefined && {
        expectedCloseDate: payload.expectedCloseDate
          ? new Date(payload.expectedCloseDate)
          : null,
      }),
      ...(payload.closedAt !== undefined && {
        closedAt: payload.closedAt ? new Date(payload.closedAt) : null,
      }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
    },
    include: {
      client: true,
      property: true,
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      documents: true,
    },
  });
};

export const updateDealStage = async (dealId: string, stage: DealStage) => {
  const existingDeal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!existingDeal) {
    throw new ApiError(404, "Deal not found");
  }

  return prisma.deal.update({
    where: { id: dealId },
    data: {
      stage,
      ...(stage === "CLOSED" && !existingDeal.closedAt
        ? { closedAt: new Date() }
        : {}),
    },
    include: {
      client: true,
      property: true,
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      documents: true,
    },
  });
};

export const deleteDeal = async (dealId: string) => {
  const existingDeal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!existingDeal) {
    throw new ApiError(404, "Deal not found");
  }

  await prisma.deal.delete({
    where: { id: dealId },
  });

  return {
    message: "Deal deleted successfully",
  };
};