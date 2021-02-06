

import './style.css';


function NavBar() {

	return (
		<nav>
		<ul>
		<li className='menu-item brand'>
		<a href="/" >MONITORAÇÃO DE RUÍDOS DE SOM</a>
		</li>
		<li className="menu-item menu-item-notify">
		<a href="#" ><span className="notificationBadge">3</span></a>
		
		</li>
		</ul>

		</nav>
		);
}

export default NavBar;