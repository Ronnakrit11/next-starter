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

export function ReceiptList({ receipts }: { receipts: Invoice[] }) {
  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <p className="text-sm text-gray-500 max-w-sm">
          No receipts available yet. Mark an invoice as paid to create a receipt.
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
          <TableHead>Paid Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell>
              <div>
                <p className="font-medium">{receipt.customerName}</p>
                <p className="text-sm text-gray-500">{receipt.customerEmail}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="success">
                {receipt.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              ${Number(receipt.total).toFixed(2)}
            </TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(receipt.updatedAt), {
                addSuffix: true,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}