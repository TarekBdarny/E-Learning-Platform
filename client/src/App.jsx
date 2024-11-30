import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
function App() {
  const google = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };
  const github = () => {
    window.location.href = "http://localhost:3001/auth/github";
  };
  const Profile = () => {
    return (
      <div>
        <h2>Profile Page</h2>
        <p>hello user</p>
      </div>
    );
  };
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <button onClick={google}>Login with google</button>
              <button onClick={github}>Login with github</button>
            </div>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
