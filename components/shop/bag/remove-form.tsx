'use client';

import { Button } from '@/components/ui/button';
import React from 'react'

const RemoveForm = ({id, removeItem} : {id: string, removeItem}) => {
  return (
    <Button variant={'ghost'} type='button'>
									onClick={() => removeItem(id)}
									className="btn btn-destructive btn-sm"
								>
									Remove
								</Button>
  )
}

export default RemoveForm