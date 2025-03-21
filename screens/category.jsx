import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';

import Header from '../components/Header';
import AddCategory from '../components/AddCategory';
import CategoryDetails from '../components/VCategoryD';
import { getCategories } from '../database/category';

export default function Category() {
    const [isCategoryVisible, setIsCategoryVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const toggleCategoryForm = () => {
        setIsCategoryVisible(!isCategoryVisible);
    };

    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data);
        setFilteredCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Header />
            <View style={styles.thehead}>
                <TouchableOpacity 
                    style={styles.addButtonContainer}
                    onPress={toggleCategoryForm}
                >
                    <Image source={require('../assets/Icon/add-category1.png')} style={styles.addButton}/>
                </TouchableOpacity>
            </View>
            {isCategoryVisible && <AddCategory hideForm={toggleCategoryForm} refreshCategories={fetchCategories} />}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.content}>
                    <View style={styles.tableRowHeader}>
                        <Text style={[styles.tableHeaderText, styles.idColumn]}>ID</Text>
                        <Text style={[styles.tableHeaderText, styles.nameColumn]}>Category</Text>
                        <Text style={[styles.tableHeaderText, styles.actionColumn]}>Action</Text>
                    </View>

                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <View style={styles.tableRow} key={category.id}>
                                <Text style={[styles.tableCell, styles.idColumn]}>{category.id}</Text>
                                <Text style={[styles.tableCell, styles.nameColumn]}>{category.name}</Text>
                                <View style={[styles.tableCell, styles.actionColumn]}>
                                    <TouchableOpacity onPress={() => setSelectedCategory(category)}>
                                        <Text style={styles.view}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No categories found.</Text>
                    )}

                    {selectedCategory && (
                        <CategoryDetails 
                            category={selectedCategory} 
                            onClose={() => setSelectedCategory(null)} 
                            refreshCategories={fetchCategories} 
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f9",
        paddingHorizontal: 10,
    },
    thehead: {
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
    scrollContainer: {
        paddingBottom: 20,
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
        textAlign: 'center',
        marginTop: 10,
        color: 'gray',
    }
});