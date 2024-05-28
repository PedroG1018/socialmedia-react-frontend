import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";

export default function App() {
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}
