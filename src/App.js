import React, { useEffect } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import MethodsTable from "./components/MethodsTable";
import { useMethods } from "./hooks/useMethods";
import { useIntensity } from "./hooks/useIntensity";
import image2 from "./image/3.jpg";
import image3 from "./image/4.jpg";
import image4 from "./image/5.jpg";
import image5 from "./image/6.jpg";

const queryClient = new QueryClient();

const backgroundImages = [image2, image3, image4, image5, image5];

function App() {
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
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const randomImage = backgroundImages[randomIndex];
    // Set the body background image
    document.body.style.backgroundImage = `url(${randomImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      document.body.style.background = "none";
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
    </div>
  );
}

export default () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
