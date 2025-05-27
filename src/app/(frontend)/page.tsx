import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import ContactFormComponent from '@/components/ContactFormComponent'


export default async function HomePage() {
  const headers =  getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`
  

  return (
  <div>
    <h1>Contact Us Assignemnt Form</h1>
    <ContactFormComponent formId='6' />
  </div>
  )
}
