import { Routes, Route } from "react-router-dom";
import Navigation from "./components/navigation.jsx";

function Home() {
  return <h1>Home</h1>;
}

function AcademicBooks() {
  return <h1>Academic Books</h1>;
}

function Posts() {
  return <h1>Posts</h1>;
}

function Weather() {
  return <h1>Weather</h1>;
}

function App() {
  return (
    <>
  <Navigation />

  <main>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/academic" element={<AcademicBooks />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/weather" element={<Weather />} />
          </Routes>
  </main>
</>
  );
}

export default App;