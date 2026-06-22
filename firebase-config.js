/* ════════════════════════════════════════════════════════════════
   FIREBASE — лента опубликованных сцен (Firestore + Auth)
   ────────────────────────────────────────────────────────────────
   КАК НАСТРОИТЬ (один раз):
   1. console.firebase.google.com → создайте бесплатный проект.
   2. Build → Firestore Database → Create database (production mode).
   3. Build → Authentication → Sign-in method → включите Email/Password,
      затем во вкладке Users добавьте одного администратора (e-mail + пароль).
   4. Project settings → ваше веб-приложение → скопируйте firebaseConfig
      и вставьте значения ниже.
   5. Firestore → Rules → вставьте (замените ADMIN_UID на UID админа из вкладки Users):
        rules_version = '2';
        service cloud.firestore {
          match /databases/{db}/documents {
            match /scenes/{id} {
              allow read: if true;                        // лента видна всем
              allow write: if request.auth != null
                           && request.auth.uid == 'ADMIN_UID';
            }
          }
        }
   Пока поля пустые — сайт работает как обычно, лента просто скрыта.
   ════════════════════════════════════════════════════════════════ */

window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

(function () {
  const cfg = window.FIREBASE_CONFIG || {};
  const configured = !!(cfg.apiKey && cfg.projectId);
  let db = null, auth = null, inited = false;

  function init() {
    if (inited) return db;
    if (!configured || typeof firebase === "undefined") return null;
    try {
      firebase.initializeApp(cfg);
      db = firebase.firestore();
      auth = firebase.auth();
      inited = true;
    } catch (e) { console.warn("Firebase init failed:", e); }
    return db;
  }

  window.NDFire = {
    get configured() { return configured && typeof firebase !== "undefined"; },

    // публикация сцены (требует входа администратора)
    async publish(scene, email, pass) {
      const d = init();
      if (!d) throw new Error("Firebase не настроен");
      await auth.signInWithEmailAndPassword(email, pass);
      await d.collection("scenes").doc(scene.id).set({
        name: scene.name || "",
        address: scene.address || "",
        gmaps: scene.gmaps || "",
        gis2: scene.gis2 || "",
        thumbnail: scene.thumbnail || "",
        published: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    },

    // чтение опубликованных сцен для ленты (сортировка на клиенте — без составного индекса)
    async fetchScenes() {
      const d = init();
      if (!d) return [];
      const snap = await d.collection("scenes").where("published", "==", true).limit(100).get();
      const arr = snap.docs.map(x => x.data());
      arr.sort((a, b) => ((b.createdAt && b.createdAt.seconds) || 0) - ((a.createdAt && a.createdAt.seconds) || 0));
      return arr.slice(0, 50);
    }
  };
})();
