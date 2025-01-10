import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInvoices } from '@/lib/db/queries';
import { InvoiceList } from './invoice-list';

export default async function InvoicePage() {
  const invoices = await getInvoices();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Invoices
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceList invoices={invoices} />
        </CardContent>
      </Card>
    </section>
  );
}