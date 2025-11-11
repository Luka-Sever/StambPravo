import logo from './assets/logo.png'

export default function Head() {
    return (
        <div id="head">
            <img src={logo} className='logo'></img>
            <div> 
                <button id="login">Prijavi se</button>
                <button id="register">Registriraj se</button>
            </div>
        </div>
    );

} 