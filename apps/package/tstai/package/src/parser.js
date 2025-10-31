import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();  

function getOpenAIClient(apiKey = null) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is required. Set it via --api-key option, environment variable, or .env file");
  }
  return new OpenAI({ apiKey: key });
}

export async function parseInstruction(instruction, apiKey = null) {
  const client = getOpenAIClient(apiKey);
  const completion = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that converts natural language instructions into JSON test plans for API testing."
      },
      {
        role: "user",
        content: `
          Convert this natural language instruction into a JSON test plan.
          ${instruction}

          Return ONLY a valid JSON object in this exact format:
          {
            "method": "GET|POST|PUT|DELETE",
            "endpoint": "/path",
            "payload": { ... },
            "expected_status": 200
          }

          Do not include any other text, explanations, or markdown formatting. Just the JSON object.
        `
      }
    ],
    temperature: 0.1
  });

  try {
    const responseText = completion.choices[0].message.content;
    
    // Try to extract JSON from the response if it's wrapped in markdown or other text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse AI output:", error.message);
    console.error("Raw response:", completion.choices[0].message.content);
    throw new Error("Failed to parse AI output into JSON");
  }
}
