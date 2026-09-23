// ============================================================
// FORESTBRAWL: CURSE OF AROS MMORPG CLIENT ENGINE
// Visuals, Town Hub, Loot Beams, 24-Slot Bag, Paperdoll, Skills & NPCs
// ============================================================

(function (window) {
  'use strict';

  const MmorpgClient = {
    lootBags: new Map(),
    playerData: null,
    activeModal: null,
    selectedItem: null,
    selectedItemIndex: -1,
    selectedItemSource: 'bag',
    activeForgeTab: 'smelt',
    quickWeaponSlot: 1,
    nearestInteractable: null,
    emberParticles: [],

    init: function () {
      this.playerData = this.loadLocalProfile();
      document.body.classList.add('mode-mmorpg');
      this.injectStyles();
      this.injectMarkup();
      this.bindInputs();
      this.bindCanvasTap();
      this.bindSocketEvents();
      this.updateHUD();
      this.setupEmbers();
      console.log('[MMORPG] Curse of Aros engine initialized successfully!');
    },

    loadLocalProfile: function () {
      try {
        const saved = localStorage.getItem('fb_mmorpg_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch (_) {}
      return window.MmorpgData ? window.MmorpgData.createDefaultProfile() : null;
    },

    saveLocalProfile: function () {
      if (!this.playerData) return;
      try {
        localStorage.setItem('fb_mmorpg_profile', JSON.stringify(this.playerData));
      } catch (_) {}
    },

    setupEmbers: function () {
      this.emberParticles = [];
      for (let i = 0; i < 30; i++) {
        this.emberParticles.push({
          x: 140 + (Math.random() * 60 - 30),
          y: -70 + (Math.random() * 30 - 15),
          vx: (Math.random() - 0.5) * 0.8,
          vy: -1.2 - Math.random() * 1.5,
          alpha: 0.8 + Math.random() * 0.2,
          size: 2 + Math.random() * 3,
          color: Math.random() > 0.4 ? '#f97316' : '#facc15'
        });
      }
    },

    // ── MAP & WORLD CACHE (TOWN & ZONES) ──
    buildBgCache: function (c, W, S) {
      // 1. Base Dark Fantasy Terrain
      c.fillStyle = '#1c2414';
      c.fillRect(-W, -W, W * 2, W * 2);

      // Subtle atmospheric grid
      c.strokeStyle = 'rgba(255,255,255,0.025)';
      c.lineWidth = 1;
      const step = 200;
      for (let x = -W; x <= W; x += step) {
        c.beginPath(); c.moveTo(x, -W); c.lineTo(x, W); c.stroke();
      }
      for (let y = -W; y <= W; y += step) {
        c.beginPath(); c.moveTo(-W, y); c.lineTo(W, y); c.stroke();
      }

      // ── ZONE 1: Fısıldayan Koru (Whispering Woods / Lvl 1-15) ──
      const forestGrd = c.createRadialGradient(0, 0, 700, 0, 0, 2300);
      forestGrd.addColorStop(0, '#364d1e');
      forestGrd.addColorStop(0.7, '#2b3f17');
      forestGrd.addColorStop(1, '#1e2d11');
      c.fillStyle = forestGrd;
      c.beginPath(); c.arc(0, 0, 2300, 0, Math.PI * 2); c.fill();

      // ── ZONE 2: Batık Taş Ocağı (Sunken Quarry / Lvl 15-35) ──
      const quarryGrd = c.createRadialGradient(0, 2500, 200, 0, 2800, 1800);
      quarryGrd.addColorStop(0, '#383531');
      quarryGrd.addColorStop(0.7, '#2b2926');
      quarryGrd.addColorStop(1, '#1e1c1a');
      c.fillStyle = quarryGrd;
      c.beginPath(); c.arc(0, 2600, 1700, 0, Math.PI * 2); c.fill();

      // ── ZONE 3: Buzul Zirvesi (Frostfang Peak / Lvl 35-55) ──
      const frostGrd = c.createRadialGradient(0, -3200, 200, 0, -3200, 2200);
      frostGrd.addColorStop(0, '#1c3452');
      frostGrd.addColorStop(0.6, '#14253b');
      frostGrd.addColorStop(1, '#0e1a29');
      c.fillStyle = frostGrd;
      c.beginPath(); c.arc(0, -3200, 2000, 0, Math.PI * 2); c.fill();

      // ── ZONE 4: Lanetli Mahzen & Lav (Abyssal Crypt / Lvl 55+) ──
      const cryptGrd = c.createRadialGradient(3800, 0, 200, 3800, 0, 2500);
      cryptGrd.addColorStop(0, '#261014');
      cryptGrd.addColorStop(0.5, '#1a0b0e');
      cryptGrd.addColorStop(1, '#100709');
      c.fillStyle = cryptGrd;
      c.beginPath(); c.arc(3800, 0, 2200, 0, Math.PI * 2); c.fill();

      // ── CENTRAL SAFE HAVEN TOWN HUB (DOĞUŞ KASABASI / RADIUS 700) ──
      // Outer mossy green plaza border
      c.fillStyle = '#2f3b20';
      c.beginPath(); c.arc(0, 0, 680, 0, Math.PI * 2); c.fill();

      // Paved Cobblestone Town Square
      const townGrd = c.createRadialGradient(0, 0, 0, 0, 0, 600);
      townGrd.addColorStop(0, '#524e48');
      townGrd.addColorStop(0.85, '#3d3a36');
      townGrd.addColorStop(1, '#2c2a27');
      c.fillStyle = townGrd;
      c.beginPath(); c.arc(0, 0, 600, 0, Math.PI * 2); c.fill();

      // Cobblestone Paver Pattern
      c.strokeStyle = 'rgba(0,0,0,0.22)';
      c.lineWidth = 2;
      for (let r = 80; r <= 560; r += 70) {
        c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
      }
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
        c.beginPath();
        c.moveTo(Math.cos(a) * 70, Math.sin(a) * 70);
        c.lineTo(Math.cos(a) * 580, Math.sin(a) * 580);
        c.stroke();
      }

      // Branching Stone Pathways (North, South, East, West)
      c.fillStyle = '#44403c';
      // North Road
      c.fillRect(-45, -2300, 90, 1800);
      // South Road
      c.fillRect(-45, 500, 90, 1900);
      // East Road
      c.fillRect(500, -45, 2300, 90);
      // West Road
      c.fillRect(-2400, -45, 1900, 90);

      // Central Town Fountain Base
      c.fillStyle = '#78716c';
      c.beginPath(); c.arc(0, 0, 65, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#d6d3d1'; c.lineWidth = 4; c.stroke();

      c.fillStyle = '#1e40af';
      c.beginPath(); c.arc(0, 0, 52, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#60a5fa'; c.lineWidth = 2; c.stroke();

      // Bank Foundation & Golden Chest Slabs
      c.fillStyle = '#292524';
      c.beginPath();
      c.roundRect ? c.roundRect(-190, -140, 140, 120, 16) : c.rect(-190, -140, 140, 120);
      c.fill();
      c.strokeStyle = '#eab308'; c.lineWidth = 3; c.stroke();

      // Bank Golden Chest (Baked)
      c.save();
      c.translate(-120, -80);
      const bHalo = c.createRadialGradient(0, 0, 5, 0, 0, 65);
      bHalo.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
      bHalo.addColorStop(1, 'rgba(234, 179, 8, 0)');
      c.fillStyle = bHalo;
      c.beginPath(); c.arc(0, 0, 65, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#78350f';
      c.fillRect(-24, -16, 48, 32);
      c.fillStyle = '#ca8a04';
      c.fillRect(-24, -16, 48, 8);
      c.fillRect(-24, 8, 48, 8);
      c.strokeStyle = '#451a03'; c.lineWidth = 2.5;
      c.strokeRect(-24, -16, 48, 32);
      c.fillStyle = '#fef08a';
      c.beginPath(); c.arc(0, 0, 5, 0, Math.PI * 2); c.fill();
      c.restore();

      // Blacksmith Forge Foundation Slabs
      c.fillStyle = '#1c1917';
      c.beginPath();
      c.roundRect ? c.roundRect(70, -135, 140, 125, 16) : c.rect(70, -135, 140, 125);
      c.fill();
      c.strokeStyle = '#ea580c'; c.lineWidth = 3; c.stroke();

      // Blacksmith Stone Hearth & Anvil (Baked)
      c.save();
      c.translate(140, -70);
      c.fillStyle = '#292524';
      c.fillRect(-28, -20, 56, 40);
      c.fillStyle = '#ea580c';
      c.fillRect(-20, -12, 40, 24);
      c.fillStyle = '#fef08a';
      c.fillRect(-12, -6, 24, 12);
      c.fillStyle = '#475569';
      c.fillRect(-48, 4, 20, 16);
      c.fillRect(-52, 0, 28, 6);
      c.strokeStyle = '#0f172a'; c.lineWidth = 1.5;
      c.strokeRect(-52, 0, 28, 6);
      c.restore();

      // Merchant Stall Foundation
      c.fillStyle = '#3e2723';
      c.beginPath();
      c.roundRect ? c.roundRect(-80, 70, 160, 110, 14) : c.rect(-80, 70, 160, 110);
      c.fill();
      c.strokeStyle = '#a855f7'; c.lineWidth = 3; c.stroke();

      // Merchant Market Stall Awning, Counter & Potions (Baked)
      c.save();
      c.translate(0, 130);
      const numStripes = 6;
      const awW = 60;
      for (let s = 0; s < numStripes; s++) {
        c.fillStyle = (s % 2 === 0) ? '#7e22ce' : '#eab308';
        c.fillRect(-awW / 2 + s * (awW / numStripes), -20, awW / numStripes, 24);
      }
      c.strokeStyle = '#3b0764'; c.lineWidth = 2;
      c.strokeRect(-awW / 2, -20, awW, 24);
      c.fillStyle = '#854d0e';
      c.fillRect(-26, 4, 52, 14);
      c.fillStyle = '#ef4444'; c.beginPath(); c.arc(-14, 4, 4, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(0, 4, 4, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#22c55e'; c.beginPath(); c.arc(14, 4, 4, 0, Math.PI * 2); c.fill();
      c.restore();

      // Town Perimeter Fence Posts & Boundary Ring
      c.strokeStyle = '#854d0e';
      c.lineWidth = 5;
      c.beginPath(); c.arc(0, 0, 640, 0, Math.PI * 2); c.stroke();
    },

    // ── LIVE WORLD DRAWING (NPCS, FORGE FIRE, BEAMS, LOOT) ──
    drawWorld: function (ctx, camX, camY) {
      const now = Date.now();
      const distToTown = Math.hypot(camX, camY);

      // Only animate town hub fixtures when near town center to save mobile GPU/CPU bandwidth
      if (distToTown < 1100) {
        // 1. Center Fountain Animated Ripple
        ctx.save();
        const ripPhase = (now % 2000) / 2000;
        ctx.strokeStyle = `rgba(147, 197, 253, ${1 - ripPhase})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 15 + ripPhase * 32, 0, Math.PI * 2);
        ctx.stroke();

        // Fountain Monolith
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();

        // 2. Blacksmith Forge Fire Glow & Embers
        ctx.save();
        ctx.translate(140, -70);
        const pulse = Math.sin(now * 0.008) * 0.12;
        ctx.fillStyle = `rgba(234, 88, 12, ${0.45 + pulse})`;
        ctx.beginPath(); ctx.arc(0, 0, 52, 0, Math.PI * 2); ctx.fill();

        // Animate Forge Embers
        for (const p of this.emberParticles) {
          p.y += p.vy;
          p.x += p.vx;
          p.alpha -= 0.015;
          if (p.alpha <= 0 || p.y < -120) {
            p.x = 140 + (Math.random() * 40 - 20);
            p.y = -70 + (Math.random() * 20 - 10);
            p.alpha = 0.8 + Math.random() * 0.2;
          }
        }
        ctx.restore();

        // Draw embers
        ctx.save();
        for (const p of this.emberParticles) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // 3. NPC Hover Floating Tags
        this.drawNpcTag(ctx, -120, -115, '🏦 Banka Kasası [E]', '#facc15');
        this.drawNpcTag(ctx, 140, -105, '🔨 Usta Demirci [E]', '#fb923c');
        this.drawNpcTag(ctx, 0, 95, '🏪 Kasaba Tüccarı [E]', '#c084fc');
      }

      // 4. Ground Loot Bags & Vertical Light Beams (Viewport Culled)
      this.drawLootBags(ctx, now, camX, camY);
    },

    drawNpcTag: function (ctx, x, y, text, color) {
      ctx.save();
      ctx.font = 'bold 12px "Lilita One", sans-serif';
      ctx.textAlign = 'center';
      const textW = ctx.measureText(text).width;

      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x - textW / 2 - 8, y - 16, textW + 16, 22, 6) : ctx.rect(x - textW / 2 - 8, y - 16, textW + 16, 22);
      ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      ctx.restore();
    },

    drawLootBags: function (ctx, now, camX, camY) {
      if (!this.lootBags || this.lootBags.size === 0) return;

      const halfW = (window.innerWidth / (window.ZOOM || 1)) * 0.65;
      const halfH = (window.innerHeight / (window.ZOOM || 1)) * 0.65;

      for (const [bagId, bag] of this.lootBags) {
        if (!bag) continue;
        const x = bag.x;
        const y = bag.y;

        // Viewport Culling: Skip bags that are not visible on screen
        if (camX !== undefined && camY !== undefined) {
          if (Math.abs(x - camX) > halfW + 60 || Math.abs(y - camY) > halfH + 60) {
            continue;
          }
        }

        // Find highest rarity in bag
        let highestRarity = 'common';
        const order = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
        if (bag.items) {
          for (const it of bag.items) {
            const def = window.MmorpgData?.ITEMS[it.id];
            if (def && order.indexOf(def.rarity) > order.indexOf(highestRarity)) {
              highestRarity = def.rarity;
            }
          }
        }
        const rarInfo = window.MmorpgData?.RARITIES[highestRarity] || { color: '#9ca3af', glow: 'rgba(255,255,255,0.3)' };

        ctx.save();
        ctx.translate(x, y);

        // Vertical Radiant Beam (Diablo & Curse of Aros style!)
        const beamH = 140 + Math.sin(now * 0.006) * 15;
        const beamW = (highestRarity === 'legendary' || highestRarity === 'epic') ? 22 : 14;

        if (!this._beamGrdCache) this._beamGrdCache = {};
        let beamGrd = this._beamGrdCache[highestRarity];
        if (!beamGrd) {
          beamGrd = ctx.createLinearGradient(0, 0, 0, -155);
          beamGrd.addColorStop(0, rarInfo.glow || 'rgba(255,255,255,0.6)');
          beamGrd.addColorStop(0.7, rarInfo.color);
          beamGrd.addColorStop(1, 'rgba(255,255,255,0)');
          this._beamGrdCache[highestRarity] = beamGrd;
        }

        ctx.fillStyle = beamGrd;
        ctx.fillRect(-beamW / 2, -beamH, beamW, beamH);

        // Ground Beam Ring
        ctx.strokeStyle = rarInfo.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 4, 18, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Loot Bag Body
        const bob = Math.sin(now * 0.005) * 3;
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(0, -4 + bob, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2; ctx.stroke();

        // Gold tie ribbon
        ctx.fillStyle = rarInfo.color;
        ctx.fillRect(-6, -15 + bob, 12, 4);

        // Sparkle Stars for Epic/Legendary
        if (highestRarity === 'legendary' || highestRarity === 'epic') {
          const spkA = now * 0.004;
          const spkR = 20;
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(Math.cos(spkA) * spkR, Math.sin(spkA) * spkR - 12 + bob, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floating Tag
        const localPlayer = window.player;
        if (localPlayer) {
          const d = Math.hypot(localPlayer.x - x, localPlayer.y - y);
          if (d < 180) {
            ctx.font = 'bold 11px "Lilita One", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(-42, -45 + bob, 84, 18, 5) : ctx.rect(-42, -45 + bob, 84, 18);
            ctx.fill();
            ctx.strokeStyle = rarInfo.color; ctx.lineWidth = 1.2; ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.fillText('[E] Ganimeti Al', 0, -32 + bob);
          }
        }

        ctx.restore();
      }
    },

    // ── INTERACTIONS & PROXIMITY ──
    interactNearest: function () {
      const p = window.player;
      if (!p) return;

      // 1. Check Loot Bags
      for (const [bagId, bag] of this.lootBags) {
        if (Math.hypot(p.x - bag.x, p.y - bag.y) <= 180) {
          if (window._socket) window._socket.emit('mmorpg_loot_pickup', { bagId });
          this.triggerSfx('pickup');
          return;
        }
      }

      // 2. Check Bank
      if (Math.hypot(p.x - (-120), p.y - (-80)) <= 240) {
        this.openModal('bank');
        return;
      }

      // 3. Check Blacksmith
      if (Math.hypot(p.x - 140, p.y - (-70)) <= 240) {
        this.openModal('forge');
        return;
      }

      // 4. Check Merchant
      if (Math.hypot(p.x - 0, p.y - 130) <= 240) {
        this.openModal('shop');
        return;
      }

      // If nothing near, open Backpack
      this.toggleModal('bag');
    },

    // ── HUD & MODAL DOM INJECTION ──
    injectStyles: function () {
      if (document.getElementById('mmorpg-style')) return;
      const style = document.createElement('style');
      style.id = 'mmorpg-style';
      style.textContent = `
        /* MMORPG Bottom Action Bar */
        .mmorpg-action-bar {
          display: flex; align-items: center; gap: 8px;
          background: rgba(18, 14, 26, 0.92);
          border: 2px solid rgba(255, 215, 0, 0.35);
          border-radius: 18px; padding: 8px 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(168,85,247,0.15);
          backdrop-filter: blur(12px);
          pointer-events: auto;
        }
        .mmo-slot {
          width: 54px; height: 54px; position: relative;
          background: rgba(255,255,255,0.06);
          border: 2px solid rgba(255,255,255,0.18);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s ease;
        }
        .mmo-slot:hover {
          background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }
        .mmo-slot.active {
          border-color: #ffd700; background: rgba(234, 179, 8, 0.2);
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
        }
        .mmo-num {
          position: absolute; top: 2px; left: 4px;
          font-size: 10px; font-weight: 900; color: #cbd5e1;
          text-shadow: 1px 1px 0 #000;
        }
        .mmo-slot-badge {
          position: absolute; bottom: 2px;
          font-size: 8px; font-weight: 800; color: #facc15;
          text-shadow: 1px 1px 0 #000; white-space: nowrap;
        }
        .mmo-count-badge {
          position: absolute; bottom: 2px; right: 4px;
          font-size: 10px; font-weight: 900; color: #4ade80;
          text-shadow: 1px 1px 0 #000;
        }
        .mmo-divider {
          width: 2px; height: 38px; background: rgba(255,255,255,0.15); margin: 0 4px;
        }
        .mmo-btn-action {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 3px; height: 54px; padding: 0 12px;
          background: linear-gradient(180deg, rgba(55, 48, 68, 0.8), rgba(28, 24, 36, 0.9));
          border: 2px solid rgba(255, 255, 255, 0.18); border-radius: 12px;
          color: #f1f5f9; font-family: 'Lilita One', sans-serif; font-size: 11px;
          cursor: pointer; transition: all 0.18s ease;
        }
        .mmo-btn-action:hover {
          border-color: #ffd700; transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.5);
        }
        .mmo-btn-action:active { transform: translateY(1px); }

        /* MMORPG Top Header */
        .mmorpg-top-hud {
          position: fixed; top: 12px; left: 16px; z-index: 40;
          display: flex; align-items: center; gap: 10px;
          background: rgba(18, 14, 26, 0.88);
          border: 2px solid rgba(255, 215, 0, 0.3); border-radius: 14px;
          padding: 6px 14px; backdrop-filter: blur(10px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        }
        .mmo-hud-pill {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Lilita One', sans-serif; font-size: 13px; color: #fff;
        }

        /* MMORPG Modals (Dark Fantasy Theme) */
        .mmo-modal-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px);
          display: none; align-items: center; justify-content: center;
        }
        .mmo-modal-backdrop.open { display: flex; }
        .mmo-modal-box {
          background: linear-gradient(165deg, #241a32 0%, #120e1a 100%);
          border: 3px solid #d4af37; border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.9), inset 0 0 25px rgba(212, 175, 55, 0.15);
          width: min(92vw, 540px); max-height: 88vh; overflow-y: auto;
          color: #fff; padding: 18px 20px; position: relative;
          animation: mmoPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes mmoPop {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .mmo-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
          padding-bottom: 10px; margin-bottom: 14px;
        }
        .mmo-modal-title {
          font-family: 'Lilita One', sans-serif; font-size: 20px;
          color: #ffd700; text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          display: flex; align-items: center; gap: 8px;
        }
        .mmo-close-btn {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(220, 38, 38, 0.25); border: 1.5px solid #ef4444;
          color: #fca5a5; font-size: 16px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s ease;
        }
        .mmo-close-btn:hover { background: #ef4444; color: #fff; transform: scale(1.08); }

        /* Grid Slots */
        .mmo-grid-24 {
          display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;
          padding: 8px 0;
        }
        .mmo-grid-48 {
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 6px;
          max-height: 280px; overflow-y: auto; padding-right: 4px;
        }
        .mmo-item-slot {
          aspect-ratio: 1; position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.14); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s ease;
        }
        .mmo-item-slot:hover {
          transform: scale(1.05); border-color: #ffd700;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
        }
        .mmo-item-icon {
          width: 70%; height: 70%; object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
        }
        .mmo-stack-tag {
          position: absolute; bottom: 2px; right: 4px;
          font-size: 10px; font-weight: 900; color: #fff;
          background: rgba(0,0,0,0.7); border-radius: 4px; padding: 0 3px;
        }

        /* Paperdoll Equipment Layout */
        .mmo-paperdoll-grid {
          display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 12px;
          align-items: center; margin-top: 10px;
        }
        .mmo-char-preview-box {
          height: 220px; background: rgba(0,0,0,0.4);
          border: 2px solid rgba(212, 175, 55, 0.3); border-radius: 14px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .mmo-equip-col { display: flex; flex-direction: column; gap: 8px; }
        .mmo-equip-slot-wrap {
          display: flex; align-items: center; gap: 8px;
        }
        .mmo-equip-slot {
          width: 48px; height: 48px; position: relative;
          background: rgba(255, 255, 255, 0.07);
          border: 2px dashed rgba(255, 215, 0, 0.4); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
        }
        .mmo-equip-slot.filled {
          border-style: solid; border-color: #ffd700;
          background: rgba(212, 175, 55, 0.15);
        }
        .mmo-slot-lbl { font-size: 11px; font-weight: 700; color: #cbd5e1; }

        /* Stats Panel */
        .mmo-stats-panel {
          margin-top: 14px; padding: 10px 14px;
          background: rgba(0, 0, 0, 0.35); border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .mmo-stat-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 800; color: #e2e8f0;
        }

        /* Skills Progress Bars */
        .mmo-skill-card {
          background: rgba(0,0,0,0.35); border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 10px 14px; margin-bottom: 10px;
        }
        .mmo-skill-header {
          display: flex; justify-content: space-between; align-items: center;
          font-family: 'Lilita One', sans-serif; font-size: 14px; margin-bottom: 6px;
        }
        .mmo-skill-bar {
          width: 100%; height: 10px; background: rgba(255,255,255,0.08);
          border-radius: 5px; overflow: hidden; position: relative;
        }
        .mmo-skill-fill {
          height: 100%; border-radius: 5px;
          transition: width 0.3s ease;
        }

        /* Item Action Popover */
        .mmo-popover {
          position: fixed; z-index: 120;
          background: #1e1528; border: 2.5px solid #d4af37; border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.9);
          padding: 12px 14px; width: 220px; color: #fff;
          display: none; flex-direction: column; gap: 8px;
        }
        .mmo-popover.open { display: flex; }
        .mmo-pop-btn {
          width: 100%; padding: 6px 0; border-radius: 8px;
          font-family: 'Lilita One', sans-serif; font-size: 12px;
          cursor: pointer; border: none; transition: all 0.12s;
        }
        .mmo-pop-btn.equip { background: #3b82f6; color: #fff; }
        .mmo-pop-btn.use { background: #22c55e; color: #fff; }
        .mmo-pop-btn.bank { background: #f59e0b; color: #000; }
        .mmo-pop-btn.sell { background: #eab308; color: #000; }
        .mmo-pop-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }

        /* Level Up Toast */
        .mmo-lvl-toast {
          position: fixed; top: 18%; left: 50%; transform: translateX(-50%) scale(0.9);
          z-index: 150; pointer-events: none; opacity: 0;
          background: linear-gradient(135deg, rgba(88,28,140,0.95), rgba(20,10,35,0.95));
          border: 3px solid #ffd700; border-radius: 20px;
          padding: 14px 30px; box-shadow: 0 10px 40px rgba(234, 179, 8, 0.6);
          font-family: 'Lilita One', sans-serif; text-align: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mmo-lvl-toast.show {
          opacity: 1; transform: translateX(-50%) scale(1);
        }

        /* ── MMORPG MOBILE RESPONSIVE TWEAKS ── */
        @media (max-width: 768px) {
          .mmorpg-action-bar {
            gap: 4px; padding: 4px 6px; border-radius: 12px;
            max-width: calc(100vw - 12px);
          }
          .mmo-slot {
            width: 42px; height: 42px; border-radius: 9px;
          }
          .mmo-slot canvas {
            width: 28px !important; height: 28px !important;
          }
          .mmo-num { font-size: 8px; top: 1px; left: 2px; }
          .mmo-slot-badge { font-size: 7px; bottom: 1px; }
          .mmo-count-badge { font-size: 8px; bottom: 1px; right: 2px; }
          .mmo-divider { height: 26px; margin: 0 2px; }
          .mmo-btn-action {
            height: 42px; padding: 0 6px; font-size: 8px; border-radius: 9px; gap: 2px;
          }
          .mmo-btn-action i { font-size: 13px !important; }
          .mmo-btn-action .mmo-key-hint { display: none !important; }

          .mmorpg-top-hud {
            top: 8px; left: 8px; padding: 4px 8px; gap: 6px; border-radius: 10px;
          }
          .mmo-hud-pill { font-size: 10px; gap: 4px; }
          .mmo-modal-box {
            width: 95vw !important; max-height: 88vh !important; padding: 12px 10px !important;
          }
          .mmo-grid-24 {
            grid-template-columns: repeat(6, 1fr) !important; gap: 4px !important;
          }
          .mmo-grid-48 {
            grid-template-columns: repeat(6, 1fr) !important; gap: 4px !important; max-height: 220px !important;
          }
          .mmo-paperdoll-grid {
            grid-template-columns: 1fr 1.2fr 1fr !important; gap: 6px !important;
          }
          .mmo-char-preview-box { height: 160px !important; }
          .mmo-equip-slot { width: 38px !important; height: 38px !important; }
          .mmo-slot-lbl { display: none !important; }
        }

        @media (max-height: 480px) and (orientation: landscape) {
          .mmorpg-action-bar { padding: 3px 5px; gap: 3px; }
          .mmo-slot { width: 36px; height: 36px; }
          .mmo-slot canvas { width: 24px !important; height: 24px !important; }
          .mmo-btn-action { height: 36px; padding: 0 5px; font-size: 7.5px; }
          .mmorpg-top-hud { top: 4px; left: 6px; padding: 3px 6px; font-size: 9px; }
          .mmo-modal-box { max-height: 94vh !important; padding: 8px 10px !important; }
        }

        /* Mobile Interact / Pickup Floating Action Button */
        #mobile-interact-btn {
          position: fixed;
          right: max(env(safe-area-inset-right, 0px), 18px);
          bottom: calc(max(env(safe-area-inset-bottom, 0px), 14px) + 78px);
          z-index: 101; width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(180deg, rgba(168, 85, 247, 0.45), rgba(88, 28, 135, 0.3));
          border: 2px solid rgba(192, 132, 252, 0.85);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: manipulation;
          box-shadow: 0 10px 22px rgba(147, 51, 234, 0.35);
          transition: transform 0.12s ease, box-shadow 0.2s, border-color 0.2s, background 0.2s;
        }
        #mobile-interact-btn.highlight {
          border-color: #ffd700;
          background: linear-gradient(180deg, rgba(234, 179, 8, 0.7), rgba(161, 98, 7, 0.5));
          box-shadow: 0 0 22px rgba(255, 215, 0, 0.8);
          animation: mmoPulse 1s infinite alternate;
        }
        #mobile-interact-btn:active { transform: scale(0.88); }
        @media (hover:hover) and (pointer:fine) {
          #mobile-interact-btn { display: none !important; }
        }
        @keyframes mmoPulse {
          from { transform: scale(1); filter: brightness(1); }
          to { transform: scale(1.08); filter: brightness(1.2); }
        }

        /* Squeeze fix for #ui-bottom in MMORPG mode */
        body.mode-mmorpg #ui-bottom {
          width: min(520px, calc(100vw - 12px)) !important;
        }
        body.mode-mmorpg #dash-btn {
          bottom: calc(max(env(safe-area-inset-bottom, 0px), 14px) + 148px) !important;
        }
        body.mode-mmorpg #mobile-eat-btn {
          bottom: calc(max(env(safe-area-inset-bottom, 0px), 14px) + 218px) !important;
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.45), rgba(185, 28, 28, 0.25)) !important;
          border-color: rgba(239, 68, 68, 0.85) !important;
          box-shadow: 0 10px 22px rgba(239, 68, 68, 0.35) !important;
        }
      `;
      document.head.appendChild(style);
    },

    injectMarkup: function () {
      if (document.getElementById('mmorpg-action-bar')) return;

      // 1. Bottom Action Bar
      const uiBottom = document.getElementById('ui-bottom');
      if (uiBottom) {
        const bar = document.createElement('div');
        bar.id = 'mmorpg-action-bar';
        bar.className = 'mmorpg-action-bar';
        bar.style.display = window._IS_MMORPG ? 'flex' : 'none';
        bar.innerHTML = `
          <div class="mmo-slot active" id="mmo-slot-1" onclick="MmorpgClient.selectSlot(1)" title="Ana Silah [1]">
            <span class="mmo-num">1</span>
            <canvas id="mmo-canv-1" width="36" height="36"></canvas>
            <span class="mmo-slot-badge" id="mmo-wep-badge">Kılıç</span>
          </div>
          <div class="mmo-slot" id="mmo-slot-2" onclick="MmorpgClient.selectSlot(2)" title="Kazma / Balta [2]">
            <span class="mmo-num">2</span>
            <canvas id="mmo-canv-2" width="36" height="36"></canvas>
            <span class="mmo-slot-badge" id="mmo-tool-badge">Kazma</span>
          </div>
          <div class="mmo-slot" id="mmo-slot-3" onclick="MmorpgClient.useQuickPotion()" title="Can İksiri [3 / F]">
            <span class="mmo-num">3</span>
            <canvas id="mmo-canv-3" width="36" height="36"></canvas>
            <span class="mmo-count-badge" id="mmo-potion-count">0</span>
          </div>
          <div class="mmo-divider"></div>
          <button type="button" class="mmo-btn-action" onclick="MmorpgClient.toggleModal('bag')" title="Çanta (Envanter) [B]">
            <i class="fa-solid fa-briefcase text-amber-300 text-base"></i>
            <span>ÇANTA <span class="mmo-key-hint">[B]</span></span>
          </button>
          <button type="button" class="mmo-btn-action" onclick="MmorpgClient.toggleModal('char')" title="Karakter & Teçhizat [C]">
            <i class="fa-solid fa-shield-halved text-cyan-400 text-base"></i>
            <span>TEÇHİZAT <span class="mmo-key-hint">[C]</span></span>
          </button>
          <button type="button" class="mmo-btn-action" onclick="MmorpgClient.toggleModal('skills')" title="Yetenekler [K]">
            <i class="fa-solid fa-bolt text-purple-400 text-base"></i>
            <span>YETENEK <span class="mmo-key-hint">[K]</span></span>
          </button>
        `;
        uiBottom.appendChild(bar);

        // In MMORPG mode, hide classic survival inventory
        if (window._IS_MMORPG) {
          const classicInv = uiBottom.querySelector('.inventory');
          if (classicInv) classicInv.style.display = 'none';
        }
      }

      // Mobile Interact / Pickup Button
      if (!document.getElementById('mobile-interact-btn')) {
        const interactBtn = document.createElement('div');
        interactBtn.id = 'mobile-interact-btn';
        interactBtn.title = 'Etkileşim / Topla (E)';
        interactBtn.setAttribute('aria-label', 'Etkileşim');
        interactBtn.style.display = window._IS_MMORPG ? 'flex' : 'none';
        interactBtn.innerHTML = `
          <span style="font-size:22px;line-height:1;pointer-events:none;">🖐️</span>
          <span style="font-size:9px;font-weight:900;color:#fff;text-shadow:0 1px 2px #000;pointer-events:none;">TOPLA</span>
        `;
        const onInteract = (e) => {
          if (e.cancelable) e.preventDefault();
          e.stopPropagation();
          MmorpgClient.interactNearest();
        };
        interactBtn.addEventListener('pointerdown', onInteract, { passive: false });
        if (!('PointerEvent' in window)) interactBtn.addEventListener('touchstart', onInteract, { passive: false });
        interactBtn.addEventListener('click', onInteract);
        document.body.appendChild(interactBtn);
      }

      // 2. Top Header (Gold, Combat Level, Zone)
      const topHud = document.createElement('div');
      topHud.id = 'mmorpg-top-hud';
      topHud.className = 'mmorpg-top-hud';
      topHud.style.display = window._IS_MMORPG ? 'flex' : 'none';
      topHud.innerHTML = `
        <div class="mmo-hud-pill"><i class="fa-solid fa-coins text-amber-400"></i> <span id="mmo-gold-val">100</span></div>
        <div style="width:1px;height:16px;background:rgba(255,255,255,0.2);"></div>
        <div class="mmo-hud-pill"><i class="fa-solid fa-crosshairs text-red-400"></i> <span id="mmo-clvl-val">Lv. 1 Savaşçı</span></div>
        <div style="width:1px;height:16px;background:rgba(255,255,255,0.2);"></div>
        <div class="mmo-hud-pill"><i class="fa-solid fa-location-dot text-emerald-400"></i> <span id="mmo-zone-val">Doğuş Kasabası</span></div>
      `;
      document.body.appendChild(topHud);

      // Hide classic resource counters and survival widgets in MMORPG mode
      if (window._IS_MMORPG) {
        const resHud = document.getElementById('resource-hud');
        if (resHud) resHud.style.display = 'none';
        const ageEl = document.querySelector('.age-container');
        if (ageEl) ageEl.style.display = 'none';
        const hpEl = document.getElementById('hp-wrap');
        if (hpEl) hpEl.style.display = 'none';
        const clanBtn = document.getElementById('clan-btn');
        if (clanBtn) clanBtn.style.display = 'none';
        const buildUpg = document.getElementById('build-upg-panel');
        if (buildUpg) buildUpg.style.display = 'none';
      }

      // 3. Modals (Bag, Char, Skills, Bank, Forge, Merchant)
      this.injectModals();
    },

    injectModals: function () {
      const container = document.createElement('div');
      container.id = 'mmorpg-modals-root';
      container.innerHTML = `
        <!-- BACKPACK MODAL (24 SLOTS) -->
        <div id="mmo-modal-bag" class="mmo-modal-backdrop" onclick="if(event.target===this)MmorpgClient.closeModal()">
          <div class="mmo-modal-box">
            <div class="mmo-modal-header">
              <span class="mmo-modal-title"><i class="fa-solid fa-briefcase text-amber-400"></i> MACERACI ÇANTASI (24 YUVA)</span>
              <button type="button" class="mmo-close-btn" onclick="MmorpgClient.closeModal()">✕</button>
            </div>
            <div class="mmo-grid-24" id="mmo-bag-grid"></div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;color:#cbd5e1;">
              <span>🪙 Altın: <b id="mmo-bag-gold" class="text-amber-300">0</b></span>
              <span class="text-xs text-gray-400">Eşyaya tıklayarak kuşan veya kullan</span>
            </div>
          </div>
        </div>

        <!-- CHARACTER & EQUIPMENT MODAL (PAPERDOLL) -->
        <div id="mmo-modal-char" class="mmo-modal-backdrop" onclick="if(event.target===this)MmorpgClient.closeModal()">
          <div class="mmo-modal-box" style="width:min(94vw, 580px);">
            <div class="mmo-modal-header">
              <span class="mmo-modal-title"><i class="fa-solid fa-shield-halved text-cyan-400"></i> KARAKTER & TEÇHİZAT</span>
              <button type="button" class="mmo-close-btn" onclick="MmorpgClient.closeModal()">✕</button>
            </div>
            <div class="mmo-paperdoll-grid">
              <!-- Left Column: Weapon, Shield, Pickaxe, Axe -->
              <div class="mmo-equip-col">
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-weapon" onclick="MmorpgClient.unequipSlot('weapon')"></div>
                  <span class="mmo-slot-lbl">Silah</span>
                </div>
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-shield" onclick="MmorpgClient.unequipSlot('shield')"></div>
                  <span class="mmo-slot-lbl">Kalkan</span>
                </div>
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-pickaxe" onclick="MmorpgClient.unequipSlot('pickaxe')"></div>
                  <span class="mmo-slot-lbl">Kazma</span>
                </div>
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-axe" onclick="MmorpgClient.unequipSlot('axe')"></div>
                  <span class="mmo-slot-lbl">Balta</span>
                </div>
              </div>

              <!-- Center Column: Character Visual Preview -->
              <div class="mmo-char-preview-box">
                <canvas id="mmo-paperdoll-canvas" width="120" height="120"></canvas>
                <span id="mmo-char-name" style="font-family:'Lilita One';font-size:16px;color:#ffd700;margin-top:6px;">Savaşçı</span>
                <span id="mmo-char-combat-lvl" style="font-size:11px;font-weight:800;color:#93c5fd;">Savaş Lv. 1</span>
              </div>

              <!-- Right Column: Helmet, Chest, Legs, Boots, Ring, Amulet -->
              <div class="mmo-equip-col">
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-helmet" onclick="MmorpgClient.unequipSlot('helmet')"></div>
                  <span class="mmo-slot-lbl">Miğfer</span>
                </div>
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-chest" onclick="MmorpgClient.unequipSlot('chest')"></div>
                  <span class="mmo-slot-lbl">Zırh</span>
                </div>
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-legs" onclick="MmorpgClient.unequipSlot('legs')"></div>
                  <span class="mmo-slot-lbl">Pantolon</span>
                </div>
                <div class="mmo-equip-slot-wrap">
                  <div class="mmo-equip-slot" id="mmo-eq-boots" onclick="MmorpgClient.unequipSlot('boots')"></div>
                  <span class="mmo-slot-lbl">Çizme</span>
                </div>
              </div>
            </div>

            <!-- Stats Breakdown Panel -->
            <div class="mmo-stats-panel">
              <div class="mmo-stat-item"><i class="fa-solid fa-khanda text-red-400"></i> Saldırı: <span id="mmo-stat-atk" class="text-amber-300 font-bold">+14 ATK</span></div>
              <div class="mmo-stat-item"><i class="fa-solid fa-shield text-blue-400"></i> Savunma: <span id="mmo-stat-def" class="text-blue-300 font-bold">+0 DEF</span></div>
              <div class="mmo-stat-item"><i class="fa-solid fa-heart text-emerald-400"></i> Azami Can: <span id="mmo-stat-hp" class="text-green-300 font-bold">250 HP</span></div>
              <div class="mmo-stat-item"><i class="fa-solid fa-wind text-cyan-400"></i> Hareket: <span id="mmo-stat-spd" class="text-cyan-300 font-bold">+0% SPD</span></div>
            </div>
          </div>
        </div>

        <!-- SKILLS MODAL -->
        <div id="mmo-modal-skills" class="mmo-modal-backdrop" onclick="if(event.target===this)MmorpgClient.closeModal()">
          <div class="mmo-modal-box">
            <div class="mmo-modal-header">
              <span class="mmo-modal-title"><i class="fa-solid fa-bolt text-purple-400"></i> YETENEKLER & İLERLEME</span>
              <button type="button" class="mmo-close-btn" onclick="MmorpgClient.closeModal()">✕</button>
            </div>

            <!-- 1. Combat -->
            <div class="mmo-skill-card">
              <div class="mmo-skill-header">
                <span>⚔️ Savaş (Combat)</span>
                <span id="mmo-sk-combat-lvl" class="text-red-400">Lv. 1</span>
              </div>
              <div class="mmo-skill-bar"><div id="mmo-sk-combat-fill" class="mmo-skill-fill bg-red-500" style="width:0%"></div></div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:4px;">
                <span>Canavar ve boss öldürerek gelişir</span>
                <span id="mmo-sk-combat-xp">0 / 100 XP</span>
              </div>
            </div>

            <!-- 2. Mining -->
            <div class="mmo-skill-card">
              <div class="mmo-skill-header">
                <span>⛏️ Madencilik (Mining)</span>
                <span id="mmo-sk-mining-lvl" class="text-amber-400">Lv. 1</span>
              </div>
              <div class="mmo-skill-bar"><div id="mmo-sk-mining-fill" class="mmo-skill-fill bg-amber-500" style="width:0%"></div></div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:4px;">
                <span>Cevher ve kaya kazarak gelişir</span>
                <span id="mmo-sk-mining-xp">0 / 100 XP</span>
              </div>
            </div>

            <!-- 3. Woodcutting -->
            <div class="mmo-skill-card">
              <div class="mmo-skill-header">
                <span>🪓 Odunculuk (Woodcutting)</span>
                <span id="mmo-sk-wood-lvl" class="text-emerald-400">Lv. 1</span>
              </div>
              <div class="mmo-skill-bar"><div id="mmo-sk-wood-fill" class="mmo-skill-fill bg-emerald-500" style="width:0%"></div></div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:4px;">
                <span>Ağaç ve kütük keserek gelişir</span>
                <span id="mmo-sk-wood-xp">0 / 100 XP</span>
              </div>
            </div>

            <!-- 4. Smithing -->
            <div class="mmo-skill-card">
              <div class="mmo-skill-header">
                <span>🔨 Demircilik (Smithing)</span>
                <span id="mmo-sk-smith-lvl" class="text-orange-400">Lv. 1</span>
              </div>
              <div class="mmo-skill-bar"><div id="mmo-sk-smith-fill" class="mmo-skill-fill bg-orange-500" style="width:0%"></div></div>
              <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:4px;">
                <span>Örs ve ocakta üretim yaparak gelişir</span>
                <span id="mmo-sk-smith-xp">0 / 100 XP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- BANK VAULT MODAL -->
        <div id="mmo-modal-bank" class="mmo-modal-backdrop" onclick="if(event.target===this)MmorpgClient.closeModal()">
          <div class="mmo-modal-box" style="width:min(94vw, 620px);">
            <div class="mmo-modal-header">
              <span class="mmo-modal-title"><i class="fa-solid fa-vault text-amber-400"></i> KRALİYET BANKASI (48 YUVA)</span>
              <button type="button" class="mmo-close-btn" onclick="MmorpgClient.closeModal()">✕</button>
            </div>
            <div style="margin-bottom:6px;font-size:11px;color:#94a3b8;">Banka Kasası (Tıkla ve Çantana Al):</div>
            <div class="mmo-grid-48" id="mmo-bank-grid"></div>
            <div style="margin:12px 0 6px 0;font-size:11px;color:#94a3b8;">Çantan (Tıkla ve Bankaya Yatır):</div>
            <div class="mmo-grid-24" id="mmo-bank-bag-grid"></div>
          </div>
        </div>

        <!-- FORGE & SMELT MODAL -->
        <div id="mmo-modal-forge" class="mmo-modal-backdrop" onclick="if(event.target===this)MmorpgClient.closeModal()">
          <div class="mmo-modal-box" style="width:min(94vw, 560px);">
            <div class="mmo-modal-header">
              <span class="mmo-modal-title"><i class="fa-solid fa-hammer text-orange-400"></i> DEMİRCİ ÖRSÜ & OCAĞI</span>
              <button type="button" class="mmo-close-btn" onclick="MmorpgClient.closeModal()">✕</button>
            </div>
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <button type="button" id="mmo-tab-smelt" class="mmo-pop-btn use flex-1 py-2 font-bold" onclick="MmorpgClient.switchForgeTab('smelt')">🔥 Cevher Eritme (Külçeler)</button>
              <button type="button" id="mmo-tab-forge" class="mmo-pop-btn equip flex-1 py-2 font-bold" onclick="MmorpgClient.switchForgeTab('forge')">⚔️ Teçhizat Dövme</button>
            </div>
            <div id="mmo-forge-recipes-list" style="max-height:340px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;"></div>
          </div>
        </div>

        <!-- MERCHANT SHOP MODAL -->
        <div id="mmo-modal-shop" class="mmo-modal-backdrop" onclick="if(event.target===this)MmorpgClient.closeModal()">
          <div class="mmo-modal-box">
            <div class="mmo-modal-header">
              <span class="mmo-modal-title"><i class="fa-solid fa-store text-purple-400"></i> KASABA TÜCCARI</span>
              <button type="button" class="mmo-close-btn" onclick="MmorpgClient.closeModal()">✕</button>
            </div>
            <div style="font-size:12px;color:#ffd700;margin-bottom:8px;">Satın Alınabilir İksirler:</div>
            <div id="mmo-shop-buy-list" style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px;"></div>
            <div style="font-size:12px;color:#38bdf8;margin-bottom:8px;">Eşya Sat (Altın Kazanmak İçin Tıkla):</div>
            <div class="mmo-grid-24" id="mmo-shop-sell-grid"></div>
          </div>
        </div>

        <!-- ITEM ACTION POPOVER -->
        <div id="mmo-popover" class="mmo-popover">
          <div style="font-family:'Lilita One';font-size:14px;" id="mmo-pop-name">Eşya Adı</div>
          <div style="font-size:10px;color:#94a3b8;line-height:1.3;" id="mmo-pop-desc">Açıklama</div>
          <div style="font-size:10px;color:#ffd700;font-weight:bold;" id="mmo-pop-stats">Statlar</div>
          <div id="mmo-pop-actions" style="display:flex;flex-direction:column;gap:4px;margin-top:4px;"></div>
        </div>

        <!-- LEVEL UP BANNER TOAST -->
        <div id="mmo-lvl-toast" class="mmo-lvl-toast">
          <div style="font-size:11px;color:#ffd700;letter-spacing:1px;text-transform:uppercase;">✨ YETENEK GELİŞTİ! ✨</div>
          <div id="mmo-lvl-toast-text" style="font-size:18px;color:#fff;margin-top:2px;">Savaş Seviyesi 2 Oldun!</div>
        </div>
      `;
      document.body.appendChild(container);
    },

    bindInputs: function () {
      window.addEventListener('keydown', (e) => {
        if (!window._IS_MMORPG) return;
        const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;

        if (e.code === 'KeyB') {
          e.preventDefault();
          this.toggleModal('bag');
        } else if (e.code === 'KeyC') {
          e.preventDefault();
          this.toggleModal('char');
        } else if (e.code === 'KeyK') {
          e.preventDefault();
          this.toggleModal('skills');
        } else if (e.code === 'KeyE') {
          e.preventDefault();
          this.interactNearest();
        } else if (e.code === 'Digit1') {
          this.selectSlot(1);
        } else if (e.code === 'Digit2') {
          this.selectSlot(2);
        } else if (e.code === 'Digit3' || e.code === 'KeyF') {
          this.useQuickPotion();
        } else if (e.code === 'Escape') {
          this.closeModal();
        }
      });
    },

    bindCanvasTap: function () {
      const cv = document.getElementById('canvas');
      if (!cv || this._canvasTapBound) return;
      this._canvasTapBound = true;

      const handleTap = (e) => {
        if (!window._IS_MMORPG || !window.player) return;
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
        const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);
        if (clientX == null || clientY == null) return;
        if (typeof _screenToWorld !== 'function') return;

        const wp = _screenToWorld(clientX, clientY);
        // 1. Check Loot Bags
        for (const [bagId, bag] of this.lootBags) {
          if (Math.hypot(wp.x - bag.x, wp.y - bag.y) <= 48) {
            if (Math.hypot(window.player.x - bag.x, window.player.y - bag.y) <= 220) {
              if (window._socket) window._socket.emit('mmorpg_loot_pickup', { bagId });
              this.triggerSfx('pickup');
              return;
            }
          }
        }

        // 2. Check Bank
        if (Math.hypot(wp.x - (-120), wp.y - (-80)) <= 65) {
          if (Math.hypot(window.player.x - (-120), window.player.y - (-80)) <= 280) {
            this.openModal('bank');
            return;
          }
        }

        // 3. Check Blacksmith
        if (Math.hypot(wp.x - 140, wp.y - (-70)) <= 65) {
          if (Math.hypot(window.player.x - 140, window.player.y - (-70)) <= 280) {
            this.openModal('forge');
            return;
          }
        }

        // 4. Check Merchant
        if (Math.hypot(wp.x - 0, wp.y - 130) <= 65) {
          if (Math.hypot(window.player.x - 0, window.player.y - 130) <= 280) {
            this.openModal('shop');
            return;
          }
        }
      };

      cv.addEventListener('pointerup', handleTap, { passive: true });
    },

    bindSocketEvents: function () {
      if (!window._socket || this._socketBound) return;
      this._socketBound = true;
      const s = window._socket;

      s.on('mmorpg_sync', (data) => {
        if (!data) return;
        this.playerData = data;
        this.saveLocalProfile();
        this.updateHUD();
        this.renderActiveModal();
      });

      s.on('mmorpg_level_up', ({ skill, level } = {}) => {
        this.showLevelUpBanner(skill, level);
        this.triggerSfx('levelup');
      });

      s.on('mmorpg_loot_spawn', (bag) => {
        if (bag && bag.id) this.lootBags.set(bag.id, bag);
      });

      s.on('mmorpg_loot_despawn', ({ bagId } = {}) => {
        if (bagId) this.lootBags.delete(bagId);
      });

      s.on('mmorpg_toast', ({ text, type } = {}) => {
        if (window.triggerToast) {
          const icon = type === 'heal' ? 'fa-heart' : (type === 'gold' ? 'fa-coins' : (type === 'error' ? 'fa-circle-xmark' : 'fa-gem'));
          window.triggerToast(text || '', icon);
        }
      });
    },

    selectSlot: function (slotNum) {
      this.quickWeaponSlot = slotNum;
      document.querySelectorAll('.mmo-slot').forEach(el => el.classList.remove('active'));
      const activeEl = document.getElementById(`mmo-slot-${slotNum}`);
      if (activeEl) activeEl.classList.add('active');

      if (window.player) {
        window.player.weapon = (slotNum === 1) ? 2 : 1; // 2 = Sword, 1 = Axe/Tool
      }
      this.triggerSfx('click');
    },

    useQuickPotion: function () {
      if (!this.playerData || !this.playerData.inventory) return;
      const pot = this.playerData.inventory.find(it => it && (it.id === 'hp_potion_s' || it.id === 'hp_potion_m' || it.id === 'hp_potion_l'));
      if (!pot) {
        if (window.triggerToast) window.triggerToast('Çantanda can iksiri yok!', 'fa-circle-exclamation');
        return;
      }
      if (window._socket) {
        window._socket.emit('mmorpg_use_item', { itemId: pot.id });
      }
      this.triggerSfx('heal');
    },

    // ── MODALS LOGIC ──
    toggleModal: function (modalType) {
      if (this.activeModal === modalType) {
        this.closeModal();
      } else {
        this.openModal(modalType);
      }
    },

    openModal: function (modalType) {
      this.closeModal();
      this.activeModal = modalType;
      const el = document.getElementById(`mmo-modal-${modalType}`);
      if (el) {
        el.classList.add('open');
        this.renderModalContent(modalType);
      }
      this.triggerSfx('pop');
    },

    closeModal: function () {
      this.activeModal = null;
      document.querySelectorAll('.mmo-modal-backdrop').forEach(el => el.classList.remove('open'));
      this.hidePopover();
    },

    renderActiveModal: function () {
      if (this.activeModal) this.renderModalContent(this.activeModal);
    },

    renderModalContent: function (type) {
      if (!this.playerData) return;
      if (type === 'bag') this.renderBackpack();
      else if (type === 'char') this.renderEquipment();
      else if (type === 'skills') this.renderSkills();
      else if (type === 'bank') this.renderBank();
      else if (type === 'forge') this.renderForge();
      else if (type === 'shop') this.renderShop();
    },

    // ── BACKPACK RENDER ──
    renderBackpack: function () {
      const grid = document.getElementById('mmo-bag-grid');
      if (!grid || !this.playerData) return;
      grid.innerHTML = '';

      const inv = this.playerData.inventory || [];
      for (let i = 0; i < 24; i++) {
        const item = inv[i] || null;
        const slot = document.createElement('div');
        slot.className = 'mmo-item-slot';

        if (item) {
          const def = window.MmorpgData?.ITEMS[item.id];
          const rar = window.MmorpgData?.RARITIES[def?.rarity || 'common'];
          slot.style.borderColor = rar?.border || 'rgba(255,255,255,0.2)';
          slot.style.boxShadow = `inset 0 0 10px ${rar?.glow || 'transparent'}`;

          const icon = this.getItemIconSvg(def);
          slot.innerHTML = `
            ${icon}
            ${item.count > 1 ? `<span class="mmo-stack-tag">${item.count}</span>` : ''}
          `;
          slot.onclick = (e) => this.showPopover(e, item, i, 'bag');
        }
        grid.appendChild(slot);
      }

      const goldEl = document.getElementById('mmo-bag-gold');
      if (goldEl) goldEl.textContent = (this.playerData.gold || 0).toLocaleString();
    },

    // ── EQUIPMENT PAPERDOLL RENDER ──
    renderEquipment: function () {
      if (!this.playerData) return;
      const eq = this.playerData.equipment || {};
      const slots = ['weapon', 'shield', 'helmet', 'chest', 'legs', 'boots', 'pickaxe', 'axe'];

      for (const s of slots) {
        const el = document.getElementById(`mmo-eq-${s}`);
        if (!el) continue;
        const itemId = eq[s];
        if (itemId) {
          el.className = 'mmo-equip-slot filled';
          const def = window.MmorpgData?.ITEMS[itemId];
          el.innerHTML = this.getItemIconSvg(def);
        } else {
          el.className = 'mmo-equip-slot';
          el.innerHTML = '';
        }
      }

      // Stats Breakdown
      const stats = window.MmorpgData?.calculateEquipmentStats(eq) || {};
      const atkEl = document.getElementById('mmo-stat-atk');
      const defEl = document.getElementById('mmo-stat-def');
      const hpEl = document.getElementById('mmo-stat-hp');
      const spdEl = document.getElementById('mmo-stat-spd');

      if (atkEl) atkEl.textContent = `+${stats.totalAtk || 14} ATK`;
      if (defEl) defEl.textContent = `+${stats.totalDef || 0} DEF`;
      if (hpEl) hpEl.textContent = `${250 + (stats.extraHp || 0)} HP`;
      if (spdEl) spdEl.textContent = `+${Math.round((stats.extraSpeed || 0) * 100)}% SPD`;

      const cLvl = document.getElementById('mmo-char-combat-lvl');
      if (cLvl) cLvl.textContent = `Savaş Lv. ${this.playerData.combatLvl || 1}`;

      this.drawPaperdollPreview();
    },

    drawPaperdollPreview: function () {
      const canv = document.getElementById('mmo-paperdoll-canvas');
      if (!canv) return;
      const c = canv.getContext('2d');
      c.clearRect(0, 0, canv.width, canv.height);

      // Simple cute character figure
      c.save();
      c.translate(60, 60);

      // Shadow
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.beginPath(); c.ellipse(0, 36, 24, 8, 0, 0, Math.PI * 2); c.fill();

      // Body (Skin)
      c.fillStyle = '#667788';
      c.beginPath(); c.arc(0, 0, 26, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#1e293b'; c.lineWidth = 3; c.stroke();

      // Armor layer if equipped
      const eq = this.playerData?.equipment || {};
      if (eq.chest) {
        c.fillStyle = '#facc15';
        c.beginPath(); c.arc(0, 0, 20, 0, Math.PI * 2); c.fill();
      }

      // Eyes
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(-8, -4, 6, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(8, -4, 6, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#000';
      c.beginPath(); c.arc(-7, -4, 3, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(9, -4, 3, 0, Math.PI * 2); c.fill();

      // Weapon in hand
      c.fillStyle = '#cbd5e1';
      c.fillRect(24, -18, 6, 32);
      c.fillStyle = '#92400e';
      c.fillRect(22, 10, 10, 8);

      c.restore();
    },

    // ── SKILLS PROGRESS RENDER ──
    renderSkills: function () {
      if (!this.playerData || !window.MmorpgData) return;
      const skills = [
        { key: 'combat', name: 'Savaş' },
        { key: 'mining', name: 'Madencilik' },
        { key: 'wood',   name: 'Odunculuk' },
        { key: 'smith',  name: 'Demircilik' }
      ];

      for (const sk of skills) {
        const lvl = this.playerData[`${sk.key}Lvl`] || 1;
        const xp = this.playerData[`${sk.key}Xp`] || 0;
        const curLvlXp = window.MmorpgData.xpForLevel(lvl);
        const nextLvlXp = window.MmorpgData.xpForLevel(lvl + 1);
        const needed = Math.max(1, nextLvlXp - curLvlXp);
        const progress = Math.min(100, Math.max(0, Math.round(((xp - curLvlXp) / needed) * 100)));

        const lvlEl = document.getElementById(`mmo-sk-${sk.key}-lvl`);
        const fillEl = document.getElementById(`mmo-sk-${sk.key}-fill`);
        const xpEl = document.getElementById(`mmo-sk-${sk.key}-xp`);

        if (lvlEl) lvlEl.textContent = `Lv. ${lvl}`;
        if (fillEl) fillEl.style.width = `${progress}%`;
        if (xpEl) xpEl.textContent = `${(xp - curLvlXp).toLocaleString()} / ${needed.toLocaleString()} XP (%${progress})`;
      }
    },

    // ── BANK RENDER ──
    renderBank: function () {
      const bGrid = document.getElementById('mmo-bank-grid');
      const bagGrid = document.getElementById('mmo-bank-bag-grid');
      if (!bGrid || !bagGrid || !this.playerData) return;
      bGrid.innerHTML = '';
      bagGrid.innerHTML = '';

      const bank = this.playerData.bank || [];
      for (let i = 0; i < 48; i++) {
        const item = bank[i] || null;
        const slot = document.createElement('div');
        slot.className = 'mmo-item-slot';
        if (item) {
          const def = window.MmorpgData?.ITEMS[item.id];
          slot.innerHTML = `
            ${this.getItemIconSvg(def)}
            ${item.count > 1 ? `<span class="mmo-stack-tag">${item.count}</span>` : ''}
          `;
          slot.onclick = () => this.withdrawFromBank(item.id, 1);
        }
        bGrid.appendChild(slot);
      }

      const inv = this.playerData.inventory || [];
      for (let i = 0; i < 24; i++) {
        const item = inv[i] || null;
        const slot = document.createElement('div');
        slot.className = 'mmo-item-slot';
        if (item) {
          const def = window.MmorpgData?.ITEMS[item.id];
          slot.innerHTML = `
            ${this.getItemIconSvg(def)}
            ${item.count > 1 ? `<span class="mmo-stack-tag">${item.count}</span>` : ''}
          `;
          slot.onclick = () => this.depositToBank(item.id, 1);
        }
        bagGrid.appendChild(slot);
      }
    },

    depositToBank: function (itemId, count) {
      if (window._socket) window._socket.emit('mmorpg_bank_deposit', { itemId, count });
      this.triggerSfx('click');
    },

    withdrawFromBank: function (itemId, count) {
      if (window._socket) window._socket.emit('mmorpg_bank_withdraw', { itemId, count });
      this.triggerSfx('click');
    },

    // ── FORGE RENDER ──
    switchForgeTab: function (tab) {
      this.activeForgeTab = tab;
      const b1 = document.getElementById('mmo-tab-smelt');
      const b2 = document.getElementById('mmo-tab-forge');
      if (tab === 'smelt') {
        b1.style.opacity = '1'; b2.style.opacity = '0.5';
      } else {
        b1.style.opacity = '0.5'; b2.style.opacity = '1';
      }
      this.renderForge();
    },

    renderForge: function () {
      const list = document.getElementById('mmo-forge-recipes-list');
      if (!list || !window.MmorpgData || !this.playerData) return;
      list.innerHTML = '';

      const recipes = (this.activeForgeTab === 'smelt')
        ? window.MmorpgData.SMELTING_RECIPES
        : window.MmorpgData.FORGING_RECIPES;

      const mySmithLvl = this.playerData.smithLvl || 1;
      const inv = this.playerData.inventory || [];

      for (const rec of recipes) {
        const outDef = window.MmorpgData.ITEMS[rec.output.id];
        const canLvl = mySmithLvl >= (rec.reqLvl || 1);

        // Check materials
        let hasMats = true;
        const inStr = rec.inputs.map(inp => {
          const inDef = window.MmorpgData.ITEMS[inp.id];
          const hasCount = inv.find(it => it && it.id === inp.id)?.count || 0;
          if (hasCount < inp.count) hasMats = false;
          return `<span style="color:${hasCount >= inp.count ? '#4ade80' : '#f87171'}">${inp.count}x ${inDef?.name || inp.id} (${hasCount}/${inp.count})</span>`;
        }).join(', ');

        const card = document.createElement('div');
        card.style.cssText = `
          background: rgba(0,0,0,0.4); border: 1.5px solid ${canLvl && hasMats ? '#ffd700' : 'rgba(255,255,255,0.1)'};
          border-radius: 12px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;
        `;
        card.innerHTML = `
          <div>
            <div style="font-family:'Lilita One';font-size:14px;color:#ffd700;">${outDef?.name || rec.output.id}</div>
            <div style="font-size:10px;color:#cbd5e1;margin-top:2px;">Gereken: ${inStr}</div>
            <div style="font-size:9px;color:#94a3b8;margin-top:2px;">Seviye: ${rec.reqLvl} Demircilik | +${rec.xp} XP</div>
          </div>
          <button type="button" class="mmo-pop-btn use" style="width:75px;padding:6px 0;opacity:${canLvl && hasMats ? '1' : '0.4'};cursor:${canLvl && hasMats ? 'pointer' : 'not-allowed'};" ${canLvl && hasMats ? '' : 'disabled'}>
            ÜRET
          </button>
        `;
        card.querySelector('button').onclick = () => {
          if (canLvl && hasMats && window._socket) {
            window._socket.emit('mmorpg_craft', { recipeId: rec.id });
            this.triggerSfx('forge');
          }
        };
        list.appendChild(card);
      }
    },

    // ── SHOP RENDER ──
    renderShop: function () {
      const buyList = document.getElementById('mmo-shop-buy-list');
      const sellGrid = document.getElementById('mmo-shop-sell-grid');
      if (!buyList || !sellGrid || !this.playerData) return;
      buyList.innerHTML = '';
      sellGrid.innerHTML = '';

      // Potions to buy
      const pots = ['hp_potion_s', 'hp_potion_m', 'hp_potion_l', 'speed_elixir'];
      for (const pId of pots) {
        const def = window.MmorpgData?.ITEMS[pId];
        if (!def) continue;
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.3);padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);';
        row.innerHTML = `
          <div style="font-size:12px;font-weight:bold;">${def.name} <span class="text-xs text-gray-400">(${def.desc})</span></div>
          <button type="button" class="mmo-pop-btn bank" style="width:90px;font-size:11px;" onclick="MmorpgClient.buyItem('${pId}', 1)">
            🪙 ${def.price} AL
          </button>
        `;
        buyList.appendChild(row);
      }

      // Sell items from backpack
      const inv = this.playerData.inventory || [];
      for (let i = 0; i < 24; i++) {
        const item = inv[i] || null;
        const slot = document.createElement('div');
        slot.className = 'mmo-item-slot';
        if (item) {
          const def = window.MmorpgData?.ITEMS[item.id];
          const sellPrice = Math.max(1, Math.floor((def?.price || 5) * 0.45));
          slot.innerHTML = `
            ${this.getItemIconSvg(def)}
            ${item.count > 1 ? `<span class="mmo-stack-tag">${item.count}</span>` : ''}
          `;
          slot.title = `Sat: +${sellPrice} Altın`;
          slot.onclick = () => this.sellItem(item.id);
        }
        sellGrid.appendChild(slot);
      }
    },

    buyItem: function (itemId, count) {
      if (window._socket) window._socket.emit('mmorpg_merchant_buy', { itemId, count });
      this.triggerSfx('click');
    },

    sellItem: function (itemId) {
      if (window._socket) window._socket.emit('mmorpg_merchant_sell', { itemId });
      this.triggerSfx('click');
    },

    // ── POPOVER ACTION ──
    showPopover: function (e, item, idx, source) {
      const pop = document.getElementById('mmo-popover');
      if (!pop || !item) return;

      const def = window.MmorpgData?.ITEMS[item.id];
      if (!def) return;

      this.selectedItem = item;
      this.selectedItemIndex = idx;
      this.selectedItemSource = source;

      document.getElementById('mmo-pop-name').textContent = def.name;
      document.getElementById('mmo-pop-name').style.color = window.MmorpgData?.RARITIES[def.rarity]?.color || '#ffd700';
      document.getElementById('mmo-pop-desc').textContent = def.desc || '';

      // Stats text
      let statTxt = '';
      if (def.atk) statTxt += `⚔️ Saldırı: +${def.atk}  `;
      if (def.def) statTxt += `🛡️ Savunma: +${def.def}  `;
      if (def.hp) statTxt += `❤️ Can: +${def.hp}  `;
      if (def.spd) statTxt += `⚡ Hız: +${Math.round(def.spd * 100)}%  `;
      if (def.lifesteal) statTxt += `🩸 Can Çalma: +${Math.round(def.lifesteal * 100)}%  `;
      document.getElementById('mmo-pop-stats').textContent = statTxt;

      const actions = document.getElementById('mmo-pop-actions');
      actions.innerHTML = '';

      if (def.type === 'equipment') {
        const btn = document.createElement('button');
        btn.className = 'mmo-pop-btn equip';
        btn.textContent = 'KUŞAN (EQUIP)';
        btn.onclick = () => {
          if (window._socket) window._socket.emit('mmorpg_equip', { itemId: item.id });
          this.hidePopover();
          this.triggerSfx('equip');
        };
        actions.appendChild(btn);
      } else if (def.type === 'consumable') {
        const btn = document.createElement('button');
        btn.className = 'mmo-pop-btn use';
        btn.textContent = 'KULLAN (USE)';
        btn.onclick = () => {
          if (window._socket) window._socket.emit('mmorpg_use_item', { itemId: item.id });
          this.hidePopover();
          this.triggerSfx('heal');
        };
        actions.appendChild(btn);
      }

      // Position
      const rect = e.target.getBoundingClientRect();
      pop.style.top = `${Math.min(window.innerHeight - 180, Math.max(20, rect.top - 40))}px`;
      pop.style.left = `${Math.min(window.innerWidth - 240, rect.right + 10)}px`;
      pop.classList.add('open');
    },

    hidePopover: function () {
      const pop = document.getElementById('mmo-popover');
      if (pop) pop.classList.remove('open');
    },

    unequipSlot: function (slot) {
      if (window._socket) window._socket.emit('mmorpg_unequip', { slot });
      this.triggerSfx('equip');
    },

    getPotionCount: function () {
      if (!this.playerData || !this.playerData.inventory) return 0;
      let total = 0;
      for (const it of this.playerData.inventory) {
        if (it && (it.id === 'hp_potion_s' || it.id === 'hp_potion_m' || it.id === 'hp_potion_l')) {
          total += (it.count || 1);
        }
      }
      return total;
    },

    // ── HUD UPDATE ──
    updateHUD: function () {
      if (!this.playerData) return;
      const g = document.getElementById('mmo-gold-val');
      const cl = document.getElementById('mmo-clvl-val');
      if (g) g.textContent = (this.playerData.gold || 0).toLocaleString();
      if (cl) cl.textContent = `Lv. ${this.playerData.combatLvl || 1} Savaşçı`;

      // Update quick potion count & mobile eat button
      const totalPots = this.getPotionCount();
      const potCount = document.getElementById('mmo-potion-count');
      if (potCount) potCount.textContent = String(totalPots);
      const mobEatCount = document.getElementById('mobile-eat-count');
      if (mobEatCount) mobEatCount.textContent = String(totalPots);

      // Update mobile interact button highlight when near loot or NPC
      const interactBtn = document.getElementById('mobile-interact-btn');
      if (interactBtn && window.player) {
        let isNear = false;
        for (const [_, bag] of this.lootBags) {
          if (Math.hypot(window.player.x - bag.x, window.player.y - bag.y) <= 180) {
            isNear = true;
            break;
          }
        }
        if (!isNear) {
          if (Math.hypot(window.player.x - (-120), window.player.y - (-80)) <= 240) isNear = true;
          else if (Math.hypot(window.player.x - 140, window.player.y - (-70)) <= 240) isNear = true;
          else if (Math.hypot(window.player.x - 0, window.player.y - 130) <= 240) isNear = true;
        }
        if (isNear) interactBtn.classList.add('highlight');
        else interactBtn.classList.remove('highlight');
      }

      // Update zone name based on player pos
      const zoneEl = document.getElementById('mmo-zone-val');
      if (zoneEl && window.player) {
        const dist = Math.hypot(window.player.x, window.player.y);
        if (dist < 700) zoneEl.textContent = '🛡️ Doğuş Kasabası (Safe)';
        else if (dist < 2300) zoneEl.textContent = '🌿 Fısıldayan Koru (Lvl 1-15)';
        else if (window.player.y > 1800) zoneEl.textContent = '⛏️ Batık Taş Ocağı (Lvl 15-35)';
        else if (window.player.y < -1800) zoneEl.textContent = '❄️ Buzul Zirvesi (Lvl 35-55)';
        else zoneEl.textContent = '🔥 Lanetli Mahzen (Lvl 55+)';
      }
    },

    showLevelUpBanner: function (skill, level) {
      const toast = document.getElementById('mmo-lvl-toast');
      const text = document.getElementById('mmo-lvl-toast-text');
      if (!toast || !text) return;

      const skillNames = { combat: 'Savaş', mining: 'Madencilik', wood: 'Odunculuk', smith: 'Demircilik' };
      text.textContent = `⚔️ ${skillNames[skill] || skill} Seviyesi ${level} Oldu!`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3200);
    },

    getItemIconSvg: function (def) {
      if (!def) return '';
      const col = def.iconColor || '#cbd5e1';
      switch (def.icon) {
        case 'sword':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l2 2 4-4-2-2M19 5l2 2"/></svg>`;
        case 'shield':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
        case 'pickaxe':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M14 4l6 6M2 22l11-11M16 2l6 6-3 3-6-6 3-3z"/></svg>`;
        case 'axe':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M14 4l6 6M3 21l9-9M12 4l8 8-4 4-8-8 4-4z"/></svg>`;
        case 'helmet':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M12 2a9 9 0 00-9 9v7h18v-7a9 9 0 00-9-9z"/><path d="M7 14h10"/></svg>`;
        case 'chest':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M4 4h4l4 3 4-3h4v8l-4 8H8L4 12V4z"/></svg>`;
        case 'potion':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M9 2h6v3H9V2zM6 9a6 6 0 0012 0v10a3 3 0 01-3 3H9a3 3 0 01-3-3V9z"/></svg>`;
        case 'ore':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M12 2l8 5v10l-8 5-8-5V7l8-5z"/></svg>`;
        case 'bar':
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><path d="M3 14l3-6h12l3 6-3 6H6l-3-6z"/></svg>`;
        default:
          return `<svg viewBox="0 0 24 24" class="mmo-item-icon" fill="none" stroke="${col}" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>`;
      }
    },

    triggerSfx: function (name) {
      if (typeof window.playSfx === 'function') window.playSfx(name === 'pickup' ? 'pop' : 'click');
    }
  };

  window.MmorpgClient = MmorpgClient;
})(window);
