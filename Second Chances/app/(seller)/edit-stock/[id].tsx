import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Image, Alert, Modal, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Menu, DoorOpen, Users, ShoppingCart, Image as ImageIcon, Calendar } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import '../../../global.css';
import { API_URL } from '../../../config/api';
import { getAuthToken } from '../../../config/auth';

export default function EditStockScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [blindboxName, setBlindboxName] = useState('');
  const [blindboxImage, setBlindboxImage] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Fruits');
  const [selectedPrice, setSelectedPrice] = useState('Free');
  const [customPrice, setCustomPrice] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('Available');
  const [bestBefore, setBestBefore] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch product data on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        if (!token) {
          Alert.alert('Authentication Error', 'Please log in again.');
          router.replace('/login');
          return;
        }

        const response = await fetch(`${API_URL}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load product');
        }

        const product = await response.json();
        
        // Format image URL
        let imageUrl = product.imageUrl || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${API_URL}${imageUrl}`;
        }
        
        // Set state from product data
        setBlindboxName(product.name || '');
        setDescription(product.description || '');
        setSelectedCategory(product.category === 'Vegetables' ? 'Vegetable' : product.category || 'Fruits');
        setOriginalImageUrl(imageUrl);
        setBlindboxImage(imageUrl);
        
        // Set price
        const price = product.price || 0;
        if (price === 0) {
          setSelectedPrice('Free');
        } else if (price === 5) {
          setSelectedPrice('RM5');
        } else if (price === 10) {
          setSelectedPrice('RM10');
        } else {
          setSelectedPrice('Custom');
          setCustomPrice(price.toString());
        }
        
        setSelectedDelivery(product.deliveryMethod || null);
        
        // Map backend status to frontend status
        let status = 'Available';
        if (product.status === 'delivered') status = 'Delivered';
        else if (product.status === 'cancelled') status = 'Cancelled';
        setSelectedStatus(status);
        
        // Format best before date
        if (product.bestBefore) {
          const date = new Date(product.bestBefore);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear()).slice(-2);
          const dateStr = `${day}-${month}-${year}`;
          setBestBefore(dateStr);
          // Update date picker state
          setSelectedDay(date.getDate());
          setSelectedMonth(date.getMonth() + 1);
          setSelectedYear(date.getFullYear());
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  
  // Parse current date or use today
  const parseDate = (dateString: string) => {
    if (dateString) {
      const [day, month, year] = dateString.split('-');
      const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
      return { day: parseInt(day), month: parseInt(month), year: fullYear };
    }
    const today = new Date();
    return { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };
  };

  // Parse date from bestBefore string or use today
  const initialDate = bestBefore ? parseDate(bestBefore) : parseDate('');
  const [selectedDay, setSelectedDay] = useState(initialDate.day);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedYear, setSelectedYear] = useState(initialDate.year);

  const formatDateMalaysian = (day: number, month: number, year: number): string => {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year).slice(-2);
    return `${dayStr}-${monthStr}-${yearStr}`;
  };

  // Generate days based on selected month and year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleDateConfirm = () => {
    setBestBefore(formatDateMalaysian(selectedDay, selectedMonth, selectedYear));
    setShowDatePicker(false);
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const categories = ['Fruits', 'Vegetable', 'Mix'];
  const prices = ['Free', 'RM5', 'RM10', 'Custom'];
  const deliveryMethods = [
    { id: 'Grab', label: 'Grab', icon: DoorOpen },
    { id: 'Doorstep', label: 'Doorstep Delivery', icon: DoorOpen },
    { id: 'Hub Collect', label: 'Hub Collect', icon: Users },
    { id: 'Self Pick-Up', label: 'Self Pick-Up', icon: ShoppingCart },
  ];
  const statusOptions = ['Available', 'Delivered', 'Cancelled'];

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select an image!'
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Store the image URI - this will persist in state
      setBlindboxImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!blindboxName || !blindboxName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for your blindbox.');
      return;
    }

    if (!description || !description.trim()) {
      Alert.alert('Description Required', 'Please add a description for your blindbox.');
      return;
    }

    if (!selectedDelivery) {
      Alert.alert('Delivery Method Required', 'Please select a delivery method.');
      return;
    }

    try {
      setSaving(true);
      const token = getAuthToken();
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in again.');
        router.replace('/login');
        return;
      }

      // Calculate price
      let price = 0;
      if (selectedPrice === 'Free') {
        price = 0;
      } else if (selectedPrice === 'RM5') {
        price = 5;
      } else if (selectedPrice === 'RM10') {
        price = 10;
      } else if (selectedPrice === 'Custom') {
        const customPriceNum = parseFloat(customPrice);
        if (isNaN(customPriceNum) || customPriceNum < 0) {
          Alert.alert('Invalid Price', 'Please enter a valid custom price.');
          return;
        }
        price = customPriceNum;
      }

      // Map category to backend format
      let category = selectedCategory;
      if (selectedCategory === 'Vegetable') {
        category = 'Vegetables';
      }

      // Map delivery method (handle 'Grab' as 'Doorstep')
      let deliveryMethod = selectedDelivery;
      if (selectedDelivery === 'Grab') {
        deliveryMethod = 'Doorstep';
      }

      // Map status to backend format
      let status = 'to-ship';
      if (selectedStatus === 'Delivered') {
        status = 'delivered';
      } else if (selectedStatus === 'Cancelled') {
        status = 'cancelled';
      }

      // Parse best before date
      let bestBeforeDate: Date | undefined;
      if (bestBefore) {
        const [day, month, year] = bestBefore.split('-');
        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        bestBeforeDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
      }

      // Create FormData if image was changed, otherwise use JSON
      const hasNewImage = blindboxImage && blindboxImage !== originalImageUrl && blindboxImage.startsWith('file://');
      
      if (hasNewImage) {
        // Update with new image
        const formData = new FormData();
        const imageUri = blindboxImage;
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.([a-zA-Z0-9]+)$/i.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('image', {
          uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
          name: filename,
          type: type,
        } as any);

        formData.append('name', blindboxName.trim());
        formData.append('description', description.trim());
        formData.append('category', category);
        formData.append('price', price.toString());
        formData.append('deliveryMethod', deliveryMethod);
        formData.append('status', status);
        if (bestBeforeDate) {
          formData.append('bestBefore', bestBeforeDate.toISOString());
        }

        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data?.errors?.[0]?.msg || data?.error || 'Failed to update blindbox';
          Alert.alert('Error', errorMessage);
          return;
        }

        Alert.alert('Success', 'Blindbox updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        // Update without changing image
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: blindboxName.trim(),
            description: description.trim(),
            category,
            price,
            deliveryMethod,
            status,
            bestBefore: bestBeforeDate?.toISOString(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data?.errors?.[0]?.msg || data?.error || 'Failed to update blindbox';
          Alert.alert('Error', errorMessage);
          return;
        }

        Alert.alert('Success', 'Blindbox updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      console.error('Error updating blindbox:', error);
      Alert.alert('Error', 'Failed to update blindbox. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#365441' }}>
        <ActivityIndicator size="large" color="#E8F3E0" />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Edit Stock
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Image Input Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Blindbox Image
          </Text>
          
          <TouchableOpacity
            className="items-center justify-center rounded-3xl"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
              minHeight: 200,
              borderStyle: blindboxImage ? 'solid' : 'dashed',
            }}
            onPress={pickImage}
          >
            {blindboxImage ? (
              <Image 
                source={{ uri: blindboxImage }} 
                style={{ width: '100%', height: 200, borderRadius: 24 }}
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <ImageIcon size={48} stroke="#2C4A34" style={{ marginBottom: 8 }} />
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Tap to add image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Name Input Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Blindbox Name
          </Text>
          
          <TextInput
            placeholder="e.g. Mixed Veggies"
            placeholderTextColor="#6b7280"
            className="px-4 py-4 rounded-3xl text-base"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
              color: '#2C4A34',
              fontFamily: 'System',
            }}
            value={blindboxName}
            onChangeText={setBlindboxName}
          />
        </View>

        {/* BlindBox Details */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Blindbox Details
          </Text>
          
          <TextInput
            placeholder="Add description..."
            placeholderTextColor="#6b7280"
            className="px-4 py-4 rounded-3xl text-base"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
              color: '#2C4A34',
              fontFamily: 'System',
              minHeight: 100,
            }}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Category */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Category
          </Text>
          
          <View className="flex-row">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className="flex-1 items-center justify-center py-3 rounded-3xl mr-2"
                style={{ 
                  backgroundColor: selectedCategory === category ? '#E8F3E0' : '#2C4A34',
                  borderWidth: selectedCategory === category ? 0 : 1,
                  borderColor: '#E8F3E0',
                  minHeight: 60,
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: selectedCategory === category ? '#2C4A34' : '#E8F3E0',
                    fontFamily: 'System',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Price
          </Text>
          
          <View className="flex-row mb-3">
            {prices.map((price, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedPrice(price)}
                className="flex-1 items-center justify-center py-3 rounded-3xl mr-2"
                style={{ 
                  backgroundColor: selectedPrice === price ? '#E8F3E0' : '#2C4A34',
                  borderWidth: selectedPrice === price ? 0 : 1,
                  borderColor: '#E8F3E0',
                  minHeight: 60,
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: selectedPrice === price ? '#2C4A34' : '#E8F3E0',
                    fontFamily: 'System',
                  }}
                >
                  {price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Price Input */}
          {selectedPrice === 'Custom' && (
            <View className="flex-row items-center">
              <Text className="text-base font-semibold mr-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                RM
              </Text>
              <TextInput
                placeholder="Enter amount"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                className="flex-1 px-4 py-4 rounded-3xl text-base"
                style={{ 
                  backgroundColor: '#E8F3E0',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                  color: '#2C4A34',
                  fontFamily: 'System',
                }}
                value={customPrice}
                onChangeText={setCustomPrice}
              />
            </View>
          )}
        </View>

        {/* Delivery Method */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Delivery Method
          </Text>
          
          <View className="flex-row justify-between">
            {deliveryMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedDelivery(method.id)}
                  className="flex-1 items-center mx-1"
                >
                  <View 
                    className="items-center justify-center rounded-3xl mb-2"
                    style={{ 
                      width: '100%',
                      minHeight: 60,
                      backgroundColor: selectedDelivery === method.id ? '#E8F3E0' : '#2C4A34',
                      borderWidth: selectedDelivery === method.id ? 0 : 1,
                      borderColor: '#E8F3E0',
                    }}
                  >
                    <IconComponent 
                      size={24} 
                      stroke={selectedDelivery === method.id ? '#2C4A34' : '#E8F3E0'} 
                    />
                  </View>
                  <Text 
                    className="text-sm text-center font-semibold mt-2" 
                    style={{ 
                      color: '#E8F3E0',
                      fontFamily: 'System',
                    }}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Status */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Status
          </Text>
          
          <View className="flex-row">
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                className="flex-1 items-center justify-center py-3 rounded-3xl mr-2"
                style={{ 
                  backgroundColor: selectedStatus === status ? '#E8F3E0' : '#2C4A34',
                  borderWidth: selectedStatus === status ? 0 : 1,
                  borderColor: '#E8F3E0',
                  minHeight: 60,
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: selectedStatus === status ? '#2C4A34' : '#E8F3E0',
                    fontFamily: 'System',
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Best Before */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Best Before
          </Text>
          
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center px-4 py-4 rounded-3xl"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
            }}
          >
            <Calendar size={20} stroke="#2C4A34" style={{ marginRight: 12 }} />
            <Text 
              className="flex-1 text-base"
              style={{ 
                color: bestBefore ? '#2C4A34' : '#6b7280',
                fontFamily: 'System',
              }}
            >
              {bestBefore || 'DD-MM-YY'}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View 
              style={{ 
                flex: 1, 
                justifyContent: 'flex-end',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <View 
                style={{ 
                  backgroundColor: '#E8F3E0',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 20,
                  maxHeight: '60%',
                }}
              >
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    Select Date (DD-MM-YY)
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    className="px-4 py-2 rounded-2xl"
                    style={{ backgroundColor: '#C85E51' }}
                  >
                    <Text className="text-white font-semibold" style={{ fontFamily: 'System' }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Day Picker */}
                  <View className="mb-4">
                    <Text className="text-base font-semibold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      Day
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      className="flex-row"
                      style={{ maxHeight: 150 }}
                    >
                      {days.map((day) => (
                        <TouchableOpacity
                          key={day}
                          onPress={() => setSelectedDay(day)}
                          className="items-center justify-center mx-2 rounded-2xl"
                          style={{
                            width: 50,
                            height: 50,
                            backgroundColor: selectedDay === day ? '#2C4A34' : '#FDFBF5',
                            borderWidth: 1,
                            borderColor: '#2C4A34',
                          }}
                        >
                          <Text 
                            className="text-base font-semibold"
                            style={{ 
                              color: selectedDay === day ? '#E8F3E0' : '#2C4A34',
                              fontFamily: 'System',
                            }}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Month Picker */}
                  <View className="mb-4">
                    <Text className="text-base font-semibold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      Month
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      className="flex-row"
                      style={{ maxHeight: 150 }}
                    >
                      {months.map((month) => (
                        <TouchableOpacity
                          key={month}
                          onPress={() => {
                            setSelectedMonth(month);
                            // Adjust day if it exceeds days in new month
                            const maxDays = getDaysInMonth(month, selectedYear);
                            if (selectedDay > maxDays) {
                              setSelectedDay(maxDays);
                            }
                          }}
                          className="items-center justify-center mx-2 rounded-2xl"
                          style={{
                            width: 50,
                            height: 50,
                            backgroundColor: selectedMonth === month ? '#2C4A34' : '#FDFBF5',
                            borderWidth: 1,
                            borderColor: '#2C4A34',
                          }}
                        >
                          <Text 
                            className="text-base font-semibold"
                            style={{ 
                              color: selectedMonth === month ? '#E8F3E0' : '#2C4A34',
                              fontFamily: 'System',
                            }}
                          >
                            {month}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Year Picker */}
                  <View className="mb-4">
                    <Text className="text-base font-semibold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      Year
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      className="flex-row"
                      style={{ maxHeight: 150 }}
                    >
                      {years.map((year) => (
                        <TouchableOpacity
                          key={year}
                          onPress={() => {
                            setSelectedYear(year);
                            // Adjust day if it exceeds days in month for new year
                            const maxDays = getDaysInMonth(selectedMonth, year);
                            if (selectedDay > maxDays) {
                              setSelectedDay(maxDays);
                            }
                          }}
                          className="items-center justify-center mx-2 rounded-2xl"
                          style={{
                            width: 70,
                            height: 50,
                            backgroundColor: selectedYear === year ? '#2C4A34' : '#FDFBF5',
                            borderWidth: 1,
                            borderColor: '#2C4A34',
                          }}
                        >
                          <Text 
                            className="text-base font-semibold"
                            style={{ 
                              color: selectedYear === year ? '#E8F3E0' : '#2C4A34',
                              fontFamily: 'System',
                            }}
                          >
                            {year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  onPress={handleDateConfirm}
                  className="py-4 rounded-3xl items-center mt-4"
                  style={{ backgroundColor: '#C85E51' }}
                >
                  <Text className="text-white text-lg font-bold" style={{ fontFamily: 'System' }}>
                    Confirm Date
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      {/* SAVE Button */}
      <View className="px-4 pb-8 pt-4" style={{ backgroundColor: '#365441' }}>
        <TouchableOpacity 
          className="py-4 rounded-3xl items-center"
          style={{ backgroundColor: '#C85E51', opacity: saving ? 0.7 : 1 }}
          onPress={handleSave}
          disabled={saving || loading}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
