import React, { useState, useRef, useEffect } from "react";
import { AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";
import Point from "esri/geometry/Point";
import Graphic from "esri/Graphic";
import PictureMarkerSymbol from "esri/symbols/PictureMarkerSymbol";
import marker from './marker.svg'; 

const Widget = (props: AllWidgetProps<any>) => {
  const [inputLatitude, setInputLatitude] = useState<string>("");
  const [inputLongitude, setInputLongitude] = useState<string>("");
  const [error, setError] = useState<string>("");

  const mapViewRef = useRef<JimuMapView | null>(null);
  const pointSymbol = useRef<PictureMarkerSymbol>();

  useEffect(() => {
    // Initialize the PictureMarkerSymbol
    pointSymbol.current = new PictureMarkerSymbol({
      url: marker,
      width: "30px",
      height: "30px"
    });
  }, []);

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLatitude(e.target.value);
    setError("");
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLongitude(e.target.value);
    setError("");
  };

  const isValidCoordinate = (lat: number, lon: number) => {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  };

  const searchAndZoomToLocation = () => {
    if (mapViewRef.current && inputLatitude && inputLongitude) {
      const lat = parseFloat(inputLatitude);
      const lon = parseFloat(inputLongitude);
      if (!isNaN(lat) && !isNaN(lon) && isValidCoordinate(lat, lon)) {
        const point = new Point({
          longitude: lon,
          latitude: lat
        });

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: pointSymbol.current
        });

        mapViewRef.current.view.graphics.removeAll();
        mapViewRef.current.view.graphics.add(pointGraphic);
        mapViewRef.current.view.goTo({ target: point, scale: 1000 });
      } else {
        setError("Please enter valid latitude and longitude values.");
      }
    }
  };

  const clearCoordinates = () => {
    setInputLatitude("");
    setInputLongitude("");
    setError("");
    if (mapViewRef.current) {
      mapViewRef.current.view.graphics.removeAll();
    }
  };

  const divStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '400px',
    backgroundColor: '#076fe5',
    color: 'white',
    padding: '20px',
    fontSize: '16px',
    borderRadius: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: 'none',
    fontSize: '14px',
  };

  const buttonStyle = {
    width: '200px',
    height: '60px', 
    borderRadius: '15px',
    color: 'white',
    backgroundColor: '#002855', 
    border: '2px solid',
    borderColor: '#000000',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold', 
    marginTop: '10px',
  };

  const clearButtonStyle = {
    ...buttonStyle,
    height: '40px', 
    backgroundColor: '#c90606', 
  };

  return (
    <div className="widget-starter jimu-widget" style={divStyle}>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <>
          <JimuMapViewComponent
            useMapWidgetId={props.useMapWidgetIds?.[0]}
            onActiveViewChange={(jmv: JimuMapView) => {
              mapViewRef.current = jmv;
            }}
          />

          <div>
            <label htmlFor="latitude">
              <font size='4'><b>Latitude:</b></font>
            </label><br />
            <input
              type="number"
              id="latitude"
              value={inputLatitude}
              onChange={handleLatitudeChange}
              style={inputStyle}
              aria-label="Latitude input"
            />
          </div>
          <div>
            <label htmlFor="longitude">
              <font size='4'><b>Longitude:</b></font>
            </label><br />
            <input
              type="number"
              id="longitude"
              value={inputLongitude}
              onChange={handleLongitudeChange}
              style={inputStyle}
              aria-label="Longitude input"
            />
          </div>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          <br />
          <button onClick={searchAndZoomToLocation} style={buttonStyle}>
            Zoom to Location
          </button>
          <button onClick={clearCoordinates} style={clearButtonStyle}>
            Clear
          </button>
          <div style={{ color: 'Navy', fontWeight: 'bold', fontStyle: 'italic', fontSize: '12px', padding: '20px' }}> 
            Widget designed by Dr. Angela Schirck
          </div> 
        </>
      )}
    </div>
  );
};

export default Widget;
