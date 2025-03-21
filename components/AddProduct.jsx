import { ScrollView, View, Text, TouchableOpacity, Image, TextInput, Alert, Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { saveProduct } from '../database/product';
import { getCategories } from '../database/category';
import { getSuppliers } from '../database/supplierT';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 

export default function AddProduct({ hideForm, refreshProducts }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [image, setImage] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
    }, []);

    const fetchCategories = async () => {
        try {
            const results = await getCategories();
            setCategories(results.map((row) => ({ label: row.name, value: row.id })));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const results = await getSuppliers();
            setSuppliers(results.map((row) => ({ label: row.name, value: row.id })));
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
            setExpiryDate(selectedDate.toISOString().split('T')[0]);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const validateInputs = () => {
        if (!name.trim() || !description.trim() || !price.trim() || !quantity.trim() || !categoryId || !supplierId) {
            Alert.alert("Validation Error", "Please fill in all required fields.");
            return false;
        }

        if (isNaN(price) || isNaN(quantity)) {
            Alert.alert("Validation Error", "Price and Quantity must be numbers.");
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateInputs()) return;

        const result = await saveProduct({ name, description, price, quantity, expiryDate, categoryId, supplierId, image });
        if (result.success) {
            Alert.alert("Success", result.message);
            hideForm();
            refreshProducts();
        } else {
            console.log("Error saving product:", result.message);
            Alert.alert("Error", result.message.toString());
        }
    };

    return (
            <View style={styles.addProductBox}>
                <View style={styles.addProductTop}>
                    <Text style={styles.headerText}>NEW PRODUCT</Text>
                    <TouchableOpacity onPress={hideForm}>
                        <Image source={require('../assets/Icon/closeIcon.png')} style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.addProductContent}>
                    <View style={styles.imageCon}>
                        <TouchableOpacity style={styles.previewCon} onPress={pickImage}>
                            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                        </TouchableOpacity>
                        <Text style={styles.label}>Select Image</Text>
                    </View>

                    {[
                        { label: "Name", state: name, setter: setName },
                        { label: "Description", state: description, setter: setDescription },
                        { label: "Price", state: price, setter: setPrice },
                        { label: "Quantity", state: quantity, setter: setQuantity },
                    ].map(({ label, state, setter }) => (
                        <View key={label}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter ${label}`}
                                value={state}
                                onChangeText={setter}
                            />
                        </View>
                    ))}

                    <View>
                        <Text style={styles.label}>Expiry Date</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                            <Text>{expiryDate || "Select Expiry Date"}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
                        )}
                    </View>

                    <RNPickerSelect
                        onValueChange={setCategoryId}
                        items={categories}
                        placeholder={{ label: "Select a category...", value: null }}
                        style={styles.input}
                    />

                    <RNPickerSelect
                        onValueChange={setSupplierId}
                        items={suppliers}
                        placeholder={{ label: "Select a supplier...", value: null }}
                        style={styles.input}
                    />
                </ScrollView>

                <View style={styles.saveButtonContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
    );
}
const styles = StyleSheet.create({
    addProductBox: { 
        position: "relative",
        top: 320,
        transform: [{ translateX: 0 }, { translateY: -300 }],
        width: "90%",
        Height: 550,
        backgroundColor: "#073c47",
        borderRadius: 20,
        padding: 20,
        zIndex: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        borderColor: "#222",
        margin: 20,
    },
    addProductTop: { 
        flexDirection: "row", 
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    headerText: { 
        color: "#ffb74d", 
        fontSize: 20, 
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    closeIcon: { 
        width: 28, 
        height: 28,
        tintColor: "#fff",
    },
    label: { 
        color: "#ffb74d", 
        fontSize: 14, 
        marginBottom: 5,
        fontWeight: "600",
    },
    input: { 
        backgroundColor: "#fff", 
        paddingVertical: 12, 
        paddingHorizontal: 15,
        borderRadius: 12, 
        marginBottom: 12,
        fontSize: 14,
        color: "#333",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    imageCon: { 
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    previewCon: {
        width: 110,
        height: 110,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
    },
    imagePreview: { 
        width: "100%", 
        height: "100%", 
        borderRadius: 10,
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