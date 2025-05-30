import { STORAGE_KEY, TodoItem } from "@/app/(tabs)/todo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
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

const fetchTodo = async (id: string) => {
  const todos = await AsyncStorage.getItem(STORAGE_KEY);
  if (!todos) {
    return null;
  }
  const parsedTodos = JSON.parse(todos);
  return parsedTodos.find((todo: TodoItem) => todo.id === id);
};

function LogoTitle() {
  return (
    <View style={styles.title}>
      <Image
        style={styles.image}
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
      />
      <Text>Todo Edit</Text>
    </View>
  );
}

const TodoEdit = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState<string>("");

  const { data: todo } = useQuery({
    queryKey: ["todo", id],
    queryFn: (): Promise<TodoItem> => fetchTodo(id.toString()),
  });

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
    }
  }, [todo]);

  const updatedTodoMutation = useMutation({
    mutationFn: async (updatedTodo: TodoItem) => {
      const todos = await AsyncStorage.getItem(STORAGE_KEY);
      if (!todos) {
        return;
      }
      const currentTodos = JSON.parse(todos);
      const newTodos: TodoItem = currentTodos.map((todo: TodoItem) =>
        todo.id === updatedTodo.id
          ? { ...todo, title: updatedTodo.title }
          : todo
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      router.push(`/todo`);
    },
  });

  const handleSave = () => {
    if (title.trim()) {
      updatedTodoMutation.mutate({
        id: id.toString(),
        title: title.trim(),
        completed: false,
      });
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Todo",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: () => <LogoTitle />,
        }}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Input todo title"
          placeholderTextColor="#999"
        />
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSave} color="#f4511e" />
        </View>
      </View>
    </>
  );
};

export default TodoEdit;
