"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamificationRouter = void 0;
const express_1 = require("express");
const badges_route_1 = require("../badges/badges.route");
const student_badges_route_1 = require("../student-badges/student-badges.route");
exports.gamificationRouter = (0, express_1.Router)();
exports.gamificationRouter.use("/badges", badges_route_1.badgesRouter);
exports.gamificationRouter.use("/student-badges", student_badges_route_1.studentBadgesRouter);
