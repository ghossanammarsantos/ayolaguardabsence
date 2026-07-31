import { useEffect, useRef, useState } from 'react'

interface LocationPickerMapProps {
  latitude: number
  longitude: number
  onChangeLocation: (lat: number, lng: number) => void
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChangeLocation,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = mapContainerRef.current
    if (!container) return

    let isMounted = true

    import('leaflet').then((L) => {
      if (!isMounted) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      const initLat = latitude || 1.1545
      const initLng = longitude || 104.0545

      if (!mapInstanceRef.current && container) {
        try {
          const map = L.map(container, {
            center: [initLat, initLng],
            zoom: 16,
          })

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
          }).addTo(map)

          // Click on map to set position
          map.on('click', (e: any) => {
            const { lat, lng } = e.latlng
            const roundedLat = parseFloat(lat.toFixed(6))
            const roundedLng = parseFloat(lng.toFixed(6))

            if (markerRef.current) {
              markerRef.current.setLatLng([roundedLat, roundedLng])
            }
            onChangeLocation(roundedLat, roundedLng)
          })

          mapInstanceRef.current = map
          setLeafletLoaded(true)
        } catch (err) {
          console.warn('LocationPickerMap init error:', err)
        }
      }

      const map = mapInstanceRef.current
      if (map) {
        setTimeout(() => {
          map.invalidateSize()
        }, 150)

        const curLat = latitude || 1.1545
        const curLng = longitude || 104.0545

        const pinIcon = L.divIcon({
          className: 'picker-leaflet-marker',
          html: `
            <div style="
              background-color: #f59e0b;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              cursor: grab;
            ">
              📍
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        if (!markerRef.current) {
          const marker = L.marker([curLat, curLng], {
            icon: pinIcon,
            draggable: true,
          }).addTo(map)

          marker.on('dragend', (event: any) => {
            const position = event.target.getLatLng()
            const roundedLat = parseFloat(position.lat.toFixed(6))
            const roundedLng = parseFloat(position.lng.toFixed(6))
            onChangeLocation(roundedLat, roundedLng)
          })

          markerRef.current = marker
        } else {
          markerRef.current.setLatLng([curLat, curLng])
          map.setView([curLat, curLng])
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [latitude, longitude, onChangeLocation])

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung GPS Geolocation.')
      return
    }
    setGettingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6))
        const lng = parseFloat(pos.coords.longitude.toFixed(6))
        onChangeLocation(lat, lng)

        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
          mapInstanceRef.current.setView([lat, lng], 17)
        }
        setGettingLocation(false)
      },
      (err) => {
        console.warn('Geolocation error:', err)
        setLocationError('Gagal mengambil lokasi GPS. Pastikan izin lokasi diizinkan di browser.')
        setGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <label className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
          Pilih Lokasi Titik di Peta (Klik / Geser Pin)
        </label>
        <button
          type='button'
          onClick={handleGetCurrentLocation}
          disabled={gettingLocation}
          className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center space-x-1 shadow-sm transition-all disabled:opacity-50'
        >
          {gettingLocation ? (
            <span>Mencari GPS...</span>
          ) : (
            <>
              <span>🎯 Gunakan Lokasi GPS Saya</span>
            </>
          )}
        </button>
      </div>

      {locationError && (
        <div className='text-xs text-red-500 font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20'>
          {locationError}
        </div>
      )}

      <div className='relative w-full h-64 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner bg-slate-900'>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css'
        />
        <div ref={mapContainerRef} className='w-full h-full z-10' />

        {!leafletLoaded && (
          <div className='absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center p-4 text-center'>
            <div className='w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-2' />
            <span className='text-xs font-bold text-amber-400'>Memuat Peta Pemilih Lokasi...</span>
          </div>
        )}
      </div>

      <div className='flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono pt-1'>
        <span>Lat: <strong className='text-amber-500'>{latitude || 0}</strong></span>
        <span>Lng: <strong className='text-amber-500'>{longitude || 0}</strong></span>
        {latitude && longitude ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target='_blank'
            rel='noreferrer'
            className='text-blue-500 font-semibold hover:underline'
          >
            Google Maps ↗
          </a>
        ) : null}
      </div>
    </div>
  )
}
