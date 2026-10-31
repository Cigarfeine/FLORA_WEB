'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Check,
  Layers,
  SunMedium,
  Droplets,
  Upload,
  RotateCcw,
  Download,
  Sparkles,
  Move,
  ZoomIn,
  RefreshCw,
  FlipHorizontal,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import {
  loadTransparentAsset,
  renderRoomComposition,
  generateSampleRoomDataUrl,
  SAMPLE_ROOM_PRESETS,
  PlacementTransform,
  ComputedPlantPotBounds,
} from '../utils/transparentAssets';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PlantOption {
  id: string;
  catalogId: string;
  name: string;
  scientificName: string;
  price: number;
  image: string;
  cutoutUrl: string;
  light: string;
  water: string;
  vibe: string;
}

interface PotOption {
  id: string;
  catalogId: string;
  name: string;
  colorName: string;
  colorHex: string;
  price: number;
  image: string;
  cutoutUrl: string;
  material: string;
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const PLANT_OPTIONS: PlantOption[] = [
  {
    id: 'monstera',
    catalogId: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    price: 480,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/plants/monstera.svg',
    light: 'Bright, filtered light',
    water: 'Weekly watering',
    vibe: 'Tropical lush foliage with distinctive split leaf fenestrations',
  },
  {
    id: 'fiddle',
    catalogId: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    price: 690,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/plants/fiddle.svg',
    light: 'Bright indirect sunlight',
    water: 'When top 2 inches dry',
    vibe: 'Architectural violin-shaped statement indoor tree',
  },
  {
    id: 'snake',
    catalogId: 'snake-plant-laurentii',
    name: 'Golden Snake Plant',
    scientificName: 'Dracaena trifasciata',
    price: 340,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/plants/snake.svg',
    light: 'Tolerates low to bright light',
    water: 'Every 2–3 weeks',
    vibe: 'Upright gold-margined sword leaves, resilient air purifier',
  },
  {
    id: 'bonsai',
    catalogId: 'japanese-juniper-bonsai',
    name: 'Japanese Juniper Bonsai',
    scientificName: 'Juniperus procumbens',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/plants/bonsai.svg',
    light: 'Bright morning light',
    water: 'Keep damp with daily mist',
    vibe: 'Sculptural Zen specimen with 4-year wire-trained canopy',
  },
  {
    id: 'peace-lily',
    catalogId: 'spotted-spathiphyllum',
    name: 'Spotted Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    price: 350,
    image: 'https://static.wixstatic.com/media/d244c7_bb7f4cb4208e47bb8fd327efce5bf552~mv2.jpg',
    cutoutUrl: './assets/cutouts/plants/peace-lily.svg',
    light: 'Low to medium indirect',
    water: 'Twice weekly moisture',
    vibe: 'Variegated glossy foliage crowned with crisp white spathes',
  },
  {
    id: 'areca-palm',
    catalogId: 'luxury-faux-areca-palm',
    name: 'Tropical Areca Palm',
    scientificName: 'Dypsis lutescens',
    price: 890,
    image: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/plants/areca-palm.svg',
    light: 'Bright filtered light',
    water: 'Weekly deep soak',
    vibe: 'Graceful arching feather fronds for expansive Kerala living spaces',
  },
];

const POT_OPTIONS: PotOption[] = [
  {
    id: 'jaguar-grey',
    catalogId: 'jaguar-cool-pot',
    name: 'Jaguar Cool Pot with Tray',
    colorName: 'Grey Marble',
    colorHex: '#94a3b8',
    price: 600,
    image: 'https://static.wixstatic.com/media/d244c7_583c4b692b7f4e6983aba5f9a2d5cc9f~mv2.png',
    cutoutUrl: './assets/cutouts/pots/jaguar-grey.svg',
    material: 'Polymer composite marble',
  },
  {
    id: 'terracotta-ribbed',
    catalogId: 'ribbed-ceramic-urn',
    name: 'Nordic Fluted Urn',
    colorName: 'Warm Terracotta',
    colorHex: '#c47754',
    price: 790,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/pots/terracotta-ribbed.svg',
    material: 'Hand-thrown porous clay',
  },
  {
    id: 'ivory-fiber',
    catalogId: 'fluted-fiber-planter-large',
    name: 'Grand Fluted Planter',
    colorName: 'Matte Ivory',
    colorHex: '#eae3d2',
    price: 1350,
    image: 'https://static.wixstatic.com/media/d244c7_eaa01238ee8749179d20f5b65043b0bb~mv2.jpg',
    cutoutUrl: './assets/cutouts/pots/ivory-fiber.svg',
    material: 'Fiberglass composite',
  },
  {
    id: 'charcoal-basin',
    catalogId: 'charcoal-basin',
    name: 'Zen Ceramic Shallow Basin',
    colorName: 'Charcoal Matte',
    colorHex: '#334155',
    price: 550,
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80',
    cutoutUrl: './assets/cutouts/pots/charcoal-basin.svg',
    material: 'High-fire stoneware',
  },
];

const DEFAULT_STUDIO_TRANSFORM: PlacementTransform = {
  x: 0.5,
  y: 0.84,
  scale: 1.05,
  rotation: 0,
  flipX: false,
  shadowIntensity: 0.65,
};

type DragInteractionMode = 'none' | 'move' | 'scale' | 'rotate';

// ─────────────────────────────────────────────
// Framer Motion Variants
// ─────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const springCfg = { type: 'spring', stiffness: 260, damping: 28 } as const;

// ─────────────────────────────────────────────
// Micro-components (isolated for perf)
// ─────────────────────────────────────────────

const BreathingDot = React.memo(() => (
  <motion.span
    className="inline-block w-1.5 h-1.5 rounded-full bg-ngen-lime shrink-0"
    animate={{ scale: [1, 1.65, 1], opacity: [0.9, 0.35, 0.9] }}
    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
  />
));
BreathingDot.displayName = 'BreathingDot';

const ShimmerBar = React.memo(({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
));
ShimmerBar.displayName = 'ShimmerBar';

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export const PlantPotCustomizer: React.FC = () => {
  const { addItem } = useCart();
  const [selectedPlant, setSelectedPlant] = useState<PlantOption>(PLANT_OPTIONS[0]);
  const [selectedPot, setSelectedPot] = useState<PotOption>(POT_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);

  const [visualizerMode, setVisualizerMode] = useState<'studio' | 'room'>('studio');
  const [roomImageElement, setRoomImageElement] = useState<HTMLImageElement | null>(null);
  const [roomPhotoDataUrl, setRoomPhotoDataUrl] = useState<string | null>(null);
  const [roomSourceLabel, setRoomSourceLabel] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const [plantAsset, setPlantAsset] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [potAsset, setPotAsset] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);

  const [transform, setTransform] = useState<PlacementTransform>(DEFAULT_STUDIO_TRANSFORM);
  const [isCanvasSelected, setIsCanvasSelected] = useState<boolean>(true);

  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiPreviewDataUrl, setAiPreviewDataUrl] = useState<string | null>(null);
  const [showAiPreview, setShowAiPreview] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<{
    type: 'info' | 'warning' | 'success';
    text: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastBoundsRef = useRef<ComputedPlantPotBounds | null>(null);
  const dragStateRef = useRef<{
    mode: DragInteractionMode;
    startPointerX: number;
    startPointerY: number;
    initialTransform: PlacementTransform;
    initialDistance: number;
    initialAngle: number;
  }>({
    mode: 'none',
    startPointerX: 0,
    startPointerY: 0,
    initialTransform: DEFAULT_STUDIO_TRANSFORM,
    initialDistance: 100,
    initialAngle: 0,
  });

  const rawTotal = selectedPlant.price + selectedPot.price;
  const comboDiscount = Math.round(rawTotal * 0.1);
  const finalComboPrice = rawTotal - comboDiscount;

  // ── Asset Loading ─────────────────────────
  useEffect(() => {
    let cancelled = false;
    loadTransparentAsset({
      id: selectedPlant.id,
      cutoutUrl: selectedPlant.cutoutUrl,
      fallbackImageUrl: selectedPlant.image,
      type: 'plant',
    }).then((asset) => { if (!cancelled) setPlantAsset(asset); });
    return () => { cancelled = true; };
  }, [selectedPlant]);

  useEffect(() => {
    let cancelled = false;
    loadTransparentAsset({
      id: selectedPot.id,
      cutoutUrl: selectedPot.cutoutUrl,
      fallbackImageUrl: selectedPot.image,
      type: 'pot',
    }).then((asset) => { if (!cancelled) setPotAsset(asset); });
    return () => { cancelled = true; };
  }, [selectedPot]);

  useEffect(() => {
    if (aiPreviewDataUrl) setShowAiPreview(false);
  }, [selectedPlant.id, selectedPot.id]);

  // ── Canvas Redraw ─────────────────────────
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = renderRoomComposition({
      canvas,
      roomImage: roomImageElement,
      plantAsset,
      potAsset,
      transform,
      showHandles: visualizerMode === 'room' && isCanvasSelected,
      isSelected: isCanvasSelected,
      studioBackground: visualizerMode === 'studio' || !roomImageElement,
    });
    lastBoundsRef.current = bounds;
  }, [roomImageElement, plantAsset, potAsset, transform, visualizerMode, isCanvasSelected]);

  useEffect(() => { redrawCanvas(); }, [redrawCanvas]);

  // ── Room Helpers ──────────────────────────
  const applyRoomDataUrl = useCallback(
    (dataUrl: string, label: string, initialPlacement?: PlacementTransform, presetId: string | null = null) => {
      const img = new Image();
      img.onload = () => {
        setRoomImageElement(img);
        setRoomPhotoDataUrl(dataUrl);
        setRoomSourceLabel(label);
        setActivePresetId(presetId);
        setVisualizerMode('room');
        setUploadError(null);
        setAiPreviewDataUrl(null);
        setShowAiPreview(false);
        setAiStatusMessage(null);
        setIsCanvasSelected(true);
        setTransform(initialPlacement ?? { x: 0.52, y: 0.82, scale: 0.95, rotation: 0, flipX: false, shadowIntensity: 0.65 });
      };
      img.onerror = () => setUploadError('Could not decode image. Please try another JPG, PNG, or WebP photo.');
      img.src = dataUrl;
    },
    []
  );

  const processUploadedFile = (file: File) => {
    setUploadError(null);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Unsupported format. Please upload JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10 MB. Please choose a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const tmpImg = new Image();
        tmpImg.onload = () => {
          const maxEdge = 1600;
          let w = tmpImg.naturalWidth || 1280;
          let h = tmpImg.naturalHeight || 960;
          if (w > maxEdge || h > maxEdge) {
            if (w > h) { h = Math.round((h * maxEdge) / w); w = maxEdge; }
            else { w = Math.round((w * maxEdge) / h); h = maxEdge; }
          }
          const nc = document.createElement('canvas');
          nc.width = w; nc.height = h;
          const nCtx = nc.getContext('2d');
          if (nCtx) {
            nCtx.drawImage(tmpImg, 0, 0, w, h);
            applyRoomDataUrl(nc.toDataURL('image/jpeg', 0.9), file.name, undefined, null);
          } else {
            applyRoomDataUrl(reader.result as string, file.name, undefined, null);
          }
        };
        tmpImg.src = reader.result;
      }
    };
    reader.onerror = () => setUploadError('Failed to read the selected file.');
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
    e.target.value = '';
  };

  const handleLoadSamplePreset = (presetId: string) => {
    const preset = SAMPLE_ROOM_PRESETS.find((p) => p.id === presetId) || SAMPLE_ROOM_PRESETS[0];
    applyRoomDataUrl(generateSampleRoomDataUrl(preset.id), preset.name, preset.defaultPlacement, preset.id);
  };

  const handleResetPlacement = () => {
    if (visualizerMode === 'room' && activePresetId) {
      const preset = SAMPLE_ROOM_PRESETS.find((p) => p.id === activePresetId);
      if (preset) { setTransform(preset.defaultPlacement); return; }
    }
    setTransform(
      visualizerMode === 'room'
        ? { x: 0.52, y: 0.82, scale: 0.95, rotation: 0, flipX: false, shadowIntensity: 0.65 }
        : DEFAULT_STUDIO_TRANSFORM
    );
  };

  const handleRemoveRoomPhoto = () => {
    setRoomImageElement(null); setRoomPhotoDataUrl(null);
    setRoomSourceLabel(''); setActivePresetId(null);
    setVisualizerMode('studio'); setAiPreviewDataUrl(null);
    setShowAiPreview(false); setAiStatusMessage(null);
    setTransform(DEFAULT_STUDIO_TRANSFORM);
  };

  // ── Canvas Pointer ────────────────────────
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const bounds = lastBoundsRef.current;
    if (!canvas || !bounds) return;
    if (showAiPreview) setShowAiPreview(false);
    const pt = getCanvasPoint(e);

    const distRotate = Math.hypot(pt.x - bounds.rotateHandleX, pt.y - bounds.rotateHandleY);
    if (visualizerMode === 'room' && distRotate <= 24) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsCanvasSelected(true);
      dragStateRef.current = { mode: 'rotate', startPointerX: pt.x, startPointerY: pt.y, initialTransform: { ...transform }, initialDistance: 100, initialAngle: Math.atan2(pt.y - bounds.centerY, pt.x - bounds.centerX) };
      return;
    }

    const distScale = Math.hypot(pt.x - bounds.scaleHandleX, pt.y - bounds.scaleHandleY);
    if (visualizerMode === 'room' && distScale <= 24) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsCanvasSelected(true);
      dragStateRef.current = { mode: 'scale', startPointerX: pt.x, startPointerY: pt.y, initialTransform: { ...transform }, initialDistance: Math.max(20, Math.hypot(pt.x - bounds.centerX, pt.y - bounds.centerY)), initialAngle: 0 };
      return;
    }

    const insideBody = Math.abs(pt.x - bounds.centerX) <= bounds.totalWidth / 2 + 24 && Math.abs(pt.y - bounds.centerY) <= bounds.totalHeight / 2 + 24;
    if (insideBody || visualizerMode === 'room') {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsCanvasSelected(true);
      const nextTransform = insideBody
        ? { ...transform }
        : { ...transform, x: Math.max(0.1, Math.min(0.9, pt.x / canvas.width)), y: Math.max(0.2, Math.min(0.95, (pt.y + bounds.totalHeight * 0.25) / canvas.height)) };
      if (!insideBody) setTransform(nextTransform);
      dragStateRef.current = { mode: 'move', startPointerX: pt.x, startPointerY: pt.y, initialTransform: nextTransform, initialDistance: 100, initialAngle: 0 };
    } else {
      setIsCanvasSelected(false);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const state = dragStateRef.current;
    if (state.mode === 'none') return;
    const canvas = canvasRef.current;
    const bounds = lastBoundsRef.current;
    if (!canvas || !bounds) return;
    const pt = getCanvasPoint(e);

    if (state.mode === 'move') {
      setTransform((prev) => ({
        ...prev,
        x: Math.max(0.08, Math.min(0.92, state.initialTransform.x + (pt.x - state.startPointerX) / canvas.width)),
        y: Math.max(0.22, Math.min(0.96, state.initialTransform.y + (pt.y - state.startPointerY) / canvas.height)),
      }));
    } else if (state.mode === 'scale') {
      const ratio = Math.max(20, Math.hypot(pt.x - bounds.centerX, pt.y - bounds.centerY)) / state.initialDistance;
      setTransform((prev) => ({ ...prev, scale: Number(Math.max(0.4, Math.min(1.85, state.initialTransform.scale * ratio)).toFixed(2)) }));
    } else if (state.mode === 'rotate') {
      const deltaDeg = ((Math.atan2(pt.y - bounds.centerY, pt.x - bounds.centerX) - state.initialAngle) * 180) / Math.PI;
      setTransform((prev) => ({ ...prev, rotation: Math.max(-45, Math.min(45, Math.round(state.initialTransform.rotation + deltaDeg))) }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current.mode !== 'none') {
      dragStateRef.current.mode = 'none';
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    }
  };

  // ── Export ────────────────────────────────
  const exportCleanCompositionDataUrl = useCallback(
    (mimeType: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.92): string => {
      const ec = document.createElement('canvas');
      ec.width = 1280; ec.height = 960;
      renderRoomComposition({ canvas: ec, roomImage: roomImageElement, plantAsset, potAsset, transform, showHandles: false, isSelected: false, studioBackground: visualizerMode === 'studio' || !roomImageElement });
      return ec.toDataURL(mimeType, quality);
    },
    [roomImageElement, plantAsset, potAsset, transform, visualizerMode]
  );

  const handleDownloadComposition = () => {
    const dataUrl = showAiPreview && aiPreviewDataUrl ? aiPreviewDataUrl : exportCleanCompositionDataUrl('image/png');
    const link = document.createElement('a');
    link.download = `flora-${selectedPlant.id}-${selectedPot.id}-${showAiPreview && aiPreviewDataUrl ? 'ai-preview' : 'room-composition'}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── AI Preview ────────────────────────────
  const handleGenerateAiPreview = async () => {
    if (!roomPhotoDataUrl || !roomImageElement) {
      const defaultPreset = SAMPLE_ROOM_PRESETS[0];
      applyRoomDataUrl(generateSampleRoomDataUrl(defaultPreset.id), defaultPreset.name, defaultPreset.defaultPlacement, defaultPreset.id);
      setAiStatusMessage({ type: 'info', text: 'Sample room loaded. Click "AI Render" again or upload your own room photo.' });
      return;
    }
    setIsGeneratingAi(true);
    setAiStatusMessage({ type: 'info', text: 'Synthesising room lighting, perspective & contact shadows...' });
    try {
      const compositeGuideDataUrl = exportCleanCompositionDataUrl('image/jpeg', 0.88);
      const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';
      const response = await fetch(`${apiBase}/api/visualize-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomImageDataUrl: roomPhotoDataUrl,
          compositeGuideDataUrl,
          plant: { id: selectedPlant.id, name: selectedPlant.name, scientificName: selectedPlant.scientificName, light: selectedPlant.light },
          pot: { id: selectedPot.id, name: selectedPot.name, color: selectedPot.colorName, material: selectedPot.material },
          placement: { x: transform.x, y: transform.y, scale: transform.scale, rotation: transform.rotation, flipX: transform.flipX },
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setAiStatusMessage({ type: 'warning', text: 'AI backend not connected on this host. Set VITE_API_BASE_URL to your deployment. Canvas compositor and PNG export remain fully active.' });
        setIsGeneratingAi(false);
        return;
      }
      const data = (await response.json()) as { imageDataUrl?: string; error?: string };
      if (!response.ok || !data.imageDataUrl) {
        setAiStatusMessage({ type: 'warning', text: data.error || 'AI preview unavailable. Continue with manual canvas placement and download.' });
        setIsGeneratingAi(false);
        return;
      }
      setAiPreviewDataUrl(data.imageDataUrl);
      setShowAiPreview(true);
      setAiStatusMessage({ type: 'success', text: 'Realistic preview rendered. Toggle between AI view and canvas editor anytime.' });
    } catch {
      setAiStatusMessage({ type: 'warning', text: 'AI API unreachable. Manual canvas placement, scaling, rotation, and PNG export remain active.' });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // ── Cart ──────────────────────────────────
  const handleAddComboToCart = () => {
    const comboProduct: Product = {
      id: `combo-${selectedPlant.id}-${selectedPot.id}`,
      name: `${selectedPlant.name} + ${selectedPot.name}`,
      category: 'plants',
      price: finalComboPrice,
      originalPrice: rawTotal,
      badge: 'Bespoke Combo',
      description: `Custom pairing of ${selectedPlant.name} nestled in a ${selectedPot.name} (${selectedPot.colorName}). Includes pre-mixed organic soil and root collar drainage padding.`,
      image: selectedPlant.image,
      inStock: true,
      careLevel: 'Easy',
    };
    addItem(comboProduct, selectedPot.colorName);
    try {
      confetti({ particleCount: 55, spread: 60, origin: { y: 0.75 }, colors: ['#CCE561', '#FF9C94', '#334238', '#FAF2E8'] });
    } catch { /* noop */ }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWhatsAppComboOrder = () => {
    const placementNote = visualizerMode === 'room'
      ? ` (Visualised in: ${roomSourceLabel || 'Custom Room Photo'} at ${Math.round(transform.scale * 100)}% scale)`
      : '';
    const message = `Hi Flora! I used the Interactive Room Visualizer to pair the *${selectedPlant.name}* (₹${selectedPlant.price}) with the *${selectedPot.name} – ${selectedPot.colorName}* (₹${selectedPot.price}).\n\n10% Studio Combo Total: *₹${finalComboPrice}* (Save ₹${comboDiscount})${placementNote}.\n\nPlease confirm availability for delivery.`;
    window.open(`https://wa.me/919074797254?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // ──────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────
  return (
    <section
      id="studio"
      className="py-20 lg:py-28 bg-ngen-green text-ngen-cream relative overflow-hidden border-b border-black/10"
    >
      {/* Fixed grain — pointer-none, no scroll repaint */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '256px 256px',
        }}
      />

      <div className="site-max relative z-10">

        {/* ── Section heading — left-aligned, asymmetric ── */}
        <motion.div
          className="mb-12 lg:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-4">
            <BreathingDot />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-ngen-lime">
              Interactive Matcher · Room Visualizer Studio
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.25rem] tracking-[-0.03em] text-white leading-[1.06] max-w-xl"
          >
            Pair living flora,{' '}
            <span className="text-ngen-lime/85">place it in your room.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-ngen-cream/55 text-sm font-sans max-w-lg leading-relaxed"
          >
            Choose a specimen and planter, upload your room photo, position and scale the arrangement — and claim an automatic 10% studio discount at checkout.
          </motion.p>
        </motion.div>

        {/* ── Main asymmetric grid 7 / 5 ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >

          {/* ────────────────────────────────
              LEFT column — catalogue + upload
          ──────────────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col gap-4">

            {/* ── Plant selector ── */}
            <div className="bg-ngen-darkgreen rounded-[1.75rem] border border-white/[0.07] overflow-hidden shadow-[0_20px_48px_-16px_rgba(0,0,0,0.3)]">
              {/* Header bar */}
              <div className="px-5 pt-5 pb-3.5 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ngen-lime">
                  01 — Choose Plant
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selectedPlant.scientificName}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={springCfg}
                    className="text-[10px] font-mono italic text-ngen-cream/35"
                  >
                    {selectedPlant.scientificName}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PLANT_OPTIONS.map((plant, i) => {
                  const active = selectedPlant.id === plant.id;
                  return (
                    <motion.button
                      key={plant.id}
                      type="button"
                      onClick={() => setSelectedPlant(plant)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springCfg, delay: i * 0.04 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative p-3 rounded-2xl text-left flex items-center gap-3 cursor-pointer border transition-colors duration-150 ${
                        active
                          ? 'border-ngen-lime/50 bg-ngen-lime/[0.09] shadow-[inset_0_1px_0_rgba(204,229,97,0.12)]'
                          : 'border-white/[0.06] bg-white/[0.035] hover:bg-white/[0.07] hover:border-white/[0.15]'
                      }`}
                    >
                      {/* Shared element selection ring */}
                      {active && (
                        <motion.span
                          layoutId="plant-ring"
                          className="absolute inset-0 rounded-2xl ring-1 ring-ngen-lime/40 pointer-events-none"
                          transition={springCfg}
                        />
                      )}
                      {/* Thumbnail */}
                      <div className="w-11 h-11 shrink-0 rounded-xl overflow-hidden bg-white/[0.05] border border-white/[0.05] flex items-center justify-center">
                        <img
                          src={plant.cutoutUrl}
                          alt={plant.name}
                          onError={(e) => { e.currentTarget.src = plant.image; }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-white block truncate leading-tight">
                          {plant.name}
                        </span>
                        <span className="text-[10px] font-mono text-ngen-peach font-bold mt-1 block">
                          ₹{plant.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Pot selector ── */}
            <div className="bg-ngen-darkgreen rounded-[1.75rem] border border-white/[0.07] overflow-hidden shadow-[0_20px_48px_-16px_rgba(0,0,0,0.3)]">
              <div className="px-5 pt-5 pb-3.5 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ngen-lime">
                  02 — Choose Planter
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={selectedPot.material}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={springCfg}
                    className="text-[10px] font-mono text-ngen-cream/35"
                  >
                    {selectedPot.material}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {POT_OPTIONS.map((pot, i) => {
                  const active = selectedPot.id === pot.id;
                  return (
                    <motion.button
                      key={pot.id}
                      type="button"
                      onClick={() => setSelectedPot(pot)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springCfg, delay: i * 0.05 }}
                      whileTap={{ scale: 0.96 }}
                      className={`relative p-3 rounded-2xl flex flex-col items-center cursor-pointer border transition-colors duration-150 ${
                        active
                          ? 'border-ngen-lime/50 bg-ngen-lime/[0.09] shadow-[inset_0_1px_0_rgba(204,229,97,0.12)]'
                          : 'border-white/[0.06] bg-white/[0.035] hover:bg-white/[0.07] hover:border-white/[0.15]'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="pot-ring"
                          className="absolute inset-0 rounded-2xl ring-1 ring-ngen-lime/40 pointer-events-none"
                          transition={springCfg}
                        />
                      )}
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2.5 bg-white/[0.05] border border-white/[0.05] flex items-center justify-center p-2">
                        <img
                          src={pot.cutoutUrl}
                          alt={pot.name}
                          onError={(e) => { e.currentTarget.src = pot.image; }}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-2 h-2 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: pot.colorHex }}
                        />
                        <span className="text-[10px] font-bold text-white/85 line-clamp-1">
                          {pot.colorName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-ngen-peach font-bold">
                        ₹{pot.price.toLocaleString('en-IN')}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Room upload + sample presets ── */}
            <div className="bg-ngen-darkgreen rounded-[1.75rem] border border-white/[0.07] overflow-hidden shadow-[0_20px_48px_-16px_rgba(0,0,0,0.3)]">
              {/* Header */}
              <div className="px-5 pt-5 pb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ngen-lime">
                  03 — Visualize in Your Room
                </span>
                {/* Mode pills */}
                <div className="flex items-center gap-1 bg-white/[0.05] border border-white/[0.07] rounded-full p-0.5">
                  {(['studio', 'room'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        if (mode === 'studio') setVisualizerMode('studio');
                        else if (roomImageElement) setVisualizerMode('room');
                        else handleLoadSamplePreset(SAMPLE_ROOM_PRESETS[0].id);
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        visualizerMode === mode
                          ? 'bg-ngen-lime text-ngen-charcoal'
                          : 'text-ngen-cream/45 hover:text-ngen-cream/80'
                      }`}
                    >
                      {mode === 'studio' ? 'Cutout' : 'Room'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload room photograph"
                />

                {/* Drop zone */}
                <motion.div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) processUploadedFile(f);
                  }}
                  animate={{
                    borderColor: isDraggingFile ? 'rgba(204,229,97,0.6)' : 'rgba(255,255,255,0.1)',
                    backgroundColor: isDraggingFile ? 'rgba(204,229,97,0.05)' : 'rgba(0,0,0,0.15)',
                  }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl border border-dashed p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-ngen-lime/10 border border-ngen-lime/20 flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4 text-ngen-lime" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {roomSourceLabel ? `Active: ${roomSourceLabel}` : 'Drop or upload your room photo'}
                      </p>
                      <p className="text-[10px] text-ngen-cream/40 font-mono mt-0.5">
                        JPG, PNG, WebP · up to 10 MB · processed in-browser
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-full bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal font-display font-bold text-[11px] uppercase tracking-wider transition-all active:scale-[0.97] cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    >
                      {roomImageElement && !activePresetId ? 'Replace' : 'Upload'}
                    </button>
                    {roomImageElement && (
                      <button
                        type="button"
                        onClick={handleRemoveRoomPhoto}
                        title="Remove room photo"
                        className="p-2 rounded-full bg-white/[0.06] hover:bg-red-500/20 text-ngen-cream/50 hover:text-red-300 border border-white/[0.08] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>

                {/* Sample presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-ngen-cream/35">
                    <ImageIcon className="w-3 h-3 text-ngen-lime/50" />
                    Sample rooms:
                  </span>
                  {SAMPLE_ROOM_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleLoadSamplePreset(preset.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors cursor-pointer ${
                        visualizerMode === 'room' && activePresetId === preset.id
                          ? 'border-ngen-lime/45 bg-ngen-lime/12 text-white font-bold'
                          : 'border-white/[0.08] bg-white/[0.03] text-ngen-cream/45 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                {/* Upload error */}
                <AnimatePresence>
                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 text-[10px] text-red-300 bg-red-950/35 border border-red-400/20 rounded-xl px-3 py-2.5 font-mono leading-relaxed"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                      <span>{uploadError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Botanical care specs ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlant.id + selectedPot.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={springCfg}
                className="flex flex-wrap items-center gap-x-7 gap-y-3 px-5 py-4 rounded-[1.5rem] bg-ngen-darkgreen border border-white/[0.07] text-[11px] font-mono text-ngen-cream/50"
              >
                <div className="flex items-center gap-2">
                  <SunMedium className="w-3.5 h-3.5 text-ngen-lime shrink-0" />
                  <span>Light: <strong className="text-white font-bold">{selectedPlant.light}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Water: <strong className="text-white font-bold">{selectedPlant.water}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-ngen-peach shrink-0" />
                  <span>Planter: <strong className="text-white font-bold">{selectedPot.material}</strong></span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ────────────────────────────────
              RIGHT column — canvas + checkout
          ──────────────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-4">

            {/* ── Canvas panel ── */}
            <div className="bg-ngen-darkgreen rounded-[1.75rem] border border-white/[0.07] overflow-hidden shadow-[0_20px_48px_-16px_rgba(0,0,0,0.3)]">
              {/* Stage header */}
              <div className="px-5 pt-5 pb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-ngen-cream/45 flex items-center gap-1.5">
                  <Move className="w-3 h-3 text-ngen-lime" />
                  {visualizerMode === 'room' ? 'Room Compositor' : 'Studio Preview'}
                </span>
                {/* Breathing combo badge */}
                <motion.span
                  className="px-3 py-1 rounded-full bg-ngen-lime text-ngen-charcoal font-mono font-black text-[10px] uppercase tracking-wider"
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  10% Combo
                </motion.span>
              </div>

              {/* Canvas viewport */}
              <div className="relative aspect-[4/3] bg-[#EDE1D1] select-none border-b border-white/[0.06]">
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={720}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  aria-label={`Interactive preview: ${selectedPlant.name} in ${selectedPot.name}`}
                  className={`w-full h-full block touch-none ${
                    showAiPreview && aiPreviewDataUrl ? 'hidden' : 'cursor-grab active:cursor-grabbing'
                  }`}
                />

                {/* AI render overlay */}
                <AnimatePresence>
                  {showAiPreview && aiPreviewDataUrl && (
                    <motion.img
                      key="ai-img"
                      src={aiPreviewDataUrl}
                      alt={`AI realistic preview: ${selectedPlant.name} in ${selectedPot.name}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>

                {/* Mode badge — liquid glass */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-ngen-charcoal/70 backdrop-blur-md text-ngen-cream/90 text-[10px] font-mono uppercase tracking-wider border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
                    {showAiPreview && aiPreviewDataUrl
                      ? 'AI Render'
                      : visualizerMode === 'room'
                      ? 'Drag · Scale · Rotate'
                      : 'Transparent Layer'}
                  </span>
                </div>

                {/* Toggle AI / Canvas */}
                {aiPreviewDataUrl && (
                  <button
                    type="button"
                    onClick={() => setShowAiPreview((v) => !v)}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-ngen-charcoal/75 hover:bg-ngen-charcoal backdrop-blur-md text-ngen-lime text-[10px] font-mono font-bold uppercase tracking-wider border border-ngen-lime/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Eye className="w-3 h-3" />
                    {showAiPreview ? 'Edit Canvas' : 'AI View'}
                  </button>
                )}

                {/* AI generating overlay */}
                <AnimatePresence>
                  {isGeneratingAi && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-ngen-charcoal/82 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                        className="mb-4"
                      >
                        <RefreshCw className="w-6 h-6 text-ngen-lime" />
                      </motion.div>
                      <p className="font-display font-bold text-sm text-white mb-1.5">
                        Rendering realistic preview…
                      </p>
                      <p className="text-[10px] font-mono text-ngen-cream/55 max-w-[26ch] leading-relaxed">
                        Matching room lighting, perspective & floor shadows.
                      </p>
                      <div className="mt-5 w-40 space-y-2">
                        <ShimmerBar className="h-1.5 w-full" />
                        <ShimmerBar className="h-1.5 w-3/4" />
                        <ShimmerBar className="h-1.5 w-5/6" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Toolbar */}
              <div className="p-4 space-y-3.5">
                {/* Sliders */}
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-ngen-cream/45">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-ngen-lime" />
                        Scale
                      </span>
                      <span className="text-white font-bold">{Math.round(transform.scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.45"
                      max="1.75"
                      step="0.05"
                      value={transform.scale}
                      onChange={(e) => {
                        setShowAiPreview(false);
                        setTransform((prev) => ({ ...prev, scale: parseFloat(e.target.value) }));
                      }}
                      aria-label="Plant and pot scale"
                      className="w-full accent-[#CCE561] cursor-pointer h-1 bg-white/10 rounded-full"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-ngen-cream/45">
                      <span className="flex items-center gap-1">
                        <RotateCcw className="w-3 h-3 text-ngen-peach" />
                        Tilt
                      </span>
                      <span className="text-white font-bold">{transform.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="1"
                      value={transform.rotation}
                      onChange={(e) => {
                        setShowAiPreview(false);
                        setTransform((prev) => ({ ...prev, rotation: parseInt(e.target.value, 10) }));
                      }}
                      aria-label="Plant and pot rotation"
                      className="w-full accent-[#FF9C94] cursor-pointer h-1 bg-white/10 rounded-full"
                    />
                  </label>
                </div>

                {/* Action row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setShowAiPreview(false); setTransform((prev) => ({ ...prev, flipX: !prev.flipX })); }}
                      title="Mirror horizontally"
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/[0.06] text-ngen-cream text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <FlipHorizontal className="w-3 h-3 text-ngen-lime" />
                      Flip
                    </button>
                    <button
                      type="button"
                      onClick={handleResetPlacement}
                      title="Reset placement"
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/[0.06] text-ngen-cream text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <RotateCcw className="w-3 h-3 text-ngen-peach" />
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadComposition}
                      title="Download PNG"
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.08] text-white text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-[0.97]"
                    >
                      <Download className="w-3 h-3 text-ngen-lime" />
                      PNG
                    </button>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleGenerateAiPreview}
                    disabled={isGeneratingAi}
                    whileTap={{ scale: 0.96 }}
                    className="px-3 py-1.5 rounded-lg bg-ngen-lime/[0.12] hover:bg-ngen-lime/[0.22] border border-ngen-lime/25 text-ngen-lime font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGeneratingAi ? 'Rendering…' : 'AI Render'}
                  </motion.button>
                </div>

                {/* AI status banner */}
                <AnimatePresence>
                  {aiStatusMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`text-[10px] font-mono rounded-xl px-3 py-2.5 border leading-relaxed ${
                        aiStatusMessage.type === 'success'
                          ? 'bg-ngen-lime/[0.08] border-ngen-lime/25 text-ngen-lime'
                          : aiStatusMessage.type === 'warning'
                          ? 'bg-amber-500/[0.07] border-amber-300/20 text-amber-200'
                          : 'bg-white/[0.04] border-white/[0.08] text-ngen-cream/65'
                      }`}
                    >
                      {aiStatusMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Bundle summary + checkout ── */}
            <div className="bg-ngen-darkgreen rounded-[1.75rem] border border-white/[0.07] overflow-hidden shadow-[0_20px_48px_-16px_rgba(0,0,0,0.3)]">
              {/* Pair description */}
              <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPlant.id + selectedPot.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={springCfg}
                  >
                    <h3 className="font-display font-bold text-[1.1rem] tracking-tight text-white leading-snug">
                      {selectedPlant.name}
                    </h3>
                    <p className="text-[10px] font-mono text-ngen-cream/35 mt-0.5 uppercase tracking-wider">
                      in {selectedPot.name} · {selectedPot.colorName}
                    </p>
                    <p className="text-xs text-ngen-cream/50 mt-2.5 leading-relaxed font-sans max-w-[38ch]">
                      {selectedPlant.vibe}. Delivered potted in {selectedPot.material.toLowerCase()}.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pricing breakdown */}
              <div className="px-5 py-4 space-y-2 text-[11px] font-mono border-b border-white/[0.06]">
                <div className="flex justify-between text-ngen-cream/45">
                  <span>{selectedPlant.name}</span>
                  <span>₹{selectedPlant.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-ngen-cream/45">
                  <span>{selectedPot.name}</span>
                  <span>₹{selectedPot.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-ngen-lime font-bold">
                  <span>Studio Combo (–10%)</span>
                  <span>–₹{comboDiscount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Total + CTA */}
              <div className="px-5 py-5">
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <span className="text-[10px] text-ngen-cream/35 block font-mono uppercase tracking-[0.15em] mb-1">
                      Bundle total
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={finalComboPrice}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={springCfg}
                        className="font-display font-black text-3xl text-white tracking-tight block"
                      >
                        ₹{finalComboPrice.toLocaleString('en-IN')}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="text-sm font-mono text-ngen-cream/25 line-through">
                    ₹{rawTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2.5">
                  {/* Add to cart */}
                  <motion.button
                    type="button"
                    onClick={handleAddComboToCart}
                    whileTap={{ scale: 0.98 }}
                    className={`col-span-8 py-3.5 px-4 rounded-full font-display font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200 border cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
                        : 'bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal border-ngen-peach shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {justAdded ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={springCfg}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Added to Bag
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={springCfg}
                          className="flex items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add Pair to Bag
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* WhatsApp */}
                  <motion.button
                    type="button"
                    onClick={handleWhatsAppComboOrder}
                    whileTap={{ scale: 0.97 }}
                    title="Order via WhatsApp"
                    className="col-span-4 py-3.5 px-2 rounded-full font-display font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.11] text-white border border-white/[0.12] transition-colors cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-ngen-lime shrink-0" />
                    <span>WhatsApp</span>
                  </motion.button>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
