import { ActionIcon, Button } from "@mantine/core";
import {
  GoogleMap,
  useLoadScript,
  type Libraries,
  Marker,
} from "@react-google-maps/api";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { SearchBox } from "./components/SearchBox";
import { useNavigate } from "react-router-dom";

const libraries = ["places"] as Libraries;
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const HomePage = () => {
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAESSzwLBdEfkk_WpjVmHQ7_1s15q_S4rg",
    libraries,
  });

  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 10.762622,
    lng: 106.660172,
  });

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        const pos = { lat, lng };
        setLocation(pos);
      }
    );
  };

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="relative">
      <div className="absolute mt-4 z-10 w-[calc(100%-50px)]">
        <div className="ml-auto px-4 flex justify-between items-center">
          <SearchBox />
          <div className="flex items-center gap-2">
            <Button onClick={() => setOpened(true)} color="teal">
              Đăng nhập
            </Button>
            <Button onClick={() => navigate("/admin/login")} variant="default">
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
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={location}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
      <Login opened={opened} onClose={() => setOpened(false)} />
    </div>
  );
};

export default HomePage;
