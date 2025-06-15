/*******************************
 *  FULL-AI MEME GENERATOR v2  *
 *  — secure proxy edition —   *
 *******************************/

/* 1 — DOM shortcuts */
const memeOutput = document.getElementById("memeOutput");
const memePrompt = document.getElementById("memePrompt");

/* 2 — Main entry */
export async function generateMeme() {
  const topic = memePrompt.value.trim();
  if (!topic) return alert("Type a meme topic first!");

  // Quick pseudo-AI caption
  const captions = [
    `When ${topic}, but your brain says nope.`,
    `Me after ${topic}`,
    `${topic}? Yeah… that's my villain origin story.`,
    `No one:\nAbsolutely no one:\nMe: ${topic}`,
    `POV: You're ${topic}`,
    `Signs you might be ${topic}…`,
  ];
  const caption = captions[Math.floor(Math.random() * captions.length)];

  // Loading UI
  memeOutput.innerHTML =
    '<p class="text-white text-xl font-mono animate-pulse">🧠 Drawing meme with AI…</p>';

  try {
    /* 3 — Ask Netlify Function → Hugging Face for an image */
    const imgURL = await generateAIImage(
      `Internet meme, white bold Impact font at top, blank space for text, situation: "${topic}", humorous`
    );
    console.log("✅ AI image received:", imgURL);

    /* 4 — Overlay caption */
    const finalURL = await drawCaptionOnImage(imgURL, caption);
    console.log("🖼 Caption drawn");

    /* 5 — Show + download */
    showResult(finalURL);
  } catch (err) {
    console.error(err);
    memeOutput.innerHTML =
      "<p class='text-red-400'>😢 Oops! AI generation failed. Try again.</p>";
  }
}

/* ---------- Call Netlify Function (secure proxy) ---------- */
async function generateAIImage(prompt) {
  const res = await fetch("/.netlify/functions/hf-proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Proxy error ${res.status}: ${txt}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/* ---------- Caption overlay ---------- */
async function drawCaptionOnImage(imgURL, caption) {
  const img    = await loadImage(imgURL);
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

function showResult(url) {
  console.log("📸 Showing final image");
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
