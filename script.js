document.addEventListener("DOMContentLoaded", function() {
    const toggleLanguageButton = document.getElementById("toggleLanguage");
    const roleForm = document.getElementById("roleForm");
    const startGameButton = document.getElementById("startGame");
    const roleRevealSection = document.getElementById("roleRevealSection");
    const revealRoleButton = document.getElementById("revealRoleButton");
    const revealedRole = document.getElementById("revealedRole");
    const gotItButton = document.getElementById("gotItButton");
    const godButton = document.getElementById("godButton");
    const godSection = document.getElementById("godSection");
    const godMainSection = document.getElementById("godMainSection");
    const allRolesListButton = document.getElementById("allRolesListButton");
    const finalMoveButton = document.getElementById("finalMoveButton");
    const godRolesSection = document.getElementById("godRolesSection");
    const godRolesSectionCloseButton = document.getElementById("godRolesSectionCloseButton");
    const godFinalMoveSection = document.getElementById("godFinalMoveSection");
    const allRolesList = document.getElementById("allRolesList");
    const totalSelectedSpan = document.getElementById("totalSelected");
    const revealFinalMoveButton = document.getElementById("revealFinalMoveButton");
    const revealedFinalMove = document.getElementById("revealedFinalMove");

    let currentPlayer = 0;
    let shuffledRoles = [];

    let currentBenchedPlayer = 0;
    let shuffledFinalMoves = [];

    let currentLanguage = 'fa';

    // Localization Dictionaries
    const translations = {
        en: {
            mafiaRoles: "Mafia Roles",
            godfather: "Godfather",
            saulGoodman: "Saul Goodman",
            matador: "Matador",
            spy: "Spy",
            drLecter: "Dr. Lecter",
            simpleMafia: "Simple Mafia",
            independentRoles: "Independent Roles",
            zodiac: "Zodiac",
            sherlock: "Sherlock",
            nostradamus: "Nostradamus",
            jackSparrow: "Jack Sparrow",
            civilianRoles: "Civilian Roles",
            drWatson: "Dr. Watson",
            leon: "Leon",
            detective: "Detective",
            constantine: "Constantine",
            ocean: "Ocean",
            bodyguard: "Bodyguard",
            gunslinger: "Gunslinger",
            mayor: "Mayor",
            governor: "Governor",
            blacksmith: "Blacksmith",
            citizenCain: "Citizen Cain",
            simpleCitizen: "Simple Citizen",
            revealRole: "Reveal Role",
            gotIt: "Ok, got it!",
            startGame: "Start Game",
            totalPlayers: "Total Players:",
            godView: "Show God View",
            allRevealedRoles: "All Revealed Roles",
            faLabel: "فا",
            enLabel: "EN",
            finalMoves: "Final Moves",
            beautifulMind: "Beautiful Mind",
            finalShot: "Final Shot",
            roleReveal: "Role Reveal",
            sideReveal: "Side Reveal",
            faceOff: "Face Off",
            handcuffs: "Handcuffs",
            silenceOfTheLambs: "Silence of the Lambs",
            greenMile: "The Green Mile",
            finalMove: "Final Move",
            closeButton: "Close",
            revealFinalMove: "Reveal Final Move"
        },
        fa: {
            mafiaRoles: "نقش‌های مافیا",
            godfather: "پدرخوانده",
            saulGoodman: "سال‌گودمن",
            matador: "ماتادور",
            drLecter: "دکتر لکتر",
            spy: "جاسوس",
            simpleMafia: "مافیا ساده",
            independentRoles: "نقش‌های مستقل",
            zodiac: "زودیاک",
            sherlock: "شرلوک",
            nostradamus: "نوستراداموس",
            jackSparrow: "جک گنجشکه",
            civilianRoles: "نقش‌های شهروند",
            drWatson: "دکتر واتسن",
            leon: "حرفه‌ای",
            detective: "کاراگاه",
            constantine: "کنستانتین",
            ocean: "اوشن",
            bodyguard: "محافظ",
            gunslinger: "تفنگدار",
            mayor: "شهردار",
            governor: "فرماندار",
            blacksmith: "آهنگر",
            citizenCain: "شهروند کین",
            simpleCitizen: "شهروند ساده",
            revealRole: "نمایش نقش",
            gotIt: "متوجه شدم!",
            startGame: "شروع بازی",
            totalPlayers: "تعداد بازیکنان:",
            godView: "نمایش نتیجه برای استاد بهار",
            allRevealedRoles: 'نقش‌ها',
            faLabel: "فا",
            enLabel: "EN",
            finalMoves: "کارت‌های خروج",
            beautifulMind: "ذهن زیبا",
            finalShot: "شلیک نهایی",
            roleReveal: "افشای نقش",
            sideReveal: "افشای ساید",
            faceOff: "تغییر چهره",
            handcuffs: "دستبند",
            silenceOfTheLambs: "سکوت بره‌ها",
            greenMile: "مسیر سبز",
            finalMove: "کارت‌ خروج",
            closeButton: "بستن",
            revealFinalMove: "نمایش کارت خروج"
        }
    };

    // Initialize Language
    setLanguage(currentLanguage);

    // Language Toggle Event
    toggleLanguageButton.addEventListener("click", function() {
        currentLanguage = currentLanguage === 'en' ? 'fa' : 'en';
        setLanguage(currentLanguage);
    });

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        document.body.setAttribute('data-lang', lang);
        document.getElementById('bootstrap-ltr').disabled = lang === 'fa';
        document.getElementById('bootstrap-rtl').disabled = lang === 'en';

        // Update text based on translations
        document.querySelectorAll('[data-i18n]').forEach(function(element) {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update language toggle button text
        toggleLanguageButton.textContent = lang === 'en' ? translations['fa']['faLabel'] : translations['en']['enLabel'];
    }

    // Event listeners for role selection to update total selected
    const roleCheckboxes = document.querySelectorAll('.role-checkbox');
    const simpleCitizenInput = document.getElementById('simpleCitizen');

    roleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalSelected);
    });

    simpleCitizenInput.addEventListener('input', updateTotalSelected);

    function updateTotalSelected() {
        let total = 0;

        roleCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += 1;
            }
        });

        const simpleCitizenCount = parseInt(simpleCitizenInput.value) || 0;

        total += simpleCitizenCount;

        totalSelectedSpan.textContent = total;
    }

    function getRoles() {
        const mafiaRoles = [
            { key: "godfather", count: document.getElementById("godfather").checked ? 1 : 0 },
            { key: "saulGoodman", count: document.getElementById("saulGoodman").checked ? 1 : 0 },
            { key: "matador", count: document.getElementById("matador").checked ? 1 : 0 },
            { key: "drLecter", count: document.getElementById("drLecter").checked ? 1 : 0 },
            { key: "spy", count: document.getElementById("spy").checked ? 1 : 0 },
            { key: "simpleMafia", count: document.getElementById("spy").checked ? 1 : 0 }
        ];

        const independentRoles = [
            { key: "zodiac", count: document.getElementById("zodiac").checked ? 1 : 0 },
            { key: "sherlock", count: document.getElementById("sherlock").checked ? 1 : 0 }
        ];

        const civilianRoles = [
            { key: "drWatson", count: document.getElementById("drWatson").checked ? 1 : 0 },
            { key: "leon", count: document.getElementById("leon").checked ? 1 : 0 },
            { key: "detective", count: document.getElementById("detective").checked ? 1 : 0 },
            { key: "ocean", count: document.getElementById("ocean").checked ? 1 : 0 },
            { key: "bodyguard", count: document.getElementById("bodyguard").checked ? 1 : 0 },
            { key: "gunslinger", count: document.getElementById("gunslinger").checked ? 1 : 0 },
            { key: "citizenCain", count: document.getElementById("citizenCain").checked ? 1 : 0 },
            { key: "mayor", count: document.getElementById("mayor").checked ? 1 : 0 },
            { key: "governor", count: document.getElementById("governor").checked ? 1 : 0 },
            { key: "constantine", count: document.getElementById("constantine").checked ? 1 : 0 },
            { key: "blacksmith", count: document.getElementById("blacksmith").checked ? 1 : 0 },
            { key: "simpleCitizen", count: parseInt(document.getElementById("simpleCitizen").value) || 0 }
        ];

        const expandedRoles = [
            ...expand(mafiaRoles),
            ...expand(independentRoles),
            ...expand(civilianRoles)
        ];

        return expandedRoles.map(roleKey => ({
            key: roleKey,
            name: getTranslation(roleKey)
        }));
    }

    function getFinalMoves() {
        const finalMoves = [
            { key: "beautifulMind", count: document.getElementById("beautifulMind").checked ? 1 : 0 },
            { key: "finalShot", count: document.getElementById("finalShot").checked ? 1 : 0 },
            { key: "roleReveal", count: document.getElementById("roleReveal").checked ? 1 : 0 },
            { key: "sideReveal", count: document.getElementById("sideReveal").checked ? 1 : 0 },
            { key: "faceOff", count: document.getElementById("faceOff").checked ? 1 : 0 },
            { key: "handcuffs", count: document.getElementById("handcuffs").checked ? 1 : 0 },
            { key: "silenceOfTheLambs", count: document.getElementById("silenceOfTheLambs").checked ? 1 : 0 },
            { key: "greenMile", count: document.getElementById("greenMile").checked ? 1 : 0 }
        ];

        const expandedFinalMoves = expand(finalMoves);

        return expandedFinalMoves.map(moveKey => ({
            key: moveKey,
            name: getTranslation(moveKey)
        }));
    }

    function expand(roles) {
        let expanded = [];
        roles.forEach(({ key, count }) => {
            for (let i = 0; i < count; i++) {
                expanded.push(key);
            }
        });
        return expanded;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getTranslation(key) {
        return translations[currentLanguage][key] || key;
    }

    // Event listeners for buttons
    startGameButton.addEventListener("click", function() {
        shuffledRoles = shuffle(getRoles());
        shuffledFinalMoves = shuffle(getFinalMoves());

        currentPlayer = 0;
        currentBenchedPlayer = 0;

        roleForm.classList.add("d-none");
        roleRevealSection.classList.remove("d-none");
        godSection.classList.add("d-none");
        revealedRole.src = "img/startup.jpg";
        gotItButton.classList.add("d-none");
    });

    revealRoleButton.addEventListener("click", function() {
        if (currentPlayer < shuffledRoles.length) {
            const role = shuffledRoles[currentPlayer];
            console.log(role.key, role.name);
            revealedRole.src = `img/roleCards/${role.key}.jpg`;
            revealRoleButton.classList.add("d-none");
            gotItButton.classList.remove("d-none");
            currentPlayer++;
        }
    });

    gotItButton.addEventListener("click", function() {
        revealedRole.src = "img/startup.jpg"
        gotItButton.classList.add("d-none");
        
        if (currentPlayer === shuffledRoles.length) {
            godButton.classList.remove("d-none");
        } else {
            revealRoleButton.classList.remove("d-none");
        }
    });

    godButton.addEventListener("click", function() {
        allRolesList.innerHTML = "";
        shuffledRoles.forEach((role, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.dataset.key = role.key;
            listItem.setAttribute("data-bs-toggle", "modal");
            listItem.setAttribute("data-bs-target", "#selectedRoleModal");
            listItem.textContent = `${index + 1}. ${role.name}`;

            listItem.addEventListener("click", function() {
                const selectedRoleImg = document.getElementById("selectedRole");
                const roleKey = listItem.dataset.key;
                selectedRoleImg.src = `img/roleCards/${roleKey}.jpg`;
            });
    
            allRolesList.appendChild(listItem);
        });
        roleRevealSection.classList.add("d-none");
        godSection.classList.remove("d-none");
        godMainSection.classList.remove("d-none");
    });

    allRolesListButton.addEventListener("click", function() {
        godMainSection.classList.add("d-none");
        godRolesSection.classList.remove("d-none");
    });

    godRolesSectionCloseButton.addEventListener("click", function() {
        godRolesSection.classList.add("d-none");
        godMainSection.classList.remove("d-none");
    });

    finalMoveButton.addEventListener("click", function() {
        godMainSection.classList.add("d-none");
        godFinalMoveSection.classList.remove("d-none");
        revealedFinalMove.src = "img/startup.jpg";
        revealFinalMoveButton.classList.remove("d-none");
    });

    godFinalMoveSectionCloseButton.addEventListener("click", function() {
        godFinalMoveSection.classList.add("d-none");
        godMainSection.classList.remove("d-none");
    });

    revealFinalMoveButton.addEventListener("click", function() {
        if (currentBenchedPlayer < shuffledFinalMoves.length) {
            const finalMove = shuffledFinalMoves[currentBenchedPlayer];
            revealedFinalMove.src = `img/finalMoveCards/${finalMove.key}.jpg`;
            revealFinalMoveButton.classList.add("d-none");
            gotItButton.classList.remove("d-none");
            currentBenchedPlayer++;
        }
    });
});