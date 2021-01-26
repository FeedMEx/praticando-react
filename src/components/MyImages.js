import {useState ,useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Modal from 'react-modal'

const API = process.env.REACT_APP_API

const customStyleModalEdit = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        background            : '#1b1e23',
        border                : null
    }
};

const customStyleModalImage = {
    content : {
        background            : '#1b1e23',
        border                    : null
    }
};

export const MyImages = () => {

    const [images, setImages] = useState([])
    const [search, setSearch] = useState('')
    const [modalEdit, setModalEdit] = useState(false)
    const [modalImage, setModalImage] = useState(false)
    const [imageModal, setImageModal] = useState('')
    const [name, setName] = useState('')
    const [id, setId] = useState('')
    const [message, setMessage] = useState('')

    const openModalEdit = (id, name) => {
        setModalEdit(true)
        setId(id)
        setName(name)
    }

    const closeModalEdit = () => {
        setModalEdit(false)
        setMessage('')
    }

    const openModalImage = (image, name) => {
        setModalImage(true)
        setImageModal(image)
        setName(name)
    }

    const closeModalImage = () => {
        setModalImage(false)
    }

    const checkAuthenticate = () => {
        let authToken = localStorage.getItem("JWT");
        if (authToken === null) {
            axios.defaults.headers.common.Authorization = null;
            
        } else {
            axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        }
    }

    const getImages = () => {
        axios.get(`${API}/my_images`)
        .then(response => {         
            setImages(response.data)
        }).catch(error=>{
            console.log(error)
        })
    }

    const sendSearch = (e) => {
        e.preventDefault()
        if (search !== ''){
            axios.get(`${API}/my_images/${search}`)
            .then(response => {
                setImages(response.data)
            }).catch(error => {
                console.log(error)
            })
        }else {
            getImages()
        }
    }


    useEffect(()=> {
        getImages()
        checkAuthenticate()
    }, [])

    const deleteImage = async (id) => {
        const userResponse = window.confirm('¿Esta seguro de querer eliminar la imagen?')
        
        if (userResponse) {
            try{
                await axios.delete(`${API}/images/${id}`)
            }catch (error){
                console.log(error)
            }
            await getImages();
        }
    }

    const editImage = async (e) => {
        e.preventDefault()
        try{
            const response = await axios.put(`${API}/images/${id}`, {
                name: name,
            })
            if (response.data.value) {
                closeModalEdit()
                getImages()
            } else {
                setMessage(response.data.msg)
            }

        } catch(error){
            setMessage('Ocurrio un error inesperado')
        }
        
    }
    

    return(
        <div>
            <div className="row mb-4">
                <form onSubmit={sendSearch} className="form-inline col-sm-6 col-lg-9 col-xl-10 mb-4">
                    <input 
                        className="form-control card w-75" 
                        type="search" 
                        placeholder="Busca tus imagenes" 
                        aria-label="Search"
                        onChange={e => setSearch(e.target.value)}
                        value = {search}
                        />
                    <button className="btn btn-outline-success" type="submit"><i className="fas fa-search"></i></button>
                </form>
               
                <Link to='/new_image' className="ml-auto"><button className="btn btn-danger">Nueva imagen</button></Link>
            </div>
            
            <div className="row">
                { images.map (image => (
                    <div key={image._id} className="col-xl-3 col-md-4 col-sm-6 mb-5">
                        
                        <p>{image.name}</p>
 
                        <img 
                            src={`${API}`+image.path} 
                            className="img-fluid w-100 images" 
                            alt={image.name}
                            onClick= {() => openModalImage(image.path, image.name)}
                        />
                        
                        <div className="d-flex justify-content-end mt-1">
                            <button 
                                className="btn btn-success"
                                onClick = {() => openModalEdit(image._id, image.name)}
                                >
                                Editar
                            </button>
                            <button
                                className="btn btn-danger" 
                                onClick = {() => deleteImage(image._id)}
                                >
                                Eliminar
                            </button>
                        </div>
                        
                    </div>
                ))}
            </div>

            <Modal
            isOpen={modalImage}
            ariaHideApp={false}
            onRequestClose={closeModalImage}
            style={customStyleModalImage}
            contentLabel="Example Modal"
            >
                <div className="button-container">
                    <img 
                        src={`${API}`+ imageModal} 
                        alt={name} 
                        className="animate__animated animate__fadeInDown"
                    /> 
                    <button 
                        type="button" 
                        className="close" 
                        data-dismiss="modal" 
                        onClick={closeModalImage}
                        >&times;
                    </button>
                </div>             
            </Modal>

            <Modal
            isOpen={modalEdit}
            ariaHideApp={false}
            onRequestClose={closeModalEdit}
            style={customStyleModalEdit}
            contentLabel="Example Modal"
            >
                <div className="card-body animate__animated animate__fadeInDown">
                    <h2 className="text-secondary">Editar nombre</h2>
                    <form onSubmit={editImage}>
                        <div className="form-group mt-4">
                            <input 
                                className="form-control" 
                                placeholder="Escribe un nuevo nombre"
                                onChange={e => setName(e.target.value)}
                                value = {name}
                            />
                        </div>
                        

                        <div className="form-group text-danger">
                            <p>{message}</p>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button onClick={closeModalEdit} className="btn btn-dark" type="button">Cancelar</button>
                            <button className="btn btn-success" type="submit">Guardar</button>
                        </div>
                    </form>
                </div>
            </Modal>
            
        </div>
    )
}
