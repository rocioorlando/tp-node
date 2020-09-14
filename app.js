const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());

// String de conexión con la base de datos
const uri = "mongodb+srv://grupo_tres:123hola@cluster0.b6m6q.mongodb.net/biblioteca?retryWrites=true&w=majority";

async function conectar() {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch(e){
        console.log(e);
    }
};

conectar();

// Paso 1: definir esquema/s
const BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    gender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "generos"
    },
    lended: String
});

// Paso 2: Armo el modelo
const LibroModel = mongoose.model("libros", BookSchema);

// CRUD de Libro - Create Read Update Delete
// Create post

app.post("/libro", async (req, res)=>{
    try {
        // verificacion de la info que recibo;
        let name = req.body.name;
        let author = req.body.author;
        let gender = req.body.gender;
        let lended = req.body.lended;

        if(name == undefined){
            throw new Error("No enviaste nombre");
        }
        if(author == undefined){
            throw new Error("No enviaste autor");
        }
        if( gender == undefined){
            throw new Error("No enviaste genero");
        }
        if(lended == undefined){
            throw new Error("No enviaste datos");
        }
        if(name == ''){
            throw new Error("El nombre no puede estar vacio");
        }
        if(author == ''){
            throw new Error("El autor no puede estar vacio");
        }
        if(gender == '' ){
            throw new Error("El  genero no puede estar vacio");
        }
        if(lended == ''){
            throw new Error("El prestamo no puede estar vacio");
        }

        let book = {
        name:  name,
        author: author,
        gender: gender,
        lended: lended
        }

        let bookSave = await LibroModel.create(book);
        
        console.log(bookSave);
        res.status(200).send(bookSave);
    }
     catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

//Delete 

app.delete("/libro/:id", async (req, res)=>{
    try{
        let id = req.params.id;

        let respuesta = null;

        respuesta = await LibroModel.findByIdAndDelete(id);

        let LibroGuardado = await LibroModel.findById(id);

        LibroGuardado.deleted = 1;

        await LibroModel.findByIdAndUpdate(id, LibroGuardado);

        res.status(200).send({"message": "OK"})
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

// Get, para todos los libros
app.get("/libro", async (req, res)=>{
    try{
        let respuesta = null;

        respuesta = await LibroModel.find({deleted:0});

        res.status(200).send(respuesta);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e})
    }
});

// Get para los libros por id
app.get("/libro/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let respuesta = null;

        respuesta = await LibroModel.findById(id);

        res.status(200).send(respuesta);

    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e})
    }
});

//  put
app.put("/libro/:id", async (req, res)=>{
    try{
        // verificacion de la info que recibo;
        let name = req.body.name;
        let author = req.body.author;
        let gender = req.body.gender;
        let lended = req.body.lended;
  
        if(name == undefined){
            throw new Error("No enviaste nombre");
        }
        if(author == undefined){
          throw new Error("No enviaste autor");
        }
        if( gender == undefined){
          throw new Error("No enviaste genero");
        }
        if(lended == undefined){
          throw new Error("No enviaste datos");
        }
        if(name == ''){
          throw new Error("El nombre no puede estar vacio");
        }
        if(author == ''){
          throw new Error("El autor no puede estar vacio");
        }
        if(gender == '' ){
          throw new Error("El  genero no puede estar vacio");
        }
        if(lended == ''){
          throw new Error("El prestamo no puede estar vacio");
        }
  
        let book = {
        name:  name,
        author: author,
        gender: gender,
        lended: lended
        }
  
        let bookSave = await LibroModel.create(book);
          
        console.log(bookSave);
        res.status(200).send(bookSave);


    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e})
    }
});



// CRUD de Genero - Create Read Update Delete
// Create post

const GeneroSchema = new mongoose.Schema({
    name : String,
    deleted: Number
});

const GeneroModel = mongoose.model("generos", GeneroSchema);



// API /genero
app.get("/genero", async (req, res)=>{
    try{
        let respuesta = null;

        respuesta = await GeneroModel.find({deleted: 0});
        
        res.status(200).send(respuesta);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.get("/genero/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let respuesta = null;

        respuesta = await GeneroModel.findById(id);

        res.status(200).send(respuesta);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.post("/genero", async (req, res)=>{
    try{
        let name = req.body.name;

        if(name == undefined){
            throw new Error("Tenes que enviar un titulo");
        }

        if(name == ""){
            throw new Error("El titulo no puede ser vacio");
        }

        let existeName = null;

        existeName = await GeneroModel.find({name: name.toUpperCase()});

        if(existeName.length > 0){
          throw new Error("Ese genero ya existe");  
        }

        let genero = {
            name: name.toUpperCase(),
            deleted: 0
        }

        await GeneroModel.create(genero);

        res.status(200).send(genero);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.delete("/genero/:id", async (req, res)=>{
    try{
        let id = req.params.id;

        let respuesta = null;

        respuesta = await GeneroModel.findByIdAndDelete(id);

        let generoGuardado = await GeneroModel.findById(id);

        generoGuardado.deleted = 1;

        await GeneroModel.findByIdAndUpdate(id, generoGuardado);

        res.status(200).send({"message": "OK"})
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.put("/genero/:id", async (req, res)=>{
    try{
        // Validación de datos
        let name = req.body.name;
        let id = req.params.id;

        if(name == undefined){
            throw new Error("Tenes que enviar titulo");            
        }

        if(name = ""){
            throw new Error("El titulo no puede ser vacio");
        }

        // Verificamos condiciones para poder modificar
        let generoExiste = await GeneroModel.find({"name": name});

        if(generoExiste.length > 0){
            generoExiste.forEach(unGenero => {
                if(unGenero.id != id){
                    throw new Error("Ya existe ese genero");
                }
            });
        }

        let librosConEseGenero = null;
        
        librosConEseGenero = await LibroModel.find({"genero": id});

        if(librosConEseGenero.length > 0){
            throw new Error("No se puede modificar, hay libros asociados");
        }

        let generoModificado = {
            name: name
        }

        await GeneroModel.findByIdAndUpdate(id, generoModificado);

        res.status(200).send(generoModificado);

    
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});




app.listen(3000, ()=>{
    console.log("Servidor escuchando en el puerto 3000");
});





