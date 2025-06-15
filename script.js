/*******************************
 *  FULL-AI MEME GENERATOR v1  *
 *  — token read from env —   *
 *******************************/

/* 1 — Grab token from Vite / Netlify env */
const HF_TOKEN  = import.meta.env.VITE_HF_TOKEN;
const HF_MODEL  = "runwayml/stable-diffusion-v1-5";
const TIMEOUT   = 60_000;

/* 2 — DOM shortcuts */
const memeOutput = document.getElementById("memeOutput");
const memePrompt = document.getElementById("memePrompt");

/* 3 — Main entry */
export async function generateMeme() {
  const topic = memePrompt.value.trim();
  if (!topic) return alert("Type a meme topic first!");

  const captions = [
    `When ${topic}, but your brain says nope.`,
    `Me after ${topic}`,
    `${topic}? Yeah… that's my villain origin story.`,
    `No one:\nAbsolutely no one:\nMe: ${topic}`,
    `POV: You're ${topic}`,
    `Signs you might be ${topic}…`,
  ];
  const caption = captions[Math.floor(Math.random() * captions.length)];

  memeOutput.innerHTML =
    '<p class="text-white text-xl font-mono animate-pulse">🧠 Drawing meme with AI…</p>';

  try {
    const imgURL = await generateAIImage(
      `Internet meme, white bold Impact font at top, blank space for text, situation: "${topic}", humorous`
    );
    console.log("✅ AI Image URL received:", imgURL);

    const finalURL = await drawCaptionOnImage(imgURL, caption);
    console.log("🖼 Drawing text over image");

    showResult(finalURL);
  } catch (err) {
    console.error(err);
    memeOutput.innerHTML =
      "<p class='text-red-400'>😢 Oops! AI generation failed. Try again.</p>";
  }
}

/* ---------- Hugging Face call ---------- */
async function generateAIImage(prompt) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT);

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
      signal: controller.signal,
    }
  );
  clearTimeout(timeoutId);

  if (!res.ok) {
    throw new Error(`HF error: ${res.status} ${await res.text()}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/* ---------- Caption overlay ---------- */
async function drawCaptionOnImage(imgURL, caption) {
  const img   = await loadImage(imgURL);
  const canvas = document.createElement("canvas");
  const ctx    = canvas.getContext("2d");

  canvas.width  = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  ctx.font        = "bold 48px Impact";
  ctx.fillStyle   = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth   = 4;
  ctx.textAlign   = "center";

  const lines = wrapLines(ctx, caption, canvas.width - 60);
  let y = 80;
  for (const line of lines) {
    ctx.strokeText(line, canvas.width / 2, y);
    ctx.fillText(line, canvas.width / 2, y);
    y += 56;
  }
  return canvas.toDataURL("image/png");
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => res(img);
    img.onerror = rej;
    img.src     = src;
  });
}

/* ---------- Helpers ---------- */
function wrapLines(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line.trim());
      line = w + " ";
    } else line = test;
  }
  lines.push(line.trim());
  return lines;
}

/* ---------- NEW: show result ---------- */
function showResult(url) {
  console.log("📸 Showing final image");          // <-- debug line
  memeOutput.innerHTML = "";

  const img = document.createElement("img");
  img.src = url;
  img.className = "rounded-lg shadow-lg";

  const dl = document.createElement("a");
  dl.textContent = "Download meme";
  dl.href = url;
  dl.download = "ai-meme.png";
  dl.className =
    "mt-4 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 inline-block";

  memeOutput.append(img, dl);
}
