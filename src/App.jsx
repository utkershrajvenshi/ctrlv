import React from 'react'
import { HomeScreen } from './pages/HomeScreen'
import { RootScreen } from './App.styles'
import { LightDarkThemeProvider } from './context/LightDark/LightDarkContext'
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { firebaseConfig } from './config';

const App = () => {
    // const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
    return (
      <RootScreen>
        <LightDarkThemeProvider>
          <HomeScreen />
        </LightDarkThemeProvider>
      </RootScreen>
    )
}

export { App }
