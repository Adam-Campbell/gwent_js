/**
 * Generate a random string id comprised of numerical characters 0 through 9
 * @param {number} length - the amount of numerical characters to include
 * @returns {string} - the id 
 */

function generateId(length) {
    let str = '';
    for (let i = 0; i < length; i++) {
        str += Math.floor(Math.random() * 10).toString();
    }
    return str;
} 


/**
 * An abstraction for Handlebars template rendering
 * @param {Object} OptionsObject - with options:
 *     templateId - string id for the template you wish to use 
 *     dataSource - the object housing the data needed to populate the template
 * @returns {string} - string representation of HTML output
 */
function createHTML(optionsObject) {
    const { templateId, dataSource } = optionsObject;
    if (!templateId) {
        throw new Error('You must provide a templateId to the createHTML function.');
    }
	const source = document.getElementById(templateId).innerHTML;
	const template = Handlebars.compile(source);
    const HTML = template(dataSource);
    return HTML;
}