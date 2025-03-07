import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Cambia si tu backend usa otro puerto

// Obtener proyectos
export const getProyectos = async () => {
  try {
    const response = await axios.get(`${API_URL}/proyectos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    return [];
  }
};

// Crear un nuevo proyecto
export const crearProyecto = async (nuevoProyecto) => {
  try {
    const response = await axios.post('http://localhost:5000/api/proyectos', nuevoProyecto); // Ajusta la URL según sea necesario
    return response.data;
  } catch (error) {
    console.error("Error al crear proyecto", error);
    return null;
  }
};
