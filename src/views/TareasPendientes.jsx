import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Button, Container, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const TareasPendientes = ({ completarTarea }) => {
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    const sprintsGuardados = localStorage.getItem('sprints');
    if (sprintsGuardados) {
      setSprints(JSON.parse(sprintsGuardados));
    }
  }, []);

  return (
    <Container maxW="container.xl" py={4}>
      <Flex direction="column" align="center">
        {/* Navbar */}
        <Box as="nav" mb={8}>
          <Flex as="ul" listStyleType="none" p={0} m={0} justify="center" wrap="wrap">
            <Link as={RouterLink} to="/" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
              Inicio
            </Link>
            <Link as={RouterLink} to="/progreso" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
              Progreso
            </Link>
            <Link as={RouterLink} to="/pending-tasks" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
              Tareas Pendientes
            </Link>
          </Flex>
        </Box>

        <Heading as="h2" size="xl" color="teal.500" mb={4}>
          Tareas Pendientes
        </Heading>

        {sprints.map((sprint, sprintIndex) => {
          const tareasPendientes = sprint.tareas.filter((tarea) => !tarea.completada);
          return (
            tareasPendientes.length > 0 && (
              <Box key={sprintIndex} p={4} borderWidth={1} borderRadius="md" mb={4}>
                <Heading as="h3" size="md" mb={2}>{sprint.nombre}</Heading>
                <List spacing={3}>
                  {tareasPendientes.map((tarea, tareaIndex) => (
                    <ListItem
                      key={tareaIndex}
                      p={3}
                      borderWidth={1}
                      borderRadius="md"
                      mb={2}
                      boxShadow="sm"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <span>{tarea.nombre} (Estado: {tarea.estado})</span>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )
          );
        })}
      </Flex>
    </Container>
  );
};

export default TareasPendientes;
