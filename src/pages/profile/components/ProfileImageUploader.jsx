import { useState, useRef } from 'react'

export function ProfileImageUploader({ currentImage, onChange }) {
  const [preview, setPreview] = useState(currentImage)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    }
    if (file.size > maxSize) {
      return 'Image size must be less than 5MB'
    }
    return null
  }

  const handleFileSelect = (file) => {
    const error = validateFile(file)
    if (error) {
      setError(error)
      return false
    }

    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onChange(e.target.result)
    }
    reader.readAsDataURL(file)
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(currentImage)
    onChange(currentImage)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const hasChanges = preview !== currentImage

  return (
    <div className="relative">
      <div
        className={`relative w-24 h-24 rounded-full border-4 border-white bg-gray-200 object-cover shadow-sm overflow-hidden transition-all ${
          isDragging ? 'border-blue-500 ring-2 ring-blue-500/50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <img
          src={preview}
          alt="Profile preview"
          className="w-full h-full object-cover"
        />
        {hasChanges && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
              Updated
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="sr-only"
        id="profile-image-upload"
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={hasChanges}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose Photo
        </button>

        {hasChanges && (
          <>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        JPG, PNG, GIF or WebP. Max 5MB.
      </p>
    </div>
  )
}

export function CoverImageUploader({ currentImage, onChange }) {
  const [preview, setPreview] = useState(currentImage)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    }
    if (file.size > maxSize) {
      return 'Image size must be less than 10MB'
    }
    return null
  }

  const handleFileSelect = (file) => {
    const error = validateFile(file)
    if (error) {
      setError(error)
      return false
    }

    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onChange(e.target.result)
    }
    reader.readAsDataURL(file)
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(currentImage)
    onChange(currentImage)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const hasChanges = preview !== currentImage

  return (
    <div className="relative">
      <div
        className={`relative w-full h-48 rounded-lg bg-gray-200 object-cover overflow-hidden transition-all ${
          isDragging ? 'border-2 border-blue-500' : 'border border-gray-200'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <img
          src={preview}
          alt="Cover preview"
          className="w-full h-full object-cover"
        />
        {hasChanges && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
              Updated
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileInputChange}
        className="sr-only"
        id="cover-image-upload"
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={hasChanges}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose Cover
        </button>

        {hasChanges && (
          <>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>
      )}

      <p className="mt-2 text-xs text-gray-500">
        JPG, PNG, GIF or WebP. Max 10MB. Recommended 1200x400px.
      </p>
    </div>
  )
}