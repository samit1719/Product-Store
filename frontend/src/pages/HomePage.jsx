import {Container, VStack , Text} from "@chakra-ui/react"

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
        <Text
          fontSize="xl"
          textAlign={"center"}
          color="gray.600"
        >

        </Text>
      </VStack>
    </Container>
  )
}

export default HomePage