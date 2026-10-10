import { NextResponse } from "next/server";
import { authorizeTeacherClassAccess, resolveServerSessionFromHeaders } from "@/lib/rbac";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const classId = url.searchParams.get("classId");
  const session = resolveServerSessionFromHeaders(request.headers);
  const decision = authorizeTeacherClassAccess(session, classId);

  if (!decision.allowed) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: decision.errorCode,
        message: decision.message,
        verifiedByServer: false
      },
      { status: decision.status }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      verifiedByServer: true,
      teacherId: session.userId,
      role: session.role,
      message: decision.message,
      classes: decision.data
    },
    { status: 200 }
  );
}
