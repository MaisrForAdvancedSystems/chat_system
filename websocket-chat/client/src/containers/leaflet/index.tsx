import { useCallback, useMemo, useState } from "react";
import {
  LeafletProvider,
  CONTEXT_VERSION,
  LeafletContextInterface,
} from "../../react-leaflet/core";
import { Map } from "leaflet";

export const LeafletContainer: React.FC<any> = ({ children }) => {
  const [map, setMap] = useState<Map>();
  const context = useMemo<LeafletContextInterface | null>(
    () =>
      map
        ? {
            __version: CONTEXT_VERSION,
            map: map,
            setMap: setMap,
            getMap: getMap,
          }
        : null,
    [map]
  );
  const getMap = useCallback(() => {
    return map;
  }, [map]);

  return <LeafletProvider value={context}>{children}</LeafletProvider>;
};
