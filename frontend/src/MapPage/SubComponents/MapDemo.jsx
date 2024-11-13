import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import Mapbutton from "./Mapbutton.jsx";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow
});



const BasicMap = () => {
    return (
        <div className="w-screen h-screen bg-slate-800 flex justify-center items-center">
            <div className="h-3/4 w-3/4 bg-slate-700 flex flex-row gap-2">
                <div className="h-full w-1/5 bg-slate-600 flex flex-col gap-2 p-4 justify-center items-center">
                    <Mapbutton>Add Poi</Mapbutton>
                    <Mapbutton>Add Poi</Mapbutton>
                    <Mapbutton >Add Poi</Mapbutton>
                    <Mapbutton >Add Poi</Mapbutton>
                </div>
                <div className={'w-4/5'}>
                    <MapContainer style={{height:'100%'}} center={[51.505, -0.09]} zoom={13} >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[51.505, -0.09]}>
                            <Popup>
                                <b>Hello!</b><br />This is London.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default BasicMap;
