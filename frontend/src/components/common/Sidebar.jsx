import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  MdDashboard, MdAddBox, MdGpsFixed, MdHistory,
  MdInventory2, MdEditNote, MdBarChart, MdLogout,
  MdRocketLaunch
} from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi2'

const USER_LINKS = [
  { to:'/dashboard', icon:MdDashboard,  label:'Dashboard' },
  { to:'/book',      icon:MdAddBox,     label:'Book Parcel' },
  { to:'/track',     icon:MdGpsFixed,   label:'Track Parcel' },
  { to:'/history',   icon:MdHistory,    label:'My History' },
]
const ADMIN_LINKS = [
  { to:'/admin/parcels', icon:MdInventory2, label:'Manage Parcels' },
  { to:'/admin/status',  icon:MdEditNote,   label:'Update Status' },
  { to:'/admin/reports', icon:MdBarChart,   label:'Reports' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U'

  return (
    <aside className="w-56 shrink-0 h-screen flex flex-col bg-dark-800 border-r border-white/[0.05]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-p-500 flex items-center justify-center shadow-glow shrink-0">
            <MdRocketLaunch className="text-dark-900 text-base" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-none tracking-tight">SwiftParcel</p>
            <p className="text-[9px] text-slate-600 mt-0.5 font-mono uppercase tracking-widest">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[9px] font-bold text-slate-700 uppercase tracking-widest">Main</p>
        {USER_LINKS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon className="text-[17px] shrink-0" />
            <span className="text-[13px]">{label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <p className="px-3 mt-4 mb-2 text-[9px] font-bold text-slate-700 uppercase tracking-widest">Admin</p>
            {ADMIN_LINKS.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Icon className="text-[17px] shrink-0" />
                <span className="text-[13px]">{label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-white/[0.05] space-y-2">
        {user?.role === 'admin' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-p-500/10 border border-p-500/20">
            <HiSparkles className="text-p-400 text-sm shrink-0" />
            <span className="text-xs font-semibold text-p-400">Admin Access</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-dark-500 border border-white/[0.05]">
          <div className="w-7 h-7 rounded-full bg-p-500/20 border border-p-500/30 flex items-center justify-center text-p-400 text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-slate-200 truncate leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-600 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login') }}
          className="nav-link w-full text-red-500/70 hover:text-red-400 hover:bg-red-500/10">
          <MdLogout className="text-[17px]" />
          <span className="text-[13px]">Logout</span>
        </button>
      </div>
    </aside>
  )
}
