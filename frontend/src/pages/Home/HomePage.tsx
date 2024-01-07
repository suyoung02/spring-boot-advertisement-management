import { CURRENT_LOCATION } from '@/utils/location';
import { ActionIcon, Button, LoadingOverlay } from '@mantine/core';
import {
  GoogleMap,
  useLoadScript,
  type Libraries,
} from '@react-google-maps/api';
import { IconCurrentLocation } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerError } from '../Error';
import { AddPosition } from './components/AddAds';
import { Login } from './components/Login';
import { SearchBox } from './components/SearchBox';

const libraries = ['places'] as Libraries;
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const HomePage = () => {
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAESSzwLBdEfkk_WpjVmHQ7_1s15q_S4rg',
    libraries,
  });

  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>(
    CURRENT_LOCATION,
  );

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setLocation(pos);
      },
    );
  };

  useEffect(() => {
    handleCurrentLocation();
  }, []);

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

  console.log({ location });

  return (
    <div className="relative">
      <div className="absolute mt-4 z-10 w-[calc(100%-50px)]">
        <div className="ml-auto px-4 flex justify-between items-center">
          <SearchBox />
          <div className="flex items-center gap-2">
            <Button onClick={() => setOpened(true)} color="teal">
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
        center={location}
      ></GoogleMap>
      <Login opened={opened} onClose={() => setOpened(false)} />
      <AddPosition opened onClose={() => null} onChangeLocation={setLocation} />
    </div>
  );
};

export default HomePage;
