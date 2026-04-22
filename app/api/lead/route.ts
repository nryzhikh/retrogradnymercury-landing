import { NextResponse } from "next/server";

const YANDEX_SURVEY_ID = "69e61b8395add50b882ab1b4";
const YANDEX_ENDPOINT = `https://api.forms.yandex.net/v1/surveys/${YANDEX_SURVEY_ID}/form`;

const FIELD = {
  name: "answer_short_text_9008975942748280",
  email: "answer_short_text_9008975942770224",
  phone: "answer_short_text_9008975942791996",
  about: "answer_short_text_9008975942806184",
  consentData: "answer_boolean_9008975942820538",
  consentAds: "answer_boolean_9008976023366224",
} as const;

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  about?: unknown;
  consentData?: unknown;
  consentAds?: unknown;
};

const asString = (value: unknown, max = 500): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

const asBool = (value: unknown): boolean => value === true || value === "on" || value === "true";

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 300;
const REQUEST_TIMEOUT_MS = 8000;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const isRetriableStatus = (status: number): boolean =>
  status === 408 || status === 425 || status === 429 || (status >= 500 && status < 600);

async function postWithRetry(url: string, payload: unknown): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      });

      if (res.ok || !isRetriableStatus(res.status) || attempt === MAX_ATTEMPTS) {
        return res;
      }

      console.warn("[lead] retriable upstream status", { attempt, status: res.status });
    } catch (err) {
      lastError = err;
      console.warn("[lead] fetch attempt failed", { attempt, err });
      if (attempt === MAX_ATTEMPTS) throw err;
    } finally {
      clearTimeout(timeout);
    }

    const backoff = BASE_DELAY_MS * 2 ** (attempt - 1);
    const jitter = Math.floor(Math.random() * BASE_DELAY_MS);
    await sleep(backoff + jitter);
  }

  throw lastError ?? new Error("lead_retry_exhausted");
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = asString(body.name, 300);
  const email = asString(body.email, 300);
  const phone = asString(body.phone, 40);
  const about = asString(body.about, 2000);
  const consentData = asBool(body.consentData);
  const consentAds = asBool(body.consentAds || false);

  if (!name || !email || !phone || !about || !consentData) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const yandexPayload = {
    [FIELD.name]: name,
    [FIELD.email]: email,
    [FIELD.phone]: phone,
    [FIELD.about]: about,
    [FIELD.consentData]: consentData,
    [FIELD.consentAds]: consentAds,
  };

  try {
    const res = await postWithRetry(YANDEX_ENDPOINT, yandexPayload);

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
