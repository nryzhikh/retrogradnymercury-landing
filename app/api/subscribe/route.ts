import { NextResponse } from "next/server";

const YANDEX_SURVEY_ID = "69e62552068ff00dc4c2eb9c";
const YANDEX_ENDPOINT = `https://api.forms.yandex.net/v1/surveys/${YANDEX_SURVEY_ID}/form`;

const FIELD = {
  email: "answer_short_text_9008975945266968",
} as const;

type SubscribePayload = {
  email?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asEmail = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().slice(0, 200);
  return EMAIL_RE.test(trimmed) ? trimmed : "";
};

export async function POST(request: Request) {
  let body: SubscribePayload;
  try {
    body = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = asEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const res = await fetch(YANDEX_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [FIELD.email]: email }),
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[subscribe] yandex rejected", res.status, detail);
      return NextResponse.json({ error: "upstream_rejected" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] yandex unreachable", err);
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }
}
