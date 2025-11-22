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
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">AI Recipe Finder</h2>
            <p className="text-slate-300 text-lg">
              Scan your ingredients with your camera to discover amazing recipes
            </p>
          </div>
          <div className="space-y-4 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera Access Required
            </h3>
            <p className="text-slate-400 text-sm">
              We need access to your camera to scan and identify ingredients. Your photos are processed securely and never stored.
            </p>
          </div>
          <Button 
            onClick={initCamera} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold"
          >
            Enable Camera
          </Button>
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

        {/* Overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Scanning frame */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-full max-w-md aspect-square border-2 border-white/30 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-3xl" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Recipe Finder</h1>
              <p className="text-sm text-white/80 mt-1">Scan your ingredients</p>
            </div>
            {lastImage && (
              <button
                onClick={() => setShowLastImage(true)}
                className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/50 hover:border-white transition-colors"
              >
                <img src={lastImage} alt="Last" className="w-full h-full object-cover" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center justify-center gap-4">
          {lastImage && (
            <Button
              onClick={() => setShowLastImage(true)}
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white"
            >
              <ImageIcon className="w-6 h-6" />
            </Button>
          )}
          
          <Button
            onClick={captureImage}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-white hover:bg-slate-100 text-slate-900 shadow-xl disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Camera className="w-8 h-8" />
            )}
          </Button>

          <div className="w-14" />
        </div>
        
        <p className="text-center text-white/60 text-sm mt-4">
          Position ingredients within the frame and tap to capture
        </p>
      </div>
    </div>
  );
}