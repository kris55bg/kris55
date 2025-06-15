export async function handler(event) {
  const { prompt } = JSON.parse(event.body || "{}");

  if (!prompt) {
    return { statusCode: 400, body: "No prompt supplied" };
  }

  const res = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    return { statusCode: res.status, body: txt };
  }

  const arrayBuf = await res.arrayBuffer();

  return {
    statusCode: 200,
    headers: { "Content-Type": "image/png" },
    body: Buffer.from(arrayBuf).toString("base64"),
    isBase64Encoded: true,
  };
}
