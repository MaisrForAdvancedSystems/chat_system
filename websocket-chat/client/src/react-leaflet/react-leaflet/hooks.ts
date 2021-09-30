import { useLeafletContext } from'../core'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'
import { useEffect } from 'react'

export function useMap(): Map|undefined {
  return useLeafletContext().map
}

export function useMapEvent<T extends keyof LeafletEventHandlerFnMap>(
  type: T,
  handler: LeafletEventHandlerFnMap[T],
): Map|undefined {
  const map = useMap()

  useEffect(
    function addMapEventHandler() {
      // @ts-ignore event type
      map.on(type, handler)

      return function removeMapEventHandler() {
        // @ts-ignore event type
        map.off(type, handler)
      }
    },
    [map, type, handler],
  )

  return map
}

export function useMapEvents(handlers: LeafletEventHandlerFnMap): Map|undefined {
  const map = useMap()

  useEffect(
    function addMapEventHandlers() {
      if(map){
        map.on(handlers)
      }

      return function removeMapEventHandlers() {
        if(map){
          map.off(handlers)
        }
      }
    },
    [map, handlers],
  )

  return map
}
