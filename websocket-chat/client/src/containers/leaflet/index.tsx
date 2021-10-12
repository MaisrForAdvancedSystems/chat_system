import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LeafletProvider,
  CONTEXT_VERSION,
  LeafletContextInterface,
} from "../../react-leaflet/core";
import { LatLng, Map } from "leaflet";

export const LeafletContainer: React.FC<any> = ({ children }) => {
  const [map, _setMap] = useState<Map>();
  useEffect(() => {
    console.log(`mount leaflet container`);
    return () => {
      console.log(`mount leaflet container`);
    };
  }, []);
  const getMap = useCallback(() => {
    return map;
  }, [map]);
  const goToMylocation=useCallback(()=>{
    if(map){
      console.log("goToMylocation");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p)=>{
          let lc:LatLng=new LatLng(p.coords.latitude,p.coords.longitude,p.coords.accuracy);
          map.flyTo(lc,18,{})
        });
      }
    }
  },[map])
  const setMap = useCallback((m:Map|undefined) => {
    console.log("setting map");
    return _setMap(m);
  }, [_setMap]);
  const context = useMemo<LeafletContextInterface | null>(() => {
    return {
      __version: CONTEXT_VERSION,
      map: map,
      setMap: setMap,
      getMap: getMap,
      goToMylocation
    };
  }, [map, getMap, setMap]);

  console.log({ context });

  return <LeafletProvider value={context}>{children}</LeafletProvider>;
};
