import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './screens/DashboardScreen';
import LedgerScreen from './screens/LedgerScreen';
import VoucherScreen from './screens/VoucherScreen';
import StockScreen from './screens/StockScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Ledgers" component={LedgerScreen} />
        <Tab.Screen name="Vouchers" component={VoucherScreen} />
        <Tab.Screen name="Stock" component={StockScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
