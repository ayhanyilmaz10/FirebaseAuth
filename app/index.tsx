import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTasks, Task } from '../hooks/useTasks';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { user, loading, logout, refreshUser } = useAuth();
  const { tasks, isLoading, addTask, deleteTask, updateTask, toggleTask } = useTasks(
    user?.uid || ''
  );

  useEffect(() => {
    if (!loading && !user) {
      setTimeout(() => {
        router.replace('/auth');
      }, 0);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask.mutateAsync(newTask.trim());
      setNewTask('');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const handleSave = async () => {
    if (editingId && editText.trim()) {
      await updateTask.mutateAsync({ taskId: editingId, title: editText.trim() });
      setEditingId(null);
      setEditText('');
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View
      style={{
        backgroundColor: '#f5deb3',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#deb887',
        shadowColor: '#8b4513',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      }}>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => toggleTask.mutate({ taskId: item.id, completed: !item.completed })}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              marginRight: 16,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: item.completed ? '#8b4513' : '#cd853f',
              backgroundColor: item.completed ? '#8b4513' : 'transparent',
            }}>
            {item.completed && (
              <Text style={{ color: '#f4f1e8', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
            )}
          </TouchableOpacity>
          {editingId === item.id ? (
            <TextInput
              style={{
                flex: 1,
                backgroundColor: '#f4f1e8',
                borderWidth: 1,
                borderColor: '#cd853f',
                borderRadius: 4,
                padding: 8,
                marginRight: 12,
                color: '#654321',
              }}
              value={editText}
              onChangeText={setEditText}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => handleEdit(item)} className="flex-1">
              <Text
                style={{
                  fontSize: 16,
                  color: item.completed ? '#a0522d' : '#654321',
                  textDecorationLine: item.completed ? 'line-through' : 'none',
                  fontFamily: 'serif',
                }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
          {editingId === item.id ? (
            <>
              <TouchableOpacity
                onPress={() => setEditingId(null)}
                style={{ paddingHorizontal: 12, paddingVertical: 4, marginRight: 8 }}>
                <Text style={{ color: '#8b4513', fontSize: 12 }}>❌ Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: '#d2691e', fontWeight: 'bold', fontSize: 12 }}>💾 Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => deleteTask.mutate(item.id)}
              style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: '#8b4513', fontWeight: 'bold', fontSize: 12 }}>🗑️ Delete</Text>
            </TouchableOpacity>
          )}
        </View>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#f4f1e8' }}>
      <View
        style={{
          backgroundColor: '#8b4513',
          paddingTop: 48,
          paddingBottom: 24,
          paddingHorizontal: 24,
          borderBottomWidth: 3,
          borderBottomColor: '#654321',
        }}>
        <View className="mb-6 flex-row items-center justify-between">
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#f4f1e8',
              fontFamily: 'serif',
              textShadowColor: '#654321',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 1,
            }}>
            📝 TaskFlow
          </Text>
          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: '#d2691e',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: '#8b4513',
            }}>
            <Text style={{ color: '#f4f1e8', fontWeight: 'bold', fontSize: 14 }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {user && !user.emailVerified && (
          <View
            style={{
              backgroundColor: '#deb887',
              borderWidth: 2,
              borderColor: '#cd853f',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}>
            <Text style={{ color: '#8b4513', fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>
              📧 E-posta doğrulanmadı
            </Text>
            <Text style={{ color: '#a0522d', fontSize: 14, marginBottom: 12 }}>
              Lütfen gelen kutunuzu kontrol edin ve e-postasınızı doğrulayın.
            </Text>
            <TouchableOpacity
              onPress={refreshUser}
              style={{
                backgroundColor: '#cd853f',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 4,
                alignSelf: 'flex-start',
                borderWidth: 1,
                borderColor: '#8b4513',
              }}>
              <Text style={{ color: '#f4f1e8', fontWeight: 'bold', fontSize: 12 }}>🔄 Yenile</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#f4f1e8',
            marginBottom: 16,
            fontFamily: 'serif',
            textShadowColor: '#654321',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
          }}>
          📋 My Tasks
        </Text>

        <View className="flex-row">
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#f4f1e8',
              borderWidth: 2,
              borderColor: '#8b4513',
              borderRadius: 6,
              padding: 12,
              marginRight: 12,
              color: '#654321',
              fontSize: 16,
            }}
            placeholder="Write your task here..."
            placeholderTextColor="#a0522d"
            value={newTask}
            onChangeText={setNewTask}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#d2691e',
              paddingHorizontal: 20,
              borderRadius: 6,
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#8b4513',
            }}
            onPress={handleAddTask}>
            <Text style={{ color: '#f4f1e8', fontWeight: 'bold', fontSize: 14 }}>✚ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? (
          <Text
            style={{ textAlign: 'center', color: '#8b4513', fontSize: 16, fontStyle: 'italic' }}>
            ⏳ Loading your tasks...
          </Text>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
