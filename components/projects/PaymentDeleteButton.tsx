import { Trash2 } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { deletePayment } from '@/actions/payments'
import toast from 'react-hot-toast'

export default function PaymentDeleteButton({paymentId}:{paymentId:string}) {
    async function handleDelete() {
        try {
            const res = await deletePayment(paymentId)
            if (res?.ok) {
                toast.success("Payment Deleted Successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
        <Button onClick={handleDelete} variant="outline" className='ml-2 hover:bg-red-100 hover:text-red-500 text-red-500'>
      <Trash2 className='h-5 w-5 ' />
      </Button>
    </div>
  )
}
