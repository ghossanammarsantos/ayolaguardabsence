import { useEffect, useRef, useState } from 'react'
import { PatrolPoint, PatrolLog } from '@/types'

interface PatrolMapProps {
  points: PatrolPoint[]
  logs: PatrolLog[]
  onSelectPoint: (point: PatrolPoint) => void
}

export default function PatrolMap({ points, logs, onSelectPoint }: PatrolMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = mapContainerRef.current
    if (!container) return

    let isMounted = true

    // Dynamically import Leaflet client-side
    import('leaflet').then((L) => {
      if (!isMounted) return

      // Fix default marker icon assets
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      const centerLat = points.length > 0 ? points[0].latitude : 1.154500
      const centerLng = points.length > 0 ? points[0].longitude : 104.054500

      // Initialize Leaflet map instance if not created
      if (!mapInstanceRef.current && container) {
        try {
          const map = L.map(container, {
            center: [centerLat, centerLng],
            zoom: 16,
            zoomControl: true,
          })

          // Add OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
          }).addTo(map)

          mapInstanceRef.current = map
          setLeafletLoaded(true)
        } catch (err) {
          console.warn('Leaflet init error, using interactive canvas:', err)
        }
      }

      const map = mapInstanceRef.current
      if (map) {
        // Invalidate size to ensure map fills container properly
        setTimeout(() => {
          map.invalidateSize()
        }, 150)

        // Clear previous markers
        markersRef.current.forEach((m) => map.removeLayer(m))
        markersRef.current = []

        // Add NATIVE Leaflet Markers pinned to exact GPS coordinates
        points.forEach((pt, idx) => {
          const logMatch = logs.find((l) => l.patrolPointId === pt.id)
          const isSudah = logMatch && logMatch.status === 'berhasil'
          const isTerlambat = logMatch && logMatch.status === 'terlambat'

          const pinColor = isSudah ? '#10b981' : isTerlambat ? '#f59e0b' : '#ef4444'

          const customIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
              <div style="
                background-color: ${pinColor};
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-size: 11px;
                color: #0f172a;
                cursor: pointer;
              ">
                ${idx + 1}
              </div>
              <div style="
                background: rgba(2, 6, 23, 0.9);
                color: #fbbf24;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 700;
                white-space: nowrap;
                border: 1px solid rgba(255,255,255,0.2);
                margin-top: 3px;
                text-align: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              ">
                ${pt.name}
              </div>
            `,
            iconSize: [60, 48],
            iconAnchor: [30, 24],
          })

          const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon }).addTo(map)

          const popupContent = `
            <div style="font-family: sans-serif; padding: 4px; min-width: 140px;">
              <strong style="color: #d97706; font-size: 13px;">📍 ${pt.name}</strong>
              <div style="font-size: 11px; color: #475569; margin-top: 2px;">${pt.area}</div>
              <div style="font-size: 10px; font-family: monospace; color: #64748b; margin-top: 2px;">GPS: ${pt.latitude}, ${pt.longitude}</div>
              <div style="margin-top: 6px;">
                <a href="https://www.google.com/maps/search/?api=1&query=${pt.latitude},${pt.longitude}" target="_blank" style="font-size: 10px; font-weight: bold; color: #2563eb; text-decoration: none;">
                  🗺️ Buka di Google Maps ↗
                </a>
              </div>
            </div>
          `
          marker.bindPopup(popupContent)

          marker.on('click', () => {
            onSelectPoint(pt)
          })

          markersRef.current.push(marker)
        })

        if (points.length > 0) {
          const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]))
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 })
        } else {
          map.setView([1.148500, 104.059000], 16)
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [points, logs, onSelectPoint])

  return (
    <div className='relative w-full h-80 min-h-[320px] rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner z-10 bg-slate-900'>
      <link
        rel='stylesheet'
        href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css'
      />
      <div ref={mapContainerRef} className='w-full h-full min-h-[320px] z-10' />

      {/* Fallback interactive satellite container if Leaflet loading */}
      {!leafletLoaded && (
        <div className='absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center'>
          <div className='w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-2' />
          <span className='text-xs font-bold text-amber-400'>Memuat Peta Patroli Real-time...</span>
        </div>
      )}
    </div>
  )
}
