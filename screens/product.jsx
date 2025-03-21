import { 
    View, Text, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Header from '../components/Header';
import AddProduct from '../components/AddProduct';
import { getProducts } from '../database/product';
import ProductD from '../components/VProductD';

export default function Product() {
    const [isProductVisible, setIsProductVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProductDVisible, setIsProductDVisible] = useState(false);

    const toggleProductForm = () => {
        setIsProductVisible(!isProductVisible);
    };

    const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
        <View style={styles.container}>
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Top Section */}
                <View style={styles.topContainer}>
                    
                    <TouchableOpacity 
                        style={styles.addButtonContainer}
                        onPress={toggleProductForm}
                    >
                        <Image source={require('../assets/Icon/add-product1.png')} style={styles.addButton}/>
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <TextInput 
                            placeholder='Search product...'
                            placeholderTextColor="#555"
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

                {isProductVisible && <AddProduct hideForm={toggleProductForm} refreshProducts={fetchProducts} />}

                <View style={styles.content}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.productCon}
                                onPress={() => openProductDetails(product)}
                            >
                                <Image source={{ uri: product.image }} style={styles.productImage} />
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productPrice}>${product.price}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noProductText}>No products found</Text>
                    )}
                </View>

                {isProductDVisible && (
                    <ProductD 
                        isProductDVisible={isProductDVisible} 
                        setIsProductDVisible={setIsProductDVisible} 
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        refreshProducts={fetchProducts}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f8fa",
        paddingHorizontal: 15,
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    addButtonContainer: {
        padding: 10,
        borderRadius: 10,
    },
    addButton: {
        width: 130,
        height: 35,
        resizeMode: "contain",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#007f8b",
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingHorizontal: 12,
        elevation: 3,
        height: 40,
        width: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingVertical: 6,
    },
    searchIconContainer: {
        padding: 5,
    },
    searchIcon: {
        width: 22,
        height: 22,
        tintColor: "#007f8b",
    },
    content: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    productCon: {
        width: "48%", 
        height: 170,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#073c47",
        marginBottom: 10,
        padding: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: 90,
        height: 90,
        resizeMode: "contain",
        marginBottom: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center",
    },
    productPrice: {
        fontSize: 14,
        fontWeight: "500",
        color: "#fff",
        textAlign: "center",
    },
    noProductText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16,
        marginTop: 10,
    },
});

