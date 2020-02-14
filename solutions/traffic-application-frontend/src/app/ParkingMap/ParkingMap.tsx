import * as React from 'react';
import { PageSection, Title, Switch } from '@patternfly/react-core';
import { GoogleMap } from '@app/GoogleMap/GoogleMap';
import { MeterObject, MeterStatusText } from '@app/ApiInterfaces/api-interfaces';

const MarkerClusterer = require('@google/markerclusterer')

type ParkingMapProps = {}
type ParkingMapState = {
  filters: {
    [value in MeterStatusText]: boolean
  }
}

class ParkingMap extends React.Component<ParkingMapProps, ParkingMapState> {
  private markers: google.maps.Marker[]|undefined
  private map: google.maps.Map|undefined
  private cluster: any

  constructor (props) {
    super(props)

    this.state = {
      filters: {
        [MeterStatusText.Available]:  true,
        [MeterStatusText.Occupied]:  false,
        [MeterStatusText['Out Of Service']]:  false,
        [MeterStatusText.Unknown]:  false
      }
    }
  }

  async renderMarkers () {
    if (!this.map) throw new Error('cannot render markers map not loaded')

    console.log('rendering parking meter markers')

    // Cleanup cluster and markers
    if (this.cluster) this.cluster.clearMarkers()
    if (this.markers) this.markers.forEach(m => m.setMap(null))

    const uri = new URL('/meters', process.env.API_URL)
    uri.searchParams.set('user_key', process.env.API_KEY || '')

    const response = await fetch(uri.toString())
    const meters = await response.json() as MeterObject[]

    this.markers = meters
      .filter(m => {
        return this.state.filters[m.status_text]
      })
      .map(m => {
        return new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(m.latitude, m.longitude)
        })
      })

    this.cluster = new MarkerClusterer(this.map, this.markers, {
      imagePath: '/images/m'
    })
  }

  async handleApiLoaded (map: google.maps.Map) {
    console.log('The map loaded on the ParkingMap page!')

    map.addListener('zoom_changed', () => {
      console.log(`Map is now zoomed to: ${map.getZoom()}`)
    })

    this.map = map
    this.renderMarkers()
  }

  handleChange (type: MeterStatusText, checked: boolean) {
    const filters = this.state.filters

    filters[type] = checked

    this.setState({ filters }, () => this.renderMarkers())
  }

  render () {
    const switches = Object.keys(MeterStatusText).map(key => {
      const type = MeterStatusText[key]
      return (
        <Switch
          key={type}
          id={`switch-parking-${type}`}
          label={key}
          labelOff={key}
          isChecked={this.state.filters[type]}
          onChange={(checked) => this.handleChange(type as MeterStatusText, checked)}
        />
      )
    })

    return (
      <PageSection>
        <Title size="lg">Parking Map</Title>
        <hr/>
        <br/>
        <form>
          {switches}
        </form>
        <br/>
        <GoogleMap handleMapApiLoaded={(map) => this.handleApiLoaded(map)}></GoogleMap>
      </PageSection>
    )
  }
}

export { ParkingMap };
