import { Link } from "react-router"

export default function Navbar(){
    return(
        <nav>
            <Link to="/WebMail">Главная</Link>
            <Link to='/Login'>Окно входа</Link>
            <Link to='/Admin'>Администрирование</Link>
            <Link to="/About">О почте</Link>
        </nav>
    )
}