import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Input, Button, Checkbox, Progress, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Progreso = () => {
  const [sprints, setSprints] = useState([]);
  const [cantidadSprints, setCantidadSprints] = useState(1);
  const [sprintsSeleccionados, setSprintsSeleccionados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const sprintsGuardados = localStorage.getItem('sprints');
    if (sprintsGuardados) {
      setSprints(JSON.parse(sprintsGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sprints', JSON.stringify(sprints));
  }, [sprints]);

  const agregarSprints = () => {
    const nuevosSprints = [];
    const numeroInicial = sprints.length + 1;

    for (let i = 0; i < cantidadSprints; i++) {
      nuevosSprints.push({
        nombre: `Sprint ${numeroInicial + i}`,
        fechaInicio: '',
        fechaFin: '',
        tareas: [],
        completado: false, // Añadido para marcar el estado del Sprint
      });
    }

    setSprints([...sprints, ...nuevosSprints]);
    setCantidadSprints(1);
  };

  const calcularProgresoTotal = () => {
    const totalSprints = sprints.length;
    const sprintsCompletados = sprints.filter((sprint) => sprint.completado).length;

    return totalSprints === 0 ? 0 : (sprintsCompletados / totalSprints) * 100;
  };

  const manejarSeleccionSprint = (nombreSprint) => {
    if (sprintsSeleccionados.includes(nombreSprint)) {
      setSprintsSeleccionados(sprintsSeleccionados.filter((nombre) => nombre !== nombreSprint));
    } else {
      setSprintsSeleccionados([...sprintsSeleccionados, nombreSprint]);
    }
  };

  const eliminarSprintsSeleccionados = () => {
    const sprintsActualizados = sprints.filter((sprint) => !sprintsSeleccionados.includes(sprint.nombre));
    setSprints(sprintsActualizados);
    setSprintsSeleccionados([]);
  };

  const manejarCambioFecha = (index, campo, valor) => {
    const sprintsActualizados = [...sprints];

    if (campo === 'fechaInicio') {
      sprintsActualizados[index][campo] = valor;
    } else if (campo === 'fechaFin') {
      if (new Date(valor) < new Date(sprintsActualizados[index].fechaInicio)) {
        alert('La fecha límite no puede ser anterior a la fecha de inicio.');
        return;
      }
      sprintsActualizados[index][campo] = valor;
    }

    setSprints(sprintsActualizados);
  };

  return (
    <Box maxW="container.lg" py={4} mx="auto">
      <Flex direction="column" align="center">
        {/* Navbar */}
        <Box as="nav" mb={8} width="100%">
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

        {/* Header */}
        <Heading as="h2" size="xl" color="teal.500" mb={6} textAlign="center">
          Progreso de Sprints
        </Heading>

        {/* Progreso total */}
        <Box width="100%" mb={6} textAlign="center">
          <Text fontSize="lg" color="teal.500" mb={2}>Progreso total</Text>
          <Progress colorScheme="teal" size="lg" value={calcularProgresoTotal()} />
          <Text fontSize="lg" color="gray.600">{Math.round(calcularProgresoTotal())}% Completado</Text>
        </Box>

        {/* Agregar Sprint */}
        <Flex mb={6} width="100%" justify="center" gap={4}>
          <Input
            type="number"
            min="1"
            placeholder="Cantidad de Sprints"
            value={cantidadSprints}
            onChange={(e) => setCantidadSprints(parseInt(e.target.value))}
            width="200px"
          />
          <Button onClick={agregarSprints} colorScheme="teal" width="150px">
            Agregar Sprints
          </Button>
        </Flex>

        {/* Botón eliminar */}
        <Button
          onClick={eliminarSprintsSeleccionados}
          colorScheme="red"
          mb={6}
          isDisabled={sprintsSeleccionados.length === 0}
        >
          Eliminar
        </Button>

        {/* Lista de sprints */}
        <Box width="100%">
          {sprints.length === 0 ? (
            <Text textAlign="center">No hay sprints disponibles para mostrar.</Text>
          ) : (
            sprints.map((sprint, sprintIndex) => (
              <Box key={sprintIndex} mb={6} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
                <Flex justify="space-between" align="center">
                  <Heading as="h3" size="md" mb={2}>{sprint.nombre}</Heading>
                  <Flex direction="column" align="flex-end">
                    <Button onClick={() => navigate(`/sprint/${sprintIndex}`)} colorScheme="teal" mb={2}>
                      Ver Tareas
                    </Button>
                    <Checkbox
                      isChecked={sprintsSeleccionados.includes(sprint.nombre)}
                      onChange={() => manejarSeleccionSprint(sprint.nombre)}
                    >
                      Seleccionar
                    </Checkbox>
                  </Flex>
                </Flex>

                {/* Resumen del estado del Sprint */}
                <Text mt={4}>
                  Estado: {sprint.completado ? 'Completado' : 'Pendiente'}
                </Text>

                {/* Inputs de fecha */}
                <Flex mt={4} gap={4} alignItems="center">
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={1}>Fecha de Inicio</Text>
                    <Input
                      type="date"
                      value={sprint.fechaInicio}
                      onChange={(e) => manejarCambioFecha(sprintIndex, 'fechaInicio', e.target.value)}
                    />
                  </Box>
                  {sprint.fechaInicio && (
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Fecha Límite</Text>
                      <Input
                        type="date"
                        value={sprint.fechaFin}
                        onChange={(e) => manejarCambioFecha(sprintIndex, 'fechaFin', e.target.value)}
                      />
                    </Box>
                  )}
                </Flex>
              </Box>
            ))
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Progreso;
