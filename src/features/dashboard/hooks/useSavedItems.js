import { useMemo, useState } from "react";
import { COLLECTIONS, FILTERS, SAVED_ITEMS, TYPE_META } from "../model/savedData.js";

export function useSavedItems() {
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(SAVED_ITEMS);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState(COLLECTIONS);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCollection =
        activeCollection === "all" || item.collection === activeCollection;
      const matchesFilter = activeFilter === "all" || item.type === activeFilter;
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
    setCollections((previous) => [...previous, { id, name, count: 0 }]);
    setNewCollectionName("");
    setShowNewCollection(false);
    setActiveCollection(id);
  };

  return {
    activeCollection,
    activeFilter,
    collections,
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
