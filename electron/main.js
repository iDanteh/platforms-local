const path = require('path');
const { app, BrowserWindow, ipcMain} = require('electron');
const mysql = require('mysql2/promise');
const isDev = process.env.IS_DEV == "true";
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
let dbConnection;
let whatsappClient;

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
        app.quit();
    }
}

// Configurar y manejar WhatsApp
async function initializeWhatsappClient(mainWindow) {
    whatsappClient = new Client();

    whatsappClient.on('qr', async (qr) => {
        // Generar el código QR y enviarlo al frontend
        const qrCodeDataUrl = await qrcode.toDataURL(qr);
        mainWindow.webContents.send('whatsapp-qr', qrCodeDataUrl); // Enviar QR al frontend
    });

    whatsappClient.on('ready', () => {
        console.log('WhatsApp está listo!');
        mainWindow.webContents.send('whatsapp-ready', 'WhatsApp está listo!');
    });

    try {
        await whatsappClient.initialize();
    } catch (error) {
        console.error('Error al inicializar WhatsApp:', error);
    }
}

async function createWindow() {
    try {
        const mainWindow = new BrowserWindow({
            width: 1650,
            height: 850,
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
        initializeWhatsappClient(mainWindow);
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

// Función para enviar mensaje a través de WhatsApp
ipcMain.handle('send-whatsapp-message', async (event, { phoneNumber, message }) => {
    try {
        // Asegurarnos de que el número esté en formato internacional (ej. +1234567890)
        const formattedPhoneNumber = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;

        console.log('Número de teléfono formateado:', formattedPhoneNumber);

        // Obtener el chat usando el número formateado
        const chat = await whatsappClient.getChatById(formattedPhoneNumber);

        // Enviar el mensaje al chat
        await chat.sendMessage(message);

        return { success: true, message: 'Mensaje enviado correctamente' };
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);

        // Verificar si el error es un problema de wid (número de teléfono inválido)
        if (error.message.includes('invalid wid')) {
            return { success: false, message: 'Número de teléfono inválido o no registrado en WhatsApp' };
        }

        return { success: false, message: 'No se pudo enviar el mensaje' };
    }
});

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
        return { success: true, message:'Cliente registrado', id: result.insertId };
    } catch (error) {
        console.log('Error en registro de cliente: ', error.message, error.stack);
        return { success: false, error: error.message };
    }
}

async function registerNewSubscription(subscriptionData) {
    try {
        const { fk_user, fk_Platform, perfil, password, start_date, finish_date, state, phone_user, platform, name_user, email} = subscriptionData;
        const [result] = await dbConnection.execute(
            'INSERT INTO subscription (fk_user, fk_Platform, perfil, password, start_date, finish_date, state, phone_user, platform, name_user, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [fk_user, fk_Platform, perfil, password, start_date, finish_date, state, phone_user, platform, name_user, email]
        );
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error('Error al registrar suscripción:', error);
        return { success: false, message: 'Error al registrar suscripción' };
        
    }
}

async function getAllSubscriptions() {
    try {
        const [rows] = await dbConnection.execute(
            'SELECT * FROM subscription'
        );
        return rows;
    } catch (error) {
        console.error('Error al obtener suscripciones:', error);
        return [];
        
    }
}

async function updateSubscription(updatedData) {
    try {
        const { id_Subscription, fk_user, fk_Platform, perfil, password, start_date, finish_date, state, phone_user, platform, name_user, email } = updatedData;
        await dbConnection.execute(
            'UPDATE subscription SET fk_user = ?, fk_Platform = ?, perfil = ?, password = ?, start_date = ?, finish_date = ?, state = ?, phone_user = ?, platform = ?, name_user = ?, email = ? WHERE id_Subscription = ?',
            [fk_user, fk_Platform, perfil, password, start_date, finish_date, state, phone_user, platform, name_user, email, id_Subscription]
        );
        return true;
    } catch (error) {
        console.error('Error al actualizar suscripción:', error);
        return false;
    }
}

// Buscar suscripciones por nombre de usuario
ipcMain.handle('searchSubs', async (event, searchQuery) => {
    try {
        console.log('Buscando suscripciones con:', searchQuery); // Log para verificar la consulta
        const [rows] = await dbConnection.execute(
            'SELECT * FROM subscription WHERE name_user LIKE ?',
            [`%${searchQuery}%`]
        );
        console.log('Resultados de la búsqueda:', rows); // Log para verificar los resultados
        return rows;
    } catch (error) {
        console.error('Error al buscar suscripciones:', error);
        return [];
    }
});

// Buscar usuarios por nombre
ipcMain.handle('searchUsers', async (event, searchQuery) => {
    try {
        console.log('Buscando usuarios con:', searchQuery); // Log para verificar la consulta
        const [rows] = await dbConnection.execute(
            'SELECT * FROM users WHERE nombre_user LIKE ?',
            [`%${searchQuery}%`]
        );
        console.log('Resultados de la búsqueda:', rows); // Log para verificar los resultados
        return rows;
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        return [];
    }
});

// Validar credenciales de inicio de sesión
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

// Registrar un nuevo usuario
ipcMain.handle('registerUser', async (event, userData) => {
    console.log('Datos recibidos en el backend:', userData);
    return await registerUser(userData);
});

// Registrar un nuevo cliente
ipcMain.handle('registerClient', async (event, userData) => {
    console.log('Datos recibidos en el backend:', userData);
    const result = await registerClient(userData);
    return result;
});

// Registrar una nueva suscripcion
ipcMain.handle('registerNewSubscription', async (event, subscriptionData) => {
    console.log('Datos de la suscrpción:', subscriptionData);
    return await registerNewSubscription(subscriptionData);
});

// Obtener todas las suscripciones
ipcMain.handle('getAllSubscriptions', async (event) => {
    return await getAllSubscriptions();
});

// Actualizar una suscripción
ipcMain.handle('updateSubscription', async (event, updatedData) => {
    console.log('Datos de la suscripción actualizada:', updatedData);
    return await updateSubscription(updatedData);
});

/* Visualizar clientes */
ipcMain.handle('viewClients', async ()=>{
    try {
        const result = await dbConnection.execute('select * from users');
        if (result[0].length > 0) {
            return { success: true, clients: result[0]};
        } else {
            return { success: false, message: 'No se encontraron los clientes' };
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return {success:false, message:'Error al obtener los clientes'};
    }
});
/*Update  clientes*/
ipcMain.handle('UpdateInfoClients', async (event, dataUser, idUser) => {
    try {
        const result = await dbConnection.execute('UPDATE users SET nombre_user = ?, apellido_pat = ?, apellido_mat = ?, phone_user = ?, email = ?, password = ? WHERE id_User = ?', 
            [dataUser.nombre_user, dataUser.apellido_pat,dataUser.apellido_mat,dataUser.phone_user, dataUser.email, dataUser.password, idUser]);

        return { success: result[0].affectedRows > 0 };
    } catch (error) {
        console.error('Error actualizando cliente:', error);
        return { success: false, message: 'Error al actualizar el cliente del id:',idUser };
    }
});
/*Delete clientes */
ipcMain.handle('deleteClient', async (event, delUser) => {
    try {
        const result = await dbConnection.execute('DELETE FROM users WHERE id_User = ?', [delUser]);
        return { success: result[0].affectedRows > 0 };
    } catch (error) {
        console.error('Error eliminando el cliente:', error);
        return { success: false, message: 'Error al eliminar el cliente' };
    }
});
