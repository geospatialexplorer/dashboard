import React, { useEffect,useState } from "react";
import { Card } from "antd";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import AOS from "aos";
import "aos/dist/aos.css";
import CombinedMaps from "./CombinedMap";
import Chart from "./Chart";
import StateTable from "./Table";

// Importing images for the cards
import AvgActualPm from "../../public/AvgActual.webp";
import ActualPrevalence from "../../public/ActualPrevalence.webp"; // Fixed typo
import ReducedPm from "../../public/ReducedPM2.5.webp"; // Fixed typo
import ReducedPrevalence from "../../public/AvgReduced.webp"; // Fixed typo

const AnimatedCard = styled(animated(Card))`
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextContent = styled.div`
  color: white;
`;

const ImageContainer = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    filter: invert(80%) brightness(200%);
  }
`;

const cardStyle = {
  color: "white",
  padding: "20px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const Dashboard = ({ healthData, healthLoading }) => {
    const [averages, setAverages] = useState([]);

    // Function to handle data from the child
    const handleAveragesFromChild = (
      averageReducedTwo,
      averageActualTwo,
      averageActualPrevalence,
      averageReducedPrevalence
    ) => {
     
      setAverages([
        averageReducedTwo,
        averageActualTwo,
        averageActualPrevalence,
        averageReducedPrevalence,
      ]);

     
      console.log("Average Reduced PM2.5:", averageReducedTwo);
      console.log("Average Actual PM2.5:", averageActualTwo);
      console.log("Average Actual Prevalence:", averageActualPrevalence);
      console.log("Average Reduced Prevalence:", averageReducedPrevalence);
    };
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const cardsData = [
    {
      title: "Average Actual Prevalence",
      count: averages[0],
      color: "#00bfa5",
      image: ActualPrevalence,
      aosAnimation: "flip-left",
    },
    {
      title: "Average Actual PM2.5",
      count: averages[1],
      color: "#4caf50",
      image: AvgActualPm,
      aosAnimation: "flip-left",
    },
    {
      title: "Average Reduced Prevalence",
      count: averages[2],
      color: "#ffca28",
      image: ReducedPrevalence,
      aosAnimation: "flip-left",
    },
    {
      title: "Average Reduced PM2.5",
      count: averages[3],
      color: "#f44336",
      image: ReducedPm,
      aosAnimation: "flip-left",
    },
  ];

  const props = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { duration: 1000 },
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={cardContainerStyle}>
        {cardsData.map((card, index) => (
          <AnimatedCard
            key={index}
            data-aos={card.aosAnimation}
            style={{
              backgroundColor: card.color,
              ...props,
              flex: 1,
              margin: "10px",
            }}
            hoverable
            bodyStyle={cardStyle}
          >
            <CardContent>
              <TextContent>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {card.count}
                </div>
                <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                  {card.title}
                </div>
              </TextContent>
              {card.image && (
                <ImageContainer>
                  <img src={card.image} alt={card.title} />
                </ImageContainer>
              )}
            </CardContent>
          </AnimatedCard>
        ))}
      </div>
      <CombinedMaps onPassAverages={handleAveragesFromChild} />
      <Chart healthData={healthData} healthLoading={healthLoading} />
      <div style={{ paddingTop: "100px" }}>
        <StateTable healthData={healthData} healthLoading={healthLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
