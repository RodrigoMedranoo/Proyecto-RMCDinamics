// App.jsx
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Profile from './views/Profile';
import Progress from './views/Progress';
import CrearProyecto from './views/CrearProyecto';
import TareasPendientes from './views/TareasPendientes';
import Register from './views/Registro';
import SprintDetalle from './views/SprintDetalle';
import Protected from './components/Protected';
import ProjectDetails from './views/ProjectDetails';  // Asegúrate de que la ruta sea correcta
import ShoppingCart from './views/ShoppingCart';
import app from '../firebaseconfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [userAuth, setUserAuth] = useState(null);
  const [tareas, setTareas] = useState([]);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user.email);
      } else {
        console.log("Favor de volverse a autenticar");
      }
    });
  }, [auth]);

  const agregarTarea = (tarea) => {
    setTareas([...tareas, tarea]);
  };

  const completarTarea = (index) => {
    const nuevasTareas = tareas.map((tarea, i) =>
      i === index ? { ...tarea, completada: true } : tarea
    );
    setTareas(nuevasTareas);
  };

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<Protected isActive={!userAuth} />}>
        <Route path='/' element={<Home />} />
        <Route path='/pending-tasks' element={<TareasPendientes tareas={tareas} completarTarea={completarTarea} />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/progreso" element={<Progress tareas={tareas} />} />
        <Route path="/sprint/:sprintIndex" element={<SprintDetalle />} />
        <Route path='/crearproyecto' element={<CrearProyecto />} />
        <Route path='/carrito' element={<ShoppingCart />} />
        <Route path="/proyecto/:id" element={<ProjectDetails tareas={tareas} completarTarea={completarTarea} />} />
      </Route>
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
