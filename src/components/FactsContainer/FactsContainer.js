import  Box  from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useState, useEffect } from 'react'
import { API } from '../../Services/API'
import Button from '@mui/material/Button'
import { Facts } from '../Facts/Facts'


export const FactsContainer = () =>{
    const [joke, setJoke] = useState('')
    const [category, setCategory] = useState('')
    const [term, setTerm] = useState('')
    const [listCategory, setListCategory] = useState(null)


    const changeCategory = (event) => {
      setCategory(event.target.value)
    }

    const changeTerm = (event) => {
      setTerm(event.target.value)
    }


    useEffect(()=>{
        (async () => {
            const categories = await API("categories")
            setListCategory(categories)
        })()
    },[])

    const handleClick = (searchClick, categoryClick) => {
        {   
            setJoke('Searching...')
            let url = BuildUrl(categoryClick, searchClick);
            if(url === "random") {
                API(url).then(result => {
                    setJoke(result.value)
                })
                return
            };
            if(categoryClick !== '' && searchClick === ''){
                API(url).then(result => {
                    setJoke(result.value)
                })
                return
            }
            (async () => {
                const jokeObject = await API(url)
                let jokes = []
                jokeObject.result.map((object)=>{
                    {   
                        if(categoryClick !== ''){
                            if(object.categories.length > 0 && object.categories[0] === categoryClick){
                                jokes.push(object.value)
                        }
    
                    }else{
                        jokes.push(object.value)
                    }
                    
                    }
        
                })
                if(jokes.length > 0){
                    setJoke(jokes[Math.floor(Math.random() * jokes.length)])
                }else{
                    setJoke('No jokes found with this term/category!')
                }
    
            })()
        }
    
      }
      if(listCategory === null){
          return <div>Loading...</div>
      }
    return(
        <>
        <div style={{display: 'flex', width: 500, flexDirection: 'column'}}>

            <div style={{display: 'flex', justifyContent: 'space-between', width: 500}}>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <TextField onChange={changeTerm} style={{fontWeight: 'lighter'}} id="standard-basic" label="Search" variant="standard" />
            </Box>
            <FormControl variant="standard" sx={{ m: 1, minWidth: '25ch' }}>
                <InputLabel id="demo-simple-select-standard-label">Category</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={category}
                    onChange={changeCategory}
                    label="category"
                    >
                    <MenuItem value="">
                        <em>any</em>
                    </MenuItem>
                        {listCategory.map((category)=> <MenuItem value={category}><em>{category}</em></MenuItem>)}
                </Select>

            </FormControl>
            </div>
                <Facts value={joke}/>
                <Button 
                style={{width: 250, height: 50, marginTop:16, marginLeft: '25%'}} 
                variant="contained" 
                color="success" 
                onClick={()=>{
                    handleClick(term, category)
                }}>
                    Get a new random fact!
                </Button>
        </div>
        </>
    )
}

const BuildUrl = (category, search) => {
    let url = 'random';
    if(category !== ''){
        url = `random?category=${category}`
    }
    if(search !== ''){
        url = `search?query=${search}`
    }
    return url
}
