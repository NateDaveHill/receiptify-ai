import { useState, useRef, useEffect } from 'react';
import { Camera, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraCaptureProps {
  onImageCaptured: (imageData: string) => void;
  isProcessing?: boolean;
}

export default function CameraCapture({ onImageCaptured, isProcessing = false }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [lastImage, setLastImage] = useState<string>('');
  const [showLastImage, setShowLastImage] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const initCamera = async () => {
    setPermissionRequested(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('Camera access denied. Please grant camera permissions to use this feature.');
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setLastImage(imageData);
      onImageCaptured(imageData);
    }
  };

  const retryCamera = () => {
    setError('');
    setPermissionRequested(false);
  };

  // Show permission request screen
  if (!permissionRequested && !stream) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 flex items-center justify-center p-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-75" />
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            {/* Retro-modern icon */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 rounded-3xl rotate-6 blur-xl opacity-70 animate-pulse" />
              <div className="relative w-full h-full bg-white rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                <Camera className="w-16 h-16 text-transparent bg-gradient-to-br from-violet-600 to-fuchsia-500 bg-clip-text" style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                <Camera className="w-16 h-16 text-fuchsia-500" />
              </div>
            </div>

            {/* Title with retro gradient */}
            <div className="space-y-3">
              <h1 className="text-5xl font-black text-white drop-shadow-lg tracking-tight">
                Receiptify
                <span className="block text-3xl font-bold bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mt-1">
                  For Your Kitchen
                </span>
              </h1>
              <p className="text-white/90 text-lg font-medium px-4">
                Turn ingredients into instant recipe magic ✨
              </p>
            </div>
          </div>

          {/* Modern card with glassmorphism */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg">Camera Access</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              We'll scan your ingredients and create personalized recipes. Your photos are never stored — just processed in real-time! 🔒
            </p>
          </div>

          {/* CTA Button with retro vibes */}
          <button
            onClick={initCamera}
            className="group w-full h-16 bg-white text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-all active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <span className="relative bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>
              Let's Cook! 🍳
            </span>
          </button>

          {/* Retro dots decoration */}
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/60" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Camera Access Required</h2>
          </div>
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
          <Button onClick={retryCamera} className="w-full bg-white text-slate-900 hover:bg-slate-100">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (showLastImage && lastImage) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col">
        <div className="flex-1 relative">
          <img src={lastImage} alt="Last capture" className="w-full h-full object-contain" />
          <Button
            onClick={() => setShowLastImage(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="p-6 bg-gradient-to-t from-black/90 to-transparent">
          <Button
            onClick={() => {
              setShowLastImage(false);
              onImageCaptured(lastImage);
            }}
            className="w-full bg-white text-slate-900 hover:bg-slate-100 h-14 text-lg font-semibold"
          >
            Use This Image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay UI with modern gradients */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top gradient with color */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/60 to-transparent" />

          {/* Bottom gradient with vibrant touch */}
          <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* Retro scanning frame with gradient border */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="relative w-full max-w-sm aspect-square">
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 opacity-60 blur-sm" />
              <div className="absolute inset-[2px] rounded-3xl bg-black/20 backdrop-blur-sm" />

              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
              <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
              <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
              <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2 px-4">
                  <p className="text-white font-bold text-sm tracking-wide drop-shadow-lg">
                    Position ingredients here
                  </p>
                  <div className="flex justify-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse delay-75" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse delay-150" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header with modern styling */}
        <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white drop-shadow-lg tracking-tight">
                Receiptify
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 animate-pulse" />
                <p className="text-xs font-medium text-white/90">Scan Mode Active</p>
              </div>
            </div>
            {lastImage && (
              <button
                onClick={() => setShowLastImage(true)}
                className="group w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/40 hover:border-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <img src={lastImage} alt="Last" className="w-full h-full object-cover" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls with modern design */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-6">
            {lastImage && (
              <button
                onClick={() => setShowLastImage(true)}
                className="w-14 h-14 rounded-2xl border-2 border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
              >
                <ImageIcon className="w-6 h-6" />
              </button>
            )}

            {/* Main capture button with gradient */}
            <button
              onClick={captureImage}
              disabled={isProcessing}
              className="relative group w-20 h-20 disabled:opacity-50"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:scale-105 group-active:scale-95 transition-transform">
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-fuchsia-500" />
                )}
              </div>
            </button>

            {!lastImage && <div className="w-14" />}
          </div>

          <p className="text-center text-white/80 text-sm font-medium drop-shadow">
            Tap to capture your ingredients ✨
          </p>
        </div>
      </div>
    </div>
  );
}