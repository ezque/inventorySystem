import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState } from "react";
import { updateCategory, deleteCategory } from '../database/category';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function VCategoryD({ category, onClose, refreshCategories }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategory, setEditedCategory] = useState({ ...category });

    const handleEdit = () => setIsEditing(true);
    const handleSave = async () => {
        await updateCategory(editedCategory);
        setIsEditing(false);
        refreshCategories();
        onClose();
    };
    const handleDelete = async () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this category?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: async () => {
                    await deleteCategory(category.id);
                    refreshCategories();
                    onClose();
                }}
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Category Details</Text>
                <TouchableOpacity onPress={onClose}>
                    <Image source={require('../assets/Icon/closeIcon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.detailsContainer}>
                {["name", "description"].map((key) => (
                    <View key={key} style={styles.detailRow}>
                        <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={editedCategory[key]?.toString()}
                                onChangeText={(text) => setEditedCategory({ ...editedCategory, [key]: text })}
                            />
                        ) : (
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailText}>{category[key]}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#073c47", 
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderColor: "#222",
        borderWidth: 1,
        position: "absolute",
        width: "90%",
        top: 0,
        left: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#bbb",
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffb74d",
        textTransform: "uppercase",
        letterSpacing: 1.2,
    },
    closeIcon: {
        width: 26,
        height: 26,
        tintColor: "#ffcc80",
    },
    detailsContainer: {
        marginBottom: 25,
        gap: 15,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        justifyContent: "space-between",
        width: "100%",
    },
    label: {
        fontWeight: "bold",
        color: "#ffb74d",
        fontSize: 16,
        textTransform: "capitalize",
    },
    detailTextContainer: {
        width: "60%",
        height: 45,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#bbb",
    },
    detailText: {
        fontSize: 15,
        color: "#ddd",
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        color: "#fff",
        fontSize: 15,
        paddingVertical: 6,
        width: "65%",
        height: 42,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 0,
    },
    editButton: {
        flex: 1,
        backgroundColor: "#1e88e5",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
        shadowColor: "#1e88e5",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#e53935",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginLeft: 10,
        shadowColor: "#e53935",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#43a047",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
        shadowColor: "#43a047",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#757575",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginLeft: 10,
        shadowColor: "#757575",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
    }
});
