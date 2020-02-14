import * as React from 'react';
import GoogleMapReact from 'google-map-react';

const mapSettings = {
  apiKey: process.env.MAPS_API_KEY,
  center: {
    // Downtown Los Angeles coordinates
    lat: 34.052235,
    lng: -118.243683
  },
  zoom: 11
}

export type GoogleMapProps = {
  handleMapApiLoaded: (map: google.maps.Map) => void
}

const GoogleMap: React.FunctionComponent<GoogleMapProps> = (props) => {
  if (!mapSettings.apiKey) {
    throw new Error('MAPS_API_KEY must be set in environment')
  }

  return (
    <GoogleMapReact
      style={{
        width: '100%',
        height: '92%',
        margin: '0px',
        padding: '0px',
        position: 'relative'
      } as any} // Any is required due to a type error
      bootstrapURLKeys={{key: mapSettings.apiKey}}
      defaultCenter={mapSettings.center}
      defaultZoom={mapSettings.zoom}
      heatmapLibrary={true}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map }) => props.handleMapApiLoaded(map)}
    ></GoogleMapReact>
  );
}

export { GoogleMap };
