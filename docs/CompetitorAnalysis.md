# Анализ конкурентов — Beautiful Grid

> **О документе:** Первый прогон конкурентов с разбивкой по 4 нишам (Instagram-планировщики, photo collage makers, OSS-инструменты, moodboard apps) + цвет-ориентированные утилиты. Содержит таблицы продуктов, текстовую карту позиционирования и УТП. Более развёрнутый анализ — см. [Market-Research.md](Market-Research.md).
> **Статус:** черновик v0.1  
> **Дата:** 2026-05-24  
> **Источник:** веб-поиск, открытые источники
> **Связанные документы:** [Market-Research.md](Market-Research.md) · [PRD.md](PRD.md)

---

## 1. Резюме

В нише пересекаются 4 группы продуктов:
1. **Instagram grid planners** — планировщики ленты Instagram (в основном веб + iOS).
2. **Photo collage makers** — десктопные/онлайн коллажмейкеры (фото в общую картинку).
3. **Open-source инструменты для сеток** — небольшие проекты на GitHub.
4. **Moodboard apps** — мудборды для дизайнеров (свободные холсты).

**Свободных ниш для Beautiful Grid:**
- Полноценное **локальное** десктоп-приложение (большинство — веб или mobile).
- **Поддержка сотен фото** без облака (важно для коммерческой свадебной/портретной съёмки).
- **Авто-сортировка по доминирующему цвету** в современном UI (есть только в нишевых CLI).
- **Группы + переименование при экспорте** — отсутствует у всех найденных конкурентов.
- **Open-source MIT, без подписок** — почти все коммерческие конкуренты на подписке $9–30/мес.

---

## 2. Прямые конкуренты (Instagram-планировщики)

| Продукт | Платформа | Локально? | Стоимость | Близость к нам |
|---|---|---|---|---|
| **[Preview App](https://thepreviewapp.com/)** | iOS, macOS (M1+) | Локально | Freemium + подписка | **Высокая** — десктоп, планирование сетки |
| **[Grids](https://thegridsapp.com/)** | macOS, Windows | Облако IG | Платная (~$10) | Средняя — Instagram-просмотрщик с upload |
| **[Tailwind](https://www.tailwindapp.com/)** | Web | Облако | $19.99/мес | Низкая — SaaS, аналитика+хэштеги |
| **[Hopper HQ](https://www.hopperhq.com/tools/instagram-grid-planner/)** | Web | Браузер | Бесплатный tool | Средняя — free grid planner |
| **[GridPeek](https://www.silly-girl.co/blog/best-free-instagram-feed-planner-gridpeek)** | Web | Браузер | Бесплатно | Низкая — лёгкий веб-планировщик |
| **[PlanMyGrid (обзор)](https://www.planmygrid.com/blog/top-10-instagram-grid-planner-tools-2026)** | — | — | — | Свод обзоров категории |

**Вывод:** доминируют iOS и веб. **Полноценного десктопного локального инструмента для фотографов** в этой нише нет — большинство «desktop»-решений это либо веб-обёртки, либо iOS-приложения.

---

## 3. Photo collage makers

| Продукт | Платформа | Локально? | Стоимость | Близость к нам |
|---|---|---|---|---|
| **[Movavi Photo Editor](https://www.movavi.com/learning-portal/best-collage-maker-for-pc.html)** | Windows, macOS | Локально | Платная | Средняя — мощный, но универсальный |
| **[Wallpaper Collage Maker](https://apps.apple.com/us/app/wallpaper-collage-maker/id6478065481)** | iOS | Локально | Платная | **Высокая** — есть сортировка по цвету! |
| **[Canva Collage](https://www.canva.com/create/photo-collages/)** | Web | Облако | Freemium | Низкая — слишком общий |
| **[Adobe Express](https://www.adobe.com/express/create/photo-collage)** | Web | Облако | Подписка | Низкая |
| **[Fotor](https://www.fotor.com/features/collage)** | Web | Облако | Freemium | Низкая |
| **[Pixlr Collage](https://pixlr.com/photo-collage/)** | Web | Облако | Freemium | Низкая |
| **[BeFunky](https://www.befunky.com/features/collage-maker/)** | Web | Облако | Freemium | Низкая |
| **[Icecream Collage Makers (обзор)](https://icecreamapps.com/learn/best-free-collage-makers.html)** | — | — | — | Каталог 14 коллажмейкеров |

**Вывод:** Collage-makers ориентированы на «один коллаж из ~10 фото для соцсетей», а не на работу с большой подборкой. Wallpaper Collage Maker — самый близкий по логике сортировки по цвету, но только iOS.

---

## 4. Open-source инструменты (GitHub)

| Репозиторий | Стек | Звёзд | Близость к нам |
|---|---|---|---|
| **[adrienverge/PhotoCollage](https://github.com/adrienverge/PhotoCollage)** | Python + PIL + GTK | ~600 | **Очень высокая** — десктоп, авто-раскладка коллажа, swap фото, экспорт |
| **[robertjoshuaallen/photogrid](https://github.com/robertjoshuaallen/photogrid)** | Python CLI | малый | Средняя — минималистичная сетка в PNG |
| **[fernandoporazzi/photo-grid](https://github.com/fernandoporazzi/photo-grid)** | JS, библиотека | малый | Низкая — для веба, как 500px |
| **[greggman/image-grid](https://github.com/greggman/image-grid)** | JS, браузер | малый | Низкая — отображение |
| **[chen-zhe/photo-grid](https://github.com/chen-zhe/photo-grid)** | Hugo theme | малый | Низкая — для блогов |
| **[GitHub topic: collage](https://github.com/topics/collage)** | разное | — | Обзор экосистемы |
| **[GitHub topic: photo-grid](https://github.com/topics/photo-grid)** | разное | — | Обзор экосистемы |
| **[GitHub topic: image-grid](https://github.com/topics/image-grid)** | разное | — | Обзор экосистемы |

**Главное наблюдение:** [PhotoCollage](https://github.com/adrienverge/PhotoCollage) — это **самый близкий аналог** идейно. Но: написан на Python+GTK, старый UI (GIMP-стиль), нет авто-сортировки по цвету, нет групп, нет переименования. Наша возможность — современный UX + цветовая сортировка + workflow для фотографа.

---

## 5. Цвет-ориентированные инструменты

| Продукт | Платформа | Локально? | Близость |
|---|---|---|---|
| **[ColorTools (N. Becker)](https://www.nbeckerphotography.com/blog/2022/introducing-colortools)** | Python CLI | Локально | **Высокая по идее** — вычисляет доминирующие цвета, сортирует по hue. Но CLI, без UI. |
| **[Wallpaper Collage Maker](https://apps.apple.com/us/app/wallpaper-collage-maker/id6478065481)** | iOS | Локально | Высокая — кнопка «фильтр по цвету» |

**Вывод:** идея сортировки по цвету понята только узким кругом. Готового UX-решения «нажми и красиво» нет.

---

## 6. Moodboard apps (соседняя ниша)

| Продукт | Платформа | Локально? | Стоимость | Замечания |
|---|---|---|---|---|
| **[Milanote](https://milanote.com/product/moodboarding)** | Web/iOS/Mac | Облако | Freemium → $9.99/мес | Лидер ниши |
| **[Lunacy](https://icons8.com/design/mood-board-app)** | Win/Mac/Linux | **Локально (offline)** | Free + $11.99/мес | **Очень близкий пример** desktop OSS-friendly UX |
| **[Noteey](https://www.noteey.com/moodboard-maker)** | Desktop | **Локально** | — | Полностью оффлайн |
| **[Canva Mood Board](https://www.canva.com/create/mood-boards/)** | Web | Облако | Freemium | Универсальный |
| **[DesignFiles обзор](https://blog.designfiles.co/moodboard-apps/)** | — | — | — | Обзор 13 moodboard-приложений 2026 |
| **[ExpertPhotography обзор](https://expertphotography.com/mood-board-apps)** | — | — | — | 10 лучших мудборд-приложений |
| **[FixThePhoto обзор](https://fixthephoto.com/best-mood-board-apps.html)** | — | — | — | Топ для фотографов |
| **[Studiobinder обзор](https://www.studiobinder.com/blog/mood-board-apps-with-free-template/)** | — | — | — | 12 лучших мудборд-апп |

**Вывод:** мудборды дают идеи UX (свободный холст, библиотека, drag&drop), но они не делают строгую сетку и не работают с сотнями фото.

---

## 7. Карта позиционирования (текстовая)

```
                       ОБЛАКО (зависит от интернета)
                                  │
        Tailwind ●                │              ● Canva, Adobe Express
                                  │              ● Hopper HQ, GridPeek
                                  │              ● Milanote
                                  │
   МАЛО ФОТО ─────────────────────┼─────────────────────── МНОГО ФОТО
   (1 коллаж)                     │                  (сотни, библиотека)
                                  │
   ● Pixlr, BeFunky                                   ★ BEAUTIFUL GRID
   ● Wallpaper Collage Maker (iOS)                  
   ● PhotoCollage (OSS Python)         
                                  │
        Preview App ●             │              ● Lunacy, Noteey
        Grids ●                   │              ● ColorTools (CLI)
                                  │
                       ЛОКАЛЬНО (offline)
```

**Свободная клетка**, в которую попадает Beautiful Grid: **локально + много фото + современный UI + open-source + фокус на цветовой сортировке и workflow фотографа**.

---

## 8. Что мы делаем иначе (УТП)

1. **Локально + Apple Silicon-нативно + Windows** — без облака, без подписок.
2. **Работа с сотнями фото в одном проекте** (никто из коллажмейкеров не оптимизирован под это).
3. **Авто-сортировка по доминирующему цвету в нативном UI** (это есть только в CLI ColorTools и iOS-приложении).
4. **Группы + переименование при экспорте** — уникальная функция, не найдено у конкурентов.
5. **MIT open-source** — никаких подписок, прозрачные релизы, comunity-driven.
6. **Минималистичный современный UX** — большинство OSS-коллажмейкеров с устаревшим интерфейсом.

---

## 9. Чему стоит поучиться у конкурентов

- **Preview App** — мобильный UX планирования ленты, обратить внимание на drag&drop порядок.
- **PhotoCollage (OSS)** — алгоритмы автокомпоновки коллажа.
- **Lunacy** — пример хорошего offline-first desktop UX, есть и Win, и Mac, и Linux.
- **ColorTools** — алгоритмы сортировки по hue, конкретные библиотеки и подходы.
- **Wallpaper Collage Maker** — UX-паттерн «выбери цвет → отфильтровать фото».
- **Milanote** — пример удачной структуры «проект → доска → элементы».

---

## 10. Угрозы и риски

- Tailwind, Preview App, Milanote — у них **большие команды и маркетинговые бюджеты**. Нам нечего противопоставить в рекламе.
- Возможный приход AI-фич у конкурентов (умная авто-раскладка) — нам тоже стоит планировать AI-эксперименты.
- Бесплатные веб-планировщики (GridPeek, Hopper HQ) понижают «порог боли» — пользователю проще открыть сайт, чем ставить приложение. **Аргумент в нашу пользу:** работа с сотнями фото в браузере неудобна и медленна.

---

## 11. Источники

- [Tailwind Blog: Desktop Instagram Planner](https://www.tailwindapp.com/blog/instagram-grid-planner-desktop-tailwind)
- [thegridsapp.com](https://thegridsapp.com/)
- [Silly Girl: GridPeek review](https://www.silly-girl.co/blog/best-free-instagram-feed-planner-gridpeek)
- [Apple App Store: Preview Planner for Instagram](https://apps.apple.com/us/app/preview-planner-for-instagram/id1126609754)
- [PlanMyGrid: top 10 grid planner tools 2026](https://www.planmygrid.com/blog/top-10-instagram-grid-planner-tools-2026)
- [Softonic: Grids for Mac](https://grids-app-for-instagram-on-desktop.en.softonic.com/mac)
- [thepreviewapp.com](https://thepreviewapp.com/)
- [Softonic: Grids for Instagram](https://grids-for-instagram.en.softonic.com/)
- [Hopper HQ: Instagram Grid Planner](https://www.hopperhq.com/tools/instagram-grid-planner/)
- [HaveCameraWillTravel: Grids review](https://havecamerawilltravel.com/grids-instagram-desktop-app-mac/)
- [Adobe Express: photo collage](https://www.adobe.com/express/create/photo-collage)
- [Canva: photo collages](https://www.canva.com/create/photo-collages/)
- [N. Becker Photography: ColorTools](https://www.nbeckerphotography.com/blog/2022/introducing-colortools)
- [Apple App Store: Wallpaper Collage Maker](https://apps.apple.com/us/app/wallpaper-collage-maker/id6478065481)
- [Fotor: photo collage](https://www.fotor.com/features/collage)
- [Icecream: 14 best collage makers](https://icecreamapps.com/learn/best-free-collage-makers.html)
- [Pixlr: photo collage](https://pixlr.com/photo-collage/)
- [BeFunky: collage maker](https://www.befunky.com/features/collage-maker/)
- [Movavi: collage maker for PC and Mac](https://www.movavi.com/learning-portal/best-collage-maker-for-pc.html)
- [Coolors: create a collage](https://coolors.co/collage-maker)
- [GitHub: adrienverge/PhotoCollage](https://github.com/adrienverge/PhotoCollage)
- [GitHub topic: collage](https://github.com/topics/collage)
- [GitHub: robertjoshuaallen/photogrid](https://github.com/robertjoshuaallen/photogrid)
- [GitHub topic: photo-grid](https://github.com/topics/photo-grid)
- [GitHub topic: image-grid](https://github.com/topics/image-grid)
- [GitHub: jestov/grid-gallery](https://github.com/jestov/grid-gallery)
- [GitHub: chen-zhe/photo-grid](https://github.com/chen-zhe/photo-grid)
- [GitHub: greggman/image-grid](https://github.com/greggman/image-grid)
- [GitHub: fernandoporazzi/photo-grid](https://github.com/fernandoporazzi/photo-grid)
- [GitHub: rasmushaugaard/image-grid](https://github.com/rasmushaugaard/image-grid)
- [Milanote: moodboarding](https://milanote.com/product/moodboarding)
- [DesignFiles: 13 moodboard apps 2026](https://blog.designfiles.co/moodboard-apps/)
- [Icons8 Lunacy: mood board app](https://icons8.com/design/mood-board-app)
- [Studiobinder: 12 best mood board apps 2026](https://www.studiobinder.com/blog/mood-board-apps-with-free-template/)
- [Noteey: moodboard maker](https://www.noteey.com/moodboard-maker)
- [Expert Photography: 10 best mood board apps 2026](https://expertphotography.com/mood-board-apps)
- [Canva: mood boards](https://www.canva.com/create/mood-boards/)
- [FixThePhoto: 9 best mood board apps for photographers 2026](https://fixthephoto.com/best-mood-board-apps.html)
