import { productSchema } from "@/lib/schemas/productSchemas";

export async function GET(req: Request) {
  try {

    // if (true) {
    //   return Response.json({error: 'Shit gone wrong', method: req.method} , { status: 400 })
    // }

    return Response.json({
      message: 'GET PRODUCTS SUCCESSFUL',
      method: req.method
    }, {
      status: 200,
    })
  } catch (err) {
    console.log("FAILED_GET_PRODUCTS", err)
    return Response.json('FAILED_GET_PRODUCTS', {
      status: 400,

    })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const validatedData = productSchema.safeParse(json)

    if (!validatedData.success) {
      return Response.json({
        error: 'ZOD VALIDATION ERROR',
      }, {
        status: 400,
      });
    }

    return Response.json({
      message: 'Succesfully creating product',
      method: req.method
    }, {
      status: 200
    })
  } catch (err) {
    console.log("FAILED_POST_PRODUCTS", err)
    
    return Response.json({
      message: 'Failed to create product',
    }, {
      status: 400
    })
  }
}