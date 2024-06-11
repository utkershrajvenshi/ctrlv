import { HeaderComponent } from "@/components/library/HeaderComponent"
import { Button } from "@/components/ui/button"
import {
  ACCESS_CODE_POSTGRES, BOARDS_RELATION, CLIPBOARD_NAME_POSTGRES, CLIPS_POSTGRES, EXPIRY_DATE_POSTGRES, QUERY_KEYS, SupabaseContext
} from "@/context"
import { skipToken, useQueries } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { LoadingSpinner } from "@/components/library/LoadingSpinner"
import { useLocation, useNavigate } from "react-router-dom"
import { PostgrestError } from "@supabase/supabase-js"
import { QueryType, accessCodeValidationRegex, generateAccessCode } from "@/lib/utils"

interface IBoardData {
  access_code: string
  created_at: string
  expiry_date: string
  clipboard_name: string
  clips: string[] | null
}

const Home: React.FC = () => {
  const { supabase } = useContext(SupabaseContext)
  const [newBoardName, setNewBoardName] = useState<string>()
  const [createBoardQueryParams, setCreateBoardQueryParams] = useState<Record<string, string>>()
  const [existingBoardCode, setExistingBoardCode] = useState<string>()
  const navigate = useNavigate()
  const location = useLocation()

  const [fetchExistingQueryResult, createBoardQueryResult] = useQueries({
    queries: [
      {
        queryKey: [QUERY_KEYS.FETCH_EXISTING, existingBoardCode],
        queryFn: existingBoardCode ? async () => await supabase.from(BOARDS_RELATION).select().eq(ACCESS_CODE_POSTGRES, existingBoardCode).single() : skipToken,
      },
      {
        queryKey: [QUERY_KEYS.CREATE_BOARD, createBoardQueryParams],
        queryFn: async () => await supabase.from(BOARDS_RELATION).insert({ ...createBoardQueryParams }).select().single(),
        enabled: false
      }
    ]
  })

  const { data, isLoading } = fetchExistingQueryResult
  const {
    data: createBoardData,
    error: createBoardError,
    isLoading: createBoardIsLoading,
    refetch: createNewBoard
  } = createBoardQueryResult

  function onGoogleLogin() {}

  const createBoard = () => {
    if (newBoardName) {
      setCreateBoardQueryParams({
        [CLIPBOARD_NAME_POSTGRES]: newBoardName,
        [ACCESS_CODE_POSTGRES]: generateAccessCode()
      })
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
        data: { access_code, expiry_date, clipboard_name, clips }
      } = createBoardData as QueryType<IBoardData>
      navigate('/overview', { state: {
        accessCode: access_code,
        clipboardName: clipboard_name,
        expiryDate: expiry_date,
        clips: clips,
      } })
    } else if (createBoardData?.error || createBoardError) {
      // Here show a shadcn popup with error
      // For now just a console log
      console.log(createBoardError?.message || createBoardData?.error?.message, '\nError creating new board')
    }
  }, [createBoardData, createBoardError, createBoardIsLoading, navigate])
  useEffect(() => {
    // Check data to contain error and data
    if (data) {
      const { data: apiData, error } = data as { data: Record<string, unknown>, error: PostgrestError }
      if (error) {
        // Here show a shadcn popup with error
        // For now just a console log
        console.log(error.message, `\nError looking up ${existingBoardCode}`)
      }
      if (apiData) {
        navigate('/overview', { state: {
          accessCode: apiData[ACCESS_CODE_POSTGRES],
          clipboardName: apiData[CLIPBOARD_NAME_POSTGRES],
          expiryDate: apiData[EXPIRY_DATE_POSTGRES],
          clips: apiData[CLIPS_POSTGRES],
        } })
      }
    }
  }, [data, existingBoardCode, navigate])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const searchedAccessCode = searchParams.get('code')
    // TODO: Here also check if the code is valid, if not valid then show an error on this page itself
    if (searchedAccessCode && searchedAccessCode.match(accessCodeValidationRegex)) {
      setExistingBoardCode(searchedAccessCode)
    }
  }, [location])

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
      />
      <div className="flex gap-16 p-16 w-full">
        <div className="flex flex-col w-3/5 gap-16 font-bold text-5xl">
          <p>{'Create anywhere-available clipboards in seconds for increased productivity across teams.'}</p>
          <p className="text-success-green">{'For free!'}</p>
        </div>
        <div className="w-2/5 flex flex-col justify-center h-44">
          <Button variant="secondary" size="lg" className="mx-auto font-semibold text-lg" onClick={onGoogleLogin}>
            <FcGoogle className="mr-2 h-7 w-7"/> Login with Google
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Home }