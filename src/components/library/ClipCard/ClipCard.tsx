import React from "react"
import { RiAttachment2 } from "react-icons/ri";

interface IClipCard {
  title?: string
  description?: string
  timestamp: string
  attachmentsCount?: number
}

function parseDateTimestamp(timestamp: string) {
  if (!timestamp) return null
  // TODO: Could need to work on localised timestamps here. Currently only system time is being considered
  const dateObject = new Date(timestamp)
  const date = dateObject.toDateString()
  const hour = dateObject.getHours()
  const hourString = hour < 10 ? '0' + hour : hour.toString()
  const minutes = dateObject.getMinutes()
  const minutesString = minutes < 10 ? '0' + minutes : minutes.toString()
  const timeString = hourString + ':' + minutesString
  return timeString + ', ' + date
}
const ClipCard: React.FC<IClipCard> = ({ title, description, timestamp, attachmentsCount }: IClipCard) => {
  return (
    <div>
      <div className="flex flex-col w-1/4 gap-2 border rounded-lg p-4 z-10 shadow-lg">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold truncate">{title}</p>
          <p className="text-sm text-slate-500 max-h-60 line-clamp-12 break-words">{description}</p>
        </div>
        <div className="flex justify-between items-center gap-2 text-xs">
          <div className="flex flex-row items-center justify-center w-10 h-10">
            <RiAttachment2 />
            {attachmentsCount}
          </div>
          <p className="text-slate-500">{parseDateTimestamp(timestamp)}</p>
        </div>
      </div>
    </div>
  )
}

export { ClipCard }
export type { IClipCard }
