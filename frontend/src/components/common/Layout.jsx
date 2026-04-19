import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { MdSearch, MdNotifications } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'

const META = {
  '/dashboard':     { title:'Dashboard',           sub:'Overview & analytics' },
  '/book':          { title:'Book a Parcel',        sub:'Create new shipment' },
  '/track':         { title:'Track Parcel',         sub:'Real-time tracking' },
  '/history':       { title:'Shipment History',     sub:'All your shipments' },
  '/admin/parcels': { title:'Manage Parcels',       sub:'Full CRUD access' },
  '/admin/status':  { title:'Update Status',        sub:'Update delivery stages' },
  '/admin/reports': { title:'Reports & Analytics',  sub:'Insights & performance' },
}

export default function Layout() {
  const { pathname } = useLocation()
  const { user }     = useAuth()
  const meta         = META[pathname] || { title:'SwiftParcel', sub:'' }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 bg-grid">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="shrink-0 h-14 px-6 flex items-center justify-between gap-4 bg-dark-800/80 border-b border-white/[0.05] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-bold text-white leading-none font-display">{meta.title}</h1>
              <p className="text-[10px] text-slate-600 mt-0.5">{meta.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
              <input
                placeholder="Search tracking ID…"
                className="field pl-9 pr-4 py-2 text-xs w-48 !bg-dark-700 !border-white/[0.06] h-8"
              />
            </div>
            <button className="btn-icon relative">
              <MdNotifications className="text-base" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-p-400 border border-dark-800" />
            </button>
            <div className="w-7 h-7 rounded-full bg-p-500/20 border border-p-500/30 flex items-center justify-center text-p-400 text-[10px] font-bold">
              {user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
