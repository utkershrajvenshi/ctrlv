import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { RxArrowLeft } from "react-icons/rx";
import { RxShare1 } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const OverviewScreen = () => {
  const { state: {
    accessCode,
    expiryDate,
    clipboardName
  } } = useLocation()

  const selfDestructDate = new Date(expiryDate)

  return (
    <div className="h-screen font-serif">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col p-9 justify-between align-center bg-black text-white font-serif" defaultSize={21} minSize={21} maxSize={31}>
          <div className="flex justify-between align-center text-4xl">
            <RxArrowLeft />
            <p className="font-semibold">CtrlV</p>
          </div>
          <div className="flex flex-col align-center font-semibold">
            <p className="my-3 text-xl text-neutral-400 text-center">{clipboardName}</p>
            <div className="grid grid-cols-2 gap-3 gap-y-10 text-center text-sm mt-20 mb-10">
              <label htmlFor="uniqueBoardCode" className="text-neutral-500">Unique Board Code:</label>
              <p id="uniqueBoardCode">{accessCode}</p>
              <label htmlFor="lastDate" className="text-neutral-500">Self-Destruct Date:</label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p id="lastDate" className="text-expiry-red underline decoration-dotted text-center">{selfDestructDate.toDateString()}</p>
                </HoverCardTrigger>
                <HoverCardContent className="bg-black text-white text-base p-0 w-44 text-center cursor-pointer">
                  <p className="px-1 py-2 rounded-t-md hover:bg-gray-800">Delete Now</p>
                  <Separator />
                  <p className="px-1 py-2 rounded-b-md hover:bg-gray-800">Extend Date</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <Button variant="ghost" className="text-white text-2xl font-semibold p-3">
            <RxShare1 className="mr-4" />
            Share board
          </Button>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-9">
          <div>
            <p className="font-bold text-4xl">Saved Clips</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export { OverviewScreen }
