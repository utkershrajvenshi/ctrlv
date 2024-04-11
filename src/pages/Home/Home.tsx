import React from "react"
import { Input } from "@/components/ui/input"

import { Button } from '@chakra-ui/react'
import { HeaderWrapper } from "./Home.styles"

const HeaderComponent: React.FC = () => {
  return (
    <HeaderWrapper>
      {`CtrlV`}
      <Button color="black" variant='outline'></Button>
      <Input />
    </HeaderWrapper>
  )
}

export { HeaderComponent }