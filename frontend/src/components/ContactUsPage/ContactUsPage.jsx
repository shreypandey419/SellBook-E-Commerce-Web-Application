import { useState } from 'react'

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-600">Send us a message and we&apos;ll get back to you soon.</p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        {success && (
          <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
            Your message has been sent successfully.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Subject', name: 'subject', type: 'text' },
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-800">
            Send message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactUsPage
