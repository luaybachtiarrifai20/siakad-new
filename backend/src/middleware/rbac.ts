import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import prisma from "../utils/prisma";

export interface RBACAuthRequest extends AuthRequest {
  dbUser?: any; // Ideally we use the full User type from Prisma
}

export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: RBACAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      res
        .status(401)
        .json({ error: "Unauthorized: Missing Firebase user payload" });
      return;
    }

    try {
      const dbUser = await prisma.user.findUnique({
        where: { firebaseUid: req.user.uid },
      });

      if (!dbUser) {
        res
          .status(403)
          .json({ error: "Forbidden: User not found in local DB" });
        return;
      }

      if (!allowedRoles.includes(dbUser.role)) {
        res.status(403).json({
          error: `Forbidden: Requires one of these roles: ${allowedRoles.join(", ")}`,
        });
        return;
      }

      req.dbUser = dbUser;
      next();
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ error: "Internal Server Error in RBAC Verification" });
      return;
    }
  };
};
