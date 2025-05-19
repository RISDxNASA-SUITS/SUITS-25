
import {MapPage} from "@/app/components/map-page/MapPage";


export default async function Page() {
    //TODO FETCH ROVER COORDS HERE (from backend)
    const callJava = async () => {
        return Promise.resolve({x: 0, y: 0})
    }
    const roverCoords = await callJava();
    return (
        <div>
            <MapPage roverCoords={roverCoords}/>
        </div>
    )
}