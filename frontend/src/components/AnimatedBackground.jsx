import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const numTracks = 120;
    let tracks = [];
    let charSize;

    const initialize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const trackWidth = canvas.width / numTracks;
      charSize = Math.max(1, Math.floor(trackWidth * 0.5));
      if (trackWidth < 3) charSize = 1;

      tracks = [];
      for (let i = 0; i < numTracks; i++) {
        let currentMaxLength = Math.floor(canvas.height / (charSize * 2)) + Math.floor(Math.random() * (canvas.height / (charSize * 3)));
        currentMaxLength = Math.max(30, Math.min(currentMaxLength, Math.floor(canvas.height / charSize * 0.9)));

        if (charSize <= 0) currentMaxLength = 150;

        tracks.push({
          x: i * trackWidth + (trackWidth - charSize) / 2,
          y: Math.random() * canvas.height,
          speed: 1.0 + Math.random() * 3.0,
          baseLightness: 20 + Math.random() * 70,
          trail: [],
          maxLength: currentMaxLength,
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tracks.forEach(track => {
        const newSegment = {
          yPos: track.y,
          lightness: track.baseLightness,
        };
        track.trail.unshift(newSegment);

        while (track.trail.length > track.maxLength) {
          track.trail.pop();
        }

        track.trail.forEach((segment, index) => {
          const ageRatio = index / track.trail.length;
          const alpha = 0.05 + (1 - ageRatio) * 0.8;

          let displayLightness = segment.lightness;
          if (index > 0) {
            displayLightness = Math.max(10, segment.lightness - (ageRatio * 40));
          } else {
            displayLightness = Math.min(95, segment.lightness + 10);
          }
          const finalLightness = Math.max(10, Math.min(95, displayLightness));
          ctx.fillStyle = `hsla(0, 0%, ${finalLightness}%, ${alpha})`;

          ctx.fillRect(Math.floor(track.x), Math.floor(segment.yPos), charSize, charSize);
        });

        track.y += track.speed;

        if (track.y > canvas.height + (track.maxLength * charSize * 0.1)) {
          track.y = -Math.random() * (canvas.height * 0.2);
          track.trail = [];
          track.baseLightness = 20 + Math.random() * 70;
          track.speed = 1.0 + Math.random() * 2.0;

          let newMaxLength = Math.floor(canvas.height / (charSize * 2)) + Math.floor(Math.random() * (canvas.height / (charSize * 3)));
          newMaxLength = Math.max(30, Math.min(newMaxLength, Math.floor(canvas.height / charSize * 0.9)));
          if (charSize <= 0) newMaxLength = 1500;
          track.maxLength = newMaxLength;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initialize();
    draw();

    const handleResize = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      initialize();
      draw();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default AnimatedBackground;
