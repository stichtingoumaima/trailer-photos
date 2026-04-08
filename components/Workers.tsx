'use client';

import { useStore } from '@/lib/store';
import { getCoordinates } from '@/lib/layout';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

function WorkerDot({ worker, isSelected, onClick }: { worker: any, isSelected: boolean, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const lastPolled = useStore(state => state.lastPolled);
  const coords = getCoordinates(worker.currentAisle, worker.currentBin);
  const idleTimeMs = lastPolled - worker.lastScanTime;
  const idleMinutes = idleTimeMs / (1000 * 60);

  let statusColor = '#00ffff'; // Bright Cyan
  let isRed = false;
  if (idleMinutes > 15) {
    statusColor = '#ff4444'; // Bright Red
    isRed = true;
  } else if (idleMinutes > 5) {
    statusColor = '#fbbf24'; // Bright Yellow
  }

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Pulsing effect for red dots
    if (isRed) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.setScalar(1);
    }

    // Highlight if selected or hovered
    if (isSelected || hovered) {
      meshRef.current.scale.setScalar(1.5);
    }
  });

  return (
    <group position={[coords.x, 0, coords.z]}>
      {/* Vertical beam */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.5} />
      </mesh>
      
      {/* Main glowing dot */}
      <mesh
        ref={meshRef}
        position={[0, 4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial 
          ref={materialRef}
          color={statusColor} 
        />
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0.3} depthWrite={false} />
        </mesh>
        
        {/* Optional: Show name on hover or selection */}
        {(hovered || isSelected) && (
          <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
            <div className="bg-slate-900/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap border border-slate-700 backdrop-blur-sm">
              {worker.name}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

export function Workers() {
  const workers = useStore(state => state.workers);
  const selectedWorkerId = useStore(state => state.selectedWorkerId);
  const selectWorker = useStore(state => state.selectWorker);

  return (
    <group>
      {workers.map(worker => (
        <WorkerDot 
          key={worker.id} 
          worker={worker} 
          isSelected={selectedWorkerId === worker.id}
          onClick={() => selectWorker(worker.id)}
        />
      ))}
    </group>
  );
}
