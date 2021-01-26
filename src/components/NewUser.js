
import {useState} from 'react'
import axios from 'axios';

const API = process.env.REACT_APP_API

export const NewUser = () => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_pass, setConfirm_pass] = useState('')
    const [message, setMessage] = useState('')
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${API}/users`, {
                username: username,
                email: email,
                password: password,
                confirm_pass: confirm_pass
            })
            if (response.data.value){
                const access_token = await response.data.access_token
                localStorage.setItem("JWT", access_token)
                window.location = '/'
                
            } else {
                setMessage(response.data.msg)
            }
            
        } catch(error){
            setMessage('Error, ya esta logeado')
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
                                type="email" 
                                className="form-control"
                                onChange={e => setEmail(e.target.value)}
                                value = {email}
                                placeholder="Email"
                                required
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

                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-control"
                                onChange={e => setConfirm_pass(e.target.value)}
                                value = {confirm_pass}
                                placeholder="Confirmar contraseña"
                                required
                            />
                        </div>

                        <div className="form-group text-danger">
                            <p>{message}</p>
                        </div>
            
                        <button type="submit" className="btn btn-danger btn-block mt-5">Crear cuenta</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
