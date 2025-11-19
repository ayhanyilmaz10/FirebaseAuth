import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading, login, signup, resendVerification } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <Text className="text-slate-500">Loading...</Text>
      </View>
    );
  }

  if (user) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
        Alert.alert(
          'Kayıt Başarılı',
          'Doğrulama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.'
        );
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      Alert.alert('Hata', errorMessage);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Bu e-posta adresi zaten kullanılıyor.';
      case 'auth/invalid-email':
        return 'Geçersiz e-posta formatı.';
      case 'auth/weak-password':
        return 'Şifre en az 6 karakter olmalı.';
      case 'auth/user-not-found':
        return 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
      case 'auth/wrong-password':
        return 'Yanlış şifre.';
      case 'auth/too-many-requests':
        return 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.';
      case 'auth/configuration-not-found':
        return "Firebase Authentication yapılandırması bulunamadı. Lütfen Firebase Console'da Email/Password authentication'ı etkinleştirin.";
      default:
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification();
      Alert.alert('Başarılı', 'Doğrulama e-postası tekrar gönderildi.');
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f1e8',
        paddingHorizontal: 32,
      }}>
      <View
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#f5deb3',
          borderRadius: 12,
          padding: 32,
          borderWidth: 3,
          borderColor: '#8b4513',
          shadowColor: '#654321',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
        }}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8,
            color: '#654321',
            fontFamily: 'serif',
            textShadowColor: '#deb887',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 1,
          }}>
          📝 TaskFlow
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#8b4513',
            marginBottom: 32,
            textAlign: 'center',
            fontFamily: 'serif',
          }}>
          {isLogin ? '🔑 Welcome Back' : '🎆 Join Us'}
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: '#654321',
              fontWeight: 'bold',
              marginBottom: 8,
              fontSize: 14,
              fontFamily: 'serif',
            }}>
            📧 Email Address
          </Text>
          <TextInput
            style={{
              backgroundColor: '#f4f1e8',
              borderWidth: 2,
              borderColor: '#cd853f',
              borderRadius: 6,
              padding: 12,
              color: '#654321',
              fontSize: 16,
            }}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#a0522d"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: '#654321',
              fontWeight: 'bold',
              marginBottom: 8,
              fontSize: 14,
              fontFamily: 'serif',
            }}>
            🔒 Password
          </Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={{
                backgroundColor: '#f4f1e8',
                borderWidth: 2,
                borderColor: '#cd853f',
                borderRadius: 6,
                padding: 12,
                paddingRight: 48,
                color: '#654321',
                fontSize: 16,
              }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#a0522d"
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 12, top: 12 }}
              onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ color: '#8b4513', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#8b4513',
            borderRadius: 6,
            padding: 16,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: '#654321',
          }}
          onPress={handleSubmit}>
          <Text
            style={{
              color: '#f4f1e8',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              fontFamily: 'serif',
            }}>
            {isLogin ? '🚀 Enter' : '🌟 Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#8b4513', marginBottom: 8, fontSize: 14, fontFamily: 'serif' }}>
            {isLogin ? 'New to TaskFlow?' : 'Already a member?'}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text
              style={{
                color: '#d2691e',
                fontWeight: 'bold',
                fontSize: 14,
                textDecorationLine: 'underline',
              }}>
              {isLogin ? '🎆 Create New Account' : '🔑 Sign In Instead'}
            </Text>
          </TouchableOpacity>

          {isLogin && (
            <TouchableOpacity onPress={handleResendVerification} style={{ marginTop: 16 }}>
              <Text
                style={{
                  color: '#cd853f',
                  fontWeight: 'bold',
                  fontSize: 12,
                  textDecorationLine: 'underline',
                }}>
                📧 Resend Verification Email
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
