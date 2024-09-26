import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/BlogNotes">
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>
);
