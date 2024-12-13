import prisma from "@/lib/db";

export const DELETE = async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const bagItemId = searchParams.get('bagItemId')
	
  if (!bagItemId) {
    return new Response(
      JSON.stringify({
        message:
          "NO_BAG_ITEM_ID_FOUND_ERROR_DELETING_ITEM_[DELETE]",
      }),
      { status: 400 }
    );
  }
	try {
		const deletedItem = await prisma.bag.delete({
			where: { id: bagItemId },
		});

    return new Response(
			JSON.stringify(deletedItem),
			{ status: 200 }
		);
	} catch (error) {
		console.log("ERROR_DELETING_ITEM_[DELETE]", error);
		return new Response(
			JSON.stringify({
				message: "ERROR_DELETING_ITEM_[DELETE]",
			}),
			{ status: 500 }
		);
	}
};
