import { create } from 'zustand';
import { getCoordinates, getLogicalLocation, LAYOUT } from './layout';

export interface Worker {
  id: string;
  name: string;
  currentAisle: number;
  currentBin: number;
  nextAisle: number;
  nextBin: number;
  lastScanTime: number;
}

interface AppState {
  workers: Worker[];
  selectedWorkerId: string | null;
  lastPolled: number;
  cameraMode: 'topdown' | 'isometric';
  pollWMS: () => void;
  selectWorker: (id: string | null) => void;
  setCameraMode: (mode: 'topdown' | 'isometric') => void;
}

const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function generateWorkerForAisle(id: number, currentAisle: number): Worker {
  const currentBin = Math.floor(Math.random() * 40) + 1;
  const nextAisle = Math.floor(Math.random() * LAYOUT.aisles.length);
  const nextBin = Math.floor(Math.random() * 40) + 1;
  
  const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
  
  // Randomize last scan time between now and 25 minutes ago
  const idleMinutes = Math.random() * 25;
  const lastScanTime = Date.now() - idleMinutes * 60 * 1000;

  return {
    id: `W-${id.toString().padStart(4, '0')}`,
    name,
    currentAisle,
    currentBin,
    nextAisle,
    nextBin,
    lastScanTime,
  };
}

const initialWorkers: Worker[] = [];
let workerId = 1;
for (let i = 0; i < LAYOUT.aisles.length; i++) {
  const numWorkers = Math.floor(Math.random() * 3) + 1; // 1 to 3 workers per aisle
  for (let j = 0; j < numWorkers; j++) {
    initialWorkers.push(generateWorkerForAisle(workerId++, i));
  }
}

export const useStore = create<AppState>((set) => ({
  workers: initialWorkers,
  selectedWorkerId: null,
  lastPolled: Date.now(),
  cameraMode: 'topdown',
  pollWMS: () => set((state) => {
    // Count workers in each aisle to enforce max 3
    const aisleCounts = new Array(LAYOUT.aisles.length).fill(0);
    state.workers.forEach(w => {
      aisleCounts[w.currentAisle]++;
    });

    const updatedWorkers = state.workers.map(w => {
      // 70% chance the worker moved to their next location
      if (Math.random() > 0.3) {
        aisleCounts[w.currentAisle]--;
        aisleCounts[w.nextAisle]++;
        
        // Pick a new next location that isn't too crowded
        let newNextAisle = Math.floor(Math.random() * LAYOUT.aisles.length);
        let attempts = 0;
        while (aisleCounts[newNextAisle] >= 3 && attempts < 10) {
          newNextAisle = Math.floor(Math.random() * LAYOUT.aisles.length);
          attempts++;
        }

        return {
          ...w,
          currentAisle: w.nextAisle,
          currentBin: w.nextBin,
          nextAisle: newNextAisle,
          nextBin: Math.floor(Math.random() * 40) + 1,
          lastScanTime: Date.now() - (Math.random() * 2 * 60 * 1000), // Scanned recently
        };
      }
      // 30% chance they are stuck/idle, time just increases
      return w;
    });
    return { workers: updatedWorkers, lastPolled: Date.now() };
  }),
  selectWorker: (id) => set({ selectedWorkerId: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
}));
