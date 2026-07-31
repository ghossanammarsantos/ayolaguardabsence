import { useState } from 'react'
import Page from '@/components/page'

export default function ReportIncident() {
  const [pointName, setPointName] = useState('Lobby Utama')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setDescription('')
      alert('Laporan insiden berhasil dikirim ke Admin Security!')
    }, 1000)
  }

  return (
    <Page title='Laporan Insiden'>
      <div className='max-w-sm mx-auto space-y-5'>
        <div className='flex items-center space-x-3'>
          <h2 className='text-lg font-bold text-slate-100 flex items-center space-x-2'>
            <svg className='w-5 h-5 text-amber-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
            <span>Buat Laporan Insiden / Temuan</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className='bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Pilih Titik Lokasi</label>
            <select
              value={pointName}
              onChange={(e) => setPointName(e.target.value)}
              className='w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-400 focus:outline-none'
            >
              <option value='Lobby Utama'>Lobby Utama</option>
              <option value='Kolam Renang'>Kolam Renang</option>
              <option value='Area Pantai'>Area Pantai</option>
              <option value='Area Parkir'>Area Parkir</option>
              <option value='Back of House'>Back of House</option>
            </select>
          </div>

          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>Deskripsi Kejadian / Temuan</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Tuliskan detail kejadian, kerusakan fasilitas, atau hal mencurigakan...'
              className='w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-400 focus:outline-none placeholder-slate-500'
              required
            />
          </div>

          <button
            type='submit'
            disabled={submitted}
            className='w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all'
          >
            {submitted ? 'Mengirim Laporan...' : 'KIRIM LAPORAN KE ADMIN'}
          </button>
        </form>
      </div>
    </Page>
  )
}
