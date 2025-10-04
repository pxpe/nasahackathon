'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, AlertTriangle } from 'lucide-react'
import InteractiveMap from '../../../components/InteractiveMap'
import LayerSwitcher from '../../../components/LayerSwitcher'
import InfoPanel from '../../../components/InfoPanel'
import sitesData from '../../../data/sites.json'

export default function SitePage() {
  const params = useParams()
  const router = useRouter()
  const [site, setSite] = useState<any>(null)
  const [activeLayer, setActiveLayer] = useState('satellite')

  useEffect(() => {
    const foundSite = sitesData.sites.find(s => s.id === params.id)
    if (foundSite) {
      setSite(foundSite)
    }
  }, [params.id])

  if (!site) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-blue to-space-purple flex items-center justify-center">
        <div className="text-white text-xl">Loading site data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-space-blue to-space-purple">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-30 p-6"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="glass rounded-lg p-3 hover:bg-white/20 transition-all duration-300 group"
          >
            <ArrowLeft className="w-6 h-6 text-white group-hover:text-neon-cyan transition-colors" />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {site.name}
            </h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {site.coordinates[0].toFixed(2)}°, {site.coordinates[1].toFixed(2)}°
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Updated: {new Date(site.deforestationData.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="w-12" /> {/* Spacer for centering */}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative flex-1 h-[calc(100vh-120px)]">
        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 m-6 rounded-2xl overflow-hidden"
        >
          <InteractiveMap
            site={site}
            activeLayer={activeLayer}
            className="w-full h-full"
          />
        </motion.div>

        {/* Layer Switcher */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-24 right-16 z-[995] backdrop:blur-lg"
        >
          <LayerSwitcher
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            site={site}
          />
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-6 left-16 z-[999]"
        >
          <InfoPanel site={site} />
        </motion.div>

        {/* Alert Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-24 left-16 z-[890]"
        >
          <div className="glass rounded-lg p-4 border border-red-500/30 bg-red-500/10">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-white font-medium">High Deforestation Alert</h3>
                <p className="text-gray-300 text-sm">
                  {site.deforestationData.treesAffected.toLocaleString()} trees affected
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
