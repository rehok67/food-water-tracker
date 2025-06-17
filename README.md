# 🍎💧 Food & Water Tracker - Yiyecek ve Su Takip Uygulaması

Bu proje, kullanıcıların günlük yiyecek ve su tüketimlerini takip edebilecekleri bir React Native Expo uygulamasıdır. Firebase Authentication ve Realtime Database kullanılarak geliştirilmiştir.

## 📱 Özellikler

✅ **Kullanıcı Yönetimi**
- Firebase Authentication ile güvenli giriş/kayıt sistemi
- E-posta ve şifre ile hesap oluşturma

✅ **Yiyecek Takibi**
- Günlük yiyecek ekleme
- Kalori ve makro besin takibi
- Yemek geçmişini görüntüleme

✅ **Su Takibi**
- Günlük su tüketimi kaydı
- Su içme hedefi belirleme
- Su tüketim grafikları

✅ **Kişisel Veriler**
- Kullanıcıya özel veri saklama
- Geçmiş veriler görüntüleme
- Çevrimdışı çalışma desteği

## 🛠 Teknolojiler

- **React Native** - Mobil uygulama framework'ü
- **Expo** - React Native geliştirme platformu
- **TypeScript** - Tip güvenli JavaScript
- **Firebase Authentication** - Kullanıcı doğrulama
- **Firebase Realtime Database** - Gerçek zamanlı veri tabanı
- **React Navigation** - Sayfa yönlendirmeleri
- **Expo Router** - Dosya tabanlı yönlendirme

## 🚀 Kurulum ve Çalıştırma

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Firebase konfigürasyonunu kontrol edin:**
   - `services/firebaseService.ts` dosyasını kontrol edin
   - Firebase projenizin yapılandırmasını doğrulayın

3. **Uygulamayı başlatın:**
   ```bash
   npx expo start
   ```

4. **Uygulamayı test edin:**
   - Expo Go uygulamasını telefonunuza indirin
   - QR kodu tarayarak uygulamayı açın
   - Alternatif olarak Android/iOS emülatörü kullanın

## 📊 Veritabanı Yapısı

Firebase Realtime Database kullanılmıştır:

```
/users
  /{userId}
    /foodLogs
      /{logId}
        - foodName: string
        - calories: number
        - date: string
        - macros: object
    /waterLogs
      /{logId}
        - amount: number
        - date: string
        - time: string
```

## 🔒 Güvenlik

- Firebase Security Rules ile kullanıcılar sadece kendi verilerine erişebilir
- Tüm veriler kullanıcı bazında ayrılmıştır
- E-posta/şifre ile güvenli kimlik doğrulama

## 🧪 Test Bilgileri

Test için hazır hesap:
- **E-posta:** deneme@gmail.com
- **Şifre:** deniz67

## 📱 Derleme ve Dağıtım

Uygulama EAS Build kullanılarak APK formatında derlenebilir:

```bash
# EAS CLI yükleyin
npm install -g @expo/eas-cli

# Build başlatın
eas build --platform android
```

## 🎯 Diğer Komutlar

```bash
# Android emülatörde çalıştır
npm run android

# iOS simülatörde çalıştır
npm run ios

# Web'de çalıştır
npm run web

# Testleri çalıştır
npm test

# Kodu düzenle (lint)
npm run lint

# Projeyi sıfırla
npm run reset-project
```

## 📁 Proje Yapısı

```
├── app/                    # Ana uygulama dosyaları
│   ├── (tabs)/            # Tab navigasyon sayfaları
│   ├── _layout.tsx        # Ana layout
│   └── login.tsx          # Giriş sayfası
├── components/            # Tekrar kullanılabilir bileşenler
├── services/              # Firebase servisleri
├── hooks/                 # Custom React hooks
├── constants/             # Sabitler ve yapılandırmalar
├── assets/                # Resimler ve statik dosyalar
└── scripts/               # Yardımcı scriptler
```

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 📞 İletişim

Herhangi bir sorunuz veya öneriniz için lütfen iletişime geçin.

---

**Not:** Bu uygulama tamamen fonksiyonel durumda olup, tüm özellikler test edilmiştir.