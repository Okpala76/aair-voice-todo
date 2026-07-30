import "dotenv/config";

import cors from "cors";
import express, {
  type ErrorRequestHandler,
} from "express";
import multer from "multer";
import OpenAI, { toFile } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "OPENAI_API_KEY is missing from server/.env",
  );
}

const port = Number(process.env.PORT ?? 3000);

const app = express();
const openai = new OpenAI({ apiKey });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    message: "Voice Todo server is running",
  });
});

app.post(
  "/api/transcribe",
  upload.single("audio"),
  async (request, response, next) => {
    try {
      if (!request.file) {
        response.status(400).json({
          error: "An audio file is required.",
        });

        return;
      }

      const audioFile = await toFile(
        request.file.buffer,
        request.file.originalname || "recording.m4a",
        {
          type:
            request.file.mimetype ||
            "audio/m4a",
        },
      );

      const transcription =
        await openai.audio.transcriptions.create({
          file: audioFile,
          model: "gpt-4o-mini-transcribe",
        });

      response.json({
        text: transcription.text,
      });
    } catch (error: unknown) {
      next(error);
    }
  },
);

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error("Server error:", error);

  if (error instanceof multer.MulterError) {
    response.status(400).json({
      error: error.message,
    });

    return;
  }

  response.status(500).json({
    error: "The audio could not be transcribed.",
  });
};

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Voice Todo server running on port ${port}`,
  );
});