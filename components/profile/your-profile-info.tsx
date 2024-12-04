'use client';

import { capitalizeWords } from '@/lib/helpers';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image'
import React from 'react'

const YourProfileInfo = () => {
  const { user } = useUser();
  const userAvatar = user?.imageUrl || ''
  const firstName = user?.firstName
  const lastName = user?.lastName
  const fullName = capitalizeWords(`${firstName} ${lastName}`);

  return (
    <section className='container mb-24'>
      <h2 className='mb-6'>About You</h2>

      {/* Personal Information */}
      <div className='flex gap-4'>
        <Image src={userAvatar} alt='' width={80} height={80} />

        <div>
          <h3>{fullName}</h3>
        </div>
      </div>
    </section>
  )
}

export default YourProfileInfo