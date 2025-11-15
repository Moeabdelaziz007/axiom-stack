// components/HoloCoreVisual.tsx - 3D Holographic Visualization Component
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, PointMaterial, Points as DreiPoints, PointMaterialProps, OrbitControlsProps } from '@react-three/drei';
import * as THREE from 'three';

// Floating particles component
const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const pts = [];
    for (let i = 0; i < 2000; i++) {
      const t = Math.random() * 2 * Math.PI;
      const u = Math.random() * 2 - 1;
      const r = Math.sqrt(1 - u * u);
      const x = r * Math.cos(t) * 5;
      const y = r * Math.sin(t) * 5;
      const z = u * 5;
      pts.push(x, y, z);
    }
    return new Float32Array(pts);
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.02;
      pointsRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <DreiPoints ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={sphere.length / 3}
          array={sphere}
          itemSize={3}
        />
      </bufferGeometry>
      <pointMaterial
        color="#3b82f6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        transparent={true}
        opacity={0.8}
      />
    </DreiPoints>
  );
};

// Animated core sphere component
const CoreSphere = ({ state }: { state: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  useFrame((frameState, delta) => {
    if (meshRef.current) {
      // Rotate slowly
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Pulsing effect based on state
      const time = frameState.clock.elapsedTime;
      const scale = 1 + Math.sin(state === 'isBuilding' ? time * 10 : time * 2) * 0.05;
      meshRef.current.scale.setScalar(scale);
      
      // Color changes based on state
      if (meshRef.current.material instanceof MeshDistortMaterial) {
        if (state === 'isBuilding') {
          meshRef.current.material.color.set('#8b5cf6'); // Purple for building
        } else if (state === 'isListening') {
          meshRef.current.material.color.set('#3b82f6'); // Blue for listening
        } else if (state === 'isProcessing') {
          meshRef.current.material.color.set('#f59e0b'); // Yellow for processing
        } else {
          meshRef.current.material.color.set('#60a5fa'); // Default blue
        }
      }
    }
  });

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <MeshDistortMaterial
        color={state === 'isBuilding' ? '#8b5cf6' : '#60a5fa'}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.1}
        transparent={true}
        opacity={0.9}
      />
    </Sphere>
  );
};

// Sparks effect for building state
const Sparks = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const [sphere] = useState(() => {
    const pts = [];
    for (let i = 0; i < 100; i++) {
      const t = Math.random() * 2 * Math.PI;
      const u = Math.random() * 2 - 1;
      const r = Math.sqrt(1 - u * u);
      const x = r * Math.cos(t) * 2;
      const y = r * Math.sin(t) * 2;
      const z = u * 2;
      pts.push(x, y, z);
    }
    return new Float32Array(pts);
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.5;
      pointsRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <DreiPoints ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={sphere.length / 3}
          array={sphere}
          itemSize={3}
        />
      </bufferGeometry>
      <pointMaterial
        color="#fbbf24"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        transparent={true}
        opacity={0.9}
      />
    </DreiPoints>
  );
};

// Main HoloCoreVisual component
const HoloCoreVisual = ({ state = 'idle' }: { state?: string }) => {
  return (
    <div className="w-full h-64 md:h-80 relative">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        className="bg-transparent"
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        {/* Core sphere with state-based animations */}
        <CoreSphere state={state} />
        
        {/* Floating particles */}
        <Particles />
        
        {/* Sparks effect when building */}
        {state === 'isBuilding' && <Sparks />}
        
        {/* Controls for user interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={state !== 'isBuilding'}
          autoRotateSpeed={0.5}
        />
        
        {/* Fog for depth effect */}
        <fog attach="fog" args={['#000000', 5, 15]} />
      </Canvas>
      
      {/* Status indicator overlay */}
      <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            state === 'isBuilding' ? 'bg-purple-500 animate-pulse' : 
            state === 'isListening' ? 'bg-blue-500 animate-pulse' : 
            state === 'isProcessing' ? 'bg-yellow-500 animate-pulse' : 
            'bg-green-500'
          }`}></div>
          <span className="text-white">
            {state === 'isBuilding' ? 'Building SDK' : 
             state === 'isListening' ? 'Listening' : 
             state === 'isProcessing' ? 'Processing' : 
             'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HoloCoreVisual;