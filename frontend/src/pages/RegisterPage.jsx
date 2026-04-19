import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { MdRocketLaunch, MdPerson, MdEmail, MdLock, MdPhone, MdArrowForward } from 'react-icons/md'

const schema = Yup.object({
  name:     Yup.string().min(2).required('Required'),
  email:    Yup.string().email('Invalid email').required('Required'),
  phone:    Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid Indian phone').required('Required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Required'),
  confirm:  Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
})

const FIELDS = [
  { name:'name',     label:'Full Name',        icon:MdPerson, type:'text',     ph:'Arjun Kumar' },
  { name:'email',    label:'Email Address',    icon:MdEmail,  type:'email',    ph:'you@example.com' },
  { name:'phone',    label:'Phone Number',     icon:MdPhone,  type:'tel',      ph:'9876543210' },
  { name:'password', label:'Password',         icon:MdLock,   type:'password', ph:'Min 6 characters' },
  { name:'confirm',  label:'Confirm Password', icon:MdLock,   type:'password', ph:'Re-enter password' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: { name:'', email:'', phone:'', password:'', confirm:'' },
    validationSchema: schema,
    onSubmit: async (vals, { setSubmitting }) => {
      try {
        const { confirm, ...data } = vals
        await register(data)
        toast.success('Account created! Welcome to SwiftParcel.')
        navigate('/dashboard')
      } catch (e) {
        toast.error(e.response?.data?.message || 'Registration failed')
      } finally { setSubmitting(false) }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 bg-grid p-6">
      {/* Ambient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-p-500/5 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-p-500 flex items-center justify-center shadow-glow">
            <MdRocketLaunch className="text-dark-900 text-xl" />
          </div>
          <span className="font-display text-xl font-bold text-white">SwiftParcel</span>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-xl font-bold text-white mb-1">Create account</h2>
          <p className="text-xs text-slate-600 mb-6">Join SwiftParcel and start tracking</p>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {FIELDS.map(({ name, label, icon:Icon, type, ph }) => (
              <div key={name}>
                <label className="field-label">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
                  <input type={type} placeholder={ph}
                    className={`field pl-10 ${formik.touched[name] && formik.errors[name] ? 'field-error' : ''}`}
                    {...formik.getFieldProps(name)} />
                </div>
                {formik.touched[name] && formik.errors[name] && (
                  <p className="mt-1 text-xs text-red-400">{formik.errors[name]}</p>
                )}
              </div>
            ))}

            <button type="submit" disabled={formik.isSubmitting}
              className="btn-primary w-full h-11 text-sm mt-2">
              {formik.isSubmitting
                ? <div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
                : <><span>Create account</span><MdArrowForward /></>}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-p-400 font-semibold hover:text-p-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
