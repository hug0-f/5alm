import { NextResponse } from "next/server";
import { auth } from "@/auth";

export type SessionUser = {
  id: string;
  email: string;
  isVerified: boolean;
};

export async function requireUser(): Promise<
  | { user: SessionUser; response?: never }
  | { user?: never; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      response: NextResponse.json(
        { error: "Vous devez être connecté." },
        { status: 401 },
      ),
    };
  }
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? "",
      isVerified: session.user.isVerified,
    },
  };
}

export function sameOriginGuard(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) {
    return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  }

  const host = request.headers.get("host");
  try {
    if (new URL(origin).host !== host) {
      return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Requête refusée." }, { status: 403 });
  }
  return null;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk(data: Record<string, unknown> = {}) {
  return NextResponse.json({ success: true, ...data });
}
