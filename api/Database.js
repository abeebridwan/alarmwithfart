import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("yuyiyrtasdwjw3432u14ku.db");

const tableName = 'table3'

export class Database {

    static createTable = () => db.transaction(tx =>
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (id integer primary key not null, hour text, minute text, music INTEGER, vibrate INTEGER, days text);`));
    
    static add = (hour, minute, music, vibrate, days) => {const daysString = JSON.stringify(days);
        db.transaction(tx => tx.executeSql(`INSERT INTO ${tableName} (hour, minute, music, vibrate, days) values (${hour},${minute},${music},${vibrate},'${daysString}')`));
        }; 
      
    static updateDaysById = (id, days) => {
        const daysString = JSON.stringify(days);
        db.transaction(tx => tx.executeSql(`UPDATE ${tableName} SET days = '${daysString}' WHERE id = ${id}`));
        };    
        
    static updateMusicById = (id, music) => {
        db.transaction(tx => tx.executeSql(`UPDATE ${tableName} SET music = ${music} WHERE id = ${id}`));
        };    

    static updateVibrateById = (id, vibrate) => {
        db.transaction(tx => tx.executeSql(`UPDATE ${tableName} SET vibrate = ${vibrate} WHERE id = ${id}`));
        };         

    static getAll = () => {
        var query = `SELECT * FROM ${tableName};`;

        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {

                //console.log(JSON.stringify(results))

                resolve(JSON.stringify(results));

            }, (tx, error) => reject(error));
        }))

    }

    static remove = (id) => db.transaction(tx => tx.executeSql(`DELETE FROM ${tableName} WHERE (id = ${id});`));

    static removeAll() {

        db.transaction(tx => {
            tx.executeSql(`DELETE FROM ${tableName};`);
        });
    }

}