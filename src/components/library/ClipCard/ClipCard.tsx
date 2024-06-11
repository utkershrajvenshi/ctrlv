import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CLIPS_RELATION, QUERY_KEYS, SupabaseContext } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid"
import React, { useContext, useEffect, useRef } from "react"
import { RiAttachment2, RiDeleteBin2Fill } from "react-icons/ri";
import { RxCrossCircled, RxPlusCircled } from "react-icons/rx";
import { LoadingSpinner } from "../LoadingSpinner";
import { useLocation } from "react-router-dom";
import { PostgrestError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

interface IClipCard {
  title?: string
  variant?: 'existing' | 'new'
  description?: string
  timestamp?: string
  attachmentsCount?: number
  error?: Error | PostgrestError | null
  isLoading?: boolean,
  clipId?: string
}

interface ICreateClip {
  id: string
  created_at: Date
  text_content?: string
  attachments?: string[]
  belongs_to: string
}

function parseDateTimestamp(timestamp: string | undefined) {
  if (!timestamp) return null
  // TODO: Could need to work on localised timestamps here. Currently only system time is being considered
  const dateObject = new Date(timestamp)
  const hour = dateObject.getHours()
  const hourString = hour < 10 ? '0' + hour : hour.toString()
  const minutes = dateObject.getMinutes()
  const minutesString = minutes < 10 ? '0' + minutes : minutes.toString()
  const timeString = hourString + ':' + minutesString
  return timeString + ', ' + dateObject.toDateString()
}

const AddNewClip = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const { state } = useLocation()
  const { toast } = useToast()
  const [queryParams, setQueryParams] = React.useState<ICreateClip>()
  const { supabase } = useContext(SupabaseContext)
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CREATE_CLIP],
    queryFn: async () => await supabase.from(CLIPS_RELATION).insert({ ...queryParams }).select(),
    enabled: false
  })

  const onClickCreateClip = () => {
    const uniqueId = uuidv4()
    if (textAreaRef?.current && textAreaRef?.current.value && state?.accessCode) {
      // Create a clip record
      setQueryParams({
        id: uniqueId,
        created_at: new Date(),
        text_content: textAreaRef.current.value,
        belongs_to: state?.accessCode
      })
    }
  }

  useEffect(() => {
    if (data?.data && !data.error) {
      dialogCloseRef.current?.click()
    } else if (data?.error) {
      toast({
        title: 'Error',
        description: 'Could not create clip. Error: ' + data?.error.message,
        variant: 'destructive'
      })
    }
  }, [data, toast])

  useEffect(() => {
    if (queryParams) {
      refetch()
    }
  }, [queryParams, refetch])

  if (isLoading) {
    return <LoadingSpinner />
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center w-72 h-64 bg-yellow-100 gap-2 border rounded-lg p-4 z-10 shadow-lg text-slate-700">
          <RxPlusCircled className="h-6 w-6"/>
          {"Add a Clip"}
        </div>
      </DialogTrigger>
      <DialogContent className="font-serif max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a new clip</DialogTitle>
          <section className="user-entered-area">
            <Textarea className="mt-4" maxLength={64} ref={textAreaRef} placeholder="Start typing..." />
            <div className="flex justify-between items-center mt-4">
              <Button className="font-semibold px-6 py-3 h-12 rounded-2xl" onClick={onClickCreateClip}>Create</Button>
              <DialogClose ref={dialogCloseRef} className="hidden" />
            </div>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
const ClipCard: React.FC<IClipCard> = ({ title, description, timestamp, attachmentsCount, error, isLoading, variant = 'existing', clipId }: IClipCard) => {  
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()
  const { supabase } = useContext(SupabaseContext)

  const { refetch, data, isLoading: deleteLoading, error: deleteError } = useQuery({
    queryKey: [QUERY_KEYS.DELETE_CLIP],
    queryFn: async () => await supabase.from(CLIPS_RELATION).delete().eq('id', clipId),
    enabled: false
  })


  useEffect(() => {
    if (data?.status === 204 && !data.error && !deleteError && !deleteLoading) {
      dialogCloseRef.current?.click()
    } else if (data?.error || deleteError) {
      toast({
        title: 'Error deleting clip',
        description: data?.error?.message || deleteError?.message,
        variant: 'destructive'
      })
    }
  }, [data, deleteError, deleteLoading, toast])
  
  if (variant === 'new') {
    // Show add a new clip card
    return (
      <AddNewClip />
    )
  }
  
  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-1">
        <Skeleton className="h-52 w-60 rounded-t-xl rounded-b-none" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-60 rounded-b-xl rounded-t-none" />
        </div>
      </div>
    )
  }

  // Show error message if encountered
  if (error) {
    return (
      <div className="flex justify-center items-center w-72 h-72 bg-red-100 gap-2 border rounded-lg p-4 z-10 shadow-lg text-red-700">
        <RxCrossCircled className="h-6 w-6"/>
        {"Could not load clip"}
      </div>
    )
  }

  // If everything is fine, show the card

  const onClickCopyClip = () => {
    // This functionality is relevant for copy scenario
    if (textAreaRef?.current) {
      textAreaRef.current.disabled = false
      textAreaRef.current.select()
      try {
        navigator.clipboard.writeText(textAreaRef.current.value).then(() => {
          toast({
            description: 'Text copied to clipboard'
          })
          if (textAreaRef.current) {
            textAreaRef.current.disabled = true
          }
        })
      } catch (e) {
        toast({
          title: 'Failed to copy text',
          description: (e as Error).message,
          variant: 'destructive'
        })
        textAreaRef.current.disabled = true
      }
    }
  }

  const onClickDeleteClip = () => {
    // This functionality is relevant for delete scenario
    if (clipId) {
      refetch()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col w-72 gap-2 border rounded-lg p-4 z-10 shadow-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold truncate">{title}</p>
            <p className="text-sm text-slate-500 h-40 line-clamp-8 break-words">{description}</p>
          </div>
          <div className="flex justify-between items-center gap-2 text-xs">
            <div className="flex flex-row items-center justify-center w-10 h-10">
              { attachmentsCount
                ? (
                  <>
                    <RiAttachment2 />
                    {attachmentsCount}
                  </>
                )
                : null }
            </div>
            <p className="text-slate-500">{parseDateTimestamp(timestamp)}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="font-serif max-w-3xl">
        <DialogHeader>
          <DialogTitle>{parseDateTimestamp(timestamp)}</DialogTitle>
          <section className="user-entered-area">
            <Textarea className="mt-4" maxLength={64} ref={textAreaRef} disabled placeholder="Start typing..." value={description} />
            <div className="flex justify-between items-center mt-4">
              <Button className="font-semibold px-6 py-3 h-12 rounded-2xl" onClick={onClickCopyClip}>Copy text</Button>
              <Button variant="outline" size="icon" onClick={onClickDeleteClip}>
                <RiDeleteBin2Fill className="h-6 w-6"/>
              </Button>
              <DialogClose ref={dialogCloseRef} className="hidden" />
            </div>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export { ClipCard }
export type { IClipCard }
