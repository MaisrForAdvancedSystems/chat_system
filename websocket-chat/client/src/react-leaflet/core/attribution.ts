import { Map } from 'leaflet'
import { useEffect, useRef } from 'react'

export function useAttribution(
  map: Map|undefined,
  attribution: string | null | undefined,
) {
  const attributionRef = useRef(attribution)

  useEffect(
    function updateAttribution() {
      if(!map){
        console.log("map not defined")
        return;
      }
      if (
        attribution !== attributionRef.current &&
        map.attributionControl != null
      ) {
        if (attributionRef.current != null) {
          map.attributionControl.removeAttribution(attributionRef.current)
        }
        if (attribution != null) {
          map.attributionControl.addAttribution(attribution)
        }
      }
      attributionRef.current = attribution
    },
    [map, attribution],
  )
}
