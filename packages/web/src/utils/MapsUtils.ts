export const getDataFromPlaceID = (
  placeID: string,
  callback: (geocoderResult: google.maps.GeocoderResult) => void
): void => {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ placeId: placeID }, (results, status) => {
    if (status === 'OK') {
      if (results?.length && results[0]) {
        callback(results[0]);
      } else {
        // window.alert('No results found');
      }
    } else {
      // window.alert('Geocoder failed due to: ' + status);
    }
  });
};
export const getPlaceDetailsFromPlaceID = (
  placeID: string,
  map: google.maps.Map,
  callback: (result: google.maps.places.PlaceResult) => void
): void => {
  const service = new google.maps.places.PlacesService(map);
  service.getDetails({ placeId: placeID }, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (results) {
        callback(results);
      } else {
        // window.alert('No results found');
      }
    } else {
      // window.alert('failed due to: ' + status);
    }
  });
};
