export type AuthenticatedRole = "guest" | "student" | "applicant" | "self_learner" | "teacher" | "admin";

export interface ServerSessionContext {
  authenticated: boolean;
  userId: string | null;
  role: AuthenticatedRole;
  verifiedByServer: boolean;
}

export interface ProtectedTeacherClassRecord {
  classId: string;
  ownerTeacherId: string;
  title: string;
  subjectId: string;
  assignedLessonId: string;
  studentCount: number;
  aggregatedAccuracyPercent: number | null;
}

export interface RbacAccessDecision {
  allowed: boolean;
  status: 200 | 401 | 403 | 404;
  errorCode?: "UNAUTHENTICATED" | "FORBIDDEN_ROLE" | "FORBIDDEN_CLASS_OWNERSHIP" | "CLASS_NOT_FOUND";
  message: string;
  data?: ProtectedTeacherClassRecord | ProtectedTeacherClassRecord[];
}

const SERVER_PROTECTED_CLASSES: ProtectedTeacherClassRecord[] = [
  {
    classId: "class-phys-10a",
    ownerTeacherId: "teacher-verified-1",
    title: "10 «А» — Физика (Механика и МКТ)",
    subjectId: "physics",
    assignedLessonId: "physics-lesson-phys_kinematics",
    studentCount: 24,
    aggregatedAccuracyPercent: 78
  },
  {
    classId: "class-math-11b",
    ownerTeacherId: "teacher-verified-1",
    title: "11 «Б» — Профильная математика",
    subjectId: "math",
    assignedLessonId: "math-lesson-inequalities",
    studentCount: 19,
    aggregatedAccuracyPercent: 82
  },
  {
    classId: "class-hist-10c",
    ownerTeacherId: "teacher-verified-2",
    title: "10 «В» — История Казахстана",
    subjectId: "history_kz",
    assignedLessonId: "history_kz-lesson-hkz_khanate",
    studentCount: 22,
    aggregatedAccuracyPercent: 74
  }
];

/**
 * Parses and verifies a server session token.
 * Client-side localStorage role flags are NEVER trusted as server authentication (P0-003 & E2E-012).
 */
export function resolveServerSessionFromHeaders(headers: {
  get(name: string): string | null;
}): ServerSessionContext {
  const authHeader = headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : (headers.get("x-bilimai-auth-token") ?? "").trim();

  if (!token) {
    return {
      authenticated: false,
      userId: null,
      role: "guest",
      verifiedByServer: false
    };
  }

  if (token === "bilimai-teacher-token-1") {
    return {
      authenticated: true,
      userId: "teacher-verified-1",
      role: "teacher",
      verifiedByServer: true
    };
  }

  if (token === "bilimai-teacher-token-2") {
    return {
      authenticated: true,
      userId: "teacher-verified-2",
      role: "teacher",
      verifiedByServer: true
    };
  }

  if (token.startsWith("bilimai-student-token")) {
    return {
      authenticated: true,
      userId: "student-verified-1",
      role: "student",
      verifiedByServer: true
    };
  }

  return {
    authenticated: false,
    userId: null,
    role: "guest",
    verifiedByServer: false
  };
}

/**
 * Enforces server-side RBAC for protected teacher class/student data (P0-003 & E2E-012):
 * - Unauthenticated / localStorage-only callers receive 401 UNAUTHENTICATED.
 * - Authenticated non-teachers (e.g. students) receive 403 FORBIDDEN_ROLE.
 * - Authenticated teachers requesting another teacher's class receive 403 FORBIDDEN_CLASS_OWNERSHIP.
 */
export function authorizeTeacherClassAccess(
  session: ServerSessionContext,
  requestedClassId?: string | null
): RbacAccessDecision {
  if (!session.authenticated || !session.verifiedByServer || !session.userId) {
    return {
      allowed: false,
      status: 401,
      errorCode: "UNAUTHENTICATED",
      message:
        "Доступ запрещён (401): требуется серверная авторизация преподавателя. Локальный переключатель роли в браузере не даёт доступа к данным учеников."
    };
  }

  if (session.role !== "teacher" && session.role !== "admin") {
    return {
      allowed: false,
      status: 403,
      errorCode: "FORBIDDEN_ROLE",
      message: `Доступ запрещён (403): текущая роль «${session.role}» не имеет прав преподавателя.`
    };
  }

  if (requestedClassId) {
    const targetClass = SERVER_PROTECTED_CLASSES.find((c) => c.classId === requestedClassId);
    if (!targetClass) {
      return {
        allowed: false,
        status: 404,
        errorCode: "CLASS_NOT_FOUND",
        message: "Учебная группа не найдена."
      };
    }

    if (session.role !== "admin" && targetClass.ownerTeacherId !== session.userId) {
      return {
        allowed: false,
        status: 403,
        errorCode: "FORBIDDEN_CLASS_OWNERSHIP",
        message:
          "Доступ запрещён (403): преподаватель имеет доступ только к собственным учебным группам."
      };
    }

    return {
      allowed: true,
      status: 200,
      message: "Доступ к группе подтверждён сервером.",
      data: targetClass
    };
  }

  const ownedClasses =
    session.role === "admin"
      ? SERVER_PROTECTED_CLASSES
      : SERVER_PROTECTED_CLASSES.filter((c) => c.ownerTeacherId === session.userId);

  return {
    allowed: true,
    status: 200,
    message: "Список групп преподавателя подтверждён сервером.",
    data: ownedClasses
  };
}
