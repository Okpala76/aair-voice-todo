import "dotenv/config";

import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import multer from "multer";

const apiKey = process.env.DEEPGRAM_API_KEY;

if (!apiKey) {
  throw new Error("DEEPGRAM_API_KEY is missing from server/.env");
}

const port = Number(process.env.PORT ?? 3000);

const app = express();

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
    provider: "Deepgram",
    message: "Voice Todo server is running",
  });
});

type DeepgramResponse = {
  results?: {
    channels?: Array<{
      alternatives?: Array<{
        transcript?: string;
        confidence?: number;
      }>;
    }>;
  };
  err_code?: string;
  err_msg?: string;
};

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

      console.log("Received audio:", {
        name: request.file.originalname,
        type: request.file.mimetype,
        size: request.file.size,
      });

      const deepgramResponse = await fetch(
        "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&language=en",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${apiKey}`,
            "Content-Type": request.file.mimetype || "audio/mp4",
          },
          body: request.file.buffer,
        },
      );

      const result = (await deepgramResponse.json()) as DeepgramResponse;

      if (!deepgramResponse.ok) {
        console.error("Deepgram error:", result);

        response.status(deepgramResponse.status).json({
          error: result.err_msg ?? "Deepgram could not transcribe the audio.",
        });

        return;
      }

      const transcript =
        result.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim();

      if (!transcript) {
        response.status(422).json({
          error: "No speech was detected in the recording.",
        });

        return;
      }

      response.json({
        text: transcript,
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
  console.log(`Voice Todo server running on port ${port} using Deepgram`);
});
