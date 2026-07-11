import { Router } from "express";
import { prisma } from "../../lib/prisma";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const data = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return res.json({ success: true, data });
  } catch (error) { next(error); }
});
