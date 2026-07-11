"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorSlotsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const app_error_1 = require("../../utils/app-error");
exports.tutorSlotsRouter = (0, express_1.Router)();
const DAY_NAMES = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
function isWeekend(dayIdx) {
    return dayIdx >= 5;
}
function isValidHour(dayIdx, hour) {
    if (hour < 9 || hour >= 21)
        return false;
    if (!isWeekend(dayIdx) && hour < 15)
        return false;
    return true;
}
function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && aEnd > bStart;
}
exports.tutorSlotsRouter.get("/:tutorId", async (req, res, next) => {
    try {
        const tutorId = req.params.tutorId;
        const tutor = await prisma_1.prisma.tutorProfile.findUnique({ where: { id: tutorId } });
        if (!tutor)
            throw new app_error_1.AppError("Tutor not found", 404);
        const [slots, classes] = await Promise.all([
            prisma_1.prisma.tutorSlot.findMany({
                where: { tutorId },
                orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            }),
            prisma_1.prisma.class.findMany({
                where: { tutors: { some: { id: tutorId } }, isActive: true },
                include: { schedules: true },
            }),
        ]);
        const dayoffs = new Set();
        if (tutor.dayoff1 != null)
            dayoffs.add(tutor.dayoff1);
        if (tutor.dayoff2 != null)
            dayoffs.add(tutor.dayoff2);
        const allSchedules = classes.flatMap((c) => c.schedules.filter((s) => !s.isDone).map((s) => ({ ...s, className: c.name })));
        const result = slots.map((slot) => {
            const dayIdx = DAY_NAMES.indexOf(slot.dayOfWeek);
            const isDayoff = dayoffs.has(dayIdx);
            const filled = !isDayoff && allSchedules.some((s) => s.dayOfWeek === slot.dayOfWeek &&
                overlaps(slot.startTime, slot.endTime, s.startTime, s.endTime));
            return { ...slot, isDayoff, isFilled: filled };
        });
        return res.json({
            success: true,
            data: {
                slots: result,
                dayoffs: Array.from(dayoffs),
            },
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.tutorSlotsRouter.patch("/:tutorId/toggle", async (req, res, next) => {
    try {
        const tutorId = req.params.tutorId;
        const { dayOfWeek, startTime } = req.body;
        if (!DAY_NAMES.includes(dayOfWeek))
            throw new app_error_1.AppError("Invalid dayOfWeek", 400);
        if (typeof startTime !== "string" || !/^\d{2}:\d{2}$/.test(startTime))
            throw new app_error_1.AppError("Invalid startTime", 400);
        const [h] = startTime.split(":").map(Number);
        const endTime = `${String(h + 1).padStart(2, "0")}:00`;
        const dayIdx = DAY_NAMES.indexOf(dayOfWeek);
        // Validate within allowed range
        if (!isValidHour(dayIdx, h))
            throw new app_error_1.AppError("Slot diluar jam yang diizinkan", 400);
        const tutor = await prisma_1.prisma.tutorProfile.findUnique({ where: { id: tutorId } });
        if (!tutor)
            throw new app_error_1.AppError("Tutor not found", 404);
        const dayoffs = new Set();
        if (tutor.dayoff1 != null)
            dayoffs.add(tutor.dayoff1);
        if (tutor.dayoff2 != null)
            dayoffs.add(tutor.dayoff2);
        const existing = await prisma_1.prisma.tutorSlot.findUnique({
            where: { tutorId_dayOfWeek_startTime: { tutorId, dayOfWeek, startTime } },
        });
        if (existing) {
            // Deactivate
            if (dayoffs.has(dayIdx))
                throw new app_error_1.AppError("Hari libur, tidak bisa mengubah slot", 400);
            // Check class overlap
            const classes = await prisma_1.prisma.class.findMany({
                where: { tutors: { some: { id: tutorId } }, isActive: true },
                include: { schedules: true },
            });
            const hasClass = classes.some((c) => c.schedules.some((s) => s.dayOfWeek === dayOfWeek &&
                overlaps(startTime, endTime, s.startTime, s.endTime)));
            if (hasClass)
                throw new app_error_1.AppError("Slot terisi kelas, tidak bisa dinonaktifkan", 400);
            // Min 21 (hitung non-dayoff)
            const allSlots = await prisma_1.prisma.tutorSlot.findMany({ where: { tutorId } });
            const nonDayoff = allSlots.filter((s) => !dayoffs.has(DAY_NAMES.indexOf(s.dayOfWeek)));
            if (nonDayoff.length <= 21)
                throw new app_error_1.AppError("Minimal 21 slot aktif diperlukan", 400);
            await prisma_1.prisma.tutorSlot.delete({ where: { id: existing.id } });
        }
        else {
            // Activate - if dayoff, allow? No, dayoff means entire day is off
            if (dayoffs.has(dayIdx))
                throw new app_error_1.AppError("Hari libur, tidak bisa mengaktifkan slot", 400);
            await prisma_1.prisma.tutorSlot.create({ data: { tutorId, dayOfWeek, startTime, endTime } });
        }
        return res.json({ success: true, data: null });
    }
    catch (error) {
        return next(error);
    }
});
exports.tutorSlotsRouter.patch("/:tutorId/dayoffs", async (req, res, next) => {
    try {
        const tutorId = req.params.tutorId;
        const { dayoff1, dayoff2 } = req.body;
        if (dayoff1 != null && (dayoff1 < 0 || dayoff1 > 6))
            throw new app_error_1.AppError("dayoff1 must be 0 (Mon) - 6 (Sun)", 400);
        if (dayoff2 != null && (dayoff2 < 0 || dayoff2 > 6))
            throw new app_error_1.AppError("dayoff2 must be 0 (Mon) - 6 (Sun)", 400);
        if (dayoff1 === dayoff2)
            throw new app_error_1.AppError("Dayoff harus berbeda", 400);
        const existing = await prisma_1.prisma.tutorProfile.findUnique({
            where: { id: tutorId },
            include: {
                classes: {
                    where: { isActive: true },
                    include: { schedules: true },
                },
            },
        });
        if (!existing)
            throw new app_error_1.AppError("Tutor not found", 404);
        // Check newly set dayoffs for class conflicts
        const newDayoffs = new Set();
        if (dayoff1 !== undefined)
            newDayoffs.add(dayoff1);
        if (dayoff2 !== undefined)
            newDayoffs.add(dayoff2);
        const oldDayoffs = new Set();
        if (existing.dayoff1 != null)
            oldDayoffs.add(existing.dayoff1);
        if (existing.dayoff2 != null)
            oldDayoffs.add(existing.dayoff2);
        const addedDayoffs = [...newDayoffs].filter((d) => !oldDayoffs.has(d));
        if (addedDayoffs.length > 0) {
            const scheduleDays = new Set(existing.classes.flatMap((c) => c.schedules.map((s) => s.dayOfWeek)));
            const dayNames = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
            for (const day of addedDayoffs) {
                if (scheduleDays.has(dayNames[day])) {
                    throw new app_error_1.AppError(`Tidak bisa mengubah hari libur: ada jadwal kelas pada hari ${dayNames[day].toLowerCase()}`, 400);
                }
            }
        }
        const tutor = await prisma_1.prisma.tutorProfile.update({
            where: { id: tutorId },
            data: {
                ...(dayoff1 !== undefined ? { dayoff1 } : {}),
                ...(dayoff2 !== undefined ? { dayoff2 } : {}),
            },
        });
        return res.json({ success: true, data: tutor });
    }
    catch (error) {
        return next(error);
    }
});
