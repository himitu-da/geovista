// src/components/map/AudioPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  audioBase64: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * Improved audio player component with better error handling
 * and consistent styling
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  onPlay,
  onPause,
  onEnded,
  onError,
  className
}) => {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Hooks
  const { t, language } = useLanguage();

  // Convert base64 audio to a playable source URL
  const createAudioSource = (base64Data: string): string => {
    try {
      // Check if base64 includes the data URI prefix
      const dataUri = base64Data.startsWith('data:') 
        ? base64Data 
        : `data:audio/mp3;base64,${base64Data}`;
      return dataUri;
    } catch (err) {
      console.error('Error creating audio source:', err);
      setError(language === 'es' 
        ? 'Error al procesar el audio' 
        : 'Error processing audio');
      return '';
    }
  };
  
  // Set up audio on component mount or when audioBase64 changes
  useEffect(() => {
    if (!audioBase64) {
      setError(language === 'es'
        ? 'No hay datos de audio disponibles'
        : 'No audio data available');
      setIsLoading(false);
      if (onError) onError("No audio data available");
      return;
    }
    
    setIsLoading(true);
    
    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    try {
      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set up event listeners
      audio.oncanplay = () => {
        setDuration(audio.duration || 0);
        setIsLoaded(true);
        setIsLoading(false);
        setError(null);
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (onEnded) onEnded();
      };
      
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setError(language === 'es' 
          ? 'Error al reproducir audio' 
          : 'Failed to load audio');
        setIsLoaded(false);
        setIsLoading(false);
        
        if (onError) onError("Failed to load audio");
      };
      
      // Set audio properties
      audio.volume = volume;
      audio.preload = 'auto';
      
      // Set audio source from base64
      const audioSrc = createAudioSource(audioBase64);
      audio.src = audioSrc;
      audio.load();
      
      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current = null;
        }
      };
    } catch (err) {
      console.error("Error setting up audio:", err);
      setError(language === 'es' 
        ? 'Error al inicializar el reproductor de audio' 
        : 'Failed to initialize audio player');
      setIsLoading(false);
      if (onError) onError("Failed to initialize audio player");
    }
  }, [audioBase64, onEnded, onError, language]);
  
  // Play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current || !isLoaded) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (onPlay) onPlay();
          })
          .catch(err => {
            console.error("Error playing audio:", err);
            setError(language === 'es' 
              ? 'Error al reproducir audio' 
              : 'Failed to play audio');
          });
      }
    }
  };
  
  // Volume control
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
  
  // Mute toggle
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
  
  // Seek control
  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const seekTime = value[0];
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  // Format time as MM:SS
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500 mb-2" />
          <p className="text-xs text-gray-500">
            {language === 'es' ? 'Cargando audio...' : 'Loading audio...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Error view
  if (error) {
    return (
      <div className="p-2 text-xs text-red-500 bg-red-50 rounded-md border border-red-200 flex items-center gap-1.5">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }
  
  // Audio player view
  return (
    <motion.div 
      className={cn("rounded-md border p-2 bg-white/95 shadow-sm", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2">
        {/* Main controls row */}
        <div className="flex items-center gap-2">
          {/* Play/Pause button */}
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
          
          {/* Time and progress slider */}
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
          
          {/* Volume control */}
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
            
            {/* Volume slider popup */}
            {showVolumeControl && (
              <motion.div 
                className="absolute bottom-full right-0 mb-2 bg-white p-2 rounded-md shadow-md border z-50"
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
        
        {/* Status label */}
        <div className="text-[10px] text-center text-gray-500">
          {isLoaded ? t('textToSpeech') : 
            (language === 'es' ? 'Cargando audio...' : 'Loading audio...')}
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;