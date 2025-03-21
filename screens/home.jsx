import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, Image, 
    Alert, StyleSheet, KeyboardAvoidingView, Platform, 
    StatusBar, ScrollView 
} from 'react-native';
import Header from '../components/Header';
import { getProducts } from '../database/product';
import ProductD from '../components/VProductD';
import AddProduct from '../components/AddProduct';
export default function Home() {
    const [productCount, setProductCount] = useState(0);
    const [isProductVisible, setIsProductVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProductDVisible, setIsProductDVisible] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
            setFilteredProducts(data);
            setProductCount(data.length); // Set product count
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const toggleProductForm = () => {
        setIsProductVisible(!isProductVisible);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const openProductDetails = (product) => {
        setSelectedProduct(product);
        setIsProductDVisible(true);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <StatusBar style="auto" />
            <Header />
            
            <Text style={styles.title}>Welcome, Admin!</Text>
            <Text style={styles.countText}>Total Products: {productCount}</Text>
            
            <View style={styles.topContainer}>
                <View style={styles.searchContainer}>
                    <TextInput 
                        placeholder='Search product'
                        placeholderTextColor="#777"
                        style={styles.searchInput} 
                        value={searchQuery}
                        onChangeText={handleSearch} 
                    />
                    <TouchableOpacity style={styles.searchIconContainer}>
                        <Image 
                            source={require('../assets/Icon/search.png')} 
                            style={styles.searchIcon} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {isProductVisible && (
                    <AddProduct hideForm={toggleProductForm} refreshProducts={fetchProducts} />
                )}

                <View style={styles.content}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.productCon}
                                onPress={() => openProductDetails(product)} 
                            >
                                <Image 
                                    source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
                                    style={styles.productImage} 
                                />
                                <Text>{product.name}</Text>
                                <Text>{product.price}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noProductText}>No products found</Text>
                    )}
                </View>

                {isProductDVisible && selectedProduct && (
                    <ProductD 
                        isProductDVisible={isProductDVisible} 
                        setIsProductDVisible={setIsProductDVisible} 
                        product={selectedProduct}
                        onClose={() => setIsProductDVisible(false)}
                        refreshProducts={fetchProducts}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        fontFamily: 'PlayfairDisplay',
    },
    countText: {
        fontSize: 15,
        color: '#e6873c',
        fontStyle: 'italic',    
    },
    scrollContainer: {
        paddingBottom: 50,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    addButtonContainer: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 10,
    },
    addButton: {
        width: 30,
        height: 30,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginTop: 15,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontWeight: 'bold',
    },
    searchIconContainer: {
        padding: 5,
    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    content: {
        marginTop: 10,
    },
    productCon: {
        backgroundColor: '#005d67',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    noProductText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
    },
});
