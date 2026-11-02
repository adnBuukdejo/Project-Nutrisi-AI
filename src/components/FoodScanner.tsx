import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { SAMPLE_FOOD_PLATES } from '../data/mockData';
import { FoodAnalysisResult, SampleFoodPlate } from '../types';

interface FoodScannerProps {
  onAnalysisComplete: (result: FoodAnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing,
}) => {
  const [mode, setMode] = useState<'upload' | 'camera' | 'presets'>('presets');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userNote, setUserNote] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scanStepMessage, setScanStepMessage] = useState<string>('Mempersiapkan analisis...');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scanning animation messages
  useEffect(() => {
    if (!isAnalyzing) return;
    const messages = [
      '🔍 NutriBot sedang memeriksa bentuk makanan...',
      '⚖️ Menaksir berat dan takaran porsi piring...',
      '⚡ Menghitung kalori, karbohidrat, dan lemak...',
      '💪 Menganalisis protein penguat otot...',
      '🦸‍♂️ Mengaktifkan analogi superpower tumbuh kembang...',
      '✨ Menyusun tips seru & pertanyaan hari ini...',
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setScanStepMessage(messages[idx]);
    }, 1400);

    return () => clearInterval(timer);
  }, [isAnalyzing]);

  // Start camera stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser.');
      setIsCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode, cameraFacing]);

  // Capture frame from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(dataUrl);
      setMimeType('image/jpeg');
      stopCamera();
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Silakan pilih berkas gambar (JPG, PNG, atau WEBP).');
      return;
    }

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Convert preset URL to base64
  const handleSelectPreset = async (preset: SampleFoodPlate) => {
    try {
      setIsAnalyzing(true);
      setScanStepMessage(`Memuat sampel makanan: ${preset.title}...`);
      // Fetch image and convert to base64
      const response = await fetch(preset.imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setSelectedImage(base64data);
        setMimeType(blob.type || 'image/jpeg');
        executeAnalysis(base64data, blob.type || 'image/jpeg', `Menu sampel: ${preset.title}`);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error('Error loading preset:', err);
      setIsAnalyzing(false);
      setErrorMessage('Gagal memuat preset gambar. Silakan gunakan unggah foto manual.');
    }
  };

  // Send to server API
  const executeAnalysis = async (imgData: string, mime: string, note: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgData,
          mimeType: mime,
          userNote: note,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menganalisis makanan.');
      }

      const result: FoodAnalysisResult = {
        ...json.data,
        id: `scan-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        imageUrl: imgData,
      };

      onAnalysisComplete(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Terjadi gangguan saat memproses gambar dengan NutriBot.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedImage) {
      setErrorMessage('Silakan ambil foto atau unggah gambar makanan terlebih dahulu.');
      return;
    }
    executeAnalysis(selectedImage, mimeType, userNote);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-4 sm:p-6 lg:p-8">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📸</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Fredoka',sans-serif]">
              Detektif Kamera NutriBot
            </h2>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
              Multimodal Vision AI
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ambil foto piring makanmu, buah, atau camilan sehat. NutriBot akan membaca nutrisi dan analogi kekuatan supernya!
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => {
              setMode('presets');
              stopCamera();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'presets'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Piring Siap Uji</span>
          </button>
          <button
            onClick={() => {
              setMode('camera');
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'camera'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Kamera HP</span>
          </button>
          <button
            onClick={() => {
              setMode('upload');
              stopCamera();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'upload'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Unggah Foto</span>
          </button>
        </div>
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Ups! Terjadi Kendala</p>
            <p className="text-xs mt-0.5 text-rose-700">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold text-rose-600 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Mode 1: Presets (Piring Siap Uji) */}
      {mode === 'presets' && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <span>🍽️ Pilih Menu Contoh Populer Anak SMP</span>
              <span className="text-xs font-normal text-slate-500">(1-Klik Langsung Dianalisis)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_FOOD_PLATES.map((plate) => (
              <div
                key={plate.id}
                onClick={() => !isAnalyzing && handleSelectPreset(plate)}
                className="group relative bg-amber-50/50 hover:bg-amber-100/60 rounded-2xl border border-amber-200/90 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  <img
                    src={plate.imageUrl}
                    alt={plate.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {plate.category}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>{plate.nutritionPreview.calories} kkal</span>
                  </div>
                </div>

                <div className="p-3.5">
                  <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {plate.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {plate.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-medium">Porsi: {plate.portion}</span>
                    <span className="font-bold text-emerald-600 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Uji Foto</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Camera Stream */}
      {mode === 'camera' && (
        <div className="mt-6">
          {cameraError ? (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
              <Camera className="w-12 h-12 text-amber-500 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-slate-800">{cameraError}</p>
              <p className="text-xs text-slate-500 mt-1">
                Kamu juga bisa beralih ke tab <strong>Unggah Foto</strong> atau <strong>Piring Siap Uji</strong> di atas.
              </p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Coba Buka Kamera Lagi
              </button>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[16/10] max-h-[460px] flex items-center justify-center border-4 border-amber-300 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/40 m-6 rounded-2xl flex flex-col items-center justify-between p-4">
                <div className="bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full">
                  🎯 Posisikan piring makanan tepat di dalam kotak
                </div>
                <div className="text-center text-white/80 text-xs">
                  Foto dari atas (sudut 90°) memberikan hasil estimasi porsi terbaik
                </div>
              </div>

              {/* Camera Controls */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center space-x-6">
                <button
                  type="button"
                  onClick={() =>
                    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'))
                  }
                  className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all"
                  title="Putar Kamera"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white p-1 ring-4 ring-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center"
                  title="Ambil Foto"
                >
                  <div className="w-full h-full rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">
                    <Camera className="w-7 h-7" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('upload')}
                  className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all"
                  title="Beralih ke Unggah File"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Upload Image */}
      {mode === 'upload' && (
        <div className="mt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-extrabold text-slate-900 text-base">
                Klik atau Tarik Foto Makanan ke Sini
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Mendukung format JPG, PNG, atau WEBP. Foto buah, sayur, sarapan, atau jajanan sehatmu!
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Pilih Berkas dari Galeri / Komputer
              </button>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 max-h-[400px] flex items-center justify-center border-2 border-emerald-200">
              <img
                src={selectedImage}
                alt="Pratinjau Makanan"
                className="max-h-[380px] w-auto object-contain rounded-2xl p-2"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xs transition-all"
              >
                Ganti Foto ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected Image Preview & Action Confirmation (When image is loaded in camera/upload) */}
      {selectedImage && mode !== 'presets' && (
        <div className="mt-6 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-emerald-300">
                <img src={selectedImage} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-sm">Foto Siap Dianalisis</span>
                </div>
                <input
                  type="text"
                  placeholder="Catatan tambahan (opsional: misal 'porsi jumbo' atau 'tanpa kuah')..."
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  className="mt-1 text-xs w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analisis dengan NutriBot!</span>
            </button>
          </div>
        </div>
      )}

      {/* Scanning Radar Overlay Modal / Banner */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-2 border-emerald-400 relative overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Animated Laser Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400 animate-pulse" />

            {/* Mascot Animation */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl animate-bounce">
                🤖
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-lg flex items-center justify-center animate-spin">
                🔍
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 font-['Fredoka',sans-serif]">
              Detektif NutriBot Beraksi!
            </h3>
            <p className="text-sm text-emerald-700 font-bold mt-2 min-h-[3rem] flex items-center justify-center">
              {scanStepMessage}
            </p>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 w-3/4 animate-[pulse_1s_ease-in-out_infinite]" />
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Google Gemini Vision sedang memeriksa vitamin, kalori, dan analogi superpower...
            </p>
          </div>
        </div>
      )}

      {/* Detective Tips for School Kids */}
      <div className="mt-6 p-4 bg-amber-50/70 rounded-2xl border border-amber-200/90 flex items-start space-x-3 text-xs text-slate-700">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-amber-900">Tips Memotret dari NutriBot: </span>
          Ambil foto dengan sudut tegak lurus dari atas (top-down view) dengan pencahayaan ruangan yang terang.
          Sertakan mangkok atau piring sebagai skala perbandingan agar perhitungan porsi lebih akurat!
        </div>
      </div>
    </div>
  );
};
