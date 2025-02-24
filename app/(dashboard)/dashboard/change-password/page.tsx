import { getUserById } from '@/actions/users'
import BrandForm from '@/components/Forms/BrandForm'
import ChangePasswordForm from '@/components/Forms/ChangePasswordForm';
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function Brand() {
  const user = await getAuthUser();
  const userDetails = await getUserById(user?.id??"");
  return (
    <div>
      <ChangePasswordForm initialData = {userDetails} editingId={user?.id}  />
    </div>
  )
}
