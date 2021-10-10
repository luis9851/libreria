

const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyparser = require('body-parser');
const app = express();
const port = 3000;
var CryptoJS = require("crypto-js");
const { checkServerIdentity } = require('tls');
const { json } = require('body-parser');
const jwt = require ('jsonwebtoken');
const config = require('./config');
const encrypt = require('./encrypt')
const verifiToken  = require('./verifyToken')
const { addSyntheticLeadingComment } = require('typescript');
const decrypted = require('./decrypt');
const decryptedInfo = require('./decryptInfo');

/*var corsOptions = {
    origin:'http://10.0.0.4',
    optionSuccessStatus: 200
};*/

const _key = 'DAPP'

var heroes=[{}];

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}))
const url= "mongodb+srv://DescubreShop:museodescubre@cluster0-l1v0g.mongodb.net/<dbname>?retryWrites=true&w=majority"
const dbName ="Descubre_Shop";

const client = new MongoClient(url, {useNewUrlParser: true , useUnifiedTopology: true})



app.listen(port, function(){
    console.log('Server running')
})

/*
app.get('/api/heroes', function(req, res){
    console.log(heroes)
    res.json(heroes)
})

app.get('/api/heroe/:id', function(req, res){
    res.json(heroes[req.params.id])
})

*/
collection = "products";

app.get('/api/products/:search', async function(req, res){
    const name = req.params.search;
    const query = {Titulo: {$regex: '.*' + name + '.*',$options:"-i"}}
    var result;

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

    try{

        if(name){
            
            result = await db.collection("Libros").find(query).toArray();

            res.json(result)

        }

    }finally{
        client.close();
    }
})






app.get('/api/max', function(req, res){
    client.connect(function(err){
        if(err) throw err;
        var dbo = client.db(dbName);
        dbo.collection("users").aggregate({}).sort({_id:-1}).limit(1).toArray(function(err,result){
            if (err) throw err;
            res.json(result);
        })
    })
})


app.get('/api/maxhab', function(req, res){
    client.connect(function(err){
        if(err) throw err;
        var dbo = client.db(dbName);
        dbo.collection("listingsAndReviews").aggregate({}).sort({_id:-1}).limit(1).toArray(function(err,result){
            if (err) throw err;
            res.json(result);
        })
    })
})


app.get('/api/explore', function(req, res){
    client.connect(function(err){
        if(err) throw err;
        var dbo = client.db(dbName);
        dbo.collection("listingsAndReviews").aggregate([
            { $lookup:
               {
                 from: 'Customer',
                 localField: 'identifier_user',
                 foreignField: '_id',
                 as: 'fin'
               }
             }
            ]).toArray(function(err,result){
            if (err) throw err;
            res.json(result);
        })
    })
})


app.get('/api/user/:id', function(req, res){
    console.log("Accesed, "+req.params.id)
    client.connect(function(err){
        if(err) throw err;
        var dbo = client.db(dbName);
        var query={_id:parseInt(req.params.id)}//cambio
        //var query={_id: req.params.id}//cambio
        console.log(query);
        dbo.collection("Customer").findOne(query,function(err,result){
            if (err) handleError(res,err.message,"Failed to get document");//Cambio
            res.json(result);
        })
    })
})



app.post('/api/check/', encrypt, async function(req, res, next){
    var correo = req.body.email;
    var passw = req.body.pass;
    var query={email:correo}//cambio
    var bytes  = CryptoJS.AES.decrypt(passw, 'desc_');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    var result
    var fin
    var bytes2

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

    try {
         result = await db.collection("users").findOne(query);
         
         if(result == null){
            fin = {status: "none"}
    }else{
            
            bytes2  = CryptoJS.AES.decrypt(result.password, 'desc_')

                    if(result.password == passw){
                    
                        const Token = jwt.sign({id: result._id},config.secret,{
                            expiresIn: 60 * 60 *24
                        })

                        try{

                            var process = await db.collection("users").updateOne({_id: result._id},{$set:{accessToken: Token, Arranque: false}})
                            
                            console.log(process)
                            if(process.modifiedCount == 1){
                                fin = {status: 200, accessToken: Token, _identity: req.userEmail, arranque: result.Arranque}
                            }

                        }finally{
                            client.close()
                        }
            
                            
            
                    }else{
                        fin = {status: 403}    
                    }
         }
    }
     finally {
         client.close();
     }

     res.json(fin)

    
})






app.get('/api/buscar/:termino', function(req, res){
    client.connect(function(err){
        if(err) throw err;
        var dbo = client.db(dbName);
        var val=req.params.termino;
        var query={nombre: {$regex: '.*' + val + '.*',$options:"-i"}} //Cambio esto
        console.log(query);
        dbo.collection(collection).find(query).toArray(function(err,result){
            if (err) throw err;
            res.json(result);
        })
    })
})




app.get('/api/getCart',decrypted, async function(req, res){

    const email = req.userEmail;
    const token = req.userId;
    let idProd = req.body.id
    let quantity = req.body.quantity
    var result;
    var resultProd;
    const query={$and:[{email: email.toString()},{accessToken: token}]}

       

    
    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

    try {

         result = await db.collection("users").findOne(query);


         if(result != null){

            try{

                const get = await db.collection("users").aggregate([ 
                                        {$match:{_id: result._id}},                    
                                         { $lookup:                    
                                             {                       
                                                 from: 'products',                       
                                                 localField: 'cart.itemIdentifier',                       
                                                 foreignField: '_id',                       
                                                 as: 'Cart'                     
                                            }                   
                                        },{$unwind: "$cart"},
                                        {$project: 
                                            {items:
                                                {$filter:
                                                    {input: "$Cart", as: "item", 
                                                    cond:{ $eq:["$$item._id", "$cart.itemIdentifier"]}}},
                                                    "cart": 1}}]).toArray(function(err,result){
                                                        if (err) throw err;
                                                        res.json(result);
                                            })

            }finally{

                client.close()

            }            

         }else{

            res.status(401).send()
         }

    }finally{
        client.close()
    }
    
})


app.get('/getCartTotal',decrypted, async function(req, res){

    const email = req.userEmail;
    const token = req.userId;
    let idProd = req.body.id
    let quantity = req.body.quantity
    var result;
    var resultProd;
    const query={$and:[{email: email.toString()},{accessToken: token}]}

       

    
    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

        try {

            result = await db.collection("users").findOne(query);

            if(result != null){

                try{

                    const get = await db.collection("users").aggregate([
                                                                    {$match:{_id: result._id}},
                                                                        {$project:
                                                                            {total:
                                                                                {$sum : "$cart.total"}
                                                                                ,_id:0}}]).toArray(function(err,result){
                                                                                            if (err) throw err;
                                                                                            res.json(result);
                                                                                })

                }finally{

                    client.close()
                }



            }else{
                res.status(401).send()
            }
        }finally{
            client.close()
        }
    })



app.post('/api/create-book', function(req,res){ 
   
    
    var title = req.body.title; 
    var Editorial =req.body.Editorial; 
    var Autor = req.body.Autor;
    var Clave = req.body.Clave; 
    var Precio = req.body.Precio;
    var disp=req.body.disp; 
    var ruta=req.body.ruta; 
  
    console.log(req.body)
  
   
    client.connect(function(err){
        if(err) throw err;

    var dbo = client.db(dbName);

    var query={Clave:Clave}//cambio
    //var query={_id: req.params.id}//cambio
    
    dbo.collection("Libros").findOne(query,function(err,result){
        if (err) throw res.err;//Cambio
                
            if(result == null){

                dbo.collection("Libros").aggregate({}).sort({_id:-1}).limit(1).toArray(function(err,result){
                    if (err) throw err;

                    var data = { 
                        "_id": parseInt(result[0]._id) + 1,
                        "Titulo": title,
                        "Editorial": Editorial, 
                        "Autor":Autor, 
                        "Clave":Clave,
                        "Precio":Precio,
                        "UnidadesDisponibles":disp,   
                        "RutaDeImagen":ruta,
                        "activo": true

                    } 
                    dbo.collection('Libros').insertOne(data,function(err, result){ 
                        if (err) throw err;   
                        console.log("Record inserted Successfully"); 
                        res.json(result);
                        //res.json({status:200});
        
                    }); 
                    
                })
            }else{

                    res.json(result);
                    console.log(" ya existente")
            }
    })

       

})
          
}) 


app.post('/likes', function(req,res,next){ 
 client.connect(function(err){
        if(err) throw err;
        var _id = parseInt(req.body.id);  
        var like = parseInt(req.body.like); 
        
        console.log(like)

    var dbo = client.db(dbName);
dbo.collection('listingsAndReviews').updateOne({"_id":_id},{$set:{"likes":like}},function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
        client.close();  
             })

        })
          
})

app.post('/cart', decrypted, async function(req,res,next){ 
    const email = req.userEmail;
    const token = req.userId;
    let idProd = req.body.id
    let quantity = req.body.quantity
    var result;
    var resultProd;
    const query={$and:[{email: email.toString()},{accessToken: token}]}

       

    
    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

    try {

         result = await db.collection("users").findOne(query);


         if(result != null){

                   


                        try{

                            resultProd = await db.collection("products").findOne({_id: parseInt(idProd)});

                            if(resultProd != null){

                                try{

                                    const prize = parseFloat(resultProd.Precio); 
                                    const total = prize * quantity;


                                    const CheckCart = await db.collection("users").aggregate([{$match: {_id: parseInt(result._id)}},{$project:{status:{$in:[parseInt(idProd),"$cart.itemIdentifier"]}}}]).toArray()

                                   

                                    if(CheckCart[0].status == false){

                                        try{

                                                const updateCart = await db.collection("users").updateOne(query, {$push:{"cart":{ itemIdentifier: parseInt(idProd), quantity: quantity, total: total}}})

                                                if(updateCart.modifiedCount == 1){
                                                    res.status(200).json({status: 1})
                                                }else{
                                                    res.status(500).json({status: 2})
                                                }

                                        }finally{

                                            client.close()
                                        }


                                    }else{

                                        res.status(200).json({status: 3})

                                    }

                                }finally{

                                    client.close()

                                }

                            
                            }else{

                                res.status(404)
                                
                            }

                        }finally{

                            client.close()

                        }


         }else{

                
                console.log("invitado")

                res.status(401).json({status: 0})

         }

    }finally{

            client.close()

         }

    
             
 }) 
   


app.post('/api/upload-hab', function(req,res){ 
    var _id = req.body._id; 
    var identifier_user = req.body.identifier_user;  
    var name = req.body.name; 
    var largo =req.body.largo; 
    var ancho = req.body.ancho; 
    var summary =req.body.summary; 
    var house_rules=req.body.house_rules; 
    var property_type=req.body.property_type; 
    var minimum_nights=req.body.minimum_nights; 
    var maximum_nigths=req.body.maximum_nigths; 
    var bedrooms=req.body.bedrooms;
    var beds=req.body.beds;
    var bathrooms=req.body.bathrooms;
    var price=req.body.price;
    var latitude=req.body.latitude;
    var longitude=req.body.longitude;
    var picture_url = req.body.picture_url;
  
    
    var data = { 
        "_id": _id,
        "identifier_user":identifier_user,
        "date": new Date(),
        "name": name, 
        "largo":largo, 
        "ancho":ancho,
        "summary":summary, 
        "house_rules":house_rules,
        "property_type":property_type,
        "minimum_nights":minimum_nights,
        "maximum_nigths":maximum_nigths,
        "bedrooms":bedrooms,
        "beds":beds,
        "bathrooms":bathrooms,
        "price":price,
        "picture_url": picture_url,
        "coordinates":{"longitude":longitude,"latitude":latitude},
        "likes": 0
        
       
    } 
    client.connect(function(err){
        if(err) throw err;

    var dbo = client.db(dbName);
dbo.collection('listingsAndReviews').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 

})
          
}) 



app.get('/api/home', async function(req, res, next) {
    //let email = req.userEmail;
   // let token = req.userId;
    var query={$and:[{email: email.toString()},{accessToken: token}]}
    var result;
    var cart
    
    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

    try{

        result = await db.collection("users").findOne(query);

        if(1 != 0){
                res.json({invited: true})
        }else{

            var home;
            
                      await db.collection('products').aggregate([
                        { $lookup:
                            {
                            from: 'users',
                            localField: 'Like.id',
                            foreignField: '_id',
                            as: 'Favoritos'
                            }
                        },
                        {
                            $project:{
                                status:{
                                        $in: [result._id, "$Like.id"]
                                     },
                                Nombre: 1,
                                Cantidad: 1,
                                Descripcion: 1,
                                Precio: 1,
                                invited: {$toBool: false},
                                cart: {$toInt: result.cart.length}
                               

                                
                            }
                        
                        }]).toArray(function(err, result) {
                                            if (err) throw err
                                             res.json(result)
                                    
                                        
                                    })

                        
        }


    }finally{
        client.close();
    }
   

})





app.get('/api/home-guest',decrypted,async function(req, res) {
    var result;
    let email = req.userEmail;
    let token = req.userId;

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);
    var query={$and:[{email: email.toString()},{accessToken: token}]}

    try {
        result = await db.collection("users").findOne(query);
        
        if(result == null){
           fin = {status: 504}
        }else{
           
            try{

                result = await db.collection("Libros").find().toArray();
                res.json(result)
 
            }finally{
                client.close()
             }
        }
     }finally {
        client.close();
    }


    
});

app.get('/api/verify',decrypted,async function(req, res) {
    var result;
    let email = req.userEmail;
    let token = req.userId;
    var admin = false;
    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);
    var query={$and:[{email: email.toString()},{accessToken: token}]}

    try {
        result = await db.collection("users").findOne(query);
        admin = result.admin;
        
        if(result == null){
           res.json({status: 504});
        }else{
            
            if(admin == true){
                res.json({user: result.email ,status: 200, admin: true})
            }else{
                res.json({user: result.email,status: 200, admin: false})
            }
            
        }
     }finally {
        client.close();
    }


    
});



app.get('/api/libro/:id', async function(req, res, next){
    let email = req.userEmail;
    let token = req.userId;
    const idProd = parseInt(req.params.id) 
    var send
    console.log(idProd)

    var resultUser;

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

    try{

              if(1==1){


                            try{

                                 send =  await db.collection('Libros').findOne({_id: idProd}).then(result =>{
                                     res.json(result)
                                     console.log(result)
                                 })

                               
                            }finally{

                                client.close()
                            }


                    }else {


                        var query={$and:[{email: email},{accessToken: token}]}//cambio

                                try{

                                           resultUser = await db.collection('users').findOne(query)

                                           if(resultUser != null){

                                                  const send =  await db.collection('products').findOne({_id: parseInt(req.params.id)})

                                                  res.status(200).json(send)
                                           }else{

                                                    res.json({status: 401})

                                           }


                                }finally{
                                    client.close()
                                }
                            
                       

                    }


    }finally{

        client.close()

    }


       
});



/* app.get('/api/home-guest', function(req, res) {
    client.connect(function(err) {
        if (err) throw err;
        var dbo = client.db(dbName);
        dbo.collection("products").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
    
}) */

app.get('/perfil',decrypted, async function(req, res,next){
    /* await client.connect(function(err){
         if(err) throw err;*/
          let token = req.userId;
          const Email = req.userEmail
          const idUser = req.params.id
          var send

          var query={$and:[{ email: Email.toString()},{ accessToken: token}]}
           

 
          let client = await MongoClient.connect(url,
         { useNewUrlParser: true, useUnifiedTopology: true });
 
         let db = client.db(dbName);
         
          
         try{
 
             if(Email){
 
                 try{
 
                     send =  await db.collection('users').findOne(query).then(result =>{
                         res.status(200).json(result)
                     })
 
                     console.log(send)
 
                   
                }finally{
 
                    client.close()
                }
 
 
             }
         }finally{
 
         client.close()
 
     }
         
 })

 app.post('/api/update/:id/:Telefono', async function (req, res,next) {
    await client.connect(function (err) {
        if (err) throw err;

        var dbo = client.db(dbName);
        var query = { _id: parseInt(req.params.id) };
        var value = { $set: { Telefono: parseInt(req.params.Telefono) } };
        console.log(query);
        console.log(value);
        dbo.collection('users').updateOne(query, value, function (err, result) {
            if (err) throw handleError(res, err.messahe, "Failed to update documents", 500);
            res.json("Documento Actualizado");
        });
    });
});

app.post('/api/update-email/:id/:email', async function (req, res,next) {
    await client.connect(function (err) {
        if (err) throw err;

        var dbo = client.db(dbName);
        var query = { _id: parseInt(req.params.id) };
        var value = { $set: { email:(req.params.email).toString() } };
        console.log(query);
        console.log(value);
        dbo.collection('users').updateOne(query, value, function (err, result) {
            if (err) throw handleError(res, err.messahe, "Failed to update documents", 500);
            res.json("Documento Actualizado");
        });
    });
});

app.post('/api/new-Direccion/:id/:Direccion', async function(req,res,next){ 
    await client.connect(function(err){
        if(err) throw err;
     var dbo = client.db(dbName);
     var query = { _id: parseInt(req.params.id) };
        var value = { $push: {Direccion: {id:req.params.Direccion} } };   
        //{$push: {Direccion: {id: Direccion}}};
        console.log(query);
        console.log(value);
      dbo.collection('users').updateOne(query, value,function(err, result){ 
        if (err) handleError(res, err.message, "Failed to insert documents");
            res.json(result);

    }); 

});
          
});

app.post('/favorites', decrypted, async function(req,res, next){ 
    const idCliente = req.userId
    var result 
    const idProd = req.body.id
    const Email = req.userEmail


    
    var query={$and:[{email: Email.toString()},{accessToken: idCliente}]}
    

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);



    try{

        result = await db.collection("users").findOne(query) 
        
            if(result != null){
                
                    const state = await db.collection("products").updateOne({_id: idProd},{$push:{Like:{id: result._id}}})

                    if(state.modifiedCount == 1){
                        res.json({statusLike: true})
                    }else{
                        res.json({statusLike: false})
                    }

            }else{
                res.json({statusLike: false})
            }

    }finally{
        client.close();
    }

  
          
});


app.post('/favoritesRemove', decrypted, async function(req,res, next){ 
    const idCliente = req.userId
    var result 
    const idProd = req.body.id
    const Email = req.userEmail


    
    var query={$and:[{email: Email.toString()},{accessToken: idCliente}]}
    

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);



    try{

        result = await db.collection("users").findOne(query) 
        
            if(result != null){
                
                    const state = await db.collection("products").updateOne({_id: idProd},{$pull:{Like:{id: result._id}}})

                    if(state.modifiedCount == 1){
                        res.json({statusLike: true})
                    }else{
                        res.json({statusLike: false})
                    }

            }else{
                res.json({statusLike: false})
            }

    }finally{
        client.close();
    }

  
          
});

app.get('/api/shared', async function (req, res,next) {
    await client.connect(function(err){
       if(err) throw err;
    var dbo = client.db(dbName);
   dbo.collection('products').aggregate([
       { $lookup:
       {
         from: 'users',
         localField: 'Like.id',
         foreignField: '_id',
         as: 'Favoritos'
       }
     },
     {$project:
       {"Nombre":1,"Precio":1,"Favoritos":1} //Costo o Precio
   } 
   ]).toArray(function(err, result) {
       if (err) throw err
           res.json(result);


   });
 }); 
});


app.get('/api/history',decrypted, async function (req, res,next) {
   

    const idCliente = req.userId
    var result 
    const idProd = req.body.id
    const Email = req.userEmail



    
    var query={$and:[{email: Email.toString()},{accessToken: idCliente}]}
    

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);



    try{

        result = await db.collection("users").findOne(query)


        if(result != null ){

            try{

                await db.collection("users").aggregate([
                                         {$match:{_id: 2}},
                                                              { $lookup:
                                                                  {
                                                                   from: 'products',
                                                                   localField: 'record.id',                       
                                                                   foreignField: '_id',                       
                                                                   as: 'Historial'                    
                                                                 }                   
                                                            },
                                                            {$unwind: "$record"},
                                                            {$project:{items:{$filter:
                                                                {input: "$Historial", 
                                                                as: "item", 
                                                                cond:{ $eq:["$$item._id", 
                                                                "$record.id"]}}}, 
                                                                "record": 1}}]).toArray(function(err, result) {
                                                                                if (err) throw err
                                                                                res.json(result);        
                                                                                                                                    
                                                                                      });

            }finally{
                
                client.close()
            }

        }else{

            res.status(401).json({status: false})

        }
        
    }finally{
        client.close()
    }
});


app.get('/api/getItems',decrypted, async function (req, res,next) {
   

    const idCliente = req.userId
    var result 
    const idProd = req.body.id
    const Email = req.userEmail



    
    var query={$and:[{email: Email.toString()},{accessToken: idCliente}]}
    

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);



    try{

        result = await db.collection("users").findOne(query)


        if(result != null){

            try{

                res.status(200).json({items: parseInt(result.cart.length)})

            }finally{
                 client.close()
            }


        }else{

            res.status(401).send()
        }
    }finally{

        client.close()
    }

})


app.post('/InsertHistory', decrypted, async function(req,res, next){ 
    const idCliente = req.userId
    var result 
    const idProd = req.body.id
    const Email = req.userEmail


    
    var query={$and:[{email: Email.toString()},{accessToken: idCliente}]}
    

    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);



    try{

        result = await db.collection("users").findOne(query) 
        
            if(result != null){


                try{

                    const checkResult = await db.collection('users').aggregate([
                                                                    {$match:{_id: result._id}},
                                                                     {$project:{status:{$in:[parseInt(idProd), "$record.id"]}}}
                                                                    ]).toArray()
                                                                    
                                if(checkResult[0].status == false){

                                    try{

                                            const state = await db.collection("users").updateOne({_id: result._id},{$push:{record:{id: parseInt(idProd), date: new Date()}}})
                
                                            if(state.modifiedCount == 1){
                                                res.json({statusrecord: true})
                                            }else{
                                                res.json({statusrecord: false})
                                            }
                
                                            }finally{
                            
                                                    client.close()
                            
                                            }


                                }else{

                                            try{

                                                const state = await db.collection("users").updateOne({_id: result._id},{$pull:{record:{id: parseInt(idProd)}}})
                    
                                                if(state.modifiedCount == 1){

                                                    try{

                                                             const state = await db.collection("users").updateOne({_id: result._id},{$push:{record:{id: parseInt(idProd), date: new Date()}}})

                                                             if(state.modifiedCount == 1){
                                                                 res.status(200).send();
                                                             }


                                                    }finally{
                                                            client.close()
                                                    }                                                    
                                           
                                                }else{
                                                    res.json({statusrecord: false})
                                                }
                    
                                                }finally{
                                
                                                        client.close()
                                
                                                }


                                }

                }finally{

                    client.close();

                }
                
                  

            }else{
                res.json({statusrecord: false})
            }

    }finally{
        client.close();
    }

  
          
});


app.get('/Pagarpeypal',decrypted, async function(req, res){

    const email = req.userEmail;
    const token = req.userId;
    let idProd = req.body.id
    let quantity = req.body.quantity
    var result;
    var resultProd;
    const query={$and:[{email: email.toString()},{accessToken: token}]}

       

    
    let client = await MongoClient.connect(url,
        { useNewUrlParser: true, useUnifiedTopology: true });

    let db = client.db(dbName);

        try {

            result = await db.collection("users").findOne(query);

            if(result != null){

                try{

                    const get = await db.collection("products").aggregate([
                        {$match:{_id: result._id}},
                        {$project:
                            {total:
                                {$sum : "$cart.total"}
                                ,_id:0}}]).toArray(function(err,result){
                                   consol.log(Precio)        
                                         if (err) throw err;
                                               res.json(result);
                            })

                }finally{

                    client.close()
                }



            }else{
                res.status(401).send()
            }
        }finally{
            client.close()
        }
    })

     
    

    app.put('/api/add/:reg', async function(req,res){ 
        var registro = JSON.parse(req.params.reg);  
        /* console.log(registro); */
        var _id;
        var FirstName = registro.FirstName; 
        var LastName = registro.LastName; 
        var Telefono = parseInt(registro.Telefono);
        var Address = registro.Address;   
        var Correo = registro.email;
        var Pass = registro.password;


        client.connect(function(err){
            if(err) throw err;
            var dbo = client.db(dbName);
            var query={email:Correo}//cambio
            console.log(query);
            //var query={_id: req.params.id}//cambio
            dbo.collection("users").findOne(query,function(err,result){
                if (err) throw res.err;//Cambio

                    if(result == null){
                        dbo.collection("users").find().sort({_id: -1}).limit(1).toArray(function(err,res1){
                            if(err) throw err;
                            var data = { 
                                "_id" : parseInt(res1[0]._id)+1,
                                "FirstName": FirstName, 
                                "LastName":LastName, 
                                "email":Correo,
                                "Direccion": [{id: Address}],
                                "Telefono":Telefono, 
                                "Status": true,
                                "admin": false,
                                "password":Pass,
                                "Arranque":true
                            }
                            
                            console.log(data);
                            if(res1==null){
                                res.json({error:"Error de servidor"})
                            }else{
                                dbo.collection('users').insertOne(data,function(err, result1){ 
                                    if (err) throw err; 
                                    console.log("Record inserted Successfully"); 
                                    //res.json(result);
                                    res.json({status:"Registrado"});
                                });
                            }
                        });
                        
                    
                    }else{
                        res.json(result);
                        console.log("Usuario ya existente")
                    }
            })
    
        })
              
    })


    app.delete('/api/libro/:id', function(req,res){
        console.log("Borrar");
        client.connect(function(err){
            if(err) throw err;
            var dbo = client.db(dbName);
            var query = { _id: parseInt(req.params.id)};
            var value = { $set:{activo: false}};
    
            dbo.collection("Libros").updateOne(query, value, function(err, result){
                if (err) throw handleError(res, err.message, "Failed to update documents", 5000);
                res.json("Documento borrado");
            })
        })
    });

    app.post('/api/editar/:edit', function(req,res){
        console.log("Editar");
        var modificar = JSON.parse(req.params.edit);
        var id = modificar._id;
        var precio = modificar.Precio;
        var Cantidad = modificar.UnidadesDisponibles;
        client.connect(function(err){
            if(err) throw err;
            var dbo = client.db(dbName);
            /* var dato = {
                "Precio": parseInt(precio),
                "UnidadesDisponibles": parseInt(Cantidad)
            } */
            var query = { "_id": parseInt(id)};
            var val =  {$set:{"Precio": parseInt(precio), "UnidadesDisponibles": parseInt(Cantidad)}};
           /*  var uni = ( parseInt(req.params.unidad)); */
            console.log(query);
            console.log(val);
            dbo.collection("Libros").updateOne(query, val, function(err, result){
                if (err) throw handleError(res, err.message, "Failed to update documents", 5000);
                res.json("Documento actualizado");
            })
        })
    });




    
    app.post('/api/addPrestamo', async function(req,res){ 
        //var registro = JSON.parse(req.params.reg);  
        /* console.log(registro); */
        var _id;
        var Titulo = req.body.Titulo; 
        var Editorial = req.body.Editorial; 
        var Fecha_inicio = req.body.Fecha_inicio;
        var Fecha_fin = req.body.Fecha_fin;   
        var Precio = req.body.Precio;
        var Clave = req.body.Clave;
        var RutaDeImagen = req.body.RutaDeImagen;
        var email =  req.body.email;


        client.connect(function(err){
            if(err) throw err;
            var dbo = client.db(dbName);
            var query={Clave:Clave}//cambio
            console.log(query);
            //var query={_id: req.params.id}//cambio
                        dbo.collection("Prestamos").find().sort({_id: -1}).limit(1).toArray(function(err,res1){
                            if(err) throw err;
                            var data = { 
                                "_id" : parseInt(res1[0]._id)+1,
                                "Titulo": Titulo,
                                "Usuario": email,
                                "Editorial":Editorial, 
                                "Fecha_inicio":Fecha_inicio,
                                "Fecha_fin": Fecha_fin,
                                "Precio":Precio, 
                                "Status": true,
                                "Clave":Clave,
                                "RutaDeImagen":RutaDeImagen
                            }
                            
                            console.log(data);
                            if(res1==null){
                                res.json({error:"Error de servidor"})
                            }else{
                                dbo.collection('Prestamos').insertOne(data,function(err, result1){ 
                                    if (err) throw err; 
                                    console.log("Record inserted Successfully"); 
                                    //res.json(result);
                                    res.json({status:200, body: "OK"});
                                });
                            }
                        });
    
        })
              
    })


    app.get('/api/prestamos',decrypted, async function(req, res,next){
        /* await client.connect(function(err){
             if(err) throw err;*/
              let token = req.userId;
              const Email = req.userEmail
              //const idUser = req.params.id
              var send
    
              var query={Usuario: Email};

              console.log(query);
    
     
              let client = await MongoClient.connect(url,
             { useNewUrlParser: true, useUnifiedTopology: true });
     
             let db = client.db(dbName);
             try{
                 if(Email){
                    var user =  await db.collection('users').findOne({email:Email});
                    console.log(user);
                    if(user!=null){
                        try{
                            if(user.admin===true){
                                send =  await db.collection('Prestamos').find().toArray();
                                console.log(send);
                                res.json(send);
                            }else{
                                send =  await db.collection('Prestamos').find(query).toArray();
                                console.log(send);
                                res.json(send);
                            }
                            
        
                          
                       }finally{
        
                           client.close()
                       }
                    }
          
                 }
             }finally{
     
             client.close()
     
         }
             
     })


     /* app.get('/api/historialAdmin', async function(req, res,next){
        //await client.connect(function(err){
             //if(err) throw err;
              //let token = req.userId;
              //const Email = req.userEmail
              //const idUser = req.params.id
              var send
    
              //var query={Usuario: Email};

              //console.log(query);
    
     
              let client = await MongoClient.connect(url,
             { useNewUrlParser: true, useUnifiedTopology: true });
     
             let db = client.db(dbName);
             try{
                send =  await db.collection('Prestamos').find().toArray();
                console.log(send);
                res.json(send);
             }finally{
             client.close()
         }
     }) */

     app.delete('/api/eliminar/:id', function(req,res){
        console.log("Borrar");
        console.log("Clave:"+req.params.id)
        client.connect(function(err){
            if(err) throw err;
            var dbo = client.db(dbName);
            var query = { Clave: parseInt(req.params.id)};
            var value = { $set:{Status: false}};
    
            dbo.collection("Prestamos").updateOne(query, value, function(err, result){
                if (err) throw handleError(res, err.message, "Failed to update documents", 5000);
                res.json("Documento borrado");
            })
        })
    });