export default class Wlf_service{
    removeMarkupTag(string) {
        return string.replace(/({|{\/)(\w+|\W+)(})/gi, '');
    }

    getDefaultMarkUpClass(markup) {
        let defaultMarkupClass = '';
        switch (markup) {
            case ',':
                defaultMarkupClass = 'question-comma';
                break;
            case '.':
                defaultMarkupClass = 'question-period';
                break;
            case '\'':
                defaultMarkupClass = 'question-apostrophe';
                break;
            case '?':
                defaultMarkupClass = 'question-questionmark';
                break;
            case '!':
                defaultMarkupClass = 'question-exclamation';
                break;
        }
        return defaultMarkupClass;
    }
    getTagClassText(tagOpen) {
        let str = '';
        switch (tagOpen.replace(/\<|\>/g, '')) {
            case 'u':
            case 'U':
                str += ' is underlined';
                break;
        }
        return str;
    }
    getNodeList(elem, selector): Array<any> {
        return [].slice.call(elem.querySelectorAll(selector));
    }
    getClassName(action): string {
        let className = '';
        switch (action) {
            case 'WORD_HIGHLIGHT':
                className = 'highlight';
                break;
            case 'WORD_UNDERLINE':
                className = 'underline';
                break;
            case 'LETTER_IDENTIFICATION':
                className = 'identification';
                break;
            case 'DIVIDE':
                className = 'divide';
                break;
        }
        return className;
    }
}