import React, { Component } from 'react'
import './Sentence.css'
import Wlf_service from '../../../service/word_letter_focus_service'
import ReactDOM from 'react-dom';
import PubSub from 'pubsub-js'
export default class Sentence extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            changed: false,
            questions: [],
            originalQuestions: [],
            selectedTool: ""
        };
        this.classList = [
            { alias: '{wu}', classname: 'underline', defaultClassName: '', type: 'word' },
            { alias: '{lh}', classname: 'identification', defaultClassName: '', type: 'letter' },
            { alias: '{wh}', classname: 'highlight', defaultClassName: '', type: 'word' },
            { alias: '{dv}', classname: 'divide', defaultClassName: '', type: 'letter' },
            { alias: '{.}', classname: 'period', defaultClassName: 'question-period', type: 'word' },
            { alias: '{,}', classname: 'comma', defaultClassName: 'question-comma', type: 'word' },
            { alias: '{?}', classname: 'questionmark', defaultClassName: 'question-questionmark', type: 'word' },
            { alias: "{'}", classname: 'apostrophe', defaultClassName: 'question-apostrophe', type: 'word' },
            { alias: '{u}', classname: 'uppercase', defaultClassName: 'question-uppercase', type: 'word' },
            { alias: '{l}', classname: 'lowercase', defaultClassName: 'question-lowercase', type: 'word' },
            { alias: '{s}', classname: 'spellcheck', defaultClassName: 'question-spellcheck', type: 'word' },
            { alias: '{!}', classname: 'exclamation', defaultClassName: 'question-exclamation', type: 'word' }
        ];
        this._wordSpanData = '';
        this._charSet = [];
        this._charPos = 0;
        this.charCount = 0;
        this._wordPos = -1;
        this._wordSet = [];
        this.wlf_service = new Wlf_service();
        this._originalString = '';
        this.templateType = 'wlf';
        this.htmldata = '';
        this.parsedString = '';
        this.showFeedback = false;
        this.el = null;
        this.action = 'WORD_HIGHLIGHT';
        this.isClicked = false;
        //TODO needs tobe changed on tool selection
        this.type = "word";
        //TODO Needs to be updated on action chnage
        this.className = this.wlf_service.getClassName(this.action);
        this.changeToolState = null;
    }

    componentDidMount() {
        console.log(ReactDOM.findDOMNode(this));
        this.el = ReactDOM.findDOMNode(this);
        this.updatePropertyOnType(this.type);
        this.bindEvents('.el', 'mousedown', this.onMouseDown);
        this.bindEvents('.el', 'mouseup', this.onMouseUp);
        this.bindEvents('.el', 'mouseover', this.onMouseOver);
        this.bindEvents('.el', 'mouseleave', this.onMouseLeave);
        this.bindEvents('.el', 'keydown', this.onKeyDown);
        this.bindEvents('.el', 'keyup', this.onKeyUp);
        this.bindEvents('.el', 'focus', this.onFocus);

        this.changeToolState = PubSub.subscribe('changeToolState', (msg, data) => {
            this.action = data.selectedTool;
            this.type = data.selectionType;
            this.className = this.wlf_service.getClassName(this.action);
            this.updatePropertyOnType(this.type);
            this.isClicked = false;
            console.log(msg, data);
        });
    }
    componentWillUnmount() {
        this.changeToolState.unsubscribe();
    }
    updatePropertyOnType(type) {
        if (type === 'word') {
            this.performClassOperation('remove', '.letter', 'el');
            this.performClassOperation('add', '.word', 'el');
            if (!this.el.querySelector('.correctly-answer')) {
                this.performAttributeOperation('.word', 'tabindex', 0);
            }

            this.performRemoveAttributeOperation('.letter', 'tabindex');
        } else {
            this.performClassOperation('remove', '.word', 'el');
            this.performClassOperation('add', '.letter', 'el');
            if (!this.el.querySelector('.correctly-answer')) {
                this.performAttributeOperation('.letter', 'tabindex', 0);
            }
            this.performRemoveAttributeOperation('.word', 'tabindex');
        }
    }
    bindEvents(selector, evType, fn) {
        this.wlf_service.getNodeList(this.el, selector).forEach((elem, index) => {
            elem.addEventListener(evType, fn.bind(this));
        });
    }

    onMouseUp(event) {
        this.isClicked = false;
        event.preventDefault();
    }
    onMouseDown(event) {
        console.log("onMouseDown");
        if (this.templateType === 'wlf') {
            this.handler(event);
        }
        this.isClicked = true;
        event.preventDefault();
        const activeElem = document.activeElement;
        activeElem.blur();
    }
    onMouseOver(event) {
        if (this.action === 'DIVIDE') {
            this.performClassOperation('add', '#' + event.target.id, 'tdivide');
        }
        if (this.isClicked) {
            this.handler(event);
        }
    }
    onMouseLeave(event) {
        if (this.action === 'DIVIDE') {
            this.performClassOperation('remove', '#' + event.target.id, 'tdivide');
        }
    }
    performClassOperation(fnType, selector, cls) {
        this.wlf_service.getNodeList(this.el, selector).forEach((elem) => {
            elem.classList[fnType](cls);
        });
    }
    onKeyDown(event) {
        if (event.keyCode === 32 && !this.showFeedback) {
            event.preventDefault();
            if (this.templateType === 'wlf') {
                this.handler(event);
            }
            console.log(this._wlfPrpTextToSpeech(event));
        }
    }
    onKeyUp(event) {
        console.log("onKeyUp");
        if (this.templateType === 'prp' && event.keyCode === 32) {
            this.currentFocusElem = event.currentTarget;
        }
    }

    onFocus(event) {
        //TODO need to put the text to hidden span for reading
        console.log(this._wlfPrpTextToSpeech(event));
    }

    performAttributeOperation(selector, attr, attrValue) {
        this.wlf_service.getNodeList(this.el, selector).forEach((elem) => {
            elem.setAttribute(attr, attrValue);
        });
    }
    performRemoveAttributeOperation(selector, attr) {
        this.wlf_service.getNodeList(this.el, selector).forEach((elem) => {
            elem.removeAttribute(attr);
        });
    }
    _wlfPrpTextToSpeech(event) {
        let classes,
            text = ' ';
        classes = event.target.getAttribute('class').replace(/(el letter)|(question-container cols-xs-12)|(pointerAdd)|(el word)|(el)|(letter)|(word)|(correctly-answer)|(wrong-answer)|(correct-\w+)|(question-\w+)/g, '').split(' ');
        classes = classes.join(' ').replace(/splcheck/g, 'spellcheck').split(' ');
        if (event.target.getAttribute('class').indexOf('letter') > -1 || event.keyCode === 32) {
            text += event.target.innerText;
            if (event.target.getAttribute('class').replace(/(el letter)|(el word)|(letter)|(el)|(word)|(correctly-answer)|(wrong-answer)|(correct-\w+)|(question-\w+)/g, '').indexOf('reference') > -1) {
                text += this.wlf_service.getTagClassText(event.target.parentElement.tagName);
            }
        }
        for (let index = 0; index < classes.length; index++) {
            if (classes[index]) {
                if (classes[index].indexOf('question-') > -1) {
                    text += ` ${classes[index].replace(/question-/g, '')} `;
                } else if (classes[index] === 'prp-anchor') {
                    text += ' highlight ';
                } else {
                    text += classes[index] === 'references' ? '' : ' is ' + classes[index];
                }
            }
        }
        return text;
    }

    erase(target){
        const closestWord = this._findClosestMatch(target, 'word'),
            closestLetter = this._findClosestMatch(target, 'letter');
        if (!closestWord.classList.contains('correctly-answer')) {
            this._removeSelection(closestWord, 'underline');
            this._removeSelection(closestWord, 'highlight');
        }
        if (!closestLetter.classList.contains('correctly-answer')) {
            this._removeSelection(closestLetter, 'identification');
            this._removeSelection(closestLetter, 'divide');
        }
        console.log(this.isScreenClean());
        // this._WlfPrCommonService.checkIsScreenClean('check');
    }

    isScreenClean() {
        let toolList = ['underline', 'identification', 'highlight', 'divide',
            'period', 'comma', 'questionmark', 'apostrophe', 'uppercase', 'lowercase', 'spellcheck'];
        for (let tool of toolList) {
            let itms = this.el.querySelectorAll('.' + tool);
            if (itms.length) {
                for (let index = 0; index < itms.length; index++) {
                    if (!(itms[index].classList.contains(`correct-${tool}`) || itms[index].classList.contains('separator'))) {
                        return false;
                    }
                }
            }
        }
        console.log("disableValidate");
        // this._WlfPrCommonService.actionToolStatusUpdate('disableValidate');
    }

    _removeSelection(target, classname) {
        if (target.previousElementSibling && target.previousElementSibling.classList.contains('separator')) {
            target.previousElementSibling.classList.remove(classname);
        }
        if (target.nextElementSibling && target.nextElementSibling.nextElementSibling && target.nextElementSibling.nextElementSibling.classList.contains('separator')) {
            target.nextElementSibling.nextElementSibling.classList.remove(classname);
        }
        target.classList.remove(classname);
    }

    _findClosestMatch(target, classname) {
        if (target.classList.contains(classname)) {
            return target;
        }
        return this._findClosestMatch(target.parentElement, classname);
    }

    handler(event) { // Refactor
        let target;
        if (this.action && this.templateType === 'wlf') {
            console.log("enableValidate");
            // this.emitValidationState('enableValidate');
        }
        if (this.action === 'WORD_HIGHLIGHT' || this.action === 'WORD_UNDERLINE') {
            target = event.currentTarget;
        } else {
            target = event.target;
        }
        if (target.classList.contains('el') && this.className) {
            target.classList.add(this.className);
            this._addSeparatorClass(target, this.className);
        }
        // erase functionality
        if (this.action === 'ERASE') {
            this.erase(target);
        }
    }

    _addSeparatorClass(target, className){
        const classType = target.classList[1],
            prevSeparatorElem = target.classList.contains('references') ?
                target.parentElement.previousElementSibling : target.previousElementSibling,
            nextSeparatorElem = target.nextElementSibling && target.nextElementSibling.nextElementSibling ?
                target.nextElementSibling.nextElementSibling : target.parentElement.nextElementSibling;
        let prevElem, nextElem;
        if (prevSeparatorElem && prevSeparatorElem.classList.contains('separator') && prevSeparatorElem.previousElementSibling) {
            prevElem = target.classList.contains('references') ?
                prevSeparatorElem.previousElementSibling.previousElementSibling
                : prevSeparatorElem.previousElementSibling.previousElementSibling;
        }
        if (nextSeparatorElem && nextSeparatorElem.classList.contains('separator')) {
            if (target.classList.contains('references')) {
                nextElem = nextSeparatorElem.nextElementSibling;
            } else if (nextSeparatorElem.nextElementSibling && nextSeparatorElem.nextElementSibling.firstElementChild &&
                nextSeparatorElem.nextElementSibling.firstElementChild.classList.contains('references')) {
                nextElem = nextSeparatorElem.nextElementSibling.firstElementChild;
            } else {
                nextElem = nextSeparatorElem.nextElementSibling;
            }
        }
        if (prevSeparatorElem && prevElem && prevElem.classList.contains(classType) && prevElem.classList.contains(className)) {
            prevSeparatorElem.classList.add(className);
        }
        if (nextSeparatorElem && nextElem && nextElem.classList.contains(classType) && nextElem.classList.contains(className)) {
            nextSeparatorElem.classList.add(className);
        }
    }

    reduceQuestionString(string){
        let tempStr = "";
        tempStr = string.replace(/(\w+)({(\W+)\|(\W+)})/gi, '$1{$3}{$4}');
        tempStr = tempStr.replace(/{\'}/gi, "{'} ");
        this._originalString = tempStr;
        this.state.originalQuestions.push(tempStr);
        tempStr = tempStr.replace(/({|{\/)(\w+|\W+)(})/gi, '');
        return tempStr.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    _createReducedQuestionArray(sentenceObj) {
        let reducedArr = [];
        reducedArr = sentenceObj.sentences.map((item, index) => {
            return this.reduceQuestionString(item)
        });
        return reducedArr;
    }


    splitWord(question, index) {
        // TO DO : NEED TO REFACTOR THIS FUNCTION
        this._wordSet = question.split(' ');
        let original_wordSet = this.state.originalQuestions[index].split(' ');
        for (const word of this._wordSet) {
            let htmlString = '',
                match = '',
                matches;

            this._wordPos = this._wordPos + 1;
            const id = this._wordPos;

            if (original_wordSet[this._wordPos].match(/(\w+)({\w+|\W+})({\w+|\W+})/gi)) {
                // for default prp markup
                match = original_wordSet[this._wordPos];
                matches = match.split('{');
                if (match.match(/\{(?:\w|\W)\}\w+/gi)) {
                    htmlString += this.applyDefaultMarkUpClass(this.wlf_service.removeMarkupTag('{' + matches[1]), '{' + matches[3], id) +
                        this.wlf_service.removeMarkupTag('{' + matches[3]);
                    original_wordSet[this._wordPos] = '{' + matches[1] + '{' + matches[2] + this.wlf_service.removeMarkupTag('{' + matches[3]);

                } else {
                    htmlString += this.applyDefaultMarkUpClass(matches[0], '{' + matches[2], id) +
                        this.wlf_service.removeMarkupTag('{' + matches[2]);
                    original_wordSet[this._wordPos] = matches[0] + '{' + matches[1] + this.wlf_service.removeMarkupTag('{' + matches[2]);

                }
                // TODO Needs to be romoved
            } else if (original_wordSet[this._wordPos].match(/\{s\|/gi)) {
                // for spell check replacement tags in prp
                match = original_wordSet[this._wordPos];
                htmlString += this.applySpellCheckMarkUp(match, id);
                original_wordSet[this._wordPos] = match.split('|')[0] + '}' + match.split('|')[2].replace(/{|}/gi, '');

            } else if (word.match(/(<\w+>)|(<\/\w+>)/gi)) {
                // for reference strings which would contain html markup tags
                htmlString += this.applyReferenceStringMarkup(word, id);

            } else if (this.templateType === 'wlf' && original_wordSet[this._wordPos].match(/({(?:\w+|\W+)})\W({\/(?:\w+|\W+)})/gi)) {
                htmlString += this.applyPunctuationHighlight(original_wordSet[this._wordPos], id); // for words with / in the sentence

            } else if (original_wordSet[this._wordPos].indexOf('/') > -1) {
                htmlString += this.applySplitWordMarkUp(word, id); // for words with / in the sentence

            } else {
                htmlString += this.applyWordMarkUp(word, id); // for words in the sentence
            }
            this.charCount++;
            this.htmldata = this.htmldata + htmlString;
            this.parsedString = this.parsedString + htmlString;
            // this._originalString = original_wordSet.join(' ');
            this.state.originalQuestions[index] = original_wordSet.join(' ');
        }
        return this.htmldata;
    }

    applyWordMarkUp(word, id) {
        let markUpString = '';
        const match = word,
            openingPunctuation = match.charAt(0).match(/([^\w\s])/gi) ? match.charAt(0).match(/([^\w\s])/gi)[0] : '',
            closingPunctuation = match.charAt(match.length - 1).match(/([^\w\s])/gi) ?
                match.charAt(match.length - 1).match(/([^\w\s])/gi)[0] : '',
            starting_index = this.charCount,
            wordText = match.replace(/([^\w\s\/’\-|\'|\:])/gi, ''),
            WordId = match.replace(/\W+/gi, ''),
            wordSpan = this.splitChar(wordText, id),
            oPText = openingPunctuation ? `<span class='separator'>${openingPunctuation}</span>` : '',
            cPText = closingPunctuation && word.length > 1 ?
                `<span class='separator'>${closingPunctuation} </span>` : `<span class='separator'> </span>`;

        if (this.templateType === 'wlf' || !this.wlf_service.getDefaultMarkUpClass(closingPunctuation)) {

            markUpString = oPText + `<span class="el word" id="word_${starting_index}_${this.charCount - 1}_${WordId}"
      aria-labelledBy="word_${starting_index}_${this.charCount - 1}_${WordId}_label" data-id="${id}">${wordSpan}</span>` +
                `<span class='sr-only' id="word_${starting_index}_${this.charCount - 1}_${WordId}_label">${wordText}</span>` + cPText;

        } else {

            markUpString = `<span class='sr-only' id="word_${starting_index}_${this.charCount - 1}_${wordText}_label">${wordText}</span>`
                + oPText + `<span class="el word ${this.wlf_service.getDefaultMarkUpClass(closingPunctuation)}"
      id="word_${starting_index}_${this.charCount - 1}_${wordText}"
      aria-labelledBy="word_${starting_index}_${this.charCount - 1}_${wordText}_label" data-id="${id}">${wordSpan}</span>
      <span class='separator'> </span>`;

        }
        return markUpString;
    }

    applyPunctuationHighlight(word, id) {
        let markUpString = '';
        word = word.replace(/(.+)((?:{(?:\w+|\W+)})\W(?:{\/(?:\w+|\W+)}))/gi, '$1 $2');
        let wordArr = word.split(' ');

        markUpString += this.applySplitWordMarkUp(this.wlf_service.removeMarkupTag(wordArr[0]), id, true);

        // add markable punctuation tag
        markUpString += `<span class="el letter" id="letter_${this.charCount}">${this.wlf_service.removeMarkupTag(wordArr[1])}</span>`;
        markUpString += `<span class='separator'> </span>`;

        return markUpString;
    }

    applySplitWordMarkUp(word, id, givenNoClosing) {
        let markUpString = '',
            wordSpan = '',
            wordArr = '',
            WordId = '',
            match = word,
            openingPunctuation = match.charAt(0).match(/([^\w\s])/gi) ? match.charAt(0).match(/([^\w\s])/gi)[0] : '',
            closingPunctuation = match.charAt(match.length - 1).match(/([^\w\s])/gi) ?
                match.charAt(match.length - 1).match(/([^\w\s])/gi)[0] : '',
            starting_index = this.charCount,
            wordText = match.replace(/([^\w\s\/’\-|\'|\:])/gi, ''),
            oPText = openingPunctuation ? `<span class='separator'>${openingPunctuation}</span>` : '',
            cPText = closingPunctuation ? `<span class='separator'>${closingPunctuation} </span>` : `<span class='separator'> </span>`;


        if (this.templateType === 'wlf') {
            markUpString += oPText;

            wordArr = wordText.split('/');

            for (let index = 0; index < wordArr.length; index++) {
                markUpString += index > 0 ? '/' : '';
                WordId = wordArr[index].replace(/\W+/gi, '');
                wordSpan = this.splitChar(wordArr[index], id);

                markUpString += `<span class="el word" id="word_${starting_index}_${this.charCount - 1}_${WordId}"
        aria-labelledBy="word_${starting_index}_${this.charCount - 1}_${WordId}_label" data-id="${id}">${wordSpan}</span>` +
                    `<span class='sr-only' id="word_${starting_index}_${this.charCount - 1}_${WordId}_label">${wordText}</span>`;

                starting_index += wordArr[index].length;
            }

            if (!givenNoClosing) {
                markUpString += cPText;
            }

        }
        return markUpString;
    }

    applyReferenceStringMarkup(word, id) {
        const match = word.replace(/((<\w+>)|(<\/\w+>))/gi, ''),
            openingTag = word.match(/(<\w+>)/g) ? word.match(/(<\w+>)/g)[0] : '',
            closingTag = word.match(/(<\/\w+>)/g) ? word.match(/(<\/\w+>)/g)[0] : '',
            openingPunctuation = match.charAt(0).match(/([^\w\s])/gi) ? match.charAt(0).match(/([^\w\s])/gi)[0] : '',
            closingPunctuation = match.charAt(match.length - 1).match(/([^\w\s])/gi) ?
                match.charAt(match.length - 1).match(/([^\w\s])/gi)[0] : '',
            starting_index = this.charCount,
            wordText = match.replace(/([^\w\s])/gi, ''),
            wordSpan = this.splitChar(wordText, id),
            oPText = openingPunctuation ? `<span class='separator'>${openingPunctuation}</span>` : '',
            cPText = closingPunctuation ? `<span class='separator'>${closingPunctuation} </span>` : `<span class='separator'> </span>`;
        return (openingTag + oPText + `<span class="references el word"
      aria-labelledBy="word_${starting_index}_${this.charCount - 1}_${wordText}_label"
      id="word_${starting_index}_${this.charCount - 1}_${wordText}">${wordSpan}</span>` + closingTag +
            `<span class='sr-only' id="word_${starting_index}_${this.charCount - 1}_${wordText}_label">
      ${wordText} ${this.wlf_service.getTagClassText(openingTag)}</span>` + cPText);
    }

    applySpellCheckMarkUp(match, id) {
        let markUpString = '';
        const starting_index = this.charCount,
            matches = match.split('|'),
            markUpTag = matches[0] + '}',
            displayString = matches[1],
            correctString = matches[2].replace(/\}/gi, ''),
            idstring = correctString.replace(/\W+/gi, '');
        this.charCount += idstring.length;
        for (let index in this.classList) {
            if (markUpTag === this.classList[index].alias) {
                markUpString = `<span class="el word ${this.Wlf_service.getDefaultMarkUpClass(matches[2].replace(/(\w+)(})/gi, ''))}"
        id="word_${starting_index}_${this.charCount - 1}_${idstring}" displayString="${displayString}"
        correctString="${correctString}">${displayString}<span></span></span>`;
            }
        }
        markUpString += `<span class='separator'> </span>`; // for white space between words
        return markUpString;
    }

    applyDefaultMarkUpClass(text, markUp, id) {
        let markUpString = '';
        const starting_index = this.charCount,
            wordSpan = this.splitChar(text, id),
            markUpTag = markUp.replace(/(})(\W)/gi, '$1');

        for (let index in this.classList) {
            if (markUpTag === this.classList[index].alias) {
                markUpString = `<span class="el word ${this.classList[index].defaultClassName}"
        aria-labelledBy="word_${starting_index}_${this.charCount - 1}_${text}_label"
        id="word_${starting_index}_${this.charCount - 1}_${text}">${wordSpan}</span>
        <span class='sr-only' id="word_${starting_index}_${this.charCount - 1}_${text}_label">${text}</span>`;
            }
        }
        markUpString += `<span class='separator'> </span>`; // for white space between words
        return markUpString;
    }

    splitChar(word, wordid) {
        this._wordSpanData = '';
        this._charSet = word.split('');
        this._charPos = 0;
        for (const char of this._charSet) {
            this._charPos = this._charPos + 1;
            const id = this._charPos;
            this._wordSpanData =
                this._wordSpanData +
                `<span class="el letter" aria-hidden="true" id="letter_${this.charCount++}${char.match(/\W+/gi) ? '' : '_' + char}" data-id="${wordid}-${id}">${char}</span>`;
        }
        return this._wordSpanData;
    }

    render() {
        let fixtureArr = [];
        this.state.originalQuestions = [];
        this.state.questions = this._createReducedQuestionArray(this.props.sentences);
        this.state.questions = this.state.questions.map((item, index) => {
            this._wordPos = -1;
            this.htmldata = '';
            return this.splitWord(item, index);
        });
        fixtureArr = this.state.questions.map((item, index) => {
            return (
                <div className="parent-question-container" key={index}>
                    <span className="feedback-container"></span>
                    <span className="question-wrapper" dangerouslySetInnerHTML={{ __html: item }}>
                    </span>
                </div>
            );
        });
        return (
            <div className="wrapper">
                {fixtureArr}
            </div>
        )
    }
}
// {JSON.stringify(this.state.questions)}