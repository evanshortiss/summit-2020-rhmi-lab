import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { GoogleMap } from '../GoogleMap/GoogleMap';
import { JunctionObject } from '@app/ApiInterfaces/api-interfaces';

const TrafficMap: React.FunctionComponent<any> = (props) => {

  async function handleApiLoaded (map: google.maps.Map) {
    console.log('The map loaded on the TrafficMap page!')

    map.setMapTypeId('satellite')

    // Can use the functions on the map Object per the API:
    // https://developers.google.com/maps/documentation/javascript/tutorial
    map.addListener('zoom_changed', () => {
      console.log(`Map is now zoomed to: ${map.getZoom()}`)
    })

    const uri = new URL('/junctions', process.env.API_URL)
    uri.searchParams.set('user_key', process.env.API_KEY || '')

    const response = await fetch(uri.toString())
    const junctions = await response.json() as JunctionObject[]

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: junctions.map(j => {
        return {
          location: new google.maps.LatLng(j.latitude, j.longitude),
          weight: j.count_ns + j.count_ew
        }
      }),
      map: map,
      radius: 10
    })
  }

  return (
    <PageSection>
      <Title size="lg">Traffic Map</Title>
      <hr/>
      <br/>
      <GoogleMap handleMapApiLoaded={handleApiLoaded}></GoogleMap>
    </PageSection>
  );
}

export { TrafficMap };
