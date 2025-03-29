
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  audioBase64: string | null;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  onPlay,
  onPause,
  onEnded,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useLanguage();
  
  // オーディオ要素を初期化
  useEffect(() => {
    if (!audioBase64) return;
    
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audioRef.current = audio;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    });
    
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioBase64, onEnded]);
  
  // 再生/一時停止の切り替え
  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (onPlay) onPlay();
    }
  };
  
  // 音量の制御
  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    
    audioRef.current.volume = newVolume;
  };
  
  // ミュート切り替え
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    
    if (newMuteState) {
      audioRef.current.volume = 0;
    } else {
      audioRef.current.volume = volume;
    }
  };
  
  // シークバーでの再生位置調整
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const seekTime = value[0];
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  // 時間のフォーマット（mm:ss）
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (!audioBase64) return null;
  
  return (
    <motion.div 
      className={cn("rounded-md border p-2 bg-white/95 shadow-sm", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={togglePlay}
            disabled={!isLoaded}
            title={isPlaying ? t('pause') : t('play')}
          >
            {isPlaying ? 
              <Pause className="h-3 w-3" /> : 
              <Play className="h-3 w-3" />
            }
          </Button>
          
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-gray-500 w-8 text-right">
              {formatTime(currentTime)}
            </span>
            
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
              disabled={!isLoaded}
            />
            
            <span className="text-xs text-gray-500 w-8">
              {formatTime(duration)}
            </span>
          </div>
          
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 flex-shrink-0"
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeControl(true)}
              title={isMuted ? t('unmute') : t('mute')}
            >
              {isMuted ? 
                <VolumeX className="h-3 w-3" /> : 
                <Volume2 className="h-3 w-3" />
              }
            </Button>
            
            {showVolumeControl && (
              <motion.div 
                className="absolute bottom-full right-0 mb-2 bg-white p-2 rounded-md shadow-md border"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onMouseLeave={() => setShowVolumeControl(false)}
              >
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="h-16"
                  orientation="vertical"
                />
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="text-[10px] text-center text-gray-500">
          {t('textToSpeech')}
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
