// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import MethodsTable from "./components/MethodsTable";
import { useMethods } from "./hooks/useMethods";
import { useIntensity } from "./hooks/useIntensity";
import image2 from './image/3.jpg';
import image3 from './image/4.jpg';
import image4 from './image/5.jpg';
import image5 from './image/6.jpg';

const queryClient = new QueryClient();

const backgroundImages = [
  image2,
  image3,
  image4,
  image5,
  image5,
];


function App() {
  const { data: methodsData, isLoading: methodsLoading, error: methodsError } = useMethods();
  const { data: intensityData, isLoading: intensityLoading, error: intensityError } = useIntensity(); 


  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const randomImage = backgroundImages[randomIndex];
    // setBackgroundImage(require('./image/1.jpg'));
    setBackgroundImage(`url(${randomImage})`);//{require('./image/1.jpg')}
  }, []);


  if (methodsLoading || intensityLoading) return <div>Loading...</div>;
  if (methodsError || intensityError) return <div>Error: {methodsError?.message || intensityError?.message}</div>;



  const methodsWithIntensity = methodsData.map(method => ({
    ...method,
    intensity: intensityData.find(intensity => intensity.intensityId === method.intensity)
  }));
console.log(methodsWithIntensity);

  return (
    <div className="wrapper">
      <div className="App">
        <div className="tableContainer">
          <h1 className="title">Money Making Methods</h1>
          <MethodsTable data={methodsWithIntensity}/>
        </div>
      </div>
      <div className="background"
        style={{ backgroundImage: backgroundImage }}>
      </div>
      <style>
        {`
          .wrapper {
            text-align: center;
            font-family: 'runescape_chat_bold_07regular';
            /* font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; */
            height: 100vh;
            width: 100vw;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            animation: fade-in 2s;
          }
          .background::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: inherit;
            background-size: cover;
            opacity: .5;
            z-index: -1;
          }
        `}
      </style>
    </div>
  );
}

export default () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
