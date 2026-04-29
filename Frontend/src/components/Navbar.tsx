import { Link } from "react-router"
import './Navbar.css'
export default function Navbar(){
    return(
        <nav className="Navbar">
            <Link to="/WebMail">Главная</Link>
            <Link to='/Login'>Окно входа</Link>
            <Link to='/Admin'>Администрирование</Link>
            <Link to="/About">О почте</Link>
        </nav>
    )
}