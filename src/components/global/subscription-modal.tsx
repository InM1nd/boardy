'use client'
import { useSubscriptionModal } from '@/lib/providres/subscribtion-modal-provider'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useSupabaseUser } from '@/lib/providres/supabase-user-provider';
import { formatPrice } from '@/lib/utils';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import Loader from './Loader';

const SubscriptionModal = () => {
  const {open, setOpen} = useSubscriptionModal();
  const {subscription} = useSupabaseUser();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseUser();
  const { toast } = useToast();

  return (
    <Dialog 
      open={open}
      onOpenChange={setOpen}
    >
      {subscription?.status === 'active' ? (
        <Dialog> Already on paid plan!</Dialog>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Pro Plan!</DialogTitle>
          </DialogHeader>
          <DialogDescription> 
            To access Pro features you need to have a pro plan.
          </DialogDescription>
          <div className='flex justify-between items-center'>
            <React.Fragment>
              <b className='text-3xl text-foreground'>
                {/* {formatPrice(price)} / <small>{price.interval}</small> */}
              </b>
              <Button disabled={isLoading}>
                {isLoading? <Loader/> : "Upgrade 🎇"}
              </Button>
            </React.Fragment>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default SubscriptionModal