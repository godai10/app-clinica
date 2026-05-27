import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import LoginScreen       from '../screens/loginscreen';
import HomeScreen        from '../screens/homescreen';
import AgendamentoScreen from '../screens/agendamento';
import ForgotScreen      from '../screens/forgotscreen';
import SessoesScreen     from '../screens/sessoesscreen';
import PerfilScreen      from '../screens/perfilscreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─── Tabs principais ──────────────────────────────────────────────────────────

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
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Agendamento"
        component={AgendamentoScreen}
        options={{
          tabBarLabel: 'Agendar',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Sessoes"
        component={SessoesScreen}
        options={{
          tabBarLabel: 'Sessões',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🧠</Text>,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Stack raiz ───────────────────────────────────────────────────────────────

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login"        component={LoginScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
        <Stack.Screen name="Main"         component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}