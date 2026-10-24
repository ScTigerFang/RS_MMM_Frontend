const configuredImages = (process.env.REACT_APP_BACKGROUND_IMAGES || "")
  .split(",")
  .map((image) => image.trim())
  .filter(Boolean);

export const backgroundImages = configuredImages.length
  ? configuredImages
  : ["/image/3.jpg", "/image/4.jpg", "/image/6.jpg"];
