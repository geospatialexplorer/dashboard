import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke } from "ol/style";

const OpenLayersMap = () => {
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);

  const diseases = [
    "Diabetes",
    "Hypertension",
    "Chronic Respiratory Disease",
    "Heart disease",
    "Cancer",
  ];

  const gender = ["Men", "Women"];

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedStates((prevState) =>
      prevState.includes(state)
        ? prevState.filter((item) => item !== state)
        : [...prevState, state]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const supabaseUrl = "https://pdtmpyckpklkfikjvpnd.supabase.co";
      const supabaseKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdG1weWNrcGtsa2Zpa2p2cG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDUwNDQyMywiZXhwIjoyMDQwMDgwNDIzfQ.FZxR7cZefz012P2knSzTaBHHrcSXFhrEcSsZOMxhPGk"; // Replace with your actual Supabase key
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
          setHealthData(data);
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
          center: [0, 0],
          zoom: 2,
          projection: "EPSG:4326",
        }),
      });
    }

    const getFeatureStyle = (prevalenceValue) => {
      if (prevalenceValue < 1) {
        return new Style({
          fill: new Fill({
            color: "rgba(0, 255, 0, 0.5)", // Green for <1
          }),
          stroke: new Stroke({
            color: "#00FF00",
            width: 1,
          }),
        });
      } else if (prevalenceValue >= 1 && prevalenceValue <= 2) {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 255, 0, 0.5)", // Yellow for 1-2
          }),
          stroke: new Stroke({
            color: "#FFFF00",
            width: 1,
          }),
        });
      } else if (prevalenceValue > 2 && prevalenceValue <= 4) {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 165, 0, 0.5)", // Orange for 3-4
          }),
          stroke: new Stroke({
            color: "#FFA500",
            width: 1,
          }),
        });
      } else if (prevalenceValue > 4) {
        return new Style({
          fill: new Fill({
            color: "rgba(255, 0, 0, 0.5)", // Red for >4
          }),
          stroke: new Stroke({
            color: "#FF0000",
            width: 1,
          }),
        });
      } else {
        return new Style({
          fill: new Fill({
            color: "rgba(0, 0, 255, 0.5)", // Blue for undefined or out of range values
          }),
          stroke: new Stroke({
            color: "#0000FF",
            width: 1,
          }),
        });
      }
    };

    if (filteredFeatures.length > 0) {
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: filteredFeatures,
        })
      );

      vectorSource.getFeatures().forEach((feature) => {
        //   const prevalenceValue = feature.get("prevalance"); // Ensure this is a number
        const prevalenceValue = feature.values_["Actual prevalence"]; // Ensure this is a number

        // console.log(prevalenceValue, "------------Prevalance-------");
        const style = getFeatureStyle(prevalenceValue);
        feature.setStyle(style);
      });

      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
        maxZoom: 10,
      });
    }

    if (features.length > 0) {
      const uniqueStateNames = [
        ...new Set(features.map((feature) => feature.properties.statename)),
      ];
      setUniqueStates(uniqueStateNames);
    }
  }, [filteredFeatures]);

  useEffect(() => {
    if (healthData.length > 0 && features.length > 0) {
      const filterdDisease = healthData.filter((feature) => {
        return (
          feature.Disease === "Diabetes" &&
          feature.State === "Arunachal Pradesh  "
        );
      });

      function filterByState(data, stateName) {
        return data.filter((item) => item.properties.statename === stateName);
      }

      const geomData = filterByState(features, "Arunanchal Pradesh");

      const combinedData = geomData.map((featureRecord) => {
        const matchingHealth = filterdDisease.find(
          (health) =>
            health.District.trim().toLowerCase() ===
            featureRecord.properties.district.trim().toLowerCase()
        );

        if (matchingHealth) {
          //   console.log(featureRecord, "--------feature--------");
          //   console.log(matchingHealth, "------------health-------");
          featureRecord.properties = matchingHealth;
          //   return {
          //     ...featureRecord,
          //     ...matchingHealth,
          //   };
        }

        return featureRecord;
      });

      setFilteredFeatures(combinedData);

      //   console.log(combinedData);
    }
  }, [healthData, features, selectedStates, selectedDiseases]);

  return (
    <div>
      <div>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>States</h3>
          {uniqueStates.map((state) => (
            <label key={state}>
              <input
                type="checkbox"
                value={state}
                checked={selectedStates.includes(state)}
                onChange={handleStateChange}
              />
              {state}
            </label>
          ))}
        </div>
        <div>
          <h3>Disease</h3>
          {diseases.map((disease) => (
            <label key={disease}>
              <input type="checkbox" value={disease} />
              {disease}
            </label>
          ))}
        </div>
        <div>
          <h3>Gender</h3>
          {gender.map((gen) => (
            <label key={gen}>
              <input type="checkbox" value={gen} />
              {gen}
            </label>
          ))}
        </div>
      </div>
      <div id="map" style={{ width: "100%", height: "80vh" }}></div>
    </div>
  );
};

export default OpenLayersMap;
