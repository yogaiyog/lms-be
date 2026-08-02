"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app_error_1 = require("../../utils/app-error");
const prisma_1 = require("../../lib/prisma");
const passwordSaltRounds = 12;
const DAY_ORDER = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
];
function computeScheduleDate(startDate, dayOfWeek) {
    const dayIdx = DAY_ORDER.indexOf(dayOfWeek);
    const startDay = startDate.getDay();
    const diff = (dayIdx - startDay + 7) % 7;
    const d = new Date(startDate);
    d.setDate(d.getDate() + diff);
    return d;
}
exports.trialService = {
    async registerTrial(input) {
        return prisma_1.prisma.$transaction(async (tx) => {
            // 1. Parent — reuse existing or create new
            let parentId = input.parent.parentId;
            if (!parentId) {
                const email = input.parent.email.toLowerCase();
                const existing = await tx.user.findUnique({
                    where: { email },
                    select: { id: true },
                });
                if (existing) {
                    throw new app_error_1.AppError("Email already registered", 409, "EMAIL_ALREADY_REGISTERED");
                }
                const hashedPassword = await bcryptjs_1.default.hash(input.parent.password, passwordSaltRounds);
                const parentUser = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        role: "PARENT",
                        emailVerified: true,
                        parentProfile: {
                            create: {
                                fullName: input.parent.fullName,
                                phone: input.parent.phone ?? "",
                            },
                        },
                    },
                    include: { parentProfile: true },
                });
                parentId = parentUser.parentProfile?.id;
                if (!parentId) {
                    throw new app_error_1.AppError("Failed to create parent profile", 500, "PARENT_PROFILE_CREATE_FAILED");
                }
            }
            else {
                const parent = await tx.parentProfile.findUnique({
                    where: { id: parentId },
                    select: { id: true },
                });
                if (!parent) {
                    throw new app_error_1.AppError("Parent profile not found", 404, "PARENT_NOT_FOUND");
                }
            }
            // 2. Student
            const studentEmail = input.student.email.toLowerCase();
            const existingStudent = await tx.user.findUnique({
                where: { email: studentEmail },
                select: { id: true },
            });
            if (existingStudent) {
                throw new app_error_1.AppError("Email already registered", 409, "EMAIL_ALREADY_REGISTERED");
            }
            const hashedStudentPassword = await bcryptjs_1.default.hash(input.student.password, passwordSaltRounds);
            const studentUser = await tx.user.create({
                data: {
                    email: studentEmail,
                    password: hashedStudentPassword,
                    role: "STUDENT",
                    emailVerified: true,
                    studentProfile: {
                        create: {
                            parentId,
                            fullName: input.student.fullName,
                            nickname: input.student.nickname,
                            birthDate: input.student.birthDate,
                            categoryId: input.student.categoryId,
                            school: input.student.school,
                        },
                    },
                },
                include: { studentProfile: true },
            });
            const studentId = studentUser.studentProfile?.id;
            if (!studentId) {
                throw new app_error_1.AppError("Failed to create student profile", 500, "STUDENT_PROFILE_CREATE_FAILED");
            }
            // 3. Validate curriculum & tutor
            const curriculum = await tx.curriculum.findUnique({
                where: { id: input.curriculumId },
                include: { topics: { orderBy: { order: "asc" }, take: 1 } },
            });
            if (!curriculum) {
                throw new app_error_1.AppError("Curriculum not found", 404, "CURRICULUM_NOT_FOUND");
            }
            const tutor = await tx.tutorProfile.findUnique({
                where: { id: input.tutorId },
                select: { id: true },
            });
            if (!tutor) {
                throw new app_error_1.AppError("Tutor not found", 404, "TUTOR_NOT_FOUND");
            }
            // 4. Class (TRIAL)
            const lastClass = await tx.class.findFirst({
                orderBy: { batch: "desc" },
                select: { batch: true },
            });
            const batch = (lastClass?.batch ?? 0) + 1;
            const className = input.className?.trim() || `${curriculum.name} - Trial`;
            const cls = await tx.class.create({
                data: {
                    name: className,
                    type: "TRIAL",
                    categoryId: input.student.categoryId,
                    curriculumId: curriculum.id,
                    batch,
                    startDate: input.startDate,
                    isActive: true,
                    isOnline: input.isOnline ?? true,
                    tutors: { connect: { id: input.tutorId } },
                },
            });
            // 5. Schedule (1 meet, dari topic pertama kurikulum)
            const topic = curriculum.topics[0];
            const schedule = await tx.schedule.create({
                data: {
                    classId: cls.id,
                    dayOfWeek: input.slot.dayOfWeek,
                    startTime: input.slot.startTime,
                    endTime: input.slot.endTime,
                    meetLink: "https://meet.google.com/new",
                    topic: topic?.title ?? curriculum.name,
                    topicId: topic?.id,
                    date: computeScheduleDate(input.startDate, input.slot.dayOfWeek),
                },
            });
            // 6. Enrollment (1 pertemuan trial)
            const enrollment = await tx.enrollment.create({
                data: {
                    studentId,
                    classId: cls.id,
                    curriculumId: curriculum.id,
                    totalMeetPurchased: 1,
                    totalMeetLeft: 1,
                },
            });
            return {
                parentId,
                studentId,
                classId: cls.id,
                scheduleId: schedule.id,
                enrollmentId: enrollment.id,
            };
        });
    },
};
