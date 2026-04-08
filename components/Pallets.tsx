'use client';

import { Edges, Text } from '@react-three/drei';

function PalletCluster({ position, rows, cols }: { position: [number, number, number], rows: number, cols: number }) {
  const spacingX = 4.5;
  const spacingZ = 4.5;
  const size = 4;

  const boxes = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      boxes.push(
        <mesh key={`${r}-${c}`} position={[(r - rows/2 + 0.5) * spacingX, size / 2, (c - cols/2 + 0.5) * spacingZ]}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.2} depthWrite={false} />
          <Edges scale={1.001} threshold={15} color="#38bdf8" opacity={0.5} transparent />
        </mesh>
      );
    }
  }

  return (
    <group position={position}>
      {boxes}
    </group>
  );
}

export function Pallets() {
  const clusters = [
    { z: -100, rows: 2, cols: 3 },
    { z: -60, rows: 3, cols: 3 },
    { z: -20, rows: 2, cols: 3 },
    { z: 20, rows: 3, cols: 3 },
    { z: 60, rows: 2, cols: 3 },
    { z: 100, rows: 3, cols: 3 },
  ];
  
  return (
    <group>
      {/* Staging Area Label */}
      <Text
        position={[-115, 0.1, -125]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={5}
        color="#38bdf8"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.8}
        letterSpacing={0.05}
      >
        PALLET STAGING & RECEIVING AREA
      </Text>

      {clusters.map((cluster, i) => (
        <PalletCluster key={`cluster-${i}`} position={[-115, 0, cluster.z]} rows={cluster.rows} cols={cluster.cols} />
      ))}
    </group>
  );
}
