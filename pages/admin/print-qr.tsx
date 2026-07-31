import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getStoredPoints } from '@/lib/mock-data'
import { PatrolPoint } from '@/types'

export default function PrintQRCodes() {
  const [points, setPoints] = useState<PatrolPoint[]>([])

  useEffect(() => {
    setPoints(getStoredPoints())
  }, [])

  return (
    <div className='min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 font-sans select-text'>
      <Head>
        <title>Cetak QR Point Patroli | AYOLA OCARINA</title>
      </Head>

      {/* Non-printable Action Bar */}
      <div className='max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden'>
        <div>
          <h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100'>QR Code Titik Patroli Satpam (Printable)</h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>Cetak dan tempelkan QR Code ini pada lokasi fisik patroli (Lobby, Kolam, Pantai, dll)</p>
        </div>

        <div className='flex items-center space-x-3'>
          <Link href='/admin' className='px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors'>
            ← Kembali ke Admin
          </Link>
          <button
            onClick={() => window.print()}
            className='px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-1.5'
          >
            <span>🖨️ Cetak / Print QR</span>
          </button>
        </div>
      </div>

      {/* Printable Grid of QR Point Cards matching Ayola Ocarina reference style */}
      <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4'>
        {points.map((pt, idx) => {
          const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pt.code)}`

          return (
            <div
              key={pt.id}
              className='bg-white text-slate-950 border-2 border-amber-500 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between items-center text-center space-y-4 print:break-inside-avoid'
            >
              {/* Header Brand */}
              <div className='w-full border-b border-amber-500/30 pb-3 flex items-center justify-between'>
                <div className='text-left'>
                  <span className='block text-[10px] uppercase tracking-widest text-amber-600 font-bold leading-none'>AYOLA</span>
                  <span className='block text-xs tracking-wider text-slate-900 font-black leading-tight'>OCARINA</span>
                </div>
                <span className='px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-md uppercase tracking-wider'>
                  TITIK #{idx + 1}
                </span>
              </div>

              {/* Real 2D Scannable QR Code Image Barcode */}
              <div className='w-52 h-52 bg-white p-3 border-4 border-slate-900 rounded-2xl shadow-md flex flex-col items-center justify-center relative group'>
                <img
                  src={qrDataUrl}
                  alt={`QR Code ${pt.code}`}
                  className='w-full h-full object-contain'
                />
                <span className='text-[10px] font-mono font-bold text-slate-900 uppercase block mt-1 tracking-wider'>
                  {pt.code}
                </span>
              </div>

              {/* Point Title & Area Info */}
              <div>
                <h3 className='text-xl font-black text-slate-950 uppercase tracking-wide'>{pt.name}</h3>
                <p className='text-xs font-bold text-amber-600 mt-0.5'>{pt.area}</p>
                <p className='text-[11px] text-slate-600 font-mono mt-1'>GPS: {pt.latitude}, {pt.longitude}</p>
              </div>

              {/* Instruction Footer */}
              <div className='w-full bg-slate-100 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-700 italic leading-snug'>
                &quot;{pt.instructions}&quot;
              </div>

              <div className='text-[9px] font-bold tracking-wider text-amber-700 uppercase flex items-center space-x-1'>
                <span>📷 QR CODE BISA DI-SCAN LANGSUNG MENGGUNAKAN KAMERA HP</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
