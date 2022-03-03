import { useState } from 'react';
import * as L from 'leaflet';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvent,
	useMap,
} from 'react-leaflet';
import s from './Home.module.scss';

import 'leaflet/dist/leaflet.css';

import bgImg from '../../assets/images/pattern-bg.png';
import Arrow from '../../assets/svg/icon-arrow.svg?component';
import Location from '../../assets/svg/icon-location.svg?component';

const Home = () => {
	const [value, setValue] = useState('');
	const [address, setAddress] = useState({
		ip: '192.212.174.101',
		location: {
			city: 'Brooklyn, NY 10001',
			lat: 51.505,
			lng: -0.09,
			timezone: '-05:00',
		},
		isp: 'SpaceX Starlink',
	});
	const position = [51.505, -0.09];

	const IconLocation = L.icon({
		iconUrl:
			'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
		iconSize: [25, 40],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

	const handleSubmit = async e => {
		e.preventDefault();
		const data = await fetch(
			`/api?apiKey=${import.meta.env.VITE_API_KEY}&ipAddress=${value}`
		);
		const ipInfo = await data.json();
		setAddress(ipInfo);
	};

	const ServicesLocation = ({ pos }) => {
		const map = useMap();

		if (pos !== null) {
			map.flyTo(pos, 18);
		}

		return null;
	};

	return (
		<main className={s.home}>
			<div className={s.header}>
				<img src={bgImg} className={s.img} />
				<h1 className={s.title}>IP Address Tracker</h1>
				<form className={s.containerInput} onSubmit={handleSubmit}>
					<input
						className={s.input}
						type='text'
						value={value}
						onChange={e => setValue(e.target.value)}
						placeholder='Search for anu IP address or domain'
					/>
					<button className={s.button} type='submit'>
						<Arrow />
					</button>
				</form>
				<div className={s.containerInfos}>
					<ul className={s.groupList}>
						<li className={s.info}>
							ip address<span className={s.infoItem}>{address.ip}</span>
						</li>
						<li className={s.info}>
							location
							<span className={s.infoItem}>{address?.location.city}</span>
						</li>
						<li className={s.info}>
							timezone
							<span className={s.infoItem}>
								{address?.location?.timezone &&
									`UTC ${address?.location?.timezone}`}
							</span>
						</li>
						<li className={s.info}>
							isp<span className={s.infoItem}>{address.isp}</span>
						</li>
					</ul>
				</div>
			</div>
			<div className={s.map}>
				<MapContainer
					center={[address?.location.lat, address?.location?.lng]}
					zoom={18}
					scrollWheelZoom
					zoomControl={false}
					style={{ height: '100%', width: '100%' }}
				>
					<TileLayer
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<Marker
						position={[address?.location.lat, address?.location?.lng]}
						icon={IconLocation}
					>
						<Popup>{address?.location?.city}</Popup>
					</Marker>
					<ServicesLocation pos={address?.location} />
				</MapContainer>
			</div>
		</main>
	);
};

export default Home;
