
export default function VideoPanel({video, name}: {video: string, name: string}) {
    return (
        <div className="basis-2/5 flex flex-col gap-4 h-full p-4">
            <div className="text-bold text-2xl">{name}</div>
            
            <video className="bg-white rounded-large h-full w-full" src={video} autoPlay muted loop />
            
        </div>
    )
}