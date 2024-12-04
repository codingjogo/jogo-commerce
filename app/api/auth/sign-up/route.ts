import prisma from "@/lib/db";
import { signUpSchema } from "@/lib/schemas/signUpSchemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = signUpSchema.safeParse(body);

    if (!validatedData.success) {
      return Response.json({
        message: 'POST SIGNUP IS NOT SUCCESSFUL',
        method: req.method,
        data: body
      }, {
        status: 400
      })
    }

    const {first_name, last_name, email} = validatedData.data;

    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
      }
    })

    return Response.json({
      message: 'POST SIGNUP SUCCESSFUL',
      method: req.method,
      data: newUser
    }, {
      status: 200
    })
  } catch (err) {
    console.log("FAILED SIGNUP POST", err)
    return Response.json({
      message: 'FAILED SIGNUP POST',
      method: req.method,
    })
  }
}