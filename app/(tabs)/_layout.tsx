import { Image } from "expo-image";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f4511e",
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="todo"
        options={{
          title: "Todo",
          tabBarIcon: ({ color }) => (
            <Image
              source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="counter"
        options={{
          title: "カウンター",
          tabBarIcon: ({ color }) => (
            <Image
              source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
