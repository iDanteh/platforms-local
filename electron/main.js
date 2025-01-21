const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2/promise');
const isDev = process.env.IS_DEV == "true";

let dbConnection;

// Crear la conexión a MySQL
async function connectToDatabase() {
    try {
        dbConnection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'LeninRonaldo717',
            database: 'platforms',
        });
        console.log('Conexión a la base de datos establecida.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        app.quit(); // Salir de la aplicación si la conexión falla
    }
}

async function validateUser(email, password) {
    const [rows] = await dbConnection.execute(
        'SELECT * FROM administrador WHERE email = ? AND password = ?',
        [email, password]
    );
    return rows.length > 0 ? rows[0] : null;
}

async function registerUser(data) {
    try {
        const { name_admin, email, password } = data;
        const [result] = await dbConnection.execute(
            'INSERT INTO administrador (name_admin, email, password) VALUES (?, ?, ?)',
            [name_admin, email, password]
        );
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error('Error al registrar usuario:', error.message, error.stack);
        return { success: false, message: error.message || 'Error al registrar usuario en la base de datos' };
    }
}

async function registerClient(data) {
    try {
        const {nombre_user, apellido_pat, apellido_mat, phone_user, email, password} = data;
        const [result] = await dbConnection.execute(
            'INSERT INTO users (nombre_user, apellido_pat, apellido_mat, phone_user, email, password) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_user, apellido_pat, apellido_mat, phone_user, email, password]
        );
        return { success: true, id: result.insertId };
    } catch (error) {
        console.log('Error en registro de cliente: ', error.message, error.stack);
        return { success: false, error: error.message };
    }
}

// Manejar solicitudes desde el cliente
ipcMain.handle('login', async (event, email, password) => {
    console.log('Datos recibidos:', email, password);
    try {
        const user = await validateUser(email, password);
        return user
            ? { success: true, user }
            : { success: false, message: 'Credenciales incorrectas' };
    } catch (error) {
        console.error('Error al validar usuario:', error);
        return { success: false, message: 'Error interno del servidor' };
    }
});

ipcMain.handle('registerUser', async (event, userData) => {
    console.log('Datos recibidos en el backend:', userData);
    return await registerUser(userData);
});

ipcMain.handle('registerClient', async (event, userData) => {
    console.log('Datos recibidos en el backend:', userData);
    return await registerClient(userData);
});

async function createWindow() {
    try {
        const mainWindow = new BrowserWindow({
            width: 850,
            height: 600,
            autoHideMenuBar: true,
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false,
            },
        });

        mainWindow.loadURL(
            isDev
                ? 'http://localhost:3000'  // Revisa si este puerto está accesible
                : `file://${path.join(__dirname, '../dist/index.html')}`
        );
        mainWindow.webContents.openDevTools();

        console.log('Ventana de Electron creada y cargada correctamente');
    } catch (error) {
        console.error('Error al crear la ventana de Electron:', error);
    }
}

app.whenReady().then(async () => {
    await connectToDatabase();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
