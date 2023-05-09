//import package
const express = require('express');
const fs = require('fs');

const app = express();
const movies = JSON.parse(fs.readFileSync('./data/movies.json'));

app.use(express.json());

//get-api/v1/movies
app.get('/api/v1/movies',(req,res)=>{
     res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
     })
})
//get - api/v1/movies/id
app.get('/api/v1/movies/:id',(req,res)=>{
   const id = req.params.id * 1;
   let movie = movies.find(el=>el.id === id);
   if(!movie){
    return res.status(404).json({
        status:"fail",
        message:"Movie With ID "+id+" is not found"
    });
   }
    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    });
})
//post- api/v1/movies
app.post('/api/v1/movies',(req,res)=>{
    const newId = movies[movies.length - 1].id + 1;
    const newMovie = Object.assign({id:newId},req.body);
    movies.push(newMovie);
    fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movies:newMovie
            }
        })
    })
    console.log('created');
})
//patch-api/v1/movies/id

// patch - api/v1/movies/id
app.patch('/api/v1/movies/:id', (req, res) => {
    let id = req.params.id * 1;
    let movieToUpdate = movies.find(el => el.id === id);
    if (!movieToUpdate) {
      return res.status(404).json({
        status: "fail",
        message: "Movie With ID " + id + " is not found"
      });
    }
    let index = movies.indexOf(movieToUpdate);
    Object.assign(movieToUpdate, req.body);
    movies[index] = movieToUpdate;
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
      res.status(200).json({
        status: "success",
        data: {
          movie: movieToUpdate
        }
      })
    })
  });
//delete -api/v1/movies/id
app.delete('/api/v1/movies/:id',(req,res)=>{
    const id = req.params.id *1;
    const movieToDelete = movies.find(el=>el.id === id);
    if (!movieToDelete) {
        return res.status(404).json({
          status: "fail",
          message: "Movie With ID " + id + " is not found to delete"
        });
      }
    const index = movies.indexOf(movieToDelete);
    movies.splice(index,1);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
          status: "success",
          data:null
        })
      })

})  

//create server
const port = 3000;
app.listen(port,()=>{
    console.log('server has started');
});