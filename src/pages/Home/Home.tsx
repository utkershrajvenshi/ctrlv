import { HeaderComponent } from "@/components/library/HeaderComponent"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import React from "react"

const Home: React.FC = () => {

  function onGoogleLogin() {}
  return (
    <div className="font-serif">
      <HeaderComponent />
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