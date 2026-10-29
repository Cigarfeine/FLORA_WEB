import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Check, Layers, SunMedium, Droplets } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface PlantOption {
  id: string;
  name: string;
  price: number;
  image: string;
  light: string;
  water: string;
  vibe: string;
}

interface PotOption {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  price: number;
  image: string;
  material: string;
}

const PLANT_OPTIONS: PlantOption[] = [
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    price: 480,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=700&q=80',
    light: 'Bright, filtered light',
    water: 'Weekly watering',
    vibe: 'Tropical lush foliage with distinctive split leaf cuts',
  },
  {
    id: 'fiddle',
    name: 'Fiddle Leaf Fig',
    price: 690,
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=700&q=80',
    light: 'Bright indirect sunlight',
    water: 'When top 2 inches dry',
    vibe: 'Architectural violin-shaped statement tree',
  },
  {
    id: 'snake',
    name: 'Golden Snake Plant',
    price: 340,
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=700&q=80',
    light: 'Tolerates low light',
    water: 'Every 2-3 weeks',
    vibe: 'Upright striped sword leaves, ultimate air purifier',
  },
  {
    id: 'bonsai',
    name: 'Japanese Juniper Bonsai',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=700&q=80',
    light: 'Bright morning light',
    water: 'Keep damp with mist',
    vibe: 'Zen art piece with 4-year wire sculptured trunk',
  },
];

const POT_OPTIONS: PotOption[] = [
  {
    id: 'jaguar-grey',
    name: 'Jaguar Cool Pot with Tray',
    colorName: 'Grey Marble',
    colorHex: '#94a3b8',
    price: 600,
    image: 'https://static.wixstatic.com/media/d244c7_583c4b692b7f4e6983aba5f9a2d5cc9f~mv2.png',
    material: 'Polymer composite marble',
  },
  {
    id: 'terracotta-ribbed',
    name: 'Nordic Fluted Urn',
    colorName: 'Warm Terracotta',
    colorHex: '#c47754',
    price: 790,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    material: 'Hand-thrown porous clay',
  },
  {
    id: 'ivory-fiber',
    name: 'Grand Fluted Planter',
    colorName: 'Matte Ivory',
    colorHex: '#eae3d2',
    price: 1350,
    image: 'https://static.wixstatic.com/media/d244c7_eaa01238ee8749179d20f5b65043b0bb~mv2.jpg',
    material: 'Fiberglass composite',
  },
  {
    id: 'charcoal-basin',
    name: 'Zen Ceramic Shallow Basin',
    colorName: 'Charcoal Matte',
    colorHex: '#334155',
    price: 550,
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=700&q=80',
    material: 'High-fire stoneware',
  },
];

export const PlantPotCustomizer: React.FC = () => {
  const { addItem } = useCart();
  const [selectedPlant, setSelectedPlant] = useState<PlantOption>(PLANT_OPTIONS[0]);
  const [selectedPot, setSelectedPot] = useState<PotOption>(POT_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);

  const rawTotal = selectedPlant.price + selectedPot.price;
  const comboDiscount = Math.round(rawTotal * 0.1); // 10% combo discount
  const finalComboPrice = rawTotal - comboDiscount;

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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#334238', '#CCE561', '#FF9C94'],
      });
    } catch {
      // ignore
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <section id="studio" className="py-24 bg-ngen-green text-ngen-cream relative overflow-hidden border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Studio Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ngen-darkgreen border border-white/10 text-ngen-lime font-mono text-[11px] font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-ngen-peach" />
            <span>Interactive Matcher Studio</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-[-0.03em] text-white leading-[0.95] mb-4">
            PAIR FLORA WITH<br />SCULPTURAL POTS
          </h2>
          <p className="text-ngen-cream/70 text-sm sm:text-base">
            Visualize your ideal botanical arrangement. Bundle any living plant with a designer planter to unlock an automatic 10% studio pairing discount.
          </p>
        </div>

        {/* Studio Layout: Left Controls, Right Real-time Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 bg-ngen-darkgreen p-6 sm:p-8 rounded-3xl border border-white/10 text-white">
            
            {/* Step 1: Select Plant */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ngen-lime">
                  Step 1 • Choose Your Plant
                </span>
                <span className="text-xs font-mono font-bold text-ngen-cream/80 uppercase">
                  Selected: <strong className="text-white">{selectedPlant.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLANT_OPTIONS.map((plant) => {
                  const isSelected = selectedPlant.id === plant.id;
                  return (
                    <button
                      key={plant.id}
                      onClick={() => setSelectedPlant(plant)}
                      className={`p-2.5 rounded-2xl text-left border transition-all duration-200 flex flex-col items-center cursor-pointer ${
                        isSelected
                          ? 'border-ngen-lime bg-white/10'
                          : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-black/40">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-white text-center line-clamp-1">
                        {plant.name}
                      </span>
                      <span className="text-[11px] font-mono text-ngen-peach font-bold">
                        ₹{plant.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Pot & Color Finish */}
            <div>
              <div className="flex items-center justify-between mb-3">
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
                      onClick={() => setSelectedPot(pot)}
                      className={`p-2.5 rounded-2xl text-left border transition-all duration-200 flex flex-col items-center cursor-pointer ${
                        isSelected
                          ? 'border-ngen-lime bg-white/10'
                          : 'border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-black/40 p-2 flex items-center justify-center">
                        <img
                          src={pot.image}
                          alt={pot.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/30"
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

            {/* Botanical Care Specs for this Pair */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-ngen-cream/70 font-mono">
              <div className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-ngen-lime" />
                <span>Light: <strong className="text-white">{selectedPlant.light}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Water: <strong className="text-white">{selectedPlant.water}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-ngen-peach" />
                <span>Material: <strong className="text-white">{selectedPot.material}</strong></span>
              </div>
            </div>

          </div>

          {/* Live Mockup & Bundle Checkout Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-ngen-darkgreen rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between border border-white/15 text-white">
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-mono font-bold tracking-widest text-ngen-cream/60">
                    Live Arrangement Preview
                  </span>
                  <span className="px-3 py-1 rounded-full bg-ngen-lime text-ngen-charcoal font-mono font-black text-xs uppercase tracking-wider">
                    10% Combo Applied
                  </span>
                </div>

                {/* Combined Graphic Stage */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-4 flex items-end justify-center mb-6">
                  
                  {/* Plant Layer */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`plant-${selectedPlant.id}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      src={selectedPlant.image}
                      alt={selectedPlant.name}
                      className="absolute inset-x-8 top-4 bottom-16 object-contain z-10"
                    />
                  </AnimatePresence>

                  {/* Pot Base Layer */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`pot-${selectedPot.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-20 w-36 h-28 flex items-center justify-center p-2 rounded-b-2xl"
                    >
                      <img
                        src={selectedPot.image}
                        alt={selectedPot.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>

                </div>

                {/* Bundle Summary */}
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-white mb-1">
                  {selectedPlant.name} in {selectedPot.name}
                </h3>
                <p className="text-xs text-ngen-cream/70 mb-4 leading-relaxed font-sans">
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

              {/* Total & Action */}
              <div className="pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-ngen-cream/60 block font-mono uppercase tracking-wider">Total Bundle Price</span>
                    <span className="font-display font-black text-3xl text-white">
                      ₹{finalComboPrice}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-ngen-cream/40 line-through">
                    ₹{rawTotal}
                  </span>
                </div>

                <button
                  onClick={handleAddComboToCart}
                  className={`w-full py-4 rounded-full font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border cursor-pointer ${
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
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
