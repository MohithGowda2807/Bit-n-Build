import React, { useEffect, useRef } from 'react';

interface Particle {
 x: number;
 y: number;
 vx: number;
 vy: number;
 size: number;
 color: string;
 alpha: number;
 pulseSpeed: number;
}

interface VesselBlip {
 x: number;
 y: number;
 vx: number;
 vy: number;
 name: string;
 type: string;
 heading: number;
 trail: { x: number; y: number }[];
}

export const OceanCanvasBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
 const canvasRef = useRef<HTMLCanvasElement | null>(null);

 useEffect(() => {
 const canvas = canvasRef.current;
 if (!canvas) return;
 const ctx = canvas.getContext('2d');
 if (!ctx) return;

 let animId: number;
 let width = (canvas.width = window.innerWidth);
 let height = (canvas.height = window.innerHeight);

 const handleResize = () => {
 if (!canvas) return;
 width = canvas.width = window.innerWidth;
 height = canvas.height = window.innerHeight;
    };
 window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle ripples
 let mouseX = width / 2;
 let mouseY = height / 2;
 let isMouseOver = false;

 const onMouseMove = (e: MouseEvent) => {
 const rect = canvas.getBoundingClientRect();
 mouseX = e.clientX - rect.left;
 mouseY = e.clientY - rect.top;
 isMouseOver = true;
    };
 const onMouseLeave = () => {
 isMouseOver = false;
    };
 window.addEventListener('mousemove', onMouseMove);
 document.addEventListener('mouseleave', onMouseLeave);

    // Initialize debris / bioluminescent ocean particles
 const particles: Particle[] = [];
 const particleCount = Math.min(80, Math.floor(width / 20));
 for (let i = 0; i < particleCount; i++) {
 particles.push({
 x: Math.random() * width,
 y: Math.random() * height,
 vx: (Math.random() - 0.5) * 0.4 + 0.3, // slight drift eastward
 vy: (Math.random() - 0.5) * 0.3,
 size: Math.random() * 2.5 + 1,
 color: Math.random() > 0.4 ? '#3d9bff' : Math.random() > 0.5 ? '#3d9bff' : '#2fae6e',
 alpha: Math.random() * 0.6 + 0.2,
 pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    // Initialize simulated commercial & autonomous vessels
 const vessels: VesselBlip[] = [
      { x: width * 0.15, y: height * 0.4, vx: 0.45, vy: -0.15, name: 'MV Ocean Star', type: 'Cargo', heading: 65, trail: [] },
      { x: width * 0.75, y: height * 0.65, vx: -0.4, vy: -0.2, name: 'ASV Skimmer-01', type: 'Autonomous', heading: 240, trail: [] },
      { x: width * 0.4, y: height * 0.8, vx: 0.35, vy: -0.3, name: 'Bharat Sentinel', type: 'Patrol', heading: 320, trail: [] },
      { x: width * 0.6, y: height * 0.25, vx: -0.3, vy: 0.25, name: 'Eco Interceptor B', type: 'Drone', heading: 140, trail: [] }
    ];

 let radarAngle = 0;
 let waveTime = 0;

 const render = () => {
 waveTime += 0.015;
 radarAngle = (radarAngle + 0.008) % (Math.PI * 2);

      // Deep ocean dark gradient clear
 ctx.fillStyle = '#060a12';
 ctx.fillRect(0, 0, width, height);

      // 1. Draw Bathymetric / Ocean Depth Contour Wave Lines
 ctx.lineWidth = 1;
 const waveCount = 5;
 for (let w = 0; w < waveCount; w++) {
 ctx.beginPath();
 const baseOffset = height * (0.2 + w * 0.16);
 const freq = 0.0018 + w * 0.0004;
 const speed = waveTime * (0.6 + w * 0.2);
 ctx.strokeStyle = `rgba(14, 116, 144, ${0.06 + w * 0.025})`;

 for (let x = 0; x <= width; x += 12) {
          // Sine + Cosine combined harmonics
 let y = baseOffset + Math.sin(x * freq + speed) * 35 + Math.cos(x * freq * 1.5 - speed * 0.8) * 20;

          // Mouse ripple influence
 if (isMouseOver) {
 const dist = Math.hypot(x - mouseX, y - mouseY);
 if (dist < 180) {
 const repel = (1 - dist / 180) * 24;
 y += Math.sin(dist * 0.05 - waveTime * 4) * repel;
            }
          }

 if (x === 0) ctx.moveTo(x, y);
 else ctx.lineTo(x, y);
        }
 ctx.stroke();
      }

      // 2. Draw Nautical Navigation Grid Lines
 ctx.strokeStyle = 'rgba(0, 122, 252, 0.035)';
 ctx.lineWidth = 1;
 const gridSize = 100;
 for (let x = 0; x < width; x += gridSize) {
 ctx.beginPath();
 ctx.moveTo(x, 0);
 ctx.lineTo(x, height);
 ctx.stroke();
      }
 for (let y = 0; y < height; y += gridSize) {
 ctx.beginPath();
 ctx.moveTo(0, y);
 ctx.lineTo(width, y);
 ctx.stroke();
      }

      // 3. Central Tactical Surveillance Radar Rings
 const cx = width * 0.72;
 const cy = height * 0.45;
 const maxRadarRadius = Math.min(width, height) * 0.48;

 ctx.strokeStyle = 'rgba(0, 122, 252, 0.08)';
 ctx.lineWidth = 1.2;
 for (let r = 1; r <= 4; r++) {
 const rad = (maxRadarRadius / 4) * r;
 ctx.beginPath();
 ctx.arc(cx, cy, rad, 0, Math.PI * 2);
 ctx.stroke();

        // Range text
 ctx.fillStyle = 'rgba(0, 122, 252, 0.25)';
 ctx.font = '10px monospace';
 ctx.fillText(`${r * 40} NM`, cx + rad - 32, cy - 6);
      }

      // Crosshairs
 ctx.beginPath();
 ctx.moveTo(cx - maxRadarRadius, cy);
 ctx.lineTo(cx + maxRadarRadius, cy);
 ctx.moveTo(cx, cy - maxRadarRadius);
 ctx.lineTo(cx, cy + maxRadarRadius);
 ctx.stroke();

      // Radar Sweep Fan
 const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadarRadius);
 sweepGradient.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
 sweepGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

 ctx.save();
 ctx.beginPath();
 ctx.moveTo(cx, cy);
 ctx.arc(cx, cy, maxRadarRadius, radarAngle - 0.4, radarAngle);
 ctx.closePath();
 ctx.fillStyle = sweepGradient;
 ctx.fill();

      // Radar Sweep Leading Beam
 ctx.beginPath();
 ctx.moveTo(cx, cy);
 ctx.lineTo(cx + Math.cos(radarAngle) * maxRadarRadius, cy + Math.sin(radarAngle) * maxRadarRadius);
 ctx.strokeStyle = 'rgba(0, 122, 252, 0.5)';
 ctx.lineWidth = 1.8;
 ctx.stroke();
 ctx.restore();

      // 4. Update and Draw Bioluminescent Particles (Debris & Microplastics)
 for (let i = 0; i < particles.length; i++) {
 const p = particles[i];
 p.x += p.vx;
 p.y += p.vy;

        // Wrap edges
 if (p.x < 0) p.x = width;
 if (p.x > width) p.x = 0;
 if (p.y < 0) p.y = height;
 if (p.y > height) p.y = 0;

 p.alpha += Math.sin(waveTime * 5 + i) * p.pulseSpeed;
 const currentAlpha = Math.max(0.1, Math.min(0.85, p.alpha));

 ctx.fillStyle = p.color;
 ctx.globalAlpha = currentAlpha;
 ctx.beginPath();
 ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
 ctx.fill();

        // Soft halo
 ctx.fillStyle = p.color;
 ctx.globalAlpha = currentAlpha * 0.25;
 ctx.beginPath();
 ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
 ctx.fill();
      }
 ctx.globalAlpha = 1;

      // 5. Draw Simulated AIS Vessels & Track Histories
 for (const v of vessels) {
 v.x += v.vx;
 v.y += v.vy;

        // Bounds wrap
 if (v.x < 0) v.x = width;
 if (v.x > width) v.x = 0;
 if (v.y < 0) v.y = height;
 if (v.y > height) v.y = 0;

        // Trail
 v.trail.push({ x: v.x, y: v.y });
 if (v.trail.length > 28) v.trail.shift();

        // Draw trail polyline
 if (v.trail.length > 1) {
 ctx.beginPath();
 ctx.moveTo(v.trail[0].x, v.trail[0].y);
 for (let j = 1; j < v.trail.length; j++) {
 ctx.lineTo(v.trail[j].x, v.trail[j].y);
          }
 ctx.strokeStyle = v.type === 'Autonomous' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(0, 122, 252, 0.3)';
 ctx.lineWidth = 1.5;
 ctx.setLineDash([4, 4]);
 ctx.stroke();
 ctx.setLineDash([]);
        }

        // Draw vessel blip
 const isAutonomous = v.type === 'Autonomous' || v.type === 'Drone';
 const color = isAutonomous ? '#2fae6e' : '#3d9bff';

        // Pulse glow
 ctx.fillStyle = color;
 ctx.shadowColor = color;
 ctx.shadowBlur = 12;
 ctx.beginPath();
 ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
 ctx.fill();
 ctx.shadowBlur = 0;

        // Vessel Label
 ctx.fillStyle = '#bbc2ce';
 ctx.font = '10px monospace';
 ctx.fillText(v.name, v.x + 8, v.y - 4);

 ctx.fillStyle = color;
 ctx.font = '9px monospace';
 ctx.fillText(`● ${v.type.toUpperCase()}`, v.x + 8, v.y + 8);
      }

 animId = requestAnimationFrame(render);
    };

 render();

 return () => {
 cancelAnimationFrame(animId);
 window.removeEventListener('resize', handleResize);
 window.removeEventListener('mousemove', onMouseMove);
 document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

 return (
    <canvas
 ref={canvasRef}
 className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
