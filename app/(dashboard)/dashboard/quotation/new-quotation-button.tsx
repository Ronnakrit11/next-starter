'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function NewQuotationButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/dashboard/quotation/new')}
      className="bg-orange-500 hover:bg-orange-600 text-white"
    >
      <Plus className="mr-2 h-4 w-4" />
      New Quotation
    </Button>
  );
}