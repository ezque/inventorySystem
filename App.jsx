import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

import Login from "./screens/login";
import Home from "./screens/home";
import Product from "./screens/product";
import Category from "./screens/category";
import Supplier from "./screens/supplier";
import Settings from "./screens/settings";

import { setupAccountsTable, checkAuth } from "./database/accounts";
import { createSupplierTable } from "./database/supplierT";
import { createProductTable } from "./database/product";
import { createCategoryTable } from "./database/category";

// ✅ Reset database on app start
import { resetDatabase } from "./database/accounts";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  // ✅ Reset database on app start
  // useEffect(() => { 
  //   resetDatabase();
  // }, []);

  useEffect(() => {
    createSupplierTable();
  }, []);

  useEffect(() => {
    createSupplierTable();
  }, []);

  useEffect(() => {
    createSupplierTable();
  }, []);

  useEffect(() => {
    setupAccountsTable();
    
    checkAuth((authStatus) => {
      setIsLoggedIn(authStatus);
      setLoading(false);
    });
  }, []);

  const [fontsLoaded] = useFonts({
    "PlayfairDisplay": require("./assets/font/PlayfairDisplay-VariableFont_wght.ttf"),
    "Recoleta": require("./assets/font/Recoleta-RegularDEMO.otf"),
    "Roboto": require("./assets/font/Roboto-VariableFont_wdth,wght.ttf"),
  });

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn && 
          <Stack.Screen name="Login">
          {props => <Login {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        }
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Supplier" component={Supplier} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
