import { useEffect, useMemo, useState } from "react";
import { FILTERS, TYPE_META } from "../model/savedData.js";

const SAVED_ITEMS_KEY = "campus-mind.savedItems";
const SAVED_COLLECTIONS_KEY = "campus-mind.savedCollections";

const DEFAULT_COLLECTIONS = [
  { id: "all", name: "All items" },
];

function getStoredItems() {
  try {
    const raw = localStorage.getItem(SAVED_ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredCollections() {
  try {
    const raw = localStorage.getItem(SAVED_COLLECTIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure 'all' is always present at index 0
      const hasAll = parsed.some((c) => c.id === "all");
      return hasAll ? parsed : [{ id: "all", name: "All items" }, ...parsed];
    }
    return DEFAULT_COLLECTIONS;
  } catch {
    return DEFAULT_COLLECTIONS;
  }
}

export function useSavedItems() {
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(getStoredItems);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState(getStoredCollections);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_COLLECTIONS_KEY, JSON.stringify(collections));
    } catch {
      // Ignore storage errors
    }
  }, [collections]);

  const collectionsWithCount = useMemo(() => {
    return collections.map((col) => {
      if (col.id === "all") {
        return { ...col, count: items.length };
      }
      return {
        ...col,
        count: items.filter((item) => item.collection === col.id).length,
      };
    });
  }, [collections, items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCollection =
        activeCollection === "all" || item.collection === activeCollection;
      const matchesFilter =
        activeFilter === "all" || item.type === activeFilter;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.snippet.toLowerCase().includes(normalizedQuery) ||
        item.meta.toLowerCase().includes(normalizedQuery);
      return matchesCollection && matchesFilter && matchesQuery;
    });
  }, [items, activeCollection, activeFilter, query]);

  const handleUnsave = (id) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  const handleCreateCollection = (event) => {
    event.preventDefault();
    const name = newCollectionName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setCollections((previous) => [...previous, { id, name }]);
    setNewCollectionName("");
    setShowNewCollection(false);
    setActiveCollection(id);
  };

  return {
    activeCollection,
    activeFilter,
    collections: collectionsWithCount,
    filteredItems,
    filters: FILTERS,
    newCollectionName,
    query,
    showNewCollection,
    typeMeta: TYPE_META,
    handleCreateCollection,
    handleUnsave,
    setActiveCollection,
    setActiveFilter,
    setNewCollectionName,
    setQuery,
    setShowNewCollection,
  };
}

