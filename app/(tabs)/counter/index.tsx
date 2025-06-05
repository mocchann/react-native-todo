import { Stack } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Counter",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.counter}>{count}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Increment"
            onPress={() => setCount(count + 1)}
            color="#f4511e"
          />
          <Button
            title="減らす"
            onPress={() => setCount(count - 1)}
            color="#666"
          />
        </View>
      </View>
    </>
  );
}
