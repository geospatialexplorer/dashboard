import React, { useEffect } from "react";
import { Card, Col, Row } from "antd";
import {
  ArrowRightOutlined,
  ShoppingOutlined,
  LineChartOutlined,
  UserAddOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import AOS from "aos";
import "aos/dist/aos.css";
import CombinedMaps from "./CombinedMap";
import Chart from "./Chart";
import StateTable from "./Table";

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

const IconContainer = styled.div`
  font-size: 50px;
  color: rgba(255, 255, 255, 0.3);
`;

const CardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextContent = styled.div`
  color: white;
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


const Dashboard = ({

  healthData,
  healthLoading,
}) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const cardsData = [
    {
      title: "Average Actual Prevalence",
      count: 150,
      color: "#00bfa5",
      icon: <ShoppingOutlined />,
      aosAnimation: "flip-left",
    },
    {
      title: "Average Actual PM2.5",
      count: "53%",
      color: "#4caf50",
      icon: <LineChartOutlined />,
      aosAnimation: "flip-left",
    },
    {
      title: "Average Reduced Prevalence",
      count: 44,
      color: "#ffca28",
      icon: <UserAddOutlined />,
      aosAnimation: "flip-left",
    },
    {
      title: "Average Reduced PM2.5",
      count: 65,
      color: "#f44336",
      icon: <PieChartOutlined />,
      aosAnimation: "flip-left",
    },
  ];

  // Keep the animation simple and trigger it on initial render
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
            style={{ backgroundColor: card.color, ...props, flex: 1, margin: "10px" }}
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
              <IconContainer>{card.icon}</IconContainer>
            </CardContent>
          </AnimatedCard>
        ))}
      </div>
      <CombinedMaps
       
      />
      <Chart healthData={healthData} healthLoading={healthLoading} />
      <div style={{paddingTop:"100px"}}>
        <StateTable healthData={healthData} healthLoading={healthLoading}/>
      </div>
    </div>
  );
};

export default Dashboard;
