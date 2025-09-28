import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { RxArrowLeft, RxCopy, RxShare1 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ACCESS_CODE_POSTGRES, BOARDS_RELATION, CLIPS_RELATION, CLIP_CREATED_AT_POSTGRES, CLIP_TITLE_POSTGRES, QUERY_KEYS, SupabaseContext, TEXT_CONTENT_POSTGRES } from "@/context";
import { ClipCard, AddNewClip } from "@/components/library/ClipCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QRCodeCanvas } from 'qrcode.react';
import { createShareableLink } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@supabase/supabase-js";

interface IClipsArea {
  accessCode?: string | null
  canEdit?: boolean
}

const ClipsArea: React.FC<IClipsArea> = ({ accessCode, canEdit = true }: IClipsArea) => {
  const { supabase } = useContext(SupabaseContext)
  const { toast } = useToast()
  
  const { error, data, isLoading, refetch: refetchClips } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_CLIPS, accessCode],
    queryFn: async () => {
      return await supabase.from(CLIPS_RELATION).select().eq('belongs_to', accessCode).order('created_at', { ascending: false })
    }
  })
  
  useEffect(() => {
    if (!isLoading && (error || !data?.data || data?.error)) {
      toast({
        title: 'Error',
        description: (error?.message || data?.error?.message) ?? 'Something went wrong.',
        variant: 'destructive'
      })
    }
  }, [error, data, isLoading, toast])

  useEffect(() => {
    const channel = supabase.channel('clipboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: CLIPS_RELATION,
          filter: `belongs_to=eq.${accessCode}`
        }, 
        (payload) => {
          console.log('Real-time update:', payload)
          refetchClips()
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, accessCode, refetchClips])

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 py-4 md:py-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <ClipCard key={index} isLoading={true} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 py-4 md:py-6">
      {[
        ...data?.data?.map((clipObject: Record<string, string | undefined>) => (
          <div key={clipObject?.id} className="flex">
            <ClipCard
              clipId={clipObject?.id}
              description={clipObject?.[TEXT_CONTENT_POSTGRES]}
              title={clipObject?.[CLIP_TITLE_POSTGRES]}
              error={null}
              isLoading={false}
              timestamp={clipObject?.[CLIP_CREATED_AT_POSTGRES]}
              attachmentsCount={clipObject?.attachment_path ? 1 : 0}
              attachmentPath={clipObject?.attachment_path}
              attachmentName={clipObject?.attachment_name}
              canEdit={canEdit}
            />
          </div>
        )) ?? [],
        ...(canEdit ? [<AddNewClip key="new" />] : [])
      ]}
    </div>
  )
}

const OverviewScreen = () => {
  const { state } = useLocation()
  const { supabase } = useContext(SupabaseContext)
  const [resizableDirection, setResizableDirection] = useState<'vertical' | 'horizontal'>(window.innerWidth < 768 ? 'vertical': 'horizontal')
  const [buttonVariant, setButtonVariant] = useState<'ghost' | 'outline'>(window.innerWidth < 768 ? 'outline': 'ghost')
  const [separatorDirection, setSeparatorDirection] = useState<'vertical' | 'horizontal'>(window.innerWidth < 768 ? 'horizontal': 'vertical')
  const [user, setUser] = useState<User | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [supabase])

  useEffect(() => {
    if (!state || Object.keys(state).length === 0 ) {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  useEffect(() => {
    const handleResize = () => {
      const newDirection = window.innerWidth < 768 ? 'vertical' : 'horizontal'
      const newButtonVariant = window.innerWidth < 768 ? 'outline' : 'ghost'
      const newSeparatorDirection = window.innerWidth < 768 ? 'horizontal' : 'vertical'

      setResizableDirection(newDirection)
      setButtonVariant(newButtonVariant)
      setSeparatorDirection(newSeparatorDirection)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const {
    accessCode,
    expiryDate,
    clipboardName,
    ownerId,
    isPublic,
    ownerEmail
  } = state ?? {}

  // Determine if current user can edit this board
  const canEdit = isPublic || (user && ownerId === user.id)

  const { refetch: deleteCurrentBoard, data, isLoading: deleteBoardLoading, error: deleteBoardError } = useQuery({
    queryKey: [QUERY_KEYS.DELETE_BOARD, accessCode],
    queryFn: async () => {
      // Check if user has permission to delete
      if (!canEdit) {
        throw new Error("You don't have permission to delete this board")
      }

      // First, get all clips for this board to clean up their attachments
      const { data: clipsData } = await supabase
        .from(CLIPS_RELATION)
        .select('attachment_path')
        .eq('belongs_to', accessCode)
      
      // Delete all attachments from storage
      if (clipsData && clipsData.length > 0) {
        const attachmentPaths = clipsData
          .filter(clip => clip.attachment_path)
          .map(clip => clip.attachment_path)
        
        if (attachmentPaths.length > 0) {
          await supabase.storage.from('public-attachments').remove(attachmentPaths)
        }
      }
      
      // Delete all clips
      await supabase.from(CLIPS_RELATION).delete().eq('belongs_to', accessCode)
      
      // Finally delete the board
      return await supabase.from(BOARDS_RELATION).delete().eq(ACCESS_CODE_POSTGRES, accessCode)
    },
    enabled: false
  })

  useEffect(() => {
    if (data?.status === 204 && !data.error && !deleteBoardError && !deleteBoardLoading) {
      navigate('/')
      toast({
        description: 'Board deleted successfully'
      })
    } else if (deleteBoardError) {
      toast({
        title: 'Delete failed',
        description: deleteBoardError.message,
        variant: 'destructive'
      })
    }
  }, [data, deleteBoardLoading, deleteBoardError, navigate, toast])

  const selfDestructDate = new Date(expiryDate)
  const shareableLink = createShareableLink(accessCode)
  const isOwner = user && ownerId === user.id
  const boardTypeLabel = isPublic ? 'Public' : 'Private'

  const onClickCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast({
          description: 'Link copied to clipboard'
        })
      })
    } catch (e) {
      toast({
        title: 'Failed to copy link',
        description: (e as Error).message,
        variant: 'destructive'
      })
    }
  }

  const onClickBackButton = () => {
    navigate('/')
  }

  const onClickLogout = () => {
    supabase.auth.signOut().then(() => {
      navigate('/')
    })
  }

  const onClickDeleteNow = () => {
    if (canEdit) {
      deleteCurrentBoard()
    } else {
      toast({
        title: 'Permission denied',
        description: 'Only the board owner can delete this board',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="h-screen font-serif">
      <ResizablePanelGroup direction={resizableDirection}>
        <ResizablePanel className="flex flex-col p-4 md:p-9 justify-between bg-black text-white font-serif" defaultSize={21} minSize={21} maxSize={31}>
          <div className="flex justify-between items-center text-2xl md:text-3xl lg:text-4xl">
            <RxArrowLeft onClick={onClickBackButton} className="cursor-pointer hover:text-gray-300 transition-colors"/>
            <p className="font-semibold">CtrlV</p>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col items-center sm:justify-around font-semibold">
            <div className="text-center mb-4">
              <p className="my-3 sm:my-0 md:my-3 text-base md:text-lg lg:text-xl text-neutral-400">{clipboardName}</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${isPublic ? 'bg-green-900 text-green-100' : 'bg-blue-900 text-blue-100'}`}>
                  {boardTypeLabel}
                </span>
                {ownerEmail && (
                  <span className="text-neutral-500 text-xs">
                    by {isOwner ? 'you' : ownerEmail.split('@')[0]}
                  </span>
                )}
              </div>
              {!canEdit && (
                <p className="text-xs text-yellow-400 mt-1">Read-only access</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 gap-y-5 md:gap-y-10 text-center text-xs md:text-sm md:mt-10 md:mb-10">
              <label htmlFor="uniqueBoardCode" className="text-neutral-500">Board Code:</label>
              <p id="uniqueBoardCode" className="font-mono">{accessCode}</p>
              <label htmlFor="lastDate" className="text-neutral-500">Self-Destruct Date:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <p id="lastDate" className="text-expiry-red underline decoration-dotted text-center font-serif cursor-pointer hover:text-red-400 transition-colors">
                    {selfDestructDate.toDateString()}
                  </p>
                </PopoverTrigger>
                <PopoverContent className="bg-black text-white text-base p-0 w-44 text-center">
                  {canEdit ? (
                    <p 
                      className="px-1 py-2 rounded-t-md hover:bg-gray-800 cursor-pointer transition-colors" 
                      onClick={onClickDeleteNow}
                    >
                      Delete Now
                    </p>
                  ) : (
                    <p className="px-1 py-2 text-neutral-400 cursor-not-allowed">
                      No permission
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={buttonVariant} className="text-black md:text-white text-lg md:text-xl w-fit mx-auto font-semibold p-2 mt-2 md:mt-0 hover:bg-gray-800 transition-colors">
                <RxShare1 className="mr-4" />
                <span className="mt-1">Share board</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="font-serif max-w-sm sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Share board</DialogTitle>
                <section className="flex flex-col md:flex-row justify-between items-start">
                  <div className="flex flex-col justify-between w-full md:w-3/5 h-full">
                    <div className="pt-2 mt-2 md:mt-0 mb-2 md:mb-8 flex flex-col items-center justify-between">
                      <p className="text-slate-500 font-semibold pb-2">Access Code:</p>
                      <span className="text-3xl md:text-5xl font-bold text-green-900 tracking-wider font-mono">{accessCode}</span>
                      <div className="mt-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {boardTypeLabel} Board
                        </span>
                        {!isPublic && (
                          <p className="text-xs text-gray-500 mt-1">Only you can access this board</p>
                        )}
                      </div>
                    </div>
                    
                    {(
                      <div className="flex items-center py-2">
                        <Input type="text" disabled className="p-2 mr-2 rounded-sm w-full text-start cursor-text" defaultValue={shareableLink} />
                        <Button variant="outline" size="icon" className="rounded-sm" onClick={onClickCopyLink}>
                          <RxCopy />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {(
                    <>
                      <Separator orientation={separatorDirection} className="mx-0 my-2 md:mx-2 md:my-0"/>
                      <div className="p-3 mt-2 md:mt-0 mx-auto bg-gray-200/70 rounded-sm border-slate-300 border-2">
                        <QRCodeCanvas value={shareableLink} size={210}/>
                        <p className="pt-4 text-center text-slate-700">Scan QR code</p>
                      </div>
                    </>
                  )}
                </section>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel className="p-4 md:p-9">
          <section className="flex justify-between items-center">
            <p className="font-bold text-2xl md:text-3xl lg:text-4xl">Saved Clips</p>
            {!canEdit && (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Read-only mode
              </span>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{user.email?.split('@')[0]}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onClickLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </section>
          <section className="overflow-y-auto overscroll-auto h-full">
            <ClipsArea accessCode={accessCode} canEdit={canEdit} />
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export { OverviewScreen }
