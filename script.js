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
    const revealedFinalMovesList = document.getElementById("revealedFinalMovesList");
    const revealedFinalMoveResult = document.getElementById("revealedFinalMoveResult");

    const selectedRoleModal = new bootstrap.Modal(document.getElementById("selectedRoleModal"));

    let currentPlayer = 0;
    let shuffledRoles = [];

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
            players: "Players",
            godView: "Show God View",
            allRevealedRoles: "All Revealed Roles",
            faLabel: "فارسی",
            enLabel: "English",
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
            players: "نفره",
            godView: "نمایش نتیجه برای استاد بهار",
            allRevealedRoles: 'نقش‌ها',
            faLabel: "فارسی",
            enLabel: "English",
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

    toggleLanguageButton.addEventListener("click", function(event) {
        event.preventDefault();
        console.log('Toggling language, currentLanguage is ', currentLanguage);
        currentLanguage = currentLanguage === 'en' ? 'fa' : 'en';

        setLanguage(currentLanguage);
    });

    function setLanguage(lang) {
        console.log('Setting language to', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        document.body.setAttribute('data-lang', lang);
        document.getElementById('bootstrap-ltr').disabled = lang === 'fa';
        document.getElementById('bootstrap-rtl').disabled = lang === 'en';

        document.querySelectorAll('[data-i18n]').forEach(function(element) {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        toggleLanguageButton.textContent = lang === 'en' ? translations['fa']['faLabel'] : translations['en']['enLabel'];
    }

    // Event listeners for role selection to update total selected
    const roleCheckboxes = document.querySelectorAll('.role-checkbox');
    const simpleCitizenInput = document.getElementById('simpleCitizen');
    const totalSelectedSpan = document.getElementById("totalSelected");
    const totalSelectedMafia = document.getElementById("totalSelectedMafia");
    const totalSelectedIndependent = document.getElementById("totalSelectedIndependent");
    const totalSelectedCivilian = document.getElementById("totalSelectedCivilian");

    roleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalSelected);
    });

    simpleCitizenInput.addEventListener('input', updateTotalSelected);

    function updateTotalSelected() {
        let total = 0;
        let mafiaTotal = 0;
        let independentTotal = 0;
        let civilianTotal = 0;

        roleCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += 1;
                checkbox.dataset.side === 'mafia' ? mafiaTotal += 1 : null;
                checkbox.dataset.side === 'independent' ? independentTotal += 1 : null;
                checkbox.dataset.side === 'civilian' ? civilianTotal += 1 : null;
            }
        });

        const simpleCitizenCount = parseInt(simpleCitizenInput.value) || 0;
        total += simpleCitizenCount;
        civilianTotal += simpleCitizenCount;

        totalSelectedSpan.textContent = total;
        totalSelectedMafia.textContent = mafiaTotal;
        totalSelectedIndependent.textContent = independentTotal;
        totalSelectedCivilian.textContent = civilianTotal;
    }

    // Event listeners for final moves selection to update total selected
    const finalMoveCheckboxes = document.querySelectorAll('.final-move-checkbox');
    const totalSelectedFinalMoves = document.getElementById("totalSelectedFinalMoves");

    finalMoveCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let total = 0;
            finalMoveCheckboxes.forEach(checkbox => {
                total += checkbox.checked ? 1 : 0;
            });
            totalSelectedFinalMoves.textContent = total;
        });
    });

    function getRoles() {
        const roles = [
            { side: 'mafia', key: "godfather", count: document.getElementById("godfather").checked ? 1 : 0 },
            { side: 'mafia', key: "saulGoodman", count: document.getElementById("saulGoodman").checked ? 1 : 0 },
            { side: 'mafia', key: "matador", count: document.getElementById("matador").checked ? 1 : 0 },
            { side: 'mafia', key: "drLecter", count: document.getElementById("drLecter").checked ? 1 : 0 },
            { side: 'mafia', key: "spy", count: document.getElementById("spy").checked ? 1 : 0 },
            { side: 'mafia', key: "simpleMafia", count: document.getElementById("simpleMafia").checked ? 1 : 0 },
            { side: 'independent', key: "zodiac", count: document.getElementById("zodiac").checked ? 1 : 0 },
            { side: 'independent', key: "sherlock", count: document.getElementById("sherlock").checked ? 1 : 0 },
            { side: 'independent', key: "nostradamus", count: document.getElementById("nostradamus").checked ? 1 : 0 },
            { side: 'independent', key: "jackSparrow", count: document.getElementById("jackSparrow").checked ? 1 : 0 },
            { side: 'civilian', key: "drWatson", count: document.getElementById("drWatson").checked ? 1 : 0 },
            { side: 'civilian', key: "leon", count: document.getElementById("leon").checked ? 1 : 0 },
            { side: 'civilian', key: "detective", count: document.getElementById("detective").checked ? 1 : 0 },
            { side: 'civilian', key: "ocean", count: document.getElementById("ocean").checked ? 1 : 0 },
            { side: 'civilian', key: "bodyguard", count: document.getElementById("bodyguard").checked ? 1 : 0 },
            { side: 'civilian', key: "gunslinger", count: document.getElementById("gunslinger").checked ? 1 : 0 },
            { side: 'civilian', key: "citizenCain", count: document.getElementById("citizenCain").checked ? 1 : 0 },
            { side: 'civilian', key: "mayor", count: document.getElementById("mayor").checked ? 1 : 0 },
            { side: 'civilian', key: "governor", count: document.getElementById("governor").checked ? 1 : 0 },
            { side: 'civilian', key: "constantine", count: document.getElementById("constantine").checked ? 1 : 0 },
            { side: 'civilian', key: "blacksmith", count: document.getElementById("blacksmith").checked ? 1 : 0 },
            { side: 'civilian', key: "simpleCitizen", count: parseInt(document.getElementById("simpleCitizen").value) || 0 }
        ];

        const expandedRoles = expand(roles);

        return expandedRoles.map(roleKey => ({
            key: roleKey,
            side: roles.find(role => role.key === roleKey).side,
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
            console.log(role.key, role.name, role.side);
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            if (role.side === 'mafia') {
                listItem.classList.add("list-group-item-danger");
            }
            if (role.side === 'independent') {
                listItem.classList.add("list-group-item-warning");
            }

            listItem.dataset.key = role.key;
            listItem.textContent = `${role.name}`;

            listItem.addEventListener("click", function() {
                const selectedRoleImg = document.getElementById("selectedRole");
                const roleKey = listItem.dataset.key;
                selectedRoleImg.src = `img/roleCards/${roleKey}.jpg`;
                selectedRoleModal.show();
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
        revealedFinalMovesList.innerHTML = "";
        revealedFinalMoveResult.classList.add("d-none");
        revealedFinalMoveResult.src = 'img/startup.jpg';

        shuffledFinalMoves.forEach((finalMove, index) => {
            let colWidth =  4;
            remainedCardsCount = shuffledFinalMoves.length;
            if (remainedCardsCount === 1) {
                colWidth = 12;
            } else if (remainedCardsCount < 5) {
                colWidth = 6;
            }
            const colDiv = document.createElement('div');
            colDiv.className = `col-${colWidth}`;
            const imgElement = document.createElement('img');
            imgElement.src = 'img/startup.jpg';
            imgElement.className = 'img-thumbnail mt-3';
            
            imgElement.addEventListener("click", function() {
                revealedFinalMoveResult.src = `img/finalMoveCards/${finalMove.key}.jpg`;
                shuffledFinalMoves = shuffledFinalMoves.filter(move => move.key !== finalMove.key);
                revealedFinalMovesList.innerHTML = "";
                revealedFinalMoveResult.classList.remove("d-none");
            });
            
            colDiv.appendChild(imgElement);
            revealedFinalMovesList.appendChild(colDiv);
        });


        godMainSection.classList.add("d-none");
        godFinalMoveSection.classList.remove("d-none");
    });

    godFinalMoveSectionCloseButton.addEventListener("click", function() {
        godFinalMoveSection.classList.add("d-none");
        godMainSection.classList.remove("d-none");
        if (shuffledFinalMoves.length === 0) {
            finalMoveButton.disabled = true;
            finalMoveButton.classList.add("btn-outline-info");
            finalMoveButton.classList.remove("btn-info");
        }
    });
});