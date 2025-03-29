// src/components/map/AudioPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
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
 * Enhanced AudioPlayer component with improved error handling and fallback
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
  const [hasRetried, setHasRetried] = useState(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Hooks
  const { t } = useLanguage();
  
  // Set up audio on component mount or audioBase64 change
  useEffect(() => {
    if (!audioBase64) {
      setError("No audio data available");
      if (onError) onError("No audio data available");
      return;
    }
    
    // Clean up previous audio elements
    cleanupAudio();
    
    try {
      console.log("Initializing audio with base64 data");
      
      // Create new audio element
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set up event listeners
      const handleCanPlay = () => {
        console.log("Audio can play, duration:", audio.duration);
        setDuration(audio.duration || 0);
        setIsLoaded(true);
        setError(null);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
        setCurrentTime(0);
        if (onEnded) onEnded();
      };
      
      const handleError = (e: Event) => {
        console.error("Audio error:", e);
        setError("Failed to load audio");
        setIsLoaded(false);
        
        if (onError) onError("Failed to load audio");
        
        // Try alternative audio loading method if we haven't already
        if (!hasRetried) {
          retryWithAlternativeMethod();
        }
      };
      
      // Add event listeners
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      // Set audio properties
      audio.volume = volume;
      audio.preload = 'auto';
      
      // Set audio source - handle both formats of base64 data
      const audioSrc = audioBase64.startsWith('data:') 
        ? audioBase64 
        : `data:audio/mp3;base64,${audioBase64}`;
      
      audio.src = audioSrc;
      audio.load();
      
      // Cleanup function
      return () => {
        cleanupAudio();
      };
    } catch (err) {
      console.error("Error setting up audio:", err);
      setError("Failed to initialize audio player");
      if (onError) onError("Failed to initialize audio player");
      return () => {};
    }
  }, [audioBase64, onEnded, onError, volume]);
  
  // Clean up audio resources
  const cleanupAudio = () => {
    if (audioRef.current) {
      // Remove all event listeners by cloning without events
      const oldAudio = audioRef.current;
      oldAudio.pause();
      
      // Remove event listeners
      oldAudio.oncanplay = null;
      oldAudio.ontimeupdate = null;
      oldAudio.onended = null;
      oldAudio.onerror = null;
      
      // Clear source and release
      oldAudio.src = '';
      audioRef.current = null;
    }
    
    // Clean up audio context if it exists
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (e) {
        console.error("Error closing AudioContext:", e);
      }
      audioContextRef.current = null;
    }
  };
  
  // Alternative loading method using Web Audio API
  const retryWithAlternativeMethod = () => {
    console.log("Retrying with alternative audio loading method");
    setHasRetried(true);
    
    try {
      // Clean up existing audio
      cleanupAudio();
      
      // Create a new audio element
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set volume and event handlers
      audio.volume = volume;
      
      audio.oncanplay = () => {
        console.log("Alternative audio loading successful");
        setDuration(audio.duration || 10); // Fallback to 10 seconds if duration is not available
        setIsLoaded(true);
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
      
      audio.onerror = () => {
        console.error("Alternative audio loading failed");
        setError("Could not play audio. Please try again later.");
        setIsLoaded(false);
        if (onError) onError("Could not play audio after multiple attempts");
      };
      
      // Set source
      const audioSrc = audioBase64.startsWith('data:') 
        ? audioBase64 
        : `data:audio/mp3;base64,${audioBase64}`;
      
      audio.src = audioSrc;
      audio.load();
    } catch (e) {
      console.error("Alternative loading method failed:", e);
      setError("Audio playback is not supported in this browser");
      if (onError) onError("Audio playback is not supported");
    }
  };
  
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
            setError("Failed to play audio - browser may block autoplay");
            
            // Try alternative play approach
            const userInteractionPlay = () => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => {
                    setIsPlaying(true);
                    if (onPlay) onPlay();
                    setError(null);
                  })
                  .catch(e => {
                    console.error("Second play attempt failed:", e);
                    setError("Audio playback blocked by browser");
                  });
              }
              
              // Remove the event listeners
              document.removeEventListener('click', userInteractionPlay);
              document.removeEventListener('touchstart', userInteractionPlay);
            };
            
            // Add event listeners to retry after user interaction
            document.addEventListener('click', userInteractionPlay, { once: true });
            document.addEventListener('touchstart', userInteractionPlay, { once: true });
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
  
  // If there's an error, show error message
  if (error) {
    return (
      <div className="p-2 text-xs text-red-500 bg-red-50 rounded-md border border-red-200 flex items-center gap-1.5">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />
        <span>{error} - {t('tryAgainLater')}</span>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={cn("rounded-md border p-2 bg-white/95 shadow-sm", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-2">
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
          {isLoaded ? t('textToSpeech') : "Loading audio..."}
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;