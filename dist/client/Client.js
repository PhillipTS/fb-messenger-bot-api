"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../util/Utils");
const enums_1 = require("../enums");
/**
 * Class representing an Send API client for Facebook. Can leverage existing classes/builders in project to provided required
 * structured objects for method payloads.
 * Can handle proxy by specifying 2nd argument as proxy to constructor
 * Can send image/video/audio/file payload as both url and reference ID
 */
class Client {
    /**
     * @param {string} token - Facebook Page Token
     * @param {ProxyData} proxyData - Proxy information if behind proxy
     */
    constructor(token, proxyData) {
        this.requestData = { token };
        this.requestData = Utils_1.Utils.getProxyData(this.requestData, proxyData);
    }
    /**
     * Marks latest message from user as seen.
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {Function} cb
     * @return {Promise<any>}
     */
    markSeen(id, cb) {
        return this.sendAction(id, Client.markSeenPayload, cb);
    }
    /**
     * Toggles typing notification in Messenger to on/off.
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {boolean | Function} toggle
     * @param {Function} cb
     * @return {any}
     */
    toggleTyping(id, toggle, cb) {
        if (arguments.length === 3) {
            return this.toggleAction(id, toggle, cb);
            // tslint:disable-next-line
        }
        else {
            if (Object.prototype.toString.call(toggle) === '[object Function]') {
                return this.sendAction(id, Client.typingOff, toggle);
                // tslint:disable-next-line
            }
            else {
                return this.toggleAction(id, toggle);
            }
        }
    }
    /**
     * Sends simple text message.
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} text
     * @param {string} personaId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendTextMessage(id, text, personaId, cb) {
        return this.sendDisplayMessage(id, { text }, cb, personaId);
    }
    /**
     * imageUrlOrId can be either URL to Image or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} imageUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendImageMessage(id, imageUrlOrId, cb) {
        return this.sendUrlOrIdBasedMessage(id, enums_1.ATTACHMENT_TYPE.IMAGE, imageUrlOrId, cb);
    }
    /**
     * audioUrlOrId can be either URL to audio clip or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} audioUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendAudioMessage(id, audioUrlOrId, cb) {
        return this.sendUrlOrIdBasedMessage(id, enums_1.ATTACHMENT_TYPE.AUDIO, audioUrlOrId, cb);
    }
    /**
     * videoUrlOrId can be either URL to video clip or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} videoUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendVideoMessage(id, videoUrlOrId, cb) {
        return this.sendUrlOrIdBasedMessage(id, enums_1.ATTACHMENT_TYPE.VIDEO, videoUrlOrId, cb);
    }
    /**
     * fileUrlOrId can be either URL to video clip or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} fileUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendFileMessage(id, fileUrlOrId, cb) {
        return this.sendUrlOrIdBasedMessage(id, enums_1.ATTACHMENT_TYPE.FILE, fileUrlOrId, cb);
    }
    /**
     * Sends any of the Button message types: https://developers.facebook.com/docs/messenger-platform/send-messages/buttons
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} text
     * @param {IButton[]} buttons
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendButtonsMessage(id, text, buttons, cb) {
        const payload = { type: enums_1.ATTACHMENT_TYPE.TEMPLATE, payload: { text, buttons, template_type: 'button' } };
        return this.sendAttachmentMessage(id, payload, cb);
    }
    /**
     * Sends any template message type: https://developers.facebook.com/docs/messenger-platform/send-messages/templates
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {IMessageTemplate} templatePayload
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendTemplateMessage(id, templatePayload, cb) {
        const payload = { type: enums_1.ATTACHMENT_TYPE.TEMPLATE, payload: templatePayload };
        return this.sendAttachmentMessage(id, payload, cb);
    }
    /**
     * Sends Quick Reply message:
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string | AttachmentPayload} textOrAttachment
     * @param {IQuickReply[]} quickReplies
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendQuickReplyMessage(id, textOrAttachment, quickReplies, cb) {
        let payload;
        if (typeof textOrAttachment === 'string') {
            payload = { text: textOrAttachment, quick_replies: quickReplies };
        }
        else {
            payload = { attachment: textOrAttachment, quick_replies: quickReplies };
        }
        return this.sendDisplayMessage(id, payload, cb);
    }
    /**
     *
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string[]} fieldsArray
     * @param {Function} cb
     * @return {Promise<any>}
     */
    getUserProfile(id, fieldsArray, cb) {
        const options = Utils_1.Utils.getRequestOptions();
        options.url += id;
        let fields;
        if (!Array.isArray(fieldsArray)) {
            fields = 'first_name';
        }
        else {
            fields = fieldsArray.join(',');
        }
        options.qs.fields = fields;
        options.method = 'GET';
        return Utils_1.Utils.sendMessage(options, this.requestData, cb);
    }
    sendUrlOrIdBasedMessage(id, type, urlOrId, cb) {
        let payload;
        if (urlOrId.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
            payload = { type, payload: { is_reusable: true, url: urlOrId } };
        }
        else {
            payload = { type, payload: { attachment_id: urlOrId } };
        }
        return this.sendAttachmentMessage(id, payload, cb);
    }
    sendAttachmentMessage(id, payload, cb) {
        return this.sendDisplayMessage(id, { attachment: payload }, cb);
    }
    sendDisplayMessage(id, payload, cb, personaId) {
        const options = this.generateBasicRequestPayload(id);
        options.json = Object.assign(Object.assign({}, options.json), { message: payload, persona_id: personaId });
        return Utils_1.Utils.sendMessage(options, this.requestData, cb);
    }
    sendAction(id, payload, cb) {
        const options = this.generateBasicRequestPayload(id);
        options.json = Object.assign(Object.assign({}, options.json), { sender_action: payload });
        return Utils_1.Utils.sendMessage(options, this.requestData, cb);
    }
    generateBasicRequestPayload(id) {
        const options = Utils_1.Utils.getRequestOptions();
        options.url += 'me/messages';
        options.method = 'POST';
        options.json = { recipient: { id } };
        return options;
    }
    toggleAction(id, toggleValue, cb) {
        if (toggleValue) {
            return this.sendAction(id, Client.typingOn, cb);
            // tslint:disable-next-line
        }
        else {
            return this.sendAction(id, Client.typingOff, cb);
        }
    }
}
exports.Client = Client;
Client.markSeenPayload = 'mark_seen';
Client.typingOn = 'typing_on';
Client.typingOff = 'typing_off';
//# sourceMappingURL=Client.js.map