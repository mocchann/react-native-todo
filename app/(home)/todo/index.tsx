import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

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
  todoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
});

const fetchTodos = async () => {
  const res = await fetch("http://example.com/api/");

  if (!res.ok) {
    throw new Error("api response was not ok");
  }

  return res.json();
};

function LogoTitle() {
  return (
    <View style={styles.title}>
      <Image
        style={styles.image}
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
      />
      <Text>Todo Index</Text>
    </View>
  );
}

const TodoIndex = () => {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <Text style={[styles.todoText, item.completed && styles.completedText]}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <>
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
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error?.message}</Text>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.container}
        />
      )}
    </>
  );
};

export default TodoIndex;
