export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      role: "ADMIN" | "MANAGER" | "AGENT";
      isActive: boolean;
      createdAt: string;
    };
  };
}

export interface DashboardSummary {
  totalLeads: number;
  totalClients: number;
  totalProperties: number;
  totalDeals: number;
  closedDeals: number;
  totalRevenue: number;
  totalCommission: number;
  leadConversionRate: number;
}

export interface DashboardReportResponse {
  success: boolean;
  message: string;
  data: {
    summary: DashboardSummary;
    leadStatusBreakdown: {
      status: string;
      count: number;
    }[];
    dealStageBreakdown: {
      stage: string;
      count: number;
    }[];
  };
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  source: "WEBSITE" | "ADS" | "CALL" | "REFERRAL" | "MANUAL";
  budgetMin?: number | null;
  budgetMax?: number | null;
  preferences?: string | null;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";
  followUpAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "AGENT";
  } | null;
}

export interface LeadsResponse {
  success: boolean;
  message: string;
  data: Lead[];
}

export interface CreateLeadResponse {
  success: boolean;
  message: string;
  data: Lead;
}

export interface Property {
  id: string;
  title: string;
  type: "RESIDENTIAL" | "COMMERCIAL";
  description?: string | null;
  address: string;
  city: string;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price: number;
  sizeSqft?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  amenities?: string | null;
  availabilityStatus: "AVAILABLE" | "BOOKED" | "SOLD" | "RENTED";
  createdAt: string;
  updatedAt: string;
  listedByAgent?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "AGENT";
  } | null;
}

export interface PropertiesResponse {
  success: boolean;
  message: string;
  data: Property[];
}

export interface CreatePropertyResponse {
  success: boolean;
  message: string;
  data: Property;
}

export interface Client {
  id: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  clientType: "BUYER" | "SELLER" | "INVESTOR" | "TENANT";
  preferences?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  linkedLead?: {
    id: string;
    fullName: string;
    phone: string;
    email?: string | null;
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST";
  } | null;
}

export interface ClientsResponse {
  success: boolean;
  message: string;
  data: Client[];
}

export interface CreateClientResponse {
  success: boolean;
  message: string;
  data: Client;
}

export interface Deal {
  id: string;
  title: string;
  stage: "NEGOTIATION" | "AGREEMENT" | "CLOSED";
  dealValue: number;
  commissionPercent: number;
  commissionAmount: number;
  expectedCloseDate?: string | null;
  closedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
  };
  property: {
    id: string;
    title: string;
    city: string;
    price: number;
  };
  agent: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "AGENT";
  };
}

export interface DealsResponse {
  success: boolean;
  message: string;
  data: Deal[];
}

export interface CreateDealResponse {
  success: boolean;
  message: string;
  data: Deal;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: "ADMIN" | "MANAGER" | "AGENT";
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
  };
}

export interface LeadReportResponse {
  success: boolean;
  message: string;
  data: {
    totalLeads: number;
    breakdown: {
      status: string;
      count: number;
      percentage: number;
    }[];
  };
}

export interface SalesReportResponse {
  success: boolean;
  message: string;
  data: {
    totalDeals: number;
    closedDeals: number;
    totalRevenue: number;
    totalCommission: number;
    stageBreakdown: {
      stage: string;
      count: number;
    }[];
  };
}

export interface AgentPerformanceItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "AGENT";
  totalAssignedLeads: number;
  closedLeadCount: number;
  totalDeals: number;
  closedDeals: number;
  totalDealValue: number;
  totalCommission: number;
}

export interface AgentPerformanceReportResponse {
  success: boolean;
  message: string;
  data: AgentPerformanceItem[];
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "ADMIN" | "MANAGER" | "AGENT";
  isActive: boolean;
  createdAt: string;
  assignedLeads: {
    id: string;
  }[];
  deals: {
    id: string;
    stage: "NEGOTIATION" | "AGREEMENT" | "CLOSED";
    dealValue: number;
    commissionAmount: number;
  }[];
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: UserListItem[];
}

export interface Reminder {
  id: string;
  title: string;
  description?: string | null;
  dueAt: string;
  status: "PENDING" | "DONE" | "MISSED";
  createdAt: string;
  lead?: {
    id: string;
    fullName: string;
  } | null;
  client?: {
    id: string;
    fullName: string;
  } | null;
  assignedTo: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "AGENT";
  };
}

export interface RemindersResponse {
  success: boolean;
  message: string;
  data: Reminder[];
}