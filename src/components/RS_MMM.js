// src/Pages/RS_MMM.js
import React, { useEffect } from "react";
import MethodsTable from "./MethodsTable";
import Footer from "./Footer";
import { useMethods } from "../hooks/useMethods";
import { useIntensity } from "../hooks/useIntensity";
import { backgroundImages } from "../config/images";
import "../App.css";

function RS_MMM() {
  console.log(process.env.REACT_APP_BACKGROUND_IMAGES);
  const {
    data: methodsData,
    isLoading: methodsLoading,
    error: methodsError,
  } = useMethods();
  const {
    data: intensityData,
    isLoading: intensityLoading,
    error: intensityError,
  } = useIntensity();

  useEffect(() => {
    const randomImage =
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.classList.add("custom-background");
    document.body.style.backgroundImage = `url(${randomImage})`;
    console.log(randomImage);
    return () => {
      document.body.classList.remove("custom-background");
    };
  }, []);

  if (methodsLoading || intensityLoading) return <div>Loading...</div>;
  if (methodsError || intensityError)
    return <div>Error: {methodsError?.message || intensityError?.message}</div>;

  const methodsWithIntensity = methodsData.map((method) => ({
    ...method,
    intensity: intensityData.find(
      (intensity) => intensity.intensityId === method.intensity
    ),
  }));

  return (
    <div className="App">
      <div className="tableContainer">
        <h1 className="title">Money Making Methods</h1>
        <MethodsTable data={methodsWithIntensity} />
      </div>
      <Footer />
    </div>
  );
}

export default RS_MMM;
