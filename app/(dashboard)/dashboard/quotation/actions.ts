'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { quotations, invoices, type NewQuotation, type NewInvoice } from '@/lib/db/schema';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { getUserWithTeam } from '@/lib/db/queries';

export interface ActionState {
  error?: string;
  success?: string;
}

const createQuotationSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Invalid email address'),
  items: z.string(), // JSON string of items
  total: z.string(), // Will be converted to number
}).strict();

const updateQuotationSchema = createQuotationSchema.extend({
  id: z.string().uuid()
});

export const createQuotation = validatedActionWithUser(
  createQuotationSchema,
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const items = JSON.parse(data.items);
    const total = parseFloat(data.total);

    // Convert the total to a string to match the numeric type in Postgres
    const newQuotation: NewQuotation = {
      teamId: userWithTeam.teamId,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      items,
      total: total.toString(),
      status: 'draft',
    };

    await db.insert(quotations).values(newQuotation);

    return { success: 'Quotation created successfully' };
  }
);

export const updateQuotation = validatedActionWithUser(
  updateQuotationSchema,
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const items = JSON.parse(data.items);
    const total = parseFloat(data.total);

    await db
      .update(quotations)
      .set({
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        items,
        total: total.toString(),
        updatedAt: new Date(),
      })
      .where(eq(quotations.id, data.id));

    return { success: 'Quotation updated successfully' };
  }
);

export const deleteQuotation = validatedActionWithUser(
  z.object({ id: z.string() }),
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    await db
      .delete(quotations)
      .where(eq(quotations.id, data.id));

    return { success: 'Quotation deleted successfully' };
  }
);

export const approveQuotation = validatedActionWithUser(
  z.object({ id: z.string() }),
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    // Get the quotation details
    const [quotation] = await db
      .select()
      .from(quotations)
      .where(eq(quotations.id, data.id))
      .limit(1);

    if (!quotation) {
      return { error: 'Quotation not found' };
    }

    // Create an invoice from the quotation
    const newInvoice: NewInvoice = {
      teamId: userWithTeam.teamId,
      quotationId: quotation.id,
      customerName: quotation.customerName,
      customerEmail: quotation.customerEmail,
      items: quotation.items,
      total: quotation.total,
      status: 'pending',
    };

    // Update quotation status and create invoice in a transaction
    await db.transaction(async (tx) => {
      await tx
        .update(quotations)
        .set({
          status: 'approved',
          updatedAt: new Date(),
        })
        .where(eq(quotations.id, data.id));

      await tx.insert(invoices).values(newInvoice);
    });

    return { success: 'Quotation approved and invoice created successfully' };
  }
);