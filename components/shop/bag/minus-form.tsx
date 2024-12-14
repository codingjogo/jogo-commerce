"use client";

import { Button } from "@/components/ui/button";
import { useBagStore } from "@/store/useBagStore";
import axios from "axios";
import { Minus } from "lucide-react";
import React from "react";

const MinusForm = ({ id, quantity, clerk_user_id }: { id:string; quantity: number; clerk_user_id: string; }) => {

    const handleClick = async () => {
      if (quantity > 1)  {
        useBagStore.getState().updateItemInBagStore(id, {
					quantity: quantity - 1,
				})

        try {
          const response = await axios.patch(
            `/api/shop/bag/quantity?clerk_user_id=${clerk_user_id}&bag_id=${id}&quantity=1&method=decrement`
          );
    
          if (response.status !== 200) {
            throw new Error("Error decrementing a bag item.");
          }
    
        } catch (error) {
          console.error(error);
        }
      } else {
        return;
      }
    }

	return (
		<Button
			variant={"outline"}
			className="btn btn-secondary btn-sm"
      onClick={handleClick}
		>
			<Minus />
		</Button>
	);
};

export default MinusForm;
