const express = require("express")
const app = express( );
const morgan = require("morgan")
const cors = require("cors")

const PORT = process.env.PORT || 3001


app.use(cors());
app.use(express.json( ));
//adding dist
app.use(express.static("dist"))

//app.use(morgan("tiny"));

//defining a custom token
morgan.token('req-body',(req)=>{
  if (req.method === "POST") {
    return JSON.stringify(req.body);

  }
  return "";
})

//middleware 
app.use(morgan(":method :url :status :res[content-length] - :response-time ms  :req-body"))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas ", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122 2"
    }
]
app.get("/api/persons",(req,res) =>{
    res.send(persons);
})


app.get("/info", (req, res) =>{
    res.send(`Phonebook has info for ${persons.length} people. <br><br>${Date()}`)
})
//getting single person
app.get("/api/persons/:id" ,(req,res) =>{
    const id =req.params.id;
    console.log(typeof id)
   const person =  persons.find(person=>person.id === id)
   if (!person) {
    res.status(404).send(`Person with id:${id} is Not Found!`)
   }
   res.send(person);
})
//generate new id
const generatedId=( ) =>{
  const maxId = persons.length > 0 ? Math.floor(Math.random( ) * (200 - 5 +1) +5) : 0;
  return maxId + 1;
}
//creating new entry
app.post('/api/persons',(req,res) => {
  const body = req.body;
  body.id = generatedId( );
  if (!body.name || !body.number) {
    res.status(404).json({error:"name or number is missing"})

  }
  const existingName = persons.find(person=>person.name === body.name)
  if(existingName) {
    res.status(400).json({error:"Name must be unique"})
  }


  persons = persons.concat(body)
  res.status(201).send(persons);

})


//delete an entry
app.delete("/api/persons/:id" ,(req,res) =>{
  const id =req.params.id;
  deletedPerson = persons.filter(person=>person.id  !==id)
  res.send(deletedPerson) 

})

/* app.listen(3001,()=>{
    console.log("Server is running successfully ");
}) */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})