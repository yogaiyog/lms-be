"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const routes_1 = require("./routes");
const error_middleware_1 = require("./middlewares/error.middleware");
const not_found_middleware_1 = require("./middlewares/not-found.middleware");
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", true);
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    // CORS handled by Nginx - disabled here to avoid duplicate headers
    // app.use(cors({ origin: true, credentials: true }));
    app.use(express_1.default.json({ limit: "2mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "production" ? "combined" : "dev"));
    app.get("/", (_req, res) => {
        res.json({ success: true, service: "lms-backend", version: "0.1.0" });
    });
    app.use("/api/v1", routes_1.apiRouter);
    app.use(not_found_middleware_1.notFoundMiddleware);
    app.use(error_middleware_1.errorMiddleware);
    return app;
}
