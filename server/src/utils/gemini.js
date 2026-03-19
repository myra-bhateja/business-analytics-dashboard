export async function generateWithGemini(prompt) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("GEMINI RAW:", JSON.stringify(data, null, 2)); // ✅ HERE, inside try

    if (!response.ok) throw new Error("2.5 not available");

    return data?.candidates?.[0]?.content?.parts?.[0]?.text;

  } catch (err) {
    console.log("⚠️ Falling back to Gemini 1.5", err.message);

    const fallback = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await fallback.json();
    console.log("GEMINI FALLBACK RAW:", JSON.stringify(data, null, 2)); // ✅ and HERE

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
  }
}