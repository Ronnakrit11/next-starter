'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { InvoiceForm } from './invoice-form';
import { Invoice } from '@/lib/db/schema';

type InvoiceDialogProps = {
  mode?: 'edit';
  invoice?: Invoice;
  trigger?: React.ReactNode;
};

export function InvoiceDialog({ mode, invoice, trigger }: InvoiceDialogProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button
      onClick={() => setOpen(true)}
      variant="ghost"
      size="icon"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {mode === 'edit' ? 'Edit Invoice' : 'View Invoice'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Update the invoice details below.' : 'View invoice details below.'}
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm 
            mode={mode}
            invoice={invoice}
            onSuccess={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}