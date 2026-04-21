import { prisma } from "../../prisma/client";
import { ApiError } from "../../utils/apiError";

type PropertyType = "RESIDENTIAL" | "COMMERCIAL";
type PropertyAvailability = "AVAILABLE" | "BOOKED" | "SOLD" | "RENTED";

interface CreatePropertyInput {
  title: string;
  type: PropertyType;
  description?: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  sizeSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  availabilityStatus?: PropertyAvailability;
  listedByAgentId?: string;
}

interface UpdatePropertyInput {
  title?: string;
  type?: PropertyType;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  sizeSqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  availabilityStatus?: PropertyAvailability;
  listedByAgentId?: string;
}

interface PropertyQueryInput {
  city?: string;
  type?: PropertyType;
  availabilityStatus?: PropertyAvailability;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const createProperty = async (payload: CreatePropertyInput) => {
  if (payload.listedByAgentId) {
    const agent = await prisma.user.findUnique({
      where: { id: payload.listedByAgentId },
    });

    if (!agent) {
      throw new ApiError(404, "Listed by agent not found");
    }
  }

  return prisma.property.create({
    data: {
      title: payload.title,
      type: payload.type,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      latitude: payload.latitude,
      longitude: payload.longitude,
      price: payload.price,
      sizeSqft: payload.sizeSqft,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      amenities: payload.amenities,
      availabilityStatus: payload.availabilityStatus ?? "AVAILABLE",
      listedByAgentId: payload.listedByAgentId,
    },
    include: {
      listedByAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      images: true,
    },
  });
};

export const getAllProperties = async (query: PropertyQueryInput) => {
  return prisma.property.findMany({
    where: {
      ...(query.city && {
        city: {
          contains: query.city,
          mode: "insensitive",
        },
      }),
      ...(query.type && { type: query.type }),
      ...(query.availabilityStatus && {
        availabilityStatus: query.availabilityStatus,
      }),
      ...((query.minPrice !== undefined || query.maxPrice !== undefined) && {
        price: {
          ...(query.minPrice !== undefined && { gte: query.minPrice }),
          ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
        },
      }),
      ...(query.search && {
        OR: [
          {
            title: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            amenities: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      listedByAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      images: true,
      deals: true,
    },
  });
};

export const getPropertyById = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      listedByAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      images: true,
      deals: true,
      documents: true,
    },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  return property;
};

export const updateProperty = async (
  propertyId: string,
  payload: UpdatePropertyInput
) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!existingProperty) {
    throw new ApiError(404, "Property not found");
  }

  if (payload.listedByAgentId) {
    const agent = await prisma.user.findUnique({
      where: { id: payload.listedByAgentId },
    });

    if (!agent) {
      throw new ApiError(404, "Listed by agent not found");
    }
  }

  return prisma.property.update({
    where: { id: propertyId },
    data: {
      ...(payload.title !== undefined && { title: payload.title }),
      ...(payload.type !== undefined && { type: payload.type }),
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
      ...(payload.address !== undefined && { address: payload.address }),
      ...(payload.city !== undefined && { city: payload.city }),
      ...(payload.state !== undefined && { state: payload.state }),
      ...(payload.country !== undefined && { country: payload.country }),
      ...(payload.latitude !== undefined && { latitude: payload.latitude }),
      ...(payload.longitude !== undefined && { longitude: payload.longitude }),
      ...(payload.price !== undefined && { price: payload.price }),
      ...(payload.sizeSqft !== undefined && { sizeSqft: payload.sizeSqft }),
      ...(payload.bedrooms !== undefined && { bedrooms: payload.bedrooms }),
      ...(payload.bathrooms !== undefined && { bathrooms: payload.bathrooms }),
      ...(payload.amenities !== undefined && { amenities: payload.amenities }),
      ...(payload.availabilityStatus !== undefined && {
        availabilityStatus: payload.availabilityStatus,
      }),
      ...(payload.listedByAgentId !== undefined && {
        listedByAgentId: payload.listedByAgentId,
      }),
    },
    include: {
      listedByAgent: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      images: true,
    },
  });
};

export const deleteProperty = async (propertyId: string) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!existingProperty) {
    throw new ApiError(404, "Property not found");
  }

  await prisma.property.delete({
    where: { id: propertyId },
  });

  return {
    message: "Property deleted successfully",
  };
};