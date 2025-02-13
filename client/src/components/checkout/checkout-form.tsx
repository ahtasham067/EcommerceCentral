import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "@shared/schema";
import { insertAddressSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const checkoutSchema = z.object({
  shippingAddressId: z.number(),
  paymentMethod: z.enum(["cod", "card"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type CheckoutFormProps = {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting: boolean;
};

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const { data: addresses } = useQuery<Address[]>({
    queryKey: ["/api/addresses"],
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const addressForm = useForm({
    resolver: zodResolver(insertAddressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  });

  const handleNewAddress = async (data: z.infer<typeof insertAddressSchema>) => {
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create address");

      const newAddress: Address = await response.json();
      setIsNewAddressDialogOpen(false);
      addressForm.reset();

      // Manually update the form with the new address
      form.setValue("shippingAddressId", newAddress.id);
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="shippingAddressId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Address</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses?.map((address) => (
                          <SelectItem key={address.id} value={address.id.toString()}>
                            {address.street}, {address.city}, {address.state}{" "}
                            {address.postalCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsNewAddressDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Address
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Place Order
          </Button>
        </form>
      </Form>

      <Dialog open={isNewAddressDialogOpen} onOpenChange={setIsNewAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <Form {...addressForm}>
            <form onSubmit={addressForm.handleSubmit(handleNewAddress)} className="space-y-4">
              <FormField
                control={addressForm.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addressForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={addressForm.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Set as default address</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Add Address</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
