import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Menu, MapPin } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';

type NearbyProduct = {
	_id: string;
	name: string;
	price: number;
	deliveryMethod?: string;
	location?: {
		coordinates?: [number, number]; // [lng, lat]
	};
};

type DemoMarker = {
	id: string;
	latitude: number;
	longitude: number;
	title: string;
	description: string;
};

export default function MapScreen() {
	const router = useRouter();
	const [region, setRegion] = useState<Region | null>(null);
	const [products, setProducts] = useState<NearbyProduct[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [demoMarkers, setDemoMarkers] = useState<DemoMarker[]>([]);

	useEffect(() => {
		let isMounted = true;
		(async () => {
			try {
				setLoading(true);
				setError(null);

				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					if (isMounted) {
						setError('Location permission denied. Enable location to see nearby blindboxes on the map.');
					}
					return;
				}

				const current = await Location.getCurrentPositionAsync({});
				if (!isMounted) return;

				const { latitude, longitude } = current.coords;
				const initialRegion: Region = {
					latitude,
					longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				};
				setRegion(initialRegion);

				// Load nearby products from backend
				const url = `${API_URL}/api/products/nearby?lat=${latitude}&lng=${longitude}&radius=10`;
				const response = await fetch(url);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data?.error || 'Failed to load nearby products');
				}

				if (isMounted) {
					const items: NearbyProduct[] = Array.isArray(data) ? data : [];
					setProducts(items);

					// If there are no products with a valid location, create a couple of
					// demo blindbox markers anchored near the user's initial location.
					const hasLocatedProducts = items.some(
						(p) => p.location?.coordinates && p.location.coordinates.length >= 2,
					);
					if (!hasLocatedProducts) {
						const demoMarker1: DemoMarker = {
							id: 'demo-blindbox-1',
							latitude: latitude + 0.005,
							longitude: longitude,
							title: 'Demo Blindbox: Rescued Veggie Box',
							description: 'Self Pick-Up • RM10.00',
						};
						const demoMarker2: DemoMarker = {
							id: 'demo-blindbox-2',
							latitude: latitude - 0.004,
							longitude: longitude + 0.004,
							title: 'Demo Blindbox: Sunrise Fruit Crate',
							description: 'Doorstep Delivery • RM15.00',
						};
						setDemoMarkers([demoMarker1, demoMarker2]);
					}
				}
			} catch (e: any) {
				console.error('Error loading map data:', e);
				if (isMounted) {
					setError(e?.message || 'Failed to load map data');
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		})();
		return () => {
			isMounted = false;
		};
	}, []);

  	const productsWithLocation = products.filter(
		(p) => p.location?.coordinates && p.location.coordinates.length >= 2,
	);

  	return (
		<View className="flex-1" style={{ backgroundColor: '#365441' }}>
			<StatusBar barStyle="light-content" />

			{/* Header */}
			<View
				className="flex-row items-center justify-between px-4"
				style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
			>
				<TouchableOpacity onPress={() => router.back()} className="mr-3">
					<Menu size={24} stroke="#ffffff" />
				</TouchableOpacity>
				<Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
					Map
				</Text>
				<View style={{ width: 24 }} />
			</View>

			{/* Map / Placeholder Content */}
			<View className="flex-1">
				{region ? (
					<MapView
						style={{ flex: 1 }}
						region={region}
						onRegionChangeComplete={setRegion}
						showsUserLocation
					>
						{productsWithLocation.length > 0
							? productsWithLocation.map((product) => {
								const coords = product.location!.coordinates!;
								const [lng, lat] = coords;
								const delivery = product.deliveryMethod || 'Pickup / delivery info';
								return (
									<Marker
										key={product._id}
										coordinate={{ latitude: lat, longitude: lng }}
										title={product.name}
										description={`${delivery} • RM${product.price.toFixed(2)}`}
									/>
								);
							})
							: demoMarkers.map((marker) => (
								<Marker
									key={marker.id}
									coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
									title={marker.title}
									description={marker.description}
								/>
							))}
					</MapView>
				) : (
					<View className="flex-1 items-center justify-center px-8">
						<MapPin size={64} stroke="#E8F3E0" />
						<Text className="text-lg font-semibold mt-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
							Map View Coming Soon
						</Text>
						<Text className="text-sm mt-2 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
							{/* TODO: Integrate map component */}
							This feature will show nearby sellers and products on a map.
						</Text>
						{loading && (
							<View className="mt-4 items-center">
								<ActivityIndicator color="#E8F3E0" />
								<Text className="text-sm mt-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
									Loading your location...
								</Text>
							</View>
						)}
						{!loading && error && (
							<Text className="text-sm mt-4 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
								{error}
							</Text>
						)}
					</View>
				)}
			</View>
		</View>
	);
}
