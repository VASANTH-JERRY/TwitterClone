import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import{ QueryClientProvider,QueryClient} from "@tanstack/react-query"

const queryclient = new QueryClient(
  {
    defaultOptions:{
      queries:{
        refetchOnWindowFocus:false
      }
    }
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryclient}>
      <App />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
