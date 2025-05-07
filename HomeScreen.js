// HomeScreen.js (fragmento relevante para mostrar)
// ... (importaciones de React, FlatList, Image, useFocusEffect, etc.)
import { fetchPhotos } from './database'; // Importa la función para obtener fotos
import { useFocusEffect } from '@react-navigation/native'; // Para recargar al volver a la pantalla

const [photos, setPhotos] = useState([]);

// useFocusEffect se ejecuta cada vez que la pantalla obtiene el foco
useFocusEffect(
    React.useCallback(() => {
        const loadPhotos = async () => {
            try {
                const dbResult = await fetchPhotos();
                setPhotos(dbResult); // dbResult es el array de objetos foto de la DB
            } catch (err) {
                console.log("Error cargando fotos: ", err);
                Alert.alert("Error", "No se pudieron cargar las fotos.");
            }
        };
        loadPhotos();
        return () => { /* Opcional: limpieza si es necesario */ };
    }, [])
);

const renderPhoto = ({ item }) => (
    <View style={styles.photoContainer}>
        {/* La URI de la imagen debe ser correcta para que Image la cargue */}
        <Image source={{ uri: item.imagePath }} style={styles.image} />
        <Text>Tomada el: {new Date(item.createdAt).toLocaleString()}</Text>
        {/* Podrías añadir un botón para llamar a deletePhoto(item.id) */}
    </View>
);

// ... (JSX con la FlatList que usa 'photos' y 'renderPhoto')