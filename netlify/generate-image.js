HEAD
// netlify/functions/generate-image.js
import fetch from 'node-fetch';

export default async function handler(event) {
  const { prompt } = JSON.parse(event.body);
  if (!prompt) return { statusCode: 400, body: "No prompt" };

  const H = process.env.STABLE_HORDE_KEY;
  if (!H) return { statusCode: 500, body: "Missing Horde key" };

  try {
    // enqueue a quick job
    const enqueue = await fetch("https://stablehorde.net/api/v2/generate/quick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Horde-Key": H
      },
      body: JSON.stringify({
        prompt,
        params: { steps: 28, cfg_scale: 7, width: 512, height: 512, sampler_name: "k_euler" },
        censor_nsfw: false
      })
    });
    if (!enqueue.ok) throw new Error(await enqueue.text());
    const { id } = await enqueue.json();

    // poll until result is ready
    let result, tries = 0;
    do {
      await new Promise(r => setTimeout(r, 2000));
      result = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`, {
        headers: { "Horde-Key": H }
      }).then(r => r.json());
      tries++;
    } while (!result?.generations?.length && tries < 15);

    if (!result?.generations?.length) throw new Error("Timeout");

    const b64 = result.generations[0].img;             // base64 PNG
    const image = Buffer.from(b64, "base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: image.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}

import fetch from 'node-fetch';

export default async function handler(event) {
  const { prompt } = JSON.parse(event.body);
  if (!prompt) return { statusCode: 400, body: "No prompt" };

  const H = process.env.STABLE_HORDE_KEY;
  if (!H) return { statusCode: 500, body: "Missing Horde key" };

  try {
    // enqueue a quick job
    const enqueue = await fetch("https://stablehorde.net/api/v2/generate/quick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Horde-Key": H
      },
      body: JSON.stringify({
        prompt,
        params: { steps: 28, cfg_scale: 7, width: 512, height: 512, sampler_name: "k_euler" },
        censor_nsfw: false
      })
    });
    if (!enqueue.ok) throw new Error(await enqueue.text());
    const { id } = await enqueue.json();

    // poll until result is ready
    let result, tries = 0;
    do {
      await new Promise(r => setTimeout(r, 2000));
      result = await fetch(`https://stablehorde.net/api/v2/generate/status/${id}`, {
        headers: { "Horde-Key": H }
      }).then(r => r.json());
      tries++;
    } while (!result?.generations?.length && tries < 15);

    if (!result?.generations?.length) throw new Error("Timeout");

    const b64 = result.generations[0].img;             // base64 PNG
    const image = Buffer.from(b64, "base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png" },
      body: image.toString("base64"),
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}