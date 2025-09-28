import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownEditor } from "@/components/library/MarkdownEditor";
import { MarkdownViewer } from "@/components/library/MarkdownViewer";
import { ATTACHMENTS_BUCKET_NAME, CLIPS_RELATION, QUERY_KEYS, SupabaseContext } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid"
import React, { useContext, useEffect, useRef, useState } from "react"
import { RiAttachment2, RiDeleteBin2Fill, RiDownload2Line } from "react-icons/ri";
import { RxCrossCircled, RxPlusCircled } from "react-icons/rx";
import { LoadingSpinner } from "../LoadingSpinner";
import { useLocation } from "react-router-dom";
import { PostgrestError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { getFileUploadPathName } from "@/lib/utils";

interface IClipCard {
  title?: string
  description?: string
  timestamp?: string
  attachmentsCount?: number
  error?: Error | PostgrestError | null
  isLoading?: boolean
  clipId?: string
  attachmentPath?: string
  attachmentName?: string
  canEdit?: boolean
}

interface ICreateClip {
  id: string
  created_at: Date
  text_content?: string
  attachment_path?: string
  attachment_name?: string
  belongs_to: string
}

function parseDateTimestamp(timestamp: string | undefined) {
  if (!timestamp) return null
  const dateObject = new Date(timestamp)
  const hour = dateObject.getHours()
  const hourString = hour < 10 ? '0' + hour : hour.toString()
  const minutes = dateObject.getMinutes()
  const minutesString = minutes < 10 ? '0' + minutes : minutes.toString()
  const timeString = hourString + ':' + minutesString
  return timeString + ', ' + dateObject.toDateString()
}

export const AddNewClip = () => {
  const [textContent, setTextContent] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const { state } = useLocation()
  const { toast } = useToast()
  const [queryParams, setQueryParams] = useState<ICreateClip>()
  const [uploadedFile, setUploadedFile] = useState<File>()
  const [isUploading, setIsUploading] = useState(false)
  const { supabase } = useContext(SupabaseContext)

  const { data: createClipData, isLoading: createClipLoading, refetch: createNewClip, error: createClipError } = useQuery({
    queryKey: [QUERY_KEYS.CREATE_CLIP, queryParams],
    queryFn: async () => await supabase.from(CLIPS_RELATION).insert({ ...queryParams }).select(),
    enabled: false
  })

  const onFileUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (uploadedFiles && uploadedFiles.length > 0) {
      const file = uploadedFiles[0]
      // Check file size (1MB limit)
      if (file.size > 1 * 1024 * 1024) {
        toast({
          title: 'File upload error',
          description: 'File size exceeds 1MB limit',
          variant: 'destructive'
        })
        return
      }
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onClickCreateClip = async () => {
    if (!state?.accessCode) {
      toast({
        title: 'Error',
        description: 'No access code found',
        variant: 'destructive'
      })
      return
    }

    const trimmedContent = textContent.trim()
    
    if (!trimmedContent && !uploadedFile) {
      toast({
        title: 'Error',
        description: 'Please add some text or upload a file',
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    const uniqueId = uuidv4()
    let attachmentPath = ''
    let attachmentName = ''

    try {
      // Upload file if exists
      if (uploadedFile) {
        const filePath = getFileUploadPathName(uploadedFile, state.accessCode)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(ATTACHMENTS_BUCKET_NAME)
          .upload(filePath, uploadedFile, {
            upsert: true
          })

        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`)
        }

        attachmentPath = uploadData.path
        attachmentName = uploadedFile.name
      }

      // Create clip record
      const clipData: ICreateClip = {
        id: uniqueId,
        created_at: new Date(),
        belongs_to: state.accessCode,
        ...(trimmedContent && { text_content: trimmedContent }),
        ...(attachmentPath && { 
          attachment_path: attachmentPath,
          attachment_name: attachmentName 
        })
      }

      setQueryParams(clipData)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (queryParams) {
      createNewClip()
    }
  }, [queryParams, createNewClip])

  useEffect(() => {
    if (createClipData?.data && !createClipData.error && !createClipError) {
      toast({
        description: 'Clip created successfully'
      })
      setTextContent('')
      setUploadedFile(undefined)
      setQueryParams(undefined)
      if (fileInputRef.current) fileInputRef.current.value = ''
      dialogCloseRef.current?.click()
    } else if (createClipData?.error || createClipError) {
      toast({
        title: 'Error',
        description: 'Could not create clip. Error: ' + (createClipError?.message || createClipData?.error?.message),
        variant: 'destructive'
      })
    }
    setIsUploading(false)
  }, [createClipData, createClipError, toast])

  if (createClipLoading || isUploading) {
    return <LoadingSpinner />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center w-32 mobile-medium:w-44 md:w-72 h-64 text-xs md:text-sm bg-yellow-100 gap-2 border rounded-lg p-4 z-10 shadow-lg text-slate-700 cursor-pointer hover:bg-yellow-200 transition-colors">
          <RxPlusCircled className="h-4 md:h-6 w-4 md:w-6"/>
          {"Add a Clip"}
        </div>
      </DialogTrigger>
      <DialogContent className="font-serif max-w-sm sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new clip</DialogTitle>
          <section className="user-entered-area">
            <div className="mt-4">
              <MarkdownEditor
                value={textContent}
                onChange={setTextContent}
                placeholder="Start typing... Use markdown for rich formatting"
                maxLength={2000}
                showPreview={true}
                className="min-h-[250px]"
              />
            </div>
            
            <section className="mt-4 attachments-section">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Attachment (max 1MB)</label>
                {uploadedFile && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={removeFile}
                    className="text-xs"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              {!uploadedFile ? (
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*,application/pdf,.txt,.doc,.docx" 
                  className="rounded-sm p-2 bg-inherit cursor-pointer" 
                  onChange={onFileUpdated} 
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <RiAttachment2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 flex-1 truncate">
                    {uploadedFile.name}
                  </span>
                  <span className="text-xs text-green-600">
                    ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </section>
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                className="font-semibold px-6 py-3 h-12 rounded-2xl" 
                onClick={onClickCreateClip}
                disabled={isUploading}
              >
                {isUploading ? 'Creating...' : 'Create'}
              </Button>
              <DialogClose ref={dialogCloseRef} className="hidden" />
            </div>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

const ClipCard: React.FC<IClipCard> = ({ 
  title, 
  description, 
  timestamp, 
  attachmentsCount, 
  error, 
  isLoading, 
  clipId,
  attachmentPath,
  attachmentName,
  canEdit = true
}: IClipCard) => {  
  const dialogCloseRef = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()
  const { supabase } = useContext(SupabaseContext)
  const [isDownloading, setIsDownloading] = useState(false)

  const { refetch: deleteClip, data: deleteData, isLoading: deleteLoading, error: deleteError } = useQuery({
    queryKey: [QUERY_KEYS.DELETE_CLIP, clipId],
    queryFn: async () => {
      // First delete the file from storage if it exists
      if (attachmentPath) {
        await supabase.storage.from(ATTACHMENTS_BUCKET_NAME).remove([attachmentPath])
      }
      // Then delete the clip record
      return await supabase.from(CLIPS_RELATION).delete().eq('id', clipId)
    },
    enabled: false
  })

  useEffect(() => {
    if (deleteData?.status === 204 && !deleteData.error && !deleteError && !deleteLoading) {
      dialogCloseRef.current?.click()
      toast({
        description: 'Clip deleted successfully'
      })
    } else if (deleteData?.error || deleteError) {
      toast({
        title: 'Error deleting clip',
        description: deleteData?.error?.message || deleteError?.message,
        variant: 'destructive'
      })
    }
  }, [deleteData, deleteError, deleteLoading, toast])
  
  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-1">
        <Skeleton className="h-52 w-44 md:w-60 rounded-t-xl rounded-b-none" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-44 md:w-60 rounded-b-xl rounded-t-none" />
        </div>
      </div>
    )
  }

  // Show error message if encountered
  if (error) {
    return (
      <div className="flex justify-center items-center w-32 mobile-medium:w-44 md:w-72 h-72 bg-red-100 gap-2 border rounded-lg p-4 z-10 shadow-lg text-red-700">
        <RxCrossCircled className="h-6 w-6"/>
        {"Could not load clip"}
      </div>
    )
  }

  const onClickCopyClip = () => {
    if (description) {
      try {
        navigator.clipboard.writeText(description).then(() => {
          toast({
            description: 'Text copied to clipboard'
          })
        })
      } catch (e) {
        toast({
          title: 'Failed to copy text',
          description: (e as Error).message,
          variant: 'destructive'
        })
      }
    }
  }

  const onClickDeleteClip = () => {
    if (clipId) {
      deleteClip()
    }
  }

  const onDownloadAttachment = async () => {
    if (!attachmentPath || !attachmentName) return
    
    setIsDownloading(true)
    try {
      const { data, error } = await supabase.storage
        .from(ATTACHMENTS_BUCKET_NAME)
        .download(attachmentPath)
      
      if (error) {
        throw new Error(`Download failed: ${error.message}`)
      }

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = attachmentName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        description: 'File downloaded successfully'
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Create a plain text preview by removing markdown syntax
  const plainTextPreview = description?.replace(/[*_`~#[\]()]/g, '') || 'No text content'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col w-32 mobile-medium:w-44 md:w-72 gap-2 border rounded-lg p-4 z-10 shadow-lg cursor-pointer hover:shadow-md transition-shadow">
          <div className="flex flex-col gap-2">
            <p className="text-mmd mobile-medium:text-xs md:text-sm font-semibold truncate">{title || 'Untitled'}</p>
            <p className="text-mmd mobile-medium:text-xs md:text-sm text-slate-500 h-40 line-clamp-8 break-words">
              {plainTextPreview}
            </p>
          </div>
          <div className="flex justify-between items-center gap-2 text-mmd mobile-medium:text-xs">
            <div className="flex flex-row items-center justify-center w-10 h-10">
              {(attachmentsCount && attachmentsCount > 0) || attachmentPath ? (
                <>
                  <RiAttachment2 className="text-green-600" />
                  <span className="ml-1 text-green-600">1</span>
                </>
              ) : null}
            </div>
            <p className="text-slate-500 text-[9px] mobile-medium:text-[10px] md:text-sm">
              {parseDateTimestamp(timestamp)}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="font-serif max-w-sm sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{parseDateTimestamp(timestamp)}</DialogTitle>
          <section className="user-entered-area">
            {/* Rendered Markdown Content */}
            {description && (
              <div className="mt-4 border rounded-md p-4 bg-gray-50 max-h-96 overflow-y-auto">
                <MarkdownViewer content={description} />
              </div>
            )}
            
            {/* Attachment Display */}
            {attachmentPath && attachmentName && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <RiAttachment2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-blue-800 truncate">
                      {attachmentName}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownloadAttachment}
                    disabled={isDownloading}
                    className="ml-2 flex-shrink-0"
                  >
                    {isDownloading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    ) : (
                      <RiDownload2Line className="h-4 w-4" />
                    )}
                    <span className="ml-1 text-xs">
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </span>
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-6">
              {description && (
                <Button 
                  className="font-semibold px-6 py-3 h-12 rounded-2xl" 
                  onClick={onClickCopyClip}
                >
                  Copy text
                </Button>
              )}
              {canEdit ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onClickDeleteClip}
                  disabled={deleteLoading}
                  className="ml-auto"
                >
                  {deleteLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                  ) : (
                    <RiDeleteBin2Fill className="h-6 w-6"/>
                  )}
                </Button>
              ) : (
                <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                  Read-only
                </div>
              )}
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