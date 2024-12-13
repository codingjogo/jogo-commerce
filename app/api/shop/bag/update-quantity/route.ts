import prisma from "@/lib/db";

export const PUT = async (req: Response) => {
  const { bagItemId, quantity } = await req.json();

  if (!bagItemId || !quantity) {
    return new Response(JSON.stringify({
      message: "Invalid Input",
    }), {status: 400})
  }

  try {
    const updatedItem = await prisma.bag.update({
      where: { id: bagItemId },
      data: { quantity },
    });
    return new Response(JSON.stringify(updatedItem), {status: 200})
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      message: "Error Updating Quantity [SHOP_BAG_UPDATE_QUANTITY_PUT]"
    }), {status: 500})
  }
}