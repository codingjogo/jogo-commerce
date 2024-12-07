import AddressForm from "@/components/profile/addresses/address-form";
import prisma from "@/lib/db";

export default async function EditAddress({params} : {
  params: {
    addressId: string;
  }
}) {
  const addressId = params.addressId;

  const address = await prisma.address.findFirst({
    where: {
      id: addressId
    },
    include: {
      user: true
    }
  })

  if (!address) {
    return (
      <div className="cpy">
        <h1 className="container mb-6">Address Not Found</h1>
      </div>
    )
  }

	return (
		<div className="cpy">
			<h1 className="container mb-12">Edit Address</h1>

      <AddressForm address={address} />
		</div>
	);
}
