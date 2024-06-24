import { PlaceTypes } from '@homzhub/common/src/services/GooglePlaces/constants';
import { icons } from '@homzhub/common/src/assets/icon';

export enum NeighborhoodTabs {
  Nearby = 0,
  Commute = 1,
}

export const PLACES_DATA = {
  [NeighborhoodTabs.Commute]: {
    [PlaceTypes.Railway]: {
      key: PlaceTypes.Railway,
      label: 'railwayStations',
      icon: icons.train,
      mapMarker: icons.trainMarker,
    },
    [PlaceTypes.BusStation]: {
      key: PlaceTypes.BusStation,
      label: 'busStations',
      icon: icons.bus,
      mapMarker: icons.busMarker,
    },
    [PlaceTypes.Airport]: {
      key: PlaceTypes.Airport,
      label: 'airports',
      icon: icons.airport,
      mapMarker: icons.airportMarker,
    },
  },
  [NeighborhoodTabs.Nearby]: {
    [PlaceTypes.School]: {
      key: PlaceTypes.School,
      label: 'schools',
      icon: icons.school,
      mapMarker: icons.schoolMarker,
    },
    [PlaceTypes.Mall]: { key: PlaceTypes.Mall, label: 'malls', icon: icons.mall, mapMarker: icons.mallMarker },
    [PlaceTypes.Restaurant]: {
      key: PlaceTypes.Restaurant,
      label: 'restaurants',
      icon: icons.restaurant,
      mapMarker: icons.restaurantMarker,
    },
    [PlaceTypes.GasStation]: {
      key: PlaceTypes.GasStation,
      label: 'fuelStations',
      icon: icons.fuel,
      mapMarker: icons.fuelMarker,
    },
    [PlaceTypes.Hospital]: {
      key: PlaceTypes.Hospital,
      label: 'hospitals',
      icon: icons.hospital,
      mapMarker: icons.hospitalMarker,
    },
    [PlaceTypes.Groceries]: {
      key: PlaceTypes.Groceries,
      label: 'groceryStores',
      icon: icons.grocery,
      mapMarker: icons.groceryMarker,
    },
    [PlaceTypes.Park]: { key: PlaceTypes.Park, label: 'parks', icon: icons.park, mapMarker: icons.parkMarker },
    [PlaceTypes.FilmTheater]: {
      key: PlaceTypes.FilmTheater,
      label: 'filmTheaters',
      icon: icons.cinema,
      mapMarker: icons.cinemaMarker,
    },
    [PlaceTypes.Atm]: { key: PlaceTypes.Atm, label: 'atms', icon: icons.bank, mapMarker: icons.bankMarker },
    [PlaceTypes.Chemist]: {
      key: PlaceTypes.Chemist,
      label: 'pharmacies',
      icon: icons.chemist,
      mapMarker: icons.chemistMarker,
    },
    [PlaceTypes.Lodging]: { key: PlaceTypes.Lodging, label: 'hotels', icon: icons.lodge, mapMarker: icons.lodgeMarker },
  },
};
