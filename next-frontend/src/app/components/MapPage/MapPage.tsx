import BasicMap from "./SubComponents/MapDemo";

type MapPageProps = {
    roverCoords: {x: number, y: number}
}
export const MapPage = ({roverCoords}: MapPageProps)=>{
    return (
            <BasicMap roverCoords={roverCoords}/>
    )
}