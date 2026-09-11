/**
 * Single-purpose component: Individual horror anomaly card in the stream.
 * Renders classified documents, cursed interactive buttons, distorted logs,
 * and twitching visual specimens with dynamic Zalgo and chromatic breakdown.
 *
 * Localized aggressive shaking: Cards, badges, and creepy visual artifacts
 * vibrate and spasm violently during shocks and at deep corruption, without shaking the whole page.
 */

import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import { HorrorItem } from '../types/horror';
import { zalgoText } from '../utils/zalgo';
import { horrorAudioEngine } from '../audio/horrorAudioEngine';
import {
  AlertCircle,
  Skull,
  Terminal,
  Eye,
  Radio,
  ShieldAlert,
  Camera,
  FileWarning,
  Activity,
  FileText,
  Sparkles,
  Stethoscope,
  Volume2,
  Clapperboard,
  Link2
} from 'lucide-react';
import { drawRealisticEye } from '../effects/realEye';
import { formatDepth } from '../utils/depthScale';
import { CorruptedImage } from './CorruptedImage';
import { CorruptedVideo } from './CorruptedVideo';
import { RedactedText } from './RedactedText';
import { InteractiveAudioLog } from './InteractiveAudioLog';
import { CursedRadioScanner } from './CursedRadioScanner';
import { HeartbeatMonitor } from './HeartbeatMonitor';
import { CctvMatrixViewer } from './CctvMatrixViewer';

interface HorrorTileProps {
  item: HorrorItem;
  globalCorruption: number;
  isViolentShock?: boolean;
  onTriggerAggressiveShock: (intensity: number) => void;
}

const HorrorTileInner: React.FC<HorrorTileProps> = ({
  item,
  globalCorruption,
  isViolentShock = false,
  onTriggerAggressiveShock
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const eyeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);

  // Local corruption: global 0-100 scaled + small item variance (no double-count)
  const effectiveCorruption = Math.min(
    1.2,
    globalCorruption / 100 + Math.min(0.3, Math.max(0, item.glitchSeverity) * 0.2)
  );
  const corruptionBucket = Math.round(effectiveCorruption * 5);

  const corruptedTitle = useMemo(
    () => zalgoText(item.title, effectiveCorruption * 0.35),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.title, corruptionBucket]
  );
  const corruptedContent = useMemo(
    () => zalgoText(item.content, effectiveCorruption * 0.65),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item.content, corruptionBucket]
  );

  // Render realistic eye in specimen card — viewport-gated, ~30fps
  useEffect(() => {
    if (item.type !== 'eye-specimen' || !eyeCanvasRef.current) return;
    const canvas = eyeCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastFrame = 0;
    let visible = true;
    let targetX = 60;
    let targetY = 60;

    const handlePointer = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handlePointer, { passive: true });

    const io = new IntersectionObserver(
      entries => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '200px' }
    );
    if (articleRef.current) io.observe(articleRef.current);

    const blood = Math.min(1, effectiveCorruption * 1.2);
    const renderEye = (time: number) => {
      animId = requestAnimationFrame(renderEye);
      if (!visible || document.hidden) return;
      if (time - lastFrame < 33) return;
      lastFrame = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const blinkCycle = (time + 1200) % 4200;
      const blink = blinkCycle < 140 ? 0.9 : 0;
      drawRealisticEye(ctx, 60, 60, 44, targetX, targetY, blood, 11, blink);
    };

    animId = requestAnimationFrame(renderEye);

    return () => {
      window.removeEventListener('mousemove', handlePointer);
      io.disconnect();
      cancelAnimationFrame(animId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.type, corruptionBucket]);

  const handleTileHover = () => {
    if (!isHovered && effectiveCorruption > 0.25) {
      horrorAudioEngine.triggerAggressiveEvent(0.4 + effectiveCorruption * 0.4);
    }
    setIsHovered(true);
  };

  const handleCursedButtonClick = () => {
    setClicked(true);
    horrorAudioEngine.triggerAggressiveEvent(1.8);
    onTriggerAggressiveShock(1.6);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    horrorAudioEngine.triggerAggressiveEvent(1.2);
    onTriggerAggressiveShock(1.2);
  };

  // Chaotic displacement and structural breakdown styling as depth escalates
  const chaos = item.chaosProfile;

  // Alignment classes for varied widths and irregular placement in the stream
  const alignmentClass = React.useMemo(() => {
    if (!chaos) return 'w-full mx-auto';
    switch (chaos.alignment) {
      case 'flush-left':
        return 'mr-auto';
      case 'flush-right':
        return 'ml-auto';
      case 'drift-left':
        return 'mr-auto';
      case 'drift-right':
        return 'ml-auto';
      case 'overhang-left':
        return '-ml-2 sm:-ml-8 mr-auto';
      case 'overhang-right':
        return '-mr-2 sm:-mr-8 ml-auto';
      case 'full-bleed':
        return '-mx-2 sm:-mx-6';
      case 'compressed-narrow':
        return 'mx-auto';
      case 'center':
      default:
        return 'mx-auto';
    }
  }, [chaos]);

  const rot = (item.rotation || 0) + (chaos?.rotationDeg || 0);
  const skewX = chaos?.skewXDeg || 0;
  const skewY = chaos?.skewYDeg || 0;
  const scaleX = (item.scale || 1) * (chaos?.scaleX || 1);
  const scaleY = chaos?.scaleY || 1;
  const dispX = (item.displacementX || 0) + (chaos?.marginLeftOffsetPx || 0);
  const dispY = item.displacementY || 0;

  const transformStyle: React.CSSProperties = {
    transform: `translate(${dispX.toFixed(1)}px, ${dispY.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) skew(${skewX.toFixed(2)}deg, ${skewY.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
    width: chaos ? `${chaos.widthPercent}%` : '100%',
    marginTop: chaos && chaos.marginTopOffsetPx !== 0 ? `${chaos.marginTopOffsetPx}px` : undefined,
    zIndex: chaos?.zIndex || 10,
    clipPath: chaos?.clipPolygon || undefined,
    paddingTop: chaos ? `${chaos.paddingTopRem.toFixed(2)}rem` : undefined,
    paddingBottom: chaos ? `${chaos.paddingBottomRem.toFixed(2)}rem` : undefined,
    paddingLeft: chaos ? `${chaos.paddingLeftRem.toFixed(2)}rem` : undefined,
    paddingRight: chaos ? `${chaos.paddingRightRem.toFixed(2)}rem` : undefined,
    borderTopWidth: chaos ? `${chaos.borderAsymmetry.topWidth}px` : undefined,
    borderRightWidth: chaos ? `${chaos.borderAsymmetry.rightWidth}px` : undefined,
    borderBottomWidth: chaos ? `${chaos.borderAsymmetry.bottomWidth}px` : undefined,
    borderLeftWidth: chaos ? `${chaos.borderAsymmetry.leftWidth}px` : undefined,
    borderStyle: chaos ? chaos.borderAsymmetry.borderStyle : undefined,
    transition: 'transform 0.2s ease-out, width 0.3s ease-out',
    textShadow:
      effectiveCorruption > 0.1
        ? `${(effectiveCorruption * 3).toFixed(1)}px 0 0 rgba(255, 0, 50, ${Math.min(0.8, effectiveCorruption)}), -${(effectiveCorruption * 3).toFixed(1)}px 0 0 rgba(0, 220, 255, ${Math.min(0.8, effectiveCorruption)})`
        : undefined
  };

  // Shaking condition: during a violent shock or when corrupted beyond threshold
  const shouldShake = isViolentShock || (effectiveCorruption > 0.85 && isHovered);

  return (
    <article
      ref={articleRef}
      id={`horror-item-${item.id}`}
      style={transformStyle}
      onMouseEnter={handleTileHover}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded border p-5 font-mono text-sm shadow-2xl transition-colors duration-200 ${alignmentClass} ${shouldShake ? 'animate-element-shake' : ''
        } ${effectiveCorruption > 0.65
          ? 'bg-red-950/25 border-red-700/80 shadow-red-950/50 text-red-200'
          : effectiveCorruption > 0.3
            ? 'bg-neutral-900/90 border-neutral-700/70 text-neutral-200'
            : 'bg-neutral-950/85 border-neutral-800/80 text-neutral-300'
        } ${isHovered ? 'ring-1 ring-red-500/60' : ''}`}
    >
      {/* Ghost Duplicate Silhouette */}
      {chaos?.ghostDuplicate && (
        <div
          style={{
            transform: `translate(${chaos.ghostDuplicate.offsetX}px, ${chaos.ghostDuplicate.offsetY}px)`,
            borderColor: chaos.ghostDuplicate.color,
            opacity: chaos.ghostDuplicate.opacity
          }}
          className="absolute inset-0 border-2 border-dashed pointer-events-none -z-10 rounded"
        />
      )}

      {/* Detached Floating Stamp */}
      {chaos?.detachedStamp && (
        <div
          style={{
            top: chaos.detachedStamp.top,
            left: chaos.detachedStamp.left,
            right: chaos.detachedStamp.right,
            transform: `rotate(${chaos.detachedStamp.rotationDeg}deg)`
          }}
          className="absolute bg-red-600 text-black font-black px-2 py-0.5 text-[9px] uppercase tracking-wider shadow-lg pointer-events-none z-30 border border-black"
        >
          ⚠ {chaos.detachedStamp.label}
        </div>
      )}
      {/* Top Header / Stamp */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <div className={`flex items-center gap-2 ${shouldShake ? 'animate-artifact-spasm' : ''}`}>
          {item.type === 'archival-photo' && <Camera className="w-4 h-4 text-amber-400" />}
          {item.type === 'surveillance-capture' && <Radio className="w-4 h-4 text-emerald-400" />}
          {item.type === 'incident-report' && <ShieldAlert className="w-4 h-4 text-amber-500" />}
          {item.type === 'distress-log' && <FileWarning className="w-4 h-4 text-cyan-400" />}
          {item.type === 'corrupted-terminal' && <Terminal className="w-4 h-4 text-emerald-400" />}
          {item.type === 'cursed-button' && <Skull className="w-4 h-4 text-red-500 animate-pulse" />}
          {item.type === 'eye-specimen' && <Eye className="w-4 h-4 text-red-400" />}
          {item.type === 'system-error' && <AlertCircle className="w-4 h-4 text-red-600" />}
          {item.type === 'black-box-audio' && <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
          {item.type === 'redacted-dossier' && <FileText className="w-4 h-4 text-neutral-300" />}
          {item.type === 'radio-scanner' && <Radio className="w-4 h-4 text-amber-400 animate-pulse" />}
          {item.type === 'heartbeat-sensor' && <Activity className="w-4 h-4 text-red-500 animate-pulse" />}
          {item.type === 'cosmic-aberration' && <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />}
          {item.type === 'autopsy-record' && <Stethoscope className="w-4 h-4 text-rose-400" />}
          {item.type === 'cctv-matrix' && <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />}
          {item.type === 'found-film' && <Clapperboard className="w-4 h-4 text-red-400" />}
          {item.type === 'found-audio' && <Volume2 className="w-4 h-4 text-amber-300" />}
          {item.type === 'link-card' && <Link2 className="w-4 h-4 text-neutral-300" />}

          <h3 className="font-bold text-xs tracking-wider uppercase text-white/90">
            {corruptedTitle}
          </h3>
        </div>

        <span className="text-[10px] tracking-widest text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
          found at {formatDepth(item.depthThreshold)}
        </span>
      </div>

      {/* Corrupted Internet Image Specimen (Creepy Artifact) - Hide on CCTV matrix since it has its own viewer */}
      {item.imageSpecimen && item.type !== 'cctv-matrix' && item.type !== 'found-film' && (
        <CorruptedImage
          specimen={item.imageSpecimen}
          severity={effectiveCorruption}
          isViolentShock={shouldShake}
          onInteraction={() => onTriggerAggressiveShock(0.8 + effectiveCorruption * 0.6)}
        />
      )}

      {/* Found film — direct mp4 loop, rots with depth */}
      {item.type === 'found-film' && item.extraMeta?.loopSrc ? (
        <CorruptedVideo
          src={String(item.extraMeta.loopSrc)}
          pageUrl={String(item.extraMeta.pageUrl || item.extraMeta.sourceUrl || '')}
          label={String(item.extraMeta.loopCredit ? item.title : item.title)}
          credit={String(item.extraMeta.loopCredit || item.extraMeta.source || '')}
          depthMeters={item.depthThreshold}
          isViolentShock={shouldShake}
        />
      ) : null}

      {/* Link cards + found audio — open out, never autoplay */}
      {(item.type === 'link-card' || item.type === 'found-audio') && item.extraMeta?.linkUrl ? (
        <a
          href={String(item.extraMeta.linkUrl)}
          target="_blank"
          rel="noreferrer"
          className="my-3 flex items-center justify-between gap-2 rounded border border-neutral-700 bg-neutral-900/70 px-3 py-2 font-mono text-[11px] text-neutral-300 hover:border-red-600 hover:text-white"
        >
          <span className="truncate">{String(item.extraMeta.linkLabel || item.title)}</span>
          <span className="shrink-0 uppercase text-red-400">open →</span>
        </a>
      ) : null}

      {/* Narrative or Warning Content with Redaction Support */}
      <div className="text-xs sm:text-sm leading-relaxed text-neutral-300 mb-3 whitespace-pre-wrap break-words">
        {item.type === 'redacted-dossier' || corruptedContent.includes('[REDACTED:') ? (
          <RedactedText
            text={corruptedContent}
            onReveal={() => onTriggerAggressiveShock(0.6 + effectiveCorruption * 0.4)}
          />
        ) : (
          corruptedContent
        )}
      </div>

      {/* Verbatim source — every word above is pasted, linked here */}
      {item.extraMeta?.sourceUrl && (
        <div className="mb-3 font-mono text-[10px] text-neutral-500">
          <span className="italic">{String(item.extraMeta.source || 'source')}</span>
          {' — '}
          <a href={String(item.extraMeta.sourceUrl)} target="_blank" rel="noreferrer" className="text-red-400 underline">
            read full →
          </a>
        </div>
      )}
      {(item.type === 'black-box-audio' || item.type === 'found-audio') && (
        <InteractiveAudioLog
          title={item.title}
          frequency={String(item.extraMeta?.audioFreq || '142.85 MHz')}
          speaker={String(item.extraMeta?.speaker || '')}
          audioUrl={item.extraMeta?.audioUrl ? String(item.extraMeta.audioUrl) : undefined}
          audioCredit={item.extraMeta?.audioCredit ? String(item.extraMeta.audioCredit) : undefined}
          isViolentShock={shouldShake}
        />
      )}

      {/* Interactive Cursed Radio Scanner Component */}
      {item.type === 'radio-scanner' && (
        <CursedRadioScanner
          initialFreq={String(item.extraMeta?.defaultFreq || '114.2 kHz')}
          isViolentShock={shouldShake}
        />
      )}

      {/* Interactive Biometric Heartbeat EKG Component */}
      {item.type === 'heartbeat-sensor' && (
        <HeartbeatMonitor
          baseBpm={Number(item.extraMeta?.currentBpm) || 78}
          corruptionLevel={globalCorruption}
          isViolentShock={shouldShake}
        />
      )}

      {/* Interactive CCTV Matrix Component */}
      {item.type === 'cctv-matrix' && (
        <CctvMatrixViewer
          initialSpecimen={item.imageSpecimen}
          isViolentShock={shouldShake}
        />
      )}

      {/* Eye Specimen Interactive Canvas (Creepy Artifact) */}
      {item.type === 'eye-specimen' && (
        <div className={`flex flex-col items-center justify-center p-3 bg-neutral-950 border border-neutral-800 rounded mb-3 ${shouldShake ? 'animate-artifact-spasm' : ''}`}>
          <canvas
            ref={eyeCanvasRef}
            width={120}
            height={120}
            className="rounded-full shadow-inner border border-red-950/80"
          />
          <span className="text-[10px] text-red-400/80 mt-2 tracking-widest uppercase">
            who are you
          </span>
        </div>
      )}

      {/* Cursed Interactive Button */}
      {item.type === 'cursed-button' && (
        <div className="mt-3">
          <button
            id={`btn-cursed-${item.id}`}
            onClick={handleCursedButtonClick}
            className={`w-full py-2.5 px-4 rounded font-bold text-xs uppercase tracking-widest border transition-all active:scale-95 ${shouldShake ? 'animate-artifact-spasm' : ''
              } ${clicked
                ? 'bg-red-950 text-red-400 border-red-600 animate-pulse'
                : 'bg-red-900/80 hover:bg-red-700 text-white border-red-600/80 shadow-lg shadow-red-950/50 cursor-pointer'
              }`}
          >
            {clicked ? 'stuck. it keeps going' : String(item.extraMeta?.buttonLabel || 'touch it')}
          </button>
        </div>
      )}

      {/* Cursed Survey Question */}
      {item.type === 'creepy-survey' && (
        <div className="space-y-2 mt-3">
          <button
            id={`survey-${item.id}-a`}
            onClick={() => handleOptionSelect(String(item.extraMeta?.optionA))}
            className={`w-full text-left p-2.5 rounded border text-xs transition-all cursor-pointer ${selectedOption === item.extraMeta?.optionA
                ? 'bg-red-950 border-red-600 text-red-300 font-bold'
                : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}
          >
            [A] {String(item.extraMeta?.optionA)}
          </button>
          <button
            id={`survey-${item.id}-b`}
            onClick={() => handleOptionSelect(String(item.extraMeta?.optionB))}
            className={`w-full text-left p-2.5 rounded border text-xs transition-all cursor-pointer ${selectedOption === item.extraMeta?.optionB
                ? 'bg-red-950 border-red-600 text-red-300 font-bold'
                : 'bg-neutral-900/60 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}
          >
            [B] {String(item.extraMeta?.optionB)}
          </button>
        </div>
      )}

      {/* Extra Metadata Footer */}
      {item.extraMeta && (
        <div className="mt-3 pt-2 border-t border-neutral-800/80 flex flex-wrap gap-2 text-[10px] text-neutral-400">
          {Object.entries(item.extraMeta).map(([k, v]) => {
            if (k === 'buttonLabel' || k === 'optionA' || k === 'optionB') return null;
            if (k === 'linkUrl' || k === 'linkLabel' || k === 'linkKind') return null;
            if (k === 'source' || k === 'sourceUrl' || k === 'depthOffset') return null;
            if (k === 'loopSrc' || k === 'pageUrl' || k === 'loopCredit') return null;
            if (k === 'audioUrl' || k === 'audioCredit') return null;
            if (k === 'hasInteractiveWaveform' || k === 'isRadioScanner' || k === 'isHeartbeatSensor' || k === 'isCctvMatrix' || k === 'isRedacted' || k === 'redactionsCount' || k === 'disclosureRisk') return null;
            return (
              <span key={k} className="bg-neutral-900/80 px-1.5 py-0.5 rounded border border-neutral-800">
                <strong className="text-neutral-300 uppercase">{k}:</strong> {String(v)}
              </span>
            );
          })}
        </div>
      )}
      <div className="mt-2 font-mono text-[9px] text-neutral-600">
        sources: gutenberg (pd) / archive.org (pd) / commons (pd) / freesound (cc0/by)
      </div>
    </article>
  );
};

export const HorrorTile = memo(HorrorTileInner, (prev, next) => {
  return (
    prev.item.id === next.item.id &&
    Math.round(prev.globalCorruption / 8) === Math.round(next.globalCorruption / 8) &&
    prev.isViolentShock === next.isViolentShock
  );
});
