
import './App.scss';
import Header from './components/Header';
import TableUser from './components/TableUser';
import Container from 'react-bootstrap/Container';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from "react-router-dom"
import Home from './components/Home';
function App() {

  return (
    <>
      <div className='app-container'>
        <Header />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/user' element={<TableUser />} />
          </Routes>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </>
  );
}

export default App;
