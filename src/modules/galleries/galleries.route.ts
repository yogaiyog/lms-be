import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { createCrudRouter } from "../../lib/crud-router";
import { galleryCreateSchema, galleryUpdateSchema } from "./galleries.schema";

const include = {
  student: { include: { user: { select: { email: true } } } },
};

const baseRouter = createCrudRouter({
  delegate: prisma.gallery,
  createSchema: galleryCreateSchema,
  updateSchema: galleryUpdateSchema,
  include,
});

const router = Router();

// List by studentId
router.get("/student/:studentId", async (req, res, next) => {
  try {
    const items = await prisma.gallery.findMany({
      where: { studentId: req.params.studentId },
      include,
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: items });
  } catch (error) {
    const { mapPrismaError } = await import("../../lib/prisma-error");
    const appError = mapPrismaError(error);
    return res.status(appError.statusCode).json({
      success: false, message: appError.message, code: appError.code,
    });
  }
});

router.get("/", (req, res, next) => baseRouter(req, res, next));
router.get("/:id", (req, res, next) => baseRouter(req, res, next));
router.post("/", (req, res, next) => baseRouter(req, res, next));
router.patch("/:id", (req, res, next) => baseRouter(req, res, next));
router.delete("/:id", (req, res, next) => baseRouter(req, res, next));

export { router as galleriesRouter };
