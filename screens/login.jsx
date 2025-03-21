import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { setupAccountsTable, loginAccount } from '../database/accounts';

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        async function checkUser() {
            const user = await AsyncStorage.getItem('loggedInUser');
            if (user) {
                setIsLoggedIn(true);
                navigation.replace('Home');
            }
        }
        checkUser();
    }, []);

    async function handleLogin() {
        try {
            const success = await loginAccount(email, password);
            if (success) {
                await AsyncStorage.setItem('loggedInUser', email);
                setIsLoggedIn(true); // ✅ Update App.js state
                navigation.replace('Home');
            } else {
                Alert.alert("Error", "Invalid email or password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    }
    

    return (
        <View style={styles.container}>
            <Image source={require('../assets/login/loginLogo.png')} style={styles.loginLogo} />
            <Image source={require('../assets/login/welcomeBack.png')} style={styles.welcomeLogo} />
            
            <View style={styles.inputContainer}>
                <Image source={require('../assets/login/EmailIcon.png')} style={styles.emailPasswordIcon} />
                <TextInput 
                    placeholder="Email" 
                    style={styles.input} 
                    placeholderTextColor="#FFFFFF"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Image source={require('../assets/login/passwordIcon.png')} style={styles.emailPasswordIcon} />
                <TextInput 
                    placeholder="Password"  
                    style={styles.input}   
                    placeholderTextColor="#FFFFFF" 
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeButton} 
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <Image source={isPasswordVisible ? require('../assets/login/hideIcon.png') : require('../assets/login/showIcon.png')} style={styles.eye} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={{color: '#FFFFFF', fontSize: 16}}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    loginLogo: {
        width: '70%',
        height: 220,
    },
    welcomeLogo: {
        width: '42%',
        height: 20,
    },
    inputContainer: {
        width: '80%',
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#005d67',
        alignItems: 'center',
        paddingHorizontal: 15, 
        borderRadius: 20,
    },
    input: {
        flex: 1,
        height: '100%', 
        color: "#FFFFFF",
        fontSize: 13, 
        marginLeft: 5,
    },
    emailPasswordIcon: {
        width: 20,
        height: 20,
    },
    eyeButton: {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
    },
    eye: {
        width: 20,
        height: 20,
    },
    loginButton: {
        width: 100,
        height: 30,
        backgroundColor: '#005d67',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
});
