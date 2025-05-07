// CameraScreen.js (fragmento relevante para guardar)
// ... (importaciones de Camera, FileSystem, uuid, useNavigation, etc.)
import { insertPhoto } from './database'; // Importa la función para insertar
import * as FileSystem from 'expo-file-system'; // Para mover el archivo

// ... (lógica de la cámara: permisos, tomar foto con takePictureAsync que devuelve 'capturedPhoto.uri')

const [photoUri, setPhotoUri] = useState(null); // Para la previsualización

// Suponiendo que 'capturedPhoto' es el objeto devuelto por takePictureAsync
// y 'capturedPhoto.uri' es la ruta temporal de la imagen.

const handleSavePhoto = async () => {
    if (!photoUri) return;

    try {
        const fileName = photoUri.split('/').pop(); // Obtiene el nombre del archivo de la URI
        const newImageUri = `${FileSystem.documentDirectory}photos/${fileName}`; // Define un nuevo path más persistente

        // Asegúrate que el directorio 'photos' exista (opcional pero buena práctica)
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}photos/`, { intermediates: true });

        await FileSystem.moveAsync({
            from: photoUri,    // URI temporal de la foto capturada
            to: newImageUri,   // Nueva URI persistente
        });

        await insertPhoto(newImageUri); // Llama a la función de tu database.js
        Alert.alert("¡Guardada!", "Tu foto ha sido guardada.");
        setPhotoUri(null); // Limpia la previsualización
        navigation.goBack(); // Vuelve a la pantalla anterior (Home)
    } catch (error) {
        console.error("Error al guardar la foto:", error);
        Alert.alert("Error", "No se pudo guardar la foto.");
    }
};

// ... (JSX para previsualizar la foto con 'photoUri' y los botones "Guardar" y "Descartar")
// El botón "Guardar" llamaría a handleSavePhoto()