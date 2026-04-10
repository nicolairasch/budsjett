exports.handler = async (event) => {
  try {
    const { image, mimeType, userId } = JSON.parse(event.body);
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      "https://vaivnbwpatdxvgirhrht.supabase.co",
      process.env.SUPABASE_SERVICE_KEY
    );

    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    const ext = mimeType.includes("jpeg") ? "jpg" : "png";
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("kvitteringer")
      .upload(path, buffer, { contentType: mimeType });

    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

    return { statusCode: 200, body: JSON.stringify({ path }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
