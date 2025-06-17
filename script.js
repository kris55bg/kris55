<<<<<<< HEAD
// script.js

document.getElementById('generate').addEventListener('click', async () => {
  const promptEl = document.getElementById('prompt');
  const resultEl = document.getElementById('result');
  const prompt = promptEl.value.trim();

  if (!prompt) {
    alert('Please enter a prompt!');
    return;
  }

  // Show loading state
  resultEl.innerHTML = '<p>🧠 Generating image… please wait.</p>';

  try {
    // Call your hidden backend (you'll create this next)
    const res = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error(await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Display the generated image and download link
    resultEl.innerHTML = `
      <img src="${url}" alt="AI result" />
      <a href="${url}" download="ai-image.png" class="download">Download</a>
    `;
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = '<p class="error">⚠️ Error generating image. Try again.</p>';
  }
});
=======
// script.js

document.getElementById('generate').addEventListener('click', async () => {
  const promptEl = document.getElementById('prompt');
  const resultEl = document.getElementById('result');
  const prompt = promptEl.value.trim();

  if (!prompt) {
    alert('Please enter a prompt!');
    return;
  }

  // Show loading state
  resultEl.innerHTML = '<p>🧠 Generating image… please wait.</p>';

  try {
    // Call your hidden backend (you'll create this next)
    const res = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error(await res.text());

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Display the generated image and download link
    resultEl.innerHTML = `
      <img src="${url}" alt="AI result" />
      <a href="${url}" download="ai-image.png" class="download">Download</a>
    `;
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = '<p class="error">⚠️ Error generating image. Try again.</p>';
  }
});
>>>>>>> origin/main
