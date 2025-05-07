// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; // Asegúrate que las rutas sean correctas
import CameraScreen from './CamaraScreen'; // Asegúrate que las rutas sean correctas
import { initDB } from './database'; // Importa tu función de inicialización

const Stack = createNativeStackNavigator();

const App = () => {
    useEffect(() => {
        initDB()
            .then(() => {
                console.log('Base de datos inicializada exitosamente desde App.js');
            })
            .catch(err => {
                console.error('Falló la inicialización de la base de datos desde App.js:', err);
                // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
            });
    }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Fotos' }} />
                <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Tomar Foto' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;