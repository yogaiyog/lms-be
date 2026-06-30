import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../docs/openapi";

export const docsRouter = Router();

docsRouter.get("/openapi.json", (_req, res) => {
  res.json(swaggerDoc);
});

docsRouter.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  explorer: true,
  swaggerOptions: {
    docExpansion: "list",
    defaultModelsExpandDepth: 0,
  },
}));
