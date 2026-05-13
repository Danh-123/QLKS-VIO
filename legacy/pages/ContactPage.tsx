import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ScrollReveal } from '../components/guest/ScrollReveal'
import { Button } from '../components/ui/Button'

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  const handleChange = (key: string, value: string) => setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-vio-cream text-vio-navy min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-vio-navy/60">Liên hệ</p>
          <h1 className="mt-4 font-light text-3xl md:text-4xl">Contact</h1>
          <p className="mt-2 max-w-2xl mx-auto text-sm text-vio-navy/70">For reservations and enquiries, please contact our team below.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <aside className="space-y-6">
            <div className="rounded-2xl bg-white/90 p-6">
              <h2 className="text-sm font-medium tracking-wider text-vio-navy/60">Hotel Details</h2>
              <div className="mt-4 space-y-4 text-sm text-vio-navy">
                <div>
                  <div className="text-xs uppercase text-vio-navy/45">Address</div>
                  <div className="mt-1">Vịnh Hạ Long, Quảng Ninh, Việt Nam</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-vio-navy/45">Phone</div>
                  <div className="mt-1">+84 123 456 789</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-vio-navy/45">Email</div>
                  <div className="mt-1">hello@vio-resort.vn</div>
                </div>
                <div>
                  <div className="text-xs uppercase text-vio-navy/45">Hours</div>
                  <div className="mt-1">24/7</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/90 p-6">
              <h3 className="text-sm font-medium tracking-wider text-vio-navy/60">Where to find us</h3>
              <p className="mt-3 text-sm text-vio-navy/70">Our address sits gently along the coastline, offering private access to the bay.</p>
            </div>
          </aside>

          <section className="space-y-6">
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white/95 p-6 shadow-sm">
              {submitted ? (
                <div className="rounded-lg bg-vio-cream/70 px-4 py-3 text-sm text-vio-navy">Cảm ơn — chúng tôi đã nhận được yêu cầu của bạn.</div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase text-vio-navy/45">Họ và tên</span>
                  <input
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-vio-navy/10"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase text-vio-navy/45">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-vio-navy/10"
                    required
                  />
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase text-vio-navy/45">Số điện thoại</span>
                  <input
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-vio-navy/10"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase text-vio-navy/45">Chủ đề</span>
                  <input
                    value={form.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-vio-navy/10"
                  />
                </label>
              </div>

              <label className="block mt-4">
                <span className="text-xs uppercase text-vio-navy/45">Nội dung</span>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-vio-navy/10"
                  required
                />
              </label>

              <div className="mt-6 flex items-center justify-end">
                <Button type="submit" className="rounded-full bg-[#0f172a] px-7 py-3 text-white hover:bg-[#1a2740]">
                  Gửi
                </Button>
              </div>
            </form>

            <div className="rounded-3xl overflow-hidden bg-white/90">
              <iframe
                title="VIO location"
                className="w-full h-60"
                loading="lazy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1234567890123!2d107.000000!3d20.950000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314xxxxxx%3A0xyyyyyyyyy!2sHạ%20Long!5e0!3m2!1sen!2s!4v0000000000000"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
