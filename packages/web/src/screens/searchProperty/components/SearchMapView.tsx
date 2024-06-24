import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Script from 'react-load-script';
import { bindActionCreators, Dispatch } from 'redux';
import { InfoWindow, Marker } from '@react-google-maps/api';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import GoogleMapView from '@homzhub/web/src/components/atoms/GoogleMapView';
import MarkerCard from '@homzhub/web/src/screens/searchProperty/components/MarkerCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilter } from '@homzhub/common/src/domain/models/Search';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ILatLng } from '@homzhub/common/src/modules/search/interface';

interface IProps {
  searchLocation?: ILatLng;
}

interface IStateProps {
  properties: AssetSearch;
  filters: IFilter;
}

interface IDispatchProps {
  setFilter: (payload: IFilter) => void;
  getProperties: () => void;
}

interface IPlace {
  id: number;
  pos: ILatLng;
}

type Props = IProps & IDispatchProps & IStateProps;

const SearchMapView: React.FC<Props> = (props: Props) => {
  const [hasScriptLoaded, setHasScriptLoaded] = useState(false);
  const { properties, filters } = props;
  const { results } = properties;
  const lat = filters.search_latitude || 0;
  const lng = filters.search_longitude || 0;
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const handleOnMapLoad = (mapInstance: google.maps.Map): void => {
    setMapRef(mapInstance);
  };
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const onSelectMarker = (id: number | null): void => {
    if (selectedMarkerId === id) {
      setSelectedMarkerId(null);
    } else {
      setSelectedMarkerId(id);
    }
  };

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const [zoom, setZoom] = useState(5);
  const [infoOpen, setInfoOpen] = useState(false);

  const places = results.map((property) => {
    return { id: property.id, pos: { lat: property.latitude, lng: property.longitude } };
  });
  const setSelectedAssetData = (): void => {
    setSelectedAsset(results.filter((property) => property.id === selectedMarkerId)[0]);
  };

  // We have to create a mapping of our places to actual Marker objects

  const markerClickHandler = (event: google.maps.MapMouseEvent, place: IPlace): void => {
    // Remember which place was clicked
    onSelectMarker(place.id);
    setSelectedPlace(place);
    setSelectedAssetData();
    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 12) {
      setZoom(12);
    }

    // if you want to center the selected Marker
    // setCenter(place.pos)
  };
  return (
    <View style={styles.container}>
      <Script
        url={`https://maps.googleapis.com/maps/api/js?key=${ConfigHelper.getPlacesApiKey()}&libraries=places`}
        onLoad={(): void => setHasScriptLoaded(true)}
      />
      {hasScriptLoaded && (
        <GoogleMapView center={{ lat, lng }} onMapLoadCallBack={handleOnMapLoad} zoom={12}>
          {places.map((place) => {
            if (mapRef) {
              return (
                <div>
                  {place.id === selectedMarkerId ? (
                    <Marker
                      position={place.pos}
                      key={place.id}
                      onClick={(event): void => markerClickHandler(event, place)}
                      icon={{
                        path: 'M31.64,58.24c0-0.97-0.79-1.76-1.76-1.76H8.79c-0.97,0-1.76,0.79-1.76,1.76S7.82,60,8.79,60h21.09C30.85,60,31.64,59.21,31.64,58.24z M19.34,0C8.67,0,0,8.67,0,19.34c0,14.62,17.35,32.38,18.09,33.12c0.34,0.34,0.79,0.52,1.24,0.52s0.9-0.17,1.24-0.52c0.74-0.74,18.09-18.5,18.09-33.12C38.67,8.67,30,0,19.34,0z M31.35,20.31c-0.53,0.8-1.62,1.03-2.44,0.49l-0.78-0.52v9.61c0,0.97-0.79,1.76-1.76,1.76H12.3c-0.97,0-1.76-0.79-1.76-1.76v-9.61L9.76,20.8c-0.81,0.53-1.9,0.32-2.44-0.49c-0.54-0.81-0.32-1.9,0.49-2.44l10.55-7.03c0.59-0.39,1.36-0.39,1.95,0l10.55,7.03C31.67,18.41,31.88,19.5,31.35,20.31L31.35,20.31zM14.06,17.93v10.19h10.55V17.93l-5.27-3.52L14.06,17.93z',
                        fillColor: theme.colors.blue,
                        fillOpacity: 1.0,
                        strokeWeight: 0,
                        scale: 0.8,
                      }}
                    />
                  ) : (
                    <Marker
                      position={place.pos}
                      key={place.id}
                      onClick={(event): void => markerClickHandler(event, place)}
                      icon={{
                        path: 'M31.64,58.24c0-0.97-0.79-1.76-1.76-1.76H8.79c-0.97,0-1.76,0.79-1.76,1.76S7.82,60,8.79,60h21.09C30.85,60,31.64,59.21,31.64,58.24z M19.34,0C8.67,0,0,8.67,0,19.34c0,14.62,17.35,32.38,18.09,33.12c0.34,0.34,0.79,0.52,1.24,0.52s0.9-0.17,1.24-0.52c0.74-0.74,18.09-18.5,18.09-33.12C38.67,8.67,30,0,19.34,0z M31.35,20.31c-0.53,0.8-1.62,1.03-2.44,0.49l-0.78-0.52v9.61c0,0.97-0.79,1.76-1.76,1.76H12.3c-0.97,0-1.76-0.79-1.76-1.76v-9.61L9.76,20.8c-0.81,0.53-1.9,0.32-2.44-0.49c-0.54-0.81-0.32-1.9,0.49-2.44l10.55-7.03c0.59-0.39,1.36-0.39,1.95,0l10.55,7.03C31.67,18.41,31.88,19.5,31.35,20.31L31.35,20.31zM14.06,17.93v10.19h10.55V17.93l-5.27-3.52L14.06,17.93z',
                        fillColor: theme.colors.darkTint4,
                        fillOpacity: 1.0,
                        strokeWeight: 0,
                        scale: 0.5,
                      }}
                    />
                  )}
                </div>
              );
            }
            return [];
          })}
          {infoOpen && selectedAsset && selectedPlace && (
            <InfoWindow position={selectedPlace.pos} onCloseClick={(): void => setInfoOpen(false)}>
              <MarkerCard propertyData={selectedAsset} />
            </InfoWindow>
          )}
        </GoogleMapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '40vw',
  },
});
export const mapStateToProps = (state: IState): IStateProps => {
  const { getProperties, getFilters } = SearchSelector;
  return {
    properties: getProperties(state),
    filters: getFilters(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, getProperties } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      getProperties,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchMapView);
