// ===== ZED SLANGS DICTIONARY JAVASCRIPT =====

// Global variables
let allSlangs = [];
let filteredSlangs = [];
let favorites = [];
let isShowingAllSlangs = false;
const INITIAL_DISPLAY_COUNT = 6; // Show only 6 slangs initially

// === Audio Player ===
const AUDIO_BASE_PATH = 'assets/audio/'; // adjust if your audio folder differs
let audioPlayer = new Audio();
audioPlayer.preload = 'auto';

function getAudioUrlForSlang(slang) {
    if (!slang || !slang.audio) return null;
    return AUDIO_BASE_PATH + encodeURIComponent(slang.audio);
}


// Keep track of the currently active button
let activeAudioButton = null;

function playAudioForSlang(slang, uiBtn) {
    const url = getAudioUrlForSlang(slang);
    if (!url) {
        showNotification('No audio found for this slang.');
        return;
    }

    try {
        // Reset any previous button state
        if (activeAudioButton && activeAudioButton !== uiBtn) {
            activeAudioButton.disabled = false;
            activeAudioButton.textContent = activeAudioButton.dataset.originalText || '🔊 Play';
        }

        // Pause any currently playing audio
        audioPlayer.pause();

        // Load new audio
        audioPlayer.src = url;
        audioPlayer.currentTime = 0;

        // If button provided, update UI
        if (uiBtn) {
            // Save original button text
            uiBtn.dataset.originalText = uiBtn.textContent;
            uiBtn.disabled = true;
            uiBtn.textContent = '🔊 Playing...';
            activeAudioButton = uiBtn;
        }

        // Get the slang text (handle if slang is object or string)
        let slangText = typeof slang === 'object' && slang.word ? slang.word : slang;

        // Show notification: "<slang> playing"
        showNotification(`${slangText} playing`);

        // When audio ends, reset button state
        audioPlayer.onended = () => {
            if (uiBtn) {
                uiBtn.disabled = false;
                uiBtn.textContent = uiBtn.dataset.originalText;
            }
            activeAudioButton = null;
        };

        // Play the audio
        audioPlayer.play().catch(err => {
            if (uiBtn) {
                uiBtn.disabled = false;
                uiBtn.textContent = uiBtn.dataset.originalText;
            }
            console.error('Audio play error:', err);
            showNotification('audio not found.');
            activeAudioButton = null;
        });
    } catch (e) {
        console.error(e);
        showNotification('Audio not supported in this browser.');
        activeAudioButton = null;
    }
}







// Initialize favorites from localStorage
favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Helper function to create unique ID for slang entries
function createSlangId(slang) {
    return `${slang.word}-${slang.language}-${slang.category}`;
}

// Helper function to find slang by unique ID
function findSlangById(slangId) {
    return allSlangs.find(slang => createSlangId(slang) === slangId);
}


// ===== SLANG DATA LOADING =====
async function loadSlangs() {
    try {
        console.log('Loading slangs from data/slangs.json...');
        const response = await fetch('data/slangs.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allSlangs = await response.json();
        console.log('Successfully loaded', allSlangs.length, 'slangs');
        filteredSlangs = [...allSlangs];
        
        // Initialize page-specific functionality
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('Current page:', currentPage);
        
        switch (currentPage) {
            case 'index.html':
                initHomePage();
                break;
            case 'dictionary.html':
                initDictionaryPage();
                break;
            case 'submit.html':
                initSubmitPage();
                break;
            default:
                // Handle cases where filename might be empty or different
                if (window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                    initHomePage();
                } else {
                    console.log('Unknown page, initializing home page');
                    initHomePage();
                }
                break;
        }
    } catch (error) {
        console.error('Error loading slangs:', error);
        console.log('Using fallback data...');
        // Fallback data for demo purposes
        allSlangs = getFallbackSlangs();
        filteredSlangs = [...allSlangs];
        
        // Still try to initialize the correct page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        switch (currentPage) {
            case 'index.html':
                initHomePage();
                break;
            case 'dictionary.html':
                initDictionaryPage();
                break;
            case 'submit.html':
                initSubmitPage();
                break;
            default:
                initHomePage();
                break;
        }
    }
}

// Fallback data for demo purposes
function getFallbackSlangs() {
    return [
        {
            "word": "Chililo",
            "language": "Bemba",
            "category": "Expression",
            "meaning": "Funeral or mourning ceremony",
            "example_native": "Ba mayo nabaya ku chililo.",
            "example_translation": "My mom has gone for a funeral.",
            "audio": "chililo.mp3"
        },
        {
            "word": "Ni zee",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "Cool Talk",
            "example_native": "Awe mudala, iyi yeve ni zee maningi che.",
            "example_translation": "No worries, bro its all good.",
            "audio": "ni zee.mp3"
        },
        {
            "word": "Mukwai",
            "language": "Bemba",
            "category": "Greeting",
            "meaning": "Respectful greeting, meaning 'sir' or 'madam'",
            "example_native": "Mukwai, mwaiseni?",
            "example_translation": "Sir/Madam, you are welcome?",
            "audio": "mukwai.mp3"
        },
        {
            "word": "Chibuku",
            "language": "Nyanja",
            "category": "Food",
            "meaning": "Traditional beer made from maize",
            "example_native": "Tikagule chibuku.",
            "example_translation": "Let's go buy traditional beer.",
            "audio": "chibuku.mp3"
        },
        {
            "word": "Boma",
            "language": "Bemba",
            "category": "Expression",
            "meaning": "Government or authority",
            "example_native": "Boma ni boma.",
            "example_translation": "Government is government.",
            "audio": "boma.mp3"
        },
        {
            "word": "Nsima",
            "language": "Nyanja",
            "category": "Food",
            "meaning": "Zambian staple food made from maize meal",
            "example_native": "Nikudya nsima na ndiyo.",
            "example_translation": "I'm eating nshima with relish.",
            "audio": "nshima.mp3"
        },
        
        {
            "word": "Balibe plan",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "No direction, just messing around",
            "example_native": "Abo balibe plan, bango zunguluka mu town che ai.",
            "example_translation": "Those guys have no direction, they are just moving around town .",
            "audio": "balibeplan.mp3"
        },
        {
            "word": "Paipa pano",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "its getting serious",
            "example_native": "paipa pano, muzimai akamba sitikudya lelo .",
            "example_translation": "Its getting serious here, mom has said we are not eating today.",
            "audio": "paipapano.mp3"
        },
        {
            "word": "Kaya",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "i dont know/whatever",
            "example_native": "Kaya, kapena ati nama.",
            "example_translation": "I dont know, maybe he lied to us.",
            "audio": "kaya.mp3"
        },
        {
            "word": "Kwati ni movie",
            "language": "Nyanja",
            "category": "Fun",
            "meaning": "More like a movie",
            "example_native": "Drama yapa facebook kwati ni movie.",
            "example_translation": "That facebook drama was like a movie.",
            "audio": "kwatinimovie.mp3"
        },
    ];
}

// ===== HOME PAGE FUNCTIONALITY =====
function initHomePage() {
    // Load slang of the day
    loadSlangOfTheDay();
    
    // Initialize favorite functionality for slang of the day
    const favoriteBtn = document.getElementById('favoriteSlang');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    // Initialize audio functionality
    const audioBtn = document.getElementById('playSlangAudio');
    if (audioBtn) {
        audioBtn.addEventListener('click', playSlangAudio);
    }
}

function loadSlangOfTheDay() {
    if (allSlangs.length === 0) return;
    
    // Generate a random slang for each page refresh
    const randomIndex = Math.floor(Math.random() * allSlangs.length);
    const selectedSlang = allSlangs[randomIndex];
    
    // Update DOM elements
    const slangWord = document.getElementById('slangWord');
    const slangLanguage = document.getElementById('slangLanguage');
    const slangMeaning = document.getElementById('slangMeaning');
    const slangExampleNative = document.getElementById('slangExampleNative');
    const slangExampleTranslation = document.getElementById('slangExampleTranslation');
    const favoriteBtn = document.getElementById('favoriteSlang');
    
    if (slangWord) slangWord.textContent = selectedSlang.word;
    if (slangLanguage) slangLanguage.textContent = selectedSlang.language;
    if (slangMeaning) slangMeaning.textContent = selectedSlang.meaning;
    if (slangExampleNative) slangExampleNative.textContent = selectedSlang.example_native;
    if (slangExampleTranslation) slangExampleTranslation.textContent = selectedSlang.example_translation;
    
    // Update favorite button state
    if (favoriteBtn) {
        const selectedSlangId = createSlangId(selectedSlang);
        const isFavorited = favorites.some(fav => createSlangId(fav) === selectedSlangId);
        favoriteBtn.classList.toggle('favorited', isFavorited);
        favoriteBtn.textContent = isFavorited ? '❤️ Remove from Favorites' : '❤️ Add to Favorites';
    }
    
    // Store current slang for audio and favorite functionality
    window.currentSlang = selectedSlang;
}

function toggleFavorite() {
    const currentSlang = window.currentSlang;
    if (!currentSlang) return;
    
    const favoriteBtn = document.getElementById('favoriteSlang');
    const currentSlangId = createSlangId(currentSlang);
    const isFavorited = favorites.some(fav => createSlangId(fav) === currentSlangId);
    
    if (isFavorited) {
        // Remove from favorites
        favorites = favorites.filter(fav => createSlangId(fav) !== currentSlangId);
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.setAttribute('aria-label','Add to favorites');
    } else {
        // Check if already exists to prevent duplicates
        const exists = favorites.some(fav => createSlangId(fav) === currentSlangId);
        if (!exists) {
            favorites.push(currentSlang);
        }
        favoriteBtn.classList.add('favorited');
        favoriteBtn.setAttribute('aria-label','Remove from favorites');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function playSlangAudio() {
    const currentSlang = window.currentSlang;
    if (!currentSlang) return;
    const audioBtn = document.getElementById('playSlangAudio');
    playAudioForSlang(currentSlang, audioBtn);
}

// ===== DICTIONARY PAGE FUNCTIONALITY =====
function initDictionaryPage() {
    // Initialize search and filters
    const searchInput = document.getElementById('searchInput');
    const languageFilter = document.getElementById('languageFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const favoritesFilter = document.getElementById('favoritesFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterSlangs);
    if (languageFilter) languageFilter.addEventListener('change', filterSlangs);
    if (categoryFilter) categoryFilter.addEventListener('change', filterSlangs);
    if (favoritesFilter) {
        favoritesFilter.addEventListener('change', filterSlangs);
    }
    
    // View All Slangs button event listeners
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLimitedBtn = document.getElementById('showLimitedBtn');
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', toggleViewAllSlangs);
    }
    
    if (showLimitedBtn) {
        showLimitedBtn.addEventListener('click', toggleViewAllSlangs);
    }
    
    // Initial render
    renderSlangs();
    
    // Check URL parameters for language filter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && languageFilter) {
        languageFilter.value = langParam.charAt(0).toUpperCase() + langParam.slice(1);
        filterSlangs();
    }
}

function filterSlangs() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const languageFilter = document.getElementById('languageFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const favoritesFilter = document.getElementById('favoritesFilter')?.value || 'all';
    
    filteredSlangs = allSlangs.filter(slang => {
        const matchesSearch = slang.word.toLowerCase().includes(searchTerm) ||
                            slang.meaning.toLowerCase().includes(searchTerm) ||
                            slang.example_native.toLowerCase().includes(searchTerm);
        
        const matchesLanguage = !languageFilter || slang.language === languageFilter;
        const matchesCategory = !categoryFilter || slang.category === categoryFilter;
        const matchesFavorites = favoritesFilter === 'all' || 
                               (favoritesFilter === 'favorites' && 
                                favorites.some(fav => createSlangId(fav) === createSlangId(slang)));
        
        return matchesSearch && matchesLanguage && matchesCategory && matchesFavorites;
    });
    
    // Reset view state when filters change
    isShowingAllSlangs = false;
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLimitedBtn = document.getElementById('showLimitedBtn');
    
    if (viewAllBtn && showLimitedBtn) {
        viewAllBtn.style.display = 'inline-block';
        showLimitedBtn.style.display = 'none';
    }
    
    renderSlangs();
}

function renderSlangs() {
    const slangsGrid = document.getElementById('slangsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (!slangsGrid) return;
    
    // Determine how many slangs to show
    const slangsToShow = isShowingAllSlangs ? filteredSlangs : filteredSlangs.slice(0, INITIAL_DISPLAY_COUNT);
    
    // Update results count
    if (resultsCount) {
        const totalCount = filteredSlangs.length;
        const shownCount = slangsToShow.length;
        if (isShowingAllSlangs || totalCount <= INITIAL_DISPLAY_COUNT) {
            resultsCount.textContent = `Showing ${totalCount} slang${totalCount !== 1 ? 's' : ''}`;
        } else {
            resultsCount.textContent = `Showing ${shownCount} of ${totalCount} slangs`;
        }
    }
    
    // Show/hide no results message
    if (noResults) {
        noResults.style.display = filteredSlangs.length === 0 ? 'block' : 'none';
    }
    
    // Clear existing content
    slangsGrid.innerHTML = '';
    
    // Render slang cards
    slangsToShow.forEach(slang => {
        const slangCard = createSlangCard(slang);
        slangsGrid.appendChild(slangCard);
    });
}

function createSlangCard(slang) {
    const card = document.createElement('div');
    card.className = 'slang-card';
    
    const slangId = createSlangId(slang);
    const isFavorited = favorites.some(fav => createSlangId(fav) === slangId);
    
    card.innerHTML = `
        <div class="slang-content">
            <div class="slang-header">
                <h3 class="slang-word">${slang.word}</h3>
                <span class="language-badge">${slang.language}</span>
            </div>
            <p class="slang-meaning">${slang.meaning}</p>
            <div class="slang-example">
                <p class="example-native">${slang.example_native}</p>
                <p class="example-translation">${slang.example_translation}</p>
            </div>
            <div class="slang-actions">
                <button class="btn btn-audio" onclick="playSlangAudioFromCard('${slang.word}', this)">
                    🔊 Play Audio
                </button>
                <button class="btn btn-favorite ${isFavorited ? 'favorited' : ''}" 
                        onclick="toggleFavoriteFromCard('${slangId}')">
                    <span class='heart'>❤️</span>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function playSlangAudioFromCard(word, btnEl) {
    const slang = allSlangs.find(s => s.word === word);
    if (!slang) return;
    playAudioForSlang(slang, btnEl);
}

function toggleFavoriteFromCard(slangId) {
    const slang = findSlangById(slangId);
    if (!slang) return;
    
    const isFavorited = favorites.some(fav => createSlangId(fav) === slangId);
    
    if (isFavorited) {
        // Remove from favorites
        favorites = favorites.filter(fav => createSlangId(fav) !== slangId);
    } else {
        // Check if already exists to prevent duplicates
        const exists = favorites.some(fav => createSlangId(fav) === slangId);
        if (!exists) {
            favorites.push(slang);
        }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Re-render to update button states immediately
    renderSlangs();
}

// View All Slangs functionality
function toggleViewAllSlangs() {
    isShowingAllSlangs = !isShowingAllSlangs;
    
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLimitedBtn = document.getElementById('showLimitedBtn');
    
    if (viewAllBtn && showLimitedBtn) {
        if (isShowingAllSlangs) {
            viewAllBtn.style.display = 'none';
            showLimitedBtn.style.display = 'inline-block';
        } else {
            viewAllBtn.style.display = 'inline-block';
            showLimitedBtn.style.display = 'none';
        }
    }
    
    renderSlangs();
}

// ===== SUBMIT PAGE FUNCTIONALITY =====
function initSubmitPage() {
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmit);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const submission = {
        word: formData.get('slangWord'),
        language: formData.get('slangLanguage'),
        category: formData.get('slangCategory'),
        meaning: formData.get('slangMeaning'),
        example_native: formData.get('slangExampleNative'),
        example_translation: formData.get('slangExampleTranslation'),
        submitter: formData.get('submitterName') || 'Anonymous',
        email: formData.get('submitterEmail') || '',
        notes: formData.get('additionalNotes') || '',
        audio_file: formData.get('slangAudio') ? formData.get('slangAudio').name : null,
        submitted_at: new Date().toISOString()
    };
    
    // In a real app, this is suppose to be sent to a server
    console.log('Slang submission:', submission);
    
    // Show success message
    showNotification('Thank you! Your slang submission has been received. We\'ll review it and add it to the dictionary soon.');
    
    // Reset form
    event.target.reset();
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle mobile menu
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInsideToggle = mobileMenuToggle.contains(e.target);
            const isClickInsideNav = navLinks.contains(e.target);
            
            if (!isClickInsideToggle && !isClickInsideNav) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Load slangs data
    loadSlangs();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Entrance animation for hero section
    document.querySelector('.hero-content').style.opacity = '1';
    document.querySelector('.hero-content').style.transform = 'translateY(0)';
    
    // Animate Slang of the Day heading (letter-by-letter)
    const slangTitle = document.querySelector('.slang-animate');
    if (slangTitle) {
        const text = slangTitle.textContent;
        slangTitle.textContent = '';
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.transition = 'opacity 0.18s ' + (i * 0.06) + 's';
            slangTitle.appendChild(span);
            setTimeout(() => { span.style.opacity = '1'; }, 100 + i * 60);
        });
    }
    
    // Only animate soundwave when Play Audio is clicked
    const playBtn = document.getElementById('playSlangAudio');
    const soundwave = document.getElementById('soundwave');
    if (playBtn && soundwave) {
        // Create soundwave bars
        soundwave.innerHTML = '<span></span><span></span><span></span><span></span>';
        // Hide bars by default
        soundwave.style.visibility = 'hidden';

        playBtn.addEventListener('click', function () {
            soundwave.style.visibility = 'visible';
            soundwave.classList.add('playing');
            setTimeout(function () {
                soundwave.classList.remove('playing');
                soundwave.style.visibility = 'hidden';
            }, 1200); // Duration of animation
        });
    }
    
    // Fade-in for example sentences
    function fadeInExamples() {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '1';
        });
    }
    fadeInExamples();
    
    // Animated typing and deleting effect for #slang-animate
    const el = document.getElementById("slang-animate");
    if (!el) return;
    const text = "🌟 Slang of the Day";
    let idx = 0;
    let typing = true;

    function animate() {
        if (typing) {
            idx++;
            if (idx > text.length) {
                typing = false;
                setTimeout(animate, 900);
                return;
            }
        } else {
            idx--;
            if (idx < 0) {
                typing = true;
                setTimeout(animate, 600);
                return;
            }
        }
        el.innerHTML = text.slice(0, idx) + '<span class="cursor"></span>';
        setTimeout(animate, typing ? 90 : 50);
    }
    animate();
    
    // Apply soundwave animation to all Play Audio buttons
    document.querySelectorAll('.btn-audio').forEach(function(btn) {
        const soundwave = btn.querySelector('.soundwave');
        if (soundwave) {
            soundwave.innerHTML = '<span></span><span></span><span></span><span></span>';
            soundwave.style.visibility = 'hidden';
            btn.addEventListener('click', function () {
                soundwave.style.visibility = 'visible';
                btn.classList.add('playing');
                setTimeout(function () {
                    btn.classList.remove('playing');
                    soundwave.style.visibility = 'hidden';
                }, 1200);
            });
        }
    });

    // Add to Favorites button creative toggle
    document.querySelectorAll('.btn-favorite').forEach(function(btn) {
        btn.addEventListener('click', function () {
            btn.classList.toggle('favorited');
        });
    });
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.playSlangAudioFromCard = playSlangAudioFromCard;
window.toggleFavoriteFromCard = toggleFavoriteFromCard;

document.addEventListener("DOMContentLoaded", function () {
    // Apply soundwave animation to all Play Audio buttons
    document.querySelectorAll('.btn-audio').forEach(function(btn) {
        const soundwave = btn.querySelector('.soundwave');
        if (soundwave) {
            soundwave.innerHTML = '<span></span><span></span><span></span><span></span>';
            soundwave.style.visibility = 'hidden';
            btn.addEventListener('click', function () {
                soundwave.style.visibility = 'visible';
                btn.classList.add('playing');
                setTimeout(function () {
                    btn.classList.remove('playing');
                    soundwave.style.visibility = 'hidden';
                }, 1200);
            });
        }
    });
}); 


