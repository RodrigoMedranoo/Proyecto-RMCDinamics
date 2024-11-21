import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Button,
  Flex,
  Link,
  Input,
  UnorderedList,
  ListItem,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const toast = useToast();

  useEffect(() => {
    if (!token) {
      console.warn(
        "No se encontró el token de GitHub. Asegúrate de definir REACT_APP_GITHUB_TOKEN en tu archivo .env"
      );
    } else {
      console.log("Token leído correctamente.");
    }
  }, [token]);

  const addToCart = () => {
    if (productName && productPrice) {
      const product = { name: productName, price: parseFloat(productPrice) };
      setCart([...cart, product]);
      setProductName('');
      setProductPrice('');
      toast({
        title: "Producto agregado",
        description: `Se agregó "${productName}" al carrito.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre y precio válidos.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const saveCartToGitHub = async () => {
    const repo = "DavidWuty/PruebasAPI";
    const path = "carrito.json";
    const message = "Guardar carrito";
    const content = btoa(JSON.stringify(cart, null, 2));

    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${repo}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      const sha = data.sha;

      await axios.put(
        `https://api.github.com/repos/${repo}/contents/${path}`,
        { message, content, sha },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      toast({
        title: "Éxito",
        description: "El carrito fue guardado en GitHub.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          await axios.put(
            `https://api.github.com/repos/${repo}/contents/${path}`,
            { message, content },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );

          toast({
            title: "Éxito",
            description: "El carrito fue creado en GitHub.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (uploadError) {
          console.error(uploadError);
          toast({
            title: "Error",
            description: "Hubo un error al crear el archivo en GitHub.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        console.error(error);
        toast({
          title: "Error",
          description: "Hubo un error al guardar el carrito.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Container maxW="container.xl" py={4}>
      {/* Navbar */}
      <Box as="nav" mb={8}>
        <Flex as="ul" listStyleType="none" p={0} m={0} justify="center" wrap="wrap">
          <Link as={RouterLink} to="/" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
            Inicio
          </Link>
          <Link as={RouterLink} to="/carrito" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
            Carrito
          </Link>
          <Link as={RouterLink} to="/profile" mx={4} p={2} rounded="md" _hover={{ bg: 'teal.500', color: 'white' }}>
            Perfil
          </Link>
        </Flex>
      </Box>

      {/* Carrito de Compras */}
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="teal.500" textAlign="center">
          Carrito de Compras
        </Heading>

        {/* Formulario para agregar productos */}
        <Box borderWidth={1} borderRadius="md" p={4} boxShadow="md">
          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Nombre del producto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <Input
              placeholder="Precio del producto"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <Button colorScheme="teal" onClick={addToCart}>
              Agregar Producto
            </Button>
          </VStack>
        </Box>

        {/* Lista de productos en el carrito */}
        <Box>
          <Heading as="h2" size="lg" color="teal.500" mb={4}>
            Productos en el Carrito
          </Heading>
          {cart.length === 0 ? (
            <Text fontSize="lg" color="gray.600">
              No hay productos en el carrito.
            </Text>
          ) : (
            <UnorderedList styleType="none" ml={0} spacing={4}>
              {cart.map((item, index) => (
                <ListItem key={index} borderWidth={1} borderRadius="md" p={4} boxShadow="md">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" color="teal.600">
                      {item.name} - ${item.price.toFixed(2)}
                    </Text>
                  </Flex>
                </ListItem>
              ))}
            </UnorderedList>
          )}
        </Box>

        {/* Botón para guardar en GitHub */}
        <Button colorScheme="teal" size="lg" onClick={saveCartToGitHub}>
          Guardar carrito en GitHub
        </Button>
      </VStack>
    </Container>
  );
};

export default ShoppingCart;
