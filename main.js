// application qui génere aléatoirement un nombre ou un caractère selon le type de l'étape (caractère ou nombre)
// les étape sont stockés dans le localStorage
// les étape sont setup sur une page anexes setup (div setup)
// les étape sont sauvegardés dans le localStorage
// les étape font défiler les caractères ou les nombres de manière aléatoire losqu'on appuie sur le bouton de l'étape choisi jusqu'à s'arreter sur le caractère ou le nombre choisi aléatoirement
// les étapes suivantes on un range de caractères ou de nombre dépendant du caractère ou du nombre choisi lors de l'étape précédente
// le boutton reset permet de remettre à zéro les Steps
// le boutton setup permet d'aller sur la page setup et a charger le setup des étapes
// le boutton back permet de revenir sur la page principale
// les boutons des étapes suivants sont désactivés tant que les étapes précédent ne sont pas terminées

// le systeme setup permet de créer des étapes personnalisés avec la possibilitée de set le range de chaque étape selon le caractère ou le nombre choisi lors de l'étape précédente
// une premiere div contient une liste de select pour choisir le type d'etape (caractère ou nombre), un pour chaque étape avec un boutton add etape pour ajouter une étape
// en suit dans une 2eme div on a une div pour set le range de l'étape 1 et une sous div contenant une div pour chaque itération de l'étape 1 pour set le range de l'étape 2 pour chaque caractère ou nombre de l'étape 1, et ainsi de suite pour chaque étape

// une div de setup d'etape contient :
// si le type de l'etape est un nombre un input number pour choisir le nombre minimum et un input number pour choisir le nombre maximum (le nombre aléatoire sera compris entre le nombre minimum et le nombre maximum) par defaut le nombre minimum est 1 et le nombre maximum est 10
// si le type de l'etape est un caractère un input text pour choisir la liste des caractères possibles (les caractères seront choisis aléatoirement dans cette liste), par defaut la liste est "abcdefghijklmnopqrstuvwxyz"

// le boutton save permet de sauvegarder les étapes et leurs range dans le localStorage
// le boutton back permet de revenir sur la page principale

// le systeme de sauvegarde des étapes dans le localStorage est le suivant
// structure de steps dans le localStorage : 
// {
//     type : "number" ou "char",
//     min : 0 si type = "number",
//     max : 9 si type = "number",
//     chars : "abcdefghijklmnopqrstuvwxyz" si type = "char",
//     subStep : [ // un sous Step pour chaque caractere de chars si type = "char" ou pour chaque nombre entre min et max si type = "number"
//          {
//              it:min-max ou a-z,
//              type : "number" ou "char",
//              min : 0 si type = "number",
//              max : 9 si type = "number",
//              chars : "abcdefghijklmnopqrstuvwxyz" si type = "char",
//              subStep : [  ...  ]
//         },
//         {
//              it:min-max ou a-z,
//              type : "number" ou "char",
//              min : 0 si type = "number",
//              max : 9 si type = "number",
//              chars : "abcdefghijklmnopqrstuvwxyz" si type = "char",
//              subStep : [  ...  ]
//         },
//         ...
//     ]
// }

let steps = {
    type: "char",
    chars: "abcd",
    subStep: [
        {
            it: "a",
            type: "number",
            min: 1,
            max: 4,
            subStep: [
                {
                    it: 1,
                    type: "char",
                    chars: "eh",
                    subStep: []
                },
                {
                    it: 2,
                    type: "char",
                    chars: "i",
                    subStep: []
                },
                {
                    it: 3,
                    type: "char",
                    chars: "mnp",
                    subStep: []
                },
                {
                    it: 4,
                    type: "char",
                    chars: "abcd",
                    subStep: []
                }
            ]
        },
        {
            it: "b",
            type: "number",
            min: 1,
            max: 2,
            subStep: [
                {
                    it: 1,
                    type: "char",
                    chars: "gh",
                    subStep: []
                },
                {
                    it: 2,
                    type: "char",
                    chars: "il",
                    subStep: []
                }
            ]
        },
        {
            it: "c",
            type: "number",
            min: 1,
            max: 1,
            subStep: [
                {
                    it: 1,
                    type: "char",
                    chars: "efgh",
                    subStep: []
                }
            ]
        },
        {
            it: "d",
            type: "number",
            min: 1,
            max: 3,
            subStep: [
                {
                    it: 1,
                    type: "char",
                    chars: "h",
                    subStep: []
                },
                {
                    it: 2,
                    type: "char",
                    chars: "ikl",
                    subStep: []
                },
                {
                    it: 3,
                    type: "char",
                    chars: "mn",
                    subStep: []
                }
            ]
        }
    ]
}

// fonction qui génere un nombre aléatoire entre 1 et un nombre max
function getRandomNumber(max) {
    return (Math.floor(Math.random() * max) + 1);
}


// fonction qui récupere le nombre de step
function getNbStep(step) {
    let nbStep = 1;
    if (step.subStep && step.subStep.length > 0) {
        nbStep += getNbStep(step.subStep[0]);
    }
    return nbStep;
}

// fonction qui récupere un tableau de type de chaque step
function getTypeStep(step) {
    let typeStep = [];
    typeStep.push(step.type);
    if (step.subStep.length > 0) {
        let arrayGet = getTypeStep(step.subStep[0]);
        typeStep = typeStep.concat(arrayGet);
    }
    return typeStep;
}

// fonction qui récupere le nombre de combinaison possible pour chaque étape et renvoie un tableau avec le nombre de combinaison pour chaque étape
function getNbCombinaisonByStep(step) {
    let nbCombinaisonByStep = [];
    let nbCombinaison = 1;
    if (step.type === "number") {
        nbCombinaison = step.max - step.min + 1;
    } else if (step.type === "char") {
        nbCombinaison = step.chars.length;
    }
    nbCombinaisonByStep.push(nbCombinaison);
    if (step.subStep.length > 0) {
        let nbCombinaisonBySubStep = []
        let arrayGet = getNbCombinaisonByStep(step.subStep[0]);
        nbCombinaisonBySubStep[0] = [arrayGet[0]]
        for (let i = 1; i < arrayGet.length; i++) {
            nbCombinaisonBySubStep[i] = arrayGet[i];
        }
        for (let i = 1; i < step.subStep.length; i++) {
            arrayGet = getNbCombinaisonByStep(step.subStep[i]);
            nbCombinaisonBySubStep[0].push(arrayGet[0]);
            for (let j = 1; j < arrayGet.length; j++) {
                nbCombinaisonBySubStep[j] = nbCombinaisonBySubStep[j].concat(arrayGet[j]);
            }
        }
        nbCombinaisonByStep = nbCombinaisonByStep.concat(nbCombinaisonBySubStep);
    }
    return nbCombinaisonByStep;
}

// récupération du nombre de combinaison possible pour une étape avec ces sous étapes
function getNbCombinaison(step, nbStep = getNbStep(step)) {
    let nbCombinaison = 1;
    if (step.type === "number") {
        nbCombinaison = step.max - step.min + 1;
    } else if (step.type === "char") {
        nbCombinaison = step.chars.length;
    }
    if (step.subStep.length > 0 && nbStep > 1) {
        nbCombinaison = 0;
        for (let i = 0; i < step.subStep.length; i++) {
            nbCombinaison += getNbCombinaison(step.subStep[i]);
        }
    }
    return nbCombinaison;
}

// récupération de la combinaison d'étapes a partir d'un nombre passé en paramètre correspondant au numero de la selection dans le nombre de combinaison possible
// la fonction renvoie un tableau contenant la combinaison d'étapes ex : ["a", 2, "b"] pour une combinaison de 3 étapes
function getCombinaison(step, globalNumCombinaison) {
    console.log("globalNumCombinaison : ", globalNumCombinaison);
    let nbCombinaisonByStep = getNbCombinaisonByStep(step);
    console.log("nbCombinaisonByStep : ", nbCombinaisonByStep);
    // reverse du tableau pour avoir le nombre de combinaison par étape dans l'ordre
    nbCombinaisonByStep.reverse();
    // récupération et supression du dernier élément du tableau qui correspond au nombre de combinaison possible pour la première étape
    let rangeStep1 = nbCombinaisonByStep.pop();
    let calcNumCombinaison = globalNumCombinaison;
    let combinaison = [];
    for (let nbCombinaisonAtStep of nbCombinaisonByStep) {
        for (let i = 0; i < nbCombinaisonAtStep.length; i++) {
            let nbCombinaisonInRangeOfUpStep = nbCombinaisonAtStep[i];
            if (calcNumCombinaison <= nbCombinaisonInRangeOfUpStep) {
                combinaison.push(calcNumCombinaison);
                console.log("i : ", i, "in => ", nbCombinaisonAtStep, " (", calcNumCombinaison, ")")
                calcNumCombinaison = i + 1;
                break;
            } else {
                calcNumCombinaison -= nbCombinaisonInRangeOfUpStep;
            }
        }
    }
    combinaison.push(calcNumCombinaison);
    return combinaison.reverse();
}

// récupération de la selection des items selectionner a partir d'un tableau contenant les index des items selectionner
function getSelectionItem(step, selectionIndex) {
    let selection = [];
    if (step.type === "number") {
        selection.push(step.min + selectionIndex[0] - 1);
    } else if (step.type === "char") {
        selection.push(step.chars[selectionIndex[0] - 1]);
    }
    if (step.subStep.length > 0) {
        selection = selection.concat(getSelectionItem(step.subStep[selectionIndex[0] - 1], selectionIndex.slice(1)));
    }
    return selection;
}
// fonction qui génere la selection aléatoire pour chaque étape
function getRandom(step1) {
    // récupération du nombre de combinaison possible
    let nbCombinaison = getNbCombinaison(step1);
    // récupération du nombre aléatoire
    let random = getRandomNumber(nbCombinaison);
    // récupération de la selection aléatoire
    let selectionIndex = getCombinaison(step1, random);
    console.log("combinaison index : ", selectionIndex);
    let selection = getSelectionItem(step1, selectionIndex);
    return selection;
}

console.log("getNbCombinaison : ", getNbCombinaison(steps));
console.log("getRandomNumber : ", getRandomNumber(getNbCombinaison(steps)));
console.log("nbStep : ", getNbStep(steps));
console.log("nbCombinaisonByStep : ", getNbCombinaisonByStep(steps));
console.log("getCombinaison : ", getCombinaison(steps, getRandomNumber(getNbCombinaison(steps))));
console.log("getRandom : ", getRandom(steps));
console.log("getTypeStep : ", getTypeStep(steps));

// fonction qui renvoie un num step
function numStep(it, min = 1, max = 10, subStep = []) {
    return {
        type: "number",
        min: min,
        max: max,
        it: it,
        subStep: subStep
    }
}

// fonction qui renvoie un char step
function charStep(it, chars = "abcdefghijklmnopqrstuvwxyz", subStep = []) {
    return {
        type: "char",
        chars: chars,
        it: it,
        subStep: subStep
    }
}

// get List Item d'un step => [1,2,3,4,5,6,7,8,9,10] ou ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
function getListItem(step) {
    console.log("getListItem : ", step);
    let list = [];
    if (step.type === "number") {
        for (let i = step.min; i <= step.max; i++) {
            list.push(i);
        }
    } else {
        for (let i = 0; i < step.chars.length; i++) {
            list.push(step.chars[i]);
        }
    }
    return list;
}

// get range d'un step
function getRange(step) {
    console.log("getRange : ", step);
    return getListItem(step).length;
}

// fonction récupere les steps du localStorage
function getSteps() {
    console.log("getSteps : ", JSON.parse(localStorage.getItem("steps")))
    return JSON.parse(localStorage.getItem("steps"));
}

// fonction qui sauvegarde les Steps dans le localStorage
function saveSteps(steps) {
    console.log("saveSteps : ", steps)
    localStorage.setItem("steps", JSON.stringify(steps));
    return steps;
}

// fonction d'initialisation de la page setup
function initSetupPage() {
    console.log("initSetupPage")

    // clear list type steps
    document.querySelector("#list-type-steps").innerHTML = "";

    let steps = getSteps();
    if (steps) {
        for (let type of getTypeStep(steps)) {
            document.querySelector("#list-type-steps").appendChild(createStepSelect(type));
        }
    } else {
        document.querySelector("#list-type-steps").appendChild(createStepSelect());
        steps = saveSteps(numStep(null));
    }
    reloadStepsSetup(steps)
}

// ajoute un sous step au niveau de step selectionner (en parametre index de type number) ou au dernier step si index est null avec le type subType (number ou char) par defaut number
function addSubSteps(parentStep, subType = "number") {
    console.log("addSubStep : ", subType);
    if (parentStep.subStep.length === 0) {
        for (let item of getListItem(parentStep)) {
            parentStep.subStep.push(subType === "number" ? numStep(item) : charStep(item));
        }
    } else {
        for (let step of parentStep.subStep) {
            step = addSubSteps(step, subType);
        }
    }
    return parentStep;
}


// event listener qui gere le boutton add Step
document.getElementById("add-type").addEventListener("click", function () {
    console.log("add type")
    document.querySelector("#list-type-steps").appendChild(createStepSelect());
    let steps = getSteps();
    if (steps) {
        addSubSteps(steps);
    } else {
        steps = numStep(null);
    }
    saveSteps(steps);
    if (getNbStep(steps) > 3) {
        document.getElementById("add-type").classList.add("hide");
    }
    deleteEventListeners();
    createEventListeners();

    reloadStepsSetup(steps);
});

function createStepSelect(type = "number") {
    console.log("createStepSelect : ", type)
    let div = document.createElement("div");
    div.className = "step-select";
    // create type select
    div.innerHTML = `
        <div>></div>
        <div class="type-step-container">
            <select class="type-step">
                <option value="number" ${type === "number" ? "selected" : ""}>Nombre</option>
                <option value="char" ${type === "char" ? "selected" : ""}>Caractère</option>
            </select>
        </div>
    `;
    return div;
}

// fonction qui cree un setup de Step de type nombre
function createStepNumber(step) {
    console.log("createStepNumber : ", step)
    let content = '<div class="setter">' +
        '<input type="number" class="min" value="' + step.min + '"></input>' +
        '<input type="number" class="max" value="' + step.max + '"></input>' +
        '</div>'
    if (step.subStep && step.subStep.length === step.max - step.min + 1) {
        content += '<div class="sub-steps">';
        for (let i = 0; i <= step.max - step.min; i++) {
            content += "<div class='sub-step' data-it='" + (step.min + i) + "'><div class='num-sub-step'>" + (step.min + i) + "</div>";
            if (step.subStep[i].type === "char") {
                content += createStepChar(step.subStep[i]);
            } else {
                content += createStepNumber(step.subStep[i]);
            }
            content += '</div>';
        }
        content += '</div>';
    }

    return content;
}

function createStepChar(step) {
    console.log("createStepChar : ", step);
    let content = '<div class="setter">' +
        '<input type="text" class="chars" value="' + step.chars + '"></input>' +
        '</div>'
    if (step.subStep && step.subStep.length === step.chars.length) {
        content += '<div class="sub-steps">';
        for (let i = 0; i < step.chars.length; i++) {
            content += "<div class='sub-step' data-it='" + step.chars[i] + "'><div class='char-sub-step'>" + step.chars[i] + "</div>";
            if (step.subStep.type === "char") {
                content += createStepChar(step.subStep[i]);
            } else {
                content += createStepNumber(step.subStep[i]);
            }
            content += '</div>';
        }
        content += '</div>';
    }
    return content;
}

// fontion qui fait changer de page vers la page de setup avec un animation
function changePageSetup() {
    console.log("change page to setup");
    initSetupPage();
    document.querySelector('#setup-page').style = "animation : slide-in 0.5s ease-in-out";
    document.querySelector('#main-page').style = "animation : slide-out 0.5s ease-in-out";
    setTimeout(function () {
        document.querySelector('#main-page').style = "display: none";
        document.querySelector('#setup-page').style = "";
    }, 500);
}

const gradientsMain = "radial-gradient(ellipse at -30%, rgba(60, 35, 137, 0.4) 0%, rgba(44, 27, 101, 0.15) 10%,  transparent 100%)"
let buttonRDMGradient = ", radial-gradient(circle at 50% 40%, rgba(60, 35, 137, 0.4) 4%, rgba(44, 27, 101, 0.4) 20%,  transparent 60%)"
const colorBackground = ", linear-gradient(rgb(23, 25, 33), rgb(23, 25, 33))";

function mainBackground() {
    let background = "";
    background += gradientsMain
    background += buttonRDMGradient;
    background += colorBackground;
    return "background: " + background + ";"
}

// fonction qui fait changer de page setup vers la page main avec un animation
function changePageMain() {
    console.log("change page to main");
    document.querySelector('#main-page').style = "animation : slide-in 0.5s ease-in-out";
    document.querySelector('#setup-page').style = "animation : slide-out 0.5s ease-in-out";
    setTimeout(function () {
        document.querySelector('#setup-page').style = "display: none";
        document.querySelector('#main-page').style = mainBackground();
    }, 500);
    steps = getSteps();
    createTextStep(steps);
}

// fonction qui anime le gradient du boutton RDM
function animateGradientRDM() {
    console.log("animate gradient RDM");
    let initMaxSize = 60;
    let maxSize = 60;
    let limitMaxSize = 60;
    let initVaguePosition = 20;
    let initVagueOpacity = 0.4;
    let vagueSize = 15;
    let vagues = [initVaguePosition, initVaguePosition]
    let gradient = "radial-gradient(circle at 50% 40%, rgba(60, 35, 137, 0.4) 4%, rgba(44, 27, 101, " + initVagueOpacity + ") " + initVaguePosition + "%,"
    for (let vague of vagues) {
        gradient += " rgba(44, 27, 101, " + vagueSize * initVagueOpacity / vagueSize + ") " + vague + "%, rgba(44, 27, 101, " + (limitMaxSize - initVaguePosition) * initVagueOpacity / (limitMaxSize - initVaguePosition) + ") " + vague + "%,"
    }
    gradient += " transparent 60%)";
    let i = 0;
    // intervalle qui cree des vagues de gradient
    let interval = setInterval(function () {
        i++;
        if (i > 200) {
            setTimeout(function () {
                console.log("stop interval");
                buttonRDMGradient = ", radial-gradient(circle at 50% 40%, rgba(60, 35, 137, 0.4) 4%, rgba(44, 27, 101, " + initVagueOpacity + ") " + initVaguePosition + "%,  transparent 60%)";
                document.querySelector("#main-page").style = mainBackground();
            }, 20);
            console.log("stop interval");
            clearInterval(interval);
        } else {
            if (maxSize < limitMaxSize)
                maxSize += 0.5;
        }
        gradient = "radial-gradient(circle at 50% 40%, rgba(60, 35, 137, 0.4) 4%, rgba(44, 27, 101, " + initVagueOpacity + ") " + initVaguePosition + "%,"
        for (let j = vagues.length-1; j > 0 ; j--) {
            if (vagues[j] < limitMaxSize) {
                if (vagues[j - 1] <= initVaguePosition + vagueSize) {
                    gradient += " rgba(44, 27, 101, " + vagueSize * initVagueOpacity / vagueSize + ") " + vagues[j] + "%, rgba(44, 27, 101, " + (limitMaxSize - initVaguePosition) * initVagueOpacity / (limitMaxSize - initVaguePosition) + ") " + vagues[j] + "%,"
                } else {
                    if (j === 1) {
                        console.log("1 : ", vagues[j], (vagues[j] - initVaguePosition < vagueSize ? initVagueOpacity - (vagues[j] - initVaguePosition) * initVagueOpacity / vagueSize : "0"), (vagues[j] - vagueSize / 2 > initVaguePosition ? vagues[j] - vagueSize / 2 : initVaguePosition), (vagues[j] < limitMaxSize ? (limitMaxSize - vagues[j]) * initVagueOpacity / (limitMaxSize - initVaguePosition) : "0"))
                    }
                    vagues[j] += 0.5;
                    let blackVaguePosition = vagues[j] - vagueSize / 2 > initVaguePosition ? vagues[j] - vagueSize / 2 : initVaguePosition

                    let changementOpacityofBackVague = (1-((vagues.length)-j/(vagues.length-1))*0.2)
                    console.log("changementOpacityofBackVague : ",changementOpacityofBackVague)
                    let blackVagueOpacity = (1 - ((blackVaguePosition - initVaguePosition)/vagueSize) * changementOpacityofBackVague) * initVagueOpacity
                    console.log("blackVagueOpacity : ",blackVagueOpacity)
                    let endBlackVagueOpacity = (1 - changementOpacityofBackVague) * initVagueOpacity
                    console.log(blackVaguePosition - initVaguePosition < vagueSize)
                    console.log((blackVaguePosition - initVaguePosition < vagueSize ? blackVagueOpacity : endBlackVagueOpacity * ((limitMaxSize - vagues[j])/(limitMaxSize - initVaguePosition - 1.5 * vagueSize))))
                    console.log(limitMaxSize - vagues[j])
                    console.log(limitMaxSize - initVaguePosition - 1.5 * vagueSize)
                    console.log(((limitMaxSize - vagues[j])/(limitMaxSize - initVaguePosition - 1.5 * vagueSize)))
                    gradient += " rgba(44, 27, 101, " + (blackVaguePosition - initVaguePosition < vagueSize ? blackVagueOpacity : endBlackVagueOpacity * ((limitMaxSize - vagues[j])/(limitMaxSize - initVaguePosition - 1.5 * vagueSize))) + ") " +
                    blackVaguePosition + "%," +
                        " rgba(44, 27, 101, " + (vagues[j] < limitMaxSize ? (limitMaxSize - vagues[j]) * initVagueOpacity / (limitMaxSize - initVaguePosition) : "0") + ") " +
                        vagues[j] + "%,"
                }
            }else if ( j === vagues.length-1 && maxSize >= initMaxSize) {
                maxSize--;
            }
        }
        if (vagues[0] < limitMaxSize) {
            vagues[0] += 0.5;
            gradient += " rgba(44, 27, 101, " + ((vagues[0] - vagueSize / 2 > initVaguePosition ? vagues[0] - vagueSize / 2 : initVaguePosition) - initVaguePosition < vagueSize ? initVagueOpacity - ((vagues[0] - vagueSize / 2 > initVaguePosition ? vagues[0] - vagueSize / 2 : initVaguePosition) - initVaguePosition) * initVagueOpacity / vagueSize : "0") + ") " +
                (vagues[0] - vagueSize / 2 > initVaguePosition ? vagues[0] - vagueSize / 2 : initVaguePosition) + "%," +
                " rgba(44, 27, 101, " + (vagues[0] < limitMaxSize ? (limitMaxSize - vagues[0]) * initVagueOpacity / (limitMaxSize - initVaguePosition) : "0") + ") " +
                vagues[0] + "%,"
        }
        gradient += " transparent " + maxSize + "%)";
        buttonRDMGradient = ", " + gradient
        document.querySelector("#main-page").style = mainBackground();
    }, 6);

}



// event listener qui gere le boutton back
document.querySelector("#back").addEventListener("click", function () {
    console.log("back");
    changePageMain();
});

// event listener qui gere le boutton setup
document.querySelector("#setup").addEventListener("click", function () {
    console.log("setup");
    changePageSetup();
    deleteEventListeners();
    createEventListeners();
});

// fonction reloadStepsSetup qui recharge les Steps dans la page setup

function reloadStepsSetup(steps) {
    console.log("reload steps setup");
    document.querySelector("#setup-range-step").innerHTML = "";
    document.querySelector("#setup-range-step").innerHTML = steps.type === "number" ? createStepNumber(steps) : createStepChar(steps);

    deleteEventListeners();
    createEventListeners();
}

// function changeAllObjAtStep qui change tous les objets d'un Step et qui retourne Steps avec les objets changer
// structure de Steps : 
// {
//     type : "number" ou "char",
//     min : 0 si type = "number",
//     max : 9 si type = "number",
//     chars : "abcdefghijklmnopqrstuvwxyz" si type = "char",
//     subStep : [ // un sous Step pour chaque caractere de chars si type = "char" ou pour chaque nombre entre min et max si type = "number"
//          {
//              it:min-max ou a-z,
//              type : "number" ou "char",
//              min : 0 si type = "number",
//              max : 9 si type = "number",
//              chars : "abcdefghijklmnopqrstuvwxyz" si type = "char",
//              subStep : [  ...  ]
//         },
//         {
//              it:min-max ou a-z,
//              type : "number" ou "char",
//              min : 0 si type = "number",
//              max : 9 si type = "number",
//              chars : "abcdefghijklmnopqrstuvwxyz" si type = "char",
//              subStep : [  ...  ]
//         },
//         ...
//     ]
// }

// function createNewStep qui cree un nouveau sous Step
function createNewStep(subType, it, subSteps) {
    let newStep = subType === "number" ? numStep(it) : charStep(it);
    if (subSteps && subSteps[0]) {
        newStep.subStep = [];
        const subSubType = subSteps[0].type;
        for (let item of getListItem(newStep)) {
            const newSubStep = subSteps.find((subStep) => subStep.it === item) || createNewStep(subSubType, item, subSteps[0].subStep);
            newStep.subStep.push(newSubStep);
        }
    }
    return newStep;
}

// index : nombre de sous Step a partir duquel on veut changer les objets ex : index = 2 => on change Steps.subStep[i].subStep (2 => 2 subStep)), index = 0 => on change Steps, index = 1 => on change Steps.subStep[i] (1 => 1 subStep)
function changeTypeStep(steps, index, type) {
    console.log("changeTypeStep : ", steps, index, type);
    if (index === 0) {
        return createNewStep(type, steps.it, steps.subStep);
    } else {
        for (let i = 0; i < steps.subStep.length; i++) {
            steps.subStep[i] = changeTypeStep(steps.subStep[i], index - 1, type);
        }
        return steps;
    }
}

// event listener qui gere le boutton qui lance le random
document.querySelector("#random").addEventListener("click", function () {
    animateGradientRDM();
    console.log("random");
    steps = getSteps();
    let selection = getRandom(steps);
    console.log("selection : ", selection);
    createItemsStep(selection, 0, steps);
    runAnimation(selection);
    // unfocus after 0.6s
    setTimeout(function () {
        document.querySelector("#random").blur();
    }, 300);
});

function animationdefilement(step) {
    let i = 0;
    let interval = setInterval(function () {
        if (i < 20) {
            let items = step.querySelectorAll("span");
            let randomIndex = Math.floor(Math.random() * items.length);
            let randomItem = items[randomIndex];
            step.querySelector(".show").classList.remove("show");
            randomItem.classList.add("show");
            i++;
        } else {
            step.querySelector(".show").classList.remove("show");
            step.querySelector(".selected").classList.add("show");
            clearInterval(interval);
        }
    }, 100);
}

// function runAnimation qui lance l'animation de selection des Steps et qui affiche le resultat après avoir affiché aléatoirement chaque items du step selectionné pendant 3s par step et qui s'arrete sur l'item selectionné
function runAnimation(selection) {
    console.log("runAnimation : ", selection);
    let i = 1;
    console.log("selection.length : ", selection.length);
    animationdefilement(document.querySelector("#step0"));
    let stepInterval = setInterval(function () {
        console.log("i : ", i);
        if (i < selection.length) {
            animationdefilement(document.querySelector("#step" + i));
            i++;
        } else {
            clearInterval(stepInterval);
        }
    }, 2100);
}

// function createItemsStep qui crée les items de chaque Step et qui les ajoute dans la page main, le premier step est initialisé a min si type = "number" ou au premier caractere de chars si type = "char"
function createItemsStep(selection, index, steps) {
    console.log("createItemsStep : ", selection, index, steps);
    let step = document.querySelector("#step" + index);
    step.innerHTML = "";
    for (let item of getListItem(steps)) {
        step.innerHTML += '<span item="' + item + '">' + item.toString().toUpperCase() + '</span>';
    }
    step.querySelectorAll("span")[0].classList.add("show");
    step.querySelector('span[item = "' + selection[index] + '"]').classList.add("selected");
    if (index < selection.length - 1) {
        createItemsStep(selection, index + 1, steps.subStep.find((subStep) => subStep.it === selection[index]));
    }
}


// fontion qui crée les text de chaque Step et les ajoute dans la page main, le premier step est initialisé a min si type = "number" ou au premier caractere de chars si type = "char"
function createTextStep(steps) {
    console.log("createTextStep : ", steps);
    let text = '<span id="step0">' + (steps.type === "number" ? steps.min : steps.chars[0].toUpperCase()) + '</span>';
    for (let i = 1; i < getNbStep(steps); i++) {
        text += '<span id="step' + i + '"></span>'
    }
    document.querySelector("#list-steps").innerHTML = text;
}


// function changeStep qui change le Step et ajoute des sous Step si necessaire
function changeStep(step, char = null, min = null, max = null) {
    console.log("changeStep : ", step);
    if (char) {
        step.chars = char;
    }
    if (min) {
        step.min = parseInt(min);
    }
    if (max) {
        step.max = parseInt(max);
    }
    if (step.subStep && step.subStep.length > 0) {
        let newSubStep = [];
        let subSteps = step.subStep;
        step.subStep = [];
        const subType = subSteps[0].type;
        for (let item of getListItem(step)) {
            console.log("item : ", item)
            let subStep = subSteps.find(s => s.it === item);
            console.log("subStep : ", subStep)
            if (subStep) {
                newSubStep.push(subStep);
            } else {
                newSubStep.push(createNewStep(subType, item, subSteps[0].subStep));
            }
        }
        step.subStep = newSubStep;
    }
    console.log("To : ", step);
    return step;
}




// event listener qui gere les bouttons delete Step
document.querySelector("#delete-steps").addEventListener("click", function () {
    console.log("delete steps")

    // clear list type steps
    document.querySelector("#list-type-steps").innerHTML = "";

    document.querySelector("#list-type-steps").appendChild(createStepSelect());
    steps = saveSteps(numStep(null));
    if (document.getElementById("add-type").classList.contains("hide")) {
        document.getElementById("add-type").classList.remove("hide");
    }
    reloadStepsSetup(steps)
});

//fonction getStepByEl qui selectionne le Step correspondant a l'element dans steps et effectue la fonction functionOnStep sur ce Step
function getStepByEl(steps, el, functionOnStep) {
    let step = steps;
    let i = 0;
    let combinaison = [];
    while (el.closest(".sub-step") && i < 10) {
        i++;
        combinaison.push(el.closest(".sub-step").dataset.it);
        el = el.closest(".sub-step").parentNode;
    }
    combinaison.reverse();
    let listTypeSteps = getTypeStep(steps);
    console.log(combinaison);
    console.log(listTypeSteps);
    for (let i = 0; i < combinaison.length; i++) {
        if (listTypeSteps[i] === "number") {
            combinaison[i] = parseInt(combinaison[i]);
        }
    }
    console.log(combinaison);
    for (let it of combinaison) {
        step = step.subStep.find((subStep) => subStep.it === it);
    }
    console.log(step);
    step = functionOnStep(step);
    console.log(steps);
    return steps;
}

// fonction qui cree les event listeners de la page setup
function createEventListeners() {
    // event listener qui gere le changement de type de Step
    document.querySelectorAll(".type-step").forEach((el, i) => {
        el.addEventListener("change", function () {
            // fonction getAllObjAtStep qui retourne tous les objets d'un Step
            console.log(el.value)
            let value = el.value;
            console.log("change type step : " + i)
            let steps = getSteps();
            steps = changeTypeStep(steps, i, el.value);
            saveSteps(steps);
            document.querySelector("#list-type-steps").innerHTML = "";
            for (let type of getTypeStep(steps)) {
                document.querySelector("#list-type-steps").appendChild(createStepSelect(type));
            }
            reloadStepsSetup(steps);
        });
    });
    // event listener qui gere le changement du range de Step
    document.querySelectorAll("#setup-range-step input").forEach((el, i) => {
        el.addEventListener("blur", function () {
            // selection du step correspondant au range change dans la liste des steps (getSteps)
            console.log("change range step : " + i)
            let steps = getSteps();
            // on selectionne le step correspondant au range change à l'aide de la présence de la class "sub-steps" sur la div parente sur l'input changé
            steps = getStepByEl(steps, el, (step) => {
                console.log(step)
                // on change le Step
                console.log(step.type === "number" ? el.classList.contains("min") ? 'min' : 'max' : 'char')
                return step.type === "number" ? el.classList.contains("min") ? changeStep(step, null, el.value, null) : changeStep(step, null, null, el.value) : changeStep(step, el.value, null, null);
            });
            // on sauvegarde les steps
            saveSteps(steps);
            // on recharge la page setup
            reloadStepsSetup(steps);
        });
    });
}


// fonction qui supprime les event listeners présents sur les panels
function deleteEventListeners() {
    // tableau des classes possédant des event listeners
    const classes = ['#setup-range-step input', '.type-step']
    // on parcours le tableau des classes
    classes.forEach((class_name, index) => {
        // on récupere les éléments possédant la classe
        const elements = document.querySelectorAll(class_name)
        // on parcours les éléments
        elements.forEach((element, index) => {
            // on supprime les event listeners
            const new_element = element.cloneNode(true)
            element.parentNode.replaceChild(new_element, element)
        })
    })
}

changePageMain()
createEventListeners();
