import { HeaderComponent } from "@/components/library/HeaderComponent"
import React from "react"

const Home: React.FC = () => {
  return (
    <div className="font-serif">
      <HeaderComponent />
      <div className="flex flex-col gap-16 p-16 max-w-5xl font-semibold text-5xl">
        <p>{'Create anywhere-available clipboards in seconds for increased productivity across teams.'}</p>
        <p className="text-success-green">{'For free!'}</p>
      </div>
    </div>
  )
}

export { Home }