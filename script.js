// --------------------------
//  Simple AI-feel meme maker
// --------------------------

const memeOutput = document.getElementById("memeOutput");
const memePrompt = document.getElementById("memePrompt");

// List any images you put inside /assets
const memeImages = [
  "assets/drake.jpg",
  "assets/distracted-boyfriend.jpg",
  "assets/gru.jpg",
  "assets/crying-cat.jpg"
];

// MAIN entry — called by button
function generateMeme() {
  const topic = memePrompt.value.trim();
  if (!topic) {
    alert("Type a meme topic first!");
    return;
  }

  // ---------- “AI” caption factory ----------
  const captions = [
    `When ${topic}, but your brain says nope.`,
    `Me after ${topic}`,
    `${topic}? Yeah… that's my villain origin story.`,
    `No one:\nAbsolutely no one:\nMe: ${topic}`,
    `POV: You're ${topic}`,
    `Signs you might be ${topic}…`
  ];
  const caption = captions[Math.floor(Math.random() * captions.length)];

  // ---------- Fake loading ----------
  memeOutput.innerHTML =
    '<p class="text-white text-xl font-mono animate-pulse">🧠 Generating meme…</p>';

  // 1.5-second delay to feel like “processing”
  setTimeout(() => {
    renderMeme(caption);
  }, 1500);
}

// Draw the meme on a canvas and show download btn
function renderMeme(caption) {
  const imgSrc = memeImages[Math.floor(Math.random() * memeImages.length)];
  const img = new Image();
  img.src = imgSrc;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx     = canvas.getContext("2d");

    canvas.width  = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Caption style
    ctx.font         = "bold 36px Impact";
    ctx.fillStyle    = "white";
    ctx.strokeStyle  = "black";
    ctx.lineWidth    = 3;
    ctx.textAlign    = "center";

    // Wrap caption onto multiple lines
    const lines = splitLines(ctx, caption, canvas.width - 40);
    let y = 50;
    for (const line of lines) {
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
      y += 42;
    }

    // Show result + download
    memeOutput.innerHTML = "";
    memeOutput.appendChild(canvas);

    const dl = document.createElement("a");
    dl.textContent = "Download meme";
    dl.className   = "mt-4 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700";
    dl.href        = canvas.toDataURL();
    dl.download    = "meme.png";
    memeOutput.appendChild(dl);
  };
}

// Utility: break long text into multiple lines
function splitLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim());
      line = w + " ";
    } else {
      line = test;
    }
  }
  lines.push(line.trim());
  return lines;
}
