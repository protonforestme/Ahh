// ============================================================
// FORESTBRAWL: CURSE OF AROS MMORPG DATA ENGINE
// Universal definition catalog for items, skills, crafting, drops & NPCs
// Works in Node.js (server.js) and Browser (play.html)
// ============================================================

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MmorpgData = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ── RARITIES & COLORS ──
  const RARITIES = {
    common:    { name: 'Yaygın',    color: '#9ca3af', glow: 'rgba(156,163,175,0.3)', border: '#6b7280' },
    uncommon:  { name: 'Sıradışı',  color: '#22c55e', glow: 'rgba(34,197,94,0.4)',   border: '#16a34a' },
    rare:      { name: 'Nadir',     color: '#3b82f6', glow: 'rgba(59,130,246,0.45)', border: '#2563eb' },
    epic:      { name: 'Epik',      color: '#a855f7', glow: 'rgba(168,85,247,0.5)',  border: '#9333ea' },
    legendary: { name: 'Efsanevi',  color: '#f59e0b', glow: 'rgba(245,158,11,0.6)',  border: '#d97706' },
    mythic:    { name: 'Mitik',     color: '#ef4444', glow: 'rgba(239,68,68,0.7)',   border: '#dc2626' }
  };

  // ── ITEM CATALOG ──
  const ITEMS = {
    // === TIER 1: BRONZE (BAKIR / SEVİYE 1) ===
    bronze_sword: {
      id: 'bronze_sword', name: 'Bakır Kılıç', type: 'equipment', slot: 'weapon',
      rarity: 'common', reqLvl: 1, atk: 14, def: 0, hp: 0, spd: 0,
      price: 25, icon: 'sword', iconColor: '#c87d46', desc: 'Acemi savaşçılar için dövülmüş sağlam bir bakır kılıç.'
    },
    bronze_shield: {
      id: 'bronze_shield', name: 'Bakır Kalkan', type: 'equipment', slot: 'shield',
      rarity: 'common', reqLvl: 1, atk: 0, def: 8, hp: 30, spd: 0,
      price: 20, icon: 'shield', iconColor: '#c87d46', desc: 'Gelen darbeleri karşılayan dayanıklı kalkan.'
    },
    bronze_helmet: {
      id: 'bronze_helmet', name: 'Bakır Miğfer', type: 'equipment', slot: 'helmet',
      rarity: 'common', reqLvl: 1, atk: 0, def: 6, hp: 15, spd: 0,
      price: 18, icon: 'helmet', iconColor: '#c87d46', desc: 'Başı canavar saldırılarından korur.'
    },
    bronze_chest: {
      id: 'bronze_chest', name: 'Bakır Zırh', type: 'equipment', slot: 'chest',
      rarity: 'common', reqLvl: 1, atk: 0, def: 14, hp: 50, spd: 0,
      price: 35, icon: 'chest', iconColor: '#c87d46', desc: 'Göğüs kafesini koruyan ağır bakır levha.'
    },
    bronze_legs: {
      id: 'bronze_legs', name: 'Bakır Pantolon', type: 'equipment', slot: 'legs',
      rarity: 'common', reqLvl: 1, atk: 0, def: 10, hp: 25, spd: 0,
      price: 25, icon: 'legs', iconColor: '#c87d46', desc: 'Bacakları koruyan bronz plaka.'
    },
    bronze_boots: {
      id: 'bronze_boots', name: 'Bakır Çizme', type: 'equipment', slot: 'boots',
      rarity: 'common', reqLvl: 1, atk: 0, def: 5, hp: 10, spd: 0.04,
      price: 20, icon: 'boots', iconColor: '#c87d46', desc: 'Adımları sağlamlaştıran ve hafif hız veren çizme.'
    },
    bronze_pickaxe: {
      id: 'bronze_pickaxe', name: 'Bakır Kazma', type: 'equipment', slot: 'pickaxe',
      rarity: 'common', reqLvl: 1, minePower: 1,
      price: 30, icon: 'pickaxe', iconColor: '#c87d46', desc: 'Bakır ve taş damarlarını verimli kazmak için alet.'
    },
    bronze_axe: {
      id: 'bronze_axe', name: 'Bakır Balta', type: 'equipment', slot: 'axe',
      rarity: 'common', reqLvl: 1, woodPower: 1,
      price: 30, icon: 'axe', iconColor: '#c87d46', desc: 'Meşe ağaçlarını hızlıca devirmek için oduncu baltası.'
    },

    // === TIER 2: IRON (DEMİR / SEVİYE 12) ===
    iron_sword: {
      id: 'iron_sword', name: 'Demir Kılıç', type: 'equipment', slot: 'weapon',
      rarity: 'uncommon', reqLvl: 12, atk: 32, def: 0, hp: 0, spd: 0,
      price: 90, icon: 'sword', iconColor: '#cbd5e1', desc: 'Keskinliği bilenmiş soğuk dövme demir kılıç.'
    },
    iron_shield: {
      id: 'iron_shield', name: 'Demir Kalkan', type: 'equipment', slot: 'shield',
      rarity: 'uncommon', reqLvl: 12, atk: 0, def: 18, hp: 70, spd: 0,
      price: 80, icon: 'shield', iconColor: '#cbd5e1', desc: 'Sertleştirilmiş demir plaka kalkan.'
    },
    iron_helmet: {
      id: 'iron_helmet', name: 'Demir Miğfer', type: 'equipment', slot: 'helmet',
      rarity: 'uncommon', reqLvl: 12, atk: 0, def: 14, hp: 35, spd: 0,
      price: 70, icon: 'helmet', iconColor: '#cbd5e1', desc: 'Vizörlü şövalye demir miğferi.'
    },
    iron_chest: {
      id: 'iron_chest', name: 'Demir Zırh', type: 'equipment', slot: 'chest',
      rarity: 'uncommon', reqLvl: 12, atk: 0, def: 32, hp: 120, spd: 0,
      price: 130, icon: 'chest', iconColor: '#cbd5e1', desc: 'Zırh ustası tarafından dövülen demir zırh.'
    },
    iron_legs: {
      id: 'iron_legs', name: 'Demir Pantolon', type: 'equipment', slot: 'legs',
      rarity: 'uncommon', reqLvl: 12, atk: 0, def: 22, hp: 60, spd: 0,
      price: 95, icon: 'legs', iconColor: '#cbd5e1', desc: 'Esnek eklemli demir dizlik ve bacak zırhı.'
    },
    iron_boots: {
      id: 'iron_boots', name: 'Demir Çizme', type: 'equipment', slot: 'boots',
      rarity: 'uncommon', reqLvl: 12, atk: 0, def: 12, hp: 30, spd: 0.07,
      price: 75, icon: 'boots', iconColor: '#cbd5e1', desc: 'Demir takviyeli savaş botları.'
    },
    iron_pickaxe: {
      id: 'iron_pickaxe', name: 'Demir Kazma', type: 'equipment', slot: 'pickaxe',
      rarity: 'uncommon', reqLvl: 10, minePower: 2,
      price: 110, icon: 'pickaxe', iconColor: '#cbd5e1', desc: 'Demir ve altın cevherlerini kazabilir.'
    },
    iron_axe: {
      id: 'iron_axe', name: 'Demir Balta', type: 'equipment', slot: 'axe',
      rarity: 'uncommon', reqLvl: 10, woodPower: 2,
      price: 110, icon: 'axe', iconColor: '#cbd5e1', desc: 'Söğüt ağaçlarını kesmek için ideal balta.'
    },

    // === TIER 3: STEEL & GOLD (ÇELİK & ALTIN / SEVİYE 25) ===
    steel_sword: {
      id: 'steel_sword', name: 'Çelik Pala', type: 'equipment', slot: 'weapon',
      rarity: 'rare', reqLvl: 25, atk: 60, def: 0, hp: 0, spd: 0,
      price: 320, icon: 'sword', iconColor: '#facc15', desc: 'Altın işlemeli, yüksek hasar veren dövme çelik pala.'
    },
    steel_shield: {
      id: 'steel_shield', name: 'Altın Çelik Kalkan', type: 'equipment', slot: 'shield',
      rarity: 'rare', reqLvl: 25, atk: 0, def: 35, hp: 160, spd: 0,
      price: 280, icon: 'shield', iconColor: '#facc15', desc: 'Büyük hasarları engelleyen ihtişamlı kalkan.'
    },
    steel_helmet: {
      id: 'steel_helmet', name: 'Çelik Taç Miğfer', type: 'equipment', slot: 'helmet',
      rarity: 'rare', reqLvl: 25, atk: 0, def: 28, hp: 80, spd: 0,
      price: 250, icon: 'helmet', iconColor: '#facc15', desc: 'Kraliyet muhafızlarına layık sağlam başlık.'
    },
    steel_chest: {
      id: 'steel_chest', name: 'Altın Çelik Zırh', type: 'equipment', slot: 'chest',
      rarity: 'rare', reqLvl: 25, atk: 0, def: 65, hp: 260, spd: 0,
      price: 450, icon: 'chest', iconColor: '#facc15', desc: 'Aşırı dayanıklı altın yaldızlı çelik plaka.'
    },
    steel_legs: {
      id: 'steel_legs', name: 'Çelik Pantolon', type: 'equipment', slot: 'legs',
      rarity: 'rare', reqLvl: 25, atk: 0, def: 44, hp: 120, spd: 0,
      price: 330, icon: 'legs', iconColor: '#facc15', desc: 'Göz alıcı parıltısıyla düşmanı caydıran çelik zırh.'
    },
    steel_boots: {
      id: 'steel_boots', name: 'Çelik Sabaton', type: 'equipment', slot: 'boots',
      rarity: 'rare', reqLvl: 25, atk: 0, def: 24, hp: 60, spd: 0.11,
      price: 260, icon: 'boots', iconColor: '#facc15', desc: 'Hızlı hamle yapmayı sağlayan hafif çelik ayakkabı.'
    },
    steel_pickaxe: {
      id: 'steel_pickaxe', name: 'Çelik Kazma', type: 'equipment', slot: 'pickaxe',
      rarity: 'rare', reqLvl: 22, minePower: 3,
      price: 360, icon: 'pickaxe', iconColor: '#facc15', desc: 'Sert altın ve kobalt katmanlarını deler.'
    },
    steel_axe: {
      id: 'steel_axe', name: 'Çelik Balta', type: 'equipment', slot: 'axe',
      rarity: 'rare', reqLvl: 22, woodPower: 3,
      price: 360, icon: 'axe', iconColor: '#facc15', desc: 'Porsuk ağaçlarını hızla biçer.'
    },

    // === TIER 4: COBALT (BUZUL KOBALT / SEVİYE 42) ===
    cobalt_sword: {
      id: 'cobalt_sword', name: 'Kobalt Gladyus', type: 'equipment', slot: 'weapon',
      rarity: 'epic', reqLvl: 42, atk: 105, def: 5, hp: 0, spd: 0.03,
      price: 1100, icon: 'sword', iconColor: '#60a5fa', desc: 'Buzul enerjisiyle titreşen nadide kobalt kılıç.'
    },
    cobalt_shield: {
      id: 'cobalt_shield', name: 'Buzul Kobalt Siper', type: 'equipment', slot: 'shield',
      rarity: 'epic', reqLvl: 42, atk: 0, def: 62, hp: 350, spd: 0,
      price: 950, icon: 'shield', iconColor: '#60a5fa', desc: 'Büyülü buz kristaliyle güçlendirilmiş ağır kalkan.'
    },
    cobalt_helmet: {
      id: 'cobalt_helmet', name: 'Kobalt Miğfer', type: 'equipment', slot: 'helmet',
      rarity: 'epic', reqLvl: 42, atk: 0, def: 48, hp: 170, spd: 0,
      price: 880, icon: 'helmet', iconColor: '#60a5fa', desc: 'Büyücü ve canavarlara karşı mutlak baş koruması.'
    },
    cobalt_chest: {
      id: 'cobalt_chest', name: 'Kobalt Zırh', type: 'equipment', slot: 'chest',
      rarity: 'epic', reqLvl: 42, atk: 0, def: 115, hp: 520, spd: 0,
      price: 1500, icon: 'chest', iconColor: '#60a5fa', desc: 'Derin buzul mağaralarından çıkarılan kobalt plaka.'
    },
    cobalt_legs: {
      id: 'cobalt_legs', name: 'Kobalt Pantolon', type: 'equipment', slot: 'legs',
      rarity: 'epic', reqLvl: 42, atk: 0, def: 78, hp: 260, spd: 0,
      price: 1150, icon: 'legs', iconColor: '#60a5fa', desc: 'Hareketi kısıtlamayan büyüleyici kobalt dizlikler.'
    },
    cobalt_boots: {
      id: 'cobalt_boots', name: 'Buzgezer Çizme', type: 'equipment', slot: 'boots',
      rarity: 'epic', reqLvl: 42, atk: 0, def: 40, hp: 120, spd: 0.16,
      price: 900, icon: 'boots', iconColor: '#60a5fa', desc: 'Buzda kaymayan, olağanüstü çeviklik veren botlar.'
    },
    cobalt_pickaxe: {
      id: 'cobalt_pickaxe', name: 'Kobalt Kazma', type: 'equipment', slot: 'pickaxe',
      rarity: 'epic', reqLvl: 38, minePower: 4,
      price: 1200, icon: 'pickaxe', iconColor: '#60a5fa', desc: 'Kan taşlarını ve zindan minerallerini parçalar.'
    },
    cobalt_axe: {
      id: 'cobalt_axe', name: 'Kobalt Balta', type: 'equipment', slot: 'axe',
      rarity: 'epic', reqLvl: 38, woodPower: 4,
      price: 1200, icon: 'axe', iconColor: '#60a5fa', desc: 'Kadim büyülü ağaç gövdelerini kolayca keser.'
    },

    // === TIER 5: BLOODSTONE (KAN TAŞI / EFSANEVİ / SEVİYE 60) ===
    blood_slayer: {
      id: 'blood_slayer', name: 'Kan Katili (Blood Slayer)', type: 'equipment', slot: 'weapon',
      rarity: 'legendary', reqLvl: 60, atk: 175, def: 10, hp: 100, spd: 0.05, lifesteal: 0.07,
      price: 4500, icon: 'sword', iconColor: '#ef4444', desc: 'Vurduğu düşmanın kanını emerek sahibini iyileştiren efsanevi kılıç.'
    },
    blood_aegis: {
      id: 'blood_aegis', name: 'Kan Kalkanı (Blood Aegis)', type: 'equipment', slot: 'shield',
      rarity: 'legendary', reqLvl: 60, atk: 15, def: 105, hp: 700, spd: 0,
      price: 3900, icon: 'shield', iconColor: '#ef4444', desc: 'En ölümcül ejderha ve iblis darbelerini yansıtan kalkan.'
    },
    blood_crown: {
      id: 'blood_crown', name: 'Kan Tacı (Blood Crown)', type: 'equipment', slot: 'helmet',
      rarity: 'legendary', reqLvl: 60, atk: 20, def: 82, hp: 320, spd: 0,
      price: 3600, icon: 'helmet', iconColor: '#ef4444', desc: 'Savaş meydanının mutlak efendisine ait kan tacı.'
    },
    blood_cuirass: {
      id: 'blood_cuirass', name: 'Kan Zırhı (Blood Cuirass)', type: 'equipment', slot: 'chest',
      rarity: 'legendary', reqLvl: 60, atk: 25, def: 185, hp: 1100, spd: 0,
      price: 5800, icon: 'chest', iconColor: '#ef4444', desc: 'Giyene iblislerin dayanıklılığını ve can havuzunu bahşeder.'
    },
    blood_greaves: {
      id: 'blood_greaves', name: 'Kan Zırh Pantolonu', type: 'equipment', slot: 'legs',
      rarity: 'legendary', reqLvl: 60, atk: 15, def: 125, hp: 500, spd: 0,
      price: 4200, icon: 'legs', iconColor: '#ef4444', desc: 'Ateş ve lav zindanlarından etkilenmeyen koruma.'
    },
    blood_striders: {
      id: 'blood_striders', name: 'Kan Koşucusu Çizme', type: 'equipment', slot: 'boots',
      rarity: 'legendary', reqLvl: 60, atk: 10, def: 70, hp: 250, spd: 0.22,
      price: 3800, icon: 'boots', iconColor: '#ef4444', desc: 'Sahibine rüzgar hızında hücum kabiliyeti kazandırır.'
    },
    blood_pickaxe: {
      id: 'blood_pickaxe', name: 'Kan Kazması', type: 'equipment', slot: 'pickaxe',
      rarity: 'legendary', reqLvl: 55, minePower: 5,
      price: 4500, icon: 'pickaxe', iconColor: '#ef4444', desc: 'Tüm mineralleri tek vuruşta parçalayan efsanevi alet.'
    },
    blood_axe: {
      id: 'blood_axe', name: 'Kan Baltası', type: 'equipment', slot: 'axe',
      rarity: 'legendary', reqLvl: 55, woodPower: 5,
      price: 4500, icon: 'axe', iconColor: '#ef4444', desc: 'Ormanları kökünden söken mutlak oduncu baltası.'
    },

    // === ACCESSORIES (YÜZÜK & KOLYELER) ===
    ring_strength: {
      id: 'ring_strength', name: 'Kuvvet Yüzüğü', type: 'equipment', slot: 'ring',
      rarity: 'uncommon', reqLvl: 5, atk: 20, def: 0, hp: 0, spd: 0,
      price: 250, icon: 'ring', iconColor: '#f97316', desc: 'Pazılara ekstra güç pompalayan bronz yüzük.'
    },
    ring_vitality: {
      id: 'ring_vitality', name: 'Yaşam Yüzüğü', type: 'equipment', slot: 'ring',
      rarity: 'rare', reqLvl: 15, atk: 0, def: 8, hp: 240, spd: 0,
      price: 450, icon: 'ring', iconColor: '#22c55e', desc: 'Kalp atışını ve azami canı ciddi ölçüde yükseltir.'
    },
    ring_swiftness: {
      id: 'ring_swiftness', name: 'Çeviklik Yüzüğü', type: 'equipment', slot: 'ring',
      rarity: 'rare', reqLvl: 20, atk: 8, def: 0, hp: 0, spd: 0.15,
      price: 550, icon: 'ring', iconColor: '#06b6d4', desc: 'Rüzgarın hafifliğini parmaklara taşır.'
    },
    ring_berserk: {
      id: 'ring_berserk', name: 'Vahşet Yüzüğü (Berserk)', type: 'equipment', slot: 'ring',
      rarity: 'epic', reqLvl: 35, atk: 55, def: -12, hp: 100, spd: 0.08,
      price: 1400, icon: 'ring', iconColor: '#dc2626', desc: 'Savunmayı zayıflatarak inanılmaz bir saldırı gücü açığa çıkarır.'
    },
    amulet_power: {
      id: 'amulet_power', name: 'Kudret Kolyesi', type: 'equipment', slot: 'amulet',
      rarity: 'rare', reqLvl: 18, atk: 35, def: 20, hp: 140, spd: 0.04,
      price: 750, icon: 'amulet', iconColor: '#a855f7', desc: 'Mavi safir taşlı kadim koruma kolyesi.'
    },
    amulet_glory: {
      id: 'amulet_glory', name: 'Zafer Madalyonu (Glory)', type: 'equipment', slot: 'amulet',
      rarity: 'legendary', reqLvl: 50, atk: 65, def: 45, hp: 420, spd: 0.10,
      price: 3200, icon: 'amulet', iconColor: '#eab308', desc: 'Kahramanlara layık, tüm statları güçlendiren eşsiz madalyon.'
    },

    // === UNIQUE DUNGEON & BOSS EQUIPMENT ===
    treant_crown: {
      id: 'treant_crown', name: 'Kadim Muhafız Tacı', type: 'equipment', slot: 'helmet',
      rarity: 'rare', reqLvl: 16, atk: 12, def: 24, hp: 120, spd: 0.02,
      price: 650, icon: 'helmet', iconColor: '#22c55e', desc: 'Ulu Ağaç Muhafızı yapraklarından örülmüş canlı taç.'
    },
    nature_ring: {
      id: 'nature_ring', name: 'Doğanın Yüzüğü', type: 'equipment', slot: 'ring',
      rarity: 'rare', reqLvl: 15, atk: 10, def: 12, hp: 160, lifesteal: 0.04,
      price: 580, icon: 'ring', iconColor: '#16a34a', desc: 'Ormanın yaşam enerjisini kuşanana aktarır.'
    },
    golem_shield: {
      id: 'golem_shield', name: 'Kaya Golemi Kalkanı', type: 'equipment', slot: 'shield',
      rarity: 'epic', reqLvl: 30, atk: 0, def: 42, hp: 260, spd: -0.02,
      price: 1350, icon: 'shield', iconColor: '#78716c', desc: 'Granit taşından yontulmuş devasa sarsılmaz kalkan.'
    },
    glacier_blade: {
      id: 'glacier_blade', name: 'Buzul Kılıcı (Frostfang)', type: 'equipment', slot: 'weapon',
      rarity: 'epic', reqLvl: 40, atk: 68, def: 10, hp: 120, spd: 0.06,
      price: 2100, icon: 'sword', iconColor: '#38bdf8', desc: 'Düşmanları dondurucu soğukla kesen buz ejderi kılıcı.'
    },
    ice_ring: {
      id: 'ice_ring', name: 'Donmuş Halka', type: 'equipment', slot: 'ring',
      rarity: 'epic', reqLvl: 42, atk: 25, def: 20, hp: 240, spd: 0.08,
      price: 1600, icon: 'ring', iconColor: '#67e8f9', desc: 'Buzul Zirvesi kristallerinden dövülmüş efsunlu halka.'
    },
    bloodstone_cleaver: {
      id: 'bloodstone_cleaver', name: 'Kan Taşı Satırı', type: 'equipment', slot: 'weapon',
      rarity: 'legendary', reqLvl: 65, atk: 155, def: 20, hp: 350, lifesteal: 0.12,
      price: 6500, icon: 'sword', iconColor: '#dc2626', desc: 'Hiçlik Hükümdarı Malgok\'un kan damlayan dev satırı.'
    },
    abyssal_wings: {
      id: 'abyssal_wings', name: 'Hiçlik Kanatları', type: 'equipment', slot: 'amulet',
      rarity: 'legendary', reqLvl: 60, atk: 75, def: 55, hp: 500, spd: 0.18, lifesteal: 0.06,
      price: 7200, icon: 'amulet', iconColor: '#a855f7', desc: 'Karanlık zindan alevleriyle parıldayan efsanevi kanat kalıntısı.'
    },

    // === UNIQUE DUNGEON MATERIALS ===
    elder_bark: {
      id: 'elder_bark', name: 'Kadim Ağaç Kabuğu', type: 'material', maxStack: 999,
      rarity: 'rare', price: 45, icon: 'log', iconColor: '#15803d', desc: 'Kadim Ağaç Mahzeninden toplanan sert kabuk.'
    },
    granite_core: {
      id: 'granite_core', name: 'Granit Çekirdeği', type: 'material', maxStack: 999,
      rarity: 'rare', price: 85, icon: 'ore', iconColor: '#78716c', desc: 'Kaya Golemlerinin kalbinde parlayan saf mineral.'
    },
    frost_shard: {
      id: 'frost_shard', name: 'Buz Ejderi Kristali', type: 'material', maxStack: 999,
      rarity: 'epic', price: 180, icon: 'ore', iconColor: '#38bdf8', desc: 'Erimyen buzul zirvesi ejder kristali.'
    },
    abyssal_core: {
      id: 'abyssal_core', name: 'Hiçlik Çekirdeği', type: 'material', maxStack: 999,
      rarity: 'legendary', price: 500, icon: 'ore', iconColor: '#9333ea', desc: 'Malgok\'un zindan derinliklerinden çıkan saf karanlık çekirdek.'
    },

    // === CONSUMABLES (İKSİRLER & YİYECEK) ===
    hp_potion_s: {
      id: 'hp_potion_s', name: 'Küçük Can İksiri', type: 'consumable',
      healHp: 120, maxStack: 99, rarity: 'common',
      price: 15, icon: 'potion', iconColor: '#ef4444', desc: 'Anında 120 Can yeniler.'
    },
    hp_potion_m: {
      id: 'hp_potion_m', name: 'Orta Can İksiri', type: 'consumable',
      healHp: 350, maxStack: 99, rarity: 'uncommon',
      price: 50, icon: 'potion', iconColor: '#dc2626', desc: 'Anında 350 Can yeniler.'
    },
    hp_potion_l: {
      id: 'hp_potion_l', name: 'Büyük Can İksiri', type: 'consumable',
      healHp: 850, maxStack: 99, rarity: 'rare',
      price: 160, icon: 'potion', iconColor: '#991b1b', desc: 'Anında 850 Can yeniler.'
    },
    speed_elixir: {
      id: 'speed_elixir', name: 'Hız İksiri', type: 'consumable',
      buffSpeed: 0.25, buffDuration: 35, maxStack: 20, rarity: 'rare',
      price: 90, icon: 'potion', iconColor: '#38bdf8', desc: '35 saniye boyunca hareket hızını %25 artırır.'
    },

    // === GATHERED ORES & LOGS (HAMMADDELER) ===
    copper_ore: {
      id: 'copper_ore', name: 'Bakır Cevheri', type: 'material', maxStack: 999,
      rarity: 'common', price: 4, icon: 'ore', iconColor: '#c87d46', desc: 'Bakır damarlarından kazılan ham cevher.'
    },
    iron_ore: {
      id: 'iron_ore', name: 'Demir Cevheri', type: 'material', maxStack: 999,
      rarity: 'uncommon', price: 12, icon: 'ore', iconColor: '#94a3b8', desc: 'Demir külçe eritmek için kullanılan mineral.'
    },
    gold_ore: {
      id: 'gold_ore', name: 'Altın Cevheri', type: 'material', maxStack: 999,
      rarity: 'rare', price: 30, icon: 'ore', iconColor: '#facc15', desc: 'Parlak altın madeni.'
    },
    cobalt_ore: {
      id: 'cobalt_ore', name: 'Kobalt Cevheri', type: 'material', maxStack: 999,
      rarity: 'epic', price: 75, icon: 'ore', iconColor: '#60a5fa', desc: 'Buzul kayaların derinliğindeki nadide kobalt.'
    },
    blood_shard: {
      id: 'blood_shard', name: 'Kan Parçası (Blood Shard)', type: 'material', maxStack: 999,
      rarity: 'legendary', price: 200, icon: 'ore', iconColor: '#ef4444', desc: 'Karanlık zindanlardaki saf lanetli kan kristali.'
    },

    copper_bar: {
      id: 'copper_bar', name: 'Bakır Külçe', type: 'material', maxStack: 999,
      rarity: 'common', price: 15, icon: 'bar', iconColor: '#c87d46', desc: 'Demirci ocağında eritilmiş saf bakır külçe.'
    },
    iron_bar: {
      id: 'iron_bar', name: 'Demir Külçe', type: 'material', maxStack: 999,
      rarity: 'uncommon', price: 40, icon: 'bar', iconColor: '#cbd5e1', desc: 'Zırh ve kılıç yapımında kullanılan kaliteli demir.'
    },
    gold_bar: {
      id: 'gold_bar', name: 'Altın Külçe', type: 'material', maxStack: 999,
      rarity: 'rare', price: 100, icon: 'bar', iconColor: '#facc15', desc: 'Ağır, değerli saf altın külçe.'
    },
    cobalt_bar: {
      id: 'cobalt_bar', name: 'Kobalt Külçe', type: 'material', maxStack: 999,
      rarity: 'epic', price: 260, icon: 'bar', iconColor: '#3b82f6', desc: 'Büyülü kobalt zırh ve silahların ana maddesi.'
    },
    blood_bar: {
      id: 'blood_bar', name: 'Kan Külçesi', type: 'material', maxStack: 999,
      rarity: 'legendary', price: 700, icon: 'bar', iconColor: '#b91c1c', desc: 'Demirci örsünde efsunlanan dövme kan külçesi.'
    },

    oak_log: {
      id: 'oak_log', name: 'Meşe Odunu', type: 'material', maxStack: 999,
      rarity: 'common', price: 4, icon: 'log', iconColor: '#854d0e', desc: 'Fısıldayan Koru meşelerinden toplanan kereste.'
    },
    willow_log: {
      id: 'willow_log', name: 'Söğüt Odunu', type: 'material', maxStack: 999,
      rarity: 'uncommon', price: 12, icon: 'log', iconColor: '#15803d', desc: 'Göl kenarlarındaki esnek söğüt kütükleri.'
    },
    maple_log: {
      id: 'maple_log', name: 'Porsuk Odunu', type: 'material', maxStack: 999,
      rarity: 'rare', price: 30, icon: 'log', iconColor: '#ea580c', desc: 'Buzul sınırında yetişen sert gövdeli ağaç.'
    },
    magic_log: {
      id: 'magic_log', name: 'Büyülü Kütük', type: 'material', maxStack: 999,
      rarity: 'epic', price: 80, icon: 'log', iconColor: '#a855f7', desc: 'Karanlık güçlerle parıldayan kadim ağaç kütüğü.'
    },

    // === MONSTER DROPS (CANAVAR GANİMETLERİ) ===
    slime_gel: {
      id: 'slime_gel', name: 'Balçık Jeli', type: 'material', maxStack: 999,
      rarity: 'common', price: 8, icon: 'drop', iconColor: '#22c55e', desc: 'Yapışkan yeşil balçık kalıntısı.'
    },
    bat_wing: {
      id: 'bat_wing', name: 'Yarasa Kanadı', type: 'material', maxStack: 999,
      rarity: 'common', price: 14, icon: 'drop', iconColor: '#475569', desc: 'Mağara yarasasının derimsi kanadı.'
    },
    golem_core: {
      id: 'golem_core', name: 'Taş Devi Çekirdeği', type: 'material', maxStack: 999,
      rarity: 'uncommon', price: 45, icon: 'drop', iconColor: '#78716c', desc: 'Taş devlerine can veren parıldayan kristal.'
    },
    frost_fang: {
      id: 'frost_fang', name: 'Buzul Kurdu Dişi', type: 'material', maxStack: 999,
      rarity: 'rare', price: 90, icon: 'drop', iconColor: '#38bdf8', desc: 'Keskin ve buz gibi soğuk kurt azı dişi.'
    },
    demon_horn: {
      id: 'demon_horn', name: 'İblis Boynuzu', type: 'material', maxStack: 999,
      rarity: 'epic', price: 220, icon: 'drop', iconColor: '#991b1b', desc: 'Lav zindanındaki iblislerden sökülmüş sivri boynuz.'
    },
    boss_relic: {
      id: 'boss_relic', name: 'Kadim Boss Kalıntısı', type: 'material', maxStack: 99,
      rarity: 'legendary', price: 1200, icon: 'relic', iconColor: '#f59e0b', desc: 'Dünya Bossundan düşen benzersiz kadim güç taşı.'
    }
  };

  // ── CRAFTING & SMELTING RECIPES ──
  const SMELTING_RECIPES = [
    { id: 'smelt_copper', reqSkill: 'smith', reqLvl: 1, xp: 18, inputs: [{ id: 'copper_ore', count: 3 }], output: { id: 'copper_bar', count: 1 } },
    { id: 'smelt_iron',   reqSkill: 'smith', reqLvl: 10, xp: 48, inputs: [{ id: 'iron_ore', count: 3 }],   output: { id: 'iron_bar', count: 1 } },
    { id: 'smelt_gold',   reqSkill: 'smith', reqLvl: 22, xp: 95, inputs: [{ id: 'gold_ore', count: 3 }],   output: { id: 'gold_bar', count: 1 } },
    { id: 'smelt_cobalt', reqSkill: 'smith', reqLvl: 38, xp: 190, inputs: [{ id: 'cobalt_ore', count: 3 }], output: { id: 'cobalt_bar', count: 1 } },
    { id: 'smelt_blood',  reqSkill: 'smith', reqLvl: 55, xp: 420, inputs: [{ id: 'blood_shard', count: 3 }], output: { id: 'blood_bar', count: 1 } }
  ];

  const FORGING_RECIPES = [
    // Bronze Tier
    { id: 'forge_bronze_sword',   reqSkill: 'smith', reqLvl: 1,  xp: 35,  inputs: [{ id: 'copper_bar', count: 3 }], output: { id: 'bronze_sword', count: 1 } },
    { id: 'forge_bronze_shield',  reqSkill: 'smith', reqLvl: 2,  xp: 45,  inputs: [{ id: 'copper_bar', count: 4 }], output: { id: 'bronze_shield', count: 1 } },
    { id: 'forge_bronze_helmet',  reqSkill: 'smith', reqLvl: 2,  xp: 30,  inputs: [{ id: 'copper_bar', count: 3 }], output: { id: 'bronze_helmet', count: 1 } },
    { id: 'forge_bronze_chest',   reqSkill: 'smith', reqLvl: 3,  xp: 60,  inputs: [{ id: 'copper_bar', count: 6 }], output: { id: 'bronze_chest', count: 1 } },
    { id: 'forge_bronze_legs',    reqSkill: 'smith', reqLvl: 3,  xp: 50,  inputs: [{ id: 'copper_bar', count: 4 }], output: { id: 'bronze_legs', count: 1 } },
    { id: 'forge_bronze_boots',   reqSkill: 'smith', reqLvl: 2,  xp: 35,  inputs: [{ id: 'copper_bar', count: 3 }], output: { id: 'bronze_boots', count: 1 } },
    { id: 'forge_bronze_pickaxe', reqSkill: 'smith', reqLvl: 1,  xp: 30,  inputs: [{ id: 'copper_bar', count: 3 }, { id: 'oak_log', count: 2 }], output: { id: 'bronze_pickaxe', count: 1 } },
    { id: 'forge_bronze_axe',     reqSkill: 'smith', reqLvl: 1,  xp: 30,  inputs: [{ id: 'copper_bar', count: 3 }, { id: 'oak_log', count: 2 }], output: { id: 'bronze_axe', count: 1 } },

    // Iron Tier
    { id: 'forge_iron_sword',     reqSkill: 'smith', reqLvl: 12, xp: 95,  inputs: [{ id: 'iron_bar', count: 4 }], output: { id: 'iron_sword', count: 1 } },
    { id: 'forge_iron_shield',    reqSkill: 'smith', reqLvl: 13, xp: 110, inputs: [{ id: 'iron_bar', count: 5 }], output: { id: 'iron_shield', count: 1 } },
    { id: 'forge_iron_helmet',    reqSkill: 'smith', reqLvl: 13, xp: 85,  inputs: [{ id: 'iron_bar', count: 4 }], output: { id: 'iron_helmet', count: 1 } },
    { id: 'forge_iron_chest',     reqSkill: 'smith', reqLvl: 15, xp: 160, inputs: [{ id: 'iron_bar', count: 8 }], output: { id: 'iron_chest', count: 1 } },
    { id: 'forge_iron_legs',      reqSkill: 'smith', reqLvl: 14, xp: 125, inputs: [{ id: 'iron_bar', count: 6 }], output: { id: 'iron_legs', count: 1 } },
    { id: 'forge_iron_boots',     reqSkill: 'smith', reqLvl: 12, xp: 85,  inputs: [{ id: 'iron_bar', count: 4 }], output: { id: 'iron_boots', count: 1 } },
    { id: 'forge_iron_pickaxe',   reqSkill: 'smith', reqLvl: 10, xp: 80,  inputs: [{ id: 'iron_bar', count: 4 }, { id: 'willow_log', count: 3 }], output: { id: 'iron_pickaxe', count: 1 } },
    { id: 'forge_iron_axe',       reqSkill: 'smith', reqLvl: 10, xp: 80,  inputs: [{ id: 'iron_bar', count: 4 }, { id: 'willow_log', count: 3 }], output: { id: 'iron_axe', count: 1 } },

    // Steel & Gold Tier
    { id: 'forge_steel_sword',    reqSkill: 'smith', reqLvl: 25, xp: 240, inputs: [{ id: 'gold_bar', count: 5 }, { id: 'iron_bar', count: 3 }], output: { id: 'steel_sword', count: 1 } },
    { id: 'forge_steel_shield',   reqSkill: 'smith', reqLvl: 26, xp: 280, inputs: [{ id: 'gold_bar', count: 6 }, { id: 'iron_bar', count: 4 }], output: { id: 'steel_shield', count: 1 } },
    { id: 'forge_steel_helmet',   reqSkill: 'smith', reqLvl: 26, xp: 210, inputs: [{ id: 'gold_bar', count: 5 }, { id: 'iron_bar', count: 2 }], output: { id: 'steel_helmet', count: 1 } },
    { id: 'forge_steel_chest',    reqSkill: 'smith', reqLvl: 28, xp: 400, inputs: [{ id: 'gold_bar', count: 9 }, { id: 'iron_bar', count: 6 }], output: { id: 'steel_chest', count: 1 } },
    { id: 'forge_steel_legs',     reqSkill: 'smith', reqLvl: 27, xp: 320, inputs: [{ id: 'gold_bar', count: 7 }, { id: 'iron_bar', count: 4 }], output: { id: 'steel_legs', count: 1 } },
    { id: 'forge_steel_boots',    reqSkill: 'smith', reqLvl: 25, xp: 220, inputs: [{ id: 'gold_bar', count: 5 }, { id: 'iron_bar', count: 2 }], output: { id: 'steel_boots', count: 1 } },

    // Cobalt Tier
    { id: 'forge_cobalt_sword',   reqSkill: 'smith', reqLvl: 42, xp: 600, inputs: [{ id: 'cobalt_bar', count: 6 }], output: { id: 'cobalt_sword', count: 1 } },
    { id: 'forge_cobalt_shield',  reqSkill: 'smith', reqLvl: 43, xp: 700, inputs: [{ id: 'cobalt_bar', count: 7 }], output: { id: 'cobalt_shield', count: 1 } },
    { id: 'forge_cobalt_helmet',  reqSkill: 'smith', reqLvl: 43, xp: 550, inputs: [{ id: 'cobalt_bar', count: 5 }], output: { id: 'cobalt_helmet', count: 1 } },
    { id: 'forge_cobalt_chest',   reqSkill: 'smith', reqLvl: 45, xp: 950, inputs: [{ id: 'cobalt_bar', count: 10 }], output: { id: 'cobalt_chest', count: 1 } },
    { id: 'forge_cobalt_legs',    reqSkill: 'smith', reqLvl: 44, xp: 800, inputs: [{ id: 'cobalt_bar', count: 8 }], output: { id: 'cobalt_legs', count: 1 } },
    { id: 'forge_cobalt_boots',   reqSkill: 'smith', reqLvl: 42, xp: 550, inputs: [{ id: 'cobalt_bar', count: 5 }], output: { id: 'cobalt_boots', count: 1 } },

    // Bloodstone Tier
    { id: 'forge_blood_slayer',   reqSkill: 'smith', reqLvl: 60, xp: 1800, inputs: [{ id: 'blood_bar', count: 10 }, { id: 'demon_horn', count: 3 }], output: { id: 'blood_slayer', count: 1 } },
    { id: 'forge_blood_aegis',    reqSkill: 'smith', reqLvl: 60, xp: 1900, inputs: [{ id: 'blood_bar', count: 12 }, { id: 'boss_relic', count: 1 }], output: { id: 'blood_aegis', count: 1 } },
    { id: 'forge_blood_cuirass',  reqSkill: 'smith', reqLvl: 62, xp: 2600, inputs: [{ id: 'blood_bar', count: 16 }, { id: 'boss_relic', count: 2 }], output: { id: 'blood_cuirass', count: 1 } }
  ];

  // ── MOB DROP TABLES ──
  const MOB_DROPS = {
    // Slime (Orman / Seviye 1-5)
    slime: [
      { id: 'slime_gel', min: 1, max: 3, chance: 0.85 },
      { id: 'copper_ore', min: 1, max: 2, chance: 0.40 },
      { id: 'hp_potion_s', min: 1, max: 2, chance: 0.25 },
      { id: 'bronze_sword', min: 1, max: 1, chance: 0.04 }
    ],
    // Yarasa / Bat
    bat: [
      { id: 'bat_wing', min: 1, max: 2, chance: 0.90 },
      { id: 'hp_potion_s', min: 1, max: 2, chance: 0.35 },
      { id: 'ring_strength', min: 1, max: 1, chance: 0.05 }
    ],
    // Kurt / Wolf
    wolf: [
      { id: 'frost_fang', min: 1, max: 2, chance: 0.60 },
      { id: 'iron_ore', min: 1, max: 3, chance: 0.45 },
      { id: 'hp_potion_m', min: 1, max: 1, chance: 0.30 },
      { id: 'ring_swiftness', min: 1, max: 1, chance: 0.06 }
    ],
    // Kadim Ağaç Muhafızı / Ancient Treant (Zindan 1 & Orman)
    treant: [
      { id: 'elder_bark', min: 1, max: 3, chance: 0.90 },
      { id: 'willow_log', min: 2, max: 4, chance: 0.70 },
      { id: 'nature_ring', min: 1, max: 1, chance: 0.12 },
      { id: 'treant_crown', min: 1, max: 1, chance: 0.08 }
    ],
    // Taş Devi / Golem
    golem: [
      { id: 'granite_core', min: 1, max: 2, chance: 0.85 },
      { id: 'iron_ore', min: 2, max: 5, chance: 0.70 },
      { id: 'gold_ore', min: 1, max: 3, chance: 0.45 },
      { id: 'golem_shield', min: 1, max: 1, chance: 0.09 },
      { id: 'steel_chest', min: 1, max: 1, chance: 0.05 }
    ],
    // Buzul Elementali / Frost Elemental
    frost_elemental: [
      { id: 'cobalt_ore', min: 2, max: 4, chance: 0.75 },
      { id: 'hp_potion_l', min: 1, max: 2, chance: 0.45 },
      { id: 'cobalt_sword', min: 1, max: 1, chance: 0.06 },
      { id: 'ring_vitality', min: 1, max: 1, chance: 0.07 }
    ],
    // Buz Ejderi / Frost Wyrm
    frost_wyrm: [
      { id: 'frost_shard', min: 1, max: 3, chance: 0.90 },
      { id: 'cobalt_ore', min: 2, max: 5, chance: 0.75 },
      { id: 'glacier_blade', min: 1, max: 1, chance: 0.08 },
      { id: 'ice_ring', min: 1, max: 1, chance: 0.08 }
    ],
    // İblis / Magma Demon / Dragon
    demon: [
      { id: 'demon_horn', min: 1, max: 3, chance: 0.85 },
      { id: 'blood_shard', min: 1, max: 3, chance: 0.50 },
      { id: 'speed_elixir', min: 1, max: 2, chance: 0.40 },
      { id: 'amulet_power', min: 1, max: 1, chance: 0.08 },
      { id: 'blood_slayer', min: 1, max: 1, chance: 0.02 }
    ],
    // Hiçlik Zindanı Bossu / Abyssal Overlord Malgok
    abyssal_boss: [
      { id: 'abyssal_core', min: 1, max: 2, chance: 1.0 },
      { id: 'boss_relic', min: 1, max: 2, chance: 0.85 },
      { id: 'blood_shard', min: 5, max: 10, chance: 0.95 },
      { id: 'bloodstone_cleaver', min: 1, max: 1, chance: 0.18 },
      { id: 'abyssal_wings', min: 1, max: 1, chance: 0.14 }
    ],
    // Klasik Harita Bossu
    boss: [
      { id: 'boss_relic', min: 1, max: 2, chance: 1.0 },
      { id: 'blood_shard', min: 4, max: 8, chance: 0.90 },
      { id: 'amulet_glory', min: 1, max: 1, chance: 0.20 },
      { id: 'blood_slayer', min: 1, max: 1, chance: 0.15 },
      { id: 'blood_cuirass', min: 1, max: 1, chance: 0.12 }
    ]
  };

  // ── XP & LEVEL CURVE ──
  // Classic RPG Level XP formula: XP for level L = floor(50 * L^1.65)
  function xpForLevel(level) {
    if (level <= 1) return 0;
    return Math.floor(60 * Math.pow(level - 1, 1.68) + (level - 1) * 30);
  }

  function getLevelFromXp(xp) {
    let lvl = 1;
    while (lvl < 100 && xp >= xpForLevel(lvl + 1)) {
      lvl++;
    }
    return lvl;
  }

  // ── DEFAULT PLAYER PROFILE ──
  function createDefaultProfile() {
    return {
      combatLvl: 1, combatXp: 0,
      miningLvl: 1, miningXp: 0,
      woodLvl: 1, woodXp: 0,
      smithLvl: 1, smithXp: 0,
      gold: 100,
      inventory: [
        { id: 'bronze_sword', count: 1 },
        { id: 'bronze_pickaxe', count: 1 },
        { id: 'bronze_axe', count: 1 },
        { id: 'hp_potion_s', count: 5 }
      ],
      equipment: {
        weapon: 'bronze_sword',
        shield: null,
        helmet: null,
        chest: null,
        legs: null,
        boots: null,
        ring: null,
        amulet: null,
        pickaxe: 'bronze_pickaxe',
        axe: 'bronze_axe'
      },
      bank: []
    };
  }

  // ── EQUIPMENT STATS CALCULATOR ──
  function calculateEquipmentStats(equipment) {
    let totalAtk = 0;
    let totalDef = 0;
    let extraHp = 0;
    let extraSpeed = 0;
    let lifesteal = 0;

    if (!equipment) return { totalAtk, totalDef, extraHp, extraSpeed, lifesteal };

    for (const slot of Object.keys(equipment)) {
      const itemId = equipment[slot];
      if (!itemId) continue;
      const def = ITEMS[itemId];
      if (!def) continue;

      if (def.atk) totalAtk += def.atk;
      if (def.def) totalDef += def.def;
      if (def.hp) extraHp += def.hp;
      if (def.spd) extraSpeed += def.spd;
      if (def.lifesteal) lifesteal += def.lifesteal;
    }

    return { totalAtk, totalDef, extraHp, extraSpeed, lifesteal };
  }

  // ── TOWN NPC DEFINITIONS ──
  const NPCS = [
    {
      id: 'npc_banker',
      name: 'Banka Kasası',
      title: 'Kraliyet Emanetçisi',
      type: 'bank',
      x: -120,
      y: -80,
      icon: 'fa-vault',
      color: '#fbbf24',
      dialog: 'Değerli eşyalarını ve külçelerini burada güvenle saklayabilirsin. Ölsen bile bankana hiçbir şey olmaz!'
    },
    {
      id: 'npc_blacksmith',
      name: 'Usta Demirci Goran',
      title: 'Örs ve Lav Ustası',
      type: 'blacksmith',
      x: 140,
      y: -70,
      icon: 'fa-hammer',
      color: '#f97316',
      dialog: 'Cevherleri potada eritip külçeye dönüştür, sonra da efsanevi zırhlar ve kılıçlar dövelim!'
    },
    {
      id: 'npc_merchant',
      name: 'Tüccar Alara',
      title: 'Seyyar Simyacı',
      type: 'merchant',
      x: 0,
      y: 130,
      icon: 'fa-store',
      color: '#a855f7',
      dialog: 'Taze şifa iksirleri ve canavar ganimetlerin için en iyi fiyatı ben veririm!'
    }
  ];

  return {
    RARITIES,
    ITEMS,
    SMELTING_RECIPES,
    FORGING_RECIPES,
    MOB_DROPS,
    xpForLevel,
    getLevelFromXp,
    createDefaultProfile,
    calculateEquipmentStats,
    NPCS
  };
});
