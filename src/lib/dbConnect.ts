import mongoose from 'mongoose'


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}



async function dbConnect(): Promise<void> {
    
    if(connection.isConnected) return console.log("Already connected to Database")

    try {
        const dbConnection = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConnected = dbConnection.connections[0].readyState

        console.log("DB Connected Successfully")
    } catch (error) {
        console.log("DB Connected Failed", error)

        process.exit(1)        
    }
}

export default dbConnect;