import useGetPosition from '@/hooks/useGetPosition';
import { ModalName, useControlStore } from '@/stores/control';
import { AdsPanel, Position } from '@/types/ads';
import { ActionIcon, Button, LoadingOverlay } from '@mantine/core';
import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import { IconCurrentLocation } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerError } from '../Error';
import { AddPanel, AddPosition } from './components/AddAds';
import { PanelDetail, PositionDetail } from './components/Ads';

import { getFullAddress } from '@/utils/location';
import { Login } from './components/Login';
import { SearchBox } from './components/SearchBox';
import { PlaceDetail } from './components/Place';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const HomePage = () => {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [libraries] = useState<any>(['places']);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAESSzwLBdEfkk_WpjVmHQ7_1s15q_S4rg',
    libraries,
  });

  // const currentLocation = useControlStore.use.currentLocation();
  const setCurrentLocation = useControlStore.use.setCurrentLocation();
  const modal = useControlStore.use.modal();
  const setModal = useControlStore.use.setModal();
  const onCloseModal = useControlStore.use.onCloseModal();

  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
    null,
  );
  const [panel, setPanel] = useState<AdsPanel | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [infoWindowData, setInfoWindowData] = useState<any>();

  const { data: markers } = useGetPosition();

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach((position) =>
      bounds.extend({
        lat: position.adsPosition.latitude,
        lng: position.adsPosition.longitude,
      }),
    );
    map.fitBounds(bounds);
  };

  const handleMarkerHover = (
    id: number,
    lat: number,
    lng: number,
    address: string,
  ) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  const handleCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setCurrentLocation(pos);
      },
    );
  }, [setCurrentLocation]);

  useEffect(() => {
    handleCurrentLocation();
  }, [handleCurrentLocation]);

  const handleViewPosition = (position: Position) => {
    setIsOpen(false);
    setPosition(position);
    setModal(ModalName.POSITION_DETAIL);
  };

  const handleViewPanel = (panel: AdsPanel) => {
    setPanel(panel);
    setModal(ModalName.PANEL_DETAIL);
  };

  const handleReport = () => {
    setModal(ModalName.REPORT);
  };

  const handleOnClick = (e: google.maps.MapMouseEvent) => {
    if (!mapRef) return;

    const request = {
      placeId: (e as never)['placeId' as keyof typeof e],
      fields: ['name', 'geometry', 'place_id', 'photos', 'formatted_address'],
    };

    const service = new google.maps.places.PlacesService(mapRef);
    service.getDetails(request, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        setPlace(place);
      }
    });
  };

  if (loadError) {
    return <ServerError />;
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full">
        <LoadingOverlay visible zIndex={1000} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute mt-4 z-10 w-[calc(100%-50px)]">
        <div className="ml-auto px-4 flex justify-between items-center">
          <SearchBox />
          <div className="flex items-center gap-2">
            <Button onClick={() => setModal(ModalName.LOGIN)} color="teal">
              Đăng nhập
            </Button>
            <Button
              onClick={() => setModal(ModalName.ADD_POSITION)}
              color="teal"
            >
              Tạo vị trí
            </Button>
            <Button onClick={() => navigate('/admin/login')} variant="default">
              Truy cập trang quản lý
            </Button>
            <ActionIcon
              onClick={handleCurrentLocation}
              variant="filled"
              size="lg"
              aria-label="Settings"
              color="cyan"
            >
              <IconCurrentLocation size={24} />
            </ActionIcon>
          </div>
        </div>
      </div>
      <GoogleMap
        onClick={handleOnClick}
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        onLoad={onMapLoad}
      >
        {markers?.map(({ adsPosition, locationType, adsForm }, ind) => (
          <MarkerF
            key={adsPosition.id}
            icon={locationType.icon || adsForm.icon}
            position={{ lat: adsPosition.latitude, lng: adsPosition.longitude }}
            onMouseOver={() => {
              handleMarkerHover(
                ind,
                adsPosition.latitude,
                adsPosition.longitude,
                adsPosition.address,
              );
            }}
            onClick={() => handleViewPosition(markers[ind])}
          >
            {isOpen && infoWindowData?.id === ind && (
              <InfoWindow
                onCloseClick={() => {
                  setIsOpen(false);
                }}
              >
                <div>
                  <h3 className="font-bold text-base mb-1">
                    {adsPosition.ads_form}
                  </h3>
                  <h3 className="text-sm">{adsPosition.location_type}</h3>
                  <h3 className="text-sm">{getFullAddress(adsPosition)}</h3>
                  <h3 className="text-sm font-bold uppercase mt-1">
                    {adsPosition.planning_status}
                  </h3>
                </div>
              </InfoWindow>
            )}
          </MarkerF>
        ))}
      </GoogleMap>

      <Login opened={modal === ModalName.LOGIN} onClose={onCloseModal} />

      {modal === ModalName.ADD_POSITION && (
        <AddPosition
          opened
          onClose={onCloseModal}
          onChangeLocation={setCurrentLocation}
          position={position || undefined}
          place={place || undefined}
          mapRef={mapRef}
        />
      )}
      {modal === ModalName.ADD_PANEL && (
        <AddPanel
          opened
          onClose={onCloseModal}
          positionId={position?.adsPosition.id}
          panel={panel || undefined}
        />
      )}
      {position && (
        <PositionDetail
          opened={modal === ModalName.POSITION_DETAIL}
          onClose={onCloseModal}
          onViewPanel={handleViewPanel}
          onReport={handleReport}
          id={position.adsPosition.id}
        />
      )}
      {panel && (
        <PanelDetail
          opened={modal === ModalName.PANEL_DETAIL}
          onClose={onCloseModal}
          onReport={handleReport}
          id={panel.id}
        />
      )}
      {place && (
        <PlaceDetail
          place={place}
          opened={!!place && !modal}
          onClose={() => setPlace(null)}
          onAddPosition={() => {
            setModal(ModalName.ADD_POSITION);
          }}
        />
      )}
      {/* <Report
        opened={modal === ModalName.REPORT}
        onClose={onCloseModal}
        position={POSITION_MOCK as never}
      /> */}
    </div>
  );
};

export default HomePage;
