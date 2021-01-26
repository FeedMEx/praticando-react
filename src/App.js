
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import {Navbar} from './components/Navbar'
import { ImageList } from './components/ImageList'
import { NewImage } from './components/NewImage'
import { NewUser } from './components/NewUser'
import { LogIn } from './components/LogIn'
import {MyImages} from './components/MyImages'

function App() {

    const DynamicLink = () => {
        let authToken = localStorage.getItem("JWT");
        if (authToken === null) {
            return <>
                <Route path='/new_image' component={LogIn}/>
                <Route path='/log_in' component={LogIn}/>
                <Route path='/new_user' component={NewUser}/>
            </>
        } else {
            return <>
                <Route path='/new_image' component={NewImage}/>
                <Route path='/my_images' component={MyImages}/>
            </>
        }
    }

    return (
        <Router>
            <Navbar/>
            <div className="container mt-5">
                <Switch>
                    <Route exact path='/' component={ImageList}/>
                    <DynamicLink/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
