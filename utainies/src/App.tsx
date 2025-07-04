import React, { useState, useEffect, useMemo } from 'react';
import { CategoryKey, ContentItem, SingleVideo, Series, Episode } from './types';
import { CATEGORIES } from './constants';
import VideoPlayer from './components/VideoPlayer';

const GITHUB_CONTENT_BASE_URL = 'https://raw.githubusercontent.com/sastamaa/utainies_app/main/';

const Header: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <header className={`text-center ${className}`}>
    <h1 className="text-4xl sm:text-6xl font-bold text-sky-800 tracking-tight" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif" }}>
      {children}
    </h1>
  </header>
);

const BackButton: React.FC<{ onClick: () => void, text: string }> = ({ onClick, text }) => (
  <button
    onClick={onClick}
    className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-white transition-transform duration-200 hover:scale-105 flex items-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
    {text}
  </button>
);


const App: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Episode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const savedFavorites = localStorage.getItem('utainies_favorites_el');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
        console.error('Could not load favorites from localStorage', error);
        return [];
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem('utainies_favorites_el', JSON.stringify(favorites));
    } catch (error) {
        console.error('Could not save favorites to localStorage', error);
    }
  }, [favorites]);

  useEffect(() => {
    const fetchAllContent = async () => {
      setIsLoading(true);
      setError(null);
      
      const contentCategoryKeys = Object.keys(CATEGORIES) as Exclude<CategoryKey, CategoryKey.FAVORITES>[];
      
      try {
        const fetchPromises = contentCategoryKeys.map(key => {
            const url = `${GITHUB_CONTENT_BASE_URL}${key}.json?t=${new Date().getTime()}`;
            return fetch(url, { cache: 'no-store' })
                .then(response => {
                    if (response.ok) return response.json();
                    if (response.status === 404) {
                       console.warn(`Δεν βρέθηκε αρχείο για την κατηγορία '${key}'. Παράβλεψη.`);
                       return [];
                    }
                    throw new Error(`Σφάλμα φόρτωσης ${key}: ${response.statusText}`);
                })
                .catch(err => {
                    console.error(`Αποτυχία φόρτωσης κατηγορίας ${key}:`, err.message);
                    return [];
                });
        });

        const results = await Promise.all(fetchPromises);
        const allContent = results.flat() as ContentItem[];

        if (allContent.length === 0 && !error) {
             setError('Δεν ήταν δυνατή η φόρτωση περιεχομένου. Ελέγξτε τη σύνδεση GitHub και την ύπαρξη των αρχείων.');
        } else {
             setContent(allContent);
        }
        
      } catch (e) {
         console.error("Παρουσιάστηκε ένα γενικό σφάλμα κατά τη φόρτωση των δεδομένων:", e);
         setError('Η φόρτωση του περιεχομένου απέτυχε. Ελέγξτε τη σύνδεσή σας στο διαδίκτυο.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prevFavorites => {
        if (prevFavorites.includes(itemId)) {
            return prevFavorites.filter(id => id !== itemId);
        } else {
            return [...prevFavorites, itemId];
        }
    });
  };

  const handleSelectCategory = (key: CategoryKey) => {
    setSelectedCategory(key);
    setSelectedSeries(null);
    setCurrentEpisode(null);
  };
  
  const handleContentItemClick = (item: ContentItem) => {
    if (item.contentType === 'series') {
        setSelectedSeries(item);
    } else {
        setCurrentEpisode(item as SingleVideo);
        setCurrentPlaylist([]);
    }
  };
  
  const handleSelectEpisode = (episode: Episode, series: Series) => {
    const playlist = series.seasons.flatMap(s => s.episodes);
    setCurrentPlaylist(playlist);
    setCurrentEpisode(episode);
  };
  
  const handleNextEpisode = () => {
    if (!currentEpisode || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(e => e.id === currentEpisode.id);
    if (currentIndex > -1 && currentIndex < currentPlaylist.length - 1) {
      setCurrentEpisode(currentPlaylist[currentIndex + 1]);
    }
  };

  const handlePrevEpisode = () => {
    if (!currentEpisode || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(e => e.id === currentEpisode.id);
    if (currentIndex > 0) {
      setCurrentEpisode(currentPlaylist[currentIndex - 1]);
    }
  };
  
  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleBackToGrid = () => {
    setSelectedSeries(null);
  };

  const handleClosePlayer = () => {
    setCurrentEpisode(null);
    setCurrentPlaylist([]);
  };

  const filteredContent = useMemo(() => {
    if (!selectedCategory) return [];

    if (selectedCategory === CategoryKey.FAVORITES) {
        return content.filter(item => favorites.includes(item.id));
    }
    
    return content.filter(v => v.category === selectedCategory);
  }, [content, selectedCategory, favorites]);

  const renderContent = () => {
    if (isLoading) {
       return <div className="flex justify-center items-center h-screen text-2xl font-bold text-sky-700">Φόρτωση...</div>;
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center h-screen p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-lg text-center" role="alert">
            <strong className="font-bold block">Σφάλμα!</strong>
            <span className="block mt-1">{error}</span>
          </div>
        </div>
      );
    }
    
    if (currentEpisode) {
      const isPlaylist = currentPlaylist.length > 0;
      return <VideoPlayer 
        episode={currentEpisode} 
        onClose={handleClosePlayer} 
        onNext={isPlaylist ? handleNextEpisode : undefined}
        onPrev={isPlaylist ? handlePrevEpisode : undefined}
      />;
    }

    if (selectedSeries) {
      return (
         <div className="relative min-h-screen w-full animate-fade-in p-4">
            <BackButton onClick={handleBackToGrid} text="Πίσω στη λίστα" />
            <Header className="pt-12">{selectedSeries.title}</Header>
            <div className="max-w-4xl mx-auto">
              {selectedSeries.seasons.map(season => (
                <div key={season.season} className="mb-8">
                  <h2 className="text-3xl font-bold text-sky-700 mb-4 border-b-2 border-sky-200 pb-2">Σεζόν {season.season}</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {season.episodes.map(episode => (
                         <div key={episode.id} onClick={() => handleSelectEpisode(episode, selectedSeries)} className="cursor-pointer group flex flex-col items-center text-center">
                            <div className="w-full aspect-video bg-sky-200 rounded-lg flex items-center justify-center text-sky-500 mb-2 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-transform duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                            </div>
                            <p className="font-semibold text-sky-800 group-hover:text-pink-500">{episode.title}</p>
                         </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
         </div>
      );
    }

    if (selectedCategory) {
      // Find category info safely
      const categoryInfo = selectedCategory === CategoryKey.FAVORITES 
        ? { name: 'Αγαπημένα' } 
        : CATEGORIES[selectedCategory as Exclude<CategoryKey, CategoryKey.FAVORITES>];
      
      if (selectedCategory === CategoryKey.FAVORITES && filteredContent.length === 0) {
        return (
          <div className="relative min-h-screen w-full animate-fade-in flex flex-col items-center justify-center text-center p-4">
            <BackButton onClick={handleBackToCategories} text="Στις κατηγορίες" />
            <div className="bg-yellow-100 border-2 border-yellow-300 text-yellow-800 p-8 rounded-2xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <h2 className="text-3xl font-bold mb-2">Εδώ δεν υπάρχει τίποτα ακόμα!</h2>
                <p className="text-lg">Πάτα την καρδούλα ❤️ στα βίντεο για να τα προσθέσεις εδώ.</p>
            </div>
          </div>
        );
      }

      return (
        <div className="relative min-h-screen w-full animate-fade-in">
          <BackButton onClick={handleBackToCategories} text="Στις κατηγορίες" />
          <Header className="pt-12">{categoryInfo.name}</Header>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                onClick={() => handleContentItemClick(item)}
                className="group cursor-pointer aspect-video bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative w-full h-full">
                  <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       handleToggleFavorite(item.id);
                     }}
                     className="absolute top-2 left-2 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
                     aria-label={favorites.includes(item.id) ? 'Αφαίρεση από τα αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill={favorites.includes(item.id) ? '#EF4444' : 'none'} stroke={favorites.includes(item.id) ? 'none' : 'white'} strokeWidth="1.5">
                       <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/70 group-hover:text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                     </svg>
                  </div>
                  {item.contentType === 'series' && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold py-1 px-2 rounded-full">Σειρά</div>
                  )}
                  <p className="absolute bottom-0 left-0 right-0 text-white font-bold p-2 text-center text-sm truncate bg-black/40">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    const categoryList = Object.values(CATEGORIES);
    const topRowCategories = categoryList.slice(0, 3);
    const bottomRowCategories = categoryList.slice(3, 6);

    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center p-4 sm:p-6 gap-4">
            <button
              onClick={() => handleSelectCategory(CategoryKey.FAVORITES)}
              aria-label="Προβολή αγαπημένων"
              className="p-3 bg-red-400 text-white rounded-full shadow-lg hover:bg-red-500 transition-transform duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
            <Header className="flex-grow">UTainies</Header>
        </div>
        <div className="flex flex-col items-center gap-6 p-6">
          <div className="flex justify-center flex-wrap gap-6">
            {topRowCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleSelectCategory(cat.key)}
                className={`flex flex-col items-center justify-center w-60 h-60 sm:w-72 sm:h-72 rounded-2xl text-white font-bold text-3xl shadow-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl ${cat.color} ${cat.hoverColor}`}
              >
                <div className="mb-4">{cat.icon}</div>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center flex-wrap gap-6">
            {bottomRowCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleSelectCategory(cat.key)}
                className={`flex flex-col items-center justify-center w-60 h-60 sm:w-72 sm:h-72 rounded-2xl text-white font-bold text-3xl shadow-lg transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl ${cat.color} ${cat.hoverColor}`}
              >
                <div className="mb-4">{cat.icon}</div>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
      <main className="min-h-screen w-full bg-sky-100 overflow-x-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="relative">
          {renderContent()}
        </div>
      </main>
  );
};

export default App;
