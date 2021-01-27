import { Link } from 'react-router-dom'
import axios from 'axios';

const API = process.env.REACT_APP_API

export const Navbar = () => {

    const Tabs = () => {
        let authToken = localStorage.getItem("JWT");
        if (authToken === null) {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to='/log_in'>Iniciar sesión</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/new_user'>Registrate</Link>
                    </li>
                </ul>
            )
        } else {
            axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to='/my_images'>Mis imagenes</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" onClick={sign_off} to="/">Cerrar sesión</Link>
                    </li>
                </ul>
            )
        }
    };

    const sign_off = async () => {
        try{
            localStorage.removeItem('JWT');
            window.location = '/'
            await axios.delete(`${API}/users`)        

        } catch(error){
            console.log(error)
        }
    }

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">IMGSTORE</Link>
            
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <Tabs/>
                </div> 
                
            </div>
        </nav>
    )
}