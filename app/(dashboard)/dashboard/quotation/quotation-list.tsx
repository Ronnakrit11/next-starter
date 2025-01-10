'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { QuotationDialog } from './quotation-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, CheckCircle } from 'lucide-react';
import { deleteQuotation, approveQuotation } from './actions';
import { Quotation } from '@/lib/db/schema';
import { useEffect } from 'react';

type DeleteQuotationState = {
  error?: string;
  success?: string;
};

type ApproveQuotationState = {
  error?: string;
  success?: string;
};

export function QuotationList({ quotations }: { quotations: Quotation[] }) {
  const [state, formAction] = useActionState<DeleteQuotationState, FormData>(deleteQuotation, {
    error: '',
    success: '',
  });

  const [approveState, approveAction] = useActionState<ApproveQuotationState, FormData>(approveQuotation, {
    error: '',
    success: '',
  });
  
  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (approveState.success) {
      toast.success(approveState.success);
    } else if (approveState.error) {
      toast.error(approveState.error);
    }
  }, [approveState]);

  if (quotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <p className="text-sm text-gray-500 max-w-sm">
          No quotations available yet. Create your first quotation to get started.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotations.map((quotation) => (
          <TableRow key={quotation.id}>
            <TableCell>
              <div>
                <p className="font-medium">{quotation.customerName}</p>
                <p className="text-sm text-gray-500">{quotation.customerEmail}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={quotation.status === 'draft' ? 'secondary' : 'success'}
              >
                {quotation.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              ${Number(quotation.total).toFixed(2)}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(quotation.createdAt), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {quotation.status === 'draft' && (
                  <form action={async (formData: FormData) => {
                    formData.append('id', quotation.id);
                    approveAction(formData);
                  }}>
                    <Button variant="ghost" size="icon" type="submit" className="text-green-500">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                <QuotationDialog 
                  mode="edit" 
                  quotation={quotation}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <form action={async (formData: FormData) => {
                  formData.append('id', quotation.id);
                  formAction(formData);
                }}>
                  <Button variant="ghost" size="icon" type="submit">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </form>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}