"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import React, { useEffect, useRef, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

type Props = {
  videoUrl?: any;
  onClose: () => void;
  ffmpegRef: FFmpeg;
  onCutVideo: (value: any) => void;
};

export default function CutVideo({
  videoUrl,
  onClose,
  ffmpegRef,
  onCutVideo,
}: Props) {
  const [canReady, setCanReady] = useState(false);
  const [progressCut, setProgressCut] = useState(0);
  const [loadingTrim, setLoadingTrim] = useState(false);

  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const contentTrimRef = useRef<HTMLDivElement | null>(null);
  const lineProgresRight = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!videoPlayerRef.current) return;
    const videoPlayer = videoPlayerRef.current;
    const contentSecLeft = document.querySelector(
      ".contentSec"
    ) as HTMLDivElement;
    const contentSecRigth = document.querySelector(
      ".contentSecRigth"
    ) as HTMLDivElement;
    const timeSecondsTxt = document.getElementById("timeSecondsTxt")!;
    const videoFileInput = document.getElementById(
      "videoFile"
    ) as HTMLInputElement;
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const startTimeInput = document.getElementById(
      "startTime"
    ) as HTMLInputElement;
    const endTimeInput = document.getElementById("endTime") as HTMLInputElement;
    const timeline = document.getElementById("timeline");
    videoPlayer.src = videoUrl;
    videoPlayer.addEventListener("loadedmetadata", function () {
      onClearCanvas();
      generateFilmstrip();
    });
    videoFileInput?.addEventListener("change", function () {
      const file = this.files![0];
      const videoURL = URL.createObjectURL(file);
      videoPlayer!.src = videoURL;
    });

    async function generateFilmstrip() {
      const numFrames = 10; // Número de frames en el filmstrip
      const duration = videoPlayer.duration;
      console.log(duration);

      const interval = duration / numFrames;
      console.log(duration);

      const containerUpload = document.getElementById("containerUpload")!;
      const tempRi = parseFloat(
        getComputedStyle(containerUpload).paddingRight.replace("px", "")
      );
      const templeft = parseFloat(
        getComputedStyle(containerUpload).paddingLeft.replace("px", "")
      );

      const timelineWidth =
        timelineRef.current!.offsetWidth - (tempRi + templeft);
      const withd = timelineWidth / duration;

      console.log("WIDTHTIMELINE", timelineWidth, withd);

      cursorRef.current!.style.width = `${withd}px`;
      for (let i = 0; i < duration; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = withd; // Ancho del frame
        canvas.height = 60; // Alto del frame
        const ctx = canvas.getContext("2d");

        // Establecer el tiempo del video para capturar el fotograma
        videoPlayer.currentTime = i;

        // Esperar a que el video se actualice al fotograma deseado
        await new Promise((res) => {
          const temPhA = () => {
            ctx?.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
            videoPlayer.removeEventListener("seeked", temPhA);
            res(true);
          };
          videoPlayer.addEventListener("seeked", temPhA, { once: true });
        });
        // { once: true } asegura que el evento se dispare solo una vez

        timeline?.appendChild(canvas);
        ctx?.closePath();
      }
      videoPlayer.currentTime = 0;
      setCanReady(true);
    }

    playButton?.addEventListener("click", function () {
      videoPlayer.play();
    });

    pauseButton?.addEventListener("click", function () {
      videoPlayer.pause();
    });

    startTimeInput?.addEventListener("input", function () {
      videoPlayer.currentTime = parseFloat(this.value);
    });

    endTimeInput?.addEventListener("input", function () {
      videoPlayer.currentTime = parseFloat(this.value);
    });

    // trimButton?.addEventListener("click", function () {
    //   const startTime = parseFloat(startTimeInput.value);
    //   const endTime = parseFloat(endTimeInput.value);
    //   videoPlayer.currentTime = startTime;
    //   videoPlayer.play();

    //   setTimeout(function () {
    //     videoPlayer.pause();
    //     videoPlayer.currentTime = endTime;
    //   }, (endTime - startTime) * 1000);
    // });

    const contenedor = document.getElementById("timeline");
    const lineaProgresoIzquierda = document.getElementById("lineaProgresoLeft");
    const lineaProgresoDerecha = document.getElementById("lineaProgresoRigth");
    let isMouseDownLeft = false;
    let isMouseDownRight = false;

    // Manejar el movimiento de la línea de progreso izquierda
    lineaProgresoIzquierda!.addEventListener("mousedown", function (event) {
      isMouseDownLeft = true;
      isMouseDownRight = false;
      handleLineMovement(event, lineaProgresoIzquierda!, true);
    });

    // Manejar el movimiento de la línea de progreso derecha
    lineaProgresoDerecha!.addEventListener("mousedown", function (event) {
      isMouseDownLeft = false;
      isMouseDownRight = true;
      handleLineMovement(event, lineaProgresoDerecha!, false);
    });

    // Función para manejar el movimiento de la línea de progreso
    function handleLineMovement(
      event: MouseEvent,
      lineaProgreso: HTMLElement,
      isLeft: boolean
    ) {
      const initialMouseX = event.clientX;
      const initialLineX = isLeft
        ? lineaProgreso.offsetLeft
        : contenedor!.offsetWidth -
          lineaProgreso.offsetWidth -
          lineaProgreso.offsetLeft;

      const contenedorWidth = contenedor!.offsetWidth;
      const lineaProgresoWidth = lineaProgreso.offsetWidth;
      const isInitialPost = isLeft
        ? lineaProgresoIzquierda!.offsetLeft <= 10
        : lineaProgresoDerecha?.offsetLeft == contenedorWidth;
      if (isInitialPost) {
        // contentTrimRef.current!.style.width = contenedorWidth + "px";
      }
      const contentWithTrim = contentTrimRef.current!.offsetWidth;
      document.addEventListener("mousemove", function (event) {
        if (isLeft ? isMouseDownLeft : isMouseDownRight) {
          const displacement = event.clientX - initialMouseX;
          let newPosition = isLeft
            ? initialLineX + displacement
            : initialLineX - displacement;

          // Limitar la posición dentro del contenedor
          newPosition = Math.max(0, newPosition); // No mover más allá del borde izquierdo
          newPosition = Math.min(
            contenedorWidth - lineaProgresoWidth,
            newPosition
          ); // No mover más allá del borde derecho

          lineaProgreso.style[isLeft ? "left" : "right"] = newPosition + "px";

          // Ajustar el ancho del contenedor en función de la posición de la línea
          // contenedor!.style.width = (contenedorWidth - newPosition) + 'px';
          const x1 = lineaProgresoIzquierda!.offsetLeft;
          const x2 =
            contenedorWidth -
            lineaProgresoDerecha!.offsetWidth -
            lineaProgresoDerecha!.offsetLeft;

          const withNew = isLeft
            ? contenedorWidth - x1 - x2
            : contenedorWidth - x2 - x1;

          contentTrimRef.current!.style.width = withNew + "px";
          contentTrimRef.current!.style[isLeft ? "left" : "right"] =
            newPosition + "px";

          // Convertir la posición de la línea a un porcentaje del ancho del contenedor
          const positionPercentage = newPosition / contenedorWidth;

          // Ajustar el tiempo del video en función del porcentaje
          const newTime = positionPercentage * videoPlayer.duration;
          videoPlayer.currentTime = isLeft
            ? newTime
            : videoPlayer.duration - newTime;

          const duracionTotalVideo = videoPlayer.duration;

          // Obtener las posiciones de las líneas de progreso
          const posicionLineaIzquierda = lineaProgresoIzquierda!.offsetLeft;

          const positionPercentageLefth =
            posicionLineaIzquierda / contenedorWidth;

          const newTimeLeft = positionPercentageLefth * videoPlayer.duration;

          const posicionLineaDerecha =
            contenedorWidth -
            lineaProgresoDerecha!.offsetWidth -
            lineaProgresoDerecha!.offsetLeft;
          const positionPercentageRigth =
            posicionLineaDerecha / contenedorWidth;
          const newTimeRigth = positionPercentageRigth * duracionTotalVideo;
          const duracionSeleccionadaEnTiempo =
            videoPlayer.duration - newTimeLeft - newTimeRigth;

          contentSecLeft.innerText = `${formatTime(
            parseFloat(newTimeLeft.toFixed(0))
          )}`;

          contentSecRigth.innerText = `${formatTime(
            parseFloat((duracionTotalVideo - newTimeRigth).toFixed(0))
          )}`;

          timeSecondsTxt.innerText = `${formatTime(
            parseFloat(duracionSeleccionadaEnTiempo.toFixed(0))
          )}`;
        }
      });

      document.addEventListener(
        "mouseup",
        function () {
          if (isLeft) {
            isMouseDownLeft = false;
            isMouseDownRight = false;
          } else {
            isMouseDownRight = false;
            isMouseDownLeft = false;
          }
        },
        { once: true }
      );
    }
  }, []);

  function formatTime(sec: number) {
    const min = Math.floor(sec / 60);
    const secondsRest = sec % 60;
    const minFormat = min < 10 ? "0" + min : min;
    const secondFormt = secondsRest < 10 ? "0" + secondsRest : secondsRest;

    return minFormat + ":" + secondFormt;
  }

  const onSeekedVideo = () => {
    if (!canReady) return;
    const timelineWidth = timelineRef.current!.offsetWidth;
    const wiuth = timelineWidth / videoPlayerRef.current!.duration;
    // cursorRef.current!.style.left = `${post}px`;
    // Obtener el progreso actual del video en porcentaje
    const progress =
      (videoPlayerRef.current!.currentTime / videoPlayerRef.current!.duration) *
      100;

    // Calcular la nueva posición de la línea de progreso
    const frameWidth = wiuth; // Ancho de cada fotograma en el timeline
    const newPosition = (timelineWidth * progress) / 100 - frameWidth / 2;

    // Mover la línea de progreso a la nueva posición
    cursorRef.current!.style.left = newPosition - 10 + "px";
    const videoDuration = videoPlayerRef.current!.duration;
    const continerWith = timelineWidth;
    const positionRigth =
      continerWith -
      lineProgresRight.current!.offsetWidth -
      lineProgresRight.current!.offsetLeft;
    const positionPercentageRigth = positionRigth / continerWith;
    const timeRigth = videoDuration - positionPercentageRigth * videoDuration;
    console.log(videoPlayerRef.current?.currentTime, timeRigth);

    if (videoPlayerRef.current!.currentTime >= timeRigth) {
      videoPlayerRef.current?.pause();
    }
  };
  const onClearCanvas = () => {
    const temp = [...(timelineRef.current!.childNodes as any)];
    for (const iterator of temp) {
      if (iterator.nodeName.toLowerCase().includes("div")) continue;
      iterator.remove();
    }
  };
  const onTrim = async () => {
    try {
      setProgressCut(0);
      setLoadingTrim(true);
      const contenedorWidth = timelineRef.current!.offsetWidth;
      const positionLeft =
        document.getElementById("lineaProgresoLeft")!.offsetLeft;
      const lineaProgreso = document.getElementById("lineaProgresoRigth")!;
      const positionRigth =
        contenedorWidth - lineaProgreso.offsetWidth - lineaProgreso.offsetLeft;
      // Convertir la posición de la línea a un porcentaje del ancho del contenedor
      const videoDuration = videoPlayerRef.current!.duration;
      const positionPercentage = positionLeft / contenedorWidth;
      const positionPercentageRigth = positionRigth / contenedorWidth;

      // Ajustar el tiempo del video en función del porcentaje
      const timeLEft = positionPercentage * videoDuration;
      const timeRigth = videoDuration - positionPercentageRigth * videoDuration;

      const ffmpeg = ffmpegRef;

      ffmpeg.on("progress", ({ progress, time }) => {
        const t = `${progress * 100} % (transcoded time: ${time / 1000000} s)`;
        setProgressCut(progress * 100);
        console.log("[PROGRESSS]", t);
      });

      await ffmpeg.writeFile(
        "input.webm",
        await fetchFile(`${videoPlayerRef.current?.src}`)
      );
      await ffmpeg.exec([
        "-i",
        "input.webm",
        "-ss",
        timeLEft.toString(),
        "-to",
        timeRigth.toString(),
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4");
      onCutVideo(data);
      setLoadingTrim(false);
    } catch (error) {
      setLoadingTrim(false);
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      <div className="absolute w-full h-full bg-white rounded-lg shadow-sm z-[40]">
        <div className="w-full h-[70%] relative">
          <video
            ref={videoPlayerRef}
            onTimeUpdate={onSeekedVideo}
            width="100%"
            height="50%"
            id="videoPlayer"
            controls
          ></video>
          {loadingTrim && (
            <div className="w-full h-full bg-black/80 absolute top-0 rounded-lg flex flex-col items-center justify-center">
              <span className="text-white">Processing video please wait.</span>
              <span className="text-white text-3xl">
                {progressCut.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div
          style={{ pointerEvents: loadingTrim ? "none" : "auto" }}
          ref={timelineRef}
          id="timeline"
        >
          <div ref={cursorRef} className="cursors"></div>
          <div className="line" id="lineaProgresoLeft">
            <div className="contentIcon">
              <div className="contentSec"></div>
            </div>
          </div>
          <div ref={lineProgresRight} className="line" id="lineaProgresoRigth">
            <div className="contentIcon">
              <div className="contentSecRigth"></div>
            </div>
          </div>
          <div ref={contentTrimRef} className="contentTrim">
            <span id="timeSecondsTxt"></span>
          </div>
        </div>
        <div className="w-full h-[5%] flex items-center justify-end gap-6">
          <button
            disabled={loadingTrim}
            onClick={onClose}
            type="button"
            className="bg-black rounded-sm px-2 py-2 text-white"
          >
            Cancel
          </button>
          <button
            onClick={onTrim}
            disabled={loadingTrim}
            type="button"
            className="bg-colorRojo rounded-sm px-2 py-2 text-white"
          >
            {loadingTrim ? (
              <BiLoaderCircle className="animate-spin" size={18} />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
      {!canReady && (
        <div className="w-full h-full absolute top-0 bg-black/80 rounded-lg shadow-sm shadow-white flex flex-col items-center justify-center z-[40]">
          <BiLoaderCircle className="animate-spin" size={100} color="#fff" />
          <span className="text-white">Loading please wait. </span>
        </div>
      )}
    </>
  );
}
