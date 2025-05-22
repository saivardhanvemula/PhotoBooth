import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";

const App = () => {
  const [imgs, setImgs] = useState([]);
  const [n, setN] = useState(3); // default value
  const [count, setCount] = useState(0); // tracks captured images
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setImgs((prev) => [...prev, imageSrc]);
      setCount((prev) => prev + 1);
    }
  };

  const startInterval = () => {
    if (intervalRef.current || n <= 0) return;

    setImgs([]);      // clear previous
    setCount(0);      // reset count
    capture();        // capture one immediately

    intervalRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount + 1 >= n) {
          stopInterval(); // stop when n reached
        }
        capture();
        return prevCount + 1;
      });
    }, 3000);
  };

  const stopInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div>
      <Webcam
        className="webcam"
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={400}
        height={400}
        videoConstraints={{
          width: 400,
          height: 400,
          facingMode: "user",
        }}
      />
      <br />

      <input
        type="number"
        value={n}
        min={1}
        onChange={(e) => setN(parseInt(e.target.value))}
        placeholder="Enter number of images"
      />
      <br /><br />

      <button onClick={startInterval}>Start Capturing</button>
      <button onClick={stopInterval} style={{ marginLeft: '10px' }}>Stop</button>

      <h3>Captured: {imgs.length}/{n}</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {imgs.map((img, index) => (
          <img key={index} src={img} alt={`Capture ${index + 1}`} width={150} />
        ))}
      </div>
    </div>
  );
};

export default App;
