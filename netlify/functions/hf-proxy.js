export default async (req, res) => {
  const HF_TOKEN = process.env.VITE_HF_TOKEN;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    }
  );

  const arrayBuffer = await response.arrayBuffer();
  res.status(response.status).setHeader("Content-Type", "image/png").send(Buffer.from(arrayBuffer));
};
