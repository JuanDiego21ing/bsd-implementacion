// database.js
import * as SQLite from 'expo-sqlite';
import 'react-native-get-random-values'; // Para uuid
import { v4 as uuidv4 } from 'uuid';

// Abre la base de datos o la crea si no existe.
// El archivo 'photos.db' se almacenará localmente en el dispositivo.
const db = SQLite.openDatabase('photos.db');

export const initDB = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS photos (
                    id TEXT PRIMARY KEY NOT NULL,
                    imagePath TEXT NOT NULL,
                    createdAt TEXT NOT NULL
                );`,
                [], // Argumentos vacíos para esta consulta
                () => { // Callback de éxito
                    console.log("Tabla 'photos' creada o ya existente.");
                    resolve();
                },
                (_, err) => { // Callback de error (_ es el resultado de la transacción, err es el error)
                    console.error("Error creando la tabla 'photos':", err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

export const insertPhoto = (imagePath) => { // ID y createdAt se generan aquí
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO photos (id, imagePath, createdAt) VALUES (?, ?, ?);`,
                [id, imagePath, createdAt], // Valores a insertar
                (_, result) => {
                    console.log("Foto insertada con ID:", id, "Path:", imagePath);
                    resolve(result);
                },
                (_, err) => {
                    console.error("Error insertando foto:", err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

export const fetchPhotos = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM photos ORDER BY createdAt DESC;`, // Obtener todas las fotos, las más nuevas primero
                [],
                (_, result) => {
                    resolve(result.rows._array); // El resultado es un array de objetos
                },
                (_, err) => {
                    console.error("Error obteniendo fotos:", err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};

// Opcional: Función para eliminar una foto por ID
export const deletePhoto = (id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM photos WHERE id = ?;`,
                [id],
                (_, result) => {
                    console.log("Foto eliminada con ID:", id);
                    resolve(result);
                },
                (_, err) => {
                    console.error("Error eliminando foto:", err);
                    reject(err);
                }
            );
        });
    });
    return promise;
};