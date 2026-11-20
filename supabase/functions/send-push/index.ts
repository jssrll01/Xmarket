import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT")!, Deno.env.get("VAPID_PUBLIC_KEY")!, Deno.env.get("VAPID_PRIVATE_KEY")!);

const PATHS: Record<string, string> = {
  order: "/orders", cart: "/cart", booster: "/my-boost-orders", mention_global: "/global-chat",
  mention_comment: "/socials", mention_post: "/socials", promo: "/", system: "/notifications", security: "/notifications",
};
type Tok = { id: string; user_id: string; token: string };

async function tokensFor(userId?: string): Promise<Tok[]> {
  const out: Tok[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from("push_tokens").select("id,user_id,token").like("token", "{%").order("id").range(from, from + 999);
    if (userId) q = q.eq("user_id", userId);
    const { data, error } = await q;
    if (error || !data || !data.length) break;
    out.push(...(data as Tok[]));
    if (data.length < 1000) break;
  }
  return out;
}

async function blast(list: Tok[], payload: unknown) {
  let sent = 0, failed = 0;
  const dead: string[] = [];
  const body = JSON.stringify(payload);
  for (let i = 0; i < list.length; i += 25) {
    await Promise.all(list.slice(i, i + 25).map(async (t) => {
      try {
        await webpush.sendNotification(JSON.parse(t.token), body, { TTL: 86400, urgency: "high" });
        sent++;
      } catch (e) {
        failed++;
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) dead.push(t.id);
      }
    }));
  }
  if (dead.length) await db.from("push_tokens").delete().in("id", dead);
  return { sent, failed };
}

Deno.serve(async (req) => {
  if (req.headers.get("x-push-secret") !== Deno.env.get("PUSH_SECRET")) return new Response("forbidden", { status: 403 });
  const raw = await req.text();
  if (raw.length > 20000) return new Response("too large", { status: 413 });
  // deno-lint-ignore no-explicit-any
  let p: any = {};
  try { p = JSON.parse(raw); } catch (_e) { p = {}; }
  const campaign = p.kind === "campaign";
  let userId: string | undefined;
  let payload: Record<string, string>;
  if (campaign) {
    userId = p.audience === "user" ? p.user_id : undefined;
    payload = { title: p.title || "XMARKET", body: p.body || "", url: p.url || "/", tag: "c-" + p.campaign_id };
  } else {
    userId = p.user_id;
    if (!userId) return new Response(JSON.stringify({ skipped: true }), { headers: { "content-type": "application/json" } });
    payload = { title: p.title || "XMARKET", body: p.body || "", url: PATHS[p.type] || "/notifications", tag: "n-" + (p.id || Date.now()) };
  }
  const list = await tokensFor(userId);
  const r = await blast(list, payload);
  await db.from("push_log").insert({
    kind: campaign ? "campaign" : "auto", title: payload.title, body: payload.body,
    target_user: userId || null, campaign_id: campaign ? p.campaign_id : null, sent: r.sent, failed: r.failed, devices: list.length,
  });
  if (campaign) {
    await db.from("push_campaigns").update({ status: "sent", sent: r.sent, failed: r.failed, sent_at: new Date().toISOString() }).eq("id", p.campaign_id);
  }
  return new Response(JSON.stringify({ ...r, devices: list.length }), { headers: { "content-type": "application/json" } });
});
