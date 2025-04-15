document.addEventListener("DOMContentLoaded", function(){
    const toggleBtn = document.getElementById("themeToggle");
    const sprite = document.getElementById("sprite");
    const body = document.body;
    const readMoreBtn = document.getElementById("readMore");
    const moreBioText = document.getElementById("moreBio");
    const morePicsBtn = document.getElementById("morePicsBtn");
    const morePicsDiv = document.getElementById("morePics");

    const textInput = document.getElementById("textInput");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const sampleTextBtn = document.getElementById("sampleTextBtn");
    const clearBtn = document.getElementById("clearBtn");
    const resultsContainer = document.getElementById("resultsContainer");
    const loading = document.getElementById("loading");
    const wordCountWarning = document.getElementById("wordCountWarning");
  

    toggleBtn.addEventListener("click", ()=>{
        const isLight = body.classList.contains("light_theme");
        body.classList.toggle("light_theme", !isLight);
        body.classList.toggle("dark_theme", isLight);

        if (isLight){
            sprite.src="images/gengar.png";
            sprite.alt="Gengar";
            toggleBtn.textContent = "Switch?"
        } else {
            sprite.src="images/clefairy.png";
            sprite.alt="Clefairy";
            toggleBtn.textContent = "Switch back?"
        }

        logEvent('click', 'Theme Toggle');
    });

    if (readMoreBtn) {
        readMoreBtn.addEventListener("click", function() {
            if (moreBioText.style.display === "none") {
                moreBioText.style.display = "inline";
                readMoreBtn.textContent = "Read Less";
            } else {
                moreBioText.style.display = "none";
                readMoreBtn.textContent = "Read More?";
            }
            
            logEvent('click', 'Read More Button');
        });
    }

    if (morePicsBtn) {
        morePicsBtn.addEventListener("click", function() {
            if (morePicsDiv.style.display === "none") {
                morePicsDiv.style.display = "block";
                morePicsBtn.textContent = "Hide Pictures";
            } else {
                morePicsDiv.style.display = "none";
                morePicsBtn.textContent = "More Pictures";
            }
            
            logEvent('click', 'More Pictures Button');
        });
    }

    document.body.addEventListener('click', function(event) {
        const timestamp = new Date().toISOString();
        const type = 'click';
        let elementType = event.target.tagName;
        let description = event.target.className || 'no-class';
        console.log(`${timestamp}, ${type}, ${elementType}, (class: ${description})`);
    });

    function logEvent(type, description) {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}, ${type}, ${description}`);
    }

    if (textInput && analyzeBtn) {
        const pronouns = [
            "i", "me", "my", "mine", "myself", 
            "you", "your", "yours", "yourself", "yourselves",
            "he", "him", "his", "himself",
            "she", "her", "hers", "herself",
            "it", "its", "itself",
            "we", "us", "our", "ours", "ourselves",
            "they", "them", "their", "theirs", "themselves",
            "this", "that", "these", "those",
            "who", "whom", "whose", "which", "what", "bro", "gang", "blud"
        ];
        
        const prepositions = [
            "about", "above", "across", "after", "against", "along", "amid", "among",
            "around", "as", "at", "before", "behind", "below", "beneath", "beside",
            "between", "beyond", "by", "concerning", "for", "from", "in", "into", 
            "like", "near", "of", "off", "on", "onto", "out", "over", "past", 
            "through", "throughout", "to", "toward", "under", "underneath", 
            "until", "unto", "up", "upon", "with", "within", "without"
        ];
        
        const indefiniteArticles = ["a", "an", "some", "any", "many", "few", "several", "gajillion", "a lot", "lots", "plenty", "a couple", "a few", "a little", "god knows"];
        
        textInput.addEventListener("input", function() {
            const wordCount = textInput.value.split(/\s+/).filter(word => word.length > 0).length;
            if (wordCountWarning) {
                wordCountWarning.style.display = wordCount < 10000 ? "block" : "none";
            }
        });
        
        analyzeBtn.addEventListener("click", function() {
            const text = textInput.value.trim();
            if (!text) {
                alert("Please enter text to analyze.");
                return;
            }
            
            if (loading) loading.style.display = "block";
            if (resultsContainer) resultsContainer.style.display = "none";
            
            setTimeout(() => {
                analyzeText(text);
                if (loading) loading.style.display = "none";
                if (resultsContainer) resultsContainer.style.display = "block";
            }, 100);
            
            logEvent('click', 'Analyze Text Button');
        });
        
        if (clearBtn) {
            clearBtn.addEventListener("click", function() {
                textInput.value = "";
                if (resultsContainer) resultsContainer.style.display = "none";
                if (wordCountWarning) wordCountWarning.style.display = "none";
                logEvent('click', 'Clear Text Button');
            });
        }
        
        if (sampleTextBtn) {
            sampleTextBtn.addEventListener("click", function() {
                fetch('https://www.gutenberg.org/files/1342/1342-0.txt')
                    .then(response => response.text())
                    .then(text => {
                        textInput.value = text;
                        if (wordCountWarning) wordCountWarning.style.display = "none";
                    })
                    .catch(error => {
                        console.error('Error fetching sample text:', error);
                        textInput.value = "Sample text could not be loaded. Please try pasting your own text.";
                    });
                    
                logEvent('click', 'Load Sample Text Button');
            });
        }
        
        function analyzeText(text) {
            const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
            const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
            const spaceCount = (text.match(/\s/g) || []).length;
            const newlineCount = (text.match(/\n/g) || []).length;
            const specialCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
            
            if (document.getElementById("letterCount")) {
                document.getElementById("letterCount").textContent = letterCount;
            }
            if (document.getElementById("wordCount")) {
                document.getElementById("wordCount").textContent = wordCount;
            }
            if (document.getElementById("spaceCount")) {
                document.getElementById("spaceCount").textContent = spaceCount;
            }
            if (document.getElementById("newlineCount")) {
                document.getElementById("newlineCount").textContent = newlineCount;
            }
            if (document.getElementById("specialCount")) {
                document.getElementById("specialCount").textContent = specialCount;
            }
            
            const tokens = text.toLowerCase().split(/\s+/).map(word => 
                word.replace(/[^a-zA-Z'-]/g, '')
            ).filter(word => word.length > 0);
            
            processWordCategory(tokens, pronouns, "pronounResults");
            processWordCategory(tokens, prepositions, "prepositionResults");
            processWordCategory(tokens, indefiniteArticles, "articleResults");
        }
        
        function processWordCategory(tokens, categoryWords, resultId) {
            const resultElement = document.getElementById(resultId);
            if (!resultElement) return;
            
            const counts = {};
            categoryWords.forEach(word => { counts[word] = 0; });
            
            tokens.forEach(token => {
                if (categoryWords.includes(token)) {
                    counts[token]++;
                }
            });
            
            const sortedCounts = Object.entries(counts)
                .filter(([word, count]) => count > 0)
                .sort((a, b) => b[1] - a[1]);
            
            if (sortedCounts.length === 0) {
                resultElement.innerHTML = "<p>No matches found</p>";
                return;
            }
            
            let html = "<ul class='list'>";
            sortedCounts.forEach(([word, count]) => {
                html += `<li><strong>${word}</strong>: ${count}</li>`;
            });
            html += "</ul>";
            
            resultElement.innerHTML = html;
        }
    }

    console.log(`${new Date().toISOString()}, view, Page Loaded`);
});