'use client'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React, { useEffect, useRef, useState } from 'react'

const ContactFormComponent = ({ formId }: { formId: string }) => {
  const [form, setForm] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    // Fetch the form configuration
    fetch(`/api/forms/${formId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data)
        console.log('ContactUs Form', data)
      })
      .catch(() => setError('Error loading form'))
  }, [formId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const dataToSend = Array.from(formData.entries()).map(([name, value]) => ({
      field: name,
      value: value.toString(),
    }))

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        body: JSON.stringify({
          form: formId,
          submissionData: dataToSend,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setSuccess(true)
      }
    } catch (err) {
      setSuccess(false)
    }
    formRef.current?.reset()
  }

  if (!form) return <div>Loading...</div>

  if (success && form.confirmationMessage) {
    setTimeout(() => {
      setSuccess(false)
    }, 5000)
    return <RichText data={form.confirmationMessage} />
  }

  return (
    <div className="max-w-xl mx-auto p-6  rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Contact Form</h2>
      <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {form?.fields?.map((field: any) => {
            if (field.name === 'message') return null // We'll handle message separately below
            return (
              <div key={field.id} className="flex flex-col">
                <label htmlFor={field.name} className="text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.blockType}
                  name={field.name}
                  id={field.name}
                  required={field.required}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )
          })}
        </div>

        {/* Message field separately below */}
        {form?.fields?.find((field: any) => field.name === 'message') && (
          <div className="flex flex-col">
            <label htmlFor="message" className="text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              required
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default ContactFormComponent
