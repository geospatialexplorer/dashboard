import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";

const OpenLayersMap = ({districtData,districtLoading}) => {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [stateName, setStateName] = useState("");
  const [healthData, setHealthData] = useState([]);
  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);
  console.log(districtData,'dd');


  useEffect(() => {
    // Initialize the map only once
    if (!mapRef.current) {
      vectorLayerRef.current = new VectorLayer({
        source: new VectorSource(),
      });

      mapRef.current = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayerRef.current,
        ],
        view: new View({
          center: [0, 0], // Adjust based on your data
          zoom: 2,
        }),
      });
    }

    if (filteredFeatures.length > 0) {
      // Update the vector layer's source
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: filteredFeatures,
        })
      );

      // Fit map to features
      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
        maxZoom: 10,
      });
    }

    if (healthData.length > 0) {
      console.log(healthData, "HealthData-------------------------");
    }
  }, [filteredFeatures]);

  const handleStateChange = (e) => {
    setStateName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = features.filter((feature) =>
      feature.properties.State_Name.toLowerCase().includes(
        stateName.toLowerCase()
      )
    );
    setFilteredFeatures(filtered);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label htmlFor="stateName">Enter State Name: </label>
        <input
          type="text"
          id="stateName"
          value={stateName}
          onChange={handleStateChange}
        />
        <button type="submit">Search</button>
      </form>
      <div id="map" style={{ width: "100%", height: "80vh" }}></div>
    </div>
  );
};

export default OpenLayersMap;
