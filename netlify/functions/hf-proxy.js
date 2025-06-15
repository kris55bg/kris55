// netlify/functions/hf-proxy.js
export default async (req, context) => {
  const HF_TOKEN = process.env.HF_TOKEN;
  const body = await req.text();

  const response = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body,
  });

  const blob = await response.blob();

  return new Response(blob, {
    headers: {
      "Content-Type": "image/png"
    }
  });
};
