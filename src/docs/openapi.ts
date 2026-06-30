import type { OpenAPIV3 } from "openapi-types";

const idParam: OpenAPIV3.ParameterObject = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" },
};

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
};

const stringUuid = { type: "string", format: "uuid" } as const;
const stringDate = { type: "string", format: "date-time" } as const;

const baseSchemas: Record<string, OpenAPIV3.SchemaObject> = {
  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string" },
      code: { type: "string", nullable: true },
    },
  },
  HealthResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "LMS backend is running" },
    },
  },
  AuthSession: {
    type: "object",
    properties: {
      accessToken: { type: "string" },
      refreshToken: { type: "string" },
      expiresIn: { type: "integer", example: 900 },
      tokenType: { type: "string", example: "Bearer" },
      user: { $ref: "#/components/schemas/User" },
    },
  },
  User: {
    type: "object",
    properties: {
      id: stringUuid,
      email: { type: "string", format: "email" },
      role: {
        type: "string",
        enum: ["ADMIN", "TUTOR", "PARENT", "STUDENT"],
      },
      createdAt: stringDate,
      updatedAt: stringDate,
      parentProfile: { $ref: "#/components/schemas/ParentProfile", nullable: true },
      tutorProfile: { $ref: "#/components/schemas/TutorProfile", nullable: true },
      studentProfile: {
        $ref: "#/components/schemas/StudentProfile",
        nullable: true,
      },
    },
  },
  ParentProfile: {
    type: "object",
    properties: {
      id: stringUuid,
      userId: stringUuid,
      fullName: { type: "string" },
      phone: { type: "string" },
    },
  },
  TutorProfile: {
    type: "object",
    properties: {
      id: stringUuid,
      userId: stringUuid,
      fullName: { type: "string" },
      phone: { type: "string" },
      bio: { type: "string", nullable: true },
      avatarUrl: { type: "string", nullable: true },
    },
  },
  StudentProfile: {
    type: "object",
    properties: {
      id: stringUuid,
      userId: stringUuid,
      parentId: stringUuid,
      fullName: { type: "string" },
      nickname: { type: "string" },
      birthDate: stringDate,
      avatarUrl: { type: "string", nullable: true },
      category: {
        type: "string",
        enum: ["KIDS", "JUNIOR_I", "JUNIOR_II"],
      },
      totalXp: { type: "integer" },
      currentStreak: { type: "integer" },
      lastActive: { type: "string", format: "date-time", nullable: true },
    },
  },
  Class: {
    type: "object",
    properties: {
      id: stringUuid,
      name: { type: "string" },
      category: {
        type: "string",
        enum: ["KIDS", "JUNIOR_I", "JUNIOR_II"],
      },
      tutorId: stringUuid,
      isActive: { type: "boolean" },
      createdAt: stringDate,
      updatedAt: stringDate,
    },
  },
  Enrollment: {
    type: "object",
    properties: {
      id: stringUuid,
      studentId: stringUuid,
      classId: stringUuid,
      joinedAt: stringDate,
    },
  },
  Schedule: {
    type: "object",
    properties: {
      id: stringUuid,
      classId: stringUuid,
      dayOfWeek: {
        type: "string",
        enum: [
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ],
      },
      startTime: { type: "string" },
      endTime: { type: "string" },
      meetLink: { type: "string" },
      topic: { type: "string", nullable: true },
    },
  },
  Attendance: {
    type: "object",
    properties: {
      id: stringUuid,
      scheduleId: stringUuid,
      studentId: stringUuid,
      date: stringDate,
      status: {
        type: "string",
        enum: ["PRESENT", "ABSENT", "LATE", "SICK", "PERMISSION"],
      },
      notes: { type: "string", nullable: true },
      createdAt: stringDate,
    },
  },
  Announcement: {
    type: "object",
    properties: {
      id: stringUuid,
      classId: stringUuid,
      tutorId: stringUuid,
      title: { type: "string" },
      content: { type: "string" },
      createdAt: stringDate,
      updatedAt: stringDate,
    },
  },
  Badge: {
    type: "object",
    properties: {
      id: stringUuid,
      title: { type: "string" },
      description: { type: "string" },
      imageUrl: { type: "string" },
      xpBonus: { type: "integer" },
    },
  },
  StudentBadge: {
    type: "object",
    properties: {
      id: stringUuid,
      studentId: stringUuid,
      badgeId: stringUuid,
      earnedAt: stringDate,
    },
  },
  RefreshToken: {
    type: "object",
    properties: {
      id: stringUuid,
      userId: stringUuid,
      familyId: { type: "string" },
      tokenHash: { type: "string" },
      deviceId: { type: "string", nullable: true },
      deviceName: { type: "string", nullable: true },
      userAgent: { type: "string", nullable: true },
      ipAddress: { type: "string", nullable: true },
      revokedAt: { type: "string", format: "date-time", nullable: true },
      lastUsedAt: { type: "string", format: "date-time", nullable: true },
      expiresAt: stringDate,
      createdAt: stringDate,
      updatedAt: stringDate,
    },
  },
};

function crudPaths(
  basePath: string,
  schemaName: keyof typeof baseSchemas,
  requestSchemaName: string,
): Record<string, OpenAPIV3.PathItemObject> {
  const tag = basePath.split("/").filter(Boolean).slice(2).join("/") || basePath;

  return {
    [`/${basePath}`]: {
      get: {
        tags: [tag],
        summary: `List ${basePath}`,
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: `#/components/schemas/${schemaName}` },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: [tag],
        summary: `Create ${schemaName}`,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${requestSchemaName}` },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: `#/components/schemas/${schemaName}` },
                  },
                },
              },
            },
          },
        },
      },
    },
    [`/${basePath}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Get ${schemaName} by id`,
        parameters: [idParam],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: `#/components/schemas/${schemaName}` },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: [tag],
        summary: `Update ${schemaName}`,
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: `#/components/schemas/${requestSchemaName}` },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: `#/components/schemas/${schemaName}` },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: [tag],
        summary: `Delete ${schemaName}`,
        parameters: [idParam],
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: `#/components/schemas/${schemaName}` },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

const authRequestSchemas: Record<string, OpenAPIV3.SchemaObject> = {
  RegisterParentRequest: {
    type: "object",
    required: ["email", "password", "fullName", "phone"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
      fullName: { type: "string" },
      phone: { type: "string" },
    },
  },
  RegisterTutorRequest: {
    allOf: [
      { $ref: "#/components/schemas/RegisterParentRequest" },
      {
        type: "object",
        properties: {
          bio: { type: "string", nullable: true },
          avatarUrl: { type: "string", nullable: true },
        },
      },
    ],
  } as OpenAPIV3.SchemaObject,
  RegisterStudentRequest: {
    allOf: [
      { $ref: "#/components/schemas/RegisterParentRequest" },
      {
        type: "object",
        required: ["parentId", "nickname", "birthDate", "category"],
        properties: {
          parentId: stringUuid,
          nickname: { type: "string" },
          birthDate: stringDate,
          avatarUrl: { type: "string", nullable: true },
          category: {
            type: "string",
            enum: ["KIDS", "JUNIOR_I", "JUNIOR_II"],
          },
        },
      },
    ],
  } as OpenAPIV3.SchemaObject,
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
      deviceId: { type: "string", nullable: true },
      deviceName: { type: "string", nullable: true },
    },
  },
  RefreshRequest: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
      deviceId: { type: "string", nullable: true },
      deviceName: { type: "string", nullable: true },
    },
  },
  LogoutRequest: {
    type: "object",
    properties: {
      refreshToken: { type: "string", nullable: true },
    },
  },
};

const authPaths: Record<string, OpenAPIV3.PathItemObject> = {
  "/api/v1/auth/register": {
    post: {
      tags: ["auth"],
      summary: "Register parent account",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterParentRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/register/tutor": {
    post: {
      tags: ["auth"],
      summary: "Register tutor account",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterTutorRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/register/student": {
    post: {
      tags: ["auth"],
      summary: "Register student account",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterStudentRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/login": {
    post: {
      tags: ["auth"],
      summary: "Login with email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/refresh": {
    post: {
      tags: ["auth"],
      summary: "Rotate refresh token and issue new access token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RefreshRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/logout": {
    post: {
      tags: ["auth"],
      summary: "Revoke refresh token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LogoutRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/logout-all": {
    post: {
      tags: ["auth"],
      summary: "Revoke all refresh tokens for current user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/v1/auth/me": {
    get: {
      tags: ["auth"],
      summary: "Get current authenticated user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Success",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerDoc: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "LMS Backend API",
    version: "0.1.0",
    description:
      "Express + Prisma API untuk LMS dengan auth refresh token rotation dan CRUD modular.",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development",
    },
  ],
  tags: [
    { name: "auth" },
    { name: "users" },
    { name: "parent-profiles" },
    { name: "tutor-profiles" },
    { name: "student-profiles" },
    { name: "academic/classes" },
    { name: "academic/enrollments" },
    { name: "academic/schedules" },
    { name: "academic/attendances" },
    { name: "academic/announcements" },
    { name: "gamification/badges" },
    { name: "gamification/student-badges" },
  ],
  paths: {
    "/api/v1/health": {
      get: {
        tags: ["health"],
        summary: "Health check",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    ...authPaths,
    ...crudPaths("api/v1/users", "User", "User"),
    ...crudPaths("api/v1/parent-profiles", "ParentProfile", "ParentProfile"),
    ...crudPaths("api/v1/tutor-profiles", "TutorProfile", "TutorProfile"),
    ...crudPaths("api/v1/student-profiles", "StudentProfile", "StudentProfile"),
    ...crudPaths("api/v1/academic/classes", "Class", "Class"),
    ...crudPaths("api/v1/academic/enrollments", "Enrollment", "Enrollment"),
    ...crudPaths("api/v1/academic/schedules", "Schedule", "Schedule"),
    ...crudPaths("api/v1/academic/attendances", "Attendance", "Attendance"),
    ...crudPaths("api/v1/academic/announcements", "Announcement", "Announcement"),
    ...crudPaths("api/v1/gamification/badges", "Badge", "Badge"),
    ...crudPaths(
      "api/v1/gamification/student-badges",
      "StudentBadge",
      "StudentBadge",
    ),
  },
  components: {
    securitySchemes: {
      bearerAuth,
    },
    schemas: {
      ...baseSchemas,
      ...authRequestSchemas,
      AuthResponse: baseSchemas.AuthSession,
    },
  },
};

export default swaggerDoc;
