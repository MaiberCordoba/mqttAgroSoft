import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IoTPage from "./pages/Sensores";
import SensorDetail from "./pages/SensorDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/iot" element={<IoTPage />} />
        <Route path="/iot/sensor/:id" element={<SensorDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
