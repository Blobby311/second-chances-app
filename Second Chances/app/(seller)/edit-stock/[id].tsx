import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Image, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Menu, DoorOpen, Users, ShoppingCart, Image as ImageIcon, Calendar } from 'lucide-react-native';
import '../../../global.css';

// TODO: Replace with API call - This should fetch the item by ID
const getStockItemById = (id: string) => {
  // Mock data - in real app, fetch from API
  // This should match the STOCK_DATA from stock.tsx
  const allItems = [
    {
      id: '1',
      name: 'Rescued Veggie Box',
      category: 'Vegetables',
      price: 'RM10',
      bestBefore: '01-09-25',
      status: 'Available',
      deliveryMethod: 'Grab',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
      description: 'Fresh mixed vegetables',
    },
    {
      id: '2',
      name: 'Sunrise Fruit Crate',
      category: 'Fruits',
      price: 'RM15',
      bestBefore: '02-09-25',
      status: 'Available',
      deliveryMethod: 'Doorstep',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
      description: 'Fresh seasonal fruits',
    },
    {
      id: '3',
      name: 'Organic Veg Rescue',
      category: 'Vegetables',
      price: 'RM12',
      bestBefore: '03-09-25',
      status: 'Available',
      deliveryMethod: 'Self Pick-Up',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
      description: 'Organic vegetable mix',
    },
    {
      id: '4',
      name: 'Neighbor\'s Free Gift',
      category: 'Mix',
      price: 'RM0',
      bestBefore: '01-09-25',
      status: 'Delivered',
      deliveryMethod: 'Grab',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
      description: 'Community free gift',
    },
    {
      id: '5',
      name: 'Fresh Fruit Basket',
      category: 'Fruits',
      price: 'RM18',
      bestBefore: '02-09-25',
      status: 'Delivered',
      deliveryMethod: 'Doorstep',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
      description: 'Fresh fruit selection',
    },
    {
      id: '6',
      name: 'Mixed Veggie Box',
      category: 'Vegetables',
      price: 'RM10',
      bestBefore: '01-09-25',
      status: 'Cancelled',
      deliveryMethod: null,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
      description: 'Mixed vegetable box',
    },
  ];
  return allItems.find(item => item.id === id) || allItems[0];
};

export default function EditStockScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const stockItem = useMemo(() => getStockItemById(id), [id]);

  const [blindboxName, setBlindboxName] = useState(stockItem.name);
  const [blindboxImage, setBlindboxImage] = useState<string | null>(stockItem.imageUrl);
  const [description, setDescription] = useState(stockItem.description || '');
  const [selectedCategory, setSelectedCategory] = useState(stockItem.category);
  const [priceValue, setPriceValue] = useState(stockItem.price.replace('RM', '').trim());
  const [selectedPrice, setSelectedPrice] = useState(priceValue === '0' ? 'Free' : priceValue === '5' ? 'RM5' : priceValue === '10' ? 'RM10' : 'Custom');
  const [customPrice, setCustomPrice] = useState(selectedPrice === 'Custom' ? priceValue : '');
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(stockItem.deliveryMethod);
  const [selectedStatus, setSelectedStatus] = useState(stockItem.status);
  const [bestBefore, setBestBefore] = useState(stockItem.bestBefore);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
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

  const initialDate = parseDate(stockItem.bestBefore);
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

  const handleSave = () => {
    // TODO: Handle save action with API call
    console.log('Saving stock item:', {
      id,
      blindboxName,
      blindboxImage,
      description,
      selectedCategory,
      selectedPrice,
      customPrice,
      selectedDelivery,
      selectedStatus,
      bestBefore,
    });
    Alert.alert('Success', 'Stock item updated successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

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
            onPress={() => {
              // TODO: Handle image picker
              console.log('Open image picker');
            }}
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
          style={{ backgroundColor: '#C85E51' }}
          onPress={handleSave}
        >
          <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
