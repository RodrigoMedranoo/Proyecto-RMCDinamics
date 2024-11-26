import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../../firebaseconfig';
import { Box, Text, Button, Flex, Link, Container, VStack, Heading } from '@chakra-ui/react';

const Profile = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [userAuth, setUserAuth] = useState();
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user.email);

        // Cargar proyectos desde localStorage
        const proyectosGuardados = JSON.parse(localStorage.getItem('proyectos')) || [];
        setProyectos(proyectosGuardados);
      } else {
        setUserAuth(null);
        setProyectos([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => console.error('Error al cerrar sesión:', error));
  };

  const handleDelete = (id) => {
    // Filtrar proyectos y eliminar el seleccionado
    const proyectosActualizados = proyectos.filter((proyecto) => proyecto.id !== id);
    setProyectos(proyectosActualizados);
    localStorage.setItem('proyectos', JSON.stringify(proyectosActualizados));
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
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold">
            Bienvenido, {userAuth || 'Invitado'}
          </Text>
          {userAuth && (
            <Button colorScheme="teal" mt={4} onClick={handleLogout}>
              Cerrar sesión
            </Button>
          )}

          <VStack mt={8} spacing={4} align="stretch">
            <Heading size="md">Tus Proyectos</Heading>
            {proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <Box
                  key={proyecto.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  shadow="md"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {proyecto.nombre}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Fecha de creación: {proyecto.fecha}
                  </Text>
                  <Button
                    as={RouterLink}
                    to={`/proyectos/${proyecto.id}`}
                    mt={2}
                    colorScheme="teal"
                  >
                    Ver detalles
                  </Button>
                  <Button
                    colorScheme="red"
                    mt={2}
                    ml={4}
                    onClick={() => handleDelete(proyecto.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              ))
            ) : (
              <Text fontSize="md">No tienes proyectos creados.</Text>
            )}
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default Profile;
