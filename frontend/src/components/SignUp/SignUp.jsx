import { useState } from 'react'

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [registered, setRegistered] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setRegistered(true)
    setFormData({ name: '', email: '', password: '' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Create your account</h1>
        <p className="text-gray-600">Join SellBook to save your cart and track orders.</p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        {registered && (
          <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
            Welcome aboard! Your account has been created.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Full name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          ))}
          <button type="submit" className="w-full rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-800">
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
