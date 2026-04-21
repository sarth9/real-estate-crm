import { prisma } from "../../prisma/client";

export const getDashboardReport = async () => {
  const [
    totalLeads,
    totalClients,
    totalProperties,
    totalDeals,
    closedDeals,
    totalRevenueData,
    totalCommissionData,
    leadStatusCounts,
    dealStageCounts,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.client.count(),
    prisma.property.count(),
    prisma.deal.count(),
    prisma.deal.count({
      where: {
        stage: "CLOSED",
      },
    }),
    prisma.deal.aggregate({
      _sum: {
        dealValue: true,
      },
    }),
    prisma.deal.aggregate({
      _sum: {
        commissionAmount: true,
      },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.deal.groupBy({
      by: ["stage"],
      _count: {
        stage: true,
      },
    }),
  ]);

  const leadConversionRate =
    totalLeads > 0 ? Number(((closedDeals / totalLeads) * 100).toFixed(2)) : 0;

  return {
    summary: {
      totalLeads,
      totalClients,
      totalProperties,
      totalDeals,
      closedDeals,
      totalRevenue: totalRevenueData._sum.dealValue ?? 0,
      totalCommission: totalCommissionData._sum.commissionAmount ?? 0,
      leadConversionRate,
    },
    leadStatusBreakdown: leadStatusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    dealStageBreakdown: dealStageCounts.map((item) => ({
      stage: item.stage,
      count: item._count.stage,
    })),
  };
};

export const getLeadReport = async () => {
  const [totalLeads, leadStatusCounts] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
  ]);

  return {
    totalLeads,
    breakdown: leadStatusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
      percentage:
        totalLeads > 0
          ? Number(((item._count.status / totalLeads) * 100).toFixed(2))
          : 0,
    })),
  };
};

export const getSalesReport = async () => {
  const [totalDeals, closedDeals, revenueData, commissionData, stageBreakdown] =
    await Promise.all([
      prisma.deal.count(),
      prisma.deal.count({
        where: {
          stage: "CLOSED",
        },
      }),
      prisma.deal.aggregate({
        _sum: {
          dealValue: true,
        },
      }),
      prisma.deal.aggregate({
        _sum: {
          commissionAmount: true,
        },
      }),
      prisma.deal.groupBy({
        by: ["stage"],
        _count: {
          stage: true,
        },
      }),
    ]);

  return {
    totalDeals,
    closedDeals,
    totalRevenue: revenueData._sum.dealValue ?? 0,
    totalCommission: commissionData._sum.commissionAmount ?? 0,
    stageBreakdown: stageBreakdown.map((item) => ({
      stage: item.stage,
      count: item._count.stage,
    })),
  };
};

export const getAgentPerformanceReport = async () => {
  const agents = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      assignedLeads: {
        select: {
          id: true,
          status: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    email: agent.email,
    role: agent.role,
    totalAssignedLeads: agent.assignedLeads.length,
    closedLeadCount: agent.assignedLeads.filter(
      (lead) => lead.status === "CLOSED"
    ).length,
    totalDeals: agent.deals.length,
    closedDeals: agent.deals.filter((deal) => deal.stage === "CLOSED").length,
    totalDealValue: agent.deals.reduce((sum, deal) => sum + deal.dealValue, 0),
    totalCommission: agent.deals.reduce(
      (sum, deal) => sum + deal.commissionAmount,
      0
    ),
  }));
};