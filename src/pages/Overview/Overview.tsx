import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { RxArrowLeft, RxCopy, RxShare1 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ACCESS_CODE_POSTGRES, ATTACHMENTS_POSTGRES, BOARDS_RELATION, CLIPS_RELATION, CLIP_CREATED_AT_POSTGRES, CLIP_TITLE_POSTGRES, QUERY_KEYS, SupabaseContext, TEXT_CONTENT_POSTGRES } from "@/context";
import { ClipCard } from "@/components/library/ClipCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QRCodeCanvas } from 'qrcode.react';
import { createShareableLink } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface IClipsArea {
  clips: string[] | null
}
const ClipsArea: React.FC<IClipsArea> = ({ clips }: IClipsArea) => {
  // Responsible for displaying the listView of clips
  const { supabase } = useContext(SupabaseContext)
  
  const queryResults = useQueries({
    queries: clips?.map((clipId) => ({
      queryKey: [QUERY_KEYS.FETCH_CLIP, clipId],
      queryFn: async () => {
        return await supabase.from(CLIPS_RELATION).select().eq('id', clipId).single()
      }
    })) ?? []
  }) // flex flex-wrap gap-4 my-6 // grid gap-[12px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4
  let clipResults = null
  if (clips) {
    clipResults = queryResults.map(({ error, data, isLoading }) => (
      <div className="flex">
        <ClipCard
          key={data?.data?.id}
          clipId={data?.data?.id}
          description={data?.data?.[TEXT_CONTENT_POSTGRES]}
          title={data?.data?.[CLIP_TITLE_POSTGRES]}
          error={error ?? data?.error}
          isLoading={isLoading}
          timestamp={data?.data?.[CLIP_CREATED_AT_POSTGRES]}
          attachmentsCount={data?.data?.[ATTACHMENTS_POSTGRES]?.length ?? 0}
        />
      </div>
    ))
  }
  return (
    <div className="flex flex-wrap gap-4 py-6">
      {[
        ...clipResults ?? [],
        <ClipCard variant="new" />
      ]}
    </div>
  )
}

const OverviewScreen = () => {
  const { state } = useLocation()
  const { supabase } = useContext(SupabaseContext)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state || Object.keys(state).length === 0 ) {
      navigate('/', { replace: true })
    }
  }, [state, navigate])

  const {
    accessCode,
    expiryDate,
    clipboardName,
    clips
  } = state ?? {}

  const { refetch: deleteCurrentBoard, data, isLoading: deleteBoardLoading, error: deleteBoardError } = useQuery({
    queryKey: [QUERY_KEYS.DELETE_BOARD, accessCode],
    queryFn: async () => await supabase.from(BOARDS_RELATION).delete().eq(ACCESS_CODE_POSTGRES, accessCode),
    enabled: false
  })

  useEffect(() => {
    if (data?.status === 204 && !data.error && !deleteBoardError && !deleteBoardLoading) {
      navigate('/')
    }
  }, [data, deleteBoardLoading, deleteBoardError, navigate])

  const selfDestructDate = new Date(expiryDate)
  const shareableLink = createShareableLink(accessCode)

  const onClickCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareableLink).then(() => {
        toast({
          description: 'Text copied to clipboard'
        })
      })
    } catch (e) {
      toast({
        title: 'Failed to copy text',
        description: (e as Error).message,
      })
    }
  }

  const onClickBackButton = () => {
    navigate('/')
  }

  const onClickDeleteNow = () => {
    deleteCurrentBoard()
  }

  return (
    <div className="h-screen font-serif">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col p-9 justify-between align-center bg-black text-white font-serif" defaultSize={21} minSize={21} maxSize={31}>
          <div className="flex justify-between align-center text-4xl">
            <RxArrowLeft onClick={onClickBackButton} className="cursor-pointer"/>
            <p className="font-semibold">CtrlV</p>
          </div>
          <div className="flex flex-col align-center font-semibold">
            <p className="my-3 text-xl text-neutral-400 text-center">{clipboardName}</p>
            <div className="grid grid-cols-2 gap-3 gap-y-10 text-center text-sm mt-20 mb-10">
              <label htmlFor="uniqueBoardCode" className="text-neutral-500">Unique Board Code:</label>
              <p id="uniqueBoardCode">{accessCode}</p>
              <label htmlFor="lastDate" className="text-neutral-500">Self-Destruct Date:</label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p id="lastDate" className="text-expiry-red underline decoration-dotted text-center">{selfDestructDate.toDateString()}</p>
                </HoverCardTrigger>
                <HoverCardContent className="bg-black text-white text-base p-0 w-44 text-center cursor-pointer">
                  <p className="px-1 py-2 rounded-t-md hover:bg-gray-800" onClick={onClickDeleteNow}>Delete Now</p>
                  <Separator />
                  <p className="px-1 py-2 rounded-b-md hover:bg-gray-800">Extend Date</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white text-xl font-semibold p-2">
                <RxShare1 className="mr-4" />
                <span className="mt-1">Share board</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="font-serif max-w-3xl">
              <DialogHeader>
                <DialogTitle>Share board</DialogTitle>
                <section className="flex justify-between items-start">
                  <div className="flex flex-col justify-between w-3/5 h-full">
                    <div className="flex items-center py-2">
                      <Input type="text" disabled className="p-2 mr-2 rounded-sm w-full text-start cursor-text" defaultValue={shareableLink} />
                      <Button variant="outline" size="icon" className="rounded-sm" onClick={onClickCopyLink}>
                        <RxCopy />
                      </Button>
                    </div>
                    <div className="pt-2 mb-8 flex flex-col items-center justify-between">
                      <p className="text-slate-700 font-semibold pb-2">Access Code:</p>
                      <span className="text-5xl font-bold text-green-900 tracking-wider">{accessCode}</span>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="mx-2"/>
                  <div className="p-3 mx-auto bg-gray-200/70 rounded-sm border-slate-300 border-2">
                    <QRCodeCanvas value={shareableLink} size={210}/>
                    <p className="pt-4 text-center text-slate-700">Scan QR code</p>
                  </div>
                </section>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-9">
          <section>
            <p className="font-bold text-4xl">Saved Clips</p>
          </section>
          <section className="overflow-y-auto overscroll-auto h-full">
            <ClipsArea clips={clips}/>
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export { OverviewScreen }
