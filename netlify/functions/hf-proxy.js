// netlify/functions/hf-proxy.js
export const handler = async (event) => {
  // 1 — read the prompt from the POST body
  const { prompt = "" } = JSON.parse(event.body || "{}");
  if (!prompt) {
    return { statusCode: 400, body: "Prompt missing" };
  }

  // 2 — secret token from Netlify env-vars
  const HF_TOKEN = process.env.HF_TOKEN;          // ★ keep this key name

  // 3 — forward to Hugging Face
  const apiRes = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!apiRes.ok) {
    const txt = await apiRes.text();
    return { statusCode: apiRes.status, body: txt };
  }

  // 4 — return the raw PNG (base64) to the browser
  const arrayBuf = await apiRes.arrayBuffer();
  return {
    statusCode: 200,
    headers: { "Content-Type": "image/png" },
    body: Buffer.from(arrayBuf).toString("base64"),
    isBase64Encoded: true,
  };
};
