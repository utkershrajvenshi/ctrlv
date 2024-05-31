import { HeaderComponent } from "@/components/library/HeaderComponent"
import { Button } from "@/components/ui/button"
import {
  ACCESS_CODE_POSTGRES, BOARDS_RELATION, CLIPBOARD_NAME_POSTGRES, CLIPS_POSTGRES, EXPIRY_DATE_POSTGRES, QUERY_KEYS, SupabaseContext
} from "@/context"
import { skipToken, useQuery } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { LoadingSpinner } from "@/components/library/LoadingSpinner"
import { useNavigate } from "react-router-dom"

const Home: React.FC = () => {
  const { supabase } = useContext(SupabaseContext)
  const [newBoardCode, setNewBoardCode] = useState<string>()
  const [existingBoardCode, setExistingBoardCode] = useState<string>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_EXISTING, existingBoardCode],
    queryFn: existingBoardCode ? async () => await supabase.from(BOARDS_RELATION).select().eq(ACCESS_CODE_POSTGRES, existingBoardCode).single() : skipToken,
  })

  function onGoogleLogin() {}

  useEffect(() => {
    // Check data to contain error and data
    if (data) {
      const { data: apiData, error } = data
      if (error) {
        // Here show a shadcn popup with error
        // For now just a console log
        console.log(error.message, `\nError looking up ${existingBoardCode}`)
      }
      if (apiData) {
        navigate('/overview', { state: {
          accessCode: apiData[ACCESS_CODE_POSTGRES],
          boardName: apiData[CLIPBOARD_NAME_POSTGRES],
          expiryDate: apiData[EXPIRY_DATE_POSTGRES],
          clips: apiData[CLIPS_POSTGRES],
        } })
      }
    }
  }, [data, existingBoardCode, navigate])

  if (isLoading) {
    return <LoadingSpinner size={64} />
  }

  return (
    <div className="font-serif">
      <HeaderComponent
        newBoardCode={newBoardCode}
        setNewBoardCode={setNewBoardCode}
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