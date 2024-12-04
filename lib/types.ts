import { Prisma } from "@prisma/client";

export type TProduct = Prisma.productGetPayload<{
  include: {
    variant_color: {
      include: {
        variant_size: true
      }
    }
  }
}>

export type TVariantColor = Prisma.variant_colorGetPayload<{
  include: {
    variant_size: true
  }
}>

export type TVariantSize = Prisma.variant_sizeGetPayload<{
  include: {
    variant_color: true
  }
}>

export type TAddressWithUser = Prisma.addressGetPayload<{
  include: {
    user: true
  }
}>