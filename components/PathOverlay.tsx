'use client';

import { useStore } from '@/lib/store';
import { getCoordinates, calculatePath, getLogicalLocation } from '@/lib/layout';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function PathOverlay() {
  const selectedWorkerId = useStore(state => state.selectedWorkerId);
  const workers = useStore(state => state.workers);
  const lineRef = useRef<any>(null);

  const pathData = useMemo(() => {
    if (!selectedWorkerId) return null;
    const worker = workers.find(w => w.id === selectedWorkerId);
    if (!worker) return null;

    const start = getCoordinates(worker.currentAisle, worker.currentBin);
    const end = getCoordinates(worker.nextAisle, worker.nextBin);
    const startLoc = getLogicalLocation(worker.currentAisle, worker.currentBin);
    const endLoc = getLogicalLocation(worker.nextAisle, worker.nextBin);

    const rawPoints = calculatePath(start.x, start.z, end.x, end.z).map(p => new THREE.Vector3(p[0], p[1], p[2]));
    
    // Create a smooth curve from the raw points
    const curve = new THREE.CatmullRomCurve3(rawPoints, false, 'catmullrom', 0.1);
    const smoothPoints = curve.getPoints(100);

    return { smoothPoints, start, end, startLoc, endLoc };
  }, [selectedWorkerId, workers]);

  useFrame((state, delta) => {
    if (lineRef.current && lineRef.current.material) {
      // Animate the dash offset to make it flow towards the destination
      lineRef.current.material.dashOffset -= delta * 4;
    }
  });

  if (!pathData) return null;

  return (
    <group>
      <Line
        ref={lineRef}
        points={pathData.smoothPoints}
        color="#4ade80" // Bright green
        lineWidth={4}
        dashed={true}
        dashSize={2}
        dashScale={1}
        transparent
        opacity={0.8}
      />
      {/* Target Marker */}
      <mesh position={[pathData.end.x, 0.5, pathData.end.z]}>
        <ringGeometry args={[0.5, 1, 32]} />
        <meshBasicMaterial color="#4ade80" side={THREE.DoubleSide} transparent opacity={0.8} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Start Marker Text */}
      <Html position={[pathData.start.x, 6, pathData.start.z]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
        <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-green-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(74,222,128,0.3)] flex flex-col items-center">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Current</span>
          <span className="font-mono font-medium text-green-400">{pathData.startLoc}</span>
        </div>
      </Html>

      {/* End Marker Text */}
      <Html position={[pathData.end.x, 6, pathData.end.z]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
        <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-green-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(74,222,128,0.3)] flex flex-col items-center">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Target</span>
          <span className="font-mono font-medium text-green-400">{pathData.endLoc}</span>
        </div>
      </Html>
    </group>
  );
}
