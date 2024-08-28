import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";

const OpenLayersMap = () => {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [stateName, setStateName] = useState("");
  const [healthData, setHealthData] = useState([]);
  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabaseUrl = "https://pdtmpyckpklkfikjvpnd.supabase.co";
      const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdG1weWNrcGtsa2Zpa2p2cG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDUwNDQyMywiZXhwIjoyMDQwMDgwNDIzfQ.FZxR7cZefz012P2knSzTaBHHrcSXFhrEcSsZOMxhPGk";
      const tableName = "district";

      const healthTableName = "health";

      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/${tableName}?select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          console.log(data, "geometry data");
          const geoData = data.map((row) => ({
            type: "Feature",
            geometry: row.geom,
            properties: row,
          }));
          setFeatures(geoData);

          setFilteredFeatures(geoData); // Initially, show all features
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch(
          `${supabaseUrl}/rest/v1/${healthTableName}?select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // const geoData = data.map((row) => ({
          //   type: "Feature",
          //   geometry: row.geom,
          //   properties: row,
          // }));
          setHealthData(data);

          // setFilteredFeatures(geoData); // Initially, show all features
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
