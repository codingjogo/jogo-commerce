import YourDefaultAddress from "@/components/profile/your-default-address";
import YourProfileInfo from "@/components/profile/your-profile-info";
import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function Profile() {
  const user = await currentUser();

  const userFromDB = await prisma.user.findFirst({
    where: { 
      clerk_user_id: user?.id
    }
  })

	const address = await prisma.address.findFirst({
		where: { user_id: userFromDB?.id },
    include: {
      user: true
    }
	});

  if (!address) {
    return (
      <div className="cpy">
			<h1 className="container mb-6">Address Not Found</h1>
      </div>
    )
  }

	return (
		<div className="cpy">
			<h1 className="container mb-24">Your Profile</h1>
			<YourProfileInfo />
			<YourDefaultAddress address={address} />
		</div>
	);
}
