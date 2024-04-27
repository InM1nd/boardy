'use client'

import { AuthUser } from '@supabase/supabase-js';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import EmojiPicker from '../global/emoji-picker';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Subscription, workspace } from '@/lib/supabase/supabase.types';
import { CreateWorkspaceFormSchema } from '@/lib/types';
import { useToast } from '../ui/use-toast';
import { useAppState } from '@/lib/providres/state-provider';
import { v4 } from 'uuid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';
import { createWorkspace } from '@/lib/supabase/queries';
import { Button } from '../ui/button';
import Loader from '../global/Loader';


interface DashboardSetupProps{
  user: AuthUser;
  subscription: Subscription | null;
}

const DashboardSetup: React.FC<DashboardSetupProps> = ({
  user, 
  subscription
}) => {

  const { toast } = useToast();
  const [selectedEmoji, setSelectedEmoji] = useState('➕');
  const {
    register, 
    handleSubmit, 
    reset, 
    formState:{isSubmitting: isLoading, errors},
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode:"onChange", 
    defaultValues:{
      logo:'',
      workspaceName:'',
    },
});

const supabase = createClientComponentClient();
  //get dispatch function
const { dispatch } = useAppState();

  //function to handle file submit
const onSubmit: SubmitHandler<z.infer<typeof CreateWorkspaceFormSchema>> = async (value) => {
    //get the file itself
  const file = value.logo?.[0];
    //creating the path
  let filePath = null;
    //get a new valid ID
  const workspaceUUID = v4();

    //user chose a file
    if (file) {
      try {
        //uploading to buckets
        const { data, error } = await supabase.storage
          .from('workspace-logos')
          .upload(`workspaceLogo.${workspaceUUID}`, file, {
            //1 minute
            cacheControl: '3600',
            //overwrite if exists
            upsert: true,
          });
        if (error) throw new Error();
        //set new file path
        filePath = data.path;
      } catch (error) {
        console.log('Error', error);
        toast({
          variant: 'destructive',
          title: 'Error! Could not upload workspace logo',
        });
      }
    }
    try {
      //constructing workspace to add
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: '',
        title: value.workspaceName,
        workspaceOwner: user.id,
        logo: filePath || null,
        bannerUrl: '',
      };

      //Calling db function
      const { data, error: createError } = await createWorkspace(newWorkspace);
      //handle error
      if (createError) {
        throw new Error();
      }
      //this will add a new workspace to the state, with no folders created yet.
      dispatch({
        type: 'ADD_WORKSPACE',
        payload: { ...newWorkspace, folders: [] },
      });

      toast({
        title: 'Workspace Created',
        description: `${newWorkspace.title} has been created successfully.`,
      });
      //reset the form
    } finally {
      reset();
    }
  }

  return (
    <Card className='w-[800px] h-screen sm:h-auto '>
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <div className='text-5xl'>
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>{selectedEmoji}</EmojiPicker>
              </div>
              <div className='w-full'>
                <Label htmlFor='workspaceName' className='text-sm text-muted-foreground'>
                  Workspace Logo
                </Label>
                <Input 
                  id="workspaceName" 
                  type="text" 
                  placeholder='Workspace Name' 
                  disabled={isLoading} 
                  {...register('workspaceName', {required: "Workspace name is required" }
                )}/>
                  <small className='text-red-600'>
                    {errors?.workspaceName?.message?.toString()}
                  </small>       
              </div>
            </div>
            <div>
            <Label htmlFor='logo' className='text-sm text-muted-foreground'>
                Workspace Logo
                </Label>
                <Input 
                  id="logo" 
                  type="file" 
                  accept='image/*'
                  placeholder='Workspace Name'   
                  // disabled={isLoading || subscription?.status !=="active"} 
                  {...register('logo', {required: false, })}
                  />
                  <small className='text-red-600'>
                    {errors?.logo?.message?.toString()}
                  </small>
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? 'Create Workspace' : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DashboardSetup