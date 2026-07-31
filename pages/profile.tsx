import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Page from '@/components/page'
import { GuardUser } from '@/types'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<GuardUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('ayola_current_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  return (
    <Page title='Profil Satpam'>
      <div className='max-w-sm mx-auto space-y-5'>
        <div className='bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl'>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'}
            alt='Profil'
            className='w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-amber-400 shadow-xl'
          />
          <div>
            <h2 className='text-xl font-bold text-slate-100'>{user?.name || 'Budi Santoso'}</h2>
            <p className='text-xs text-amber-400 font-mono font-bold mt-0.5'>{user?.guardId || 'SATPAM01'}</p>
            <span className='inline-block mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full'>
              {user?.shiftName || 'Shift Pagi (08:00 - 20:00 WIB)'}
            </span>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md text-xs'>
          <div className='flex justify-between py-2 border-b border-slate-800'>
            <span className='text-slate-400'>Jabatan</span>
            <span className='font-bold text-slate-200'>Anggota Security (Satpam)</span>
          </div>
          <div className='flex justify-between py-2 border-b border-slate-800'>
            <span className='text-slate-400'>Unit Lokasi</span>
            <span className='font-bold text-slate-200'>AYOLA OCARINA</span>
          </div>
          <div className='flex justify-between py-2 border-b border-slate-800'>
            <span className='text-slate-400'>No. Telepon</span>
            <span className='font-bold text-slate-200'>+62 812-3456-7890</span>
          </div>
          <div className='flex justify-between py-2'>
            <span className='text-slate-400'>Status Akun</span>
            <span className='font-bold text-emerald-400'>Aktif & Terverifikasi</span>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('ayola_current_user')
            router.push('/login')
          }}
          className='w-full py-3.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors'
        >
          LOGOUT AKUN
        </button>
      </div>
    </Page>
  )
}
