// components/HoloCoreVisual.tsx - 3D Holographic Visualization Component with React Three Fiber
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Holographic Orb component with animations
const HoloOrb = ({ state }: { state: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshDistortMaterial>(null);
  
  // Animation variables
  const rotationSpeed = useRef(0.005);
  const scaleTarget = useRef(1);
  const pulseDirection = useRef(1);
  const pulseSpeed = useRef(0.02);
  
  // Handle state changes
  useEffect(() => {
    if (state === 'isBuilding') {
      rotationSpeed.current = 0.05; // Fast rotation when building
      scaleTarget.current = 1.2;
    } else if (state === 'isListening') {
      rotationSpeed.current = 0.005; // Normal rotation when listening
      scaleTarget.current = 1;
    } else if (state === 'isProcessing') {
      rotationSpeed.current = 0.01; // Slow rotation when processing
      scaleTarget.current = 1;
    } else {
      rotationSpeed.current = 0.002; // Very slow rotation when idle
      scaleTarget.current = 1;
    }
  }, [state]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation animation
      meshRef.current.rotation.y += rotationSpeed.current;
      
      // Pulsing effect
      if (materialRef.current) {
        if (state === 'isListening' || state === 'isProcessing' || state === 'isBuilding') {
          const currentScale = meshRef.current.scale.x;
          const targetScale = scaleTarget.current;
          
          // Pulsing animation
          if (currentScale >= targetScale + 0.1) pulseDirection.current = -1;
          if (currentScale <= targetScale - 0.1) pulseDirection.current = 1;
          
          const newScale = currentScale + pulseDirection.current * pulseSpeed.current;
          meshRef.current.scale.set(newScale, newScale, newScale);
          
          // Distortion effect for processing state
          if (state === 'isProcessing') {
            materialRef.current.distort = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.2;
          } else {
            materialRef.current.distort = 0.1;
          }
        } else {
          // Return to normal size when idle
          const currentScale = meshRef.current.scale.x;
          if (Math.abs(currentScale - 1) > 0.01) {
            const newScale = currentScale + (1 - currentScale) * 0.1;
            meshRef.current.scale.set(newScale, newScale, newScale);
          }
          materialRef.current.distort = 0.1;
        }
      }
    }
  });
  
  // Determine color based on state
  const getColor = () => {
    switch (state) {
      case 'isBuilding': return '#a855f7'; // Purple for building
      case 'isListening': return '#3b82f6'; // Blue for listening
      case 'isProcessing': return '#f59e0b'; // Yellow for processing
      case 'isSpeaking': return '#10b981'; // Green for speaking
      default: return '#6366f1'; // Indigo for idle
    }
  };
  
  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1}>
      <MeshDistortMaterial
        ref={materialRef}
        color={getColor()}
        attach="material"
        distort={0.1}
        speed={2}
        roughness={0.3}
        metalness={0.7}
      />
    </Sphere>
  );
};

// Spark particle component for building state
const Spark = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.05;
      meshRef.current.rotation.y += 0.05;
      meshRef.current.position.y += 0.01;
      
      // Fade out as it moves up
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity -= 0.01;
        if (meshRef.current.material.opacity <= 0) {
          meshRef.current.position.y = position[1]; // Reset position
          meshRef.current.material.opacity = 1; // Reset opacity
        }
      }
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1} transparent opacity={1} />
    </mesh>
  );
};

// Sparks component for building state
const Sparks = () => {
  const sparks = Array.from({ length: 20 }, (_, i) => (
    <Spark 
      key={i} 
      position={[
        (Math.random() - 0.5) * 4, 
        (Math.random() - 0.5) * 4, 
        (Math.random() - 0.5) * 4
      ]} 
    />
  ));
  
  return <>{sparks}</>;
};

// Main HoloCoreVisual component
const HoloCoreVisual = ({ state = 'idle' }: { state?: string }) => {
  return (
    <div className="w-full h-64 md:h-80 relative">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        
        <HoloOrb state={state} />
        
        {/* Show sparks only when building */}
        {state === 'isBuilding' && <Sparks />}
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {/* Status indicator overlay */}
      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            state === 'isBuilding' ? 'bg-purple-500 animate-pulse' : 
            state === 'isListening' ? 'bg-blue-500 animate-pulse' : 
            state === 'isProcessing' ? 'bg-yellow-500 animate-pulse' : 
            state === 'isSpeaking' ? 'bg-green-500 animate-pulse' : 
            'bg-green-500'
          }`}></div>
          <span className="text-white">
            {state === 'isBuilding' ? 'Building SDK' : 
             state === 'isListening' ? 'Listening' : 
             state === 'isProcessing' ? 'Processing' : 
             state === 'isSpeaking' ? 'Speaking' : 
             'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HoloCoreVisual;