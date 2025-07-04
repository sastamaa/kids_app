
import React, { useRef, useEffect } from 'react';
import { Episode, VideoType } from '../types';

interface VideoPlayerProps {
  episode: Episode;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const ControlButton: React.FC<{ onClick?: () => void, children: React.ReactNode, disabled?: boolean, className?: string }> = ({ onClick, children, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-white/80 backdrop-blur-sm text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center ${className}`}
  >
    {children}
  </button>
);

const VideoPlayer: React.FC<VideoPlayerProps> = ({ episode, onClose, onNext, onPrev }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
      const videoElement = videoRef.current;
      if (videoElement && onNext) {
          const handleVideoEnd = () => {
              onNext();
          };
          videoElement.addEventListener('ended', handleVideoEnd);
          return () => {
              videoElement.removeEventListener('ended', handleVideoEnd);
          };
      }
  }, [episode, onNext]);

  const renderVideo = () => {
    if (episode.type === VideoType.YOUTUBE) {
      const videoId = episode.source.includes('watch?v=') ? episode.source.split('v=')[1].split('&')[0] : episode.source;
      const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&hl=el`;
      return (
        <iframe
          className="w-full h-full"
          src={embedSrc}
          title={episode.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    if (episode.type === VideoType.MP4) {
      return (
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          autoPlay
          src={episode.source}
          key={episode.id} // Re-mount component on episode change
        >
          Το πρόγραμμα περιήγησής σας δεν υποστηρίζει την ετικέτα βίντεο.
        </video>
      );
    }

    return <p className="text-white">Μη υποστηριζόμενος τύπος βίντεο.</p>;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fade-in">
      <ControlButton onClick={onClose} className="absolute top-4 left-4 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Πίσω
      </ControlButton>
      
      <div className="absolute top-4 text-white text-xl font-bold z-50 text-center px-24">
          {episode.title}
      </div>

      <div className="w-full h-full max-w-screen-2xl max-h-screen aspect-video bg-black flex items-center justify-center">
        {onPrev && (
            <ControlButton onClick={onPrev} className="absolute left-4 z-50 bottom-1/2 translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </ControlButton>
        )}
        {renderVideo()}
        {onNext && (
            <ControlButton onClick={onNext} className="absolute right-4 z-50 bottom-1/2 translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </ControlButton>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;