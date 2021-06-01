import XPathInterpreter from "../refactorings/XPathInterpreter";
import { generateArray, generateRandomNumber } from "../js/helpers";
var HTMLtoJSX = require('htmltojsx');
function formExistIn(formElementRefactoring,refactoring,requiredInputsXpaths,formElement,elementWord,indexIfExists,converter){
    let elements = [];
        requiredInputsXpaths.map(xpath => {
            if (!formElementRefactoring[indexIfExists].requiredInputsXpaths.includes(xpath)) {
                let modXpath = refactoring.getElementXpath() + xpath.substring(2);
                let auxRandomInt = generateRandomNumber();
                let auxElement = new XPathInterpreter().getSingleElementByXpath(xpath, formElement);
                let existsInElementsModified = false;
                formElementRefactoring[indexIfExists].elementsModified.forEach((element) => {
                    if (element.elementXpath == modXpath) {
                        existsInElementsModified = true;
                        auxRandomInt = element.numberId;
                    }
                })
                if (!existsInElementsModified) {
                    elements.push({ elementXpath: modXpath, numberId: auxRandomInt });
                    auxElement.setAttribute("id", elementWord + auxRandomInt.toString());
                }
                formElementRefactoring[indexIfExists].requiredInputs.push(elementWord + auxRandomInt.toString());
                formElementRefactoring[indexIfExists].requiredInputsXpaths.push(xpath)
            }
        })
        formElementRefactoring[indexIfExists].elementsModified = generateArray(formElementRefactoring[indexIfExists].elementsModified, elements);
        formElementRefactoring[indexIfExists].imports = generateArray(formElementRefactoring[indexIfExists].imports, refactoring.imports());
        formElementRefactoring[indexIfExists].stringFormElement = converter.convert(formElement.outerHTML);
        formElementRefactoring[indexIfExists].required = true;

}
function notFormExistIn(formElementRefactoring,requiredInputsXpaths,converter,formElement,refactoring,elementWord,bodyClone){
    let elements = [];
        let requiredInputs = []
        requiredInputsXpaths.map(xpath => {
            let auxRandomInt = generateRandomNumber();
            let auxElement = new XPathInterpreter().getSingleElementByXpath(xpath, formElement);
            let modXpath = refactoring.getElementXpath() + xpath.substring(2);
            auxElement.setAttribute("id", elementWord + auxRandomInt.toString());
            requiredInputs.push(elementWord + auxRandomInt.toString());
            elements.push({ elementXpath: modXpath, numberId: auxRandomInt });
            requiredInputsXpaths.push(xpath)
        })
        let elementsModified = generateArray([], elements);
        let imports = generateArray([], refactoring.imports());
        let functions = [];
        var output = converter.convert(formElement.outerHTML);
        const form = {
            formXpath: refactoring.getElementXpath(),
            elementBody: bodyClone,
            stringFormElement: output,
            elementsModified,
            imports,
            functions,
            required: true,
            requiredInputs,
            requiredInputsXpaths
        }
        formElementRefactoring.push(form);
}

function formHasInside(formElementRefactoring,randomInt,refactoring,elementWord,converter ){
    let formExistInside = false;
    let indexIfExists = null;
    let bodyClone = document.body.cloneNode(true);
    let formElement = new XPathInterpreter().getSingleElementByXpath(refactoring.getElementXpath(), bodyClone);
    for (let i = 0; i < formElementRefactoring.length; i++) {
        if (formElementRefactoring[i].formXpath == refactoring.getElementXpath()) {
            formExistInside = true;
            indexIfExists = i;
            bodyClone = formElementRefactoring[i].elementBody;
            formElement = new XPathInterpreter().getSingleElementByXpath(refactoring.getElementXpath(), formElementRefactoring[i].elementBody);
            if (formElementRefactoring[i].formXpathRandomInt != undefined) {
                randomInt = formElementRefactoring[i].formXpathRandomInt;
            }
            break;
        }
    }
    let requiredInputsXpaths = refactoring.getRequiredInputXpaths();
    requiredInputsXpaths = new Set(requiredInputsXpaths);
    requiredInputsXpaths = [...requiredInputsXpaths];
    if (formExistInside) {
        //formExitInside
        formExistIn(formElementRefactoring,refactoring,requiredInputsXpaths,formElement,elementWord,indexIfExists,converter);
    }
    else {
        //notFormExistIn
        notFormExistIn(formElementRefactoring,requiredInputsXpaths,converter,formElement,refactoring,elementWord,bodyClone);
        
    }
    return formElementRefactoring;
}
function existsInFormElement(formElementRefactoring,randomInt,refactoring,elementWord,converter,elementInClone,elemenIF,elementXpath,formElementInClone,formElementXpath){
    let xPathModified = false;
        let indexXpathModified;
        let elementXpathId;
        elementInClone = new XPathInterpreter().getSingleElementByXpath(elementXpath, formElementRefactoring[elemenIF].elementBody);
        formElementInClone = new XPathInterpreter().getSingleElementByXpath(formElementXpath, formElementRefactoring[elemenIF].elementBody);
        for (let i = 0; i < formElementRefactoring[elemenIF].elementsModified.length; i++) {
            if (formElementRefactoring[elemenIF].elementsModified[i].elementXpath == elementXpath) {
                xPathModified = true;
                indexXpathModified = i;
                elementXpathId = formElementRefactoring[elemenIF].elementsModified[i].numberId;
                break;
            }
        }
        formElementRefactoring[elemenIF].imports = generateArray(formElementRefactoring[elemenIF].imports, refactoring.imports());
        if (xPathModified) {
            formElementRefactoring[elemenIF].functions = generateArray(formElementRefactoring[elemenIF].functions, refactoring.functions(elementWord, formElementRefactoring[elemenIF].elementsModified[indexXpathModified].numberId));
        }
        else {
            elementInClone.setAttribute("id", elementWord + randomInt.toString());
            // formElementRefactoring[elemenIF].stringFormElement       COMPROBAR: quizas sea necesario guardar el nuevo elementBody para que se almacene el ultimo setattribute
            formElementRefactoring[elemenIF].stringFormElement = converter.convert(formElementInClone.outerHTML);
            formElementRefactoring[elemenIF].elementsModified.push({ elementXpath, numberId: randomInt });
            formElementRefactoring[elemenIF].functions = generateArray(formElementRefactoring[elemenIF].functions, refactoring.functions(elementWord, randomInt));
        }
}

function notFormHasInside(formElementRefactoring,randomInt,refactoring,elementWord,converter){
    let formElementXpath;
    let existsInFormElementRefactoring = false;
    let elemenIF = null;
    let separated = refactoring.getElementXpath().split("/");
    for (let i = 0; i < separated.length; i++) {
        if (separated[i].includes('form')) {
            let formIndex = refactoring.getElementXpath().indexOf(separated[i]);
            formElementXpath = refactoring.getElementXpath().substring(0, formIndex + separated[i].length);
            break;
        }
    }
    for (let j = 0; j < formElementRefactoring.length; j++) {
        if (formElementRefactoring[j].formXpath == formElementXpath) {
            existsInFormElementRefactoring = true;
            elemenIF = j;
            break;
        }
    }
    let bodyClone = document.body.cloneNode(true);          //evito modificar el verdadero body
    let elementXpath = refactoring.getElementXpath();
    let elementInClone = new XPathInterpreter().getSingleElementByXpath(elementXpath, bodyClone);
    let formElementInClone = new XPathInterpreter().getSingleElementByXpath(formElementXpath, bodyClone);
    elementInClone.setAttribute("id", elementWord + randomInt.toString());
    if (existsInFormElementRefactoring) {
        //existsInFormElementRefactoring
        existsInFormElement(formElementRefactoring,randomInt,refactoring,elementWord,converter,elementInClone,elemenIF,elementXpath,formElementInClone,formElementXpath)
        
    }
    else {
        let requiredInputsXpaths = []
        let imports = generateArray([], refactoring.imports());
        let functions = generateArray([], refactoring.functions(elementWord, randomInt));
        let elementsModified = generateArray([], [{ elementXpath, numberId: randomInt }])
        var output = converter.convert(formElementInClone.outerHTML);
        const form = {
            formXpath: formElementXpath,
            elementBody: bodyClone,
            stringFormElement: output,
            elementsModified: elementsModified,
            imports: imports,
            functions: functions,
            required: false,
            requiredInputs: [],
            requiredInputsXpaths
        };
        formElementRefactoring.push(form);
    }

}

function singleElement(singleElementRefactoring,randomInt,refactoring,elementWord,converter,element){

    let existsInElementRefactoring = false;
    let elemI = null;
    let elementClone = element.cloneNode(true);
    for (let j = 0; j < singleElementRefactoring.length; j++) {
        if (singleElementRefactoring[j].xPath == refactoring.getElementXpath()) {
            existsInElementRefactoring = true;
            elemI = j;
            break;
        }
    }
    if (existsInElementRefactoring) {
        if (refactoring.affectsInput() && (singleElementRefactoring[elemI].state == null))
            singleElementRefactoring[elemI].state = elementWord + randomInt.toString();
        if (!singleElementRefactoring[elemI].name.includes(refactoring.constructor.asString()))
            singleElementRefactoring[elemI].name += " & " + refactoring.constructor.asString();
        singleElementRefactoring[elemI].imports = generateArray(singleElementRefactoring[elemI].imports, refactoring.imports());
        singleElementRefactoring[elemI].functions = generateArray(singleElementRefactoring[elemI].functions, refactoring.functions(elementWord, singleElementRefactoring[elemI].numberId));
    }
    else {
        let imports = generateArray([], refactoring.imports());
        let functions = generateArray([], refactoring.functions(elementWord, randomInt));
        if (refactoring.affectsInput())
            elementClone.setAttribute("id", elementWord + randomInt.toString());
        var output = converter.convert(elementClone.outerHTML);
        const elementData = {
            name: refactoring.constructor.asString(),
            xPath: refactoring.getElementXpath(),
            stringElement: output,
            numberId: randomInt,
            imports: imports,
            functions: functions,
            state: refactoring.affectsInput() ? elementWord + randomInt.toString() : null
        }
        singleElementRefactoring.push(elementData);
    }

}
function notElement(notElementRefactoring,refactoring){
     //let existsInNotElementRefactoring = false;
            // for (let j = 0; j < notElementRefactoring.length; j++) {
            //     if (notElementRefactoring[j].name == refactoring.constructor.asString()) {
            //         existsInNotElementRefactoring = true;
            //         break;
            //     }
            // }
            let findIfExistsInNotElementRefactoring = notElementRefactoring.find(element => element.name == refactoring.constructor.asString());
            if (!findIfExistsInNotElementRefactoring) {
                let state = refactoring.state();
                let notEelement = {
                    name: refactoring.constructor.asString(),
                    stringRefactoring: refactoring.stringRefactoring(),
                    imports: refactoring.imports(),
                    functions: refactoring.functions(),
                    state
                }
                notElementRefactoring.push(notEelement)
            }
}

export function generateElements(singleElementRefactoring, formElementRefactoring, notElementRefactoring, elementWord) {
    var converter = new HTMLtoJSX({
        createClass: false,
        outputClassName: 'TestComponent'
    });
    window.refactoringManager.getCurrentVersion().getRefactorings().map(refactoring => {
        let randomInt = generateRandomNumber();
        if (refactoring.isOnElement()) {
            let element = refactoring.getElement();
            if (refactoring.getElementXpath().includes("form")) {
                if (refactoring.hasInside()) {
                    formHasInside(formElementRefactoring,randomInt,refactoring,elementWord,converter);
                }
                else {
                    notFormHasInside(formElementRefactoring,randomInt,refactoring,elementWord,converter);
                }
            }
            else {
                singleElement(singleElementRefactoring,randomInt,refactoring,elementWord,converter,element);               
            }
        }
        else {
            notElement(notElementRefactoring,refactoring);           
        }
    });
}