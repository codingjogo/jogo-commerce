import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const {searchParams} = new URL(req.url)
  const clerk_user_id = searchParams.get('clerk_user_id');
  const bag_id = searchParams.get('bag_id');
  const quantity = Number(searchParams.get('quantity'));
  const method = searchParams.get('method');

    if (!quantity) {
      return new NextResponse("QUANTITY_NOT_FOUND_SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", {
        status: 400,
      });
    }

    if (!bag_id) {
      return new NextResponse("BAG_ID_NOT_FOUND_SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", {
        status: 400,
      });
    }

    if (!clerk_user_id) {
      console.log('clerk_user_id', clerk_user_id)
      return new NextResponse("CLERK_ID_NOT_FOUND_SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", {
        status: 400,
      });
    }

    const userFromDB = await prisma.user.findFirst({
      where: {
        clerk_user_id: clerk_user_id,
      },
    });
  
    if (!userFromDB) {
      return new NextResponse("USER_NOT_FOUND_IN_DB_SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", {
        status: 400,
      });
    }

    const bagItemFromDB = await prisma.bag.findFirst({
      where: { id: bag_id }
    })

    if (!bagItemFromDB) {
      return new NextResponse("BAG_ITEM_NOT_FOUND_IN_DB_SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", {
        status: 400,
      });
    }
  
  try {
    if (method) {
      const updatedProductQuantity = await prisma.bag.update({
        where: {
          id: bagItemFromDB.id
        },
        data: {
          quantity: {
            [method]: 1
          },
          updated_at: new Date()
        }
      })
  
      return new NextResponse(JSON.stringify({
        message:"Successfully Updated the Bag Item's Quantity",
        updatedProductQuantity,
      }), {
        status: 200,
      });
    } else if (!method) {
      const updatedProductQuantity = await prisma.bag.update({
        where: {
          id: bagItemFromDB.id
        },
        data: {
          quantity,
        }
      })
  
      return new NextResponse(JSON.stringify({
        message:"Successfully Updated the Bag Item's Quantity",
        updatedProductQuantity,
      }), {
        status: 200,
      });
    }
  } catch (error: // eslint-disable-next-line
    any) {
      console.log("SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", error.message);
      return new NextResponse("SHOP_BAG_UPDATE_QUANTITY_PATCH_ERROR", {
        status: 500,
      });
    }
}