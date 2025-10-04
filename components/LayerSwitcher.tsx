'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Satellite, Radio, Wifi } from 'lucide-react'

interface LayerSwitcherProps {
  activeLayer: string
  onLayerChange: (layer: string) => void
  site: any
}

const layers = [
  {
    id: 'satellite',
    name: 'Satellite',
    icon: Satellite,
    description: 'Standard satellite imagery',
    color: 'text-blue-400'
  },
  {
    id: 'sar-vh',
    name: 'SAR VH',
    icon: Radio,
    description: 'Horizontal-Horizontal polarization',
    color: 'text-green-400'
  },
  {
    id: 'sar-vv',
    name: 'SAR VV',
    icon: Wifi,
    description: 'Horizontal-Vertical polarization',
    color: 'text-purple-400'
  },
  {
    id: 'sar-regions',
    name: 'SAR REGIONS',
    icon: Radio,
    description: 'Vertical-Horizontal polarization',
    color: 'text-cyan-400'
  }
]

export default function LayerSwitcher({ activeLayer, onLayerChange, site }: LayerSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeLayerData = layers.find(layer => layer.id === activeLayer)

  return (
    <div className="relative z-[999]">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Layers className="w-6 h-6 text-white group-hover:text-neon-cyan transition-colors" />
            {activeLayer !== 'satellite' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
            )}
          </div>
          <div className="text-left">
            <div className="text-white font-medium text-sm">
              {activeLayerData?.name}
            </div>
            <div className="text-gray-400 text-xs">
              {activeLayerData?.description}
            </div>
          </div>
        </div>
      </motion.button>

      {/* Layer Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 glass rounded-xl p-2 border border-white/20"
          >
            <div className="space-y-1">
              {layers.map((layer) => {
                const Icon = layer.icon
                const isActive = layer.id === activeLayer
                
                return (
                  <motion.button
                    key={layer.id}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      onLayerChange(layer.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-neon-cyan/20 border border-neon-cyan/30' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-neon-cyan' : layer.color}`} />
                    <div className="text-left flex-1">
                      <div className={`font-medium text-sm ${
                        isActive ? 'text-neon-cyan' : 'text-white'
                      }`}>
                        {layer.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {layer.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-neon-cyan rounded-full"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
            
            {/* Layer Info */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 px-3">
                <div className="flex justify-between">
                  <span>Data Source:</span>
                  <span className="text-neon-cyan">NASA SAR</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Last Update:</span>
                  <span>{new Date(site?.deforestationData?.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}