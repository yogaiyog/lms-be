"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpaqueToken = generateOpaqueToken;
exports.hashToken = hashToken;
const node_crypto_1 = require("node:crypto");
function generateOpaqueToken() {
    return (0, node_crypto_1.randomBytes)(48).toString("base64url");
}
function hashToken(token) {
    return (0, node_crypto_1.createHash)("sha256").update(token).digest("hex");
}
