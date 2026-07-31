import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getStoredLogs, getStoredPoints, getStoredGuards, formatDisplayTime } from '@/lib/mock-data'
import { PatrolLog } from '@/types'

export default function ReportPdfPreview() {
  const router = useRouter()
  const [logs, setLogs] = useState<PatrolLog[]>([])
  const [printDate, setPrintDate] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('ayola_admin_session')
      if (!adminSession) {
        router.push('/admin/login')
        return
      }
    }
    setLogs(getStoredLogs())
    setPrintDate(new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }))
  }, [router])

  return (
    <div className='min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8 font-sans select-text'>
      <Head>
        <title>Laporan Patroli Satpam - AYOLA OCARINA</title>
      </Head>

      {/* Action Header bar (hidden on print) */}
      <div className='max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md'>
        <div>
          <h1 className='text-lg font-bold text-slate-800 dark:text-slate-100'>Pratinjau Dokumen PDF Laporan Patroli</h1>
          <p className='text-xs text-slate-500 dark:text-slate-400'>Siap dicetak atau disimpan sebagai file PDF resmi</p>
        </div>

        <div className='flex items-center space-x-3'>
          <Link href='/admin' className='px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors'>
            ← Kembali ke Admin
          </Link>
          <button
            onClick={() => window.print()}
            className='px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center space-x-1.5'
          >
            <span>🖨️ Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Official Document Sheet */}
      <div className='max-w-5xl mx-auto bg-white text-slate-950 p-8 rounded-3xl shadow-2xl border-2 border-slate-200 print:shadow-none print:border-0 print:p-0 print:m-0 print:w-full'>
        {/* Document Header */}
        <div className='flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-6'>
          <div className='flex items-center space-x-4'>
            <div className='w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-md'>
              AO
            </div>
            <div>
              <h2 className='text-2xl font-black text-slate-950 uppercase tracking-widest leading-none'>AYOLA OCARINA</h2>
              <p className='text-xs font-bold text-amber-600 uppercase tracking-wider mt-1'>RESORT & CONVENTION • BATAM</p>
              <p className='text-[10px] text-slate-500 mt-0.5'>Laporan Resmi Rekapitulasi Presensi & Patroli Keamanan Satpam</p>
            </div>
          </div>

          <div className='text-right font-mono text-xs text-slate-600 space-y-0.5'>
            <div><strong className='text-slate-900'>No. Dokumen:</strong> LAP-AO/{new Date().getFullYear()}/001</div>
            <div><strong className='text-slate-900'>Tanggal Cetak:</strong> {printDate}</div>
            <div><strong className='text-slate-900'>Status Laporan:</strong> <span className='text-emerald-700 font-bold uppercase'>TERVERIFIKASI</span></div>
          </div>
        </div>

        {/* Summary Statistics Grid */}
        <div className='grid grid-cols-4 gap-4 mb-6 text-center text-xs'>
          <div className='p-3 bg-slate-50 rounded-xl border border-slate-200'>
            <span className='block text-[10px] text-slate-500 font-bold uppercase'>Total Aktivitas</span>
            <span className='block text-xl font-black text-slate-900 font-mono mt-0.5'>{logs.length}</span>
          </div>
          <div className='p-3 bg-slate-50 rounded-xl border border-slate-200'>
            <span className='block text-[10px] text-slate-500 font-bold uppercase'>Absen Berhasil</span>
            <span className='block text-xl font-black text-emerald-600 font-mono mt-0.5'>{logs.filter(l => l.status === 'berhasil').length}</span>
          </div>
          <div className='p-3 bg-slate-50 rounded-xl border border-slate-200'>
            <span className='block text-[10px] text-slate-500 font-bold uppercase'>Terlambat</span>
            <span className='block text-xl font-black text-amber-600 font-mono mt-0.5'>{logs.filter(l => l.status === 'terlambat').length}</span>
          </div>
          <div className='p-3 bg-slate-50 rounded-xl border border-slate-200'>
            <span className='block text-[10px] text-slate-500 font-bold uppercase'>Tingkat Kepatuhan</span>
            <span className='block text-xl font-black text-indigo-600 font-mono mt-0.5'>96.5%</span>
          </div>
        </div>

        {/* Official Activity Table */}
        <div className='mb-8 overflow-x-auto'>
          <table className='w-full text-left text-xs border-collapse'>
            <thead>
              <tr className='bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider'>
                <th className='p-2.5 border border-slate-900'>No</th>
                <th className='p-2.5 border border-slate-900'>ID Satpam</th>
                <th className='p-2.5 border border-slate-900'>Nama Satpam</th>
                <th className='p-2.5 border border-slate-900'>Titik Patroli</th>
                <th className='p-2.5 border border-slate-900'>Zona / Area</th>
                <th className='p-2.5 border border-slate-900'>Waktu Scan</th>
                <th className='p-2.5 border border-slate-900'>GPS Koordinat</th>
                <th className='p-2.5 border border-slate-900 text-center'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 text-[11px]'>
              {logs.map((log, idx) => (
                <tr key={log.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className='p-2.5 border border-slate-200 font-mono text-center'>{idx + 1}</td>
                  <td className='p-2.5 border border-slate-200 font-mono font-bold text-amber-800'>{log.guardId}</td>
                  <td className='p-2.5 border border-slate-200 font-bold text-slate-900'>{log.guardName}</td>
                  <td className='p-2.5 border border-slate-200 font-semibold text-slate-800'>{log.pointName}</td>
                  <td className='p-2.5 border border-slate-200 text-slate-600'>{log.area}</td>
                  <td className='p-2.5 border border-slate-200 font-mono'>{formatDisplayTime(log)}</td>
                  <td className='p-2.5 border border-slate-200 font-mono text-[10px] text-slate-600'>{log.latitude}, {log.longitude}</td>
                  <td className='p-2.5 border border-slate-200 text-center'>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      log.status === 'berhasil' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {log.status === 'berhasil' ? 'Berhasil' : 'Terlambat'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures & Footer Verification */}
        <div className='pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center print:break-inside-avoid'>
          <div>
            <p className='text-slate-500 font-medium mb-12'>Dibuat Oleh (Chief Security):</p>
            <div className='w-40 border-b border-slate-900 mx-auto mb-1' />
            <p className='font-bold text-slate-900 uppercase'>Budi Santoso</p>
            <p className='text-[10px] text-slate-500 font-mono'>NIP: SEC-2025-001</p>
          </div>

          <div>
            <p className='text-slate-500 font-medium mb-12'>Disetujui Oleh (General Manager):</p>
            <div className='w-40 border-b border-slate-900 mx-auto mb-1' />
            <p className='font-bold text-slate-900 uppercase'>Ayola Ocarina Management</p>
            <p className='text-[10px] text-slate-500 font-mono'>VERIFIED & STAMPED</p>
          </div>
        </div>
      </div>
    </div>
  )
}
