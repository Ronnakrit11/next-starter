import { QuotationForm } from '../quotation-form';

export default function NewQuotationPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        New Quotation
      </h1>
      <QuotationForm />
    </section>
  );
}