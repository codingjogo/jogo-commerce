export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean,
      address: {
        id: string,
        house_number: string,
        street:string,
        barangay: string,
        municipality:string,
        province: string,
        zip_code:string
        is_default: boolean
      },
      isAcceptTermsAndConditions: boolean
    }
  }

  type TBagStore = {
    id: string;
    image: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }
}