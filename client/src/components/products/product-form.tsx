import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, insertProductSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image: string;
  inventory: number;
  categoryId: number;
};

type ProductFormProps = {
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: Product;
  isSubmitting: boolean;
};

export function ProductForm({ onSubmit, initialData, isSubmitting }: ProductFormProps) {
  const { toast } = useToast();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      image: initialData?.image ?? "",
      inventory: initialData?.inventory ?? 0,
      categoryId: initialData?.categoryId ?? 1, // Default to the General category
    },
  });

  const handleSubmit = async (data: ProductFormData) => {
    try {
      // Ensure price and inventory are numbers
      const processedData = {
        ...data,
        price: Number(data.price),
        inventory: Number(data.inventory),
        categoryId: 1, // Hardcode to the General category for now
      };

      await onSubmit(processedData);
      toast({
        title: `Product ${initialData ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) => onChange(Number(e.target.value))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventory"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    onChange={(e) => onChange(Number(e.target.value))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}