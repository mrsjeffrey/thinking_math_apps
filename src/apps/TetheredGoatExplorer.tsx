import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Info,
  RotateCcw,
  Lightbulb,
  Settings,
  BookOpen,
  HelpCircle,
  Ruler,
  Box,
  Maximize2,
} from 'lucide-react';

function SectionCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-black/5 bg-gray-50/60 px-6 py-4">
      {icon}
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
    </div>
  );
}

export default function TetheredGoatExplorer() {
  const [L, setL] = useState(60);
  const [shedWidth, setShedWidth] = useState(50);
  const [shedHeight, setShedHeight] = useState(40);
  const [showFormula, setShowFormula] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const viewBoxSize = 420;
  const center = viewBoxSize / 2;

  const maxDim = Math.max(L, shedWidth, shedHeight);
  const scale = (viewBoxSize * 0.35) / maxDim;

  const areaData = useMemo(() => {
    const mainArea = 0.75 * Math.PI * L * L;

    let secondaryArea1 = 0;
    if (L > shedWidth) {
      secondaryArea1 = 0.25 * Math.PI * Math.pow(L - shedWidth, 2);
    }

    let secondaryArea2 = 0;
    if (L > shedHeight) {
      secondaryArea2 = 0.25 * Math.PI * Math.pow(L - shedHeight, 2);
    }

    return {
      main: mainArea,
      secondary1: secondaryArea1,
      secondary2: secondaryArea2,
      secondaryTotal: secondaryArea1 + secondaryArea2,
      total: mainArea + secondaryArea1 + secondaryArea2,
    };
  }, [L, shedWidth, shedHeight]);

  const generateMainSector = () => {
    const r = L * scale;
    return `M ${center} ${center} L ${center} ${center - r} A ${r} ${r} 0 1 1 ${center - r} ${center} Z`;
  };

  const generateSecondarySectors = () => {
    const wScaled = shedWidth * scale;
    const hScaled = shedHeight * scale;

    let path1 = '';
    if (L > shedWidth) {
      const r = (L - shedWidth) * scale;
      path1 = `M ${center - wScaled} ${center} L ${center - wScaled - r} ${center} A ${r} ${r} 0 0 1 ${center - wScaled} ${center - r} Z`;
    }

    let path2 = '';
    if (L > shedHeight) {
      const r = (L - shedHeight) * scale;
      path2 = `M ${center} ${center - hScaled} L ${center} ${center - hScaled - r} A ${r} ${r} 0 0 0 ${center - r} ${center - hScaled} Z`;
    }

    return { path1, path2 };
  };

  const sectors = generateSecondarySectors();

  const reset = () => {
    setL(60);
    setShedWidth(50);
    setShedHeight(40);
    setShowFormula(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 text-[#1A1A1A]">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4 border-b border-gray-200 pb-6">
          <h1
            className="text-4xl tracking-tight text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}
          >
            Tethered Goat Explorer
          </h1>

          <p className="max-w-4xl text-sm leading-7 text-gray-600">
            Explore how the grazing region changes when a goat is tethered to the
            corner of a rectangular shed with a rope longer than one or both side
            lengths.
          </p>
        </header>

        <SectionCard>
          <SectionHeader
            icon={<Info size={16} className="text-blue-500" />}
            title="The Problem"
          />
          <div className="px-6 py-6">
            <blockquote className="border-l-4 border-blue-100 pl-4 py-1 italic leading-relaxed text-gray-700">
              “A goat is tethered to one corner of a rectangular shed. The rope is
              longer than the sides of the shed. What is the total area the goat can
              graze?”
            </blockquote>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <SectionCard className="overflow-hidden p-0">
              <div className="border-b border-black/5 bg-gray-50/70 px-6 py-4">
                <h2 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Visual Representation
                </h2>
              </div>

              <div className="bg-gradient-to-b from-slate-50 to-white px-8 py-10">
                <div className="mx-auto max-w-3xl">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-black/5 bg-white shadow-inner">
                    <svg
                      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                      className="h-full w-full"
                    >
                      <defs>
                        <pattern
                          id="goat-hatch"
                          width="8"
                          height="8"
                          patternUnits="userSpaceOnUse"
                          patternTransform="rotate(45)"
                        >
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="8"
                            stroke="rgba(255,255,255,0.18)"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>

                      <motion.path
                        d={generateMainSector()}
                        fill="rgba(37, 99, 235, 0.10)"
                        stroke="#2563eb"
                        strokeWidth="2"
                        initial={false}
                        animate={{ d: generateMainSector() }}
                      />

                      <AnimatePresence>
                        {sectors.path1 && (
                          <motion.path
                            key="secondary-1"
                            d={sectors.path1}
                            fill="rgba(16, 185, 129, 0.10)"
                            stroke="#059669"
                            strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, d: sectors.path1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}

                        {sectors.path2 && (
                          <motion.path
                            key="secondary-2"
                            d={sectors.path2}
                            fill="rgba(16, 185, 129, 0.10)"
                            stroke="#059669"
                            strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, d: sectors.path2 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </AnimatePresence>

                      <rect
                        x={center - shedWidth * scale}
                        y={center - shedHeight * scale}
                        width={shedWidth * scale}
                        height={shedHeight * scale}
                        fill="#1e293b"
                        rx="2"
                      />
                      <rect
                        x={center - shedWidth * scale}
                        y={center - shedHeight * scale}
                        width={shedWidth * scale}
                        height={shedHeight * scale}
                        fill="url(#goat-hatch)"
                        rx="2"
                      />

                      <circle cx={center} cy={center} r="4.5" fill="#ef4444" />
                      <text
                        x={center + 8}
                        y={center + 16}
                        fontSize="12"
                        className="fill-slate-500 font-semibold"
                      >
                        Tether
                      </text>
                    </svg>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>

                      <button
                        onClick={() => setShowHint(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <HelpCircle size={16} />
                        Hint
                      </button>
                    </div>

                    <button
                      onClick={() => setShowFormula((prev) => !prev)}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                        showFormula
                          ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'border border-black/10 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <BookOpen size={16} />
                      {showFormula ? 'Hide Formula' : 'Show Formula'}
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<BookOpen size={16} className="text-amber-500" />}
                title="Generalization"
              />
              <div className="px-6 py-6 space-y-5">
                <AnimatePresence mode="wait">
                  {showFormula ? (
                    <motion.div
                      key="formula"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center">
                        <div className="text-lg font-semibold text-amber-700">
                          Area = ¾πL²
                          {L > shedWidth && <span> + ¼π(L − w)²</span>}
                          {L > shedHeight && <span> + ¼π(L − h)²</span>}
                        </div>
                      </div>

                      <p className="text-sm leading-7 text-gray-600">
                        The goat first sweeps out a three-quarter circle around the
                        tether point. If the rope wraps around a corner, extra
                        quarter-circle sectors appear with reduced radius.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="prompt"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-sm leading-7 text-gray-600"
                    >
                      Try changing the rope length and shed dimensions. Watch for the
                      exact moment when a new corner becomes reachable and creates an
                      additional sector.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Main Sector
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-blue-600">
                      {areaData.main.toFixed(1)} m²
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">
                      Extra Sectors
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-emerald-600">
                      {areaData.secondaryTotal.toFixed(1)} m²
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-black px-4 py-4 text-white">
                    <div className="text-[11px] uppercase tracking-wide text-gray-400">
                      Total Area
                    </div>
                    <div className="mt-1 text-2xl font-semibold">
                      {areaData.total.toFixed(1)} m²
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <SectionCard>
              <SectionHeader
                icon={<Settings size={16} className="text-blue-500" />}
                title="Configuration"
              />
              <div className="space-y-5 px-6 py-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 font-medium text-gray-700">
                      <Maximize2 size={14} />
                      Rope Length (L)
                    </label>
                    <span className="font-mono text-blue-600">{L} m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={L}
                    onChange={(e) => setL(Number(e.target.value))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 font-medium text-gray-700">
                      <Ruler size={14} />
                      Shed Width
                    </label>
                    <span className="font-mono text-blue-600">{shedWidth} m</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={shedWidth}
                    onChange={(e) => setShedWidth(Number(e.target.value))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 font-medium text-gray-700">
                      <Box size={14} />
                      Shed Height
                    </label>
                    <span className="font-mono text-blue-600">{shedHeight} m</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={shedHeight}
                    onChange={(e) => setShedHeight(Number(e.target.value))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeader
                icon={<Lightbulb size={16} className="text-amber-500" />}
                title="Inquiry Prompts"
              />
              <div className="space-y-4 px-6 py-6 text-sm leading-7 text-gray-600">
                <p>
                  What happens when the rope is shorter than both shed dimensions?
                </p>
                <p>
                  At what point does the goat begin to wrap around a second corner?
                </p>
                <p>
                  Can you create a case where the two added sectors have equal area?
                </p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            key="hint-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="space-y-5 p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <HelpCircle size={30} />
                </div>

                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Need a Hint?
                  </h3>
                  <p className="text-sm leading-6 text-slate-500">
                    Use Mason-style moves: specialize first, then vary one thing at a
                    time.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-1 text-xs font-bold uppercase text-blue-600">
                      Specialize
                    </p>
                    <p className="text-sm text-slate-600">
                      Make the rope short. What region do you get before the goat can
                      wrap around any corner?
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="mb-1 text-xs font-bold uppercase text-amber-600">
                      Vary
                    </p>
                    <p className="text-sm text-slate-600">
                      Slowly increase the rope length and watch for the first exact
                      moment a new sector appears.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHint(false)}
                  className="w-full rounded-2xl bg-slate-900 py-4 font-semibold text-white transition hover:bg-slate-800"
                >
                  Back to Explorer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}