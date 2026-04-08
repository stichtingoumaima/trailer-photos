'use client';

import { useStore } from '@/lib/store';
import { getLogicalLocation } from '@/lib/layout';
import { formatDistanceToNow } from 'date-fns';
import { Search, ChevronDown, LayoutGrid, Users, ShoppingBag, PlaySquare, Settings, LogOut, Menu, RefreshCw, Box, Map as MapIcon } from 'lucide-react';
import { useEffect } from 'react';

export function DashboardUI() {
  const workers = useStore(state => state.workers);
  const selectedWorkerId = useStore(state => state.selectedWorkerId);
  const pollWMS = useStore(state => state.pollWMS);
  const lastPolled = useStore(state => state.lastPolled);
  const cameraMode = useStore(state => state.cameraMode);
  const setCameraMode = useStore(state => state.setCameraMode);

  // Auto-poll every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      pollWMS();
    }, 30000);
    return () => clearInterval(interval);
  }, [pollWMS]);

  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

  const now = lastPolled;
  const activeCount = workers.filter(w => (now - w.lastScanTime) <= 5 * 60 * 1000).length;
  const yellowCount = workers.filter(w => {
    const idle = now - w.lastScanTime;
    return idle > 5 * 60 * 1000 && idle <= 15 * 60 * 1000;
  }).length;
  const redCount = workers.filter(w => (now - w.lastScanTime) > 15 * 60 * 1000).length;

  return (
    <div className="absolute inset-0 pointer-events-none flex">
      {/* Far Left Navigation */}
      <div className="w-16 h-full bg-[#0f172a]/90 backdrop-blur-md border-r border-slate-800/50 flex flex-col items-center py-6 pointer-events-auto z-10">
        <button className="p-3 text-slate-400 hover:text-white mb-8"><Menu className="w-6 h-6" /></button>
        <div className="flex flex-col gap-6 flex-1">
          <button className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><LayoutGrid className="w-6 h-6" /></button>
          <button className="p-3 text-slate-400 hover:text-white"><Users className="w-6 h-6" /></button>
          <button className="p-3 text-slate-400 hover:text-white"><ShoppingBag className="w-6 h-6" /></button>
          <button className="p-3 text-slate-400 hover:text-white"><PlaySquare className="w-6 h-6" /></button>
        </div>
        <div className="flex flex-col gap-6">
          <button className="p-3 text-slate-400 hover:text-white"><Settings className="w-6 h-6" /></button>
          <button className="p-3 text-slate-400 hover:text-white"><LogOut className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Main Sidebar */}
      <div className="w-80 h-full p-6 flex flex-col gap-6 pointer-events-none z-10">
        {/* Logo Area */}
        <div className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 pointer-events-auto flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">ID</div>
          <span className="text-xl font-semibold text-white tracking-wide">Logistics</span>
        </div>

        {/* Legend & Filters Panel */}
        <div className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 pointer-events-auto shadow-lg flex-1 overflow-y-auto">
          <h3 className="text-white font-medium mb-4">Legend</h3>
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#0ea5e9] shadow-[0_0_10px_#0ea5e9]"></div>
              <span className="text-slate-300 text-sm">Moving (last few minutes)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#eab308] shadow-[0_0_10px_#eab308]"></div>
              <span className="text-slate-300 text-sm">Idle (5-10 minutes)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]"></div>
              <span className="text-slate-300 text-sm">Idle (over 15 minutes)</span>
            </div>
          </div>

          <h3 className="text-white font-medium mb-4">Filter</h3>
          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg p-3 flex justify-between items-center text-slate-300 text-sm hover:bg-[#0f172a] transition-colors">
              By zone <ChevronDown className="w-4 h-4" />
            </button>
            <button className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg p-3 flex justify-between items-center text-slate-300 text-sm hover:bg-[#0f172a] transition-colors">
              By shift <ChevronDown className="w-4 h-4" />
            </button>
            <button className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg p-3 flex justify-between items-center text-slate-300 text-sm hover:bg-[#0f172a] transition-colors">
              By shift .... <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {selectedWorker && (
            <div className="mt-8 pt-6 border-t border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-white font-medium mb-4">Selected Worker</h3>
              <div className="bg-[#0f172a]/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium">{selectedWorker.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{selectedWorker.id}</span>
                </div>
                <div className="text-sm text-slate-400 mb-1">Loc: {getLogicalLocation(selectedWorker.currentAisle, selectedWorker.currentBin)}</div>
                <div className="text-sm text-slate-400">Idle: {Math.floor((lastPolled - selectedWorker.lastScanTime) / 60000)}m</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Right Stats */}
      <div className="absolute top-6 right-6 pointer-events-auto flex gap-2">
        <div className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-xl flex overflow-hidden shadow-lg">
          <div className="px-6 py-3 flex flex-col justify-center border-r border-slate-700/50">
            <span className="text-slate-400 text-xs mb-1">Total Workers Online</span>
            <span className="text-white text-xl font-semibold">{workers.length}</span>
          </div>
          <div className="px-6 py-3 flex flex-col justify-center border-r border-slate-700/50">
            <span className="text-slate-400 text-xs mb-1">Active</span>
            <span className="text-[#0ea5e9] text-xl font-semibold">{activeCount}</span>
          </div>
          <div className="px-6 py-3 flex flex-col justify-center border-r border-slate-700/50">
            <span className="text-slate-400 text-xs mb-1">Idle (Yellow)</span>
            <span className="text-[#eab308] text-xl font-semibold">{yellowCount}</span>
          </div>
          <div className="px-6 py-3 flex flex-col justify-center">
            <span className="text-slate-400 text-xs mb-1">Alerts (Red)</span>
            <span className="text-[#ef4444] text-xl font-semibold">{redCount}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setCameraMode(cameraMode === 'topdown' ? 'isometric' : 'topdown')}
          className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#334155]/80 transition-colors shadow-lg"
          title={cameraMode === 'topdown' ? "Switch to Isometric View" : "Switch to Top-down View"}
        >
          {cameraMode === 'topdown' ? <Box className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
        </button>

        <button 
          onClick={pollWMS}
          className="bg-[#1e293b]/80 backdrop-blur-md border border-slate-700/50 rounded-xl px-4 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#334155]/80 transition-colors shadow-lg"
          title="Poll WMS Now"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
