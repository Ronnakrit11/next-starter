'use server';

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { quotations, type NewQuotation } from '@/lib/db/schema';
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