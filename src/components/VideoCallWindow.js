// src/components/VideoCallWindow.js
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "@mediapipe/camera_utils";
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";


const VideoCallWindow = ({
  onBack,
  contact,
  callType = "video",
  onEndCall,
  minimized, // controlled
  onMinimize, // controlled callback
  error
}) => {

  const [showError, setShowError] = useState(false);

useEffect(() => {
  if (error) {
    setShowError(true);
    const timer = setTimeout(() => {
      setShowError(false);
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [error]);

  // controlled vs internal minimized
  const isControlled = typeof minimized !== "undefined";
  const [internalMinimized, setInternalMinimized] = useState(false);
  const isMin = isControlled ? minimized : internalMinimized;
  const setMin = (val) => {
    if (isControlled) {
      onMinimize && onMinimize(val);
    } else {
      setInternalMinimized(val);
    }
  };

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === "video");
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState("none"); // preset key or dataURL
  const [callDuration, setCallDuration] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const handleMaximize = () => setMin(false);

  const localVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const segInstanceRef = useRef(null);
  const cameraRef = useRef(null);
  const loadedBackgroundRef = useRef(null); // ✨ NEW: Ref to hold the loaded background image element

  // Realistic-ish preset backgrounds
  const backgroundImages = {
    office:
      "data:image/svg+xml;base64," +
      btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><filter id='b'><feGaussianBlur stdDeviation='12' /></filter><path fill='#8693a2' d='M0 0h800v600H0z'/><g filter='url(#b)' transform='translate(1.5 1.5) scale(3.125)' fill-opacity='.5'><ellipse fill='#fff' rx='1' ry='1' transform='matrix(-23.2 55.4 -103.2 -43.2 136 21)'/><ellipse fill='#d5e1ee' rx='1' ry='1' transform='matrix(-13.7 13.4 -21.4 -21.8 198.8 128.5)'/><path fill='#000c21' d='M232 126l-31 29 55 12z'/><ellipse fill='#fff' cx='64' cy='146' rx='34' ry='15'/><ellipse fill='#2b3b4f' cx='222' cy='18' rx='255' ry='37'/><ellipse fill='#fff' rx='1' ry='1' transform='matrix(-47.3 12.8 -18.2 -67.4 92 84.6)'/><path fill='#e9f1f8' d='M23.3 54.4l34.4-1.2 12.3 22.3-34.4 1.2z'/><path fill='#5a6d83' d='M107 192l-42-53-7 55z'/></g></svg>`
      ),
    beach:
      "data:image/svg+xml;base64," +
      btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='a' x1='50%' x2='50%' y1='0%' y2='100%'><stop offset='0%' stop-color='#87CEEB'/><stop offset='100%' stop-color='#4682B4'/></linearGradient><linearGradient id='b' x1='50%' x2='50%' y1='0%' y2='100%'><stop offset='0%' stop-color='#F0E68C'/><stop offset='100%' stop-color='#CD853F'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#a)'/><rect y='450' width='100%' height='150' fill='url(#b)'/><circle cx='700' cy='100' r='50' fill='#FFD700' opacity='0.8'/><path d='M-10 470 Q 150 440, 300 470 T 600 470 T 900 470' stroke='#FFF' stroke-width='2' fill='none' opacity='0.5'/><path d='M-10 490 Q 120 460, 280 490 T 580 490 T 880 490' stroke='#FFF' stroke-width='2' fill='none' opacity='0.4'/></svg>`
      ),
    space:
      "data:image/svg+xml;base64," +
      btoa(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><radialGradient id='g' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='rgba(100, 120, 255, 0.4)'/><stop offset='100%' stop-color='rgba(10, 10, 30, 0)'/></radialGradient></defs><rect width='100%' height='100%' fill='#0a0a1e'/><circle cx='50%' cy='50%' r='300' fill='url(#g)'/><g fill='#fff'><circle cx='100' cy='100' r='1.5' opacity='0.8'/><circle cx='650' cy='450' r='1.5' opacity='0.9'/><circle cx='230' cy='320' r='0.5' opacity='0.6'/><circle cx='720' cy='90' r='1' opacity='0.7'/><circle cx='400' cy='500' r='1' opacity='0.5'/><circle cx='50' cy='550' r='1.2' opacity='0.9'/><circle cx='750' cy='300' r='0.8' opacity='0.8'/></g></svg>`
      ),
    forest:
        "data:image/svg+xml;base64," +
        btoa(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#a2d0f0'/><stop offset='100%' stop-color='#e0f2ff'/></linearGradient><filter id='blur'><feGaussianBlur stdDeviation='5'/></filter></defs><rect width='800' height='600' fill='url(#sky)'/><g filter='url(#blur)' opacity='0.7'><path d='M-50 600 C 100 400, 200 550, 400 450 C 600 350, 700 500, 850 400 L 850 600 Z' fill='#228B22'/><path d='M-50 600 C 150 450, 250 580, 450 500 C 650 420, 750 520, 850 450 L 850 600 Z' fill='#006400'/></g><g opacity='0.9'><path d='M50 600 L 100 300 L 150 600 Z' fill='#2E8B57'/><path d='M150 600 L 200 250 L 250 600 Z' fill='#3CB371'/><path d='M600 600 L 650 200 L 700 600 Z' fill='#2E8B57'/></g></svg>`
        ),
  };
  
  // ✨ NEW: Effect to load the background image whenever it changes
  useEffect(() => {
    if (selectedBackground && selectedBackground !== "none") {
      const img = new Image();
      // Determine the source from presets or a data URL
      img.src = selectedBackground.startsWith("data:image")
        ? selectedBackground
        : backgroundImages[selectedBackground];
      
      // Once loaded, store the image element in our ref
      img.onload = () => {
        loadedBackgroundRef.current = img;
      };
      img.onerror = () => {
        // Handle error if image fails to load
        loadedBackgroundRef.current = null;
      }
    } else {
      // If no background, clear the ref
      loadedBackgroundRef.current = null;
    }
    // This effect runs only when the user picks a new background
  }, [selectedBackground]);


  // init segmentation (MediaPipe)
  useEffect(() => {
    segInstanceRef.current = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    const seg = segInstanceRef.current;
    seg.setOptions({
      modelSelection: 1, 
      selfieMode: true,
    });

    seg.onResults(onSegResults);

    return () => {
      if (seg) {
        try {
          seg.close && seg.close();
        } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🎨 CHANGED: Simplified 'onSegResults' to use the pre-loaded image
  const onSegResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const video = localVideoRef.current;
    const mask = results.segmentationMask;
    if (!video || !mask) return;
    
    // Match canvas dimensions to video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Use an offscreen canvas for compositing
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offCtx = offscreenCanvas.getContext("2d");
    
    // Step 1: Draw the segmentation mask to the offscreen canvas
    offCtx.drawImage(mask, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Step 2: Use "source-in" to clip the video to the mask shape (keeps only the person)
    offCtx.globalCompositeOperation = "source-in";
    offCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // Now, let's draw to the main, visible canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Step 3: Draw the pre-loaded background image first (if it exists)
    if (loadedBackgroundRef.current) {
        ctx.drawImage(loadedBackgroundRef.current, 0, 0, canvas.width, canvas.height);
    } else {
        // Optional: draw a solid color if no background is selected, e.g., black
        // ctx.fillStyle = "#000000";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Step 4: Draw the person (from the offscreen canvas) on top of the background
    ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
};


  // media initialization
  useEffect(() => {
    let runningCamera = null;
    let localStream = null;

    const start = async () => {
      try {
        if (callType === "video" || isVideoOn) {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
            audio: { echoCancellation: true, noiseSuppression: true },
          });
        } else {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: { echoCancellation: true, noiseSuppression: true },
          });
        }

        setMediaStream(localStream);

        const v = localVideoRef.current;
        if (v) {
          v.srcObject = localStream;
          v.play().catch(() => {});
        }

        if (segInstanceRef.current && localVideoRef.current && localStream.getVideoTracks().length > 0) {
          runningCamera = new Camera(localVideoRef.current, {
            onFrame: async () => {
              try {
                if(localVideoRef.current.readyState >= 3) { // Ensure video is ready
                   await segInstanceRef.current.send({ image: localVideoRef.current });
                }
              } catch (e) { /* ignore frame errors */ }
            },
            width: 1280,
            height: 720,
          });
          runningCamera.start();
          cameraRef.current = runningCamera;
        }

        setTimeout(() => setIsConnecting(false), 1000);
      } catch (err) {
        console.error("media init error", err);
        alert(`Could not access ${callType === "video" ? "camera + mic" : "microphone"}. Check permissions.`);
        setIsConnecting(false);
      }
    };

    start();

    return () => {
      try {
        if (runningCamera) {
          runningCamera.stop && runningCamera.stop();
        }
      } catch (e) {}
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
      }
      setMediaStream(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callType, isVideoOn]);

  // call timer
  useEffect(() => {
    if (!isConnecting) {
      const t = setInterval(() => setCallDuration((s) => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [isConnecting]);

  // toggle mute
  const toggleMute = () => {
    if (!mediaStream) {
      setIsMuted((s) => !s);
      return;
    }
    const audioTrack = mediaStream.getAudioTracks()?.[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  // toggle camera
  const toggleVideo = async () => {
     if (callType === "audio" && !isVideoOn) {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });
        if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
        setMediaStream(newStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
          localVideoRef.current.play().catch(() => {});
        }
        setIsVideoOn(true);
      } catch (err) {
        console.error(err);
        alert("Could not enable camera.");
      }
    } else if (mediaStream) {
      const v = mediaStream.getVideoTracks()?.[0];
      if (v) {
        v.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      } else {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
            audio: true,
          });
          if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
          setMediaStream(newStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = newStream;
            localVideoRef.current.play().catch(() => {});
          }
          setIsVideoOn(true);
        } catch (err) {
          console.error(err);
          alert("Could not enable camera.");
        }
      }
    }
  };

  const handleEnd = () => {
    if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    onEndCall && onEndCall();
  };

  const onPiPClick = () => setMin(false);
  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // UI
  // ✨ REPLACE YOUR ENTIRE RETURN BLOCK WITH THIS ✨
  return (
    <div
      className={`fixed ${isMin ? "bottom-4 right-4 w-44 h-40" : "inset-0"} bg-black z-50 rounded-lg overflow-hidden shadow-2xl`}
      style={{ transition: "all .18s ease" }}
    >
      {/* minimized PiP */}
      {isMin ? (
        <button
          onClick={handleMaximize} // Use the correct handler
          className="w-full h-full p-1 flex items-center justify-center bg-black/60 text-white focus:outline-none"
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-1">{contact?.avatar}</div>
            <div className="text-xs">{contact?.name}</div>
          </div>
        </button>
      ) : (
        // full / large UI
        <>
          <div className="w-full h-full relative bg-black">
            
            {/* ==================== FIX #1: THE MAIN DISPLAY LOGIC ==================== */}
            {/* This condition now ONLY checks if isVideoOn is true. */}
            {isVideoOn ? (
              <>
                {/* This is the video view with the canvas */}
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="hidden"
                />
              </>
            ) : (
              // This is the audio-only view with the avatar
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
                <div className="text-center">
                  <div className="text-6xl mb-3">{contact?.avatar}</div>
                  <h2 className="text-2xl font-light mb-1">{contact?.name}</h2>
                  <p className="text-sm">
                    {isConnecting ? "Connecting..." : `Connected • ${formatDuration(callDuration)}`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Conditional remote user and status text */}
            {isVideoOn && ( // This also now correctly depends only on isVideoOn
                 <>
                    <div className="absolute bottom-52 right-4 w-36 h-28 rounded-lg overflow-hidden border-2 border-white shadow-lg flex flex-col items-center justify-center bg-black/70 text-white">
                      <div className="text-2xl">{contact?.avatar || "👤"}</div>
                      <p className="text-xs mt-1">{contact?.name || "Remote User"}</p>
                    </div>

                    <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-center text-white">
                      <p className="text-sm">
                        {isConnecting ? "Connecting..." : `Connected • ${formatDuration(callDuration)}`}
                      </p>
                    </div>
                 </>
            )}

            {showError && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30">
                <div className="text-white px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-medium text-white">{error}</p>
                </div>
              </div>
            )}
            
            {/* background picker overlay */}
            {showBackgrounds && isVideoOn && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
                <div className="flex w-64 flex-wrap justify-center gap-2 rounded-lg bg-gray-800 p-3 text-white shadow-lg">
                   <button
                        onClick={() => {
                          setSelectedBackground("none");
                          setShowBackgrounds(false);
                        }}
                        className={`px-3 py-1 rounded ${
                          selectedBackground === "none"
                            ? "bg-green-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        None
                    </button>
                  {Object.keys(backgroundImages).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedBackground(key);
                        setShowBackgrounds(false);
                      }}
                      className={`px-3 py-1 rounded capitalize ${
                        selectedBackground === key
                          ? "bg-green-600"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {key}
                    </button>
                  ))}

                  <label className="px-3 py-1 rounded bg-gray-700 cursor-pointer">
                    Add
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const r = new FileReader();
                        r.onload = (ev) => {
                          setSelectedBackground(ev.target.result);
                          setShowBackgrounds(false);
                        };
                        r.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Back arrow (minimize) */}
            <button
              onClick={onBack}
              className="absolute top-4 left-4 z-20 p-2 bg-black/30 rounded-full backdrop-blur"
              title="Minimize (go back)"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex justify-center space-x-5">
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isMuted ? "bg-red-500" : "bg-white/10"
                  }`}
                >
                  {isMuted ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    !isVideoOn ? "bg-red-500" : "bg-white/10"
                  }`}
                >
                  {isVideoOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>
                
                {/* ==================== FIX #2: THE BACKGROUND BUTTON LOGIC ==================== */}
                {/* This condition also now ONLY checks if isVideoOn is true. */}
                {isVideoOn && (
                  <button
                    onClick={() => setShowBackgrounds((s) => !s)}
                    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <span className="text-lg">🎨</span>
                  </button>
                )}

                <button
                  onClick={handleEnd}
                  className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>

                <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCallWindow;