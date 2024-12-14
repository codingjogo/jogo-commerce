import BagItemList from "@/components/shop/bag/bag-item-list";
import OrderSummary from "@/components/shop/bag/order-summary";
import { Card, CardContent } from "@/components/ui/card";
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
      {bagItems.length === 0 && (
				<>
					<Card className="w-full">
						<CardContent className="flex flex-col gap-2 items-center justify-center p-6">
							<h1>Your Bag is Empty.</h1>
							<p>Please Add Item to Bag.</p>
						</CardContent>
					</Card>
				</>
			)}
        {bagItems.length > 0 && (
          <>
            <BagItemList bagItems={bagItems} clerk_user_id={userId} />
            <OrderSummary />
          </>
        )}
      </div>
    </section>
  );
}
