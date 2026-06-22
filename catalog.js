/* ════════════════════════════════════════════════════════════════
   КАТАЛОГ ОБОРУДОВАНИЯ — New Direction
   Источник: реальный инвентарь (Список оборудования.xlsx)
   Поля позиции:
     id   — уникальный идентификатор
     cat  — категория = ВИД (см. VID)
     kit  — КОМПЛЕКТ / тариф (см. KIT)
     name — название (марка/модель)
     desc — описание
     w,d,h— габариты в метрах (ширина X, глубина Z, высота Y)
     col  — базовый цвет процедурной модели
     arch — архетип процедурной модели (если нет model)
     model— путь к реальной 3D-модели (GLB), масштабируется под w/d/h
     beam,ang — параметры луча для света; round — круглая форма
     e    — эмодзи-иконка в каталоге
   ════════════════════════════════════════════════════════════════ */

// Цвета категорий
const TC = {
  audio:'#9aa0a6', light:'#4488ff', laser:'#22dd88', video:'#4466ff',
  structure:'#9a8456', backline:'#cc7744', dj:'#9b59b6', fx:'#44aa88',
  power:'#e67e22', furniture:'#a06a44'
};

// ВИД (первый список тегов) — категория позиции
const VID = [
  {key:'audio',     label:'Звук',          e:'🔊'},
  {key:'light',     label:'Свет',          e:'💡'},
  {key:'laser',     label:'Лазеры',        e:'🟢'},
  {key:'video',     label:'Видео / Экран', e:'🖥'},
  {key:'structure', label:'Сцена / Конструкции', e:'🏗'},
  {key:'backline',  label:'Бэклайн',       e:'🎸'},
  {key:'dj',        label:'DJ',            e:'🎧'},
  {key:'fx',        label:'Спецэффекты',   e:'🎆'},
  {key:'power',     label:'Питание',       e:'⚡'},
  {key:'furniture', label:'Мебель',        e:'🪑'},
];
const VID_LABEL = Object.fromEntries(VID.map(v=>[v.key,v.label]));

// КОМПЛЕКТ (второй список тегов) — тариф / уровень
const KIT = ['обычный','средний','дорогой','бизнес','ультра'];
const KIT_META = {
  'обычный':{c:'#8a8a82', i:1},
  'средний':{c:'#6fb3d6', i:2},
  'дорогой':{c:'#C9A227', i:3},
  'бизнес' :{c:'#b06be0', i:4},
  'ультра' :{c:'#ff5a5a', i:5},
};

const CAT = [
  // ─────────────── ЗВУК (PA / FOH / мониторы / пульты / микрофоны) ───────────────
  {id:'tp400',     cat:'audio', kit:'бизнес',  name:'Turbo Power Audio TP-400',     desc:'Элемент линейного массива TOP (rms 400, prog 600)', w:.70,d:.45,h:.40, col:0x1a1a1a, arch:'linearray', e:'🔈'},
  {id:'tp400l',    cat:'audio', kit:'бизнес',  name:'Turbo Power Audio TP-400L',    desc:'Элемент линейного массива SUB (rms 1000, prog 1500)', w:.70,d:.80,h:.55, col:0x141414, arch:'linearray', e:'🔉'},
  {id:'amprack',   cat:'audio', kit:'бизнес',  name:'TPA Amp Rack',                 desc:'Комплект усилителей (Cla 50, Rat72 + Dsp 4in-4out)', w:.60,d:.70,h:1.20, col:0x111111, arch:'rack', e:'🗄'},
  {id:'kidd720',   cat:'audio', kit:'дорогой', name:'TPA KIDD 720F',                desc:'Элемент линейного массива-сателлит, prog 800w', w:.42,d:.40,h:.55, col:0x1a1a1a, arch:'speaker', e:'🔈'},
  {id:'tse',       cat:'audio', kit:'ультра',  name:'Acoustic Line TSE',            desc:'Звуковой комплект prog 8000w', w:.80,d:.70,h:1.00, col:0x161616, arch:'speaker', e:'🔊'},
  {id:'soundcraftsi',cat:'audio',kit:'бизнес', name:'Soundcraft Si',                desc:'Цифровая микшерная консоль 24 канала', w:.90,d:.60,h:.20, col:0x1a1a2e, arch:'console', e:'🎚'},
  {id:'gld80',     cat:'audio', kit:'бизнес',  name:'Allen & Heath GLD80',          desc:'Цифровая микшерная консоль 48 каналов', w:1.00,d:.60,h:.20, col:0x1a1a2e, arch:'console', e:'🎚'},
  {id:'tassops15', cat:'audio', kit:'средний', name:'Tasso PS15',                   desc:'Акустическая мониторная система 400w rms', w:.45,d:.40,h:.62, col:0x1a1a1a, arch:'monitor', model:'models/speakerSmall.glb', e:'📣'},
  {id:'crownxti',  cat:'audio', kit:'средний', name:'Crown XTI 4002',               desc:'Усилитель мощности', w:.48,d:.42,h:.09, col:0x111111, arch:'amp', e:'🔌'},
  {id:'ma15a',     cat:'audio', kit:'дорогой', name:'Turbo Power Audio MA15A',      desc:'Активная мониторная система 700w rms BI-AMP', w:.46,d:.42,h:.66, col:0x161616, arch:'monitor', model:'models/speaker.glb', e:'📣'},
  {id:'peavey115', cat:'audio', kit:'средний', name:'Peavey DM115',                 desc:'Активная мониторная система 400w rms', w:.45,d:.40,h:.60, col:0x1a1a1a, arch:'monitor', model:'models/speaker.glb', e:'📣'},
  {id:'alesis112', cat:'audio', kit:'обычный', name:'Alesis Drum 112',              desc:'Активная мониторная система 400w rms', w:.40,d:.35,h:.55, col:0x1a1a1a, arch:'monitor', e:'📣'},
  {id:'ip3000',    cat:'audio', kit:'дорогой', name:'Turbosound iP3000',            desc:'Акустическая система колонного типа, 2 кВт', w:.32,d:.32,h:2.00, col:0x141414, arch:'column', e:'🔊'},
  {id:'ip2000',    cat:'audio', kit:'средний', name:'Turbosound iP2000',            desc:'Акустическая система колонного типа, 1 кВт', w:.30,d:.30,h:1.80, col:0x141414, arch:'column', e:'🔊'},
  {id:'zed12',     cat:'audio', kit:'обычный', name:'Allen & Heath ZED12FX',        desc:'Аналоговый микшерный пульт 12 каналов', w:.40,d:.35,h:.12, col:0x20202a, arch:'console', e:'🎚'},
  {id:'dm3s',      cat:'audio', kit:'дорогой', name:'Yamaha DM3S',                  desc:'Цифровой пульт 16 каналов', w:.35,d:.30,h:.12, col:0x1a1a2e, arch:'console', e:'🎚'},
  {id:'m32live',   cat:'audio', kit:'бизнес',  name:'Midas M32 Live',               desc:'Цифровой пульт 32 канала', w:.90,d:.55,h:.20, col:0x14142a, arch:'console', e:'🎚'},
  {id:'m32r',      cat:'audio', kit:'дорогой', name:'Midas M32R',                   desc:'Цифровой пульт 16 каналов', w:.45,d:.50,h:.18, col:0x14142a, arch:'console', e:'🎚'},
  {id:'dl32',      cat:'audio', kit:'дорогой', name:'Midas DL32',                   desc:'Stage box 32 канала + UTP 30м', w:.50,d:.40,h:.60, col:0x111111, arch:'rack', e:'🗄'},
  {id:'sd16',      cat:'audio', kit:'средний', name:'Behringer SD16',               desc:'Stage box 16 каналов + UTP 30м', w:.48,d:.30,h:.40, col:0x111111, arch:'rack', e:'🗄'},
  {id:'qlxd',      cat:'audio', kit:'дорогой', name:'Shure QLXD SM58 Beta',         desc:'Цифровой радиомикрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'blx58',     cat:'audio', kit:'средний', name:'Shure BLX4R SM58 Beta',        desc:'Радиомикрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'blxpg31',   cat:'audio', kit:'средний', name:'Shure BLX4R PG31',             desc:'Головной радиомикрофон', w:.12,d:.06,h:.06, col:0x222222, arch:'mic', e:'🎤'},
  {id:'combiner',  cat:'audio', kit:'средний', name:'Shure Combiner',               desc:'Усилитель РЧ + антенны', w:.48,d:.30,h:.12, col:0x111111, arch:'rack', e:'📡'},
  {id:'presonus24',cat:'audio', kit:'дорогой', name:'Presonus StudioLive 24',       desc:'Цифровая микшерная консоль 24 канала', w:.80,d:.50,h:.18, col:0x1a1a2e, arch:'console', e:'🎚'},
  {id:'fohrack',   cat:'audio', kit:'дорогой', name:'FOH Rack',                     desc:'Комплект голосовых и инструментальных обработок', w:.60,d:.70,h:1.20, col:0x111111, arch:'rack', e:'🗄'},
  {id:'stagemaster',cat:'audio',kit:'средний', name:'Stage Master',                 desc:'Мультикабели 24+4', w:.45,d:.45,h:.30, col:0x222222, arch:'box', e:'🧵'},
  {id:'ud4sm87',   cat:'audio', kit:'дорогой', name:'Shure UD4 SM87',               desc:'Вокальный радиомикрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'ud4sm58b',  cat:'audio', kit:'дорогой', name:'Shure UD4 SM58B',              desc:'Вокальный радиомикрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'ud4sm58',   cat:'audio', kit:'средний', name:'Shure UD4 SM58',               desc:'Вокальный радиомикрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'pgx',       cat:'audio', kit:'средний', name:'Shure PGX',                    desc:'Вокальный радиомикрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'senn614',   cat:'audio', kit:'средний', name:'Sennheiser 614',               desc:'Инструментальный конденсаторный микрофон', w:.05,d:.05,h:.20, col:0x2a2a2a, arch:'mic', e:'🎙'},
  {id:'beyerm99',  cat:'audio', kit:'средний', name:'Beyerdynamic M99',             desc:'Барабанный динамический микрофон', w:.07,d:.07,h:.12, col:0x2a2a2a, arch:'mic', e:'🎙'},
  {id:'altodi',    cat:'audio', kit:'обычный', name:'Alto DI',                      desc:'Активная развязка директ-бокс', w:.10,d:.12,h:.05, col:0x223344, arch:'di', e:'🔲'},
  {id:'artdi',     cat:'audio', kit:'обычный', name:'ART DI',                       desc:'Активная развязка директ-бокс', w:.10,d:.12,h:.05, col:0x223344, arch:'di', e:'🔲'},
  {id:'sm58beta',  cat:'audio', kit:'средний', name:'Shure SM58 Beta',              desc:'Вокальный динамический микрофон', w:.06,d:.06,h:.26, col:0x222222, arch:'mic', model:'models/poly/mic.glb', e:'🎤'},
  {id:'sm91',      cat:'audio', kit:'средний', name:'Shure SM91',                   desc:'Конденсаторный микрофон для бас-бочки', w:.10,d:.08,h:.03, col:0x222222, arch:'mic', e:'🎙'},
  {id:'sm52',      cat:'audio', kit:'средний', name:'Shure SM52',                   desc:'Динамический микрофон для бас-бочки', w:.12,d:.10,h:.10, col:0x222222, arch:'mic', e:'🎙'},
  {id:'sm57',      cat:'audio', kit:'обычный', name:'Shure SM57',                   desc:'Инструментальный динамический микрофон', w:.05,d:.05,h:.16, col:0x222222, arch:'mic', e:'🎙'},
  {id:'senn904',   cat:'audio', kit:'средний', name:'Sennheiser 904',               desc:'Инструментальный динамический микрофон', w:.06,d:.05,h:.08, col:0x2a2a2a, arch:'mic', e:'🎙'},
  {id:'se7',       cat:'audio', kit:'средний', name:'sE Electronics sE7',           desc:'Инструментальный конденсаторный микрофон', w:.04,d:.04,h:.12, col:0x2a2a2a, arch:'mic', e:'🎙'},
  {id:'dibox',     cat:'audio', kit:'обычный', name:'DI Box',                       desc:'Развязка аудиосигнала', w:.10,d:.12,h:.05, col:0x223344, arch:'di', e:'🔲'},

  // ─────────────── СВЕТ ───────────────
  {id:'apollo106', cat:'light', kit:'средний', name:'Apollo LED 106',               desc:'Поворотная заливная голова, 106×3вт', w:.35,d:.35,h:.55, col:0x223044, arch:'head', beam:0xffeecc, ang:.6, e:'💡'},
  {id:'elmatrix',  cat:'light', kit:'дорогой', name:'E-Lights LED Matrix',          desc:'Поворотная заливная голова, 25×15вт', w:.40,d:.40,h:.50, col:0x222222, arch:'head', beam:0xffffff, ang:.7, e:'💡'},
  {id:'smartbeam', cat:'light', kit:'дорогой', name:'I-Solution Smart Beam',        desc:'Поворотная голова Beam 280w', w:.40,d:.45,h:.60, col:0x1c1c22, arch:'head', beam:0xaabbff, ang:.14, model:'models/poly/spotlight.glb', e:'🔦'},
  {id:'im575',     cat:'light', kit:'дорогой', name:'I-Solution IM575',             desc:'Поворотная голова Spot 575w', w:.40,d:.50,h:.60, col:0x1c1c22, arch:'head', beam:0xffffff, ang:.22, model:'models/poly/spotlight.glb', e:'🔦'},
  {id:'sgmgalileo',cat:'light', kit:'дорогой', name:'SGM Galileo',                  desc:'Световая пушка 1200w', w:.50,d:1.00,h:.60, col:0x222211, arch:'spot', beam:0xffffff, ang:.20, model:'models/poly/spotlight.glb', e:'🔆'},
  {id:'icolor4',   cat:'light', kit:'средний', name:'I-Color 4',                    desc:'Прибор заливного света 2000w', w:.50,d:.30,h:.40, col:0x222211, arch:'wash', beam:0xffeeaa, ang:.8, e:'🌈'},
  {id:'ledpar36',  cat:'light', kit:'обычный', name:'LED Par 36',                   desc:'Светодиодный заливной прибор', w:.25,d:.25,h:.30, col:0x221122, arch:'par', beam:0xff66ff, ang:.55, e:'🔮'},
  {id:'blender4',  cat:'light', kit:'средний', name:'Blinder 4',                    desc:'Прибор заливного белого света (эффект вспышки)', w:.60,d:.15,h:.45, col:0x222222, arch:'blinder', beam:0xffffff, ang:.9, e:'💥'},
  {id:'dmxctrl',   cat:'light', kit:'средний', name:'DMX контроллеры',              desc:'DMX контроллеры 196 каналов', w:.48,d:.30,h:.10, col:0x1a1a1a, arch:'console', e:'🎛'},
  {id:'macaura',   cat:'light', kit:'дорогой', name:'MAC Aura Wash',                desc:'Поворотный заливной прибор 19×15 zoom RGBW', w:.35,d:.40,h:.50, col:0x222222, arch:'head', beam:0xffccaa, ang:.6, e:'💡'},
  {id:'bsw350',    cat:'light', kit:'дорогой', name:'BSW 350 Beam',                 desc:'Поворотный прибор 3-в-1 Beam/Spot/Wash', w:.40,d:.45,h:.60, col:0x1c1c22, arch:'head', beam:0xaaccff, ang:.18, model:'models/poly/spotlight.glb', e:'🔦'},
  {id:'ledmatrix530',cat:'light',kit:'средний',name:'LED Matrix 5×30',              desc:'RGB 5×30 вт', w:.50,d:.15,h:.50, col:0x222222, arch:'blinder', beam:0xffffff, ang:.8, e:'💥'},
  {id:'freecolor', cat:'light', kit:'средний', name:'Free Color LED Strip',         desc:'RGB 124×0.5 вт', w:1.00,d:.08,h:.08, col:0x001122, arch:'strip', beam:0x44ccff, ang:.3, e:'✨'},
  {id:'ledpar1815',cat:'light', kit:'средний', name:'LED Par 18×15',                desc:'RGBWY 18×15 вт', w:.28,d:.28,h:.32, col:0x221122, arch:'par', beam:0xffaa44, ang:.5, e:'🔮'},
  {id:'avolites',  cat:'light', kit:'бизнес',  name:'Avolites Quartz',              desc:'Консоль управления светом 4×512', w:.70,d:.50,h:.15, col:0x1a1a1a, arch:'console', e:'🎛'},
  {id:'anzheerun', cat:'light', kit:'средний', name:'Anzhee Run',                   desc:'Консоль управления светом 2×512', w:.50,d:.40,h:.12, col:0x1a1a1a, arch:'console', e:'🎛'},
  {id:'martinlj',  cat:'light', kit:'средний', name:'Martin Light Jockey + PC',     desc:'Карта управления светом 2×512 + ноутбук', w:.40,d:.30,h:.10, col:0x1a1a1a, arch:'console', e:'💻'},
  {id:'dmxsplit',  cat:'light', kit:'обычный', name:'Light DMX Splitter 1×8',       desc:'Сплиттер 8-канальный', w:.48,d:.20,h:.09, col:0x111111, arch:'rack', e:'🔀'},

  // ─────────────── ЛАЗЕРЫ ───────────────
  {id:'ls5000',    cat:'laser', kit:'бизнес',  name:'LS 5000',                      desc:'Лазерная установка 5вт, зелёный', w:.40,d:.50,h:.25, col:0x111111, arch:'laser', beam:0x33ff66, e:'🟢'},
  {id:'ls4000',    cat:'laser', kit:'бизнес',  name:'LS 4000 RGB',                  desc:'Лазерная установка 4вт RGB', w:.40,d:.50,h:.25, col:0x111111, arch:'laser', beam:0xff3366, e:'🌈'},
  {id:'ls18000',   cat:'laser', kit:'ультра',  name:'LS 18000 RGB',                 desc:'Лазерная установка 18вт RGB', w:.50,d:.60,h:.30, col:0x111111, arch:'laser', beam:0xff33ff, e:'🌈'},
  {id:'lsscreen',  cat:'laser', kit:'ультра',  name:'LS Screen 6×4',                desc:'Лазерный экран 6×4м', w:6.0,d:.10,h:4.0, col:0x050810, arch:'ledcurtain', beam:0x33ff88, e:'🟩'},

  // ─────────────── СЦЕНА / КОНСТРУКЦИИ ───────────────
  {id:'gtsage',    cat:'structure', kit:'средний', name:'GlobalTruss Sage',         desc:'Станок сцены 1.4×2.2м с лагерными ногами', w:1.40,d:2.20,h:.60, col:0x2a2a22, arch:'stage', e:'🟫'},
  {id:'prstairs',  cat:'structure', kit:'обычный', name:'PR Лестница',              desc:'Лестница', w:1.00,d:.90,h:.60, col:0x2a2a22, arch:'ladder', model:'models/stairs.glb', e:'🪜'},
  {id:'gt30',      cat:'structure', kit:'дорогой', name:'GlobalTruss 30',           desc:'Ферма четырёхпунтовая', w:2.00,d:.29,h:.29, col:0x666655, arch:'truss', e:'🏗'},
  {id:'gt70',      cat:'structure', kit:'бизнес',  name:'GlobalTruss 70',           desc:'Ферма четырёхпунтовая', w:3.00,d:.45,h:.45, col:0x666655, arch:'truss', e:'🏗'},
  {id:'lightstand',cat:'structure', kit:'обычный', name:'Light Stand',              desc:'Стойка', w:.80,d:.80,h:2.50, col:0x333333, arch:'stand', e:'🦵'},
  {id:'warkstand', cat:'structure', kit:'средний', name:'Wark Stand',               desc:'Стойка телескопическая 150кг', w:.90,d:.90,h:3.50, col:0x333333, arch:'stand', e:'🦵'},
  {id:'winch1000', cat:'structure', kit:'средний', name:'Ledika Winch 1000',        desc:'Цепная лебёдка 1 тонна', w:.25,d:.25,h:.40, col:0x444444, arch:'winch', e:'⛓'},
  {id:'tent46',    cat:'structure', kit:'бизнес',  name:'Ledika Тент 4×6',          desc:'Тент крыши 4×6м', w:4.0,d:6.0,h:3.0, col:0x888888, arch:'roof', e:'⛺'},
  {id:'tent68',    cat:'structure', kit:'бизнес',  name:'Ledika Тент 6×8',          desc:'Тент крыши 6×8м', w:6.0,d:8.0,h:3.5, col:0x888888, arch:'roof', e:'⛺'},
  {id:'tent1012',  cat:'structure', kit:'ультра',  name:'Ledika Тент 10×12',        desc:'Тент крыши 10×12м', w:10.0,d:12.0,h:4.0, col:0x888888, arch:'roof', e:'⛺'},
  {id:'ledika7045',cat:'structure', kit:'бизнес',  name:'Ledika Truss 70×45',       desc:'Фермовая конструкция 70×45', w:3.0,d:.70,h:.45, col:0x666655, arch:'truss', e:'🏗'},
  {id:'ledika4545',cat:'structure', kit:'дорогой', name:'Ledika Truss 45×45',       desc:'Фермовая конструкция 45×45', w:3.0,d:.45,h:.45, col:0x666655, arch:'truss', e:'🏗'},
  {id:'ledika3030',cat:'structure', kit:'средний', name:'Ledika Truss 30×30',       desc:'Фермовая конструкция 30×30', w:2.0,d:.30,h:.30, col:0x666655, arch:'truss', e:'🏗'},
  {id:'roof64',    cat:'structure', kit:'бизнес',  name:'Крыша 6×4',                desc:'Тент 6×4, серый', w:6.0,d:4.0,h:3.5, col:0x808080, arch:'roof', e:'⛺'},
  {id:'roof86',    cat:'structure', kit:'ультра',  name:'Крыша 8×6',                desc:'Тент 8×6, серый', w:8.0,d:6.0,h:4.0, col:0x808080, arch:'roof', e:'⛺'},
  {id:'ledikastand',cat:'structure',kit:'бизнес',  name:'Ledika Stand',             desc:'Подъёмник фермовый (каретка + голова)', w:.80,d:.80,h:4.00, col:0x444444, arch:'lift', e:'🗼'},
  {id:'winch2tel', cat:'structure', kit:'дорогой', name:'Winch 2t EL',              desc:'Лебёдка электрическая 2 тонны', w:.30,d:.30,h:.45, col:0x444444, arch:'winch', e:'⛓'},
  {id:'winch2t',   cat:'structure', kit:'средний', name:'Winch 2t',                 desc:'Лебёдка механическая 2 тонны', w:.25,d:.25,h:.40, col:0x444444, arch:'winch', e:'⛓'},
  {id:'totem3m',   cat:'structure', kit:'средний', name:'Totem Standart 3m',        desc:'Компактный тотем высотой 3 метра', w:.50,d:.50,h:3.00, col:0x222222, arch:'totem', e:'🗼'},
  {id:'soundkingt',cat:'structure', kit:'обычный', name:'SoundKing T',              desc:'Стойка световая 1800-4000мм', w:.90,d:.90,h:3.00, col:0x333333, arch:'stand', e:'🦵'},
  {id:'eagle2x1',  cat:'structure', kit:'средний', name:'Eagle Stand 2×1',          desc:'Станок сценический 2×1м, высота 0.5-1м', w:2.00,d:1.00,h:.75, col:0x2a2a22, arch:'stage', e:'🟫'},
  {id:'stairs4',   cat:'structure', kit:'обычный', name:'Лестница 4 ступени',       desc:'4 ступени, 0.5-1м', w:1.00,d:.90,h:.60, col:0x2a2a22, arch:'ladder', model:'models/stairs.glb', e:'🪜'},
  {id:'podium',    cat:'structure', kit:'средний', name:'Подиум-трибуна',           desc:'Трибуна спикера', w:.70,d:.50,h:1.15, col:0x201808, arch:'totem', e:'🎙'},

  // ─────────────── ВИДЕО / ЭКРАН ───────────────
  {id:'dicollor_in', cat:'video', kit:'дорогой', name:'DiCollor D 3.91 indoor',     desc:'Шаг 3.91, секция 1000×500мм, внутренний экран', w:1.0,d:.08,h:.5, col:0x050818, arch:'ledpanel', beam:0x2266ff, e:'🖥'},
  {id:'dicollor_out',cat:'video', kit:'ультра',  name:'DiCollor D 3.91 outdoor',    desc:'Шаг 3.91, секция 1000×500мм, уличный экран', w:1.0,d:.08,h:.5, col:0x050818, arch:'ledpanel', beam:0x2266ff, e:'🖥'},
  {id:'vx400',     cat:'video', kit:'дорогой', name:'Novastar VX400',               desc:'LED процессор 4 out', w:.48,d:.30,h:.09, col:0x111122, arch:'processor', e:'🟦'},
  {id:'vx1000',    cat:'video', kit:'бизнес',  name:'Novastar VX1000',              desc:'LED процессор 10 out', w:.48,d:.35,h:.13, col:0x111122, arch:'processor', e:'🟦'},
  {id:'lenovogame',cat:'video', kit:'дорогой', name:'Lenovo Game',                  desc:'Ноутбук для контента + Resolume Arena медиасервер', w:.36,d:.25,h:.03, col:0x222222, arch:'laptop', model:'models/laptop.glb', e:'💻'},
  {id:'asusvivo',  cat:'video', kit:'средний', name:'Asus VivoBook',                desc:'Ноутбук для запуска контента', w:.33,d:.23,h:.02, col:0x222222, arch:'laptop', model:'models/laptop.glb', e:'💻'},
  {id:'avermedia', cat:'video', kit:'обычный', name:'AverMedia',                    desc:'Карта видеозахвата', w:.15,d:.10,h:.03, col:0x111122, arch:'processor', e:'🎛'},
  {id:'rgblink',   cat:'video', kit:'средний', name:'RGBLink mini',                 desc:'Mini PTS', w:.20,d:.13,h:.05, col:0x111122, arch:'processor', e:'🟦'},
  {id:'ledtv65',   cat:'video', kit:'дорогой', name:'LED TV 65"',                   desc:'Плазменная панель 65 дюймов', w:1.45,d:.08,h:.85, col:0x0a0a0a, arch:'tv', model:'models/televisionModern.glb', e:'📺'},
  {id:'showled',   cat:'video', kit:'дорогой', name:'Show Led 6×4',                 desc:'Светодиодный занавес чёрный 6×4м', w:6.0,d:.06,h:4.0, col:0x050505, arch:'ledcurtain', beam:0x66aaff, e:'🎆'},

  // ─────────────── DJ ───────────────
  {id:'xdjrx3',    cat:'dj', kit:'дорогой', name:'Pioneer XDJ-RX3',                 desc:'DJ-контроллер', w:.70,d:.50,h:.10, col:0x141414, arch:'dj_controller', e:'🎛'},
  {id:'djma9',     cat:'dj', kit:'бизнес',  name:'Pioneer DJM-A9',                  desc:'DJ микшер', w:.32,d:.42,h:.11, col:0x141414, arch:'dj_mixer', e:'🎚'},
  {id:'djm2000',   cat:'dj', kit:'дорогой', name:'Pioneer DJM-2000 NXS',            desc:'DJ микшер', w:.35,d:.42,h:.11, col:0x141414, arch:'dj_mixer', e:'🎚'},
  {id:'cdj3000',   cat:'dj', kit:'бизнес',  name:'Pioneer CDJ-3000',               desc:'DJ проигрыватель', w:.33,d:.45,h:.12, col:0x141414, arch:'dj_player', model:'models/poly/turntable.glb', e:'💿'},
  {id:'cdj2000',   cat:'dj', kit:'дорогой', name:'Pioneer CDJ-2000 NXS2',          desc:'DJ проигрыватель', w:.33,d:.45,h:.12, col:0x141414, arch:'dj_player', model:'models/poly/turntable.glb', e:'💿'},
  {id:'djstand',   cat:'dj', kit:'средний', name:'DJ Stand',                       desc:'Стол разборный для DJ', w:1.60,d:.80,h:.95, col:0x0d0d20, arch:'desk', model:'models/desk.glb', e:'🎧'},

  // ─────────────── БЭКЛАЙН ───────────────
  {id:'tamaimperial',cat:'backline', kit:'дорогой', name:'Tama Imperial Star',      desc:'Барабанная установка', w:1.80,d:1.60,h:1.30, col:0x3a1a1a, arch:'drums', model:'models/poly/drums.glb', e:'🥁'},
  {id:'fenderhotrod',cat:'backline', kit:'средний', name:'Fender HotRod',           desc:'Гитарный комбоусилитель', w:.60,d:.28,h:.48, col:0x1a1a1a, arch:'amp_guitar', e:'🔊'},
  {id:'swrwarking',  cat:'backline', kit:'средний', name:'SWR Warking PRO + SWR115',desc:'Басовый комбоусилитель', w:.65,d:.40,h:1.00, col:0x1a1a1a, arch:'amp_guitar', e:'🔊'},
  {id:'motif8',      cat:'backline', kit:'дорогой', name:'Yamaha Motif 8',          desc:'Клавишный инструмент 88 клавиш', w:1.40,d:.40,h:.15, col:0x141414, arch:'keys', model:'models/poly/piano.glb', e:'🎹'},
  {id:'keystation61',cat:'backline', kit:'обычный', name:'M-Audio KeyStation 61ES', desc:'Клавишный инструмент MIDI', w:1.00,d:.30,h:.10, col:0x141414, arch:'keys', model:'models/poly/piano.glb', e:'🎹'},
  {id:'stratusa',    cat:'backline', kit:'дорогой', name:'Fender Stratocaster USA', desc:'Гитарный инструмент', w:.40,d:.12,h:1.00, col:0x88401a, arch:'guitar', model:'models/poly/guitar.glb', e:'🎸'},
  {id:'jazzbass',    cat:'backline', kit:'дорогой', name:'Fender Jazz Bass',        desc:'Гитарный инструмент (бас)', w:.40,d:.12,h:1.15, col:0x88401a, arch:'bass', model:'models/poly/bass.glb', e:'🎸'},
  {id:'motifes8',    cat:'backline', kit:'дорогой', name:'Yamaha Motif ES8',        desc:'Клавишный инструмент 88 клавиш', w:1.40,d:.40,h:.15, col:0x141414, arch:'keys', model:'models/poly/piano.glb', e:'🎹'},
  {id:'nordstage3',  cat:'backline', kit:'бизнес',  name:'Nord Stage 3',            desc:'Клавишный инструмент 88 клавиш', w:1.30,d:.35,h:.13, col:0x8a1a1a, arch:'keys', model:'models/poly/piano.glb', e:'🎹'},
  {id:'yamahastage', cat:'backline', kit:'средний', name:'Yamaha Stage Custom',     desc:'Барабанная установка 22/10/12/16', w:1.80,d:1.60,h:1.30, col:0x1a1a2a, arch:'drums', model:'models/poly/drums.glb', e:'🥁'},
  {id:'mapexsaturn', cat:'backline', kit:'дорогой', name:'Mapex Saturn',            desc:'Барабанная установка (Maple-Walnut)', w:1.80,d:1.60,h:1.30, col:0x3a2a1a, arch:'drums', model:'models/poly/drums.glb', e:'🥁'},
  {id:'mapexhw800',  cat:'backline', kit:'обычный', name:'Mapex Hardware 800',      desc:'Комплект стоек под барабаны', w:.50,d:.50,h:1.00, col:0x333333, arch:'box', e:'🧰'},
  {id:'mapexhw1000', cat:'backline', kit:'обычный', name:'Mapex Hardware 1000',     desc:'Комплект стоек под барабаны', w:.50,d:.50,h:1.00, col:0x333333, arch:'box', e:'🧰'},
  {id:'sabianaax',   cat:'backline', kit:'средний', name:'Sabian AAX',              desc:'Барабанные тарелки 14/16/18/20', w:.55,d:.55,h:.60, col:0xb8860b, arch:'box', e:'🥁'},
  {id:'ampegsvt',    cat:'backline', kit:'средний', name:'Ampeg SVT Pro3 USA',      desc:'Усилитель/голова бас', w:.60,d:.40,h:.25, col:0x1a1a1a, arch:'amp', e:'🔌'},
  {id:'ampeg410',    cat:'backline', kit:'средний', name:'Ampeg 4×10',              desc:'Кабинет для бас-гитары', w:.65,d:.40,h:.70, col:0x1a1a1a, arch:'amp_guitar', e:'🔊'},
  {id:'fenderhotrodusa',cat:'backline',kit:'дорогой',name:'Fender HotRod Deluxe USA',desc:'Гитарный комбоусилитель', w:.60,d:.28,h:.48, col:0x1a1a1a, arch:'amp_guitar', e:'🔊'},
  {id:'sennheiserg4',cat:'backline', kit:'средний', name:'Sennheiser G4',           desc:'Беспроводной ушной мониторинг', w:.48,d:.20,h:.09, col:0x111111, arch:'rack', e:'🎧'},
  {id:'psm1000',     cat:'backline', kit:'дорогой', name:'Shure PSM1000',           desc:'Беспроводной ушной мониторинг', w:.48,d:.20,h:.09, col:0x111111, arch:'rack', e:'🎧'},
  {id:'allstands',   cat:'backline', kit:'обычный', name:'Комплект стоек',          desc:'Клавишные/пюпитры/гитарные/микрофонные', w:.60,d:.60,h:1.50, col:0x333333, arch:'box', e:'🧰'},

  // ─────────────── СПЕЦЭФФЕКТЫ ───────────────
  {id:'haze600',   cat:'fx', kit:'средний', name:'Haze 600',                        desc:'Генератор тумана', w:.40,d:.60,h:.32, col:0x333344, arch:'haze', model:'models/poly/smoke.glb', e:'🌫'},
  {id:'confetti2', cat:'fx', kit:'средний', name:'Конфетти-пушка 2 ствола',         desc:'Пневматическая, 2 ствола', w:.40,d:.30,h:.90, col:0x2a1a2a, arch:'confetti', e:'🎊'},

  // ─────────────── ПИТАНИЕ ───────────────
  {id:'powerrack65',cat:'power', kit:'средний', name:'Power Rack 65A',              desc:'Силовой щит 65A', w:.40,d:.30,h:.60, col:0x2a2a2a, arch:'powerbox', e:'⚡'},
  {id:'powerrack32',cat:'power', kit:'обычный', name:'Power Rack 32A',              desc:'Силовой щит 32A (малый)', w:.30,d:.25,h:.45, col:0x2a2a2a, arch:'powerbox', e:'⚡'},
  {id:'alpenbox64', cat:'power', kit:'средний', name:'Power Box 64A AlpenBOX',      desc:'Силовой щит 64 ампер', w:.40,d:.30,h:.60, col:0x2a2a2a, arch:'powerbox', e:'⚡'},
  {id:'alpenbox32', cat:'power', kit:'обычный', name:'Power Box 32A AlpenBOX',      desc:'Силовой щит 32 ампер', w:.35,d:.25,h:.50, col:0x2a2a2a, arch:'powerbox', e:'⚡'},
  {id:'menekens32', cat:'power', kit:'обычный', name:'Power Box 32A Menekens',      desc:'Силовой щит 32 ампер', w:.35,d:.25,h:.50, col:0x2a2a2a, arch:'powerbox', e:'⚡'},
  {id:'kg6',       cat:'power', kit:'обычный', name:'КГ 6×5',                       desc:'Кабель силовой 6мм², 25м', w:.50,d:.50,h:.25, col:0x222222, arch:'cable', e:'🔌'},
  {id:'kg16',      cat:'power', kit:'обычный', name:'КГ 16×5',                      desc:'Кабель силовой 16мм², 25м', w:.55,d:.55,h:.28, col:0x222222, arch:'cable', e:'🔌'},
  {id:'powercomm', cat:'power', kit:'обычный', name:'Силовая коммутация',           desc:'Комплект удлинителей', w:.40,d:.40,h:.30, col:0x222222, arch:'box', e:'🔌'},
  {id:'soundcomm', cat:'power', kit:'обычный', name:'Звуковая коммутация',          desc:'XLR / JACK / SPEAKON', w:.40,d:.40,h:.30, col:0x222222, arch:'box', e:'🔌'},
  {id:'lightcomm', cat:'power', kit:'обычный', name:'Световая коммутация',          desc:'XLR', w:.40,d:.40,h:.30, col:0x222222, arch:'box', e:'🔌'},
  {id:'cablechannel',cat:'power',kit:'обычный',name:'Кабель-канал резиновый',       desc:'2 unit, 1м ширина', w:1.00,d:.25,h:.06, col:0x1a1a1a, arch:'cable', e:'🛤'},
  {id:'batteries', cat:'power', kit:'обычный', name:'Батарейки Duracell',           desc:'Комплект батареек', w:.12,d:.08,h:.06, col:0xc88a1a, arch:'box', e:'🔋'},

  // ─────────────── МЕБЕЛЬ (для рассадки) ───────────────
  {id:'chair',     cat:'furniture', kit:'обычный', name:'Стул',                     desc:'Стандартный стул', w:.48,d:.48,h:.85, col:0x2a1a0f, arch:'chair', model:'models/chair.glb', e:'🪑'},
  {id:'chairbanq', cat:'furniture', kit:'средний', name:'Банкетный стул',           desc:'Мягкий банкетный стул', w:.48,d:.50,h:.92, col:0x3a2a1a, arch:'chair', model:'models/chairCushion.glb', e:'🪑'},
  {id:'tableround',cat:'furniture', kit:'средний', name:'Круглый стол Ø1.5',        desc:'Банкетный круглый стол', w:1.50,d:1.50,h:.75, col:0x3d2b1a, arch:'tableRound', round:true, model:'models/tableCloth.glb', e:'🍽'},
  {id:'table18',   cat:'furniture', kit:'обычный', name:'Прямой стол 1.8м',         desc:'Прямоугольный стол', w:1.80,d:.80,h:.75, col:0x3d2b1a, arch:'table', model:'models/table.glb', e:'🪟'},
  {id:'sofa',      cat:'furniture', kit:'дорогой', name:'Диван 2м',                 desc:'Лаунж-диван', w:2.00,d:.90,h:.85, col:0x2a1a0f, arch:'sofa', model:'models/loungeSofa.glb', e:'🛋'},
  {id:'bartable',  cat:'furniture', kit:'средний', name:'Барная стойка',            desc:'Барный стол', w:.70,d:.70,h:1.10, col:0x1a0f0a, arch:'bar', model:'models/kitchenBar.glb', e:'🥂'},
  {id:'barstool',  cat:'furniture', kit:'средний', name:'Барный стул',              desc:'Высокий барный стул', w:.42,d:.42,h:.78, col:0x2a1a0f, arch:'chair', model:'models/stoolBar.glb', e:'🪑'},
  {id:'cocktail',  cat:'furniture', kit:'средний', name:'Коктейльный стол',         desc:'Высокий коктейльный стол', w:.60,d:.60,h:1.10, col:0x1a0f0a, arch:'bar', model:'models/kitchenBarEnd.glb', e:'🥂'},
];

// Шаблоны мероприятий (используют id выше)
const TPLS = [
  {id:'concert', name:'Концерт', e:'🎵', desc:'Сцена, звук, LED экран, свет', rW:30, rD:20, shape:'rect', items:[
    {id:'gtsage',x:-1,z:-7},{id:'gtsage',x:1,z:-7},{id:'gtsage',x:-1,z:-5},{id:'gtsage',x:1,z:-5},
    {id:'dicollor_in',x:-1,z:-9.5},{id:'dicollor_in',x:0,z:-9.5},{id:'dicollor_in',x:1,z:-9.5},
    {id:'tp400l',x:-6,z:-8.5},{id:'tp400l',x:6,z:-8.5},{id:'tp400',x:-5,z:-8.5},{id:'tp400',x:5,z:-8.5},
    {id:'smartbeam',x:-3,z:-9},{id:'smartbeam',x:3,z:-9},{id:'macaura',x:-1.5,z:-9},{id:'macaura',x:1.5,z:-9},
    {id:'m32live',x:0,z:6},{id:'haze600',x:-4,z:-8},
  ]},
  {id:'wedding', name:'Свадьба', e:'💍', desc:'Сцена, банкетные столы, декор', rW:25, rD:18, shape:'rect', items:[
    {id:'gtsage',x:0,z:-6},{id:'dicollor_in',x:-2,z:-7},{id:'dicollor_in',x:2,z:-7},
    {id:'tableround',x:-5,z:0},{id:'tableround',x:0,z:0},{id:'tableround',x:5,z:0},
    {id:'tableround',x:-5,z:4},{id:'tableround',x:0,z:4},{id:'tableround',x:5,z:4},
    {id:'macaura',x:-3,z:-7},{id:'macaura',x:3,z:-7},{id:'icolor4',x:-6,z:-7},{id:'icolor4',x:6,z:-7},{id:'djstand',x:-8,z:-5},
  ]},
  {id:'conf', name:'Конференция', e:'🎤', desc:'Подиум, экран, рядная рассадка', rW:20, rD:15, shape:'rect', items:[
    {id:'gtsage',x:0,z:-5},{id:'podium',x:-1,z:-6},{id:'ledtv65',x:0,z:-6.5},
    {id:'table18',x:-4,z:0},{id:'table18',x:0,z:0},{id:'table18',x:4,z:0},
    {id:'table18',x:-4,z:2},{id:'table18',x:0,z:2},{id:'table18',x:4,z:2},
    {id:'tassops15',x:-7,z:-6},{id:'tassops15',x:7,z:-6},{id:'m32r',x:7,z:3},
  ]},
  {id:'corp', name:'Корпоратив', e:'🏢', desc:'Сцена, LED экран, банкет, бар', rW:22, rD:16, shape:'rect', items:[
    {id:'gtsage',x:-1,z:-5},{id:'gtsage',x:1,z:-5},{id:'dicollor_in',x:0,z:-6.5},{id:'djstand',x:8,z:-4},
    {id:'tableround',x:-6,z:2},{id:'tableround',x:0,z:2},{id:'tableround',x:6,z:2},
    {id:'tableround',x:-6,z:6},{id:'tableround',x:0,z:6},{id:'tableround',x:6,z:6},
    {id:'bartable',x:-8,z:6},{id:'bartable',x:8,z:6},
    {id:'macaura',x:-4,z:-7},{id:'macaura',x:4,z:-7},{id:'tp400l',x:-7,z:-6},{id:'tp400l',x:7,z:-6},{id:'tp400',x:-6,z:-6},{id:'tp400',x:6,z:-6},
  ]},
];
