import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { MockApp } from './MockApp'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MockApp />
  </React.StrictMode>
)
