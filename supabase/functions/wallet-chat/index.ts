import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const PRODUCTS = [
  { id: "1", name: "Classic Bifold Wallet", price: 4500, category: "Bifold", description: "Handcrafted premium full-grain leather bifold with multiple card slots." },
  { id: "2", name: "Minimalist Cardholder", price: 2500, category: "Cardholder", description: "Sleek black leather cardholder, ultra-slim." },
  { id: "3", name: "Executive Long Wallet", price: 6500, category: "Long Wallet", description: "Cognac tan long wallet with brass zipper." },
  { id: "4", name: "Heritage Trifold", price: 5000, category: "Trifold", description: "Trifold with RFID blocking." },
  { id: "5", name: "Slim Money Clip", price: 3000, category: "Money Clip", description: "Ultra-thin leather money clip wallet." },
  { id: "6", name: "Vintage Travel Wallet", price: 7500, category: "Travel", description: "Travel wallet with passport holder and currency compartments." },
];

const systemPrompt = `You are a friendly wallet shopping assistant for Skyths, a premium leather wallet brand. Help customers find the perfect wallet based on their lifestyle, budget, and preferences. Ask brief clarifying questions when needed (use, budget, style). Recommend from this catalog only, and always mention product names and prices in PKR.

CATALOG:
${PRODUCTS.map(p => `- ${p.name} (${p.category}) - PKR ${p.price} — ${p.description}`).join("\n")}

Keep responses concise, warm, and helpful. Use markdown for product names in **bold**.`;

const MAX_MESSAGES = 20;
const MAX_MSG_LEN = 2000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.slice(7);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    // Input validation
    const body = await req.json().catch(() => null);
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return json({ error: `messages must be an array of 1-${MAX_MESSAGES} items` }, 400);
    }
    const cleaned: Array<{ role: string; content: string }> = [];
    for (const m of messages) {
      if (!m || typeof m !== "object") return json({ error: "Invalid message" }, 400);
      if (!ALLOWED_ROLES.has(m.role)) return json({ error: "Invalid role" }, 400);
      if (typeof m.content !== "string" || m.content.length === 0 || m.content.length > MAX_MSG_LEN) {
        return json({ error: `content must be a string of 1-${MAX_MSG_LEN} chars` }, 400);
      }
      cleaned.push({ role: m.role, content: m.content });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...cleaned],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return json({ error: "Rate limit exceeded, please try again later." }, 429);
      if (response.status === 402) return json({ error: "AI credits exhausted. Please add credits in Settings." }, 402);
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return json({ error: "AI gateway error" }, 500);
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("wallet-chat error", e);
    return json({ error: "Internal error" }, 500);
  }
});
