import { Platform } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

let db = null;

if (Platform.OS !== "web") {
  const SQLite = require("expo-sqlite");
  db = SQLite.openDatabase("photos.db");
} else {
  console.warn(
    "expo-sqlite no está disponible en la web. Considera usar AsyncStorage u otro almacenamiento compatible."
  );
}

// Función segura para omitir llamadas en web
const warnIfWeb = (fnName) => {
  return () => {
    console.warn(
      `${fnName} no está disponible en la web. Esta función requiere SQLite.`
    );
    return Promise.resolve([]);
  };
};

export const initDB = db
  ? () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS photos (
            id TEXT PRIMARY KEY NOT NULL,
            imagePath TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );`,
            [],
            () => {
              console.log("Tabla 'photos' creada o ya existente.");
              resolve();
            },
            (_, err) => {
              console.error("Error creando la tabla 'photos':", err);
              reject(err);
            }
          );
        });
      });
    }
  : warnIfWeb("initDB");

export const insertPhoto = db
  ? (imagePath) => {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            `INSERT INTO photos (id, imagePath, createdAt) VALUES (?, ?, ?);`,
            [id, imagePath, createdAt],
            (_, result) => {
              console.log("Foto insertada con ID:", id);
              resolve(result);
            },
            (_, err) => {
              console.error("Error insertando foto:", err);
              reject(err);
            }
          );
        });
      });
    }
  : warnIfWeb("insertPhoto");

export const fetchPhotos = db
  ? () => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT * FROM photos ORDER BY createdAt DESC;`,
            [],
            (_, result) => {
              resolve(result.rows._array);
            },
            (_, err) => {
              console.error("Error obteniendo fotos:", err);
              reject(err);
            }
          );
        });
      });
    }
  : warnIfWeb("fetchPhotos");

export const deletePhoto = db
  ? (id) => {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
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
    }
  : warnIfWeb("deletePhoto");
