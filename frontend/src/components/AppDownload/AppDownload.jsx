import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';

const AppDownload = () => {
    return (
        <div className='app-download' id='app-download'>
            <div className='app-download-inner'>
                <span className='app-download-subtitle'>📱 Seamless Mobile Ordering</span>
                <p>For the Best Ordering Experience <br />Download the <b>MoodyEats</b> App</p>
                <div className="app-download-platforms">
                    <img src={assets.play_store} alt="Google Play Store" className='store-badge' />
                    <img src={assets.app_store} alt="Apple App Store" className='store-badge' />
                </div>
            </div>
        </div>
    );
};

export default AppDownload;
