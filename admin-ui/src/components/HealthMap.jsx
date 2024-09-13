import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Fill, Stroke } from "ol/style";
// import "./HealthMap.css";

// const DISTRICT_API_URL = "https://sheetdb.io/api/v1/x0im8yne6vc93";
const HEALTH_API_URL = "https://sheetdb.io/api/v1/gwojvaves7wuk";

const HealthMap = () => {
  const [map, setMap] = useState(null);
  const [districtData, setDistrictData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const mapRef = useRef(null);
  const vectorLayerRef = useRef(null);
  const [features, setFeatures] = useState([]);

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
          //   console.log(geoData, "ppppppppppppppppppppp");
          //   setDistrictData(geoData);
          setDistrictData(data); // Initially, show all features
          setFilteredFeatures(geoData);
          setFeatures(geoData);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchHealthData = async () => {
      try {
        const response = await fetch(HEALTH_API_URL, {
          method: "GET", // or 'POST' if needed
          headers: {
            "Content-Type": "application/json",
            //   'Authorization': 'Bearer YOUR_API_TOKEN' // if you need authentication
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setHealthData(data);
        // return data; // Return the data for further processing
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    // Call the fetch function
    fetchHealthData();
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

    if (filteredFeatures.length > 0) {
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: filteredFeatures,
        })
      );

      const extent = vectorSource.getExtent();
      mapRef.current.getView().fit(extent, {
        size: mapRef.current.getSize(),
        maxZoom: 10,
      });
    }
  }, [filteredFeatures]);

  //main query for the map
  const queryLayer = () => {
    //style the element

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
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear();
    if (districtData.length > 0 && healthData.length > 0 && !map) {
      const filterdStateData = districtData.filter((feature) => {
        return feature.statename === "Punjab";
      });

      const filterdHealthData = healthData.filter((feature) => {
        return (
          feature.Disease === "Diabetes" &&
          feature.State === "Punjab" &&
          feature.Gender === "Men"
        );
      });

      const combinedData = filterdStateData.map((featureRecord) => {
        const matchingHealth = filterdHealthData.find(
          (health) =>
            health.District.trim().toLowerCase() ===
            featureRecord.district.trim().toLowerCase()
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

      console.log(combinedData);

      const combinedFeature = combinedData.map((row) => ({
        type: "Feature",
        geometry: row.geom,
        properties: row,
      }));
      //   console.log(combinedFeature, "Combined data----------");

      //   setFilteredFeatures(combinedData);
      //   const vectorSource = vectorLayerRef.current.getSource();
      //   vectorSource.clear();
      vectorSource.addFeatures(
        new GeoJSON().readFeatures({
          type: "FeatureCollection",
          features: combinedFeature,
        })
      );

      vectorSource.getFeatures().forEach((feature) => {
        // console.log(feature, "ffffffffffffffffffff");
        //   const prevalenceValue = feature.get("prevalance"); // Ensure this is a number
        const prevalenceValue = feature.values_.properties.Actual_prevalence; // Ensure this is a number

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

    // if (filteredFeatures.length > 0) {
    // }
  };

  const resetLayer = () => {
    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear();
    console.log(features, "featuresssssssssss");
    // setFilteredFeatures(features);
    vectorSource.addFeatures(
      new GeoJSON().readFeatures({
        type: "FeatureCollection",
        features: features,
      })
    );
    const extent = vectorSource.getExtent();
    mapRef.current.getView().fit(extent, {
      size: mapRef.current.getSize(),
      maxZoom: 10,
    });
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "80vh" }}></div>;
      <div>
        <button onClick={queryLayer}>Query</button>
        <button onClick={resetLayer}>Reset</button>
      </div>
    </div>
  );
};

export default HealthMap;
