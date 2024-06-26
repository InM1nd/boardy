import { SubscriptionModalProvider } from '@/lib/providres/subscribtion-modal-provider';
import React from 'react'

interface LayoutProps{
  children: React.ReactNode;
  params: any;
}

const Layout:React.FC<LayoutProps> = ({children,params}) => {
  return (
    <main className='flex overflow-hidden h-screen'>
      <SubscriptionModalProvider>
        {children}
      </SubscriptionModalProvider>      
    </main>
  )
}

export default Layout