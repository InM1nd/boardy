'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useAppState } from '@/lib/providres/state-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useSupabaseUser } from '@/lib/providres/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Briefcase, CreditCard, ExternalLink, Lock, LogOut, Plus, Share, User as UserIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { addCollaborators, deleteWorkspace, getCollaborators, removeCollaborators, updateWorkspace } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import CollaboratorSearch from '../global/collaborator-search';
import CypressProfileIcon from "../icons/cypressProfileIcon";
import LogoutButton from "../global/logout-button";
import Link from "next/link";
import { useSubscriptionModal } from "@/lib/providres/subscribtion-modal-provider";


const SettingsForm = () => {
  const {toast} = useToast();
  const {user, subscription } = useSupabaseUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const {state, workspaceId, dispatch} = useAppState();
  const [permissions, setPermissions] = useState('private');
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace>();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const {open, setOpen} = useSubscriptionModal();
  //WIP PAYMENT PORTAL

  //add collaborators
  const addCollaborator = async (profile: User) => {
    if(!workspaceId) return;
    if(subscription?.status !== 'active' && collaborators.length >= 2) {
      setOpenAlertMessage(true);
      return;
    }
    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);

    router.refresh();
  }
  //remove collaborators
  const removeCollaborator = async (user: User) => {
    if(!workspaceId) return;
    if(collaborators.length === 1) {
      setPermissions('private');
    }
    await removeCollaborators ([user], workspaceId);
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.id !== user.id)
    )
  }

  //onchange workspace title
  //on change
  const workspaceNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    if(!workspaceId || !e.target.value) return;
    dispatch({
      type:"UPDATE_WORKSPACE",
      payload: { workspace: { title: e.target.value }, workspaceId },
    });
    if(titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout( async () => {
      await updateWorkspace({title: e.target.value}, workspaceId)
    }, 500)
  }

  const onChangeWorkspaceLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;
    const file = e.target.files?.[0];
    if(!file) return;
    const uuid = v4();
    setUploadingLogo(true);
    const {data, error} = await supabase.storage
    .from('workspace-logos')
    .upload(`workspaceLogo.${uuid}`, file, {
      //1 minute
      cacheControl: '3600',
      //overwrite if exists
      upsert: true,
    });

    if(!error){
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: { workspace: { logo: data.path }, workspaceId },
      });
      await updateWorkspace({ logo: data.path }, workspaceId)
    }
  }

  const onClickAlertConfirm = async() => {
    if(!workspaceId) return
    if(collaborators.length > 0){
      await removeCollaborators(collaborators, workspaceId)
    }
    setPermissions("private");
    setOpenAlertMessage(false)
  }

  const onPermissionChange = (val:string) => {
    if (val === 'private'){
      setOpenAlertMessage(true);
    } else setPermissions(val);
  }

  //onClick
  //fetching avatar details
  // const onChangeProfilePicture = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = e.target.value;
  //   let filePath = "";
  //   const uploadAvatar = async () => {
  //     const { data, error } = await supabase.storage
  //       .from("avatars")
  //       .upload(`avatar-${v4()}`, file, { cacheControl: "5", upsert: true });

  //     if (error) throw error;
  //     filePath = data.path;
  //   };

  //   const deleteAvatar = async (avatarUrl: string) => {
  //     const { data, error } = await supabase.storage
  //       .from("avatars")
  //       .remove([avatarUrl]);
  //     if (error) throw error;
  //     console.log("Avatar Delete Data:", data);
  //   };

  //   try {
  //     if (!avatarUrl) {
  //       await uploadAvatar();
  //     } else {
  //       await deleteAvatar(avatarUrl);
  //       await uploadAvatar();
  //     }
  //     setAvatarUrl(filePath);
  //     if (!user) return;
  //     const { data, error } = await updateUser(
  //       { avatarUrl: filePath },
  //       user.id
  //     );
  //     if (error) {
  //       toast({
  //         title: "Error",
  //         variant: "destructive",
  //         description: "Could not update the profile picture",
  //       });
  //     } else {
  //       toast({
  //         title: "Success",
  //         description: "Updated the profile picture",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error in uploading profile picture:");
  //     console.log(error)
  //   }
  // };


  //get workspace details
  //get all collaborators 
  //WIP PAYMENT PORTAL redirect

  useEffect(() => {
    const showingWorkspace = state.workspaces.find(workspace => workspace.id === workspaceId )
    if(showingWorkspace) setWorkspaceDetails(showingWorkspace);
  }, [workspaceId, state])

  useEffect(() => {
    if(!workspaceId) return
    const fetchCollaborators = async () => {
      const response = await getCollaborators(workspaceId);
      if(response.length){
        setPermissions('shared');
        setCollaborators(response);
      }
    }
    fetchCollaborators();
  }, [workspaceId])

  return (
    <div className='flex gap-4 flex-col'>
      <p className='flex items-center gap-2 mt-6'>
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator />
      <div className='flex flex-col gap-2'>
        <Label className='text-sm text-muted-foreground' htmlFor='workspaceName'> 
          Name
        </Label>
        <Input 
          name='workspaceName' 
          value={workspaceDetails?workspaceDetails.title: ""}
          placeholder='Workspace Name'
          onChange={workspaceNameChange}
        />
        <Label className='text-sm text-muted-foreground' htmlFor='workspaceLogo'> 
          Workspace Logo
        </Label>
        <Input 
          name='workspaceLogo' 
          type='file'
          accept='image/*'
          placeholder='Workspace Logo'
          onChange={onChangeWorkspaceLogo}
          disabled={uploadingLogo || subscription?.status !== 'active'}
        />
        {subscription?.status !== 'active' && (
          <small className="text-muted-foreground">
            To customize your workspace, you need to be on a Pro Plan!
          </small>
        )}
      </div>
      <>
        <Label htmlFor='permissions'>
          Permissions
        </Label>
        <Select 
        onValueChange={onPermissionChange}
        value={permissions}
        > 
        <SelectTrigger className="w-full h-26 -mt-3">
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="private">
              <div className="p-2 flex gap-4 justify-center items-center">
                <Lock/>
                <article className="text-left flex flex-col">
                  <span>
                    Private
                  </span>
                  <p>
                    Your workspace is private to you. You can choose to shareit later.
                  </p>
                </article>
              </div>
            </SelectItem>
            <SelectItem value="shared">
              <div className="p-2 flex gap-4 justify-center items-center">
                  <Share/>
                  <article className="text-left flex flex-col">
                    <span>
                      Share
                    </span>
                    <p>
                    You can invite collaborators.
                    </p>
                  </article>
                </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
        {permissions === 'shared' && 
          <div>
            <CollaboratorSearch
              existingCollaborators={collaborators}
              getCollaborator={(user) => {
                addCollaborator(user);
              }}
            >
              <Button type="button" className="text-sm mt-4">
                <Plus/>
                Add Collaborators
              </Button> 
            </CollaboratorSearch>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators {collaborators.length || ''}
              </span>
              <ScrollArea className="h-[120px] overflow-y-scroll w-full rounded-md border border-muted-foreground/20">
                {collaborators.length ? 
                  collaborators.map((c) => 
                    <div 
                      className="p-4 flex justify-between items-center"
                      key={c.id}
                    >
                      <div className="flex gap-4 items-center"> 
                        <Avatar>
                          <AvatarImage src="/avatars/7.png"></AvatarImage>
                          <AvatarFallback>PJ</AvatarFallback>
                        </Avatar>
                        <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]"
                        >
                          {c.email}
                        </div>
                      </div>
                      <Button variant="secondary" onClick={() => removeCollaborator(c)}>
                        Remove
                      </Button>
                    </div>
                  ) 
                  : 
                  <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                    <span className="text-muted-foreground text-sm">
                      You have no collaborators!
                    </span>
                  </div>
                }
              </ScrollArea>
            </div>
          </div>
        }
        <Alert variant={"destructive"}>
          <AlertDescription>
            Warning! deleting you workspace will permanantly delete all data related to this workspace.
          </AlertDescription>
          <Button
            type='submit'
            size={'sm'}
            variant={'destructive'}
            className='mt-4 text-sm bg-destructive/40 border-2 border-destructive'
            onClick={async () => {
              if (!workspaceId) return
              await deleteWorkspace(workspaceId);
              toast({title: 'Your workspace was successfuly deleted'})
              dispatch({ type: "DELETE_WORKSPACE", payload: workspaceId})
              router.replace('/dashboard');
            }}
          > 
            Delete Workspace
          </Button>
        </Alert>
        <p className="flex items-center gap-2 mt-6">
          <UserIcon size={20}/> Profile
        </p>
        <Separator/>
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={''}/>
            <AvatarFallback>
              <CypressProfileIcon/>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-6">
            <small className="text-muted-foreground cursor-not-allowed">
              {user ? user.email : ''}
            </small>
            <Label 
              htmlFor="profilePicture"
              className="text-sm text-muted-foreground"
            >
              Profile Picture
            </Label>
            <Input 
              name="profilePicture" 
              type="file"
              placeholder="Profile Picture"
              // onChange={onChangeProfilePicture}
              disabled={uploadingProfilePic}
            />
          </div>
        </div>
        <LogoutButton>
          <div className="flex items-center">
            <LogOut/>
          </div>
        </LogoutButton>
        <p className="flex items-center gap-2 mt-6">
          <CreditCard size={20}/> Billing & Plan
        </p>
        <Separator />
        <p className="text-muted-foreground">
          You are currently on a {' '}
          {subscription?.status === 'active' ? 'Pro' : 'Free'} Plan
        </p>
        <Link 
          href="/" 
          target="_blank" 
          className="text-muted-foreground flex flex-row items-center gap-2"
        >
          View Plans
          <ExternalLink size={16}/>
        </Link>
        {subscription?.status === "active" ? (
          <div>
            <Button
              type="button"
              size="sm"
              variant={'secondary'}
              // disabled={loadingPortal}
              className="text-sm"
              // onClick={redirectToCustomerPortal}
            >
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              size="sm"
              variant={'secondary'}
              className="text-sm"
              onClick={() => {
                 setOpen(true);
              }}
            >
              Start Plan
            </Button>
          </div>
        )}
      </>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing a Shared workspace to a Private workspace will remove all
              collaborators permanantly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertMessage(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onClickAlertConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SettingsForm