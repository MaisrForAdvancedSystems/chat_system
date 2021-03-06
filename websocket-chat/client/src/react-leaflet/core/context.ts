import { Control, Layer, LayerGroup, Map } from 'leaflet'
import { createContext, useContext } from 'react'

export const CONTEXT_VERSION = 1

export interface ControlledLayer {
  addLayer(layer: Layer): void
  removeLayer(layer: Layer): void
}

export interface LeafletContextInterface {
  __version: number
  map: Map|undefined
  layerContainer?: ControlledLayer | LayerGroup
  layersControl?: Control.Layers
  overlayContainer?: Layer
  pane?: string,
  setMap:(m:Map|undefined)=>void,
  getMap:()=>Map|undefined,
  goToMylocation:()=>void
}

export const LeafletContext = createContext<LeafletContextInterface | null>(
  null,
)

export const LeafletProvider = LeafletContext.Provider

export function useLeafletContext(): LeafletContextInterface {
  const context = useContext(LeafletContext)
  if (context == null) {
    throw new Error(
      'No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>',
    )
  }
  return context
}
