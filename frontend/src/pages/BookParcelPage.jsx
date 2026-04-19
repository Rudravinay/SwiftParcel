import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { parcelAPI } from '../services/api'
import { MdPerson, MdPhone, MdEmail, MdLocationOn, MdInventory, MdScale, MdCheckCircle, MdContentCopy, MdLocalShipping, MdArrowForward } from 'react-icons/md'

const schema = Yup.object({
  senderName:'', senderPhone:'', senderEmail:'', senderAddress:'', senderCity:'',
  receiverName:'', receiverPhone:'', receiverAddress:'', receiverCity:'',
  parcelType:'', weight:'', contents:'',
}).shape({
  senderName:      Yup.string().required('Required'),
  senderPhone:     Yup.string().required('Required'),
  senderEmail:     Yup.string().email('Invalid email').required('Required'),
  senderAddress:   Yup.string().required('Required'),
  senderCity:      Yup.string().required('Required'),
  receiverName:    Yup.string().required('Required'),
  receiverPhone:   Yup.string().required('Required'),
  receiverAddress: Yup.string().required('Required'),
  receiverCity:    Yup.string().required('Required'),
  parcelType:      Yup.string().required('Required'),
  weight:          Yup.number().positive('Must be > 0').required('Required'),
  contents:        Yup.string().required('Required'),
})

const TYPES = ['Electronics','Clothing','Documents','Books','Fragile Items','Medicine','Food & Perishables','Other']

function Input({ formik, name, label, icon: Icon, type='text', ph='' }) {
  const err = formik.touched[name] && formik.errors[name]
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-[15px] pointer-events-none" />
        <input type={type} placeholder={ph}
          className={`field pl-10 ${err ? 'field-error' : ''}`}
          {...formik.getFieldProps(name)} />
      </div>
      {err && <p className="mt-1 text-[11px] text-red-400">{formik.errors[name]}</p>}
    </div>
  )
}

function Select({ formik, name, label, icon: Icon, options }) {
  const err = formik.touched[name] && formik.errors[name]
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-[15px] pointer-events-none z-10" />
        <select className={`field pl-10 ${err ? 'field-error' : ''}`} {...formik.getFieldProps(name)}>
          <option value="">Select…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {err && <p className="mt-1 text-[11px] text-red-400">{formik.errors[name]}</p>}
    </div>
  )
}

export default function BookParcelPage() {
  const navigate  = useNavigate()
  const [booked, setBooked] = useState(null)
  const [copied, setCopied] = useState(false)

  const formik = useFormik({
    initialValues: {
      senderName:'', senderPhone:'', senderEmail:'', senderAddress:'', senderCity:'',
      receiverName:'', receiverPhone:'', receiverAddress:'', receiverCity:'',
      parcelType:'', weight:'', contents:'', specialInstructions:'',
    },
    validationSchema: schema,
    onSubmit: async (vals, { setSubmitting, resetForm }) => {
      try {
        const { data } = await parcelAPI.create(vals)
        setBooked(data.parcel || { trackingId:`SP-${Date.now()}`, ...vals })
        resetForm()
        toast.success('Parcel booked successfully!')
      } catch (e) {
        // Demo mode
        setBooked({ trackingId:`SP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*900+100)}`, ...vals })
        toast.success('Parcel booked! (demo mode)')
      } finally { setSubmitting(false) }
    },
  })

  const copy = () => {
    navigator.clipboard?.writeText(booked.trackingId)
    setCopied(true); setTimeout(()=>setCopied(false), 2000)
    toast.success('Tracking ID copied!')
  }

  if (booked) return (
    <div className="max-w-md mx-auto pt-8 page-in">
      <div className="card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-p-500/15 border border-p-500/25 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
          <MdCheckCircle className="text-p-400 text-3xl" />
        </div>
        <h2 className="font-display text-xl font-bold text-white mb-2">Parcel Booked!</h2>
        <p className="text-xs text-slate-600 mb-7">Your tracking ID has been generated. Share it with the receiver to track the shipment.</p>

        <div className="bg-dark-500 border border-p-500/20 rounded-2xl p-5 mb-6">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2 font-mono">Tracking ID</p>
          <p className="font-mono text-2xl font-bold text-p-400 tracking-widest mb-3">{booked.trackingId}</p>
          <button onClick={copy}
            className={`flex items-center gap-2 mx-auto text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
              copied ? 'bg-p-500/20 border-p-500/40 text-p-400' : 'border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
            }`}>
            <MdContentCopy className="text-sm" />
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left mb-6">
          {[
            { label:'Sender', name:booked.senderName, city:booked.senderCity },
            { label:'Receiver', name:booked.receiverName, city:booked.receiverCity },
          ].map(r => (
            <div key={r.label} className="bg-dark-500 rounded-xl p-3 border border-white/[0.05]">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">{r.label}</p>
              <p className="text-sm font-semibold text-slate-200">{r.name}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{r.city}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setBooked(null)} className="btn-ghost flex-1 text-xs h-10">Book Another</button>
          <button onClick={() => navigate('/track')} className="btn-primary flex-1 text-xs h-10">
            <MdLocalShipping className="text-sm" /> Track It
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto space-y-4 page-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sender */}
        <div className="card">
          <div className="card-head">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center"><MdPerson className="text-blue-400 text-base" /></div>
              <div><p className="card-title">Sender Details</p><p className="text-[10px] text-slate-600 mt-0.5">Customer entity (ER)</p></div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <Input formik={formik} name="senderName"    label="Full Name"    icon={MdPerson}    ph="Ravi Shankar" />
            <Input formik={formik} name="senderPhone"   label="Phone"        icon={MdPhone}     ph="9876543210" />
            <Input formik={formik} name="senderEmail"   label="Email"        icon={MdEmail}     type="email" ph="ravi@email.com" />
            <Input formik={formik} name="senderAddress" label="Address"      icon={MdLocationOn} ph="12, MG Road, Kurnool" />
            <Input formik={formik} name="senderCity"    label="City"         icon={MdLocationOn} ph="Kurnool" />
          </div>
        </div>

        {/* Receiver */}
        <div className="card">
          <div className="card-head">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center"><MdLocationOn className="text-violet-400 text-base" /></div>
              <div><p className="card-title">Receiver Details</p><p className="text-[10px] text-slate-600 mt-0.5">Parcel destination (ER)</p></div>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <Input formik={formik} name="receiverName"    label="Receiver Name"       icon={MdPerson}    ph="Meena Devi" />
            <Input formik={formik} name="receiverPhone"   label="Phone"               icon={MdPhone}     ph="9123456789" />
            <Input formik={formik} name="receiverAddress" label="Destination Address" icon={MdLocationOn} ph="45, Anna Nagar, Chennai" />
            <Input formik={formik} name="receiverCity"    label="Destination City"    icon={MdLocationOn} ph="Chennai" />
          </div>
        </div>
      </div>

      {/* Parcel details */}
      <div className="card">
        <div className="card-head">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center"><MdInventory className="text-amber-400 text-base" /></div>
            <div><p className="card-title">Parcel Details</p><p className="text-[10px] text-slate-600 mt-0.5">Parcel entity (ER) — tracking ID auto-generated</p></div>
          </div>
          <div className="flex items-center gap-2 bg-dark-500 border border-white/[0.05] rounded-xl px-4 py-2">
            <span className="text-[10px] text-slate-600 font-mono">Tracking ID:</span>
            <span className="text-[11px] font-mono font-bold text-p-400">Auto-generated on submit</span>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select formik={formik} name="parcelType" label="Parcel Type" icon={MdInventory} options={TYPES} />
          <Input  formik={formik} name="weight"     label="Weight (kg)" icon={MdScale}     type="number" ph="2.5" />
          <Input  formik={formik} name="contents"   label="Contents"    icon={MdInventory} ph="Electronics, Books…" />
          <div className="md:col-span-3">
            <label className="field-label">Special Instructions (optional)</label>
            <input className="field" placeholder="Handle with care, Fragile, Keep dry…"
              {...formik.getFieldProps('specialInstructions')} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => formik.resetForm()} className="btn-ghost text-sm h-11">Clear</button>
        <button type="submit" disabled={formik.isSubmitting} className="btn-primary text-sm h-11 px-8">
          {formik.isSubmitting
            ? <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
            : <><span>Confirm Booking</span><MdArrowForward /></>}
        </button>
      </div>
    </form>
  )
}
