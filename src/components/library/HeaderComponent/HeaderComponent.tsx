import { InputField } from "@/components/library/Input"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogTrigger,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const HeaderComponent: React.FC = () => {
  const [newBoardCode, setNewBoardCode] = useState<string>()

  function onKeyPressHandler (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      console.log(e.currentTarget.value)
    }
  }
  function onCreateBoardClick () {
    console.log({ newBoardCode })
  }

  return (
    <header className="flex flex-row justify-between items-center border-b-2 border-solid sticky border-b-black px-16 py-9 font-serif text-4xl">
      <p className="font-semibold">{`CtrlV`}</p>
      <div className="flex flex-row gap-6 text-xl items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-semibold p-6 h-14 rounded-2xl" onClick={() => setNewBoardCode('')}>
              {'Create a Board'}
            </Button>
          </DialogTrigger>
          <DialogContent className="font-serif">
            <DialogHeader>
              <DialogTitle>Name please...</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 items-center my-3">
              <Label htmlFor="clipboard-name" className="text-left">
                Clipboard Name:
              </Label>
              <InputField
                id="clipboard-name"
                onChange={(e) => setNewBoardCode(e.target.value)}
              />
          </div>
          <DialogFooter>
            <Button type="submit" className="p-6 h-14 rounded-2xl font-semibold" onClick={onCreateBoardClick} disabled={!!!newBoardCode}>Create</Button>
          </DialogFooter>
          </DialogContent>
        </Dialog>
        <InputField className="w-52 h-14" placeholder="Enter board code" onKeyDown={onKeyPressHandler}/>
      </div>
    </header>
  )
}

export { HeaderComponent }