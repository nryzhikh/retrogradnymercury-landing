import { NextResponse } from "next/server";

const YANDEX_SURVEY_ID = "69e61b8395add50b882ab1b4";
const YANDEX_ENDPOINT = `https://api.forms.yandex.net/v1/surveys/${YANDEX_SURVEY_ID}/form`;

const FIELD = {
  name: "answer_short_text_9008975942748280",
  email: "answer_short_text_9008975942770224",
  phone: "answer_short_text_9008975942791996",
  about: "answer_short_text_9008975942806184",
  consentData: "answer_boolean_9008975942820538",
  // consentRules: "answer_boolean_9008975942845082",
} as const;

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  about?: unknown;
  consentData?: unknown;
  consentRules?: unknown;
};

const asString = (value: unknown, max = 500): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

const asBool = (value: unknown): boolean => value === true || value === "on" || value === "true";

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = asString(body.name, 200);
  const email = asString(body.email, 200);
  const phone = asString(body.phone, 40);
  const about = asString(body.about, 2000);
  const consentData = asBool(body.consentData);
  // const consentRules = asBool(body.consentRules);

  if (!name || !email || !phone || !about || !consentData) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const yandexPayload = {
    [FIELD.name]: name,
    [FIELD.email]: email,
    [FIELD.phone]: phone,
    [FIELD.about]: about,
    [FIELD.consentData]: consentData,
    // [FIELD.consentRules]: consentRules,
  };

  try {
    const res = await fetch(YANDEX_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(yandexPayload),
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[lead] yandex rejected", res.status, detail);
      return NextResponse.json({ error: "upstream_rejected" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] yandex unreachable", err);
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }
}
