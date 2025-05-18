import { Link, Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

function LogoTitle() {
  return (
    <View style={styles.title}>
      <Image
        style={styles.image}
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
      />
      <Link href={"/todo"}>Todo Index</Link>
    </View>
  );
}

const TodoIndex = () => {
  return (
    <Stack.Screen
      options={{
        title: "My home",
        headerStyle: { backgroundColor: "#f4511e" },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },

        headerTitle: () => <LogoTitle />,
      }}
    />
  );
};

export default TodoIndex;
