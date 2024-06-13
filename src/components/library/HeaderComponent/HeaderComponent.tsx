import { InputField } from "@/components/library/Input"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogTrigger,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface IHeaderComponent {
  newBoardName?: string
  setExistingBoardCode: React.Dispatch<React.SetStateAction<string | undefined>>
  setNewBoardName: React.Dispatch<React.SetStateAction<string | undefined>>
  createBoardFunction: () => void
  existingBoardCode?: string
}
const HeaderComponent: React.FC<IHeaderComponent> = ({ newBoardName, setNewBoardName, setExistingBoardCode, existingBoardCode, createBoardFunction }: IHeaderComponent) => {


  async function onKeyPressHandler (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setExistingBoardCode(e.currentTarget.value)
    }
  }
  function onCreateBoardClick () {
    createBoardFunction()
  }

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-solid sticky border-b-black p-4 md:px-16 md:py-9 font-serif text-3xl md:text-4xl">
      <p className="font-semibold pb-2 sm:pb-0">{`CtrlV`}</p>
      <div className="flex flex-row justify-between w-full sm:w-fit sm:gap-6 text-xl items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-semibold p-6 h-14 rounded-2xl" onClick={() => setNewBoardName('')}>
              {'Create a Board'}
            </Button>
          </DialogTrigger>
            <DialogContent className="font-serif max-w-sm sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Name please...</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 items-center my-3">
                <Label htmlFor="clipboard-name" className="text-left">
                  Clipboard Name:
                </Label>
                <InputField
                  id="clipboard-name"
                  maxLength={200}
                  onChange={(e) => setNewBoardName(e.target.value)}
                />
            </div>
            <DialogFooter>
              <Button type="submit" className="p-6 h-14 rounded-2xl font-semibold" onClick={onCreateBoardClick} disabled={!newBoardName}>Create</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
          <InputField className="w-52 h-14" placeholder="Enter board code" defaultValue={existingBoardCode} onKeyDown={onKeyPressHandler}/>
        </div>
    </header>
  )
}

export { HeaderComponent }