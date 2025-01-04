import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InvoicePage() {
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
          <div className="flex flex-col items-center justify-center text-center py-12">
            <p className="text-sm text-gray-500 max-w-sm">
              No invoices available yet. They will appear here once you make a payment.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}