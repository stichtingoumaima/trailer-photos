export const LAYOUT = {
  aisles: Array.from({ length: 25 }, (_, i) => -120 + i * 10),
  crossAisles: [-80, -40, 0, 40, 80],
  racks: Array.from({ length: 24 }, (_, i) => -115 + i * 10),
  rackBlocks: [
    { x: -60, width: 30 },
    { x: -20, width: 30 },
    { x: 20, width: 30 },
    { x: 60, width: 30 },
  ],
  rackDepth: 6,
};

export function getLogicalLocation(aisleIndex: number, bin: number) {
  const zone = 'A';
  const aisle = (aisleIndex + 1).toString().padStart(3, '0');
  const column = bin.toString().padStart(4, '0');
  const level = '00';
  return `${zone} ${aisle} ${column} ${level}`;
}

export function getCoordinates(aisleIndex: number, bin: number) {
  const z = LAYOUT.aisles[aisleIndex];
  let x = 0;
  if (bin <= 10) {
    x = -73.5 + (bin - 1) * 3;
  } else if (bin <= 20) {
    x = -33.5 + (bin - 11) * 3;
  } else if (bin <= 30) {
    x = 6.5 + (bin - 21) * 3;
  } else {
    x = 46.5 + (bin - 31) * 3;
  }
  return { x, z };
}

export function calculatePath(startX: number, startZ: number, endX: number, endZ: number) {
  const path = [];
  path.push([startX, 0.5, startZ]);

  if (startZ === endZ) {
    path.push([endX, 0.5, endZ]);
    return path;
  }

  // Find nearest cross aisle to start
  const startCrossX = LAYOUT.crossAisles.reduce((prev, curr) =>
    Math.abs(curr - startX) < Math.abs(prev - startX) ? curr : prev
  );

  // Find nearest cross aisle to end
  const endCrossX = LAYOUT.crossAisles.reduce((prev, curr) =>
    Math.abs(curr - endX) < Math.abs(prev - endX) ? curr : prev
  );

  if (startCrossX === endCrossX) {
    // Use the same cross aisle
    path.push([startCrossX, 0.5, startZ]);
    path.push([startCrossX, 0.5, endZ]);
  } else {
    // This is a simplification. In a real warehouse, you might just use the start cross aisle
    // to go to the destination Z, then move along destination Z.
    // Let's do that: go to nearest cross aisle from start, move to endZ, then move to endX.
    path.push([startCrossX, 0.5, startZ]);
    path.push([startCrossX, 0.5, endZ]);
  }

  path.push([endX, 0.5, endZ]);

  return path;
}
