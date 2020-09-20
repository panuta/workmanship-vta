import moment from 'moment'
import 'moment/locale/th'  // Need to explicitly import due to create-react-app behavior
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'

import App from './App'
import * as serviceWorker from './serviceWorker'
import thTH from 'antd/es/locale/th_TH'

import 'antd/dist/antd.css'
import './index.css'

moment.locale('th')

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={thTH}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
