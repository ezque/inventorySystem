import { View, Text, Modal, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { updateProduct, deleteProduct, createProductTable } from '../database/product';

export default function ProductDetails({ isVisible, product, refreshProducts, onClose }) {
    if (!product) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({ ...product });

    useEffect(() => {
        createProductTable();
    }, []);

    const handleUpdate = async () => {
        const success = await updateProduct(updatedProduct);
        if (success) {
            setIsEditing(false);
            refreshProducts();
        }
    };

    const handleDelete = async () => {
        const success = await deleteProduct(product.id);
        if (success) {
            onClose();
            refreshProducts();
        }
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Image source={require('../assets/Icon/closeIcon.png')} style={styles.closeIcon} />
                    </TouchableOpacity>
                    
                    <Image source={{ uri: updatedProduct.image }} style={styles.image} />
                    
                    {isEditing ? (
                        <View style={styles.formContainer}>
                            {['name', 'description', 'expiry_date', 'category_id', 'supplier_id'].map((field) => (
                                <TextInput
                                    key={field}
                                    value={updatedProduct[field] || ''}
                                    onChangeText={(text) => setUpdatedProduct({ ...updatedProduct, [field]: text })}
                                    style={styles.input}
                                    placeholder={`Enter ${field.replace('_', ' ')}`}
                                    placeholderTextColor="#aaa"
                                />
                            ))}
                            {['price', 'quantity'].map((field) => (
                                <TextInput
                                    key={field}
                                    value={updatedProduct[field]?.toString() || ''}
                                    onChangeText={(text) => setUpdatedProduct({ ...updatedProduct, [field]: parseFloat(text) || 0 })}
                                    keyboardType="numeric"
                                    style={styles.input}
                                    placeholder={`Enter ${field.replace('_', ' ')}`}
                                    placeholderTextColor="#aaa"
                                />
                            ))}
                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.detailsContainer}>
                            {Object.entries(updatedProduct).map(([key, value]) => (
                                ['id', 'image'].includes(key) ? null : (
                                    <View key={key} style={styles.textRow}>
                                        <Text style={styles.label}>{key.replace('_', ' ').toUpperCase()}:</Text>
                                        <View style={styles.valueC}><Text style={styles.value}>{value}</Text></View>
                                    </View>
                                )
                            ))}
                            {/* Display Category and Supplier */}
                            {product.category_name && (
                                <View style={styles.textRow}>
                                    <Text style={styles.label}>CATEGORY:</Text>
                                    <View style={styles.valueC}><Text style={styles.value}>{product.category_name}</Text></View>
                                </View>
                            )}
                            {product.supplier_name && (
                                <View style={styles.textRow}>
                                    <Text style={styles.label}>SUPPLIER:</Text>
                                    <View style={styles.valueC}><Text style={styles.value}>{product.supplier_name}</Text></View>
                                </View>
                            )}
                        </View>
                    )}
                    
                    <View style={styles.buttonGroup}>
                        {isEditing ? (
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    container: { width: 350, backgroundColor: '#2c3e50', padding: 20, borderRadius: 15, alignItems: 'center' },
    closeButton: { position: 'absolute', top: 10, right: 10 },
    closeIcon: { width: 24, height: 24, tintColor: '#fff' },
    image: { width: 180, height: 180, borderRadius: 12, marginBottom: 15, borderWidth: 2, borderColor: '#ecf0f1' },
    detailsContainer: { width: '100%', marginBottom: 10 },
    textRow: { flexDirection: 'row', marginBottom: 8, justifyContent: 'space-between' },
    label: { fontSize: 14, color: '#f1c40f', fontWeight: 'bold' },
    valueC: { width: '60%' },
    value: { fontSize: 16, color: '#ecf0f1', textAlign: 'left' },
    formContainer: { width: '100%' },
    input: { backgroundColor: '#34495e', color: '#fff', padding: 10, marginBottom: 10, borderRadius: 5, fontSize: 16 },
    buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15 },
    editButton: { backgroundColor: '#1abc9c', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
    saveButton: { backgroundColor: '#3498db', padding: 10, borderRadius: 8, width: '100%', marginTop: 10 },
    cancelButton: { backgroundColor: '#95a5a6', padding: 10, borderRadius: 8, flex: 1, marginRight: 5 },
    deleteButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 8, flex: 1, marginLeft: 5 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }
});
