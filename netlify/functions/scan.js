exports.handler = async (event) => {
  const { image, mimeType } = JSON.parse(event.body);
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDEKEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: image } },
          { type: "text", text: `Analyser kvitteringen og svar KUN med JSON: {"beskrivelse": "Butikknavn", "amount": 123, "category": "mat"} Kategori må være: mat, transport, fritid, eller annet.` }
        ]
      }]
    })
  });
  const data = await response.json();
  return { statusCode: 200, body: JSON.stringify(data) };
};
