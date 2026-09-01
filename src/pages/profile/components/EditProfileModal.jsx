import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, User, Mail, AtSign, GraduationCap, Briefcase, Phone, Calendar } from 'lucide-react'
import Button from '../../../components/common/Button'
import clsx from 'clsx'

const EDITABLE_FIELDS = [
  { key: 'name', label: 'Full Name', icon: User, type: 'text', required: true, placeholder: 'John Doe' },
  { key: 'username', label: 'Username', icon: AtSign, type: 'text', placeholder: 'johndoe' },
  { key: 'email', label: 'Email', icon: Mail, type: 'email', required: true, placeholder: 'john@example.com' },
  { key: 'department', label: 'Department', icon: GraduationCap, type: 'text', placeholder: 'Computer Engineering' },
  { key: 'institution', label: 'Institution', icon: Briefcase, type: 'text', placeholder: 'CampusMind University' },
  { key: 'phone', label: 'Phone', icon: Phone, type: 'tel', placeholder: '+1 (555) 000-0000' },
]

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(() => {
    if (!user) return {}
    return {
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      department: user.department || '',
      institution: user.institution || '',
      phone: user.phone || '',
    }
  })
  const [errors, setErrors] = useState({})
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isOpen && user && !isInitialized.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        department: user.department || '',
        institution: user.institution || '',
        phone: user.phone || '',
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarPreview(user.avatar || null)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({})
      isInitialized.current = true

      document.body.style.overflow = 'hidden'
    } else if (!isOpen) {
      isInitialized.current = false
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    EDITABLE_FIELDS.forEach((field) => {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = `${field.label} is required`
      }
      if (field.key === 'email' && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      if (field.key === 'username' && formData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
        newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore)'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = { ...formData }
    if (avatarPreview && avatarPreview !== user?.avatar) {
      payload.avatar = avatarPreview
    }

    try {
      await onSave(payload)
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        <motion.div
          ref={modalRef}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-neutral-200"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 rounded-t-2xl px-6 py-4 flex items-center justify-between">
            <h2 id="modal-title" className="font-serif text-xl font-medium text-neutral-950">
              Edit Profile
            </h2>
            <motion.button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={`${formData.name || 'User'}'s profile`}
                    className="w-24 h-24 rounded-[2rem] object-cover border-2 border-white shadow-lg shadow-black/10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center border-2 border-white shadow-lg shadow-black/10 bg-neutral-200 text-neutral-600 font-serif text-3xl font-medium">
                    {getInitials(formData.name)}
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 border-neutral-200 p-0 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300 cursor-pointer transition-all"
                >
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    ref={fileInputRef}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <Camera className="w-5 h-5" aria-hidden="true" />
                </label>
              </div>
              <p className="font-sans text-xs text-neutral-500">Click to change photo</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EDITABLE_FIELDS.map((field) => (
                <div key={field.key} className={field.key === 'email' ? 'sm:col-span-2' : ''}>
                  <label
                    htmlFor={field.key}
                    className="block font-sans text-sm font-medium text-neutral-700 mb-1.5 flex items-center gap-1.5"
                  >
                    <field.icon className="w-4 h-4 text-neutral-400" aria-hidden="true" />
                    {field.label} {field.required && <span className="text-red-500" aria-hidden="true">*</span>}
                  </label>
                  <input
                    id={field.key}
                    name={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={clsx(
                      'w-full px-4 py-3 rounded-xl border font-sans text-base',
                      'bg-white transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent',
                      errors[field.key]
                        ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-300'
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                    aria-invalid={!!errors[field.key]}
                    aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                  />
                  {errors[field.key] && (
                    <p id={`${field.key}-error`} className="mt-1.5 font-sans text-sm text-red-600" role="alert">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full sm:w-auto min-h-11 px-8"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EditProfileModal