import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export const useTasks = (userId: string) => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      if (!userId) return [];
      const tasksCollection = collection(db, 'users', userId, 'tasks');
      const q = query(tasksCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        completed: doc.data().completed || false,
        createdAt: doc.data().createdAt.toDate(),
      }));
    },
    enabled: !!userId,
  });

  const addTask = useMutation({
    mutationFn: async (title: string) => {
      if (!userId) throw new Error('User not authenticated');
      const tasksCollection = collection(db, 'users', userId, 'tasks');
      await addDoc(tasksCollection, {
        title,
        completed: false,
        createdAt: Timestamp.now(),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      if (!userId) throw new Error('User not authenticated');
      await deleteDoc(doc(db, 'users', userId, 'tasks', taskId));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const updateTask = useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      if (!userId) throw new Error('User not authenticated');
      await updateDoc(doc(db, 'users', userId, 'tasks', taskId), { title });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      if (!userId) throw new Error('User not authenticated');
      await updateDoc(doc(db, 'users', userId, 'tasks', taskId), { completed });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', userId] }),
  });

  return { tasks, isLoading, addTask, deleteTask, updateTask, toggleTask };
};
