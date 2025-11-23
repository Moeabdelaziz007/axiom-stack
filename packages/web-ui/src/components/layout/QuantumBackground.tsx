'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export default function QuantumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let nodes: Node[] = [];

    // Theme-based colors
    const getColors = () => {
      switch (currentTheme) {
        case 'solar':
          return {
            bg: '#0a1a1a',
            particle: 'rgba(255, 215, 0, 0.5)', // Gold
            node: 'rgba(0, 255, 127, 0.3)', // Spring Green
            line: 'rgba(255, 215, 0, 0.1)'
          };
        case 'matrix':
          return {
            bg: '#000000',
            particle: 'rgba(0, 255, 0, 0.5)',
            node: 'rgba(0, 255, 0, 0.3)',
            line: 'rgba(0, 255, 0, 0.1)'
          };
        case 'nebula':
          return {
            bg: '#1a0b2e',
            particle: 'rgba(255, 0, 255, 0.5)',
            node: 'rgba(0, 255, 255, 0.3)',
            line: 'rgba(138, 43, 226, 0.1)'
          };
        case 'void':
        default:
          return {
            bg: '#0A0E27',
            particle: 'rgba(0, 255, 255, 0.5)', // Cyan
            node: 'rgba(157, 78, 221, 0.3)', // Purple
            line: 'rgba(0, 255, 255, 0.05)'
          };
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      nodes = [];
      const colors = getColors();
      
      // Quantum Particles (Fast, erratic)
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 1,
          color: colors.particle
        });
      }

      // Crypto Nodes (Slow, structured)
      for (let i = 0; i < 30; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        });
      }
    };

    const draw = () => {
      const colors = getColors();
      
      // Clear with trail effect
      ctx.fillStyle = colors.bg + '1A'; // 10% opacity for trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Update and draw nodes + connections
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors.node;
        ctx.fill();

        // Connect to nearby nodes
        nodes.forEach((otherNode, j) => {
          if (i === j) return;
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = 1 - dist / 150;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
