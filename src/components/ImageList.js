import {useState ,useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {format} from 'timeago.js'
import Modal from 'react-modal'

const API = process.env.REACT_APP_API

const customStyles = {
    content : {
        background            : '#1b1e23',
        border                    : null
    }
};

export const ImageList = () => {

    const [images, setImages] = useState([])
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(false)
    const [imageModal, setImageModal] = useState('')
    const [nameModal, setNameModal] = useState('')

    const openModal = (image, name) => {
        setModal(true)
        setImageModal(image)
        setNameModal(name)
    }

    const closeModal = () => {
        setModal(false)
    }

    const sendSearch = (e) => {
        e.preventDefault()
        if (search !== ''){
            axios.get(`${API}/images/${search}`)
            .then(response => {
                setImages(response.data)
            }).catch(error => {
                console.log(error)
            })
        }else {
            getImages()
        }
    }

    const getImages = () => {
        axios.get(`${API}/images`)
        .then(response => {         
            setImages(response.data)
        }).catch(error=>{
            console.log(error)
        })
    }

    useEffect(()=> {
        getImages()
    }, [])

    return(
        <div>
            <div className="row mb-4">
                <form onSubmit={sendSearch} className="form-inline col-sm-6 col-lg-9 col-xl-10 mb-4">
                    <input 
                        className="form-control card w-75" 
                        type="search" 
                        placeholder="Buscar" 
                        aria-label="Search"
                        onChange={e => setSearch(e.target.value)}
                        value = {search}
                        />
                    <button className="btn btn-outline-success" type="submit"><i className="fas fa-search"></i></button>
                </form>
               
                <Link to='/new_image' className="ml-auto"><button className="btn btn-danger">Subir imagen</button></Link>
            </div>
            
            <div className="card-columns">
                { images.map (image => (
                    <div key={image._id} className="card mb-4">
                        
                        <img 
                            src={`${API}`+ image.path} 
                            className="card-img-top images" 
                            alt={image.name} 
                            onClick= {() => openModal(image.path, image.name)}
                        />

                        <div className="card-body text-light bg-dark">
                            <h5 className="card-title">{image.name}</h5>
                            <div className="d-flex text-muted">
                                <p>{image.user}</p>
                                <p className="ml-auto"><small>{format(image.date)}</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            

            <Modal 
            isOpen={modal}
            ariaHideApp={false}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            > 
                <div className="button-container">
                    <img 
                        src={`${API}`+ imageModal} 
                        alt={nameModal} 
                        className="animate__animated animate__fadeInDown"
                    /> 
                    <button 
                        type="button" 
                        className="close" 
                        data-dismiss="modal" 
                        onClick={closeModal}
                        >&times;
                    </button>
                </div> 
                
                  
            </Modal>
            
        </div>
    )
}

