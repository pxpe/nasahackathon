'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronUp, 
  ChevronDown, 
  TreePine, 
  Flame, 
  Cloud, 
  Heart, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react'

interface InfoPanelProps {
  site: any
}

export default function InfoPanel({ site }: InfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getRiskLevel = (treesAffected: number) => {
    if (treesAffected > 1000000) return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20' }
    if (treesAffected > 500000) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20' }
    if (treesAffected > 100000) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' }
  }

  const riskLevel = getRiskLevel(site.deforestationData.treesAffected)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-white/20 max-w-sm mb-2 z-[900]"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Environmental Impact</h3>
            <p className="text-gray-400 text-sm">Real-time analysis</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="glass rounded-lg p-2 hover:bg-white/20 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-white" />
            ) : (
              <ChevronUp className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="p-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full ${riskLevel.bg} border border-white/20`}>
          <AlertTriangle className={`w-4 h-4 mr-2 ${riskLevel.color}`} />
          <span className={`text-sm font-medium ${riskLevel.color}`}>
            {riskLevel.level} Risk
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4 pb-4 space-y-3">
        {/* Trees Affected */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TreePine className="w-5 h-5 text-neon-green mr-3" />
            <span className="text-gray-300 text-sm">Trees Affected</span>
          </div>
          <span className="text-white font-semibold">
            {formatNumber(site.deforestationData.treesAffected)}
          </span>
        </div>

        {/* Area Affected */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-neon-cyan mr-3" />
            <span className="text-gray-300 text-sm">Area (km²)</span>
          </div>
          <span className="text-white font-semibold">
            {site.deforestationData.areaAffected}
          </span>
        </div>

        {/* Ozone Emitted */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Cloud className="w-5 h-5 text-blue-400 mr-3" />
            <span className="text-gray-300 text-sm">Ozone (tons)</span>
          </div>
          <span className="text-white font-semibold">
            {formatNumber(site.deforestationData.ozoneEmitted)}
          </span>
        </div>

        {/* Animals Affected */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-gray-300 text-sm">Animals Affected</span>
          </div>
          <span className="text-white font-semibold">
            {formatNumber(site.deforestationData.animalsAffected)}
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Origin Probability */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Flame className="w-4 h-4 mr-2 text-orange-400" />
                  Origin Probability
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Human Activity</span>
                    <span className="text-white font-medium">
                      {(site.deforestationData.probabilityOfOrigin.human * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${site.deforestationData.probabilityOfOrigin.human * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Natural Fire</span>
                    <span className="text-white font-medium">
                      {(site.deforestationData.probabilityOfOrigin.fire * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${site.deforestationData.probabilityOfOrigin.fire * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-neon-cyan" />
                  Analysis Details
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="text-white">
                      {new Date(site.deforestationData.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Source:</span>
                    <span className="text-neon-cyan">NASA SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="text-green-400">High</span>
                  </div>
                </div>
              </div>

              {/* Environmental Impact Summary */}
              <div className="glass rounded-lg p-3 border border-white/10">
                <h5 className="text-white font-medium mb-2">Impact Summary</h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This deforestation event represents a significant environmental impact, 
                  affecting biodiversity and contributing to climate change through carbon 
                  emissions and ozone depletion.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}