import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createClient,
  deleteClient,
  getAllClients,
  getClientById,
  updateClient,
} from "./client.service";
import { createClientSchema, updateClientSchema } from "./client.validation";

export const createClientHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = createClientSchema.parse(req.body);
    const client = await createClient(validatedData);

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  }
);

export const getAllClientsHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const clients = await getAllClients();

    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: clients,
    });
  }
);

export const getClientByIdHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const client = await getClientById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      data: client,
    });
  }
);

export const updateClientHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateClientSchema.parse(req.body);
    const client = await updateClient(req.params.id, validatedData);

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  }
);

export const deleteClientHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteClient(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);