const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const app = express();
const port = 3001;

// Middleware
app.use(express.json());

// Conexión a la Base de Datos
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('motorcycles');
        console.log('La conexión a la Base de Datos fue Exitosa!!!');
    } catch (error) {
        console.error('Uff ha ocurrido un error ',error);
    }
}
// Invocando a la Función
connectDB();
// Creando nuestras rutas
app.post('/motos', async (req,res)=>{
    try {
        const {name, description, price, image} = req.body;
        const result = await db.collection('products').insertOne({name,description,price,image});
        res.status(201).json({id: result.insertedId});
    } catch (error) {
        res.status(500).json({error: 'Error al crear el producto'});
    }
})
// Ruta para listar las motos
app.get('/motos', async (req,res)=>{
    try {
        const motorcycles = await db.collection('products').find().toArray();
        res.status(200).json(motorcycles);
    } catch (error) {
        res.status(500).json({error: 'Error al tratar de obtener las motos'});
    }
});

// Actualizar un documento de nuestra coleción
app.put('/motos/:id',  async (req,res)=>{
    try {
        const id = req.params.id;
        const {name, description,price,image} = req.body; 
        const result = await db.collection('products').updateOne(
           {_id : new ObjectId(id)},
           {$set : {name,description,price,image}}
        ) 
        if(result.matchedCount=== 0){
            return res.status(404).json({message: 'Moto no encontrada'})
        }  
        res.status(200).json({message: 'Moto actualizada'});
    } catch (error) {
        res.status(500).json({error: 'Error al tratar de actualizar la moto'});
    }
})

// Ruta para eliminar documentos
app.delete('/motos/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const result = await db.collection('products').deleteOne(
            {
                _id: new ObjectId(id)
            }
        );
        if(result.deletedCount === 0){
            return res.status(404).json({message: 'Documento no encontrado'});        
        }
        res.status(200).json({message: 'Moto eliminada'});
    } catch (error) {
        res.status(500).json({error: 'Error al tratar de eliminar la moto'});        
    }
})
// Ruta para el detalle de un documento
app.get('/motos/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const result = await db.collection('products').findOne(
            {
                _id : new ObjectId(id)
            }
        );
        if(!result){
            return res.status(404).json({error: 'Moto no encontrada'})
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: 'Error al tratar de obtener la moto'});                
    }
})







app.listen(port, ()=>console.log(`Servidor corriendo en el puerto ${port}`));