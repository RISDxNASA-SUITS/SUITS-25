import React from 'react'

interface NotePreviewProps {
    title:string,
    date:string,
}

const NotePreview:React.FC<NotePreviewProps> = ({title,date}) => {

  return (
    <div className="py- pl-4 w-full flex justify-between items-center border-l-4 border-white">
        <div className="flex gap-4 w-fit items-center">
            <img src="/logo/sound2.svg" className="w-5 h-5"></img>
            <div className="flex flex-col gap-0">
                <h1 className="text-lg">
                    {title}
                </h1>
                <p className="text-xs text-white/50">
                    {date}
                </p>
            </div>
        </div>
        <div className="flex gap-2 items-center w-fit">
            <button>
                <img src="/logo/redo.svg" className="w-5 h-5"></img>
            </button>
            <button>
                <img src="/logo/delete_white.svg" className="w-5 h-5"></img>
            </button>
        </div>
    </div>
  )
}

export default NotePreview