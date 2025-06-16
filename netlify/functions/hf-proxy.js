// netlify/functions/hf-proxy.js
export const handler = async (event) => {
  try {
    /* 1. read prompt from POST body */
    const { prompt = "" } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, body: "Prompt missing" };
    }

    /* 2. secret token from Netlify env */
    const HF_TOKEN = process.env.HF_TOKEN;

    /* 3. forward to Hugging Face */
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

    /* 4. return raw PNG (base64) */
    const buf = Buffer.from(await apiRes.arrayBuffer());
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: buf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
