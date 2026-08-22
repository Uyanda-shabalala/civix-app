import { useEffect, useRef, useState } from "react";
import { fetchAddressPredictions, fetchPlaceDetails, newSessionToken } from "../lib/googlePlaces";

/**
 * Address input with a live Google Places dropdown underneath it.
 * Calls onSelect({ address, lat, lng }) once the resident picks a suggestion.
 */
export default function AddressAutocomplete({ value, onChange, onSelect, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionToken = useRef(newSessionToken());
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(e) {
    const text = e.target.value;
    onChange(text);
    setOpen(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await fetchAddressPredictions(text, sessionToken.current);
      setSuggestions(results);
      setLoading(false);
    }, 300); // debounce so we're not firing a request on every keystroke
  }

  async function handleSelect(prediction) {
    setOpen(false);
    onChange(prediction.fullText);
    const details = await fetchPlaceDetails(prediction.placeId, sessionToken.current);
    if (details) onSelect(details);
    sessionToken.current = newSessionToken(); // start a fresh session for the next search
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="field">
        <span className="ic">📍</span>
        <input
          value={value}
          onChange={handleInputChange}
          onFocus={() => value && setOpen(true)}
          placeholder={placeholder || "Start typing your address…"}
          className="flex-1 outline-none text-sm bg-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSuggestions([]);
            }}
            className="text-gray-400 hover:text-gray-600 text-sm"
            aria-label="Clear address"
          >
            ✕
          </button>
        )}
      </div>

      {open && (loading || suggestions.length > 0) && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-brand-line rounded-xl shadow-lg overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-xs text-brand-muted">Searching…</div>
          )}
          {!loading &&
            suggestions.map((s) => (
              <button
                type="button"
                key={s.placeId}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-brand-card border-b border-brand-line last:border-b-0"
              >
                <span className="text-gray-400 mt-0.5">📍</span>
                <span className="text-sm">
                  <span className="font-bold text-brand-ink">{s.mainText}</span>{" "}
                  <span className="text-brand-muted">{s.secondaryText}</span>
                </span>
              </button>
            ))}
          {!loading && (
            <div className="px-4 py-2 text-[10px] text-right text-brand-muted bg-brand-card">
              powered by Google
            </div>
          )}
        </div>
      )}
    </div>
  );
}
