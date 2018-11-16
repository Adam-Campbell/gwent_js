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


/**
 * Render some content in a modal window whilst dimming the rest of the view
 * @param {Object} optionsObject - object containing settings options:
 *     contentToRender - html element or document fragment containing the content to 
 *     to be rendered inside the modal.
 *     withButton - whether or not to display a button that closes the modal when clicked.
 */
function renderInModal(optionsObject) {
    // set default values for any values not supplied then destructure
    const userOptionsWithDefaults = Object.assign(
        {contentToRender: null, withButton: false},
        optionsObject
    );
    const { contentToRender, withButton } = userOptionsWithDefaults;

    const docFrag = document.createDocumentFragment();
    const modalOverlay = document.createElement('div');
    const modalContentContainer = document.createElement('div');
    modalOverlay.classList.add('modal__overlay');
    modalContentContainer.classList.add('modal__content');
    modalContentContainer.appendChild(contentToRender);
    modalOverlay.appendChild(modalContentContainer);
    if (withButton) {
        const modalButton = document.createElement('button');
        modalButton.classList.add('modal__button');
        modalButton.textContent = 'X';
        modalButton.addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
        });
        modalOverlay.appendChild(modalButton);
    }
    docFrag.appendChild(modalOverlay);
    document.body.appendChild(docFrag);
}