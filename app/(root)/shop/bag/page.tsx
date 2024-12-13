import BagItemList from "@/components/shop/bag/bag-item-list";
import OrderSummary from "@/components/shop/bag/order-summary";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getBagItems(userId: string) {
  const userFromDB = await prisma.user.findFirst({
    where: { 
      clerk_user_id: userId
    }
  })

  const bagItems = await prisma.bag.findMany({
    where: { user_id: userFromDB?.id },
    include: {
      product: {
        include: {
          category: true
        }
      },
      variant_color: true,
      variant_size: true,
    },
  })
  return bagItems
}

export default async function Bag() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const bagItems = await getBagItems(userId)

  return (
    <section className="container cpy">
      <h1 className="mb-6">Your Bag</h1>

      <div className="flex gap-12">
        <BagItemList bagItems={bagItems} />
        <OrderSummary />
      </div>
    </section>
  );
}
