
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