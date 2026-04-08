'use client';

import { LAYOUT } from '@/lib/layout';
import { Edges, Text } from '@react-three/drei';

export function Racks() {
  return (
    <group>
      {/* Render Racks with Labels */}
      {LAYOUT.racks.map((z, i) => (
        <group key={`rack-row-${i}`}>
          {LAYOUT.rackBlocks.map((block, j) => (
            <group key={`rack-${i}-${j}`}>
              <mesh position={[block.x, 2, z]}>
                <boxGeometry args={[block.width, 4, LAYOUT.rackDepth]} />
                <meshBasicMaterial color="#0284c7" transparent opacity={0.15} depthWrite={false} />
                <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
              </mesh>
              {/* Rack Label on top */}
              <Text
                position={[block.x, 4.1, z]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={2}
                color="#93c5fd"
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.8}
              >
                {`ZONE A - RACK ${(i + 1).toString().padStart(3, '0')}`}
              </Text>
            </group>
          ))}
        </group>
      ))}

      {/* Render Aisle Labels on the floor */}
      {LAYOUT.aisles.map((z, i) => (
        <group key={`aisle-label-${i}`}>
          {/* Left side aisle label */}
          <Text
            position={[-80, 0.1, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={2.5}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.6}
          >
            {`AISLE ${(i + 1).toString().padStart(3, '0')}`}
          </Text>
          {/* Right side aisle label */}
          <Text
            position={[80, 0.1, z]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={2.5}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.6}
          >
            {`AISLE ${(i + 1).toString().padStart(3, '0')}`}
          </Text>
        </group>
      ))}
    </group>
  );
}
