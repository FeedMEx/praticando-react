
import {useState} from 'react'
import axios from 'axios';

const API = process.env.REACT_APP_API

export const LogIn = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${API}/user`, {
                username: username,
                password: password,
            })
            const access_token = await response.data.access_token

            localStorage.setItem("JWT", access_token)
            window.location = '/'

        } catch(error){
            setMessage('Usuario y/o contraseña incorrectos')
            setUsername('')
            setPassword('')
        }
    }

    return (
        <div className="row justify-content-center">
            <div className="card">
                <div className="card-body m-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                onChange={e => setUsername(e.target.value)} 
                                value = {username}
                                placeholder="Nombre de usuario"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-control"
                                onChange={e => setPassword(e.target.value)}
                                value = {password}
                                placeholder="Contraseña"
                                required
                            />
                        </div>

                        <div className="form-group text-danger">
                            <p>{message}</p>
                        </div>
            
                        <button type="submit" className="btn btn-danger btn-block mt-5">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    )
}