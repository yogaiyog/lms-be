"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBucket = exports.deleteFile = exports.uploadFile = void 0;
var minio_service_1 = require("./minio.service");
Object.defineProperty(exports, "uploadFile", { enumerable: true, get: function () { return minio_service_1.uploadFile; } });
Object.defineProperty(exports, "deleteFile", { enumerable: true, get: function () { return minio_service_1.deleteFile; } });
Object.defineProperty(exports, "ensureBucket", { enumerable: true, get: function () { return minio_service_1.ensureBucket; } });
