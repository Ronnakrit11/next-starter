'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/lib/db/schema';

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}