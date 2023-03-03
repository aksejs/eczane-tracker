import React from 'react'
import Geocode from "react-geocode";

import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'
import { GOOGLE_API_KEY } from './utils/contants';

Geocode.setApiKey(GOOGLE_API_KEY)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />,
)
