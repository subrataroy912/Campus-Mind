import { useState } from 'react'
import Button from '../../../components/common/Button.jsx'
import Input from '../../../components/common/Input.jsx'

export default function EditProfileForm({ profile, onCancel, onSave }) {
  const [form, setForm] = useState(profile)
  const update = (event) => setForm((values) => ({ ...values, [event.target.name]: event.target.value }))
  const submit = (event) => { event.preventDefault(); onSave(form) }

  return <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-text-heading">Edit your learning profile</h2><p className="mt-1 text-sm text-text-muted">Share the details classmates and teachers need to connect with you.</p></div></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <Field label="Name"><Input name="name" value={form.name} onChange={update} required /></Field>
      <Field label="Role"><Input value={form.role === 'teacher' ? 'Teacher' : 'Student'} disabled /></Field>
      <Field label="Learning focus"><Input name="headline" value={form.headline} onChange={update} required /></Field>
      <Field label={form.role === 'teacher' ? 'Teaching area' : 'Program or year'}><Input name="program" value={form.program} onChange={update} required /></Field>
    </div>
    <label className="mt-4 block text-sm font-semibold text-text-main" htmlFor="profile-bio">About</label>
    <textarea id="profile-bio" name="bio" value={form.bio} onChange={update} rows="4" className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-focus focus:ring-4 focus:ring-focus/15" required />
    <div className="mt-5 flex flex-wrap justify-end gap-3"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit">Save changes</Button></div>
  </form>
}

function Field({ label, children }) {
  return <label className="block text-sm font-semibold text-text-main"><span className="mb-2 block">{label}</span>{children}</label>
}
