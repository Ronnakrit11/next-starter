'use client';

import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { InvoiceDialog } from './invoice-dialog';
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
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import { deleteInvoice, markInvoiceAsPaid } from './actions';
import { Invoice } from '@/lib/db/schema';
import { useEffect } from 'react';

type DeleteInvoiceState = {
  error?: string;
  success?: string;
};

type ApproveInvoiceState = {
  error?: string;
  success?: string;
};

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const [state, formAction] = useActionState<DeleteInvoiceState, FormData>(deleteInvoice, {
    error: '',
    success: '',
  });

  const [paidState, paidAction] = useActionState<ApproveInvoiceState, FormData>(markInvoiceAsPaid, {
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
    if (paidState.success) {
      toast.success(paidState.success);
    } else if (paidState.error) {
      toast.error(paidState.error);
    }
  }, [paidState]);
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <p className="text-sm text-gray-500 max-w-sm">
          No invoices available yet. Approve a quotation to create an invoice.
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
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <div>
                <p className="font-medium">{invoice.customerName}</p>
                <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={invoice.status === 'pending' ? 'secondary' : 'success'}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              ${Number(invoice.total).toFixed(2)}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(invoice.createdAt), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {invoice.status === 'pending' && (
                  <form action={async (formData: FormData) => {
                    formData.append('id', invoice.id);
                    paidAction(formData);
                  }}>
                    <Button variant="ghost" size="icon" type="submit" className="text-green-500">
                      <DollarSign className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                <InvoiceDialog 
                  mode="edit" 
                  invoice={invoice}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  }
                />
                <form action={async (formData: FormData) => {
                  formData.append('id', invoice.id);
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