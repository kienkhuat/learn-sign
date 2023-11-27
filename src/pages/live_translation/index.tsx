/* eslint-disable @typescript-eslint/no-unsafe-call */
import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Header } from "~/components/Header";
import type { WebcamProps } from "react-webcam";

export default function Live_Translation() {
  const webcamRef = useRef<WebcamProps | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [IsLoadScript, setIsLoadScript] = useState(false);
  const [IsLoadModel, setIsLoadModel] = useState(false);

  useEffect(() => {
    if (IsLoadScript) {
      loadModelHandler();
    }
  }, [IsLoadScript]);

  const loadModelHandler = () => {
    window.roboflow
      .auth({
        publishable_key: process.env.NEXT_PUBLIC_PUBLISHABLE_ROBOFLOW_API_KEY,
      })
      .load({
        model: process.env.NEXT_PUBLIC_PROJECT_URL,
        version: process.env.NEXT_PUBLIC_MODEL_VERSION,
        onMetadata: function (_: any) {
          console.log("model loaded");
          setIsLoadModel(true);
        },
      })
      .then((model: any) => {
        model.configure({
          threshold: 0.4, // độ tin cậy trả kết quả
          overlap: 0.5,
          max_objects: 20,
        });
        setInterval(() => {
          detect(model);
        }, 200); // 5 fps, cứ 200ms detect 1 lần
      });
  };

  const adjustCanvas = (w: number, h: number) => {
    if (canvasRef.current) {
      canvasRef.current.width = w * window.devicePixelRatio;
      canvasRef.current.height = h * window.devicePixelRatio;

      canvasRef.current.style.width = w + "px";
      canvasRef.current.style.height = h + "px";

      canvasRef.current
        .getContext("2d")
        ?.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  };

  const detect = async (model: any) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      // @ts-ignore
      webcamRef.current.video.readyState === 4
    ) {
      // @ts-ignore
      const videoWidth = webcamRef.current.video.videoWidth;
      // @ts-ignore
      const videoHeight = webcamRef.current.video.videoHeight;

      adjustCanvas(videoWidth, videoHeight);
      // @ts-ignore
      const predictions = await model.detect(webcamRef.current.video);
      if (predictions.length !== 0) {
        console.log(predictions);
      }
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      drawBoxes(predictions, ctx);
    }
  };

  const drawBoxes = (
    detections: any[],
    ctx: CanvasRenderingContext2D | null,
  ) => {
    if (!canvasRef.current || !ctx) return;
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    detections.forEach((row: any) => {
      if (true) {
        //video
        const temp = row.bbox;
        temp.class = row.class;
        temp.color = row.color;
        temp.confidence = row.confidence;
        row = temp;
      }

      if (row.confidence < 0) return;

      //dimensions
      const x = row.x - row.width / 2;
      const y = row.y - row.height / 2;
      const w = row.width;
      const h = row.height;

      //box
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = row.color;
      ctx.rect(x, y, w, h);
      ctx.stroke();

      //shade
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.2;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1.0;

      //label
      const fontColor = "black";
      const fontSize = 12;
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      const classTxt = row.class;
      const confTxt = (row.confidence * 100).toFixed().toString() + "%";
      const msgTxt = classTxt + " " + confTxt;
      const textHeight = fontSize;
      let textWidth = ctx.measureText(msgTxt).width;

      if (textHeight <= h && textWidth <= w) {
        ctx.strokeStyle = row.color;
        ctx.fillStyle = row.color;
        ctx.fillRect(
          x - ctx.lineWidth / 2,
          y - textHeight - ctx.lineWidth,
          textWidth + 2,
          textHeight + 1,
        );
        ctx.stroke();
        ctx.fillStyle = fontColor;
        ctx.fillText(msgTxt, x + textWidth / 2 + 1, y - 1);
      } else {
        textWidth = ctx.measureText(confTxt).width;
        ctx.strokeStyle = row.color;
        ctx.fillStyle = row.color;
        ctx.fillRect(
          x - ctx.lineWidth / 2,
          y - textHeight - ctx.lineWidth,
          textWidth + 2,
          textHeight + 1,
        );
        ctx.stroke();
        ctx.fillStyle = fontColor;
        ctx.fillText(confTxt, x + textWidth / 2 + 1, y - 1);
      }
    });
  };

  return (
    <>
      <Script
        onLoad={() => {
          setIsLoadScript(true);
        }}
        src="https://cdn.roboflow.com/0.2.26/roboflow.js"
      ></Script>
      <Head>
        <title>Live Translation</title>
        <meta name="description" content="Live Translation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full">
        <div className="h-full dark:bg-neutral-800">
          <Header />
          <p className="my-10 text-center text-2xl font-medium dark:text-neutral-300">
            Tự động nhận diện ngôn ngữ qua Camera
          </p>
          <div>
            {IsLoadModel ? (
              <>
                <Webcam
                  ref={webcamRef}
                  className="absolute left-0 right-0 z-10 mx-auto text-center"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute left-0 right-0 z-20 mx-auto text-center"
                />
              </>
            ) : (
              <p className="text-center text-2xl font-medium dark:text-neutral-300">
                Đang tải model...
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
