import '../styles/App.css';
import Login from './login.js';
import Header from './header.js'
import {Routes, Route, BrowserRouter } from "react-router";
import Footer from './footer.js';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Login/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
