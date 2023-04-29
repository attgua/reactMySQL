const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

var mysql = require('mysql');

const db = mysql.createPool({
	host: '127.0.0.1',
	user: "root",
	password: "",
	database: "test",
	insecureAuth : true

});

db.getConnection(function(err, connection) {
  if (err) throw err; // Se c'è un errore durante la connessione, lancio un'eccezione
  console.log("Connessione al database riuscita!");

  connection.query("SELECT * FROM books", function (err, result, fields) {
    if (err) throw err; // Se c'è un errore durante la query, lancio un'eccezione
    console.log(result);
  });

  connection.release(); // Rilascio la connessione al database
});

app.use(express.json())

app.use(cors())

app.get("/", (req, res)=>{
	res.json("hello this is the backend!")
})

app.get("/books", (req,res)=>{
	const q = "SELECT * FROM books;"
	db.query(q,(err,data)=>{
		if(err) return res.json(err)
		return res.json(data)
	})
})

app.delete("/books/:id",(req,res)=>{
	const bookId = req.params.id;
	const q = "DELETE FROM books WHERE id = ?"


	db.query(q, [bookId], (err,data)=>{
		if (err) return res.json(err)
		return res.json("Book has been deleted")
	});

})

app.put("/books/:id",(req,res)=>{
	const bookId = req.params.id.split(":")[1];


	console.log(bookId)
	const q = "UPDATE test.books SET `title`= ?,`desc`= ?,`price`= ?,`cover`= ? WHERE id = ?"

	const values = [req.body.title,req.body.desc,req.body.price,req.body.cover,bookId];
	console.log("sono qio")
	console.log(values)

	db.query(q, [...values], (err,data)=>{
		console.log("sono quiiiii")
		console.log(data)
		if (err) return res.json(err)
		return res.json("Book has been updated")
	});

})

app.post("/books", (req,res)=>{
	const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)";
	const values = [req.body.title,req.body.desc,req.body.price,req.body.cover];
	console.log("sono qio")
	console.log(values)

	db.query(q, [values], (err,data)=>{
		if (err) return res.json(err)
		return res.json("Book has been created")
	});
})

app.listen(8800, ()=>{
	console.log("Connected to backend!")
})


