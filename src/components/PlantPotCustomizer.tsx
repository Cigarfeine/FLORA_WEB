import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    water: 'Every 2-3 weeks',
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

export const PlantPotCustomizer: React.FC = () => {
  const { addItem } = useCart();
  const [selectedPlant, setSelectedPlant] = useState<PlantOption>(PLANT_OPTIONS[0]);
  const [selectedPot, setSelectedPot] = useState<PotOption>(POT_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);

  // Room Visualization & Canvas State
  const [visualizerMode, setVisualizerMode] = useState<'studio' | 'room'>('studio');
  const [roomImageElement, setRoomImageElement] = useState<HTMLImageElement | null>(null);
  const [roomPhotoDataUrl, setRoomPhotoDataUrl] = useState<string | null>(null);
  const [roomSourceLabel, setRoomSourceLabel] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Loaded transparent cutout assets
  const [plantAsset, setPlantAsset] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);
  const [potAsset, setPotAsset] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);

  // Transform state for manual placement
  const [transform, setTransform] = useState<PlacementTransform>(DEFAULT_STUDIO_TRANSFORM);
  const [isCanvasSelected, setIsCanvasSelected] = useState<boolean>(true);

  // AI Realistic Preview State
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiPreviewDataUrl, setAiPreviewDataUrl] = useState<string | null>(null);
  const [showAiPreview, setShowAiPreview] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<{
    type: 'info' | 'warning' | 'success';
    text: string;
  } | null>(null);

  // Refs for Canvas & Pointer Dragging
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

  // Pricing & 10% Combo Discount Math
  const rawTotal = selectedPlant.price + selectedPot.price;
  const comboDiscount = Math.round(rawTotal * 0.1);
  const finalComboPrice = rawTotal - comboDiscount;

  // Load Transparent Plant Asset
  useEffect(() => {
    let cancelled = false;
    loadTransparentAsset({
      id: selectedPlant.id,
      cutoutUrl: selectedPlant.cutoutUrl,
      fallbackImageUrl: selectedPlant.image,
      type: 'plant',
    }).then((asset) => {
      if (!cancelled) setPlantAsset(asset);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedPlant]);

  // Load Transparent Pot Asset
  useEffect(() => {
    let cancelled = false;
    loadTransparentAsset({
      id: selectedPot.id,
      cutoutUrl: selectedPot.cutoutUrl,
      fallbackImageUrl: selectedPot.image,
      type: 'pot',
    }).then((asset) => {
      if (!cancelled) setPotAsset(asset);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedPot]);

  // Clear outdated AI preview if user changes plant/pot
  useEffect(() => {
    if (aiPreviewDataUrl) {
      setShowAiPreview(false);
    }
  }, [selectedPlant.id, selectedPot.id]);

  // Redraw Interactive Canvas
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

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Helper to load a Data URL into an HTMLImageElement for room background
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
        if (initialPlacement) {
          setTransform(initialPlacement);
        } else {
          setTransform({
            x: 0.52,
            y: 0.82,
            scale: 0.95,
            rotation: 0,
            flipX: false,
            shadowIntensity: 0.65,
          });
        }
      };
      img.onerror = () => {
        setUploadError('Could not decode the selected image file. Please try another JPG, PNG, or WebP photo.');
      };
      img.src = dataUrl;
    },
    []
  );

  // Handle customer file upload (JPG, PNG, WebP)
  const processUploadedFile = (file: File) => {
    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Unsupported file format. Please upload a JPG, PNG, or WebP room photograph.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Photograph exceeds 10 MB. Please choose a smaller room image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Normalize large uploads to max 1600px edge so canvas & API stay fast and within limits
        const tempImg = new Image();
        tempImg.onload = () => {
          const maxEdge = 1600;
          let targetW = tempImg.naturalWidth || 1280;
          let targetH = tempImg.naturalHeight || 960;
          if (targetW > maxEdge || targetH > maxEdge) {
            if (targetW > targetH) {
              targetH = Math.round((targetH * maxEdge) / targetW);
              targetW = maxEdge;
            } else {
              targetW = Math.round((targetW * maxEdge) / targetH);
              targetH = maxEdge;
            }
          }
          const normCanvas = document.createElement('canvas');
          normCanvas.width = targetW;
          normCanvas.height = targetH;
          const nCtx = normCanvas.getContext('2d');
          if (nCtx) {
            nCtx.drawImage(tempImg, 0, 0, targetW, targetH);
            const normalizedDataUrl = normCanvas.toDataURL('image/jpeg', 0.9);
            applyRoomDataUrl(normalizedDataUrl, file.name, undefined, null);
          } else {
            applyRoomDataUrl(reader.result as string, file.name, undefined, null);
          }
        };
        tempImg.src = reader.result;
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    e.target.value = '';
  };

  const handleLoadSamplePreset = (presetId: string) => {
    const preset = SAMPLE_ROOM_PRESETS.find((p) => p.id === presetId) || SAMPLE_ROOM_PRESETS[0];
    const dataUrl = generateSampleRoomDataUrl(preset.id);
    applyRoomDataUrl(dataUrl, preset.name, preset.defaultPlacement, preset.id);
  };

  const handleResetPlacement = () => {
    if (visualizerMode === 'room' && activePresetId) {
      const preset = SAMPLE_ROOM_PRESETS.find((p) => p.id === activePresetId);
      if (preset) {
        setTransform(preset.defaultPlacement);
        return;
      }
    }
    setTransform(
      visualizerMode === 'room'
        ? { x: 0.52, y: 0.82, scale: 0.95, rotation: 0, flipX: false, shadowIntensity: 0.65 }
        : DEFAULT_STUDIO_TRANSFORM
    );
  };

  const handleRemoveRoomPhoto = () => {
    setRoomImageElement(null);
    setRoomPhotoDataUrl(null);
    setRoomSourceLabel('');
    setActivePresetId(null);
    setVisualizerMode('studio');
    setAiPreviewDataUrl(null);
    setShowAiPreview(false);
    setAiStatusMessage(null);
    setTransform(DEFAULT_STUDIO_TRANSFORM);
  };

  // Pointer / Touch Coordinate Conversion & Hit Testing on Canvas
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const bounds = lastBoundsRef.current;
    if (!canvas || !bounds) return;

    if (showAiPreview) {
      setShowAiPreview(false);
    }

    const pt = getCanvasPoint(e);

    // 1. Check Rotate Handle Hit (Top Center Circle)
    const distRotate = Math.hypot(pt.x - bounds.rotateHandleX, pt.y - bounds.rotateHandleY);
    if (visualizerMode === 'room' && distRotate <= 24) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsCanvasSelected(true);
      const startAngle = Math.atan2(pt.y - bounds.centerY, pt.x - bounds.centerX);
      dragStateRef.current = {
        mode: 'rotate',
        startPointerX: pt.x,
        startPointerY: pt.y,
        initialTransform: { ...transform },
        initialDistance: 100,
        initialAngle: startAngle,
      };
      return;
    }

    // 2. Check Scale Handle Hit (Bottom Right Circle)
    const distScale = Math.hypot(pt.x - bounds.scaleHandleX, pt.y - bounds.scaleHandleY);
    if (visualizerMode === 'room' && distScale <= 24) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsCanvasSelected(true);
      const startDist = Math.max(20, Math.hypot(pt.x - bounds.centerX, pt.y - bounds.centerY));
      dragStateRef.current = {
        mode: 'scale',
        startPointerX: pt.x,
        startPointerY: pt.y,
        initialTransform: { ...transform },
        initialDistance: startDist,
        initialAngle: 0,
      };
      return;
    }

    // 3. Check Plant+Pot Body Hit (or allow direct placement anywhere in room mode)
    const dx = pt.x - bounds.centerX;
    const dy = pt.y - bounds.centerY;
    const insideBody =
      Math.abs(dx) <= bounds.totalWidth / 2 + 24 && Math.abs(dy) <= bounds.totalHeight / 2 + 24;

    if (insideBody || visualizerMode === 'room') {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsCanvasSelected(true);

      // If user clicked far away from the plant in room mode, jump plant base there and start dragging
      const nextTransform = insideBody
        ? { ...transform }
        : {
            ...transform,
            x: Math.max(0.1, Math.min(0.9, pt.x / canvas.width)),
            y: Math.max(0.2, Math.min(0.95, (pt.y + bounds.totalHeight * 0.25) / canvas.height)),
          };

      if (!insideBody) {
        setTransform(nextTransform);
      }

      dragStateRef.current = {
        mode: 'move',
        startPointerX: pt.x,
        startPointerY: pt.y,
        initialTransform: nextTransform,
        initialDistance: 100,
        initialAngle: 0,
      };
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
      const deltaX = (pt.x - state.startPointerX) / canvas.width;
      const deltaY = (pt.y - state.startPointerY) / canvas.height;
      setTransform((prev) => ({
        ...prev,
        x: Math.max(0.08, Math.min(0.92, state.initialTransform.x + deltaX)),
        y: Math.max(0.22, Math.min(0.96, state.initialTransform.y + deltaY)),
      }));
    } else if (state.mode === 'scale') {
      const currentDist = Math.max(20, Math.hypot(pt.x - bounds.centerX, pt.y - bounds.centerY));
      const ratio = currentDist / state.initialDistance;
      const nextScale = Math.max(0.4, Math.min(1.85, state.initialTransform.scale * ratio));
      setTransform((prev) => ({
        ...prev,
        scale: Number(nextScale.toFixed(2)),
      }));
    } else if (state.mode === 'rotate') {
      const currentAngle = Math.atan2(pt.y - bounds.centerY, pt.x - bounds.centerX);
      const deltaDeg = ((currentAngle - state.initialAngle) * 180) / Math.PI;
      const nextRot = Math.max(-45, Math.min(45, Math.round(state.initialTransform.rotation + deltaDeg)));
      setTransform((prev) => ({
        ...prev,
        rotation: nextRot,
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current.mode !== 'none') {
      dragStateRef.current.mode = 'none';
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture already released
      }
    }
  };

  // Export clean high-resolution composition Data URL (without gizmo handles)
  const exportCleanCompositionDataUrl = useCallback(
    (mimeType: 'image/png' | 'image/jpeg' = 'image/png', quality = 0.92): string => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 1280;
      exportCanvas.height = 960;
      renderRoomComposition({
        canvas: exportCanvas,
        roomImage: roomImageElement,
        plantAsset,
        potAsset,
        transform,
        showHandles: false,
        isSelected: false,
        studioBackground: visualizerMode === 'studio' || !roomImageElement,
      });
      return exportCanvas.toDataURL(mimeType, quality);
    },
    [roomImageElement, plantAsset, potAsset, transform, visualizerMode]
  );

  // Download resulting composition as PNG
  const handleDownloadComposition = () => {
    const dataUrl = showAiPreview && aiPreviewDataUrl ? aiPreviewDataUrl : exportCleanCompositionDataUrl('image/png');
    const link = document.createElement('a');
    const modeSlug = showAiPreview && aiPreviewDataUrl ? 'ai-preview' : 'room-composition';
    link.download = `flora-${selectedPlant.id}-${selectedPot.id}-${modeSlug}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Optional AI Realistic Room Visualization via Serverless Endpoint
  const handleGenerateAiPreview = async () => {
    if (!roomPhotoDataUrl || !roomImageElement) {
      // Automatically load the default Kerala sample room if user clicks AI preview before uploading
      const defaultPreset = SAMPLE_ROOM_PRESETS[0];
      const sampleUrl = generateSampleRoomDataUrl(defaultPreset.id);
      applyRoomDataUrl(sampleUrl, defaultPreset.name, defaultPreset.defaultPlacement, defaultPreset.id);
      setAiStatusMessage({
        type: 'info',
        text: 'Loaded Kochi Teak Living Lounge sample room. Click "Generate Realistic Preview" again or upload your own room photo.',
      });
      return;
    }

    setIsGeneratingAi(true);
    setAiStatusMessage({
      type: 'info',
      text: 'Synthesizing realistic room lighting, perspective, and contact shadows via OpenAI GPT Image...',
    });

    try {
      const compositeGuideDataUrl = exportCleanCompositionDataUrl('image/jpeg', 0.88);
      const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';
      const endpoint = `${apiBase}/api/visualize-room`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomImageDataUrl: roomPhotoDataUrl,
          compositeGuideDataUrl,
          plant: {
            id: selectedPlant.id,
            name: selectedPlant.name,
            scientificName: selectedPlant.scientificName,
            light: selectedPlant.light,
          },
          pot: {
            id: selectedPot.id,
            name: selectedPot.name,
            color: selectedPot.colorName,
            material: selectedPot.material,
          },
          placement: {
            x: transform.x,
            y: transform.y,
            scale: transform.scale,
            rotation: transform.rotation,
            flipX: transform.flipX,
          },
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setAiStatusMessage({
          type: 'warning',
          text: 'AI Visualization backend is not connected on this static host yet. Set VITE_API_BASE_URL to your Vercel deployment. Your interactive Canvas room compositor and PNG download remain 100% active.',
        });
        setIsGeneratingAi(false);
        return;
      }

      const data = (await response.json()) as {
        imageDataUrl?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok || !data.imageDataUrl) {
        setAiStatusMessage({
          type: 'warning',
          text:
            data.error ||
            'AI Realistic Preview is currently unavailable. You can continue positioning and downloading your manual Canvas room composition.',
        });
        setIsGeneratingAi(false);
        return;
      }

      setAiPreviewDataUrl(data.imageDataUrl);
      setShowAiPreview(true);
      setAiStatusMessage({
        type: 'success',
        text: 'Realistic AI Room Preview generated. Toggle between AI View and Manual Canvas Editor anytime.',
      });
    } catch {
      setAiStatusMessage({
        type: 'warning',
        text: 'AI Visualization API is unreachable from this environment. Manual Canvas placement, scaling, rotation, and high-res PNG downloads remain fully active.',
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Preserve Cart & Confetti Integration
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
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#CCE561', '#FF9C94', '#334238', '#FAF2E8'],
      });
    } catch {
      // Ignore confetti errors in headless environments
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  // Direct WhatsApp Bespoke Inquiry Link
  const handleWhatsAppComboOrder = () => {
    const placementNote =
      visualizerMode === 'room'
        ? ` (Visualized in room: ${roomSourceLabel || 'Custom Room Photo'} at ${Math.round(transform.scale * 100)}% scale)`
        : '';
    const message = `Hi Flora! I used the Interactive Room Visualizer to pair the *${selectedPlant.name}* (₹${selectedPlant.price}) with the *${selectedPot.name} - ${selectedPot.colorName}* (₹${selectedPot.price}).\n\n10% Studio Combo Total: *₹${finalComboPrice}* (Save ₹${comboDiscount})${placementNote}.\n\nPlease confirm availability for delivery.`;
    window.open(`https://wa.me/919074797254?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="studio"
      className="py-24 bg-ngen-green text-ngen-cream relative overflow-hidden border-b border-black/10"
    >
      <div className="site-max relative z-10">
        {/* Studio Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-widest text-ngen-lime block mb-3">
            Interactive Matcher &amp; Room Visualizer Studio
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-white leading-[1.05] mb-4">
            Pair Living Flora &amp; Visualize in Your Space
          </h2>
          <p className="text-ngen-cream/75 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Select any living plant and sculptural planter from our catalogue, upload a photograph of your room to place and scale your arrangement, and unlock an automatic 10% studio pairing discount.
          </p>
        </div>

        {/* Main Studio Grid: Left Catalogue & Room Upload Controls (7 Cols) | Right Interactive Visualizer & Checkout (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-7 bg-ngen-darkgreen p-6 sm:p-8 rounded-3xl border border-white/10 text-white">
            {/* Step 1: Select Plant */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ngen-lime">
                  Step 1 • Choose Your Plant ({PLANT_OPTIONS.length} Specimens)
                </span>
                <span className="text-xs font-mono font-bold text-ngen-cream/80 uppercase">
                  Selected: <strong className="text-white">{selectedPlant.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PLANT_OPTIONS.map((plant) => {
                  const isSelected = selectedPlant.id === plant.id;
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => setSelectedPlant(plant)}
                      className={`p-2.5 rounded-2xl text-left border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-ngen-lime bg-white/12 shadow-[0_0_0_1px_rgba(204,229,97,0.4)]'
                          : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[#FAF2E8]/10 p-1.5 flex items-center justify-center relative">
                        <img
                          src={plant.cutoutUrl}
                          alt={plant.name}
                          onError={(e) => {
                            e.currentTarget.src = plant.image;
                          }}
                          className="w-full h-full object-contain drop-shadow"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white block truncate">
                          {plant.name}
                        </span>
                        <span className="text-[10px] font-mono text-ngen-cream/55 block truncate italic">
                          {plant.scientificName}
                        </span>
                        <span className="text-xs font-mono text-ngen-peach font-bold mt-0.5 block">
                          ₹{plant.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Planter Pot */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ngen-lime">
                  Step 2 • Choose Planter Pot
                </span>
                <span className="text-xs font-mono font-bold text-ngen-cream/80 uppercase">
                  Selected: <strong className="text-white">{selectedPot.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POT_OPTIONS.map((pot) => {
                  const isSelected = selectedPot.id === pot.id;
                  return (
                    <button
                      key={pot.id}
                      type="button"
                      onClick={() => setSelectedPot(pot)}
                      className={`p-2.5 rounded-2xl text-left border transition-all duration-200 flex flex-col items-center cursor-pointer ${
                        isSelected
                          ? 'border-ngen-lime bg-white/12 shadow-[0_0_0_1px_rgba(204,229,97,0.4)]'
                          : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-[#FAF2E8]/10 p-2.5 flex items-center justify-center">
                        <img
                          src={pot.cutoutUrl}
                          alt={pot.name}
                          onError={(e) => {
                            e.currentTarget.src = pot.image;
                          }}
                          className="max-w-full max-h-full object-contain drop-shadow"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                          style={{ backgroundColor: pot.colorHex }}
                        />
                        <span className="text-[11px] font-bold text-white line-clamp-1">
                          {pot.colorName}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-ngen-peach font-bold">
                        ₹{pot.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Room Photograph Upload & Sample Room Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/12 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ngen-lime">
                  Step 3 • Visualize in Your Room (JPG, PNG, WebP)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVisualizerMode('studio')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                      visualizerMode === 'studio'
                        ? 'bg-ngen-lime text-ngen-charcoal'
                        : 'bg-white/10 text-ngen-cream/70 hover:text-white'
                    }`}
                  >
                    Studio Cutout
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (roomImageElement) {
                        setVisualizerMode('room');
                      } else {
                        handleLoadSamplePreset(SAMPLE_ROOM_PRESETS[0].id);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                      visualizerMode === 'room'
                        ? 'bg-ngen-lime text-ngen-charcoal'
                        : 'bg-white/10 text-ngen-cream/70 hover:text-white'
                    }`}
                  >
                    Room Visualizer
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload room photograph"
              />

              {/* Drag and Drop / Upload Trigger Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processUploadedFile(file);
                }}
                className={`rounded-xl border border-dashed p-3.5 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isDraggingFile
                    ? 'border-ngen-lime bg-ngen-lime/10'
                    : 'border-white/20 bg-black/25 hover:border-white/35'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-ngen-lime/15 border border-ngen-lime/30 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4 text-ngen-lime" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {roomSourceLabel
                        ? `Active Space: ${roomSourceLabel}`
                        : 'Upload Your Living Room, Balcony, or Study Photo'}
                    </p>
                    <p className="text-[11px] text-ngen-cream/60 font-mono">
                      Supports JPG, PNG, WebP up to 10 MB • Processed privately in-browser
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-full bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
                  >
                    {roomImageElement && !activePresetId ? 'Replace Photo' : 'Upload Photo'}
                  </button>
                  {roomImageElement && (
                    <button
                      type="button"
                      onClick={handleRemoveRoomPhoto}
                      title="Remove Room Photograph"
                      className="p-2 rounded-full bg-white/10 hover:bg-red-500/20 text-ngen-cream/80 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Room Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="text-ngen-cream/60 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-ngen-lime" />
                  Or test sample rooms:
                </span>
                {SAMPLE_ROOM_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadSamplePreset(preset.id)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      visualizerMode === 'room' && activePresetId === preset.id
                        ? 'border-ngen-lime bg-ngen-lime/20 text-white font-bold'
                        : 'border-white/15 bg-white/5 text-ngen-cream/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/40 border border-red-400/30 rounded-xl px-3 py-2 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-300" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Botanical Care Specs for this Pair */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-ngen-cream/70 font-mono">
              <div className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-ngen-lime" />
                <span>
                  Light: <strong className="text-white">{selectedPlant.light}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>
                  Water: <strong className="text-white">{selectedPlant.water}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-ngen-peach" />
                <span>
                  Material: <strong className="text-white">{selectedPot.material}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Room Canvas, Transform Controls, AI Preview & Bundle Checkout (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-ngen-darkgreen rounded-3xl p-6 sm:p-7 flex-1 flex flex-col justify-between border border-white/15 text-white">
              <div>
                {/* Stage Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase font-mono font-bold tracking-widest text-ngen-cream/70 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-ngen-lime" />
                    {visualizerMode === 'room'
                      ? 'Interactive Room Compositor'
                      : 'Studio Cutout Preview'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-ngen-lime text-ngen-charcoal font-mono font-black text-xs uppercase tracking-wider">
                    10% Combo Applied
                  </span>
                </div>

                {/* Interactive HTML5 Canvas / AI Preview Stage */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EDE1D1] border border-white/15 mb-3 select-none shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={960}
                    height={720}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    aria-label={`Interactive preview of ${selectedPlant.name} in ${selectedPot.name}`}
                    className={`w-full h-full block touch-none ${
                      showAiPreview && aiPreviewDataUrl ? 'hidden' : 'cursor-grab active:cursor-grabbing'
                    }`}
                  />

                  {/* AI Realistic Generated Preview Overlay */}
                  {showAiPreview && aiPreviewDataUrl && (
                    <img
                      src={aiPreviewDataUrl}
                      alt={`AI realistic room visualization of ${selectedPlant.name} in ${selectedPot.name}`}
                      className="w-full h-full object-cover block"
                    />
                  )}

                  {/* Top-Left Mode Badge Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-ngen-charcoal/80 backdrop-blur-md text-ngen-cream text-[10px] font-mono uppercase tracking-wider border border-white/15">
                      {showAiPreview && aiPreviewDataUrl
                        ? 'AI Realistic Render'
                        : visualizerMode === 'room'
                        ? 'Drag, Scale & Rotate on Photo'
                        : 'Transparent Cutout Layer'}
                    </span>
                  </div>

                  {/* Compare Manual vs AI Toggle Button (when AI image exists) */}
                  {aiPreviewDataUrl && (
                    <button
                      type="button"
                      onClick={() => setShowAiPreview((prev) => !prev)}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-ngen-charcoal/85 hover:bg-ngen-charcoal text-ngen-lime text-[10px] font-mono font-bold uppercase tracking-wider border border-ngen-lime/40 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{showAiPreview ? 'Edit Manual Canvas' : 'View AI Render'}</span>
                    </button>
                  )}

                  {/* AI Loading Overlay */}
                  {isGeneratingAi && (
                    <div className="absolute inset-0 bg-ngen-charcoal/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
                      <RefreshCw className="w-8 h-8 text-ngen-lime animate-spin mb-3" />
                      <p className="font-display font-bold text-sm text-white mb-1">
                        Generating Realistic Room Preview...
                      </p>
                      <p className="text-[11px] font-mono text-ngen-cream/75 max-w-xs">
                        Matching your room lighting, perspective, and floor shadows for {selectedPlant.name} in {selectedPot.name}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual Placement Editor Toolbar (Scale, Rotation, Flip, Reset, Download) */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                    {/* Scale Slider */}
                    <label className="flex flex-col gap-1">
                      <div className="flex justify-between text-ngen-cream/75">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="w-3 h-3 text-ngen-lime" /> Scale
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
                        className="w-full accent-[#CCE561] cursor-pointer h-1.5 bg-white/15 rounded-lg"
                      />
                    </label>

                    {/* Rotation Slider */}
                    <label className="flex flex-col gap-1">
                      <div className="flex justify-between text-ngen-cream/75">
                        <span className="flex items-center gap-1">
                          <RotateCcw className="w-3 h-3 text-ngen-peach" /> Tilt / Rotate
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
                        className="w-full accent-[#FF9C94] cursor-pointer h-1.5 bg-white/15 rounded-lg"
                      />
                    </label>
                  </div>

                  {/* Quick Actions Row: Flip, Reset, Download PNG, Generate AI Preview */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAiPreview(false);
                          setTransform((prev) => ({ ...prev, flipX: !prev.flipX }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-ngen-cream text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title="Mirror Foliage Horizontally"
                      >
                        <FlipHorizontal className="w-3 h-3 text-ngen-lime" />
                        <span>Flip</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetPlacement}
                        className="px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-ngen-cream text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title="Reset Position, Scale & Rotation"
                      >
                        <RotateCcw className="w-3 h-3 text-ngen-peach" />
                        <span>Reset</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadComposition}
                        className="px-2.5 py-1.5 rounded-lg bg-white/12 hover:bg-white/20 text-white font-bold text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download High-Res PNG Composition"
                      >
                        <Download className="w-3 h-3 text-ngen-lime" />
                        <span>Download PNG</span>
                      </button>
                    </div>

                    {/* Optional AI Realistic Preview Trigger */}
                    <button
                      type="button"
                      onClick={handleGenerateAiPreview}
                      disabled={isGeneratingAi}
                      className="px-3 py-1.5 rounded-lg bg-ngen-lime/20 hover:bg-ngen-lime/30 border border-ngen-lime/50 text-ngen-lime font-mono font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {isGeneratingAi ? 'Rendering...' : 'Generate Realistic Preview'}
                      </span>
                    </button>
                  </div>

                  {/* AI Status / Fallback Banner */}
                  {aiStatusMessage && (
                    <div
                      className={`text-[11px] font-mono rounded-xl px-3 py-2 border leading-relaxed ${
                        aiStatusMessage.type === 'success'
                          ? 'bg-ngen-lime/15 border-ngen-lime/40 text-ngen-lime'
                          : aiStatusMessage.type === 'warning'
                          ? 'bg-amber-500/10 border-amber-300/30 text-amber-200'
                          : 'bg-white/5 border-white/15 text-ngen-cream/80'
                      }`}
                    >
                      {aiStatusMessage.text}
                    </div>
                  )}
                </div>

                {/* Bundle Summary */}
                <h3 className="font-display font-bold text-xl tracking-tight text-white mb-1">
                  {selectedPlant.name} in {selectedPot.name}
                </h3>
                <p className="text-xs text-ngen-cream/70 mb-3 leading-relaxed font-sans">
                  {selectedPlant.vibe} nestled in {selectedPot.material.toLowerCase()}. Delivered potted and ready to display.
                </p>

                {/* Pricing Breakdown */}
                <div className="space-y-1.5 py-3 border-y border-white/15 text-xs font-mono">
                  <div className="flex justify-between text-ngen-cream/70">
                    <span>{selectedPlant.name}</span>
                    <span>₹{selectedPlant.price}</span>
                  </div>
                  <div className="flex justify-between text-ngen-cream/70">
                    <span>{selectedPot.name}</span>
                    <span>₹{selectedPot.price}</span>
                  </div>
                  <div className="flex justify-between text-ngen-lime font-bold">
                    <span>Studio Combo Discount (10%)</span>
                    <span>-₹{comboDiscount}</span>
                  </div>
                </div>
              </div>

              {/* Total & Checkout Actions */}
              <div className="pt-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-xs text-ngen-cream/60 block font-mono uppercase tracking-wider">
                      Total Bundle Price
                    </span>
                    <span className="font-display font-black text-3xl text-white">
                      ₹{finalComboPrice}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-ngen-cream/40 line-through">
                    ₹{rawTotal}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <button
                    type="button"
                    onClick={handleAddComboToCart}
                    className={`sm:col-span-8 py-3.5 px-4 rounded-full font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-ngen-peach hover:bg-ngen-peachHover text-ngen-charcoal border-ngen-peach'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Custom Pair Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add Custom Pair to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppComboOrder}
                    className="sm:col-span-4 py-3.5 px-3 rounded-full font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
                    title="Order this custom pair directly on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-ngen-lime" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
