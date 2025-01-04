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
import { Quotation } from '@/lib/db/schema';

export function QuotationList({ quotations }: { quotations: Quotation[] }) {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}