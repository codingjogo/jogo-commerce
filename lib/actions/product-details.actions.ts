'use server';

import { z } from 'zod';
import prisma from '../db';

const decrementQuantitySchema = z.object({
  bagItemId: z.string().uuid(),
});

export const decrementQuantity = async (bagItemId: string) => {
  try {
    const validatedData = decrementQuantitySchema.parse({ bagItemId });

    const bagItem = await prisma.bag.update({
      where: { id: validatedData.bagItemId },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });

    if (bagItem.quantity <= 0) {
      await prisma.bag.delete({
        where: { id: validatedData.bagItemId },
      });
    }

    return { success: true, data: bagItem };
  } catch (error) {
    console.error('Error decrementing quantity:', error);
    throw new Error('Failed to decrement bag item quantity.');
  }
};

export const incrementQuantity = async (bagItemId: string) => {
  try {
    const validatedData = decrementQuantitySchema.parse({ bagItemId });

    const bagItem = await prisma.bag.update({
      where: { id: validatedData.bagItemId },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });

    return { success: true, data: bagItem };
  } catch (error) {
    console.error('Error incrementing quantity:', error);
    throw new Error('Failed to increment bag item quantity.');
  }
};
