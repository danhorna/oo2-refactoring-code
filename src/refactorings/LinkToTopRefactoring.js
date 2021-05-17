
import UsabilityRefactoring from "./UsabilityRefactoring";
import RefactoringPreview from "../components/RefactoringPreview";

const $ = require('jquery');

class LinkToTopRefactoring extends UsabilityRefactoring {
    constructor() {
        super();
        this.onScroll = this.onScroll.bind(this);
        this.onClick = this.onClick.bind(this);
        this.cssText = "display:block;position:fixed;bottom:30px;right:30px;width:35px;height:35px;cursor:pointer;background: url(https://selfrefactoring.s3.amazonaws.com/resources/refactorings/totop.png) no-repeat;display:none";
    }

    checkPreconditions() {
        return true;
    }

    transform() {
        this.link = document.createElement("a");
        document.body.appendChild(this.link);
        this.link.style.cssText = this.cssText
        window.addEventListener("scroll", this.onScroll);
        this.link.addEventListener("click", this.onClick);
    }

    onScroll() {
        if ($(window).scrollTop() > 0) {
            $(this.link).fadeIn();
        }
        else {
            $(this.link).fadeOut();
        }
    }

    
    onClick() {
        $('body,html').animate({ scrollTop: 0 }, 400);
        /*var scroll= document.documentElement.scrollTop;
        if(scroll > 0){
            window.requestAnimationFrame(this.onClick);
            window.scrollTo (0,scroll - ( scroll /10));
        }
        return false;*/
    }

    unDo() {
        document.body.removeChild(this.link);
        window.removeEventListener("scroll", this.onScroll);
    }

    getView() {
        return RefactoringPreview;
    }

    static asString() {
        return "Link to Top";
    }

    getDescription() {
        return "Add a link for scrolling to the top of the page that only appears when scrolling down";
    }

    getDemoResources() {
        return ["LinkToTopBefore.gif", "LinkToTopAfter.gif"];
    }

    //

    stringRefactoring(elementWord,randomInt) {
        return "<a id='" + elementWord + randomInt.toString() + "' style='" + this.cssText + "'></a>"
    }

    imports() {
        return ["import $ from 'jquery';\n"]
    }

    mounts(elementWord, randomInt) {
        return ["window.addEventListener('scroll', this.onScroll());\n$('#" + elementWord + randomInt.toString() + "').bind('click', this.onClick());\n"]
    }

    functions(elementWord, randomInt) {
        return ["onClick() {\nvar scroll= document.documentElement.scrollTop; \nif(scroll > 0){\n   window.requestAnimationFrame(this.onClick); \n  window.scrollTo (0,scroll - ( scroll /10)); \n  }\nreturn false;\n}\nonScroll() {\nif ($(window).scrollTop() > 0) {\n$('" + elementWord + randomInt.toString() + "').fadeIn();\n}\nelse {\n$('" + elementWord + randomInt.toString() + "').fadeOut();\n}\n}\n"]
    }

    styles(elementWord, randomInt) {
        return ["#" + elementWord + randomInt.toString() + " {\n" + this.cssText + "\n}"]
    }

    codeAvaiable() {
        return true
    }

}

export default LinkToTopRefactoring;