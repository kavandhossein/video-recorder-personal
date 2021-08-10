import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import VideoRecorder from "react-video-recorder";
import CountdownTimer from "react-component-countdown-timer";
import { osName } from "react-device-detect";

export const Recorder = ({
  setVideo,
  time = 10000,
  classes = {
    others: {
      webcam: "",
      button: "",
    },
    ios: {
      webcam: "",
      error: "",
    },
    count: "",
  },
  CustomCountDown = (
    <CountdownTimer
      className={classes.count}
      count={time / 1000}
      hideDay
      hideHours
      backgroundColor={"inherit"}
      color={"inherit"}
    />
  ),
}) => {
  const [preview, setPreview] = useState(document.getElementById("preview"));
  const [videoWebCam, setVideoWebCam] = useState(
    document.getElementById("videoWebCam")
  );
  const [state, setState] = useState(1);
  const [showButton, setShowButton] = useState(true);
  const [showButtonReset, setShowButtonReset] = useState(false);

  useEffect(() => {
    setPreview(document.getElementById("preview"));
    setVideoWebCam(document.getElementById("videoWebCam"));
  }, []);

  const handleStopVideo = () => {
    setState(2);
    setShowButtonReset(true);
  };

  const handleResetVideo = () => {
    setVideo("");
    setShowButton(true);
    setShowButtonReset(false);
    setState(1);
  };

  const handleStart = () => {
    setShowButton(false);
    const sUsrAg = navigator.userAgent;
    let videoStream;
    if (sUsrAg.indexOf("Firefox") > -1) {
      videoStream = videoWebCam.mozCaptureStream();
    } else {
      videoStream = videoWebCam.captureStream();
    }
    let mediaRecorder = new MediaRecorder(videoStream);
    let chunks = [];
    mediaRecorder.onvideodataavailable = function (e) {
      chunks.push(e.data);
    };
    mediaRecorder.onstop = function (e) {
      var blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];
      var videoURL = URL.createObjectURL(blob);
      console.log(preview);
      preview.src = videoURL;
      setVideo(blob);
    };
    mediaRecorder.start();
    setTimeout(() => {
      handleStopVideo();
      mediaRecorder.stop();
    }, [time]);
  };

  let iosMessage = (message) => {
    return <div className={classes.ios.error}>{message}</div>;
  };

  return (
    <>
      {/* {osName !== "iOS" ? ( */}
      <div className="w-100">
        <Webcam
          id="videoWebCam"
          mirrored={true}
          audio={false}
          // style={state === 1 ? { display: "block" } : { display: "none" }}
          mirrored="true"
          screenshotFormat="image/jpeg"
          className={classes.others.webcam || ""}
        />
        <video
          // style={state === 2 ? { display: "block" } : { display: "none" }}
          id="preview"
          autoPlay
          muted
          loop
          className={classes.others.webcam || ""}
        ></video>
        {showButton ? (
          <button onClick={handleStart} className={classes.others.button || ""}>
            ضبط ویدیو
          </button>
        ) : showButtonReset ? (
          <button
            onClick={handleResetVideo}
            className={classes.others.button || ""}
          >
            ضبط دوباره فیلم
          </button>
        ) : (
          <>{CustomCountDown}</>
        )}
      </div>
      {/* ) : ( */}
      {/* <>
          <VideoRecorder
            renderLoadingView={() => {
              return iosMessage("لطفا صبر نمایید ...");
            }}
            renderUnsupportedView={() => {
              return iosMessage("مرورگر شما از دوربین پشتیبانی نمی کند!");
            }}
            t={(e) => {
              if (e === "Turn my camera ON") {
                return iosMessage("فعال کردن دوربین");
              }
              if (e === "Use another video") {
                return iosMessage("یک بار دیگر ضبط کنید");
              }
              if (e === "REC") {
                return iosMessage("ضبط نمایید");
              }
            }}
            renderErrorView={() => {
              return iosMessage("لطفا به مرورگر خود دسترسی دوربین را بدهید");
            }}
            className={classes.ios.webcam || ""}
            timeLimit={time}
            onRecordingComplete={(videoBlob) => {
              const file = new File([videoBlob], "video.mp4", {
                type: "mp4",
              });
              setVideo(file);
            }}
          />
        </>
      )} */}
    </>
  );
};