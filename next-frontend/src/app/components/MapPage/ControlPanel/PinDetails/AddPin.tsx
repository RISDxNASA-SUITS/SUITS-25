import {Poi, PoiStore} from "@/app/hooks/PoiStore";
import {SecondaryButton} from "@/app/components/MapPage/ControlPanel/PinDetails/SecondaryButton";
import mapboxgl from "mapbox-gl";
import MapButton from "@/app/components/MapPage/Map/MapButton";

type AddPinProps = {
    pin: Poi;
    onClose: () => void;
}

export const AddPin = ({pin, onClose}: AddPinProps) => {
    const {selectedPoiId, selectPoi} = PoiStore();

    const handleClose = () => {
        selectPoi(null);
        onClose();
    }


    return (
        <div className={"flex flex-col justify-between h-full"}>
            <div className={"flex flex-col gap-10"}>
                {/*Header*/}
                <div className={"flex items-center justify-between"}>
                    <div className={"flex text-2xl font-medium gap-2 items-center"}>
                        <button className={"underline"}>Edit</button>
                        <p>{pin.name}</p>
                        <p className={"text-sm"}>({pin.coords.lat.toFixed(4)}, {pin.coords.lng.toFixed(4)})</p>
                    </div>
                    <div className={"flex items-center"}>
                        <button onClick={handleClose}><img src={"/logo/close.svg"} alt={"close"}/></button>
                    </div>
                </div>

                {/*Tag*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Tags</p>
                    <SecondaryButton logo={"/logo/add.svg"}>Tag</SecondaryButton>
                </div>

                {/*Voice Notes*/}
                <div className={"flex flex-col gap-4"}>
                    <p className={"text-2xl font-bold"}>Voice Notes</p>
                    <SecondaryButton logo={"/logo/add.svg"}>Voice Note</SecondaryButton>
                </div>
            </div>

            {/*Buttons*/}
            <div className={"flex justify-between gap-4"}>
                <SecondaryButton logo={"/logo/delete.svg"}>Close</SecondaryButton>
                <MapButton logo={"/logo/checkmark.svg"}>Save Pin</MapButton>
            </div>
        </div>
    )
}

export default AddPin