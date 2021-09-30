import { createPathComponent, updateCircle } from'../core'
import type { CircleMarkerProps } from'../core'
import { CircleMarker as LeafletCircleMarker } from 'leaflet'

export type { CircleMarkerProps } from'../core'

export const CircleMarker = createPathComponent<
  LeafletCircleMarker,
  CircleMarkerProps
>(function createCircleMarker({ center, children: _c, ...options }, ctx) {
  const instance = new LeafletCircleMarker(center, options)
  return { instance, context: { ...ctx, overlayContainer: instance } }
}, updateCircle)
