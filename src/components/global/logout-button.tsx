'use client'
import { useAppState } from '@/lib/providres/state-provider';
import { useSupabaseUser } from '@/lib/providres/supabase-user-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';

interface LogoutButtonProps {
  children: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps>= ({children}) => {

  const {user} = useSupabaseUser();
  const {dispatch} = useAppState();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    dispatch({
      type: "SET_WORKSPACES",
      payload: {workspaces: []} ,
    })
  }

  return (
    <Button 
      variant="ghost"
      size="icon"
      className='p-0'
      onChange={logout}
    >
      {children}
    </Button>
  )
}

export default LogoutButton