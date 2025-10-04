'use client'

import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet'
import L, { Layer } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-imageoverlay-rotated'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface InteractiveMapProps {
  site: any
  activeLayer: string
  className?: string
}

function MapController({ site }: { site: any }) {
  const map = useMap()

  useEffect(() => {
    if (site?.coordinates) {
      map.setView([site.coordinates[0], site.coordinates[1]], 10)
    }
  }, [map, site])

  return null
}

export default function InteractiveMap({ site, activeLayer, className }: InteractiveMapProps) {
  const mapRef = useRef<L.Map>(null)

  const getTileLayer = () => ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
  })

  const tileConfig = getTileLayer()
  const sarLayers = site.sarLayers

  const getLayerImage = () => {
    switch (activeLayer) {
      case 'sar-vh': return sarLayers.vh
      case 'sar-vv': return sarLayers.vv
      case 'sar-regions': return sarLayers.regions
      default: return ''
    }
  }

  const layerImage = getLayerImage()

  // Hook para superponer la imagen SAR rotada
  useEffect(() => {
    const map = mapRef.current
    if (!map || !layerImage || !site?.polygon || activeLayer === 'satellite') return

    // Elimina overlays previos
    map.eachLayer((layer: Layer) => {
      if ((layer as any).options?.customOverlay) map.removeLayer(layer)
    })

    const coords = site.polygon.coordinates[0]
    if (coords.length < 4) return

    const toLatLng = ([lon, lat]: [number, number]) => L.latLng(lat, lon)
    const topLeft = toLatLng(coords[0])
    const topRight = toLatLng(coords[1])
    const bottomLeft = toLatLng(coords[3])

    const overlay = new (L as any).ImageOverlay.Rotated(layerImage, topLeft, topRight, bottomLeft, {
      opacity: 0.55,
      interactive: false,
      customOverlay: true
    });

    overlay.addTo(map)

    return () => {
      map.removeLayer(overlay)
    }
  }, [site, layerImage, activeLayer])

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        ref={mapRef}
        center={site?.coordinates || [0, 0]}
        zoom={10}
        className="w-full h-full rounded-2xl"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer url={tileConfig.url} attribution={tileConfig.attribution} />
        <MapController site={site} />

        {site?.polygon && (
          <Polygon
            positions={site.polygon.coordinates[0].map(([lon, lat]: [number, number]) => [lat, lon])}
            pathOptions={{
              color: '#ff4444',
              fillColor: '#ff4444',
              fillOpacity: 0.3,
              weight: 2
            }}
          />
        )}
      </MapContainer>

      {activeLayer !== 'satellite' && (
        <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 z-[900]">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-neon-cyan rounded-full mr-2 animate-pulse" />
            <span className="text-white text-sm font-medium">
              {activeLayer.toUpperCase()} Layer Active
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
