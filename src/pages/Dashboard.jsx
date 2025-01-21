import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscription, calculateDaysRemaining, sendWhatsAppMessage, handleAutoReminder} from '../services/suscripcionService.js'
import NetflixLogo from '../assets/svg/netflix-3.svg';
import OfficeLogo from '../assets/svg/office-2.svg';
import HBOLogo from '../assets/svg/hbo-4.svg';
import DisneyLogo from '../assets/svg/disney.svg';
import NortonLogo from '../assets/svg/norton-antivirus-logo.svg';
import YoutubeLogo from '../assets/svg/youtube-6.svg';
import SpotifyLogo from '../assets/svg/logo-spotify.svg';
import AmazonPrimeLogo from '../assets/svg/amazon-prime-video-1.svg';
import CrunchyLogo from '../assets/svg/crunchyroll-logo.svg';
import AppleTVLogo from '../assets/svg/apple-tv.svg';
import ClaroLogo from '../assets/svg/claro-1.svg';
import ParamountLogo from '../assets/svg/paramount-3.svg';
import StarLogo from '../assets/svg/Star+.svg';
import '../styles/Dashboard_Style.css';

function Dashboard({setSelectedPlatform}) {
    const navigate = useNavigate();

    const platforms = [
        { id: 1, name: 'Netflix', logo: NetflixLogo, path: '/suscripciones' },
        { id: 2, name: 'Office', logo: OfficeLogo, path: '/suscripciones' },
        { id: 3, name: 'HBO', logo: HBOLogo, path: '/suscripciones' },
        { id: 4, name: 'Disney', logo: DisneyLogo, path: '/suscripciones' },
        { id: 5, name: 'Norton', logo: NortonLogo, path: '/suscripciones' },
        { id: 6, name: 'Youtube', logo: YoutubeLogo, path: '/suscripciones' },
        { id: 7, name: 'Spotify', logo: SpotifyLogo, path: '/suscripciones' },
        { id: 8, name: 'Amazon Prime', logo: AmazonPrimeLogo, path: '/suscripciones' },
        { id: 9, name: 'Crunchyroll', logo: CrunchyLogo, path: '/suscripciones' },
        { id: 10, name: 'Apple TV', logo: AppleTVLogo, path: '/suscripciones' },
        { id: 11, name: 'Claro', logo: ClaroLogo, path: '/suscripciones' },
        { id: 12, name: 'Paramount', logo: ParamountLogo, path: '/suscripciones' },
        { id: 13, name: 'Star+', logo: StarLogo, path: '/suscripciones' },
    ];

    const handleNavigation = (platform) => {
        setSelectedPlatform({
            id: platform.id,
            name: platform.name
        });
        navigate(platform.path);
    };

    // Envía los mensajes de recordatorio desde el Dashboard
    // useEffect(() => {
    //     const fetchSubscriptions = async () => {
    //         const subscriptions = await getSubscription();
    //         subscriptions.forEach(async (subscription) => {
    //             // Llama a handleAutoReminder para cada suscripción
    //             await handleAutoReminder(subscription, sendWhatsAppMessage);
    //         });
    //     };

    //     fetchSubscriptions();
    // }, []);

    return (
        <div className="dashboard">
            <h1>¡Bienvenido Wicho!</h1>
            <p>Sistema para el registro y control de suscripciones de streaming.</p>

            <div className="svg-container">
                {platforms.map((platform) => (
                    <div
                        key={platform.name}
                        className="svg-platform"
                        onClick={() => handleNavigation(platform)}
                    >
                        <img src={platform.logo} alt={`${platform.name}-logo`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
