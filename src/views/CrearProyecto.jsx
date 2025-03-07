import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Container, Textarea, Flex, VStack, Image, Radio, RadioGroup, Stack, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { crearProyecto } from '../api'; // Importa la función para interactuar con el backend
import { Select } from '@chakra-ui/react';  // Asegúrate de importarlo
import { Link as RouterLink } from 'react-router-dom';  // Importar RouterLink para enlaces react-router

// Imágenes predeterminadas
import Image1 from '../assets/predeterminadas/image1.jpg';
import Image2 from '../assets/predeterminadas/image2.jpg';
import Image3 from '../assets/predeterminadas/image3.jpg';

const CrearProyecto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(Image1);
  const [personalizada, setPersonalizada] = useState(null);
  const [tipoImagen, setTipoImagen] = useState('predeterminada');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      nombre,
      descripcion,
      imagen: personalizada || imagen,
      fecha: new Date().toISOString(),
    };

    const proyectoCreado = await crearProyecto(nuevoProyecto);

    if (proyectoCreado) {
      navigate('/'); // Redirigir al Home después de crear
    } else {
      alert("Error al crear el proyecto.");
    }
  };

  const handlePersonalizadaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalizada(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
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

      {/* Formulario Crear Proyecto */}
      <Container maxW="container.md" py={4}>
        <Box as="form" onSubmit={handleSubmit} borderWidth={1} borderRadius="md" p={4} boxShadow="md">
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel htmlFor="nombre">Nombre del Proyecto</FormLabel>
              <Input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="descripcion">Descripción del Proyecto</FormLabel>
              <Textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
            </FormControl>
            <FormControl>
              <FormLabel>¿Quieres una imagen predeterminada o personalizada?</FormLabel>
              <RadioGroup onChange={setTipoImagen} value={tipoImagen}>
                <Stack direction="row">
                  <Radio value="predeterminada">Predeterminada</Radio>
                  <Radio value="personalizada">Personalizada</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {tipoImagen === 'predeterminada' && (
              <FormControl>
                <FormLabel htmlFor="imagen">Selecciona una Imagen Predeterminada</FormLabel>
                <Select id="imagen" value={imagen} onChange={(e) => setImagen(e.target.value)}>
                  <option value={Image1}>Imagen 1</option>
                  <option value={Image2}>Imagen 2</option>
                  <option value={Image3}>Imagen 3</option>
                </Select>
                <Image src={imagen} alt="Previsualización" boxSize="150px" mt={2} />
              </FormControl>
            )}

            {tipoImagen === 'personalizada' && (
              <FormControl>
                <FormLabel htmlFor="personalizada">Carga una Imagen Personalizada</FormLabel>
                <Input id="personalizada" type="file" accept="image/*" onChange={handlePersonalizadaChange} />
                {personalizada && <Image src={personalizada} alt="Previsualización personalizada" boxSize="150px" mt={2} />}
              </FormControl>
            )}

            <Button type="submit" colorScheme="teal">Crear Proyecto</Button>
          </VStack>
        </Box>
      </Container>
    </>
  );
};

export default CrearProyecto;
