import GoogleMapReact from "google-map-react";
import SearchBox from "./SearchBox";

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function Map() {
  const defaultProps = {
    center: {
      lat: 10.762622,
      lng: 106.660172,
    },
    zoom: 11,
  };

  // useEffect(() => {
  //   searchPlaceApi("nhà hát thành phố").then(console.log);
  // });

  return (
    // Important! Always set the container height explicitly
    <div className="h-screen w-full relative">
      <SearchBox />
      <GoogleMapReact
        // bootstrapURLKeys={{ key: "AIzaSyAESSzwLBdEfkk_WpjVmHQ7_1s15q_S4rg" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      ></GoogleMapReact>
    </div>
  );
}
