import { Box, Heading, HStack, IconButton, Image, Modal, useColorMode, useColorModeValue, useToast, Button } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { useProductStore } from "../store/product"
import { useDisclosure } from "@chakra-ui/react"
import { ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter} from "@chakra-ui/react"
import { Input, VStack } from "@chakra-ui/react"
import { useState } from "react"




const ProductCard = ({ product }) => {
    const textColor = useColorModeValue("gray.600", "gray.200")
    const bg = useColorModeValue("white", "gray.800")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure()
    const toast = useToast()
    const [updatedProduct, setUpdatedProduct] = useState(product)
    const { deleteProduct , updateProduct } = useProductStore()
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );
        
        if (confirmDelete) {
            const { success, message } = await deleteProduct(id)
            if (!success) {
                toast({
                    title: 'Error',
                    description: message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            } else {
                toast({
                    title: 'Success',
                    description: message,
                    status: "success",
                    duration: 3000,
                    isClosable: true
                })  
            }
        } 
    }

    const handleUpdate = async (id, updatedProduct) => {
        
        const {success, message} = await updateProduct(id, updatedProduct)
        if(success) {
            toast({    
                title: "Success",
                description: "Product updated successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        }else {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 5000,
                isClosable: true,
            })  
        } 
            onClose()
    }

  return (
    <Box
      shadow='lg'
      rounded='lg'
      transition={"all 0.3s"}   
      _hover={{
        shadow: "xl",
        transform: "translateY(-5px)"
      }}
      overflow='hidden'
      bg={bg}
    >
      <Image src={product.image} alt={product.name} w='full'  h={48} objectFit='cover' />
      <Box p={4}>
        <Heading as='h3' size='md' mb={2}>
          {product.name}
        </Heading>
        <Text fontSize='xl' fontWeight='bold' color={textColor} mb={4}>
          ${product.price}  
        </Text>
        <HStack spacing={2}>
            <IconButton  icon={<EditIcon />} colorScheme="blue" onClick={onOpen} />
            <IconButton  icon={<DeleteIcon />} colorScheme="red" onClick={onOpen2} />
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
                <Input 
                    placeholder="Product Name" name="name" 
                    value={updatedProduct.name} 
                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })} 
                />
                <Input 
                    placeholder="Price" name="price" type="number" 
                    value={updatedProduct.price} 
                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })} 
                />
                <Input 
                    placeholder="Image URL" name="image" 
                    value={updatedProduct.image} 
                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })} 
                />
            </VStack>
          </ModalBody>
          <ModalFooter >
            <Button colorScheme="blue" mr={3} onClick={() => handleUpdate(product._id, updatedProduct)}>
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to Delete " {product.name}"?</Text>
          </ModalBody>
          <ModalFooter >
            <Button colorScheme="red" mr={3} onClick={() => handleDelete(product._id)}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
} 

export default ProductCard