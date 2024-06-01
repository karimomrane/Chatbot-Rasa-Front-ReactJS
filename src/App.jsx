import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChatbotAi from './chatbotAi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ChatbotAi/>
      </div>
    
    
  )
}

export default App
