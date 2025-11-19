# FireTasks - Görev Yönetim Uygulaması

## Firebase Kurulumu

1. [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun
2. Authentication > Sign-in method > Email/Password'u etkinleştirin
3. Firestore Database oluşturun (test modunda başlayabilirsiniz)
4. Project Settings > General > Your apps > Web app ekleyin
5. Firebase config bilgilerini `config/firebase.ts` dosyasına yapıştırın

## Firestore Güvenlik Kuralları

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Çalıştırma

```bash
npm start
# veya
expo start
```

## Özellikler

- ✅ Firebase Authentication (Email/Password)
- ✅ Firestore Database ile görev yönetimi
- ✅ React Query ile veri yönetimi
- ✅ NativeWind ile modern UI
- ✅ Görev ekleme, düzenleme, silme
- ✅ Responsive tasarım