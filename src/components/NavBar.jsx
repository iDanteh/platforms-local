import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import '../styles/NavBar_Style.css';

function NavBar({isHidden,onToggleNav}) {

    const toggleNavBar = () => {
        const actState = !isHidden;
        onToggleNav(actState);
    };

    return (
        <>
            {isHidden && (
                <button className="navbar-show-button" onClick={toggleNavBar}>
                    <FaBars />
                </button>
            )}

            <div className={`navbar ${isHidden ? 'hidden' : ''}`}>
                <div className="navbar-header">
                    <button className="menu-toggle" onClick={toggleNavBar}>
                        <IoClose />
                    </button>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to='/dashboard'>Dashboard</Link>
                        </li>
                        <li>
                            <Link to='/clients'>Clientes</Link>
                        </li>
                        <li>
                            <Link to='/suscripciones'>Suscripciones</Link>
                        </li>
                        <li>
                            <Link to= '/cuentas'>Cuentas</Link>
                        </li>
                        <li>
                            <Link to='/logout'>Cerrar Sesión</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default NavBar;
