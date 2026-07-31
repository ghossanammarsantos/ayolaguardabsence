import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const PatrolMap = dynamic(() => import('@/components/patrol-map'), { ssr: false })
import {
  getStoredLogs,
  getStoredPoints,
  getStoredGuards,
  computeStats,
  savePatrolPoint,
  deletePatrolPoint,
  saveGuardUser,
  deleteGuardUser,
  deletePatrolLog,
  formatDisplayTime,
} from '@/lib/mock-data'
import { PatrolLog, PatrolPoint, GuardUser, DashboardStats } from '@/types'

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [logs, setLogs] = useState<PatrolLog[]>([])
  const [points, setPoints] = useState<PatrolPoint[]>([])
  const [guards, setGuards] = useState<GuardUser[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    activeGuards: 12,
    totalPoints: 48,
    completedPatrols: 46,
    pendingPatrols: 2,
    latePatrols: 3,
  })

  const [activeTab, setActiveTab] = useState<'monitoring' | 'points' | 'guards' | 'reports'>('monitoring')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [selectedLogDetail, setSelectedLogDetail] = useState<PatrolLog | null>(null)

  // Filter States (Hari, Bulan, Custom Date Picker)
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'month' | 'custom'>('all')
  const [filterStartDate, setFilterStartDate] = useState<string>('')
  const [filterEndDate, setFilterEndDate] = useState<string>('')
  const [filterGuardId, setFilterGuardId] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Point Modals State
  const [showAddPointModal, setShowAddPointModal] = useState(false)
  const [editingPoint, setEditingPoint] = useState<PatrolPoint | null>(null)
  const [newPoint, setNewPoint] = useState({ name: '', area: '', code: '', instructions: '' })

  // Guard Modals State
  const [showAddGuardModal, setShowAddGuardModal] = useState(false)
  const [editingGuard, setEditingGuard] = useState<GuardUser | null>(null)
  const [newGuard, setNewGuard] = useState({
    guardId: '',
    name: '',
    phone: '',
    shiftName: 'Shift Pagi (08:00 - 20:00 WIB)',
    password: '',
  })

  const [selectedMapPoint, setSelectedMapPoint] = useState<PatrolPoint | null>(null)

  const reloadData = () => {
    const l = getStoredLogs()
    const p = getStoredPoints()
    const g = getStoredGuards()
    setLogs(l)
    setPoints(p)
    setGuards(g)
    setStats(computeStats(l, p))
  }

  useEffect(() => {
    setMounted(true)
    reloadData()
  }, [])

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    // Guard Filter
    if (filterGuardId !== 'all' && log.guardId !== filterGuardId) return false

    // Status Filter
    if (filterStatus !== 'all' && log.status !== filterStatus) return false

    // Date / Period Filter
    const logDate = log.scannedAt ? new Date(log.scannedAt) : new Date()

    if (filterPeriod === 'today') {
      const today = new Date()
      return (
        logDate.getDate() === today.getDate() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getFullYear() === today.getFullYear()
      )
    }

    if (filterPeriod === 'month') {
      const today = new Date()
      return logDate.getMonth() === today.getMonth() && logDate.getFullYear() === today.getFullYear()
    }

    if (filterPeriod === 'custom') {
      if (filterStartDate) {
        const start = new Date(filterStartDate)
        start.setHours(0, 0, 0, 0)
        if (logDate < start) return false
      }
      if (filterEndDate) {
        const end = new Date(filterEndDate)
        end.setHours(23, 59, 59, 999)
        if (logDate > end) return false
      }
    }

    return true
  })

  // POINT CRUD
  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPoint.name || !newPoint.area) return

    const pointCode = newPoint.code || `QR-${newPoint.name.toUpperCase().replace(/\s+/g, '-')}-0${points.length + 1}`
    const created: PatrolPoint = {
      id: 'pt_' + Date.now(),
      code: pointCode,
      name: newPoint.name,
      area: newPoint.area,
      scheduleStart: '08:00',
      scheduleEnd: '20:00',
      instructions: newPoint.instructions || 'Pastikan area aman & terkunci.',
      latitude: -1.158000 + Math.random() * 0.003,
      longitude: 104.053000 + Math.random() * 0.003,
      allowedRadiusMeters: 50,
      imageSample: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    }

    savePatrolPoint(created)
    reloadData()
    setNewPoint({ name: '', area: '', code: '', instructions: '' })
    setShowAddPointModal(false)
    alert(`Titik patroli "${created.name}" (${created.code}) berhasil dibuat!`)
  }

  const handleUpdatePoint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPoint) return
    savePatrolPoint(editingPoint)
    reloadData()
    setEditingPoint(null)
    alert(`Titik patroli "${editingPoint.name}" berhasil diperbarui!`)
  }

  const handleDeletePoint = (pointId: string, pointName: string) => {
    if (confirm(`Hapus titik patroli "${pointName}"?`)) {
      deletePatrolPoint(pointId)
      reloadData()
    }
  }

  // GUARD CRUD
  const handleAddGuard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuard.guardId || !newGuard.name) return

    const created: GuardUser = {
      id: 'usr_' + Date.now(),
      guardId: newGuard.guardId.toUpperCase(),
      name: newGuard.name,
      phone: newGuard.phone || '+62 812-0000-0000',
      role: 'guard',
      shiftName: newGuard.shiftName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    }

    saveGuardUser(created)
    reloadData()
    setNewGuard({
      guardId: '',
      name: '',
      phone: '',
      shiftName: 'Shift Pagi (08:00 - 20:00 WIB)',
      password: '',
    })
    setShowAddGuardModal(false)
    alert(`Akun Satpam "${created.name}" (${created.guardId}) berhasil dibuat!`)
  }

  const handleUpdateGuard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGuard) return
    saveGuardUser(editingGuard)
    reloadData()
    setEditingGuard(null)
    alert(`Data satpam "${editingGuard.name}" berhasil diperbarui!`)
  }

  const handleDeleteGuard = (guardId: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun satpam "${name}" (${guardId})?`)) {
      deleteGuardUser(guardId)
      reloadData()
    }
  }

  // LOG CRUD
  const handleDeleteLog = (logId: string) => {
    if (confirm('Hapus catatan riwayat patroli ini?')) {
      deletePatrolLog(logId)
      reloadData()
    }
  }

  const exportReport = (format: 'pdf' | 'excel') => {
    const logsToExport = filteredLogs

    if (format === 'pdf') {
      try {
        const doc = new jsPDF({ orientation: 'landscape' })

        // Header Title & Branding
        doc.setFillColor(15, 23, 42)
        doc.rect(0, 0, doc.internal.pageSize.width, 22, 'F')

        doc.setTextColor(251, 191, 36)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('AYOLA OCARINA - LAPORAN REKAPITULASI PATROLI SATPAM', 14, 14)

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.text(`Tgl Cetak: ${new Date().toLocaleDateString('id-ID')}`, doc.internal.pageSize.width - 50, 14)

        // Table Content
        const tableHead = [['No', 'ID Satpam', 'Nama Satpam', 'Titik Patroli', 'Area / Zona', 'Waktu Scan', 'GPS Koordinat', 'Status']]
        const tableBody = logsToExport.map((log, idx) => [
          idx + 1,
          log.guardId,
          log.guardName,
          log.pointName,
          log.area,
          formatDisplayTime(log),
          `${log.latitude}, ${log.longitude}`,
          log.status === 'berhasil' ? 'Berhasil' : 'Terlambat',
        ])

        autoTable(doc, {
          head: tableHead,
          body: tableBody,
          startY: 28,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11], textColor: [15, 23, 42], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          styles: { fontSize: 8, cellPadding: 3 },
        })

        doc.save(`Laporan_Patroli_Ayola_Ocarina_${Date.now()}.pdf`)
      } catch (err) {
        console.error('PDF export error:', err)
        window.open('/admin/report-pdf', '_blank')
      }
      return
    }

    // Real Binary XLSX Export using SheetJS
    try {
      const data = logsToExport.map((log, idx) => ({
        'No': idx + 1,
        'ID Satpam': log.guardId,
        'Nama Satpam': log.guardName,
        'Titik Patroli': log.pointName,
        'Area / Zona': log.area,
        'Waktu Scan': formatDisplayTime(log),
        'GPS Lintang': log.latitude,
        'GPS Bujur': log.longitude,
        'Status': log.status === 'berhasil' ? 'Berhasil' : 'Terlambat',
      }))

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Patroli')
      XLSX.writeFile(workbook, `Laporan_Patroli_Ayola_Ocarina_${Date.now()}.xlsx`)
    } catch (err) {
      console.error('Excel export error:', err)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors'>
      <Head>
        <title>Dashboard Admin | AYOLA OCARINA</title>
      </Head>

      {/* Admin Navbar */}
      <header className='sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 transition-colors'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20'>
              <svg className='w-6 h-6 text-slate-950 font-bold' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <div>
              <div className='flex items-center space-x-2'>
                <h1 className='text-lg font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none'>AYOLA OCARINA</h1>
                <span className='text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded font-semibold border border-amber-500/30'>ADMIN PORTAL</span>
              </div>
              <p className='text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5'>Dashboard Monitoring Real-time & Laporan Patroli</p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5'
              >
                {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
              </button>
            )}

            <Link href='/admin/print-qr' className='text-xs px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5'>
              <span>🖨️ Cetak QR Point</span>
            </Link>

            <Link href='/' className='text-xs px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1.5'>
              <span>📱 Buka PWA Satpam</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className='max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6'>

        {/* Sidebar Navigation */}
        <div className='lg:col-span-3 space-y-4'>
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg dark:shadow-xl transition-colors'>
            <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2'>Fitur Admin</h3>

            <button
              onClick={() => setActiveTab('monitoring')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'monitoring' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
              </svg>
              <span>Monitoring Real-time</span>
            </button>

            <button
              onClick={() => setActiveTab('guards')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'guards' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
              </svg>
              <span>Manajemen Satpam</span>
            </button>

            <button
              onClick={() => setActiveTab('points')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'points' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
              </svg>
              <span>Manajemen Titik Patroli</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'reports' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <span>Laporan & Export</span>
            </button>
          </div>

          {/* Quick Export Actions */}
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg dark:shadow-xl transition-colors'>
            <h4 className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Export Laporan (Filtered)</h4>
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={() => exportReport('pdf')}
                className='py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5'
              >
                <span>📄 PDF</span>
              </button>
              <button
                onClick={() => exportReport('excel')}
                className='py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5'
              >
                <span>📊 Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='lg:col-span-9 space-y-6'>

          {/* Metric Summary Cards */}
          <div className='grid grid-cols-2 sm:grid-cols-5 gap-3'>
            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-md dark:shadow-lg transition-colors'>
              <span className='block text-2xl font-black text-slate-800 dark:text-slate-100 font-mono'>{guards.length || stats.activeGuards}</span>
              <span className='block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1'>Satpam Aktif</span>
            </div>

            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-md dark:shadow-lg transition-colors'>
              <span className='block text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono'>{points.length || stats.totalPoints}</span>
              <span className='block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1'>Total Titik</span>
            </div>

            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-md dark:shadow-lg transition-colors'>
              <span className='block text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono'>{stats.completedPatrols}</span>
              <span className='block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1'>Sudah Absen</span>
            </div>

            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-md dark:shadow-lg transition-colors'>
              <span className='block text-2xl font-black text-red-500 dark:text-red-400 font-mono'>{stats.pendingPatrols}</span>
              <span className='block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1'>Belum Absen</span>
            </div>

            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-md dark:shadow-lg transition-colors col-span-2 sm:col-span-1'>
              <span className='block text-2xl font-black text-amber-600 dark:text-amber-400 font-mono'>{stats.latePatrols}</span>
              <span className='block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1'>Terlambat</span>
            </div>
          </div>

          {/* FILTER BAR PANEL (HARI, BULAN, CUSTOM DATE PICKER) */}
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-md space-y-3 transition-colors'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5'>
                <span>🔍 Filter Laporan & Monitoring</span>
                <span className='text-[10px] text-amber-600 dark:text-amber-400 font-mono font-normal'>
                  ({filteredLogs.length} data ditemukan)
                </span>
              </h3>
              {(filterPeriod !== 'all' || filterGuardId !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setFilterPeriod('all')
                    setFilterStartDate('')
                    setFilterEndDate('')
                    setFilterGuardId('all')
                    setFilterStatus('all')
                  }}
                  className='text-[11px] text-red-500 hover:underline font-bold'
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs'>
              {/* Filter Period Preset */}
              <div>
                <label className='block font-semibold text-slate-500 dark:text-slate-400 mb-1'>Periode</label>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value as any)}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:border-amber-400 focus:outline-none'
                >
                  <option value='all'>Semua Data</option>
                  <option value='today'>Hari Ini</option>
                  <option value='month'>Bulan Ini</option>
                  <option value='custom'>Rentang Tanggal (Date Picker)</option>
                </select>
              </div>

              {/* Filter Satpam */}
              <div>
                <label className='block font-semibold text-slate-500 dark:text-slate-400 mb-1'>Personel Satpam</label>
                <select
                  value={filterGuardId}
                  onChange={(e) => setFilterGuardId(e.target.value)}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:border-amber-400 focus:outline-none'
                >
                  <option value='all'>Semua Personel</option>
                  {guards.map((g) => (
                    <option key={g.id} value={g.guardId}>
                      {g.guardId} - {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div>
                <label className='block font-semibold text-slate-500 dark:text-slate-400 mb-1'>Status Patroli</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-medium focus:border-amber-400 focus:outline-none'
                >
                  <option value='all'>Semua Status</option>
                  <option value='berhasil'>Berhasil</option>
                  <option value='terlambat'>Terlambat</option>
                </select>
              </div>
            </div>

            {/* Custom Date Pickers (Shown if filterPeriod === 'custom') */}
            {filterPeriod === 'custom' && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs'>
                <div>
                  <label className='block font-semibold text-amber-600 dark:text-amber-400 mb-1'>📅 Tanggal Mulai</label>
                  <input
                    type='date'
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className='w-full bg-slate-50 dark:bg-slate-950 border border-amber-400/50 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-mono focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block font-semibold text-amber-600 dark:text-amber-400 mb-1'>📅 Tanggal Selesai</label>
                  <input
                    type='date'
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className='w-full bg-slate-50 dark:bg-slate-950 border border-amber-400/50 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-mono focus:outline-none'
                  />
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: MONITORING REAL-TIME */}
          {activeTab === 'monitoring' && (
            <div className='grid grid-cols-1 xl:grid-cols-12 gap-6'>
              {/* Recent Activity Table */}
              <div className='xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg dark:shadow-xl space-y-4 transition-colors'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-2'>
                    <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                    <span>Aktivitas Terbaru</span>
                  </h3>
                  <span className='text-xs text-slate-500 dark:text-slate-400 font-mono'>
                    {filteredLogs.length} hasil tersaring
                  </span>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-xs'>
                    <thead>
                      <tr className='border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]'>
                        <th className='pb-3 pr-2'>Satpam</th>
                        <th className='pb-3 px-2'>Titik Patroli</th>
                        <th className='pb-3 px-2'>Jam Datang</th>
                        <th className='pb-3 px-2'>Bukti Foto</th>
                        <th className='pb-3 px-2 text-center'>Status</th>
                        <th className='pb-3 pl-2 text-right'>Aksi</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100 dark:divide-slate-800/60'>
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className='hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors'>
                          <td className='py-3 pr-2 font-bold text-slate-800 dark:text-slate-200'>
                            <div className='flex items-center space-x-2'>
                              <img src={log.guardAvatar} alt='' className='w-6 h-6 rounded-full object-cover ring-1 ring-amber-400' />
                              <span>{log.guardName}</span>
                            </div>
                          </td>
                          <td className='py-3 px-2 text-slate-700 dark:text-slate-300 font-medium'>{log.pointName}</td>
                          <td className='py-3 px-2 text-slate-500 dark:text-slate-400 font-mono'>{formatDisplayTime(log)}</td>
                          <td className='py-3 px-2'>
                            <button
                              onClick={() => setSelectedPhoto(log.photoUrl)}
                              className='w-8 h-8 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-amber-400 transition-all inline-block'
                              title='Klik untuk perbesar foto'
                            >
                              <img src={log.photoUrl} alt='' className='w-full h-full object-cover' />
                            </button>
                          </td>
                          <td className='py-3 px-2 text-center'>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                log.status === 'berhasil'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {log.status === 'berhasil' ? 'Berhasil' : 'Terlambat'}
                            </span>
                          </td>
                          <td className='py-3 pl-2 text-right'>
                            <div className='flex items-center justify-end space-x-1.5'>
                              <button
                                onClick={() => setSelectedLogDetail(log)}
                                className='px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1'
                              >
                                <span>👁️ Detail</span>
                              </button>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className='p-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center'
                                title='Hapus log'
                              >
                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Real-time Patrol Map Graphic with OpenStreetMap & Google Maps Integration */}
              <div className='xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg dark:shadow-xl space-y-4 transition-colors'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider'>Peta Patroli Real-time</h3>
                    <p className='text-[10px] text-slate-500 dark:text-slate-400'>Google Maps & OpenStreetMap Real GPS Coordinates</p>
                  </div>
                  <div className='flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-slate-400'>
                    <span className='flex items-center'><span className='w-2 h-2 rounded-full bg-emerald-500 mr-1' />Sudah</span>
                    <span className='flex items-center'><span className='w-2 h-2 rounded-full bg-amber-500 mr-1' />Terlambat</span>
                    <span className='flex items-center'><span className='w-2 h-2 rounded-full bg-red-500 mr-1' />Belum</span>
                  </div>
                </div>

                {/* Native Leaflet Map Component with Full Drag/Pan Sync */}
                <PatrolMap
                  points={points}
                  logs={logs}
                  onSelectPoint={(pt) => setSelectedMapPoint(pt)}
                />

                {/* Selected Map Point Info Box with Google Maps Redirect Link */}
                {selectedMapPoint ? (
                  <div className='p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-amber-500/30 text-xs space-y-2'>
                    <div className='flex items-center justify-between font-bold text-amber-600 dark:text-amber-400'>
                      <span className='text-sm'>📍 {selectedMapPoint.name}</span>
                      <span className='font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20'>
                        {selectedMapPoint.code}
                      </span>
                    </div>
                    <p className='text-slate-600 dark:text-slate-400 text-[11px] font-medium'>
                      Area: {selectedMapPoint.area} • GPS: <span className='font-mono font-bold text-slate-800 dark:text-slate-200'>{selectedMapPoint.latitude}, {selectedMapPoint.longitude}</span>
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedMapPoint.latitude},${selectedMapPoint.longitude}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-amber-400 hover:bg-slate-800 text-[11px] font-bold rounded-lg transition-colors border border-amber-500/30'
                    >
                      <span>🗺️ Buka Koordinat Real di Google Maps</span>
                      <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                      </svg>
                    </a>
                  </div>
                ) : (
                  <div className='p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center font-medium'>
                    💡 Klik marker angka pada peta untuk membuka koordinat presisi di Google Maps
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: MANAJEMEN SATPAM (GUARDS CRUD) */}
          {activeTab === 'guards' && (
            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg dark:shadow-xl space-y-5 transition-colors'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-base font-bold text-slate-800 dark:text-slate-100'>Daftar Akun Satpam ({guards.length})</h3>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>Kelola data personel (Create, Read, Edit, Delete)</p>
                </div>
                <button
                  onClick={() => setShowAddGuardModal(true)}
                  className='px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all'
                >
                  + Tambah Satpam Baru
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {guards.map((g) => (
                  <div key={g.id} className='p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative group hover:border-amber-500/40 transition-all'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center space-x-3'>
                        <img src={g.avatar} alt='' className='w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/80 shadow-md' />
                        <div>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono'>
                            {g.guardId}
                          </span>
                          <h4 className='text-sm font-bold text-slate-800 dark:text-slate-100 mt-1'>{g.name}</h4>
                          <p className='text-xs text-slate-500 dark:text-slate-400'>{g.phone}</p>
                        </div>
                      </div>

                      {/* CRUD Actions for Guard */}
                      <div className='flex items-center space-x-1.5'>
                        <button
                          onClick={() => setEditingGuard(g)}
                          className='p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors'
                          title='Edit Satpam'
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteGuard(g.guardId, g.name)}
                          className='p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors'
                          title='Hapus Satpam'
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className='text-xs font-medium text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-2 flex items-center justify-between'>
                      <span>⏱️ {g.shiftName}</span>
                      <span className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                        Aktif
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MANAJEMEN TITIK PATROLI (POINTS CRUD) */}
          {activeTab === 'points' && (
            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg dark:shadow-xl space-y-5 transition-colors'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-base font-bold text-slate-800 dark:text-slate-100'>Daftar Titik Patroli (QR Point)</h3>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>Kelola lokasi patroli (Create, Read, Edit, Delete)</p>
                </div>
                <button
                  onClick={() => setShowAddPointModal(true)}
                  className='px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all'
                >
                  + Tambah Titik QR
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {points.map((pt, idx) => (
                  <div key={pt.id} className='p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 relative group hover:border-amber-500/40 transition-all'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <span className='text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20'>
                          Titik #{idx + 1}
                        </span>
                        <h4 className='text-base font-bold text-slate-800 dark:text-slate-100 mt-1'>{pt.name}</h4>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>{pt.area}</p>
                      </div>

                      {/* CRUD Actions for Point */}
                      <div className='flex items-center space-x-1.5'>
                        <button
                          onClick={() => setEditingPoint(pt)}
                          className='p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors'
                          title='Edit Titik'
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePoint(pt.id, pt.name)}
                          className='p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors'
                          title='Hapus Titik'
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className='text-xs text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800'>
                      &quot;{pt.instructions}&quot;
                    </p>

                    <div className='text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-2 flex justify-between'>
                      <span>QR Code: {pt.code}</span>
                      <span>Radius: {pt.allowedRadiusMeters}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LAPORAN & REKAP */}
          {activeTab === 'reports' && (
            <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg dark:shadow-xl space-y-4 transition-colors'>
              <h3 className='text-base font-bold text-slate-800 dark:text-slate-100'>Laporan Audit & Presensi Satpam</h3>
              <p className='text-xs text-slate-500 dark:text-slate-400'>Filter dan unduh data rekapan patroli tersaring ({filteredLogs.length} log ter-filter)</p>

              <div className='flex flex-wrap gap-3 pt-2'>
                <button onClick={() => exportReport('pdf')} className='px-5 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl transition-all flex items-center space-x-2'>
                  <span>📄 Download PDF (Tersaring)</span>
                </button>
                <button onClick={() => exportReport('excel')} className='px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl transition-all flex items-center space-x-2'>
                  <span>📊 Download Excel (Tersaring)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Audit Foto */}
      {selectedPhoto && (
        <div onClick={() => setSelectedPhoto(null)} className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl'>
            <h4 className='text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2'>Audit Foto Bukti Selfie Satpam</h4>
            <img src={selectedPhoto} alt='' className='w-full rounded-2xl object-cover aspect-square border border-slate-200 dark:border-slate-800' />
            <button onClick={() => setSelectedPhoto(null)} className='mt-3 w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold'>
              Tutup Audit Foto
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah Satpam Baru */}
      {showAddGuardModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4'>
            <h3 className='text-lg font-bold text-slate-800 dark:text-slate-100'>Tambah Akun Satpam Baru</h3>
            <form onSubmit={handleAddGuard} className='space-y-3 text-xs'>
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>ID Satpam / Username</label>
                <input
                  type='text'
                  value={newGuard.guardId}
                  onChange={(e) => setNewGuard({ ...newGuard, guardId: e.target.value })}
                  placeholder='e.g. SATPAM05'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 font-mono focus:border-amber-400 focus:outline-none uppercase'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Nama Lengkap Personel</label>
                <input
                  type='text'
                  value={newGuard.name}
                  onChange={(e) => setNewGuard({ ...newGuard, name: e.target.value })}
                  placeholder='e.g. Bambang Trihatmojo'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>No. Telepon / WhatsApp</label>
                <input
                  type='text'
                  value={newGuard.phone}
                  onChange={(e) => setNewGuard({ ...newGuard, phone: e.target.value })}
                  placeholder='e.g. +62 812-3456-7890'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Pilih Shift Bertugas</label>
                <select
                  value={newGuard.shiftName}
                  onChange={(e) => setNewGuard({ ...newGuard, shiftName: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                >
                  <option value='Shift Pagi (08:00 - 20:00 WIB)'>Shift Pagi (08:00 - 20:00 WIB)</option>
                  <option value='Shift Malam (20:00 - 08:00 WIB)'>Shift Malam (20:00 - 08:00 WIB)</option>
                </select>
              </div>

              <div className='flex justify-end space-x-3 pt-2'>
                <button type='button' onClick={() => setShowAddGuardModal(false)} className='px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl'>
                  Batal
                </button>
                <button type='submit' className='px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20'>
                  Simpan Satpam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Satpam */}
      {editingGuard && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4'>
            <h3 className='text-lg font-bold text-slate-800 dark:text-slate-100'>Edit Data Satpam</h3>
            <form onSubmit={handleUpdateGuard} className='space-y-3 text-xs'>
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>ID Satpam</label>
                <input
                  type='text'
                  value={editingGuard.guardId}
                  disabled
                  className='w-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-500 dark:text-slate-400 font-mono'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Nama Lengkap</label>
                <input
                  type='text'
                  value={editingGuard.name}
                  onChange={(e) => setEditingGuard({ ...editingGuard, name: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>No. Telepon / WhatsApp</label>
                <input
                  type='text'
                  value={editingGuard.phone}
                  onChange={(e) => setEditingGuard({ ...editingGuard, phone: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Shift Bertugas</label>
                <select
                  value={editingGuard.shiftName}
                  onChange={(e) => setEditingGuard({ ...editingGuard, shiftName: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                >
                  <option value='Shift Pagi (08:00 - 20:00 WIB)'>Shift Pagi (08:00 - 20:00 WIB)</option>
                  <option value='Shift Malam (20:00 - 08:00 WIB)'>Shift Malam (20:00 - 08:00 WIB)</option>
                </select>
              </div>

              <div className='flex justify-end space-x-3 pt-2'>
                <button type='button' onClick={() => setEditingGuard(null)} className='px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl'>
                  Batal
                </button>
                <button type='submit' className='px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20'>
                  Update Satpam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Titik QR */}
      {showAddPointModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4'>
            <h3 className='text-lg font-bold text-slate-800 dark:text-slate-100'>Tambah Titik Patroli (QR Point)</h3>
            <form onSubmit={handleAddPoint} className='space-y-3 text-xs'>
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Nama Titik Patroli</label>
                <input
                  type='text'
                  value={newPoint.name}
                  onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                  placeholder='e.g. Ruang Server / Pintu Belakang'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Area / Zona</label>
                <input
                  type='text'
                  value={newPoint.area}
                  onChange={(e) => setNewPoint({ ...newPoint, area: e.target.value })}
                  placeholder='e.g. Lantai 2 / Exterior East'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Kode QR Token (Opsional)</label>
                <input
                  type='text'
                  value={newPoint.code}
                  onChange={(e) => setNewPoint({ ...newPoint, code: e.target.value })}
                  placeholder='Auto generate jika dikosongkan'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 font-mono focus:border-amber-400 focus:outline-none'
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Instruksi Tugas</label>
                <textarea
                  value={newPoint.instructions}
                  onChange={(e) => setNewPoint({ ...newPoint, instructions: e.target.value })}
                  placeholder='Petunjuk pengecekan...'
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  rows={2}
                />
              </div>

              <div className='flex justify-end space-x-3 pt-2'>
                <button type='button' onClick={() => setShowAddPointModal(false)} className='px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl'>
                  Batal
                </button>
                <button type='submit' className='px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20'>
                  Simpan & Generate QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Titik QR */}
      {editingPoint && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4'>
            <h3 className='text-lg font-bold text-slate-800 dark:text-slate-100'>Edit Titik Patroli</h3>
            <form onSubmit={handleUpdatePoint} className='space-y-3 text-xs'>
              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Nama Titik</label>
                <input
                  type='text'
                  value={editingPoint.name}
                  onChange={(e) => setEditingPoint({ ...editingPoint, name: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Area / Zona</label>
                <input
                  type='text'
                  value={editingPoint.area}
                  onChange={(e) => setEditingPoint({ ...editingPoint, area: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Kode QR Token</label>
                <input
                  type='text'
                  value={editingPoint.code}
                  onChange={(e) => setEditingPoint({ ...editingPoint, code: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 font-mono focus:border-amber-400 focus:outline-none'
                  required
                />
              </div>

              <div>
                <label className='block font-semibold text-slate-700 dark:text-slate-300 mb-1'>Instruksi Tugas</label>
                <textarea
                  value={editingPoint.instructions}
                  onChange={(e) => setEditingPoint({ ...editingPoint, instructions: e.target.value })}
                  className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:border-amber-400 focus:outline-none'
                  rows={2}
                />
              </div>

              <div className='flex justify-end space-x-3 pt-2'>
                <button type='button' onClick={() => setEditingPoint(null)} className='px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl'>
                  Batal
                </button>
                <button type='submit' className='px-5 py-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20'>
                  Update Titik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Detail Absensi & Patroli */}
      {selectedLogDetail && (
        <div className='fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4'>
          <div className='max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150'>
            {/* Modal Header */}
            <div className='flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4'>
              <div className='flex items-center space-x-3'>
                <img src={selectedLogDetail.guardAvatar} alt='' className='w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-md' />
                <div>
                  <div className='flex items-center space-x-2'>
                    <h3 className='text-base font-bold text-slate-900 dark:text-slate-100'>{selectedLogDetail.guardName}</h3>
                    <span className='px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold rounded border border-amber-500/20'>
                      {selectedLogDetail.guardId}
                    </span>
                  </div>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>Rincian Lengkap Hasil Scan QR & Swafoto Patroli</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLogDetail(null)}
                className='p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors'
              >
                ✕
              </button>
            </div>

            {/* Grid Information Rincian */}
            <div className='grid grid-cols-2 gap-3 text-xs'>
              <div className='p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1'>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Titik Patroli</span>
                <span className='font-bold text-slate-800 dark:text-slate-200 text-sm block'>{selectedLogDetail.pointName}</span>
                <span className='text-[11px] text-amber-600 dark:text-amber-400 block font-medium'>{selectedLogDetail.area}</span>
              </div>

              <div className='p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1'>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Jam Datang & Status</span>
                <span className='font-bold font-mono text-slate-800 dark:text-slate-200 text-sm block'>{formatDisplayTime(selectedLogDetail)}</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    selectedLogDetail.status === 'berhasil'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {selectedLogDetail.status === 'berhasil' ? '✓ Absen Berhasil' : '⏱️ Terlambat'}
                </span>
              </div>
            </div>

            {/* Bukti Swafoto / Foto Satpam */}
            <div className='space-y-2'>
              <span className='text-xs font-bold text-slate-700 dark:text-slate-300 block'>Bukti Swafoto Satpam (Verifikasi Kamera)</span>
              <div className='relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-md group'>
                <img src={selectedLogDetail.photoUrl} alt='' className='w-full h-48 object-cover' />
                <div className='absolute bottom-2 left-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-[10px] font-mono text-amber-300 font-bold border border-amber-500/30'>
                  📍 GPS: {selectedLogDetail.latitude}, {selectedLogDetail.longitude} ({selectedLogDetail.distanceMeters || 12}m dari QR)
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='pt-2 flex items-center justify-between gap-3'>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedLogDetail.latitude},${selectedLogDetail.longitude}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 py-2.5 px-3 bg-slate-900 text-amber-400 hover:bg-slate-800 font-bold text-xs rounded-xl border border-amber-500/30 text-center transition-all flex items-center justify-center space-x-1.5'
              >
                <span>🗺️ Buka di Google Maps ↗</span>
              </a>

              <button
                onClick={() => setSelectedLogDetail(null)}
                className='px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
