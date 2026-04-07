(function () {
  const ACTIVE_KEY = 'spr.records.active.v1';
  const TRASH_KEY = 'spr.records.trash.v1';
  const TOOL_ORDER = ['search', 'browser', 'reader', 'ocr', 'chat'];

  function safeJsonParse(value, fallback) {
    try {
      const parsed = JSON.parse(value || 'null');
      return parsed ?? fallback;
    } catch (error) {
      return fallback;
    }
  }

  function load(key) {
    const list = safeJsonParse(localStorage.getItem(key), []);
    return Array.isArray(list) ? list : [];
  }

  function save(key, list) {
    localStorage.setItem(key, JSON.stringify(Array.isArray(list) ? list : []));
  }

  function makeId() {
    return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function normalizeTool(tool) {
    const clean = String(tool || '').trim().toLowerCase();
    return TOOL_ORDER.includes(clean) ? clean : 'search';
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 42) || 'item';
  }

  function makeFileName(tool, title, createdAt) {
    const stamp = new Date(createdAt || Date.now()).toISOString().replace(/[\:\.]/g, '-');
    return `${normalizeTool(tool)}-${slugify(title)}-${stamp}.json`;
  }

  function normalizeRecord(tool, payload = {}) {
    const now = new Date().toISOString();
    const finalTool = normalizeTool(tool || payload.tool);
    const createdAt = payload.createdAt || now;
    const title = String(payload.title || '').trim() || 'Untitled';
    return {
      id: payload.id || makeId(),
      tool: finalTool,
      title,
      summary: String(payload.summary || '').trim(),
      content: String(payload.content || '').trim(),
      link: String(payload.link || '').trim(),
      meta: payload.meta && typeof payload.meta === 'object' ? payload.meta : {},
      fileId: String(payload.fileId || payload.id || makeId()).trim(),
      fileName: String(payload.fileName || '').trim() || makeFileName(finalTool, title, createdAt),
      createdAt,
      updatedAt: payload.updatedAt || now,
      deletedAt: payload.deletedAt || ''
    };
  }

  function sortDesc(list) {
    return [...list].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }

  function dedupeById(list) {
    const map = new Map();
    list.forEach((item) => {
      const clean = normalizeRecord(item.tool, item);
      const current = map.get(clean.id);
      if (!current || new Date(clean.updatedAt || clean.createdAt || 0) >= new Date(current.updatedAt || current.createdAt || 0)) {
        map.set(clean.id, clean);
      }
    });
    return sortDesc([...map.values()]);
  }

  function emitChange() {
    window.dispatchEvent(new CustomEvent('spr:records-changed'));
  }

  const AppRecords = {
    toolOrder: TOOL_ORDER,

    list(tool = 'all') {
      const all = sortDesc(load(ACTIVE_KEY));
      if (tool === 'all') return all;
      return all.filter((item) => item.tool === normalizeTool(tool));
    },

    listTrash(tool = 'all') {
      const all = sortDesc(load(TRASH_KEY));
      if (tool === 'all') return all;
      return all.filter((item) => item.tool === normalizeTool(tool));
    },

    get(recordId, scope = 'active') {
      const id = String(recordId || '').trim();
      if (!id) return null;
      const source = scope === 'trash' ? this.listTrash('all') : this.list('all');
      return source.find((item) => item.id === id) || null;
    },

    getCounts() {
      const active = this.list('all');
      const trash = this.listTrash('all');
      const counts = { all: active.length, trash: trash.length };
      TOOL_ORDER.forEach((tool) => {
        counts[tool] = active.filter((item) => item.tool === tool).length;
      });
      return counts;
    },

    save(tool, payload = {}) {
      const next = normalizeRecord(tool, payload);
      const active = load(ACTIVE_KEY);
      const index = active.findIndex((item) => item.id === next.id);
      if (index >= 0) active[index] = { ...active[index], ...next, updatedAt: new Date().toISOString() };
      else active.unshift(next);
      save(ACTIVE_KEY, dedupeById(active).slice(0, 800));
      emitChange();
      return next;
    },

    trash(recordId) {
      const id = String(recordId || '').trim();
      if (!id) return false;
      const active = load(ACTIVE_KEY);
      const index = active.findIndex((item) => item.id === id);
      if (index < 0) return false;
      const [record] = active.splice(index, 1);
      const trash = load(TRASH_KEY);
      trash.unshift({ ...record, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      save(ACTIVE_KEY, dedupeById(active).slice(0, 800));
      save(TRASH_KEY, dedupeById(trash).slice(0, 800));
      emitChange();
      return true;
    },

    restore(recordId) {
      const id = String(recordId || '').trim();
      if (!id) return false;
      const trash = load(TRASH_KEY);
      const index = trash.findIndex((item) => item.id === id);
      if (index < 0) return false;
      const [record] = trash.splice(index, 1);
      const active = load(ACTIVE_KEY);
      active.unshift({ ...record, deletedAt: '', updatedAt: new Date().toISOString() });
      save(TRASH_KEY, dedupeById(trash).slice(0, 800));
      save(ACTIVE_KEY, dedupeById(active).slice(0, 800));
      emitChange();
      return true;
    },

    restoreLastDeleted() {
      const latest = this.listTrash('all')[0];
      if (!latest) return false;
      return this.restore(latest.id);
    },

    removeForever(recordId) {
      const id = String(recordId || '').trim();
      if (!id) return false;
      const trash = load(TRASH_KEY);
      const next = trash.filter((item) => item.id !== id);
      if (next.length === trash.length) return false;
      save(TRASH_KEY, next);
      emitChange();
      return true;
    },

    clearTrash() {
      save(TRASH_KEY, []);
      emitChange();
    },

    importData(data, mode = 'merge') {
      const payload = data && typeof data === 'object' ? data : {};
      const importedActive = Array.isArray(payload.active) ? payload.active.map((item) => normalizeRecord(item.tool, item)) : [];
      const importedTrash = Array.isArray(payload.trash) ? payload.trash.map((item) => normalizeRecord(item.tool, item)) : [];
      const baseActive = mode === 'replace' ? [] : load(ACTIVE_KEY);
      const baseTrash = mode === 'replace' ? [] : load(TRASH_KEY);
      const nextActive = dedupeById([...baseActive, ...importedActive]).slice(0, 800);
      const nextTrash = dedupeById([...baseTrash, ...importedTrash]).slice(0, 800);
      save(ACTIVE_KEY, nextActive);
      save(TRASH_KEY, nextTrash);
      emitChange();
      return { activeCount: nextActive.length, trashCount: nextTrash.length };
    },

    exportRecord(recordId, scope = 'active') {
      const record = this.get(recordId, scope);
      if (!record) return null;
      return {
        version: 'v5',
        exportedAt: new Date().toISOString(),
        scope,
        record
      };
    },

    exportAll() {
      return {
        active: this.list('all'),
        trash: this.listTrash('all'),
        exportedAt: new Date().toISOString(),
        version: 'v5'
      };
    }
  };

  window.AppRecords = AppRecords;
})();
