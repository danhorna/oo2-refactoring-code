import React from 'react';
import { Link } from "route-lite";
import VersionListView from "./VersionListView";
import { CodeBlock, dracula } from "react-code-blocks";
import XPathInterpreter from "../refactorings/XPathInterpreter";
import { generateComponent, generateArray } from "../js/helpers";
import { Accordion, Card, Button } from 'react-bootstrap';
import NotElementRefactoring from "./NotElementRefactoring";
import FormRefactorings from "./FormRefactorings";
import NormalRefactorings from "./NormalRefactorings";

var HTMLtoJSX = require('htmltojsx');

class CodeView extends React.Component {

    constructor() {
        super();
        
          
    }

    formElementIndexExists(formElementRefactoring,requiredInputsXpaths,elementWord,randomInt,refactoring,indexIfExists,converter,formElement){
            let elements = [];
            let preFunctions = "";
            requiredInputsXpaths.map(xpath => {
                let modXpath = refactoring.getElementXpath() + xpath.substring(2);
                let xPathFound = false;
                let randomIntExists = null;
                for (let i = 0; i < formElementRefactoring[indexIfExists].elementsModified.length; i++) {
                    if (formElementRefactoring[indexIfExists].elementsModified[i].elementXpath == modXpath) {
                        xPathFound = true;
                        randomIntExists = formElementRefactoring[indexIfExists].elementsModified[i].numberId;
                        break;
                    }
                }
                let auxElement = new XPathInterpreter().getSingleElementByXpath(xpath, formElement);
                if (xPathFound) {
                    preFunctions += refactoring.preFunctions(elementWord, randomIntExists);
                    auxElement.setAttribute("id", elementWord + randomIntExists.toString());
                }
                else {
                    let auxRandomInt = Math.floor(Math.random() * 9999) + 1;
                    preFunctions += refactoring.preFunctions(elementWord, auxRandomInt);
                    elements.push({ elementXpath: modXpath, numberId: auxRandomInt });
                    auxElement.setAttribute("id", elementWord + auxRandomInt.toString());
                }
            })
            formElementRefactoring[indexIfExists].elementsModified = generateArray(formElementRefactoring[indexIfExists].elementsModified, elements);
            formElementRefactoring[indexIfExists].imports = generateArray(formElementRefactoring[indexIfExists].imports, refactoring.imports());
            formElementRefactoring[indexIfExists].mounts = generateArray(formElementRefactoring[indexIfExists].mounts, refactoring.mounts(elementWord, randomInt));
            formElementRefactoring[indexIfExists].functions = generateArray(formElementRefactoring[indexIfExists].functions, refactoring.functions(elementWord, randomInt, preFunctions));
            formElementRefactoring[indexIfExists].stringFormElement = converter.convert(formElement.outerHTML);

            return formElementRefactoring;

    }

    formRefac(requiredInputsXpaths,refactoring,elementWord, randomInt,converter,formElement,bodyClone){
        let elements = [];
        let preFunctions = "";
        requiredInputsXpaths.map(xpath => {
            let auxRandomInt = Math.floor(Math.random() * 9999) + 1;
            let auxElement = new XPathInterpreter().getSingleElementByXpath(xpath, formElement);
            let modXpath = refactoring.getElementXpath() + xpath.substring(2);
            preFunctions += refactoring.preFunctions(elementWord, auxRandomInt);
            auxElement.setAttribute("id", elementWord + auxRandomInt.toString());
            elements.push({ elementXpath: modXpath, numberId: auxRandomInt });
        })
        let elementsModified = generateArray([], elements);
        let imports = generateArray([], refactoring.imports());
        let mounts = generateArray([], refactoring.mounts(elementWord, randomInt));
        let functions = generateArray([], refactoring.functions(elementWord, randomInt, preFunctions));
        var output = converter.convert(formElement.outerHTML);
        const form = {
            formXpath: refactoring.getElementXpath(),
            elementBody: bodyClone,
            stringFormElement: output,
            elementsModified,
            imports,
            mounts,
            functions
        }
        return form;
    }

    refactoringHasInside(formElementRefactoring,refactoring,elementWord,randomInt,converter){
        let formExistInside = false;
        let indexIfExists = null;
        let bodyClone = document.body.cloneNode(true);
        let formElement = new XPathInterpreter().getSingleElementByXpath(refactoring.getElementXpath(), bodyClone);
        for (let i = 0; formElementRefactoring.length; i++) {
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
        formElement.setAttribute("id", elementWord + randomInt.toString());     //para guardar
        let requiredInputsXpaths = refactoring.getRequiredInputXpaths();
        if (formExistInside) {
            //funcion 3
            formElementRefactoring=this.formElementIndexExists(formElementRefactoring,requiredInputsXpaths,elementWord,randomInt,refactoring,indexIfExists,converter,formElement);
        }
        else {
            //funcion
            let form=this.formRefac(requiredInputsXpaths,refactoring,elementWord, randomInt,converter,formElement,bodyClone);
            formElementRefactoring.push(form);
        }
        return formElementRefactoring;
    }

    existInForm(formElementRefactoring,elementIndexInFormElementRefactoring,elementWord, randomInt,refactoring,elementXpath,formElementXpath,converter ){
        let xPathModified = false;
        let indexXpathModified;
        let elementXpathId;
        let elementInClone = new XPathInterpreter().getSingleElementByXpath(elementXpath, formElementRefactoring[elementIndexInFormElementRefactoring].elementBody);
        let formElementInClone = new XPathInterpreter().getSingleElementByXpath(formElementXpath, formElementRefactoring[elementIndexInFormElementRefactoring].elementBody);
        for (let i = 0; i < formElementRefactoring[elementIndexInFormElementRefactoring].elementsModified.length; i++) {
            if (formElementRefactoring[elementIndexInFormElementRefactoring].elementsModified[i].elementXpath == elementXpath) {
                xPathModified = true;
                indexXpathModified = i;
                elementXpathId = formElementRefactoring[elementIndexInFormElementRefactoring].elementsModified[i].numberId;
                break;
            }
        }
        formElementRefactoring[elementIndexInFormElementRefactoring].imports = generateArray(formElementRefactoring[elementIndexInFormElementRefactoring].imports, refactoring.imports());
        if (xPathModified) {
            formElementRefactoring[elementIndexInFormElementRefactoring].mounts = generateArray(formElementRefactoring[elementIndexInFormElementRefactoring].mounts, refactoring.mounts(elementWord, formElementRefactoring[elementIndexInFormElementRefactoring].elementsModified[indexXpathModified].numberId));
            formElementRefactoring[elementIndexInFormElementRefactoring].functions = generateArray(formElementRefactoring[elementIndexInFormElementRefactoring].functions, refactoring.functions(elementWord, formElementRefactoring[elementIndexInFormElementRefactoring].elementsModified[indexXpathModified].numberId));
        }
        else {
            elementInClone.setAttribute("id", elementWord + randomInt.toString());
            // formElementRefactoring[elementIndexInFormElementRefactoring].stringFormElement       COMPROBAR: quizas sea necesario guardar el nuevo elementBody para que se almacene el ultimo setattribute
            formElementRefactoring[elementIndexInFormElementRefactoring].stringFormElement = converter.convert(formElementInClone.outerHTML);;
            formElementRefactoring[elementIndexInFormElementRefactoring].elementsModified.push({ elementXpath, numberId: randomInt });
            formElementRefactoring[elementIndexInFormElementRefactoring].mounts = generateArray(formElementRefactoring[elementIndexInFormElementRefactoring].mounts, refactoring.mounts(elementWord, randomInt));
            formElementRefactoring[elementIndexInFormElementRefactoring].functions = generateArray(formElementRefactoring[elementIndexInFormElementRefactoring].functions, refactoring.functions(elementWord, randomInt));
        }

        return formElementRefactoring;
    }

    refactoringNotHasInside(formElementRefactoring,elementWord, randomInt,refactoring,converter ){
        let formElementXpath;
        let existsInFormElementRefactoring = false;
        let elementIndexInFormElementRefactoring = null;
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
                elementIndexInFormElementRefactoring = j;
                break;
            }
        }
        let bodyClone = document.body.cloneNode(true);          //evito modificar el verdadero body
        let elementXpath = refactoring.getElementXpath();
        let elementInClone = new XPathInterpreter().getSingleElementByXpath(elementXpath, bodyClone);
        let formElementInClone = new XPathInterpreter().getSingleElementByXpath(formElementXpath, bodyClone);
        elementInClone.setAttribute("id", elementWord + randomInt.toString());
        if (existsInFormElementRefactoring) {
           //funcion
           formElementRefactoring=this.existInForm(formElementRefactoring,elementIndexInFormElementRefactoring,elementWord, randomInt,refactoring,elementXpath,formElementXpath,converter);
        }
        else {
            let imports = generateArray([], refactoring.imports());
            let mounts = generateArray([], refactoring.mounts(elementWord, randomInt));
            let functions = generateArray([], refactoring.functions(elementWord, randomInt));
            let elementsModified = generateArray([], [{ elementXpath, numberId: randomInt }])
            var output = converter.convert(formElementInClone.outerHTML);
            const form = {
                formXpath: formElementXpath,
                elementBody: bodyClone,
                stringFormElement: output,
                elementsModified: elementsModified,
                imports: imports,
                mounts: mounts,
                functions: functions,
            };
            formElementRefactoring.push(form);
        }
        return formElementRefactoring;
    }

    formElementRef(refactoring,formElementRefactoring,converter){
    
        let elementWord = "example";
        let randomInt = Math.floor(Math.random() * 9999) + 1;
        if (refactoring.hasInside()) {
            //funcion 4
            formElementRefactoring=this.refactoringHasInside(formElementRefactoring,refactoring,elementWord,randomInt,converter);
        }
        else {
            //function 5
            formElementRefactoring=this.refactoringNotHasInside(formElementRefactoring,elementWord, randomInt ,refactoring,converter);
        }
        return formElementRefactoring;

    }

    single(singleElementRefactoring,converter,refactoring,element ){
        
        let elementWord = "example";
        let randomInt = Math.floor(Math.random() * 9999) + 1;

        let existsInElementRefactoring = false;
        let elementIndexInElementRefactoring = null;
        let elementClone = element.cloneNode(true);
        for (let j = 0; j < singleElementRefactoring.length; j++) {
            if (singleElementRefactoring[j].xPath == refactoring.getElementXpath()) {
                existsInElementRefactoring = true;
                elementIndexInElementRefactoring = j;
                break;
            }
        }
        if (existsInElementRefactoring) {
            if (!singleElementRefactoring[elementIndexInElementRefactoring].name.includes(refactoring.constructor.asString()))
                singleElementRefactoring[elementIndexInElementRefactoring].name += " & " + refactoring.constructor.asString();
            singleElementRefactoring[elementIndexInElementRefactoring].imports = generateArray(singleElementRefactoring[elementIndexInElementRefactoring].imports, refactoring.imports());
            singleElementRefactoring[elementIndexInElementRefactoring].mounts = generateArray(singleElementRefactoring[elementIndexInElementRefactoring].mounts, refactoring.mounts(elementWord, singleElementRefactoring[elementIndexInElementRefactoring].numberId));
            singleElementRefactoring[elementIndexInElementRefactoring].functions = generateArray(singleElementRefactoring[elementIndexInElementRefactoring].functions, refactoring.functions(elementWord, singleElementRefactoring[elementIndexInElementRefactoring].numberId));
        }
        else {
            let imports = generateArray([], refactoring.imports());
            let mounts = generateArray([], refactoring.mounts(elementWord, randomInt));
            let functions = generateArray([], refactoring.functions(elementWord, randomInt));
            elementClone.setAttribute("id", elementWord + randomInt.toString());
            var output = converter.convert(elementClone.outerHTML);
            const elementData = {
                name: refactoring.constructor.asString(),
                xPath: refactoring.getElementXpath(),
                stringElement: output,
                numberId: randomInt,
                imports: imports,
                mounts: mounts,
                functions: functions,
            }
            singleElementRefactoring.push(elementData);
        }
        return singleElementRefactoring;
    }

    notElement(notElementRefactoring,refactoring,elementWord,randomInt,converter){
        let existsInNotElementRefactoring = false;
        for (let j = 0; j < notElementRefactoring.length; j++) {
            if (notElementRefactoring[j].name == refactoring.constructor.asString()) {
                existsInNotElementRefactoring = true;
                break;
            }
        }
        if (!existsInNotElementRefactoring) {
            var output = converter.convert(refactoring.stringRefactoring(elementWord, randomInt));
            let notEelement = {
                name: refactoring.constructor.asString(),
                stringRefactoring: output,
                imports: refactoring.imports(),
                mounts: refactoring.mounts(elementWord, randomInt),
                functions: refactoring.functions(elementWord, randomInt),
            }
            notElementRefactoring.push(notEelement)
        }
        return notElementRefactoring;
    }
    
    render() {
        var converter = new HTMLtoJSX({
            createClass: false,
            outputClassName: 'TestComponent'
        });
        let singleElementRefactoring = [];
        let formElementRefactoring = [];
        let notElementRefactoring = [];
        window.refactoringManager.getCurrentVersion().getRefactorings().map(refactoring => {
            let elementWord = "example";
            let randomInt = Math.floor(Math.random() * 9999) + 1;
            if (refactoring.isOnElement()) {            //verifico que se trate de un refactoring que afecte al menos un elemento
                let element = refactoring.getElement();
                if (refactoring.getElementXpath().includes("form")) {           //verifico si se trata de un refactoring que actua sobre un formulario
                    //primera funcion
                    formElementRefactoring = this.formElementRef(refactoring,formElementRefactoring,converter);
                }
                else {
                    //segunda funcion
                    singleElementRefactoring = this.single(singleElementRefactoring,converter,refactoring,element)
                }
            }
            else {
                //funcion 3
                notElementRefactoring=this.notElement(notElementRefactoring,refactoring,elementWord,randomInt,converter);
            }
        });
        return (
            <div className="container">
                <div className="row">
                    <h5 className='text-center col-12'>Refactorings Code</h5>
                </div>
                <Accordion>
                    <FormRefactorings formElementRefactoring={formElementRefactoring} counter={0} ></FormRefactorings>
                    <NormalRefactorings singleElementRefactoring={singleElementRefactoring} counter={formElementRefactoring.length}   ></NormalRefactorings>                    
                    <NotElementRefactoring notElementRefactoring={notElementRefactoring} counter={formElementRefactoring.length + singleElementRefactoring.length} ></NotElementRefactoring>
                </Accordion>
                <div className={'row uxpainter-long-row'}>
                    <div className={'col-5'}>
                        <Link className={'btn btn-secondary'} component={VersionListView}><i className="fas fa-arrow-circle-left"></i> Back</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default CodeView