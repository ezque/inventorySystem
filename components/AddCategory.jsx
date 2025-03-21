import { ScrollView, View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { saveCategory } from '../database/category';
import { useState } from 'react';

export default function AddCategory( { hideForm, refreshCategories } ) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = async () => {
        if (!name.trim() || !description.trim()) {
            Alert.alert("Validation Error", "Please fill in all fields.");
            return;
        }

        const result = await saveCategory({
            name,
            description,
        });

        if (result.success) {
            Alert.alert("Success", result.message);
            hideForm();
            refreshCategories();
        } else {
            Alert.alert("Error", result.message);
        }
    }

    
    return (
            <View style={styles.addCategoryBox}>
                <View style={styles.addCategoryTop}>
                    <Text style={styles.headerText}>NEW CATEGORY</Text>
                    <TouchableOpacity onPress={hideForm}>
                        <Image source={require('../assets/Icon/closeIcon.png')} style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.addCategoryContent}>
                    <Text style={styles.label}>Category Name</Text>
                    <TextInput style={styles.input} placeholder="Enter category name" placeholderTextColor="#ccc" value={name} onChangeText={setName} />

                    <Text style={styles.label}>Category Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        placeholder="Enter category description" 
                        placeholderTextColor="#ccc" 
                        multiline 
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    addCategoryBox: {
        position: "relative",
        top: 300,
        transform: [{ translateX: 0 }, { translateY: -300 }],
        width: "90%",
        Height: 550,
        backgroundColor: "#073c47",
        borderRadius: 20,
        padding: 20,
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        borderColor: "#222",
        margin: 20,
    },
    addCategoryTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    headerText: {
        color: "#ffb74d",
        fontSize: 22,
        fontWeight: "bold",
    },
    closeIcon: {
        width: 26,
        height: 26,
        tintColor: "#fff",
        padding: 5,
    },
    addCategoryContent: {
        marginBottom: 15,
    },
    label: {
        color: "#ffb74d",
        fontSize: 16,
        fontWeight: "bold",
        width: "40%", 
        textAlign: "left",
        marginBottom: 12,
    },
    input: {
        backgroundColor: "#F4F4F4",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 15,
        color: "#333",
        marginBottom: 12,
    },
    textArea: {
        height: 90,
        textAlignVertical: "top",
    },
    saveButtonContainer: {
        width: "100%",
        marginTop: 15,
        alignItems: "center",
    },
    saveButton: {
        width: 120,
        height: 45,
        backgroundColor: "#e6873c",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.8,
    },
});

