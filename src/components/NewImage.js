
import {useState, useEffect } from 'react'
import { ProgressBar} from 'react-bootstrap'
import axios from 'axios';

const API = process.env.REACT_APP_API

export const NewImage = () => {

    const [name, setName] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState('upload.png')
    const [message, setMessage] = useState('')
    const [textColor, setTextColor] = useState('text-success')
    const [file, setFile] = useState()
    const [progress, setProgress] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        const form = new FormData()
        form.append('image', image[0])
        form.append('name', name)

        const options = {
            onUploadProgress: (progressEvent) => {
                const {loaded, total} = progressEvent
                let percent = Math.round( loaded * 100 / total)-1
                setProgress(percent)
            }
        }

        axios.post(`${API}/images`, form, options, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
            if (response.data.value){
                setTextColor('text-success')
                setMessage(response.data.msg)
                setName('')
                setPreview('upload.png')
                setImage(null)
                file.target.value = null; file.target.files = null;
                setProgress(0)
            } else {
                setTextColor('text-danger')
                setMessage(response.data.msg)
                setProgress(0)
            }
        }).catch(error=>{
            setTextColor('text-danger')
            setMessage('Error al subir, intentelo de nuevo')
        })
    } 
    
    const checkAuthenticate = () => {
        let authToken = localStorage.getItem("JWT");
        if (authToken === null) {
            axios.defaults.headers.common.Authorization = null;
        } else {
            axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        }
    }

    const onFileChange = (e) => {
        setMessage('')
        if (e.target.files && e.target.files.length>0) {
            const file = e.target.files[0]
            if (file.type.includes("image")) {
                const reader = new FileReader()
                reader.readAsDataURL(file)

                reader.onload = function load() {
                    setPreview(reader.result)
                }
                setImage(e.target.files)
            }
            setFile(e)
        }
    }


    useEffect(()=> {
        checkAuthenticate()
    }, [])

    return (
        <div className="row justify-content-center">
            <div className="card col-lg-5 col-md-6 col-xl-4">
                <div className="card-body m-4">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Título</label>
                            <input 
                                type="text" 
                                className="form-control card" 
                                onChange={e => setName(e.target.value)} 
                                value = {name}
                                placeholder="Ej: Bob estupido"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="form-group img-file">
                            <label htmlFor="file">
                                <img className="img-fluid images" src={preview} alt="upload"/>
                            </label>
                            <input 
                                type="file"
                                className="form-control-file"
                                onChange={onFileChange}
                                id = "file"
                                required
                            />
                        </div>

                        <div>
                            <ProgressBar now={progress} label={`${progress}%`} variant="info" animated/>
                        </div>
                        
                        <div className="form-group">
                            <p className={textColor}>{message}</p>
                        </div>
            
                        <button type="submit" className="btn btn-danger btn-block mt-5">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

