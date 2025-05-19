// Disable Trailer Autoplay

// Hide Menu Tabs

function hideMenuTabs() {
  const homeButtonId = "untrap_channel_hide_channel_menu_button_home";
  const videoButtonId = "untrap_channel_hide_channel_menu_button_videos";

  const releaseButtonId = "untrap_channel_hide_channel_menu_button_releases";
  const podcastButtonId = "untrap_channel_hide_channel_menu_button_podcasts";

  const shortsButtonId = "untrap_channel_hide_channel_menu_button_shorts";
  const liveButtonId = "untrap_channel_hide_channel_menu_button_live";
  const playlistsButtonId = "untrap_channel_hide_channel_menu_button_playlists";
  const comunityButtonId = "untrap_channel_hide_channel_menu_button_community";
  const storeButtonId = "untrap_channel_hide_channel_menu_button_store";
  const channelsButtonId = "untrap_channel_hide_channel_menu_button_channels";

  browser.storage.local.get(
    [
      homeButtonId,
      videoButtonId,
      shortsButtonId,
      liveButtonId,
      releaseButtonId,
      podcastButtonId,
      playlistsButtonId,
      comunityButtonId,
      storeButtonId,
      channelsButtonId,
    ],
    function (obj) {
      // Check if tabs exist and then hide neccessary
      var interval = setInterval(function () {
        const tabs = document.querySelectorAll(
          "ytd-browse[page-subtype='channels'] yt-tab-group-shape yt-tab-shape"
        );
        const tabsMobile = document.querySelectorAll(
          "ytm-browse:has(yt-decorated-avatar-view-model) yt-tab-group-shape yt-tab-shape"
        );

        const actualTabs = tabs.length == 0 ? tabsMobile : tabs;

        if (actualTabs.length > 0) {
          clearInterval(interval);

          for (const tab of actualTabs) {
            const inTab = tab.querySelector(".yt-tab-shape-wiz__tab");

            if (inTab) {
              const preparedTitle = inTab.innerHTML.trim().toUpperCase();

              if (homeButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[homeButtonId] == true ? "none" : "inline-flex";
              } else if (videosButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[videoButtonId] == true ? "none" : "inline-flex";
              } else if (shortsButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[shortsButtonId] == true ? "none" : "inline-flex";
              } else if (liveButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[liveButtonId] == true ? "none" : "inline-flex";
              } else if (playlistsButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[playlistsButtonId] == true ? "none" : "inline-flex";
              } else if (communityButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[comunityButtonId] == true ? "none" : "inline-flex";
              } else if (channelsButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[channelsButtonId] == true ? "none" : "inline-flex";
              } else if (releasesButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[releaseButtonId] == true ? "none" : "inline-flex";
              } else if (podcastsButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[podcastButtonId] == true ? "none" : "inline-flex";
              } else if (storeButtonTitles.includes(preparedTitle)) {
                tab.style.display =
                  obj[storeButtonId] == true ? "none" : "inline-flex";
              }
            }
          }
        }
      }, 100);
    }
  );
}

function safe_redirectChannelTo(redirectTo) {
  var currentUrl = window.location.href;

  if (isChannelHomeUrl(currentUrl)) {
    if (redirectTo == "videos") {
      window.location.replace(currentUrl + "/videos");
    } else if (redirectTo == "shorts") {
      window.location.replace(currentUrl + "/shorts");
    } else if (redirectTo == "live") {
      window.location.replace(currentUrl + "/streams");
    } else if (redirectTo == "releases") {
      window.location.replace(currentUrl + "/releases");
    } else if (redirectTo == "podcasts") {
      window.location.replace(currentUrl + "/podcasts");
    } else if (redirectTo == "playlists") {
      window.location.replace(currentUrl + "/playlists");
    } else if (redirectTo == "community") {
      window.location.replace(currentUrl + "/community");
    }
  }
}

function isChannelHomeUrl(url) {
  // Regular expression for matching YouTube channel or username
  const youtubeRegex =
    /^https?:\/\/(www|m)\.youtube\.com\/(channel\/([a-zA-Z0-9_.-]+)|@([a-zA-Z0-9_.-]+))\/?$/;

  // Test the URL against the regex
  return youtubeRegex.test(url);
}

// MARK: - Enter Point

function channelPagesIsOpened() {
  hideMenuTabs();

  browser.storage.local.get(["untrap_redirect_channel_to"], function (obj) {
    // Default Channel Page

    const redirectTo = obj["untrap_redirect_channel_to"];

    if (redirectTo != "home" && redirectTo != null) {
      safe_redirectChannelTo(redirectTo);
    }
  });
}

// MARK: - Button Titles Constants

const homeButtonTitles = [
  "HOME",
  "TUIS",
  "ƏSAS SƏHIFƏ",
  "BERANDA",
  "LAMAN UTAMA",
  "POČETNA STRANICA",
  "INICI",
  "DOMOVSKÁ STRÁNKA",
  "START",
  "ÜBERSICHT",
  "AVALEHT",
  "INICIO",
  "PÁGINA PRINCIPAL",
  "ORRI NAGUSIA",
  "HOME",
  "ACCUEIL",
  "ACCUEIL",
  "INICIO",
  "POČETNA STRANICA",
  "EKHAYA",
  "HEIM",
  "MWANZO",
  "SĀKUMS",
  "PAGRINDINIS",
  "KEZDŐLAP",
  "HOME",
  "START",
  "ASOSIY",
  "FAQJA KRYESORE",
  "TRANG CHỦ",
  "ANA SAYFA",
  "ГАЛОЎНАЯ СТАРОНКА",
  "НАЧАЛНА СТРАНИЦА",
  "БАШКЫ БЕТ",
  "НЕГІЗГІ БЕТ",
  "ПОЧЕТНА",
  "НҮҮР",
  "ГЛАВНАЯ",
  "ПОЧЕТНА",
  "ГОЛОВНА",
  "ΑΡΧΙΚΉ",
  "ԳԼԽԱՎՈՐ ԷՋ",
  "דף הבית",
  "ہوم",
  " الصفحة الرئيسية",
  "صفحه اصلی",
  "गृह",
  "होम",
  "होम पेज",
  "গৃহ পৃষ্ঠা",
  "হোম",
  "ਹੋਮ",
  "હોમ",
  "ମୂଳପୃଷ୍ଠା",
  "முகப்பு",
  "మొదటి ట్యాబ్",
  "ಮುಖಪುಟ",
  "ഹോം",
  "මුල් පිටුව",
  "หน้าแรก",
  "ໜ້າຫຼັກ",
  "ပင်မစာမျက်နှာ",
  "ᲡᲐᲬᲧᲘᲡᲘ",
  "መነሻ",
  "ទំព័រ​ដើម",
  "首页",
  "首頁",
  "主頁",
  "ホーム",
  "홈",
];

const videosButtonTitles = [
  "VIDEOS",
  "VIDEO'S",
  "VIDEOLAR",
  "VIDEO",
  "VIDEO",
  "VIDEOZAPISI",
  "VÍDEOS",
  "VIDEA",
  "VIDEOER",
  "VIDEOS",
  "VIDEOD",
  "VÍDEOS",
  "VIDEOS",
  "BIDEOAK",
  "MGA VIDEO",
  "VIDÉOS",
  "VIDÉOS",
  "VÍDEOS",
  "VIDEOZAPISI",
  "AMAVIDIYO",
  "VÍDEÓ",
  "VIDEO",
  "VIDEOKLIPI",
  "VAIZDO ĮRAŠAI",
  "VIDEÓK",
  "VIDEO'S",
  "VIDEOER",
  "VIDEOLAR",
  "VIDEOT",
  "VIDEO",
  "VIDEOLAR",
  "ВІДЭА",
  "ВИДЕОКЛИПОВЕ",
  "ВИДЕОЛОР",
  "БЕЙНЕЛЕР",
  "ВИДЕА",
  "ВИДЕОНУУД",
  "ВИДЕО",
  "ВИДЕО СНИМЦИ",
  "ВІДЕО",
  "ΒΊΝΤΕΟ",
  "ՏԵՍԱՆՅՈՒԹԵՐ ",
  "סרטונים",
  "ویڈیوز",
  "الفيديوهات",
  "ویدئوها",
  "भिडियोहरू",
  "व्हिडिओ",
  "वीडियो",
  "ভিডিঅ’",
  "ভিডিও",
  "ਵੀਡੀਓ",
  "વીડિયો",
  "ଭିଡିଓ",
  "வீடியோக்கள்",
  "వీడియోలు",
  "ವೀಡಿಯೊಗಳು",
  "വീഡിയോകൾ",
  "වීඩියෝ",
  "วิดีโอ",
  "ວິດີໂອ",
  "ဗီဒီယိုများ",
  "ᲕᲘᲓᲔᲝᲔᲑᲘ",
  "ቪዲዮዎች",
  "វីដេអូ",
  "视频",
  "影片",
  "影片",
  "動画",
  "동영상",
];

const releasesButtonTitles = [
  "RELEASES",
  "VRYSTELLINGS",
  "BURAXILIŞLAR",
  "RILIS",
  "KELUARAN",
  "IZDANJA",
  "LLANÇAMENTS",
  "VYDÁNÍ",
  "UDGIVELSER",
  "VERÖFFENTLICHUNGEN",
  "VÄLJALASKED",
  "LANZAMIENTOS",
  "LANZAMIENTOS",
  "LANZAMIENTOS",
  "KALERATZEAK",
  "MGA RELEASE",
  "SORTIES",
  "NOUVEAUTÉS",
  "LANZAMENTOS",
  "IZDANJA",
  "OKUKHISHIWE",
  "ÚTGÁFUR",
  "MATOLEO",
  "LAIDIENI",
  "LEIDIMAI",
  "KIADÁSOK",
  "UTGIVELSER",
  "RELIZLAR",
  "PUBLIKIME",
  "BẢN PHÁT HÀNH",
  "YAYINLANANLAR",
  "РЭЛІЗЫ",
  "НОВИ ЗАГЛАВИЯ",
  "АЛЬБОМДОР",
  "ШЫҒАРЫЛЫМДАР",
  "ИЗДАНИЈА",
  "ГАРГАСАН ЦОМОГ",
  "РЕЛИЗЫ",
  "ИЗДАЊА",
  "РЕЛІЗИ",
  "ΚΥΚΛΟΦΟΡΊΕΣ",
  "ԹՈՂԱՐԿՈՒՄՆԵՐ",
  "פריטי תוכן",
  "ریلیزز",
  "الإصدارات",
  "نسخه‌های پخش",
  "نسخه‌های پخش",
  "रिलिज गरिएका एल्बम तथा एकल गीतहरूको सूची",
  "रिलीझ",
  "रिलीज़",
  "ৰিলীজ",
  "রিলিজ",
  "ਰਿਲੀਜ਼ਾਂ",
  "રિલીઝ",
  "ରିଲିଜଗୁଡ଼ିକ",
  "வெளியீடுகள்",
  "రిలీజ్‌లు",
  "ಬಿಡುಗಡೆಗಳು",
  "റിലീസുകൾ",
  "නිකුතු",
  "ผลงาน",
  "ຜົນງານ",
  "ဖြန့်ချိမှုများ",
  "ᲒᲐᲛᲝᲨᲕᲔᲑᲔᲑᲘ",
  "ልቀቶች",
  "ការចេញផ្សាយ",
  "发行作品",
  "發行內容",
  "專輯",
  "リリース",
  "발표곡",
];

const podcastsButtonTitles = [
  "PODCASTS",
  "PODSENDINGS",
  "PODKASTLAR",
  "PODCAST",
  "PODCASTI",
  "PÒDCASTS",
  "PODCASTY",
  "PODCASTS",
  "PODCASTID",
  "PÓDCASTS",
  "PODCASTAK",
  "MGA PODCAST",
  "BALADOS",
  "PODCASTI",
  "HLAÐVÖRP",
  "PODIKASTI",
  "APLĀDES",
  "PODCASTOK",
  "PODCASTER",
  "PODKASTLAR",
  "PODKASTE",
  "PODCAST",
  "PODCAST'LER",
  "ПАДКАСТЫ",
  "ПОДКАСТ ЕМИСИИ",
  "ПОДКАСТТАР",
  "ПОДКАСТАР",
  "ПОТКАСТИ",
  "ПОДКАСТ",
  "ПОДКАСТЫ",
  "ПОДКАСТИ",
  "ПОДКАСТИ",
  "ՓՈԴՔԱՍՏՆԵՐ",
  "פודקאסטים",
  "پوڈکاسٹس",
  "ملفات البودكاست",
  "پادکست‌ها",
  "पोडकास्टहरू",
  "पॉडकास्ट",
  "पॉडकास्ट",
  "প’ডকাষ্ট",
  "পডকাস্ট",
  "ਪੌਡਕਾਸਟ",
  "પૉડકાસ્ટ",
  "ପୋଡକାଷ୍ଟଗୁଡ଼ିକ",
  "பாட்காஸ்ட்டுகள்",
  "పాడ్‌కాస్ట్‌లు",
  "ಪಾಡ್‌ಕಾಸ್ಟ್‌ಗಳು",
  "പോഡ്‌കാസ്റ്റുകൾ",
  "පෝඩ්කාස්ට්",
  "พอดแคสต์",
  "ພອດແຄສ",
  "ပေါ့တ်ကာစ်",
  "ፖድካስቶች",
  "ផតខាស",
  "播客",
  "ポッドキャスト",
  "라이브",
];

const shortsButtonTitles = [
  "KORTVIDEO'S",
  "SHORTS",
  "CURTS",
  "LÜHIVIDEOD",
  "COURTES VIDÉOS",
  "SHORTS VIDEOZAPISI",
  "AMA-SHORT",
  "VIDEO FUPI",
  "SHORTS-VIDEOER",
  "КЫСКА ВИДЕОЛОР",
  "YOUTUBE SHORTS",
  "SHORTS",
  "ԿԱՐՃ ՀՈԼՈՎԱԿՆԵՐ",
  "فیلم‌های کوتاه YOUTUBE",
  "ᲛᲝᲙᲚᲔ ᲕᲘᲓᲔᲝᲔᲑᲘ",
  "ショート",
  "SHORTS",
];

const liveButtonTitles = [
  "LIVE",
  "REGSTREEKS",
  "CANLI",
  "LIVE",
  "LANGSUNG",
  "UŽIVO",
  "EN DIRECTE",
  "ŽIVĚ",
  "LIVE",
  "LIVE",
  "OTSE",
  "EN DIRECTO",
  "EN VIVO",
  "ZUZENEAN",
  "LIVE",
  "EN DIRECT",
  "EN DIRECT",
  "PUBLICADO",
  "UŽIVO",
  "BUKHOMA",
  "Í BEINNI",
  "MOJA KWA MOJA",
  "TIEŠRAIDĒ",
  "TIESIOGIAI",
  "ÉLŐ",
  "LIVE",
  "DIREKTE",
  "JONLI",
  "DREJTPËRDREJT",
  "SỰ KIỆN PHÁT TRỰC TIẾP",
  "CANLI",
  "УЖЫВУЮ",
  "НА ЖИВО",
  "ТҮЗ ОБОДО",
  "ТІКЕЛЕЙ ЭФИР",
  "ВО ЖИВО",
  "ШУУД",
  "ТРАНСЛЯЦИИ",
  "УЖИВО",
  "НАЖИВО",
  "ΖΩΝΤΑΝΆ",
  "ՈՒՂԻՂ ԵԹԵՐ",
  "בשידור חי",
  "لائیو",
  "بث مباشر",
  "زنده",
  "लाइभ",
  "लाइव्ह",
  "लाइव",
  "লাইভ",
  "লাইভ",
  "ਲਾਈਵ",
  "લાઇવ",
  "ଲାଇଭ୍",
  "நேரலை",
  "లైవ్",
  "ಲೈವ್",
  "തത്സമയം",
  "සජීවී",
  "สด",
  "ສົດ",
  "တိုက်ရိုက်လွှင့်နေသော",
  "ᲞᲘᲠᲓᲐᲞᲘᲠᲘ",
  "ቀጥታ ስርጭት",
  "បន្តផ្ទាល់",
  "直播",
  "直播",
  "直播",
  "ライブ",
  "실시간",
];

const playlistsButtonTitles = [
  "PLAYLISTS",
  "SNITLYSTE",
  "MAHNI SIYAHILARI",
  "PLAYLIST",
  "SENARAI MAIN",
  "PLEJLISTE",
  "LLISTES DE REPRODUCCIÓ",
  "PLAYLISTY",
  "PLAYLISTER",
  "PLAYLISTS",
  "ESITUSLOENDID",
  "LISTAS",
  "LISTAS DE REPRODUCCIÓN",
  "ERREPRODUKZIO-ZERRENDAK",
  "MGA PLAYLIST",
  "PLAYLISTS",
  "LISTES DE LECTURE",
  "LISTAS DE REPRODUCIÓN",
  "POPISI",
  "UHLU LWADLALWAYO",
  "SPILUNARLISTAR",
  "ORODHA",
  "ATSKAŅOŠANAS SARAKSTI",
  "GROJARAŠČIAI",
  "LEJÁTSZÁSI LISTÁK",
  "PLAYLISTS",
  "SPILLELISTER",
  "PLEYLISTLAR",
  "LISTAT PËR LUAJTJE",
  "DANH SÁCH PHÁT",
  "OYNATMA LISTELERI",
  "ПЛЭЙ-ЛІСТЫ",
  "ПЛЕЙЛИСТИ",
  "ОЙНОТМО ТИЗМЕЛЕР",
  "ОЙНАТУ ТІЗІМДЕРІ",
  "ПЛЕЈЛИСТИ",
  "ТОГЛУУЛАХ ЖАГСААЛТ",
  "ПЛЕЙЛИСТЫ",
  "ПЛЕЈЛИСТЕ",
  "СПИСКИ ВІДТВОРЕННЯ",
  "PLAYLISTS",
  "ՏԵՍԱՑԱՆԿԵՐ",
  "פלייליסטים",
  "پلے لسٹس",
  "قوائم التشغيل",
  "فهرست‌های پخش",
  "प्लेलिस्टहरू",
  "प्लेलिस्ट",
  "प्लेलिस्ट",
  "প্লে’লিষ্ট",
  "প্লেলিস্ট",
  "ਪਲੇਲਿਸਟਾਂ",
  "પ્લેલિસ્ટ",
  "ପ୍ଲେଲିଷ୍ଟଗୁଡ଼ିକ",
  "பிளேலிஸ்ட்கள்",
  "ప్లేలిస్ట్‌లు",
  "ಪ್ಲೇಲಿಸ್ಟ್‌ಗಳು",
  "പ്ലേലിസ്റ്റുകൾ",
  "ධාවන ලැයිස්තු",
  "เพลย์ลิสต์",
  "ລາຍການຫຼິ້ນ",
  "အစီအစဉ်များ",
  "ᲓᲐᲡᲐᲙᲠᲐᲕᲘ ᲡᲘᲔᲑᲘ",
  "አጫዋች ዝርዝሮች",
  "កម្រងវីដេអូ",
  "播放列表",
  "播放清單",
  "播放清單",
  "再生リスト",
  "재생목록",
];

const communityButtonTitles = [
  "COMMUNITY",
  "GEMEENSKAP",
  "İCTIMAI",
  "KOMUNITAS",
  "KOMUNITI",
  "ZAJEDNICA",
  "COMUNITAT",
  "KOMUNITA",
  "FÆLLESSKAB",
  "COMMUNITY",
  "KOGUKOND",
  "COMUNIDAD",
  "COMUNIDAD",
  "KOMUNITATEA",
  "KOMUNIDAD",
  "COMMUNAUTÉ",
  "COMMUNAUTÉ",
  "COMUNIDADE",
  "ZAJEDNICA",
  "UMPHAKATHI",
  "SAMFÉLAGIÐ",
  "JUMUIYA",
  "KOPIENA",
  "BENDRUOMENĖ",
  "KÖZÖSSÉG",
  "COMMUNITY",
  "FELLESSKAP",
  "HAMJAMIYAT",
  "KOMUNITETI",
  "CỘNG ĐỒNG",
  "TOPLULUK",
  "СУПОЛЬНАСЦЬ",
  "ОБЩНОСТ",
  "КООМДОШТУК",
  "ҚАУЫМДАСТЫҚ",
  "ЗАЕДНИЦА",
  "ОЛОН НИЙТ",
  "СООБЩЕСТВО",
  "ЗАЈЕДНИЦА",
  "СПІЛЬНОТА",
  "ΚΟΙΝΌΤΗΤΑ",
  "ՀԱՄԱՅՆՔ",
  "קהילה",
  " کمیونٹی المنتدى",
  "کمیونٹی",
  "انجمن",
  "समुदाय",
  "समुदाय",
  "कम्यूनिटी",
  "সম্প্ৰদায়",
  "কমিউনিটি",
  "ਭਾਈਚਾਰਾ",
  "સમુદાય",
  "କମ୍ୟୁନିଟୀ",
  "சமூகம்",
  "కమ్యూనిటీ",
  "ಸಮುದಾಯ",
  "കമ്മ്യൂണിറ്റി",
  "ප්‍රජාව",
  "ชุมชน",
  "ຊຸມ​ຊົນ",
  "ကွန်မြူနတီ",
  "ᲡᲐᲖᲝᲒᲐᲓᲝᲔᲑᲐ",
  "ማህበረሰብ",
  "សហគមន៍",
  "社区",
  "社群",
  "社群",
  "コミュニティ",
  "커뮤니티",
];

const channelsButtonTitles = [
  "CHANNELS",
  "KANALE",
  "KANALLAR",
  "CHANNEL",
  "SALURAN",
  "KANALI",
  "CANALS",
  "KANÁLY",
  "KANALER",
  "KANÄLE",
  "KANALID",
  "CANALES",
  "CANALES",
  "KANALAK",
  "MGA CHANNEL",
  "CHAÎNES",
  "CHAÎNES",
  "CANLES",
  "KANALI",
  "IZITESHI",
  "RÁSIR",
  "VITUO",
  "KANĀLI",
  "KANALAI",
  "CSATORNÁK",
  "KANALEN",
  "KANALER",
  "KANALLAR",
  "KANALET",
  "KÊNH",
  "KANALLAR",
  "КАНАЛЫ",
  "КАНАЛИ",
  "КАНАЛДАР",
  "АРНАЛАР",
  "КАНАЛИ",
  "СУВГУУД",
  "КАНАЛЫ",
  "КАНАЛИ",
  "КАНАЛИ",
  "ΚΑΝΆΛΙΑ",
  "ԱԼԻՔՆԵՐ",
  "ערוצים",
  "چینلز",
  "القنوات",
  "کانال‌ها",
  "च्यानलहरू",
  "चॅनल",
  "चैनल",
  "চেনেলসমূহ",
  "চ্যানেলগুলি",
  "ਚੈਨਲ",
  "ચેનલ્સ",
  "ଚ୍ୟାନେଲ୍",
  "சேனல்கள்",
  "ఛానెళ్లు",
  "ಚಾನಲ್‌ಗಳು",
  "ചാനലുകൾ",
  "නාලිකා",
  "ช่อง",
  "ຊ່ອງ",
  "ချန်နယ်များ",
  "ᲐᲠᲮᲔᲑᲘ",
  "ሰርጦች",
  "ប៉ុស្តិ៍",
  "频道",
  "頻道",
  "頻道",
  "チャンネル",
  "채널",
];

// Take One Tech
const storeButtonTitles = [
  "STORE",
  "WINKEL",
  "MAĞAZA",
  "TOKO",
  "KEDAI",
  "TRGOVINA",
  "BOTIGA",
  "OBCHOD",
  "BUTIK",
  "SHOP",
  "POOD",
  "TIENDA",
  "DENDA",
  "BOUTIQUE",
  "TENDA",
  "TRGOVINA",
  "ISITOLO",
  "VERSLUN",
  "DUKA",
  "VEIKALS",
  "PARDUOTUVĖ",
  "ÜZLET",
  "WINKEL",
  "BUTIKK",
  "MARKET",
  "DYQANI",
  "CỬA HÀNG",
  "MAĞAZA",
  "КРАМА",
  "МАГАЗИН",
  "ДҮКӨН",
  "ДҮКЕН",
  "ПРОДАВНИЦА",
  "ДЭЛГҮҮР",
  "МАГАЗИН",
  "ПРОДАВНИЦА",
  "МАГАЗИН",
  "ΚΑΤΆΣΤΗΜΑ",
  "ԽԱՆՈՒԹ",
  "חנות",
  "اسٹور",
  "المتجر",
  "فروشگاه",
  "स्टोर",
  "STORE",
  "स्टोर",
  "STORE",
  "স্টোর",
  "STORE",
  "స్టోర్",
  "ಸ್ಟೋರ್",
  "වෙළෙඳසැල",
  "ร้านค้า",
  "ຮ້ານຄ້າ",
  "စတိုး",
  "መደብር",
  "ហាង",
  "商店",
  "商店",
  "商店",
  "ストア",
  "스토어",
];
