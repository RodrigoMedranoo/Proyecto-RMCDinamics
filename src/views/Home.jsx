  import React, { useState, useEffect } from 'react';
  import { Box, Heading, Text, Container, VStack, Button, Flex, Link, Image } from '@chakra-ui/react';
  import { Link as RouterLink } from 'react-router-dom';
  import { getProyectos, eliminarProyectoAPI } from "../api"; // Importamos la función de la API
 


  function Home() {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
      const fetchProyectos = async () => {
        try {
          const proyectosBackend = await getProyectos();
          setProyectos(proyectosBackend);
        } catch (error) {
          console.error("Error al obtener proyectos:", error);
        }
      };
    
      fetchProyectos();
    }, [location]); 

    const eliminarProyecto = async (id) => {
  const eliminado = await eliminarProyectoAPI(id);
  if (eliminado) {
    setProyectos(proyectos.filter(proyecto => proyecto._id !== id)); // Filtra proyectos después de eliminar en MongoDB
  } else {
    alert("Error al eliminar el proyecto.");
  }
};

    return (
      <Container maxW="container.xl" py={4}>
        <Flex direction="column" align="center">
          {/* Navbar */}
          <Box as="nav" mb={8}>
            <Flex as="ul" listStyleType="none" p={0} m={0} justify="center" wrap="wrap">
              <Link as={RouterLink} to="/" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
                Inicio
              </Link>
              <Link as={RouterLink} to="/crearproyecto" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
                Crear Proyecto
              </Link>
              <Link as={RouterLink} to="/profile" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
                Información de Usuario
              </Link>
              <Link as={RouterLink} to="/carrito" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
                Carrito
              </Link>
            </Flex>
          </Box>

          {/* Main Content */}
          <VStack spacing={4} align="center" justify="center">
            <Heading as="h1" size="2xl" color="teal.500">
              Inicio
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Aquí puedes crear nuevos proyectos o tareas. Selecciona una opción a continuación:
            </Text>
            <Button as={RouterLink} to="/crearproyecto" colorScheme="teal" size="lg" mt={4}>
              Crear Nuevo
            </Button>
          </VStack>

          {/* Mostrar proyectos creados */}
          <Heading as="h2" size="lg" mt={8} color="teal.500">
            Proyectos Creados
          </Heading>

          {proyectos.length === 0 ? (
            <Text fontSize="lg" color="gray.600" mt={4}>
              No hay proyectos creados.
            </Text>
          ) : (
            <VStack spacing={4} mt={4} align="stretch" width="100%">
              {proyectos.map((proyecto) => (
                <Box key={proyecto.id} borderWidth={1} borderRadius="md" p={4} boxShadow="md">
                  <Heading as="h3" size="md" color="teal.600">
                    {proyecto.nombre}
                  </Heading>
                  <Text fontSize="md" color="gray.600">
                    {proyecto.descripcion}
                  </Text>
                  {proyecto.imagen && (
                    <Image src={proyecto.imagen} alt={proyecto.nombre} mt={2} borderRadius="md" maxH="200px" />
                  )}
                  {/* Botones de acción */}
                  <Flex mt={4} justify="space-between">
                  <Button as={RouterLink} to={`/proyecto/${proyecto.id}`} colorScheme="teal">
                    Ver Detalles
                    </Button>

                    <Button colorScheme="red" onClick={() => eliminarProyecto(proyecto._id)}>
                      Eliminar
                    </Button>
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Flex>
      </Container>
    );
  }

  export default Home;
