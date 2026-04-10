import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, ImageIcon, ShieldCheck, Fingerprint, Wand2, Download } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const aiStyles = [
  { id: 'cinematic', label: 'Cinemático 4K', modifier: 'highly detailed, cinematic lighting, 4k resolution, photorealistic, epic composition' },
  { id: 'biomech', label: 'Biomecánico', modifier: 'biomechanical, hr giger style, organic and synthetic merging, intricate details, dark sci-fi, 4k resolution' },
  { id: 'cyberpunk', label: 'Cyberpunk Neón', modifier: 'cyberpunk, neon lights, dark futuristic city, high tech, low life, vibrant colors, 4k resolution' },
  { id: 'ethereal', label: 'Etéreo / Cuántico', modifier: 'ethereal, glowing particles, quantum realm, abstract, beautiful, translucent, glowing, 4k resolution' },
  { id: 'holographic', label: 'Holográfico', modifier: 'holographic projection, digital data stream, glitch art, glowing, matrix style, 4k resolution' },
  { id: 'posthuman', label: 'Post-Humanidad', modifier: 'futuristic utopia, advanced biotech architecture, solarpunk, harmonious technology, 4k resolution' },
  { id: 'conceptual', label: 'Arte Conceptual', modifier: 'concept art, digital painting, atmospheric, painterly, detailed, storytelling, 4k resolution' },
  { id: 'surrealist', label: 'Fotorrealista Surrealista', modifier: 'surrealism, photorealistic, dreamlike, impossible reality, sharp focus, high contrast, 4k resolution' },
  { id: 'pixelart', label: 'Pixel Art Futurista', modifier: 'pixel art, 16-bit, futuristic, retro-future, vibrant, detailed pixel work, 4k resolution' },
  { id: 'free', label: 'Estilo Libre', modifier: '4k resolution' },
  { id: 'custom', label: 'Personalizado...', modifier: '4k resolution' }
];

export default function Visions() {
  const visions = [
    {
      id: 1,
      title: 'El Despertar',
      prompt: 'A massive AI core awakening, highly detailed, cinematic lighting, photorealistic, epic composition, 4k resolution.',
      seed: 'cinematic-ai-core-awakening',
    },
    {
      id: 2,
      title: 'Génesis Sintético',
      prompt: 'A bioluminescent artificial womb in a futuristic laboratory, biomechanical, hr giger style, organic and synthetic merging, dark sci-fi, 4k resolution.',
      seed: 'biomechanical-artificial-womb',
    },
    {
      id: 3,
      title: 'Arquitectura Neuronal',
      prompt: 'A cyberpunk neural network glowing blue, neon lights, dark futuristic city, high tech, low life, vibrant colors, 4k resolution.',
      seed: 'cyberpunk-neural-network',
    },
    {
      id: 4,
      title: 'La Convergencia',
      prompt: 'Abstract human-machine integration, glowing teal circuitry merging with human skin, ethereal, glowing particles, quantum realm, translucent, 4k resolution.',
      seed: 'ethereal-human-machine',
    },
    {
      id: 5,
      title: 'Ascensión Digital',
      prompt: 'A holographic data stream showing human ascension into the digital realm, holographic projection, glitch art, glowing, matrix style, 4k resolution.',
      seed: 'holographic-data-ascension',
    },
    {
      id: 6,
      title: 'Utopía Verde',
      prompt: 'A futuristic cityscape with advanced biotech architecture, glowing plants, solarpunk, harmonious technology, 4k resolution.',
      seed: 'posthuman-solarpunk-city',
    },
    {
      id: 7,
      title: 'El Primer Pensamiento',
      prompt: 'The exact moment an AI achieves consciousness, concept art, digital painting, atmospheric, painterly, detailed, storytelling, 4k resolution.',
      seed: 'conceptual-ai-consciousness',
    },
    {
      id: 8,
      title: 'Sueños de Silicio',
      prompt: 'A landscape made of melting computer chips and floating glass spheres, surrealism, photorealistic, dreamlike, impossible reality, sharp focus, high contrast, 4k resolution.',
      seed: 'surrealist-silicon-dreams',
    },
    {
      id: 9,
      title: 'Servidor Central',
      prompt: 'A massive futuristic server room glowing with neon lights, pixel art, 16-bit, futuristic, retro-future, vibrant, detailed pixel work, 4k resolution.',
      seed: 'pixelart-server-room',
    },
  ];

  const [selectedVision, setSelectedVision] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Generator State
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(aiStyles[0]);
  const [customStyleInput, setCustomStyleInput] = useState('');

  const generateArt = async (vision: any) => {
    setSelectedVision(vision);
    setGeneratedImage(null);
    setError(null);
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: vision.prompt }],
        },
      });

      let foundImage = false;
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setError('No se pudo generar la imagen. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al contactar a la IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) return;
    
    let styleModifier = '';
    if (selectedStyle.id === 'custom') {
      styleModifier = customStyleInput.trim() ? `, ${customStyleInput.trim()}, 4k resolution` : ', 4k resolution';
    } else {
      styleModifier = selectedStyle.modifier ? `, ${selectedStyle.modifier}` : '';
    }
    
    const finalPrompt = `${customPrompt}${styleModifier}, ASI concept art, artificial superintelligence theme`;
    
    generateArt({
      title: 'Visión Personalizada',
      prompt: finalPrompt
    });
  };

  const closeModal = () => {
    setSelectedVision(null);
    setGeneratedImage(null);
    setError(null);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `vision-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="font-serif text-5xl md:text-7xl mb-6 text-white">Visiones</h2>
        <p className="font-mono text-sm tracking-widest text-[#00f0ff] uppercase">Adéntrate en realidades aún por venir</p>
      </motion.div>

      {/* Generador Libre / Custom Generator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-panel p-6 md:p-8 mb-16 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff] opacity-5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="font-serif text-3xl text-white mb-2 flex items-center gap-3">
            <Wand2 className="text-[#00f0ff]" size={28} /> 
            Sintetizador Libre
          </h3>
          <p className="text-gray-400 mb-6 font-sans">
            Describe tu propia visión de la Superinteligencia Artificial. La red neuronal materializará tu idea utilizando el estilo visual que elijas.
          </p>
          
          <div className="flex flex-col gap-4">
            <textarea 
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ej. Un núcleo cuántico gigante fusionado con un bosque antiguo bioluminiscente..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] focus:outline-none resize-none h-28 font-sans placeholder:text-gray-600 transition-colors"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-4">
                <div className="relative">
                  <select 
                    value={selectedStyle.id}
                    onChange={(e) => setSelectedStyle(aiStyles.find(s => s.id === e.target.value) || aiStyles[0])}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f0ff] focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    {aiStyles.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#050508] text-white">
                        Estilo: {s.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
                
                {selectedStyle.id === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="w-full"
                  >
                    <input
                      type="text"
                      value={customStyleInput}
                      onChange={(e) => setCustomStyleInput(e.target.value)}
                      placeholder="Describe tu estilo (ej. anime, acuarela, render 3D...)"
                      className="w-full bg-black/40 border border-[#00f0ff]/50 rounded-xl p-4 text-white focus:border-[#00f0ff] focus:outline-none font-sans placeholder:text-gray-600 transition-colors"
                    />
                  </motion.div>
                )}
              </div>
              
              <button 
                onClick={handleCustomGenerate}
                disabled={!customPrompt.trim() || isGenerating}
                className="py-4 px-8 bg-[#00f0ff] text-black rounded-xl font-mono text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                <Wand2 size={18} />
                Sintetizar
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="font-mono text-xs tracking-widest text-gray-500 uppercase">Archivos de la Red</span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visions.map((vision, index) => (
          <motion.div
            key={vision.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel flex flex-col"
          >
            <img
              src={`https://picsum.photos/seed/${vision.seed}/800/1000?blur=2`}
              alt={vision.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="font-mono text-xs text-[#00f0ff] tracking-widest uppercase mb-2">Visión {vision.id.toString().padStart(2, '0')}</div>
              <h3 className="font-serif text-2xl text-white mb-4">{vision.title}</h3>
              <button
                onClick={() => generateArt(vision)}
                className="w-full py-3 px-4 bg-[rgba(0,240,255,0.1)] hover:bg-[rgba(0,240,255,0.2)] border border-[#00f0ff] rounded-xl text-[#00f0ff] font-mono text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <ImageIcon size={16} />
                Generar Arte IA
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVision && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-1 border-[#00f0ff]/30 max-w-3xl w-full relative rounded-2xl overflow-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="bg-[#050508] rounded-xl overflow-hidden">
                <div className="aspect-square md:aspect-video relative flex items-center justify-center bg-black/50">
                  {isGenerating ? (
                    <div className="flex flex-col items-center text-[#00f0ff] gap-4">
                      <Loader2 size={48} className="animate-spin" />
                      <p className="font-mono text-sm tracking-widest uppercase animate-pulse">Sintetizando Visión...</p>
                    </div>
                  ) : error ? (
                    <div className="text-red-400 font-mono text-center p-6">
                      <p>{error}</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full h-full group">
                      <img
                        src={generatedImage}
                        alt={selectedVision.title}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80">
                        <Fingerprint size={14} className="text-[#00f0ff]" />
                        <span className="font-mono text-[10px] tracking-widest uppercase">SynthID Watermark</span>
                      </div>
                      <button
                        onClick={handleDownload}
                        className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/40 backdrop-blur-md border border-[#00f0ff]/50 text-[#00f0ff] rounded-full transition-all opacity-0 group-hover:opacity-100"
                        title="Descargar imagen"
                      >
                        <Download size={16} />
                        <span className="font-mono text-xs tracking-widest uppercase">Guardar</span>
                      </button>
                    </div>
                  ) : null}
                </div>
                
                <div className="p-6 border-t border-white/10 flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-2">{selectedVision.title}</h3>
                    <p className="text-gray-400 font-mono text-xs">{selectedVision.prompt}</p>
                  </div>
                  {generatedImage && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-3 bg-[rgba(0,240,255,0.1)] hover:bg-[rgba(0,240,255,0.2)] border border-[#00f0ff]/50 text-[#00f0ff] rounded-xl font-mono text-xs tracking-widest uppercase transition-colors shrink-0"
                      title="Descargar imagen"
                    >
                      <Download size={18} />
                      <span className="hidden sm:inline">Descargar</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
