import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages } = await req.json();
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
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("wallet-chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
