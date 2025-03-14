import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Router } from "lucide-react";
import { PaymentProps } from "@/types/types";
import { createPayment } from "@/actions/payments";
import toast from "react-hot-toast";
import { generateInvoiceNumber } from "@/lib/generateInvoiceNumber";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import FormFooter from "./FormFooter";
import SubmitButton from "../FormInputs/SubmitButton";
import TextArea from "../FormInputs/TextAreaInput";
import { getNormalDate } from "@/lib/getNormalDate";
import { convertIsoToDateString } from "@/lib/covertISODateToNorma";
import { convertDateToIso } from "@/lib/covertDataToIso";

export default function PaymentForm({ projectId, userId, clientId, remainingAmount }: {
  projectId: string, userId: string, clientId: string, remainingAmount : number
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentProps>({
    defaultValues: {
      date: convertIsoToDateString(new Date().toISOString()),
    },
  });


  const [loading, setLoading] = useState(false);
  async function saveCategory(data: PaymentProps) {
    data.invoiceNumber = generateInvoiceNumber()
    data.userId = userId
    data.clientId = clientId
    data.projectId = projectId
    const subtotal = Number(data.amount);
    data.tax = Number(data.tax)
    data.amount = subtotal + data.tax;
    data.date = convertDateToIso(data.date)
    try {
      setLoading(true);
      console.log(data)
      await createPayment(data);
      setLoading(false);
      // Toast
      console.log(data)
      toast.success("Successfully Created!");
      //reset
      reset();
      //route
    } catch (error) {
      console.log(data)
      setLoading(false);
      console.log(error);
      toast.error("Error!");
    }
  }
  return (
    <div>
      <div className="py-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-[#00B1F3] hover:bg-[#56cdf8] text-white" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form className="" onSubmit={handleSubmit(saveCategory)}>


              <div className="gap-6 py-8">
                <div className="space-y-3">
                  <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                    <DialogDescription>The Project Remaining Amount is {" "}<span>${remainingAmount.toLocaleString()}</span></DialogDescription>
                    
                  </DialogHeader>
                  <Card>
                    <CardContent>
                      <div className="grid gap-6 mt-4">
                        <div className="grid gap-3">
                          <TextInput
                            register={register}
                            errors={errors}
                            label="Payment Title"
                            name="title"
                          />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                          <TextInput
                            register={register}
                            errors={errors}
                            label="Paid Amount"
                            name="amount"
                            type="number"
                          />
                          <TextInput
                            register={register}
                            errors={errors}
                            label="Payment Date"
                            type="date"
                            name="date"
                          />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
                          <TextInput
                            register={register}
                            errors={errors}
                            label="Tax"
                            name="tax"
                            type="number"
                          />
                          <TextInput
                            register={register}
                            errors={errors}
                            label="Payment Method"
                            name="method"
                          />
                        </div>
                        
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="py-3">
              <SubmitButton
                title="Create Payment"
                loading={loading}
              />
              </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
