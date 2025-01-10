'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { invoices } from '@/lib/db/schema';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { getUserWithTeam } from '@/lib/db/queries';

export interface ActionState {
  error?: string;
  success?: string;
}

const updateInvoiceSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Invalid email address'),
  items: z.string(), // JSON string of items
  total: z.string(), // Will be converted to number
}).strict();

export const updateInvoice = validatedActionWithUser(
  updateInvoiceSchema,
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    const items = JSON.parse(data.items);
    const total = parseFloat(data.total);

    await db
      .update(invoices)
      .set({
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        items,
        total: total.toString(),
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, data.id));

    return { success: 'Invoice updated successfully' };
  }
);

export const deleteInvoice = validatedActionWithUser(
  z.object({ id: z.string() }),
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    await db
      .delete(invoices)
      .where(eq(invoices.id, data.id));

    return { success: 'Invoice deleted successfully' };
  }
);

export const markInvoiceAsPaid = validatedActionWithUser(
  z.object({ id: z.string() }),
  async (data, _, user) => {
    const userWithTeam = await getUserWithTeam(user.id);
    
    if (!userWithTeam?.teamId) {
      return { error: 'User is not part of a team' };
    }

    await db
      .update(invoices)
      .set({
        status: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, data.id));

    return { success: 'Invoice marked as paid successfully' };
  }
);