{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 exports.handler = async (event) => \{\
  const \{ image, mimeType \} = JSON.parse(event.body);\
  const response = await fetch("https://api.anthropic.com/v1/messages", \{\
    method: "POST",\
    headers: \{\
      "Content-Type": "application/json",\
      "x-api-key": process.env.CLAUDEKEY,\
      "anthropic-version": "2023-06-01",\
    \},\
    body: JSON.stringify(\{\
      model: "claude-haiku-4-5-20251001",\
      max_tokens: 300,\
      messages: [\{\
        role: "user",\
        content: [\
          \{ type: "image", source: \{ type: "base64", media_type: mimeType, data: image \} \},\
          \{ type: "text", text: `Analyser kvitteringen og svar KUN med JSON: \{"beskrivelse": "Butikknavn", "amount": 123, "category": "mat"\} Kategori m\'e5 v\'e6re: mat, transport, fritid, eller annet.` \}\
        ]\
      \}]\
    \})\
  \});\
  const data = await response.json();\
  return \{ statusCode: 200, body: JSON.stringify(data) \};\
\};}