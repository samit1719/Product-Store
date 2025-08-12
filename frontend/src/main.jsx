import React from 'react'
import ReactDom from 'react-dom/client'
import {ChakraProvider} from '@chakra-ui/react'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'

ReactDom.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
  
)


