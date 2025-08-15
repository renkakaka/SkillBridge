# SkillBridge - Կարիերայի զարգացման հարթակ

SkillBridge-ը հարթակ է, որը միավորում է նորեկներին փորձառու մասնագետների հետ՝ կարիերայի զարգացման համար:

## 🚀 Հիմնական հնարավորություններ

- **Մենթորություն**: Միացեք փորձառու մասնագետներին
- **Նախագծեր**: Մասնակցեք իրական նախագծերին
- **Բորսա առաջադրանքների**: Վաստակեք փող՝ աշխատելով նախագծերի վրա
- **Հաջողությունների համակարգ**: Վաստակեք բեջեր և բարձրացրեք ձեր մակարդակը
- **Պորտֆոլիո**: Ցուցադրեք ձեր աշխատանքները
- **Հաղորդագրություններ**: Կապվեք հաճախորդների և գործընկերների հետ

## 🔧 Վերջին թարմացումները

### 1. ✅ Խնդիրների լուծում

#### 1.1 Նավիգացիոն բարի խնդիր
- **Խնդիր**: Նավիգացիոն բարը չէր բեռնվում առաջին անգամ մուտք գործելիս
- **Լուծում**: 
  - Վերանայվել է `ClientNavbar` կոմպոնենտը
  - Ավելացվել է ավելի հուսալի ինիցիալիզացիայի տրամաբանություն
  - Բարելավվել է աութենտիֆիկացիայի ստուգումը
  - Ավելացվել է `mounted` state-ի կառավարում

#### 1.2 Գլխավոր էջի բովանդակության թարմացում
- **Հին բովանդակություն**: Ցուցադրվում էին 500+ ակտիվ ծրագրեր, 200+ մենթորներ, 10K+ ուսանողներ
- **Նոր բովանդակություն**: 
  - Բորսա առաջադրանքների բաժին
  - Հաջողությունների համակարգի ներկայացում
  - Ավելի հետաքրքիր և գրավիչ դիզայն

#### 1.3 Հաջողության պատմությունների բաժնի փոխարինում
- **Հին բովանդակություն**: Ուսանողների հաջողության պատմություններ
- **Նոր բովանդակություն**:
  - Բորսա առաջադրանքների ներկայացում
  - Մենթորության համակարգի նկարագրություն
  - Պորտֆոլիո և նախագծերի բաժին

#### 1.4 CTA բաժնի բարելավում
- **Հին բովանդակություն**: Պարզ կոչ գործողության համար
- **Նոր բովանդակություն**:
  - Ավելի գրավիչ դիզայն
  - Անվճար ուսուցման և վճարովի առաջադրանքների ներկայացում
  - Անիմացված ֆոնային տարրեր
  - Հատուկ առաջարկների բեջեր

#### 1.5 Կոճակի տեսանելիության խնդիր
- **Խնդիր**: "Ուսումնասիրել նախագծերը" կոճակի տեքստը չէր երևում
- **Լուծում**: Ավելացվել է `bg-transparent` CSS դասը

#### 1.6 Նորությունների բաժանորդագրության համակարգ
- **Նոր հնարավորություն**:
  - Ձև նորությունների բաժանորդագրության համար
  - API `/api/newsletter` բաժանորդագրությունների կառավարման համար
  - Ադմին պանելում բաժանորդագրությունների ցուցադրում
  - CSV էքսպորտի հնարավորություն
  - Բաժանորդագրությունների ակտիվացում/ապաակտիվացում

#### 1.7 404 և սխալների էջերի ստեղծում
- **Նոր էջեր**:
  - `not-found.tsx` - 404 սխալների համար
  - `error.tsx` - Ընդհանուր սխալների համար
  - `loading.tsx` - Բեռնման էջ
  - Բոլոր էջերը ունեն գրավիչ դիզայն և օգտակար տեղեկություններ

### 2. 🗄️ Տվյալների բազայի թարմացում

#### 2.1 Newsletter բաժանորդագրությունների մոդել
```prisma
model NewsletterSubscription {
  id           String   @id @default(uuid())
  email        String   @unique
  consent      Boolean  @default(true)
  subscribedAt DateTime @default(now())
  isActive     Boolean  @default(true)
  unsubscribedAt DateTime?
  updatedAt    DateTime @updatedAt
}
```

#### 2.2 Միգրացիայի ստեղծում
- Ստեղծվել է նոր միգրացիա `add_newsletter_subscriptions`
- Բազան վերակարգավորվել է նոր սխեմայի համար

### 3. 🔌 API endpoints

#### 3.1 Newsletter API
- `POST /api/newsletter` - Նոր բաժանորդագրություն ստեղծելու համար
- `GET /api/newsletter` - Բոլոր բաժանորդագրությունները ստանալու համար
- `PATCH /api/newsletter/[id]` - Բաժանորդագրություն թարմացնելու համար
- `DELETE /api/newsletter/[id]` - Բաժանորդագրություն ջնջելու համար

### 4. 🎨 UI/UX բարելավումներ

#### 4.1 Գլխավոր էջ
- Ավելացվել են գրավիչ գրադիենտներ
- Անիմացված ֆոնային տարրեր
- Ինտերակտիվ կոմպոնենտներ
- Հետաքրքիր բովանդակություն բորսա առաջադրանքների մասին

#### 4.2 Ադմին պանել
- Ավելացվել է նավիգացիոն մենյու
- Հղում դեպի բաժանորդագրությունների կառավարում
- Վիճակագրության կարտեր
- Ֆիլտրեր և որոնում

#### 4.3 Սխալների էջեր
- Գրավիչ դիզայն
- Օգտակար տեղեկություններ
- Գործողությունների կոճակներ
- Հետադարձ նավիգացիա

### 5. 📱 Հետագա բարելավումներ

#### 5.1 Առաջարկվող հնարավորություններ
- Push ծանուցումներ
- Email տեղեկագրեր
- SMS ծանուցումներ
- Real-time հաղորդագրություններ
- Վիդեո զանգեր
- Ֆայլերի փոխանակում

#### 5.2 Տեխնիկական բարելավումներ
- PWA հնարավորություններ
- Offline աշխատանք
- Push ծանուցումներ
- Կեշավորման ռազմավարություն

## 🛠️ Տեխնոլոգիաներ

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma, SQLite
- **Authentication**: Custom auth system
- **UI Components**: Radix UI, Lucide icons

## 🚀 Տեղադրում

1. Clone the repository
```bash
git clone https://github.com/yourusername/SkillBridge.git
cd SkillBridge
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start development server
```bash
npm run dev
```

## 📁 Project Structure

```
SkillBridge-main/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Admin panel
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── ...                # Other pages
├── components/             # React components
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## 🤝 Ներդրում

Մենք ողջունում ենք ներդրումները! Խնդրում ենք ստեղծել issue կամ pull request:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: qaramyanv210@gmail.com
- **Project Link**: [https://github.com/yourusername/SkillBridge](https://github.com/yourusername/SkillBridge)

---

⭐ Եթե այս նախագիծը օգտակար է, խնդրում ենք տալ աստղ:
