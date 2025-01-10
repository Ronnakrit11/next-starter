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
import { QuotationForm } from './quotation-form';
import { Quotation } from '@/lib/db/schema';

type QuotationDialogProps = {
  mode?: 'create' | 'edit';
  quotation?: Quotation;
  trigger?: React.ReactNode;
};

export function QuotationDialog({ mode = 'create', quotation, trigger }: QuotationDialogProps) {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button
      onClick={() => setOpen(true)}
      className="bg-orange-500 hover:bg-orange-600 text-white"
    >
      <Plus className="mr-2 h-4 w-4" />
      New Quotation
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
              {mode === 'create' ? 'Create New Quotation' : 'Edit Quotation'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {mode === 'create' ? 'create a new' : 'update the'} quotation.
            </DialogDescription>
          </DialogHeader>
          <QuotationForm 
            mode={mode}
            quotation={quotation}
            onSuccess={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}