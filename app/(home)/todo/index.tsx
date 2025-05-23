import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
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

type TodoItem = {
  id: number;
  title: string;
  completed: boolean;
};

const initialTodos: TodoItem[] = [
  { id: 1, title: "買い物に行く", completed: false },
  { id: 2, title: "レポートを書く", completed: true },
  { id: 3, title: "運動する", completed: false },
  { id: 4, title: "本を読む", completed: false },
];

const STORAGE_KEY = "@todos";

const fetchTodos = async (): Promise<TodoItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialTodos));
      return initialTodos;
    }
    return JSON.parse(jsonValue);
  } catch (e) {
    console.error("Error fetching todos", e);
    return [];
  }
};

const saveTodos = async (todos: TodoItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error("Error saving todos:", e);
  }
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
  const [newTodoTitle, setNewTodoTitle] = useState<string>("");
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (updateTodo: TodoItem) => {
      const currentTodos = await fetchTodos();
      const newTodos = currentTodos.map((todo) =>
        todo.id === updateTodo.id ? updateTodo : todo
      );
      await saveTodos(newTodos);
      return newTodos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addTodoMutation = useMutation({
    mutationFn: async (newTodo: Omit<TodoItem, "id">) => {
      const currentTodos = await fetchTodos();
      const newTodos = [
        ...currentTodos,
        {
          ...newTodo,
          id: Math.max(...currentTodos.map((todo) => todo.id)) + 1,
        },
      ];
      await saveTodos(newTodos);
      return newTodos;
    },
  });

  const toggleTodo = (todo: TodoItem) => {
    updateTodoMutation.mutate({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleAddTodo = () => {
    if (newTodoTitle.trim()) {
      addTodoMutation.mutate({
        title: newTodoTitle.trim(),
        completed: false,
      });
      setNewTodoTitle("");
    }
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <TouchableOpacity style={styles.todoItem} onPress={() => toggleTodo(item)}>
      <Text style={[styles.todoText, item.completed && styles.completedText]}>
        {item.title}
      </Text>
    </TouchableOpacity>
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
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTodoTitle}
            onChangeText={setNewTodoTitle}
            placeholder="Add new todo"
            placeholderTextColor="#999"
          />
          <Button title="Add" onPress={handleAddTodo} color="#f4511e" />
        </View>
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error?.message}</Text>
      ) : (
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </>
  );
};

export default TodoIndex;
