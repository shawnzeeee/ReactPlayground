import React, { useState, useEffect } from "react";
import "./App.css";

// Type for artwork
interface Artwork {
  id: number;
  title: string;
  artist: string;
  style: string;
  period: string;
  technique: string;
  image: string;
  votes: number;
}

// Mock data for demonstration
const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Starry Night",
    artist: "Vincent van Gogh",
    style: "Post-Impressionism",
    period: "1889",
    technique: "Oil on canvas",
    image: "https://uploads7.wikiart.org/images/vincent-van-gogh/the-starry-night-1889.jpg",
    votes: 120,
  },
  {
    id: 2,
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    style: "Surrealism",
    period: "1931",
    technique: "Oil on canvas",
    image: "https://uploads8.wikiart.org/images/salvador-dali/the-persistence-of-memory-1931.jpg",
    votes: 98,
  },
  {
    id: 3,
    title: "The Kiss",
    artist: "Gustav Klimt",
    style: "Symbolism",
    period: "1907-1908",
    technique: "Oil and gold leaf on canvas",
    image: "https://uploads0.wikiart.org/images/gustav-klimt/the-kiss-1908.jpg",
    votes: 110,
  },
  // ...add more artworks as needed
];

const periods = ["All", ...Array.from(new Set(ARTWORKS.map(a => a.period)))];
const techniques = ["All", ...Array.from(new Set(ARTWORKS.map(a => a.technique)))];

function App() {
  const [gallery, setGallery] = useState<Artwork[]>(ARTWORKS);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All");
  const [technique, setTechnique] = useState("All");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [artOfDay, setArtOfDay] = useState<Artwork>(ARTWORKS[0]);

  useEffect(() => {
    // Art of the day: most votes
    setArtOfDay(ARTWORKS.reduce((a, b) => (a.votes > b.votes ? a : b)));
  }, []);

  useEffect(() => {
    let filtered = ARTWORKS.filter(
      (a) =>
        (period === "All" || a.period === period) &&
        (technique === "All" || a.technique === technique) &&
        (a.artist.toLowerCase().includes(search.toLowerCase()) ||
          a.style.toLowerCase().includes(search.toLowerCase()) ||
          a.title.toLowerCase().includes(search.toLowerCase()))
    );
    setGallery(filtered);
  }, [search, period, technique]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-2 md:p-8">
      {/* Art of the Day */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
        <img
          src={artOfDay.image}
          alt={artOfDay.title}
          className="w-full max-w-xs rounded-lg shadow-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Art Piece of the Day</h2>
          <div className="text-lg font-semibold">{artOfDay.title}</div>
          <div className="text-gray-600">by {artOfDay.artist}</div>
          <div className="text-gray-500 text-sm mb-2">{artOfDay.period} &middot; {artOfDay.technique}</div>
          <div className="text-yellow-600 font-bold">Votes: {artOfDay.votes}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by artist, style, or title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {periods.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={technique}
          onChange={e => setTechnique(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {techniques.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map(art => (
          <div
            key={art.id}
            className="bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer flex flex-col"
            onClick={() => setSelected(art)}
          >
            <img
              src={art.image}
              alt={art.title}
              className="h-40 md:h-56 w-full object-cover rounded-t-lg"
            />
            <div className="p-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="font-bold text-sm md:text-base truncate">{art.title}</div>
                <div className="text-xs text-gray-500 truncate">{art.artist}</div>
              </div>
              <button
                className={`mt-2 px-2 py-1 rounded text-xs font-semibold ${wishlist.includes(art.id) ? "bg-pink-200 text-pink-700" : "bg-gray-200 text-gray-600"}`}
                onClick={e => { e.stopPropagation(); toggleWishlist(art.id); }}
              >
                {wishlist.includes(art.id) ? "Wishlisted" : "Add to Wish-list"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-size Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setSelected(null)}
            >
              &times;
            </button>
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-72 object-contain rounded mb-4"
            />
            <div className="font-bold text-xl mb-1">{selected.title}</div>
            <div className="text-gray-600 mb-1">by {selected.artist}</div>
            <div className="text-gray-500 text-sm mb-2">{selected.period} &middot; {selected.technique}</div>
            <div className="mb-2">Style: {selected.style}</div>
            <div className="text-yellow-600 font-bold mb-2">Votes: {selected.votes}</div>
            <button
              className={`px-4 py-2 rounded font-semibold ${wishlist.includes(selected.id) ? "bg-pink-200 text-pink-700" : "bg-gray-200 text-gray-600"}`}
              onClick={() => toggleWishlist(selected.id)}
            >
              {wishlist.includes(selected.id) ? "Wishlisted" : "Add to Wish-list"}
            </button>
          </div>
        </div>
      )}

      {/* Wish-list */}
      {wishlist.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs w-full z-40">
          <div className="font-bold mb-2 text-blue-700">Wish-list</div>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {wishlist.map(id => {
              const art = ARTWORKS.find(a => a.id === id);
              return art ? (
                <li key={id} className="flex items-center justify-between">
                  <span className="truncate">{art.title}</span>
                  <button
                    className="ml-2 text-xs text-red-500 hover:underline"
                    onClick={() => toggleWishlist(id)}
                  >
                    Remove
                  </button>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
