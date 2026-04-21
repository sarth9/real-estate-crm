import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";

interface CreateLeadInput {
  fullName: string;
  phone: string;
  email?: string;
  source?: "WEBSITE" | "ADS" | "CALL" | "REFERRAL" | "MANUAL";
  budgetMin?: number;
  budgetMax?: number;
  preferences?: string;
  notes?: string;
  assignedAgentId?: string;
  followUpAt?: string;
}

interface UpdateLeadInput {
  fullName?: string;
  phone?: string;
  email?: string;
  source?: "WEBSITE" | "ADS" | "CALL" | "REFERRAL" | "MANUAL";
  budgetMin?: number;
  budgetMax?: number;
  preferences?: string;
  notes?: string;
  assignedAgentId?: string;
  followUpAt?: string;
}

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";

export const createLead = async (
  payload: CreateLeadInput,
  createdById: string
) => {
  if (payload.assignedAgentId) {
    const agent = await prisma.user.findUnique({
      where: { id: payload.assignedAgentId },
    });

    if (!agent) {
      throw new ApiError(404, "Assigned agent not found");
    }
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email || null,
      source: payload.source ?? "MANUAL",
      budgetMin: payload.budgetMin,
      budgetMax: payload.budgetMax,
      preferences: payload.preferences,
      notes: payload.notes,
      assignedAgentId: payload.assignedAgentId,
      followUpAt: payload.followUpAt ? new Date(payload.followUpAt) : null,
      createdById,
    },
    include: {
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (payload.followUpAt) {
    await prisma.reminder.create({
      data: {
        title: `Follow up with ${lead.fullName}`,
        description: `Lead follow-up reminder for ${lead.fullName}`,
        dueAt: new Date(payload.followUpAt),
        leadId: lead.id,
        assignedToId: payload.assignedAgentId ?? createdById,
      },
    });
  }

  return lead;
};

export const getAllLeads = async () => {
  return prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reminders: true,
    },
  });
};

export const getLeadById = async (leadId: string) => {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reminders: true,
      interactions: true,
      client: true,
    },
  });

  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return lead;
};

export const updateLead = async (leadId: string, payload: UpdateLeadInput) => {
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new ApiError(404, "Lead not found");
  }

  if (payload.assignedAgentId) {
    const agent = await prisma.user.findUnique({
      where: { id: payload.assignedAgentId },
    });

    if (!agent) {
      throw new ApiError(404, "Assigned agent not found");
    }
  }

  return prisma.lead.update({
    where: { id: leadId },
    data: {
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.email !== undefined && { email: payload.email || null }),
      ...(payload.source !== undefined && { source: payload.source }),
      ...(payload.budgetMin !== undefined && { budgetMin: payload.budgetMin }),
      ...(payload.budgetMax !== undefined && { budgetMax: payload.budgetMax }),
      ...(payload.preferences !== undefined && {
        preferences: payload.preferences,
      }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
      ...(payload.assignedAgentId !== undefined && {
        assignedAgentId: payload.assignedAgentId,
      }),
      ...(payload.followUpAt !== undefined && {
        followUpAt: payload.followUpAt ? new Date(payload.followUpAt) : null,
      }),
    },
    include: {
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reminders: true,
    },
  });
};

export const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new ApiError(404, "Lead not found");
  }

  return prisma.lead.update({
    where: { id: leadId },
    data: { status },
    include: {
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const assignLeadToAgent = async (
  leadId: string,
  assignedAgentId: string
) => {
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new ApiError(404, "Lead not found");
  }

  const agent = await prisma.user.findUnique({
    where: { id: assignedAgentId },
  });

  if (!agent) {
    throw new ApiError(404, "Agent not found");
  }

  return prisma.lead.update({
    where: { id: leadId },
    data: { assignedAgentId },
    include: {
      assignedAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deleteLead = async (leadId: string) => {
  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new ApiError(404, "Lead not found");
  }

  await prisma.lead.delete({
    where: { id: leadId },
  });

  return { message: "Lead deleted successfully" };
};