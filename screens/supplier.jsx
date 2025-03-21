import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, } from 'react-native';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // ✅ Import this

import Header from '../components/Header';
import AddSupplier from '../components/AddSupplier';
import { getSuppliers } from '../database/supplierT';
import SupplierD from '../components/VSupplierD';

export default function Supplier() {
    const [isSupplierVisible, setIsSupplierVisible] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSupplierForm = () => {
        setIsSupplierVisible(!isSupplierVisible);
    };

    const fetchSuppliers = async () => {
        const data = await getSuppliers();
        setSuppliers(data);
        setFilteredSuppliers(data); 
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredSuppliers(suppliers); 
        } else {
            const filtered = suppliers.filter(supplier =>
                supplier.name.toLowerCase().startsWith(query.toLowerCase())
            );
            setFilteredSuppliers(filtered);
        }
    };

    return (
        <KeyboardAwareScrollView 
            enableOnAndroid={true}
            extraScrollHeight={0}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={false}
        >

            <StatusBar style="auto" />
            <Header />
            <ScrollView>
                <View style={styles.topContainer}>
                    <TouchableOpacity 
                        style={styles.addButtonContainer}
                        onPress={toggleSupplierForm}
                    >
                        <Image source={require('../assets/Icon/add-supplier1.png')} style={styles.addButton}/>
                    </TouchableOpacity>

                    <View style={styles.searchContainer}>
                        <TextInput 
                            placeholder='Search supplier' 
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
                {isSupplierVisible && <AddSupplier hideForm={toggleSupplierForm} refreshSuppliers={fetchSuppliers} />}
                
                <View style={styles.content}>
                    <View style={styles.tableRowHeader}>
                        <Text style={[styles.tableHeaderText, styles.idColumn]}>ID</Text>
                        <Text style={[styles.tableHeaderText, styles.nameColumn]}>Name</Text>
                        <Text style={[styles.tableHeaderText, styles.actionColumn]}>Action</Text>
                    </View>

                    {filteredSuppliers.length > 0 ? (
                        filteredSuppliers.map((supplier) => (
                            <View style={styles.tableRow} key={supplier.id}>
                                <Text style={[styles.tableCell, styles.idColumn]}>{supplier.id}</Text>
                                <Text style={[styles.tableCell, styles.nameColumn]}>{supplier.name}</Text>
                                <View style={[styles.tableCell, styles.actionColumn]}>
                                    <TouchableOpacity onPress={() => setSelectedSupplier(supplier)} >
                                        <Text style={styles.view}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No suppliers found.</Text>
                    )}

                    {selectedSupplier && (
                        <SupplierD 
                            supplier={selectedSupplier} 
                            onClose={() => setSelectedSupplier(null)} 
                            refreshSuppliers={fetchSuppliers} 
                        />
                    )}
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f9",
        paddingHorizontal: 10,
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
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingVertical: 6,
        width: 200,
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
        marginTop: 20,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        minHeight: 650,
    },
    tableRowHeader: {
        flexDirection: "row",
        backgroundColor: "#073c47",
        paddingVertical: 12,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    tableHeaderText: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
        fontSize: 15,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
        backgroundColor: "#f9f9f9",
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
        color: "#005d67",
        fontSize: 14,
        fontWeight: "bold",
        paddingVertical: 8,
    },
    idColumn: {
        flex: 1.2,
    },
    nameColumn: {
        flex: 2.5,
    },
    actionColumn: {
        flex: 1.5,
        alignItems: "center",
    },
    view: {
        backgroundColor: "#073c47",
        color: "#fff",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    noDataText: {
        textAlign: "center",
        fontSize: 16,
        color: "#777",
        marginTop: 15,
    },
});

