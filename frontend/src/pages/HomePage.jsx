import {Container, VStack , Text, SimpleGrid} from "@chakra-ui/react"
import { Link } from "react-router-dom"


const HomePage = () => {
  return (
    <Container maxW="container.xl" py={12}>
      <VStack>  
        <Text
          fontSize="4xl"
          fontWeight="bold"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
          textAlign="center"
        >  
          Current Product 🚀
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={8}
          w="full"
        >

        </SimpleGrid>

        <Text
          fontSize="xl"
          textAlign={"center"}
          fontWeight="bold"
          color="gray.500"
        >
          No products found 😔{" "}      
          <Link to={"/create"}>
            <Text as="span" color="blue.500" _hover={{textDecoration: "underline"}}>
              Create a product
            </Text>
          </Link>
        </Text>
      </VStack>
    </Container>
  )
}

export default HomePage