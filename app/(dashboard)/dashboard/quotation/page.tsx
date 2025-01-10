import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuotationDialog } from './quotation-dialog';
import { QuotationList } from './quotation-list';
import { getQuotations } from '@/lib/db/queries';

export default async function QuotationPage() {
  const quotations = await getQuotations();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900">
          Quotations
        </h1>
        <QuotationDialog />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quotation History</CardTitle>
        </CardHeader>
        <CardContent>
          <QuotationList quotations={quotations} />
        </CardContent>
      </Card>
    </section>
  );
}