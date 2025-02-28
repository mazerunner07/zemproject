import { getUserSubscribers } from '@/actions/subscribe'
import Subscribers from '@/components/dashboard/Subscribers'
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function page() {
    const user = await getAuthUser()
    const subscribers = await getUserSubscribers(user?.id ?? "")||[]
  return (
    <div className='max-w-4xl p-8'>
      <Subscribers subscribers={subscribers} />
    </div>
  )
}
