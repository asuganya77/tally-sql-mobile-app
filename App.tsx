/**
 * Tally Mobile App - Phase 1
 * Dashboard | Ledger | Vouchers
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import LedgerScreen    from './src/screens/LedgerScreen';
import VoucherScreen   from './src/screens/VoucherScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const icons: Record<string, string> = { Dashboard: '📊', Ledger: '📒', Vouchers: '🧾' };
            return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[route.name]}</Text>;
          },
          tabBarActiveTintColor: '#4A6CF7',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: { height: 60, paddingBottom: 8 },
          headerStyle: { backgroundColor: '#4A6CF7' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Ledger"    component={LedgerScreen} />
        <Tab.Screen name="Vouchers"  component={VoucherScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
