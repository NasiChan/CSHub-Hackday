import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult, EventType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseSyllabus = async (
  base64Data: string, 
  mimeType: string
): Promise<ExtractionResult> => {
  try {
    const modelId = 'gemini-2.5-flash'; 
    
    // We strictly define the schema to ensure consistent JSON output
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: `Analyze this syllabus document. 
            Extract the course name and all significant dates such as exams, quizzes, assignments, project deadlines, and holidays.
            Ignore regular weekly class schedules (like "every Monday").
            Focus on specific dates.
            Format dates strictly as YYYY-MM-DD.
            Infer the year from context if missing (assume current or upcoming academic year).
            Classify each event into one of these types: EXAM, QUIZ, ASSIGNMENT, PROJECT, HOLIDAY, OTHER.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courseName: { type: Type.STRING, description: "Name of the course, e.g. 'CS 101'" },
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title of the event" },
                  date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
                  time: { type: Type.STRING, description: "Time of event if available, else empty" },
                  type: { 
                    type: Type.STRING, 
                    enum: [
                      EventType.EXAM, 
                      EventType.QUIZ, 
                      EventType.ASSIGNMENT, 
                      EventType.PROJECT, 
                      EventType.HOLIDAY, 
                      EventType.OTHER
                    ] 
                  },
                  description: { type: Type.STRING, description: "Any extra details" }
                },
                required: ["title", "date", "type"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as ExtractionResult;
    
    // Post-process to add IDs
    const eventsWithIds = (data.events || []).map(e => ({
      ...e,
      id: crypto.randomUUID(),
      // Fallback for missing type if model hallucinates (unlikely with enum schema but safe)
      type: Object.values(EventType).includes(e.type as EventType) ? e.type : EventType.OTHER
    }));

    return {
      courseName: data.courseName || "Unknown Course",
      events: eventsWithIds
    };

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
