import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getReceipts } from '@/lib/db/queries';
import { ReceiptList } from './receipt-list';

export default async function ReceiptPage() {
  const receipts = await getReceipts();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Receipts
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Receipt History</CardTitle>
        </CardHeader>
        <CardContent>
          <ReceiptList receipts={receipts} />
        </CardContent>
      </Card>
    </section>
  );
}