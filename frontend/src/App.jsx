import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Create from "./pages/create";
import View from "./pages/view";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;