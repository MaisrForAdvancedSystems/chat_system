import { createControlComponent } from'../core'
import { Control } from 'leaflet'

export type AttributionControlProps = Control.AttributionOptions

export const AttributionControl = createControlComponent<
  Control.Attribution,
  AttributionControlProps
>(function createAttributionControl(props) {
  return new Control.Attribution(props)
})
