
export type JunctionObject = {
  junction_id: number
  count_ns: number
  count_ew: number
  last_updated: string
  longitude: number
  latitude: number
}

export enum MeterStatusText {
  Available = 'available',
  Occupied = 'occupied',
  'Out Of Service' = 'out-of-service',
  Unknown = 'unknown'
}

export type MeterObject = {
  latitude: number
  longitude: number,
  address: string,
  meter_id: number,
  last_updated: string,
  status_text: MeterStatusText
}
