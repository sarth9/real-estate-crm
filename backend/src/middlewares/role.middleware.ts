import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { ApiError } from "../utils/apiError";

type Role = "ADMIN" | "MANAGER" | "AGENT";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ApiError(401, "Unauthorized"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ApiError(403, "Forbidden. Insufficient permissions."));
      return;
    }

    next();
  };
};