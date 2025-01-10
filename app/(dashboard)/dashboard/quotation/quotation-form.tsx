'use client';

import { useState, useActionState, startTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createQuotation, updateQuotation, type ActionState } from './actions';
import { Quotation } from '@/lib/db/schema';

type QuotationItem = {
  description: string;
  quantity: number;
  price: number;
};

type QuotationFormProps = {
  mode?: 'create' | 'edit';
  quotation?: Quotation;
  onSuccess?: () => void;
};

export function QuotationForm({ mode = 'create', quotation, onSuccess }: QuotationFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<QuotationItem[]>(
    quotation 
      ? (quotation.items as QuotationItem[])
      : [{ description: '', quantity: 1, price: 0 }]
  );
  const [state, formAction, isPending] = useActionState<{ error?: string; success?: string }, FormData>(
    mode === 'create' ? createQuotation : updateQuotation, 
    {
    error: '',
    success: '',
  });
  
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget);
      formData.append('items', JSON.stringify(items));
      formData.append('total', calculateTotal().toString());
      if (mode === 'edit' && quotation) {
        formData.append('id', quotation.id);
      }
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.success) {
      router.refresh();
      toast.success(state.success);
      onSuccess?.();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, router, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700">Customer Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              required
              defaultValue={quotation?.customerName}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <Label htmlFor="customer_email">Customer Email</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              required
              defaultValue={quotation?.customerEmail}
              placeholder="Enter customer email"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700">Items</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  required
                  placeholder="Item description"
                />
              </div>
              <div className="w-24">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="w-32">
                <Label>Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                  required
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                className="mt-6"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>

          <div className="flex justify-end pt-4">
            <p className="text-lg font-semibold">
              Total: ${calculateTotal().toFixed(2)}
            </p>
          </div>

          {state.error && (
            <p className="text-red-500 text-sm mt-4">{state.error}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            mode === 'create' ? 'Create Quotation' : 'Update Quotation'
          )}
        </Button>
      </div>
    </form>
  );
}