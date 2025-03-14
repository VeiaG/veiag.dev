import React from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

const NavigationAdmin = async () => {
  const headers = await getHeaders()
  const payload = await getPayload({ config: config })
  const { user } = await payload.auth({ headers })
  if (!user) {
    return null
  }
  return (
    <Button variant="ghostBlurry" asChild className="z-10" size="icon">
      <Link href="/admin">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={24}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={24}
          />
        </picture>
      </Link>
    </Button>
  )
}

export default NavigationAdmin
