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


## 📱 Derleme ve Dağıtım

Uygulama EAS Build kullanılarak APK formatında derlenebilir:

```bash
# EAS CLI yükleyin
npm install -g @expo/eas-cli

# Build başlatın
eas build --platform android
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



## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

