import { ScrollView, View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { saveSupplier } from '../database/supplierT';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
export default function AddSupplier({ hideForm, refreshSuppliers }) {
    const [gender, setGender] = useState(""); 
    const [pickerFocused, setPickerFocused] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");

    const handleSave = async () => {
        if (!name.trim() || !email.trim() || !age.trim() || !gender || !address.trim() || !contact.trim()) {
            Alert.alert("Validation Error", "Please fill in all fields.");
            return;
        }
    
        try {
            console.log("Saving supplier with data:", { name, email, age, gender, address, contact });
            const result = await saveSupplier({
                name,
                email,
                age,
                gender,
                address,
                contact,
            });
    
            console.log("Save result:", result);
    
            if (result.success) {
                Alert.alert("Success", result.message);
                hideForm();
                refreshSuppliers();
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.error("Save supplier error:", error);
            Alert.alert("Error", error.message);
        }
    };
    

    return (
        <KeyboardAwareScrollView 
            enableOnAndroid={true}
            extraScrollHeight={0}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={false}
        >
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textIcon}>NEW SUPPLIER</Text>
                <TouchableOpacity style={styles.closeButton} onPress={hideForm}>
                    <Image source={require('../assets/Icon/closeIcon.png')} style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.perInput}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />
                </View>
                <View style={styles.perInput}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
                </View>
                <View style={styles.perInput}>
                    <Text style={styles.label}>Age:</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />
                </View>
                <View style={styles.perInput}>
                    <Text style={styles.label}>Gender:</Text>
                    <View style={[styles.pickerContainer, pickerFocused && { zIndex: 10 }]}>
                        <Picker
                            selectedValue={gender} 
                            onValueChange={(itemValue) => setGender(itemValue)}
                            style={styles.picker}
                            mode='dropdown'
                            onFocus={() => setPickerFocused(true)}
                            onBlur={() => setPickerFocused(false)}
                        >
                            <Picker.Item label="Select here" value="" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>
                </View>
                <View style={styles.perInput}>
                    <Text style={styles.label}>Address:</Text>
                    <TextInput placeholderTextColor="#777" style={styles.input} value={address} onChangeText={setAddress} />
                </View>
                <View style={styles.perInput}>
                    <Text style={styles.label}>Contact:</Text>
                    <TextInput placeholderTextColor="#777" style={styles.input} keyboardType="phone-pad" value={contact} onChangeText={setContact} />
                </View>
            </View>
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={{ color: '#FFFFFF', fontSize: 16 }}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        top: 300,
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    textIcon: {
        color: "#ffb74d",
        fontSize: 22,
        fontWeight: "bold",
    },
    closeIcon: {
        width: 28,
        height: 28,
        tintColor: "#fff",
    },
    inputContainer: {
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    perInput: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    label: {
        color: "#ffb74d",
        fontSize: 16,
        fontWeight: "bold",
        width: "25%", 
        textAlign: "right",
    },
    input: {
        width: "70%", 
        height: 45,  
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 25,
        paddingHorizontal: 15,
        backgroundColor: "#c0f1ee",
        fontSize: 16,  
    },
    pickerContainer: {
        width: "70%",
        height: 45,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 25,
        backgroundColor: "#c0f1ee",
        justifyContent: "center",
        position: "relative",
        overflow: "visible",
        zIndex: 1,
    },
    picker: {
        color: "#333",
        height: 50,
        width: "100%",
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
    },
});
