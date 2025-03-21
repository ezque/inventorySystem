import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import openDatabase from "../database/database";
import { setupAccountsTable } from "../database/accounts";
import * as Crypto from "expo-crypto";
import Header from "../components/Header"

export default function Settings() {
    const [accounts, setAccounts] = useState([]);
    const [loggedInEmail, setLoggedInEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    useEffect(() => {
        setupAccountsTable();
        fetchAccounts();
        loadLoggedInUser();
    }, []);

    async function loadLoggedInUser() {
        const email = await AsyncStorage.getItem("loggedInUser");
        if (email) setLoggedInEmail(email);
    }

    async function fetchAccounts() {
        const db = await openDatabase();
        const accounts = await db.getAllAsync("SELECT id, email FROM accounts");
        setAccounts(accounts);
    }

    async function hashPassword(password) {
        return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
    }

    async function updateAccount() {
        if (!currentPassword || !newEmail || !newPassword) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        const db = await openDatabase();
        const hashedCurrentPassword = await hashPassword(currentPassword);

        const users = await db.getAllAsync("SELECT * FROM accounts WHERE email = ? AND password = ?", [loggedInEmail, hashedCurrentPassword]);
        if (users.length === 0) {
            Alert.alert("Error", "Incorrect current password.");
            return;
        }

        const hashedNewPassword = await hashPassword(newPassword);
        await db.runAsync("UPDATE accounts SET email = ?, password = ? WHERE email = ?", [newEmail, hashedNewPassword, loggedInEmail]);

        Alert.alert("Success", "Account updated!");
        await AsyncStorage.setItem("loggedInUser", newEmail); // Update stored email
        setLoggedInEmail(newEmail);
        setCurrentPassword("");
        setNewEmail("");
        setNewPassword("");
        fetchAccounts();
    }

    return (
        <View style={styles.container}>
            <Header/>
            <Text style={styles.title}>Settings</Text>

            {loggedInEmail ? (
                <>
                    <Text style={styles.label}>Update My Account</Text>
                    <Text>Current Email: {loggedInEmail}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New Email"
                        value={newEmail}
                        onChangeText={setNewEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <Button title="Update My Account" onPress={updateAccount} />
                </>
            ) : (
                <Text>Please log in to update your account.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    }
});
