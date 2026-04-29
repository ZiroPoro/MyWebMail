import '../LoginPage/Header.css';
import '../assets/hero.png'
interface HeaderProps{
    title?: string;
    logoUrl?: string;
}
export default function Header({ title = "Добро пожаловать", logoUrl}: HeaderProps){
    return (
        <header className='login-header'>
        <div className="header-container">
                {logoUrl&&(
                <div className="logo">
                    <img src="..\src\assets\hero.png" alt="logo" className='logo-image'/>
                </div>
                )}
                
            <h1 className='header-title'>{title}</h1>

        </div>
        </header>
    )
}
