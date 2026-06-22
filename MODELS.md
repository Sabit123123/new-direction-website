# 3D-модели планировщика (planner.html)

Подход: **максимум реальных моделей, остальное — процедурная генерация**.
Каждая модель масштабируется под реальные габариты позиции (`w×d×h`) функцией `fitModelToBox`.

## Реальные модели (скачаны)

### `models/` — Kenney «Furniture Kit» (лицензия CC0, атрибуция не требуется)
Источник: https://kenney.nl/assets/furniture-kit · 44 модели в формате GLB (low-poly, единый стиль).
Используются для мебели и реквизита: стулья, столы (в т.ч. круглый и со скатертью), диваны,
барные стулья/стойка, стол DJ/деск, ноутбук, телевизор, монитор, клавиатура, колонки, лампы,
лестницы, растения, ковры и т.п.

### `models/poly/` — Poly Pizza (смешанные лицензии — см. ниже)
Источник: https://poly.pizza . Модели под не-мебельные категории.
**CC-BY требует указания авторства** — ссылки на страницы моделей служат атрибуцией:

| Файл | Лицензия | Источник |
|------|----------|----------|
| poly/mic.glb       | CC-BY | https://poly.pizza/m/bD-LseANe2b |
| poly/micstand.glb  | CC-BY | https://poly.pizza/m/c9fdvmLhrsT |
| poly/guitar.glb    | CC-BY | https://poly.pizza/m/HIyVF2jsHR |
| poly/bass.glb      | CC-BY | https://poly.pizza/m/ByBoHTCdYZ |
| poly/drums.glb     | CC-BY | https://poly.pizza/m/qWU9Q4flfQ |
| poly/piano.glb     | CC-BY | https://poly.pizza/m/5vbJ5vildOq |
| poly/turntable.glb | CC0   | https://poly.pizza/m/TPqvwkyWdV |
| poly/sub.glb       | CC-BY | https://poly.pizza/m/4LdzRBb5YCP |
| poly/spotlight.glb | CC0   | https://poly.pizza/m/Thhuwj9HCg |
| poly/smoke.glb     | CC0   | https://poly.pizza/m/0OKxctiaBw |

## Процедурные модели

Специализированная pro-AV техника (line array, поворотные головы, цифровые пульты, лазеры,
фермы, LED-экраны, силовые щиты и т.д.) не имеет чистых готовых CC0-моделей — для неё
используется детальная процедурная генерация по архетипам (`buildArch*` в planner.html),
построенная точно под габариты позиции.

## Импорт собственных моделей

Планировщик поддерживает импорт форматов **GLB/GLTF/OBJ/DAE/FBX/STL** (кнопка «Загрузить 3D-модель»
в форме новой позиции и в свойствах объекта). Загрузчики — `libs/*.js` (three.js r128, глобальный THREE).
Draco-сжатые glTF не поддерживаются (нет DRACOLoader).
