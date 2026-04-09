exports.handler = async (event) => {
  try {
    const { image, mimeType, text, type } = JSON.parse(event.body);

    let userContent;

    if (type === "statement") {
      userContent = [
        { type: "text", text: `Analyser denne kontoutskriften og svar KUN med JSON-array (ingen annen tekst):
[{"beskrivelse": "Butikknavn", "amount": 123.50, "category": "mat", "date": "2026-04-01"}]
Kategori må være én av: mat, transport, fritid, annet
Beløp skal være positivt tall. Ta kun med utgifter, ikke innskudd.
Dato i format YYYY-MM-DD.
Kontoutskrift:\n${text}` }
      ];
    } else {
      userContent = [
        { type: "image", source: { type: "base64", media_type: mimeType, data: image } },
        { type: "text", text: `Analyser denne kvitteringen og svar KUN med JSON (ingen annen tekst):
{"beskrivelse": "Butikknavn eller beskrivelse", "amount": 123, "category": "mat"}
Kategori må være én av: mat, transport, fritid, annet
Beløp skal være totalsum som et tall uten valuta.` }
      ];
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDEKEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
        messages: [{ role: "user", content: userContent }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
