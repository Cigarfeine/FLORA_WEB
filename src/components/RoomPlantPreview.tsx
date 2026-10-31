import React, { useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, LoaderCircle, Move, RotateCcw, Sparkles, Upload, X } from 'lucide-react';
import type { PlantOption, PotOption } from './PlantPotCustomizer';

interface RoomPlantPreviewProps {
  selectedPlant: PlantOption;
  selectedPot: PotOption;
}

interface Position {
  x: number;
  y: number;
}

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1400;

const getAiEndpoint = (): string => {
  const meta = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  };
  return meta.env?.VITE_AI_PREVIEW_API_URL?.trim() ?? '';
};

const readAsDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not prepare the uploaded image.'));
    };
    reader.onerror = () => reject(new Error('Could not read the uploaded image.'));
    reader.readAsDataURL(blob);
  });

const prepareRoomImage = async (
  file: File
): Promise<{ dataUrl: string; width: number; height: number }> => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Please choose an image smaller than 12 MB.');
  }

  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    bitmap.close();
    throw new Error('Your browser could not prepare this image.');
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error('Image compression failed. Try another photograph.'));
      },
      'image/jpeg',
      0.84
    );
  });

  return { dataUrl: await readAsDataUrl(blob), width, height };
};

export const RoomPlantPreview: React.FC<RoomPlantPreviewProps> = ({
  selectedPlant,
  selectedPot,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [roomImageName, setRoomImageName] = useState('');
  const [imageRatio, setImageRatio] = useState('4 / 3');
  const [position, setPosition] = useState<Position>({ x: 72, y: 72 });
  const [scale, setScale] = useState(34);
  const [rotation, setRotation] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [aiError, setAiError] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    setGeneratedImage(null);
    setAiError('');
  }, [selectedPlant.id, selectedPot.id]);

  const aiEndpoint = getAiEndpoint();
  const canGenerate = Boolean(aiEndpoint && roomImage && !isGenerating);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    setAiError('');
    setGeneratedImage(null);
    setIsPreparing(true);

    try {
      const prepared = await prepareRoomImage(file);
      setRoomImage(prepared.dataUrl);
      setRoomImageName(file.name);
      setImageRatio(prepared.width + ' / ' + prepared.height);
      setPosition({ x: 72, y: 72 });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setIsPreparing(false);
    }
  };

  const updatePointerPosition = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(94, Math.max(6, ((clientY - bounds.top) / bounds.height) * 100));
    setPosition({ x, y });
  };

  const handlePlantPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePlantPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updatePointerPosition(event.clientX, event.clientY);
  };

  const handlePlantPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!roomImage || draggingRef.current) return;
    updatePointerPosition(event.clientX, event.clientY);
    setGeneratedImage(null);
  };

  const resetPlacement = () => {
    setPosition({ x: 72, y: 72 });
    setScale(34);
    setRotation(0);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!aiEndpoint || !roomImage) return;

    setIsGenerating(true);
    setAiError('');
    setGeneratedImage(null);

    try {
      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomImage,
          plantName: selectedPlant.name,
          plantImageUrl: selectedPlant.image,
          potName: selectedPot.name,
          potImageUrl: selectedPot.image,
          placement: {
            x: Math.round(position.x),
            y: Math.round(position.y),
            scale: Math.round(scale),
            rotation: Math.round(rotation),
          },
        }),
      });

      const payload = (await response.json()) as {
        imageDataUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.imageDataUrl) {
        throw new Error(payload.error || 'The AI preview could not be generated.');
      }

      setGeneratedImage(payload.imageDataUrl);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : 'AI preview failed. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'flora-room-preview.jpg';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const clearRoom = () => {
    setRoomImage(null);
    setRoomImageName('');
    setGeneratedImage(null);
    setUploadError('');
    setAiError('');
  };

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-ngen-darkgreen p-5 text-white sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="mb-2 block text-xs font-mono font-bold uppercase tracking-[0.2em] text-ngen-lime">
            New · Room visualizer
          </span>
          <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            See it in your space.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ngen-cream/65">
            Upload a room photo, place your selected botanical, then optionally
            generate an AI-rendered styling preview.
          </p>
        </div>
        {roomImage && (
          <button
            type="button"
            onClick={clearRoom}
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-ngen-cream/75 transition hover:border-white/40 hover:text-white sm:self-auto"
          >
            <X className="h-3.5 w-3.5" />
            Clear photo
          </button>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.75fr)]">
        <div>
          <div
            ref={stageRef}
            onClick={handleStageClick}
            className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/25"
            style={{ aspectRatio: imageRatio, minHeight: roomImage ? undefined : 300 }}
          >
            {roomImage ? (
              <>
                <img
                  src={roomImage}
                  alt="Customer uploaded room"
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Drag to position the plant"
                  onPointerDown={handlePlantPointerDown}
                  onPointerMove={handlePlantPointerMove}
                  onPointerUp={handlePlantPointerUp}
                  onPointerCancel={handlePlantPointerUp}
                  onLostPointerCapture={() => {
                    draggingRef.current = false;
                  }}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => {
                    const step = event.shiftKey ? 5 : 1;
                    if (event.key === 'ArrowLeft') setPosition((current) => ({ ...current, x: Math.max(6, current.x - step) }));
                    if (event.key === 'ArrowRight') setPosition((current) => ({ ...current, x: Math.min(94, current.x + step) }));
                    if (event.key === 'ArrowUp') setPosition((current) => ({ ...current, y: Math.max(6, current.y - step) }));
                    if (event.key === 'ArrowDown') setPosition((current) => ({ ...current, y: Math.min(94, current.y + step) }));
                  }}
                  className="absolute z-10 cursor-grab touch-none active:cursor-grabbing"
                  style={{
                    left: position.x + '%',
                    top: position.y + '%',
                    width: scale + '%',
                    transform: 'translate(-50%, -50%) rotate(' + rotation + 'deg)',
                  }}
                >
                  <img
                    src={selectedPlant.image}
                    alt={selectedPlant.name + ' placement guide'}
                    className="pointer-events-none h-auto w-full select-none object-contain"
                    style={{
                      mixBlendMode: 'multiply',
                      filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.22))',
                    }}
                    draggable={false}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/65 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider text-white">
                    <Move className="mr-1 inline h-3 w-3" />
                    Drag to move
                  </span>
                </div>
                <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/80">
                  Tap a point to reposition
                </span>
              </>
            ) : (
              <div className="flex max-w-sm flex-col items-center px-6 py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                  {isPreparing ? (
                    <LoaderCircle className="h-6 w-6 animate-spin text-ngen-lime" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-ngen-lime" />
                  )}
                </div>
                <p className="font-display text-lg font-bold text-white">
                  {isPreparing ? 'Preparing your photo…' : 'Start with a photo of your space'}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ngen-cream/55">
                  A clear, well-lit room photo gives the best placement preview.
                  Your image is resized in your browser before use.
                </p>
                <button
                  type="button"
                  disabled={isPreparing}
                  onClick={() => inputRef.current?.click()}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-ngen-peach px-5 py-3 text-xs font-bold uppercase tracking-wider text-ngen-charcoal transition hover:bg-ngen-peachHover disabled:cursor-wait disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  Upload room photo
                </button>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="hidden"
            aria-label="Upload a room photograph"
          />

          {uploadError && (
            <p role="alert" className="mt-3 text-xs text-rose-300">
              {uploadError}
            </p>
          )}

          {roomImage && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="max-w-full truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-mono text-ngen-cream/60">
                {roomImageName}
              </span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-ngen-cream/75 transition hover:border-white/35 hover:text-white"
              >
                Replace photo
              </button>
            </div>
          )}
        </div>

        <aside className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ngen-lime">
              Your arrangement
            </span>
            <h4 className="mt-2 font-display text-lg font-bold text-white">
              {selectedPlant.name}
            </h4>
            <p className="mt-1 text-xs text-ngen-cream/55">
              Planter: {selectedPot.name}
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-ngen-cream/45">
              The manual layer uses the catalogue photo as a positioning guide.
              The AI preview uses the plant and planter photos as references to
              create a more natural room visualization.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="flora-plant-scale" className="text-xs font-mono text-ngen-cream/70">
                Plant size
              </label>
              <span className="text-xs font-mono text-ngen-lime">{scale}%</span>
            </div>
            <input
              id="flora-plant-scale"
              type="range"
              min="18"
              max="60"
              value={scale}
              onChange={(event) => {
                setScale(Number(event.target.value));
                setGeneratedImage(null);
              }}
              disabled={!roomImage}
              className="w-full cursor-pointer accent-[#CCE561] disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="flora-plant-rotation" className="text-xs font-mono text-ngen-cream/70">
                Rotation
              </label>
              <span className="text-xs font-mono text-ngen-lime">{rotation}°</span>
            </div>
            <input
              id="flora-plant-rotation"
              type="range"
              min="-25"
              max="25"
              value={rotation}
              onChange={(event) => {
                setRotation(Number(event.target.value));
                setGeneratedImage(null);
              }}
              disabled={!roomImage}
              className="w-full cursor-pointer accent-[#CCE561] disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>

          <button
            type="button"
            onClick={resetPlacement}
            disabled={!roomImage}
            className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-ngen-cream/55 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <RotateCcw className="h-3 w-3" />
            Reset placement
          </button>

          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              title={
                aiEndpoint
                  ? 'Generate an AI room preview'
                  : 'Configure VITE_AI_PREVIEW_API_URL to enable AI generation'
              }
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ngen-lime px-4 py-3.5 text-xs font-black uppercase tracking-wider text-ngen-charcoal transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isGenerating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? 'Creating preview…' : 'Generate AI preview'}
            </button>
            <p className="mt-3 text-[10px] leading-relaxed text-ngen-cream/45">
              {aiEndpoint
                ? 'Your room photo and selected catalogue references are sent to Flora’s configured AI service only when you press this button.'
                : 'AI generation is not configured yet. The manual placement editor works without an AI service.'}
            </p>
            {aiError && (
              <p role="alert" className="mt-3 text-xs leading-relaxed text-rose-300">
                {aiError}
              </p>
            )}
          </div>
        </aside>
      </div>

      {generatedImage && (
        <div className="mt-7 rounded-2xl border border-ngen-lime/25 bg-black/15 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ngen-lime">
                AI result
              </span>
              <h4 className="mt-1 font-display text-lg font-bold text-white">
                Your room, reimagined.
              </h4>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              Download preview
            </button>
          </div>
          <img
            src={generatedImage}
            alt={'AI visualization of ' + selectedPlant.name + ' in ' + selectedPot.name + ' in the uploaded room'}
            className="max-h-[680px] w-full rounded-xl bg-black/20 object-contain"
          />
          <p className="mt-3 text-[10px] leading-relaxed text-ngen-cream/45">
            AI-generated concept image. Plant scale, appearance, shadows and
            colours may differ from the physical products.
          </p>
        </div>
      )}
    </div>
  );
};
