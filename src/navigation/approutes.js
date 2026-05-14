import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen    from '../screens/loginscreen';
import HomeScreen     from '../screens/homescreen';
import AgendamentoScreen from '../screens/agendamento';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Tabs principais após login ───────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A3F8F',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e5e7eb',
          backgroundColor: '#fff',
          paddingBottom: 8,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Agendamento"
        component={AgendamentoScreen}
        options={{
          tabBarLabel: 'Agendar',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Diario"
        component={HomeScreen} // substituir por DiarioScreen quando criar
        options={{
          tabBarLabel: 'Diário',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📓</Text>,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={HomeScreen} // substituir por PerfilScreen quando criar
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Stack raiz ───────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main"  component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
