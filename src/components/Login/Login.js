import {useRef, useState} from 'react';
import { useHistory } from 'react-router';
import { useAuth } from "../../Contexts/AuthContext" 
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from "react-bootstrap"
import { Paper } from '@material-ui/core';

function Login()
{
    let password = useRef();
let email = useRef();
const { login } = useAuth();
const [error,setError] = useState("");
const [loading,setLoading] = useState(false);
const history = useHistory();

async function handleSubmit(e)
{
    e.preventDefault();

        setError("");
        setLoading(true);
         await login(email.current.value,password.current.value)
         .then((value)=>{
            history.push("/admin")
         })
         .catch((err)=>{
             console.log(err)
             setError(err)
         })


 
}
const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    return(
        
    <article>
    <Grid>
     <Paper elavation="20" style={paperStyle}>
     <Grid >
         <h2>Login</h2>
     </Grid>
        <form onSubmit={handleSubmit}>
        <label>
           Email
        </label>
        <br></br>

        <input ref={email}/>
        <br></br>

        <label>
           Password
        </label>
        <br></br> 

        <input ref={password} type="password"/>
        <br></br><br></br>

        <Button disabled={loading} type="submit">Login</Button>
        <br></br><br></br>

        <h1> {error}</h1>
        </form>
        
        </Paper>  
   </Grid>
    </article>
    )
}

export default Login;