import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", system: "Masar HR System" });
  });

  // AI HR Assistant Endpoint using Gemini API
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: "مفتاح GEMINI_API_KEY غير متوفر في متغيرات البيئة.",
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `أنت مساعد الذكاء الاصطناعي للموارد البشرية وإدارة الموظفين في "نظام مسار الإداري".
تتحدث باللغة العربية بأسلوب مهني ومحترف، وتساعد المدراء والموظفين في:
1. كتابة وصياغة التعاميم والتبليغات الإدارية الرسمية.
2. تلخيص وتحليل مبررات طلبات الإجازات والاستئذان.
3. الإجابة على استفسارات الموارد البشرية وفق أنظمة العمل (مثل حساب مكافأة نهاية الخدمة، حقوق الإجازات، وساعات العمل).
4. تقديم اقتراحات لتحسين بيئة العمل ومتابعة أداء الموظفين.

اجعل إجاباتك منسقة، واضحة، ومستندة لقواعد العمل المهنية باللغة العربية.`;

      const fullPrompt = context
        ? `السياق/البيانات: ${context}\n\nطلب المستخدم: ${prompt}`
        : prompt;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in AI Assistant endpoint:", error);
      return res.status(500).json({
        error: "حدث خطأ أثناء الاتصال بالمساعد الذكي.",
        details: error?.message || String(error),
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[مسار] يعمل السيرفر بنجاح على http://localhost:${PORT}`);
  });
}

startServer();
