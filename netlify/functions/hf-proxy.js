// netlify/functions/hf-proxy.js
export const handler = async (event) => {
  const { prompt = "" } = JSON.parse(event.body || "{}");
  if (!prompt) {
    return { statusCode: 400, body: "Prompt missing" };
  }

  const HF_TOKEN = process.env.HF_TOKEN;

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

  const arrayBuf = await apiRes.arrayBuffer();
  return {
    statusCode: 200,
    headers: { "Content-Type": "image/png" },
    body: Buffer.from(arrayBuf).toString("base64"),
    isBase64Encoded: true,
  };
};
