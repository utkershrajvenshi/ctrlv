import { InputField } from "@/components/library/Input"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogTrigger,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthModal, UserMenu } from "@/components/library/Auth"
import { User } from "@supabase/supabase-js"
import { useState } from "react"

interface IHeaderComponent {
  newBoardName?: string
  setExistingBoardCode: React.Dispatch<React.SetStateAction<string | undefined>>
  setNewBoardName: React.Dispatch<React.SetStateAction<string | undefined>>
  createBoardFunction: (isPrivate?: boolean) => void
  existingBoardCode?: string
  user?: User | null
  onAuthSuccess?: (user: User) => void
  onSignOut?: () => void
}

const HeaderComponent: React.FC<IHeaderComponent> = ({ 
  newBoardName, 
  setNewBoardName, 
  setExistingBoardCode, 
  existingBoardCode, 
  createBoardFunction,
  user,
  onAuthSuccess,
  onSignOut
}: IHeaderComponent) => {
  const [isPrivateBoard, setIsPrivateBoard] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  async function onKeyPressHandler (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setExistingBoardCode(e.currentTarget.value)
    }
  }

  function onCreateBoardClick () {
    createBoardFunction(isPrivateBoard)
    setIsCreateDialogOpen(false)
    setIsPrivateBoard(false) // Reset after creation
  }

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-solid sticky border-b-black p-4 md:px-16 md:py-9 font-serif text-3xl md:text-4xl">
      <p className="font-semibold pb-2 sm:pb-0">{`CtrlV`}</p>
      
      <div className="flex flex-row justify-between items-center w-full sm:w-fit gap-2 sm:gap-6 text-xl">
        {/* Authentication Section */}
        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu user={user} onSignOut={onSignOut!} />
          ) : (
            <AuthModal onAuthSuccess={onAuthSuccess} />
          )}
        </div>

        {/* Create Board Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="font-semibold p-3 mobile-medium:p-6 h-14 rounded-2xl" 
              onClick={() => {
                setNewBoardName('')
                setIsPrivateBoard(false)
              }}
            >
              {'Create a Board'}
            </Button>
          </DialogTrigger>
          <DialogContent className="font-serif max-w-sm sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a new board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-3">
              <div className="grid grid-cols-2 items-center">
                <Label htmlFor="clipboard-name" className="text-left">
                  Board Name:
                </Label>
                <InputField
                  id="clipboard-name"
                  maxLength={50}
                  placeholder="Enter board name"
                  onChange={(e) => setNewBoardName(e.target.value)}
                />
              </div>
              
              {/* Privacy Setting - only show if user is authenticated */}
              {user && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="private-board"
                    checked={isPrivateBoard}
                    onCheckedChange={(checked) => setIsPrivateBoard(checked as boolean)}
                  />
                  <Label htmlFor="private-board" className="text-sm">
                    Make this board private (only visible to you)
                  </Label>
                </div>
              )}
              
              {isPrivateBoard && (
                <p className="text-xs text-gray-500 mt-1">
                  Private boards can only be accessed by you. Public boards can be accessed by anyone with the board code.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="p-6 h-14 rounded-2xl font-semibold" 
                onClick={onCreateBoardClick} 
                disabled={!newBoardName}
              >
                Create {isPrivateBoard ? 'Private' : 'Public'} Board
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Access Existing Board */}
        <InputField 
          className="w-36 mobile-medium:w-52 text-xs mobile-medium:text-sm px-2 mobile-medium:px-7 h-14" 
          placeholder="Enter board code" 
          defaultValue={existingBoardCode} 
          onKeyDown={onKeyPressHandler}
        />
      </div>
    </header>
  )
}

export { HeaderComponent }