import useGetPosition from '@/hooks/useGetPosition';
import { ModalName, useControlStore } from '@/stores/control';
import { Position, type PanelDetail as PanelDetailType } from '@/types/ads';
import { ActionIcon, Button, LoadingOverlay, Select } from '@mantine/core';
import { GoogleMap, InfoWindow, MarkerF } from '@react-google-maps/api';
import { IconCurrentLocation } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddPanel, AddPosition } from './components/AddAds';
import { PanelDetail, PositionDetail } from './components/Ads';

import { useUserStore } from '@/stores/user';
import { Role } from '@/types/enum';
import { ICON } from '@/utils/avatar';
import { CURRENT_LOCATION, getFullAddress } from '@/utils/location';
import { PlaceDetail } from './components/Place';
import { Report, ReportList } from './components/Report';
import { SearchBox } from './components/SearchBox';
import { Location } from '@/types/location';
import { classNames } from '@/utils/classNames';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const HomePage = () => {
  const navigate = useNavigate();

  // const currentLocation = useControlStore.use.currentLocation();
  const setCurrentLocation = useControlStore.use.setCurrentLocation();
  const modal = useControlStore.use.modal();
  const setModal = useControlStore.use.setModal();
  const onCloseModal = useControlStore.use.onCloseModal();
  const user = useUserStore.use.user();

  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('Tất cả');
  const [position, setPosition] = useState<Position | null>(null);
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
    null,
  );
  const [panel, setPanel] = useState<PanelDetailType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [infoWindowData, setInfoWindowData] = useState<any>();

  const { data: markers, isLoading } = useGetPosition(filter);

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach((position) =>
      bounds.extend({
        lat: position.adsPosition.latitude,
        lng: position.adsPosition.longitude,
      }),
    );
    markers && map.fitBounds(bounds);
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

  const handleViewPanel = (panel: PanelDetailType) => {
    setPanel(panel);
    setModal(ModalName.PANEL_DETAIL);
  };

  const handlePlaceChange = (location: Location) => {
    mapRef?.setCenter(location);
    mapRef?.setZoom(17);
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

  if (isLoading) return <LoadingOverlay visible />;
  console.log({ panel });
  return (
    <div className="relative">
      <div className="absolute mt-4 z-10 w-[calc(100%-50px)]">
        <div className="ml-auto px-4 flex justify-between items-center">
          <SearchBox onPlaceChanged={handlePlaceChange} />
          <div className="flex items-center gap-2">
            <Select
              value={filter}
              onChange={(e) => setFilter(e || 'Tất cả')}
              data={['Tất cả', 'Chưa báo cáo', 'Đã báo cáo']}
            />
            {!user && (
              <Button
                onClick={() => setModal(ModalName.REPORT_LIST)}
                color="teal"
              >
                Xem report
              </Button>
            )}
            {user?.role === Role.VHTT && (
              <Button
                onClick={() => setModal(ModalName.ADD_POSITION)}
                color="teal"
              >
                Tạo vị trí
              </Button>
            )}
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
        center={CURRENT_LOCATION}
      >
        {markers?.map(
          ({ panels, adsPosition, locationType, adsForm, isReported }, ind) => (
            <MarkerF
              key={adsPosition.id}
              icon={{
                scaledSize: new google.maps.Size(30, 30),
                url: panels?.[0] ? ICON.AD : locationType.icon || adsForm.icon,
              }}
              position={{
                lat: adsPosition.latitude,
                lng: adsPosition.longitude,
              }}
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
                  <div className={classNames({ 'bg-pink-100': isReported })}>
                    <h3 className="font-bold text-base mb-1">
                      {adsPosition.ads_form}
                    </h3>
                    <h3 className="text-sm">{adsPosition.location_type}</h3>
                    <h3 className="text-sm">{getFullAddress(adsPosition)}</h3>
                    <h3 className="text-sm font-bold uppercase mt-1">
                      {/* {adsPosition.planning_status} */}
                    </h3>
                  </div>
                </InfoWindow>
              )}
            </MarkerF>
          ),
        )}
      </GoogleMap>

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
          onReport={({ position, panel }) => {
            handleReport();
            setPanel(panel);
            setPosition(position);
          }}
          id={position.adsPosition.id}
        />
      )}
      {panel && (
        <PanelDetail
          opened={modal === ModalName.PANEL_DETAIL}
          onClose={onCloseModal}
          onReport={() => {
            handleReport();
            setPosition(null);
            setPanel(panel);
          }}
          id={panel.adsPanel.id}
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
      {(position || panel) && (
        <Report
          opened={modal === ModalName.REPORT}
          onClose={onCloseModal}
          positionId={position?.adsPosition.id || panel?.adsPosition.id}
          panelId={panel?.adsPanel.id}
        />
      )}
      {modal === ModalName.REPORT_LIST && (
        <ReportList opened onClose={onCloseModal} />
      )}
    </div>
  );
};

export default HomePage;
