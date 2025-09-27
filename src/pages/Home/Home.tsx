import { HeaderComponent } from "@/components/library/HeaderComponent"
import {
  ACCESS_CODE_POSTGRES, BOARDS_RELATION, CLIPBOARD_NAME_POSTGRES, CLIPS_POSTGRES, EXPIRY_DATE_POSTGRES, QUERY_KEYS, SupabaseContext
} from "@/context"
import { skipToken, useQueries } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/library/LoadingSpinner"
import { useLocation, useNavigate } from "react-router-dom"
import { QueryType, accessCodeValidationRegex, generateAccessCode } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@supabase/supabase-js"

interface IBoardData {
  access_code: string
  created_at: string
  expiry_date: string
  clipboard_name: string
  clips: string[] | null
  owner_id?: string
  is_public?: boolean
  owner_email?: string
}

const Home: React.FC = () => {
  const { supabase } = useContext(SupabaseContext)
  const { toast } = useToast()
  const [newBoardName, setNewBoardName] = useState<string>()
  const [createBoardQueryParams, setCreateBoardQueryParams] = useState<Record<string, string | boolean | undefined>>()
  const [existingBoardCode, setExistingBoardCode] = useState<string>()
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Set up auth state listener
  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const [fetchExistingQueryResult, createBoardQueryResult] = useQueries({
    queries: [
      {
        queryKey: [QUERY_KEYS.FETCH_EXISTING, existingBoardCode],
        queryFn: existingBoardCode ? async () => {
          const result = await supabase.from(BOARDS_RELATION)
            .select()
            .eq(ACCESS_CODE_POSTGRES, existingBoardCode)
            .single()
          
          // Check if the board exists and if user has access
          if (result.data && !result.error) {
            const board = result.data as IBoardData
            // If board is private and user doesn't own it, show error
            if (!board.is_public && board.owner_id !== user?.id) {
              throw new Error("You don't have access to this private board")
            }
          }
          
          return result
        } : skipToken,
      },
      {
        queryKey: [QUERY_KEYS.CREATE_BOARD, createBoardQueryParams],
        queryFn: async () => await supabase.from(BOARDS_RELATION).insert({ ...createBoardQueryParams }).select().single(),
        enabled: false
      }
    ]
  })

  const { data, isLoading, error } = fetchExistingQueryResult
  const {
    data: createBoardData,
    error: createBoardError,
    isLoading: createBoardIsLoading,
    refetch: createNewBoard
  } = createBoardQueryResult

  const createBoard = (isPrivate: boolean = false) => {
    if (newBoardName) {
      const boardData: Record<string, string | undefined | boolean> = {
        [CLIPBOARD_NAME_POSTGRES]: newBoardName,
        [ACCESS_CODE_POSTGRES]: generateAccessCode(),
        is_public: !isPrivate
      }
      
      // Add owner info if user is authenticated
      if (user) {
        boardData.owner_id = user.id
        boardData.owner_email = user.email
      }
      
      setCreateBoardQueryParams(boardData)
    }
  }

  useEffect(() => {
    if (createBoardQueryParams) {
      createNewBoard()
    }
  }, [createBoardQueryParams, createNewBoard])

  useEffect(() => {
    if (!createBoardIsLoading && !createBoardError && createBoardData?.data) {
      const {
        data: { access_code, expiry_date, clipboard_name, clips, owner_id, is_public, owner_email }
      } = createBoardData as QueryType<IBoardData>
      navigate('/overview', { state: {
        accessCode: access_code,
        clipboardName: clipboard_name,
        expiryDate: expiry_date,
        clips: clips,
        ownerId: owner_id,
        isPublic: is_public,
        ownerEmail: owner_email
      } })
    } else if (createBoardData?.error || createBoardError) {
      toast({
        title: 'Error creating new board',
        description: createBoardError?.message || createBoardData?.error?.message,
        variant: 'destructive'
      })
    }
  }, [createBoardData, createBoardError, createBoardIsLoading, navigate, toast])

  useEffect(() => {
    if (data) {
      const { data: apiData, error: apiError } = data
      if (apiError) {
        toast({
          title: `Cannot access board ${existingBoardCode}`,
          description: apiError.message,
          variant: 'destructive'
        })
      } else if (apiData) {
        navigate('/overview', { state: {
          accessCode: apiData[ACCESS_CODE_POSTGRES],
          clipboardName: apiData[CLIPBOARD_NAME_POSTGRES],
          expiryDate: apiData[EXPIRY_DATE_POSTGRES],
          clips: apiData[CLIPS_POSTGRES],
          ownerId: apiData.owner_id,
          isPublic: apiData.is_public,
          ownerEmail: apiData.owner_email
        } })
      }
    }
  }, [data, existingBoardCode, navigate, toast])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Access denied',
        description: error.message,
        variant: 'destructive'
      })
    }
  }, [error, toast])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const searchedAccessCode = searchParams.get('code')
    if (searchedAccessCode && searchedAccessCode.match(accessCodeValidationRegex)) {
      const validationMatch = searchedAccessCode.match(accessCodeValidationRegex)
      if (validationMatch) {
        setExistingBoardCode(searchedAccessCode)
      } else {
        toast({
          title: 'Invalid access code',
          description: 'The access code is not valid',
          variant: 'destructive'
        })
      }
    }
  }, [location, toast])

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser)
  }

  const handleSignOut = () => {
    setUser(null)
  }

  if (isLoading) {
    return <LoadingSpinner size={64} />
  }

  return (
    <div className="font-serif">
      <HeaderComponent
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        createBoardFunction={createBoard}
        setExistingBoardCode={setExistingBoardCode}
        existingBoardCode={existingBoardCode}
        user={user}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={handleSignOut}
      />
      <div className="flex gap-16 p-8 md:p-12 lg:p-16 w-full">
        <div className="flex flex-col w-full sm:w-3/5 gap-16 font-bold text-3xl md:text-4xl lg:text-5xl">
          <p>{'Create anywhere-available clipboards in seconds for increased productivity across teams.'}</p>
          <p className="text-success-green">{'For free!'}</p>
          {user && (
            <div className="text-lg md:text-xl text-gray-600">
              <p>Welcome back, <span className="text-black">{user.email}</span>!</p>
              <p className="text-sm md:text-base mt-2">
                Create private boards visible only to you, or public boards that anyone can access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { Home }