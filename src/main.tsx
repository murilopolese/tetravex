import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './components/App.tsx'
import GameContext from './components/GameContext.tsx'

createRoot(document.body!).render(
  <StrictMode>
    <GameContext>
      <App />
    </GameContext>
  </StrictMode>,
)
