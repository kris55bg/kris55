const memeOutput = document.getElementById("memeOutput");
const memePrompt = document.getElementById("memePrompt");

const memeImages = [
  "assets/drake.jpg",
  "assets/distracted-boyfriend.jpg",
  "assets/gru.jpg",
  "assets/crying-cat.jpg"
];

function generateMeme() {
  const prompt = memePrompt.value.trim();
  if (!prompt) {
    alert("Type something funny first!");
    return;
  }

  const imgSrc = memeImages[Math.floor(Math.random() * memeImages.length)];
  const img = new Image();
  img.src = imgSrc;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    // basic “Impact”-style caption
    ctx.font = "bold 36px Impact";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "center";

    const lines = splitLines(ctx, prompt, canvas.width - 40);
    let y = 50;
    for (const line of lines) {
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
      y += 42;
    }

    // Show result + download link
    memeOutput.innerHTML = "";
    memeOutput.appendChild(canvas);

    const dlBtn = document.createElement("a");
    dlBtn.textContent = "Download meme";
    dlBtn.className =
      "mt-4 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700";
    dlBtn.href = canvas.toDataURL();
    dlBtn.download = "meme.png";
    memeOutput.appendChild(dlBtn);
  };
}

// helper – wrap text
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
