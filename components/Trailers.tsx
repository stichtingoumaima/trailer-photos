'use client';

import { Edges, Text, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function LoaderDot({ position, color, isPurple }: { position: [number, number, number], color: string, isPurple?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    if (isPurple) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Vertical beam */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      
      {/* Main glowing dot */}
      <mesh ref={meshRef} position={[0, 4, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color={color} />
        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
        </mesh>
        
        {isPurple && (
          <Html position={[0, 1.5, -5]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
            <div className="bg-purple-900/90 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-purple-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)] flex flex-col items-center">
              <span className="font-medium text-purple-300">requesting teamleader</span>
            </div>
          </Html>
        )}
      </mesh>

      {isPurple && (
        <group position={[0, 0, 10]}>
          {/* Goods with error */}
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.2} depthWrite={false} />
            <Edges scale={1.001} threshold={15} color="#f87171" opacity={0.5} transparent />
          </mesh>
          <Html position={[0, 5, 0]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
            <div className="bg-red-900/90 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-red-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.4)] flex flex-col items-center">
              <span className="font-mono font-medium text-red-400">Support -33. 260 .339 Not Found</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

export function Trailers() {
  const gates = [
    { z: -100, hasTrailer: true, gateNum: '01', trailerNum: 'TRL-1042', isPurple: false },
    { z: -60, hasTrailer: true, gateNum: '02', trailerNum: 'TRL-8931', isPurple: false },
    { z: -20, hasTrailer: false, gateNum: '03', trailerNum: '', isPurple: false },
    { z: 20, hasTrailer: true, gateNum: '04', trailerNum: 'TRL-5529', isPurple: true },
    { z: 60, hasTrailer: false, gateNum: '05', trailerNum: '', isPurple: false },
    { z: 100, hasTrailer: true, gateNum: '06', trailerNum: 'TRL-9910', isPurple: false },
  ];

  return (
    <group>
      {gates.map((gate, i) => (
        <group key={`gate-${i}`} position={[-165, 4, gate.z]}>
          {/* Gate Connector / Dock Door */}
          <mesh position={[19, -2, 0]}>
            <boxGeometry args={[4, 8, 16]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.2} depthWrite={false} />
            <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
          </mesh>

          {/* Gate Number (Floating & Readable from any angle) */}
          <Html position={[19, 6, -12]} center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
            <div className="bg-slate-900/80 text-cyan-400 px-3 py-1 rounded-md text-sm font-bold border border-cyan-500/30 backdrop-blur-sm whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              GATE {gate.gateNum}
            </div>
          </Html>

          {/* Trailer */}
          {gate.hasTrailer && (
            <group>
              <mesh>
                <boxGeometry args={[36, 12, 14]} />
                <meshBasicMaterial color="#0f172a" transparent opacity={0.6} depthWrite={false} />
                <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.4} transparent />
              </mesh>
              {/* Trailer Number */}
              <Text
                position={[0, 6.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={4}
                color="#94a3b8"
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.8}
              >
                {gate.trailerNum}
              </Text>
              
              {/* Loader Person */}
              <LoaderDot 
                position={[28, -4, 0]} 
                color={gate.isPurple ? '#a855f7' : '#00ffff'} 
                isPurple={gate.isPurple} 
              />
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
