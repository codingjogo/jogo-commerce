import prisma from "@/lib/db";
import { addressSchema } from "@/lib/schemas/addressSchemas";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const validatedData = addressSchema.safeParse(json)

    if (!validatedData.success) {
      return Response.json({
        error: 'ZOD VALIDATION ERROR',
        status: 400,
      });
    }

    const {id, house_number, street, barangay, municipality, province, zip_code, is_default, updated_at} = validatedData.data;

    if (!id) {
      return Response.json({
        error: 'Address ID not found!',
        status: 400,
      });
    }

    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        updated_at,
        house_number,
        street,
        barangay,
        municipality,
        province,
        zip_code,
        is_default
      }
    })

    return Response.json({
      data: updatedAddress
    }, {
      status: 200,
    })
  } catch (err) {
    console.log(err)
  }
}