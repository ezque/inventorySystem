import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const hideMenu = () => {
        if (isMenuVisible) {
            setIsMenuVisible(false);
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('loggedInUser');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={hideMenu}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.logoContainer} onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../assets/Logo/header-logo-enhanced.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={styles.burgerContainer}>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Image source={require('../assets/Icon/menu.png')} style={styles.burgerButton}/>
                    </TouchableOpacity>
                </View>
                
                {isMenuVisible && (
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Product')}>
                            <Image source={require('../assets/Icon/product.png')} style={styles.menuButtonImage} />
                            <Text style={styles.menuButtonText}>Product</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Category')}>
                            <Image source={require('../assets/Icon/category.png')} style={styles.menuButtonImage} />
                            <Text style={styles.menuButtonText}>Category</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Supplier')}>
                            <Image source={require('../assets/Icon/supplier.png')} style={styles.menuButtonImage} />
                            <Text style={styles.menuButtonText}>Supplier</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings')}>
                            <Image source={require('../assets/Icon/settings.png')} style={styles.menuButtonImage} />
                            <Text style={styles.menuButtonText}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
                            <Image source={require('../assets/Icon/logout.png')} style={styles.menuButtonImage} />
                            <Text style={styles.menuButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 150,
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 999,
    },
    logoContainer: {
        width: "60%",
        height: "70%",
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: "100%",
        height: "80%",
    },
    burgerContainer: {
        width: "20%",
        height: "70%",
        padding: 5,
        alignItems: "flex-end",
        justifyContent: "center",
    },
    burgerButton: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    menuContainer: {
        width: 190,
        height: 300,
        borderWidth: 1,
        position: "absolute",
        top: 120,
        right: 10,
        backgroundColor: "#005d67",
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 20,
        gap: 15,
        zIndex: 999,
        elevation: 10, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    menuButton: {
        width: "100%",
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        gap: 15,
        borderRadius: 10,
    },
    menuButtonImage: {
        width: 35,
        height: 35,
    },
    menuButtonText: {
        color: "#fff",
    },
});
