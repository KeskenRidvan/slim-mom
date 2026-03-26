import { useEffect, useMemo, useState } from "react";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function scoreProduct(productName, query) {
  const name = normalizeText(productName);
  const term = normalizeText(query);

  if (!name || !term) return Number.MAX_SAFE_INTEGER;
  if (name === term) return 0;
  if (name.startsWith(term)) return 1;
  if (name.includes(term)) return 2;
  return Number.MAX_SAFE_INTEGER;
}

function buildSuggestions(query, serverResults, fallbackProducts = []) {
  const term = normalizeText(query);
  if (!term) return [];

  const map = new Map();

  [...serverResults, ...fallbackProducts].forEach((item) => {
    if (!item?.id || !item?.name) return;
    map.set(item.id, item);
  });

  return [...map.values()]
    .map((item) => ({ ...item, _score: scoreProduct(item.name, term) }))
    .filter((item) => item._score !== Number.MAX_SAFE_INTEGER)
    .sort((a, b) => a._score - b._score || a.name.localeCompare(b.name))
    .slice(0, 8)
    .map(({ _score, ...item }) => item);
}

export function DiaryAddProductForm({ onAddProduct, onSearchProducts, loading = false }) {
  const [productName, setProductName] = useState("");
  const [grams, setGrams] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadAllProducts = async () => {
      try {
        const products = await onSearchProducts("");
        if (!active) return;
        setAllProducts(Array.isArray(products) ? products : []);
      } catch (requestError) {
        if (!active) return;
        setAllProducts([]);
      }
    };

    loadAllProducts();
    return () => {
      active = false;
    };
  }, [onSearchProducts]);

  useEffect(() => {
    const query = productName.trim();

    if (!query) {
      setSearchResults([]);
      return undefined;
    }

    if (selectedProduct && normalizeText(selectedProduct.name) === normalizeText(query)) {
      setSearchResults([]);
      return undefined;
    }

    let isCurrent = true;
    const timerId = setTimeout(async () => {
      try {
        const serverResults = await onSearchProducts(query);
        if (!isCurrent) return;
        const suggestions = buildSuggestions(query, serverResults, allProducts);
        setSearchResults(suggestions);
      } catch (requestError) {
        if (!isCurrent) return;
        const suggestions = buildSuggestions(query, [], allProducts);
        setSearchResults(suggestions);
      }
    }, 220);

    return () => {
      isCurrent = false;
      clearTimeout(timerId);
    };
  }, [allProducts, onSearchProducts, productName, selectedProduct]);

  const canSubmit = useMemo(
    () => productName.trim().length > 0 && Number(grams) > 0 && !loading,
    [grams, loading, productName]
  );

  const handlePickProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setSearchResults([]);
    setError("");
  };

  const handleProductChange = (event) => {
    setProductName(event.target.value);
    setSelectedProduct(null);
    setError("");
  };

  const resolveProductFromInput = async (query) => {
    if (selectedProduct) return selectedProduct;

    const suggestionsFromUI = buildSuggestions(query, searchResults, allProducts);
    if (suggestionsFromUI.length > 0) return suggestionsFromUI[0];

    const serverResults = await onSearchProducts(query);
    const suggestions = buildSuggestions(query, serverResults, allProducts);
    return suggestions[0] || null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (Number(grams) <= 0) {
      setError("Gram değeri 0'dan büyük olmalı.");
      return;
    }

    const query = productName.trim();
    if (!query) {
      setError("Lütfen ürün adı gir.");
      return;
    }

    try {
      const productToAdd = await resolveProductFromInput(query);
      if (!productToAdd) {
        setError("Ürün bulunamadı. Listeden bir ürün seç.");
        return;
      }

      await onAddProduct({ productId: productToAdd.id, grams: Number(grams) });

      setProductName("");
      setGrams("");
      setSelectedProduct(null);
      setSearchResults([]);
    } catch (requestError) {
      setError(requestError.message || "Ürün eklenemedi.");
    }
  };

  return (
    <form className="diary-add-product-form" onSubmit={handleSubmit}>
      <div className="diary-field diary-field--product">
        <label htmlFor="diary-product">Enter product name</label>
        <input
          id="diary-product"
          type="text"
          autoComplete="off"
          value={productName}
          onChange={handleProductChange}
        />

        {searchResults.length > 0 && (
          <ul className="diary-search-list">
            {searchResults.map((product) => (
              <li key={product.id}>
                <button type="button" onClick={() => handlePickProduct(product)}>
                  {product.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="diary-field diary-field--grams">
        <label htmlFor="diary-grams">Grams</label>
        <input
          id="diary-grams"
          type="number"
          min="1"
          value={grams}
          onChange={(event) => setGrams(event.target.value)}
        />
      </div>

      <button
        type="submit"
        className="diary-add-button"
        aria-label="Add product"
        disabled={!canSubmit}
      >
        +
      </button>

      {error && <p className="diary-inline-error">{error}</p>}
    </form>
  );
}
