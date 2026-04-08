'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MapControls, Grid, Environment, Edges } from '@react-three/drei';
import { Racks } from './Racks';
import { Workers } from './Workers';
import { PathOverlay } from './PathOverlay';
import { Trailers } from './Trailers';
import { Pallets } from './Pallets';
import { useStore } from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

function CameraHandler() {
  const cameraMode = useStore(state => state.cameraMode);
  const { camera, controls } = useThree();
  const [isAnimating, setIsAnimating] = useState(false);
  const targetPos = useRef(new THREE.Vector3());

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 0);
    return () => clearTimeout(timer);
  }, [cameraMode]);

  useFrame((state, delta) => {
    if (isAnimating && controls) {
      const target = (controls as any).target;
      if (cameraMode === 'topdown') {
        targetPos.current.set(target.x, 250, target.z + 0.1);
      } else {
        targetPos.current.set(target.x, 150, target.z + 150);
      }
      camera.position.lerp(targetPos.current, delta * 5);
      (controls as any).update();
      if (camera.position.distanceTo(targetPos.current) < 1) {
        setIsAnimating(false);
      }
    }
  });

  return (
    <MapControls 
      makeDefault 
      enableRotate={cameraMode === 'isometric'}
      maxPolarAngle={cameraMode === 'topdown' ? 0.1 : Math.PI / 2.5}
      minPolarAngle={0}
      minDistance={20} 
      maxDistance={400}
    />
  );
}

export function WarehouseScene() {
  const selectWorker = useStore(state => state.selectWorker);

  return (
    <div className="w-full h-full bg-[#090e17]">
      <Canvas
        camera={{ position: [0, 250, 0.1], fov: 45 }}
        onPointerMissed={() => selectWorker(null)}
      >
        <color attach="background" args={['#090e17']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 50, 20]} intensity={1} />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-30, -0.1, 0]}>
          <planeGeometry args={[230, 280]} />
          <meshStandardMaterial color="#0b1120" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Outer Walls (Blueprint style) */}
        <group>
          {/* Back wall */}
          <mesh position={[-30, 4, -135]}>
            <boxGeometry args={[230, 8, 1]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.15} depthWrite={false} />
            <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
          </mesh>
          {/* Front wall */}
          <mesh position={[-30, 4, 135]}>
            <boxGeometry args={[230, 8, 1]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.15} depthWrite={false} />
            <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
          </mesh>
          {/* Left wall */}
          <mesh position={[-145, 4, 0]}>
            <boxGeometry args={[1, 8, 270]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.15} depthWrite={false} />
            <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
          </mesh>
          {/* Right wall */}
          <mesh position={[85, 4, 0]}>
            <boxGeometry args={[1, 8, 270]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.15} depthWrite={false} />
            <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
          </mesh>
        </group>

        <Grid 
          infiniteGrid 
          fadeDistance={250} 
          sectionColor="#1e3a8a" 
          cellColor="#0f172a" 
          position={[-30, 0, 0]} 
          sectionSize={10}
          cellSize={2}
        />

        <Trailers />
        <Pallets />
        <Racks />
        <Workers />
        <PathOverlay />

        <CameraHandler />
      </Canvas>
    </div>
  );
}
