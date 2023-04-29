import logo from './logo.svg';
import './App.css';
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import "./style.css"

const Books = () =>{
  console.log("ciao")
  const [books, setBooks] = useState([])
  useEffect(()=> {
    const fetchAllBooks = async () => {
      try{
        const res = await axios.get("http://localhost:8800/books")
        setBooks(res.data)
        console.log(res)
      }catch(err){
        console.log(err)
      }
    }
  fetchAllBooks()
  },[])

  const handleDelete = async (id)=> {
    try{
      await axios.delete("http://localhost:8800/books/"+id)
      window.location.reload()
    }catch(err){
      console.log(err)
    }
  }

  return  <div>
            <div className="books">
            {books.map(book=>(
              <div className="book">
                {book.cover && <img src={book.cover} alt=""/>}
                <h2>{book.title}</h2>
                <p>{book.desc}</p>
                <span>{book.price}</span>
                <button className="delete" onClick={()=>handleDelete(book.id)}>Delete</button>
                <button className="update"><Link to={`/update/${book.id}`}> Update</Link></button>
              </div>))}
            </div>
          </div>
}

const Add = ()=> {
  const [book,setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) =>{
    setBook(prev=>({...prev, [e.target.name]: e.target.value}));
  }
  const handleClick = async (e) =>{
    e.preventDefault()
    try{
      await axios.post("http://localhost:8800/books",book)
      navigate("/")
    }catch(err){
      console.log(err)
    }

  }
  console.log(book)
  return(
    <div className='form'>
    <h1>ADD NEW BOOK</h1>
    <input type="text" placeholder='title' onChange={handleChange} name="title"/>
    <input type="text" placeholder='desc' onChange={handleChange} name="desc"/>
    <input type="number" placeholder='price' onChange={handleChange} name="price"/>
    <input type="text" placeholder='cover' onChange={handleChange} name="cover"/>
    <button className="formButton" onClick={handleClick}>Addo</button>
    </div>
    )
}


const Update = ()=> {
  const [book,setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: "",
  })

  const navigate = useNavigate()
  const location = useLocation()

  console.log(location.pathname.split("/")[2])

  const id = location.pathname.split("/")[2]

  const handleChange = (e) =>{
    setBook(prev=>({...prev, [e.target.name]: e.target.value}));
  }
  const handleClick = async (e) =>{
    e.preventDefault()
    try{
      await axios.put("http://localhost:8800/books/:"+id,book)
      navigate("/")
    }catch(err){
      console.log(err)
    }

  }
  console.log(book)
  return(
    <div className='form'>
    <input type="text" placeholder='title' onChange={handleChange} name="title"/>
    <input type="text" placeholder='desc' onChange={handleChange} name="desc"/>
    <input type="number" placeholder='price' onChange={handleChange} name="price"/>
    <input type="text" placeholder='cover' onChange={handleChange} name="cover"/>
    <button className="formButton" onClick={handleClick}>Updato</button>
    </div>
    )
}



const router = createBrowserRouter([
  {
    path: "/", 
    element: (
      <div>
        <h1>Hello World</h1>
        <div><Link to="/books">Books</Link></div>
        <div><Link to="/add">ADD</Link></div>
        <div><Link to="/update">Update</Link></div> 
      </div>
    ),
  },
  {
    path: "/books",
    element: 
      <div>
        <h1>Books</h1>
        <Books />
        <div><Link to="/">Home</Link></div>
        <div><Link to="/add">ADD</Link></div>
        <div><Link to="/update">Update</Link></div>
      </div>
  },
  {
    path: "/add",
    element: 
      <div>
        <Add />
        <div><Link to="/">Home</Link></div>
        <div><Link to="/books">Books</Link></div>
        <div><Link to="/update">Update</Link></div>
      </div>,
  },
  {
    path: "/update/:id",
    element: 
      <div>
        <div><h1>Update the Book</h1></div>
        <Update />
        <div><Link to="/">Home</Link></div>
        <div><Link to="/books">Books</Link></div>
        <div><Link to="/add">ADD</Link></div>
      </div>,
  },
  {
    path: "/update",
    element: 
      <div>
        <div><h1>Update</h1></div>
        <div><Link to="/">Home</Link></div>
        <div><Link to="/books">Books</Link></div>
        <div><Link to="/add">ADD</Link></div>
      </div>,
  }
]);

function App() {
  return (
    <div className="App">
    <RouterProvider router={router} />
    </div>
  );
}

export default App;
