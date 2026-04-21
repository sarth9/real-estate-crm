import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
} from "./property.service";
import {
  createPropertySchema,
  propertyQuerySchema,
  updatePropertySchema,
} from "./property.validation";

export const createPropertyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = createPropertySchema.parse(req.body);
    const property = await createProperty(validatedData);

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  }
);

export const getAllPropertiesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedQuery = propertyQuerySchema.parse(req.query);
    const properties = await getAllProperties(validatedQuery);

    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  }
);

export const getPropertyByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await getPropertyById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      data: property,
    });
  }
);

export const updatePropertyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updatePropertySchema.parse(req.body);
    const property = await updateProperty(req.params.id, validatedData);

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  }
);

export const deletePropertyHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteProperty(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);