import { ModalName, useControlStore } from '@/stores/control';
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
import { AddPosition } from './components/AddAds';
import { PanelDetail, PositionDetail, Report } from './components/Ads';
import { POSITION_MOCK } from './components/Ads/PositionDetail';
import { Login } from './components/Login';
import { SearchBox } from './components/SearchBox';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [infoWindowData, setInfoWindowData] = useState<any>();

  const markers = [
    { address: 'Address1', lat: 18.5204, lng: 73.8567 },
    { address: 'Address2', lat: 18.5314, lng: 73.8446 },
    { address: 'Address3', lat: 18.5642, lng: 73.7769 },
  ];

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
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

  const handleViewPosition = () => {
    setIsOpen(false);
    setModal(ModalName.POSITION_DETAIL);
  };

  const handleViewPanel = () => {
    setModal(ModalName.PANEL_DETAIL);
  };

  const handleReport = () => {
    setModal(ModalName.REPORT);
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
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        onLoad={onMapLoad}
        // center={currentLocation}
      >
        {markers.map(({ address, lat, lng }, ind) => (
          <MarkerF
            key={ind}
            position={{ lat, lng }}
            onMouseOver={() => {
              handleMarkerHover(ind, lat, lng, address);
            }}
            onClick={handleViewPosition}
          >
            {isOpen && infoWindowData?.id === ind && (
              <InfoWindow
                onCloseClick={() => {
                  setIsOpen(false);
                }}
              >
                <div>
                  <h3 className="font-bold text-base mb-1">
                    {POSITION_MOCK.ads_form}
                  </h3>
                  <h3 className="text-sm">{POSITION_MOCK.location_type}</h3>
                  <h3 className="text-sm">{POSITION_MOCK.address}</h3>
                  <h3 className="text-sm font-bold uppercase mt-1">
                    {POSITION_MOCK.planning_status}
                  </h3>
                </div>
              </InfoWindow>
            )}
          </MarkerF>
        ))}
      </GoogleMap>

      <Login opened={modal === ModalName.LOGIN} onClose={onCloseModal} />

      <AddPosition
        opened={modal === ModalName.ADD_POSITION}
        onClose={onCloseModal}
        onChangeLocation={setCurrentLocation}
      />
      <PositionDetail
        opened={modal === ModalName.POSITION_DETAIL}
        onClose={onCloseModal}
        onViewPanel={handleViewPanel}
        onReport={handleReport}
      />
      <PanelDetail
        opened={modal === ModalName.PANEL_DETAIL}
        onClose={onCloseModal}
        onReport={handleReport}
      />
      <Report
        opened={modal === ModalName.REPORT}
        onClose={onCloseModal}
        position={POSITION_MOCK as never}
      />
    </div>
  );
};

export default HomePage;
