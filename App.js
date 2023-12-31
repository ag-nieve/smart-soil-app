import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from "./screens/DashboardScreen";
import { Ionicons } from '@expo/vector-icons';
import {Fragment} from "react";
import TagCraftScreen from "./screens/TagCraftScreen";
import ChangeCraftScreen from "./screens/ChangeCraftScreen";
import HistoryScreen from "./screens/HistoryScreen";
import LogoutScreen from "./screens/LogoutScreen";
import { useUserStore } from './zustand_store/auth';

const Drawer = createDrawerNavigator();
const buttons = [
    {
        nav: 'Dashboard',
        title: 'Dashboard',
        icon: <Ionicons name="home" size={30} color="#606060" />
    },
    {
        nav: 'TagCraft',
        title: 'Tag Craft',
        icon: <Ionicons name="bookmark" size={30} color="#606060" />
    },
    // {
    //     nav: 'ChangeCraft',
    //     title: 'Change Craft',
    //     icon: <Ionicons name="refresh" size={30} color="#606060" />
    // },
    {
        nav: 'History',
        title: 'History',
        icon: <Ionicons name="list" size={30} color="#606060" />
    },
    {
        nav: 'Logout',
        title: 'Logout',
        icon: <Ionicons name="log-out" size={30} color="#606060" />
    },
]
export default function App() {
    const isConnected = true;
    const user = useUserStore((state) => state.user);

    function MyDrawer() {
        return (
            <Drawer.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#9ADF82' },
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    headerBackVisible: false,
                }}
                drawerContent={(props) => (
                    <SafeAreaView className={''}>

                        <View className={'bg-secondaryColor pb-5 pt-20'}>
                            <Text className={'text-center text-bold text-lg text-[#fff]'}>SMARTSOIL</Text>
                        </View>
                        {
                            buttons.map((button, index) => {
                                const { icon, title, nav} = button;

                                return <Fragment key={index}>
                                    <View className={'px-4 py-4'} >
                                        <TouchableOpacity
                                            className={'flex flex-row gap-x-5 items-center'}
                                            onPress={() => props.navigation.navigate(nav)}
                                        >
                                            {icon}
                                            <Text>{title}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className={'px-4 border-b border-b-emerald-50 mx-3'}></View>
                                </Fragment>
                            })
                        }

                    </SafeAreaView>
                )}
            >
                <Drawer.Screen name="Dashboard" component={DashboardScreen} />
                <Drawer.Screen name="TagCraft" component={TagCraftScreen} />
                {/* <Drawer.Screen name="ChangeCraft" component={ChangeCraftScreen} /> */}
                <Drawer.Screen name="History" component={HistoryScreen} />
                <Drawer.Screen name="Logout" component={LogoutScreen}  />
            </Drawer.Navigator>
        );
    }

    function Navigation() {
        return (
            <NavigationContainer>
                {
                    user ? (
                        <MyDrawer />
                    ) : (
                        <LoginScreen />
                    )
                }
            </NavigationContainer>
        );
    }

  return (
      <View className="flex-1">
      <StatusBar style="auto" />
          <Navigation />
    </View>
  );
}
