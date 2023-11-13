import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JsonEditor from "./components/JsonEditor";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/LoginPage";
import FileList from "./components/FileList";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/file-list" element={<FileList />}></Route>
          <Route path="/file/:id" element={<JsonEditor />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
