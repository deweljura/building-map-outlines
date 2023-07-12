import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';



mapboxgl.accessToken = 'pk.eyJ1IjoianVyYWRld2VsIiwiYSI6ImNsanpmOHNjajBkbDMzZ2xobWRwMTVob3AifQ.WwMjLWkW1RNmtUDayF9UUQ'

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    axios.get('https://mocki.io/v1/e8ab2f21-0ae5-4c9d-9f53-e7e9c78df454')
      .then(response => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/juradewel/cljzhuokd008a01pf9nkn1cni',
          center: [response.data.longitude, response.data.latitude],
          zoom: 15
        });

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true
          }
        });

        map.current.on('load', () => {
          map.current.addControl(draw);

          map.current.on('draw.create', () => {
            const allData = draw.getAll();
            if (allData.features.length > 0) {
              const area = turf.area(allData);
              const roundedArea = Math.round(area * 100) / 100;
              console.log({ ...response.data, area: roundedArea });
            }
          });
        });

        new mapboxgl.Marker().setLngLat([response.data.longitude, response.data.latitude]).addTo(map.current);
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default App;