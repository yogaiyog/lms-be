"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsRouter = void 0;
const express_1 = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_1 = __importDefault(require("../docs/openapi"));
exports.docsRouter = (0, express_1.Router)();
exports.docsRouter.get("/openapi.json", (_req, res) => {
    res.json(openapi_1.default);
});
exports.docsRouter.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.default, {
    explorer: true,
    swaggerOptions: {
        docExpansion: "list",
        defaultModelsExpandDepth: 0,
    },
}));
