import "./App.css";
import MainPage from "./components/mainPage";
// import UploadJsonFile from "./components/uploadJsonFile";

function App() {
  return (
    <div className="app-container">
      <h1>Welcome to the Client Records Management Application</h1>
      {/* <h2>Upload Your JSON File</h2> */}
      {/* <UploadJsonFile /> */}
      {/* <h2>Manage Your Records</h2> */}
      <MainPage />
    </div>
  );
}

export default App;
