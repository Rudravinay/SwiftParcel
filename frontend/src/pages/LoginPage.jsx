import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { MdRocketLaunch, MdEmail, MdLock, MdArrowForward, MdLocalShipping, MdVerified, MdSpeed } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi2'

const schema = Yup.object({
  email:    Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6).required('Required'),
})

const FEATURES = [
  { icon: MdLocalShipping, title: 'Real-time tracking',   desc: 'Live updates at every delivery stage' },
  { icon: MdVerified,      title: 'Unique tracking IDs',  desc: 'Auto-generated for every parcel' },
  { icon: MdSpeed,         title: 'Instant booking',      desc: 'Book parcels in under 60 seconds' },
]

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [role, setRole] = useState('user')

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (vals, { setSubmitting }) => {
      try {
        const user = await login(vals.email, vals.password)
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
        navigate(user.role === 'admin' ? '/admin/parcels' : '/dashboard')
      } catch (e) {
        toast.error(e.response?.data?.message || 'Invalid credentials')
      } finally { setSubmitting(false) }
    },
  })

  const quickFill = r => {
    setRole(r)
    formik.setValues({
      email:    r === 'admin' ? 'admin@swiftparcel.com' : 'user@swiftparcel.com',
      password: 'password123',
    })
  }

  return (
    <div className="min-h-screen flex bg-dark-900">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 relative overflow-hidden bg-dark-800 border-r border-white/[0.05]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-p-500/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-p-500/8 blur-3xl translate-x-1/2 translate-y-1/2" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-p-500 flex items-center justify-center shadow-glow">
              <MdRocketLaunch className="text-dark-900 text-xl" />
            </div>
            <span className="font-display text-xl font-bold text-white">SwiftParcel</span>
          </div>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-p-500/10 border border-p-500/20 mb-5">
              <HiSparkles className="text-p-400 text-xs" />
              <span className="text-xs font-semibold text-p-400">Courier & Parcel Tracking System</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-white leading-tight mb-3">
              Track every parcel,<br />
              <span className="text-p-400">every mile.</span>
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Enterprise-grade logistics management with real-time tracking and intelligent analytics.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4 rounded-xl bg-dark-600 border border-white/[0.05]">
                <div className="w-9 h-9 rounded-xl bg-p-500/15 flex items-center justify-center shrink-0">
                  <Icon className="text-p-400 text-base" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[['12K+','Parcels Delivered'],['99.2%','On-Time Rate'],['500+','Daily Bookings']].map(([v,l]) => (
            <div key={l} className="rounded-xl bg-dark-600 border border-white/[0.05] p-4">
              <p className="font-display text-xl font-bold text-p-400">{v}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-p-500 flex items-center justify-center shadow-glow">
              <MdRocketLaunch className="text-dark-900 text-lg" />
            </div>
            <span className="font-display text-lg font-bold text-white">SwiftParcel</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-sm text-slate-600 mb-8">Access your dashboard</p>

          {/* Role tabs */}
          <div className="flex gap-1.5 p-1 bg-dark-600 rounded-xl border border-white/[0.06] mb-6">
            {['user','admin'].map(r => (
              <button key={r} type="button" onClick={() => quickFill(r)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                  role === r
                    ? 'bg-p-500 text-dark-900 shadow-glow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}>
                {r === 'admin' ? '⚙ Admin' : '👤 User'}
              </button>
            ))}
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
                <input type="email" placeholder="you@example.com"
                  className={`field pl-10 ${formik.touched.email && formik.errors.email ? 'field-error' : ''}`}
                  {...formik.getFieldProps('email')} />
              </div>
              {formik.touched.email && formik.errors.email && <p className="mt-1 text-xs text-red-400">{formik.errors.email}</p>}
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
                <input type="password" placeholder="••••••••"
                  className={`field pl-10 ${formik.touched.password && formik.errors.password ? 'field-error' : ''}`}
                  {...formik.getFieldProps('password')} />
              </div>
              {formik.touched.password && formik.errors.password && <p className="mt-1 text-xs text-red-400">{formik.errors.password}</p>}
            </div>

            <button type="submit" disabled={formik.isSubmitting}
              className="btn-primary w-full h-11 text-sm gap-2">
              {formik.isSubmitting
                ? <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                : <><span>Sign in</span><MdArrowForward className="text-base" /></>}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            No account?{' '}
            <Link to="/register" className="text-p-400 font-semibold hover:text-p-300 transition-colors">Create one</Link>
          </p>

          <p className="text-center text-[10px] text-slate-700 mt-8 font-mono">
            Demo: user@swiftparcel.com / password123
          </p>
        </div>
      </div>
    </div>
  )
}
