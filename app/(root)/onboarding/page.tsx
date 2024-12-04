import React from 'react'
import OnboardingForm from '@/components/onboarding/onboarding-form'
import { currentUser } from '@clerk/nextjs/server'
import { capitalizeWords } from '@/lib/helpers';

export default async function OnboardingComponent() {
  const user = await currentUser();
  const fullName = capitalizeWords(`${user?.firstName} ${user?.lastName}!`) || 'First and Last Name are not defined'

  return (
    <section className='container py-12'>
      <h1 className='mb-6'>Welcome {fullName}</h1>
      <OnboardingForm />
    </section>
  )
}