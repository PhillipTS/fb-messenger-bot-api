import { IButton, ProxyData, IQuickReply, IMessageTemplate } from '../interfaces';
import { ATTACHMENT_TYPE } from '../enums';
export interface ClientMessage {
    message?: MessagePayload;
    sender_action?: string;
}
export interface AttachmentPayload {
    type: ATTACHMENT_TYPE;
    payload: Object;
}
export interface MessagePayload {
    text?: string;
    quick_replies?: IQuickReply[];
    attachment?: AttachmentPayload;
}
/**
 * Class representing an Send API client for Facebook. Can leverage existing classes/builders in project to provided
 * required structured objects for method payloads.
 * Can handle proxy by specifying 2nd argument as proxy to constructor
 * Can send image/video/audio/file payload as both url and reference ID
 */
export declare class FacebookMessagingAPIClient {
    private static readonly markSeenPayload;
    private static readonly typingOn;
    private static readonly typingOff;
    private requestData;
    /**
     * @param {string} token - Facebook FacebookPageAPIClient Token
     * @param {string} applicationSecret - Facebook application secret to validate the messages received from the FB messenger
     * @param {ProxyData} proxyData - Proxy information if behind proxy
     */
    constructor(token: string, proxyData?: ProxyData);
    /**
     * Marks latest message from user as seen.
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {Function} cb
     * @return {Promise<any>}
     */
    markSeen(id: string, cb?: Function): Promise<unknown>;
    /**
     * Toggles typing notification in Messenger to on/off.
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {boolean | Function} toggle
     * @param {string} personaId
     * @param {Function} cb
     * @return {any}
     */
    toggleTyping(id: string, toggle: boolean | Function, personaId?: string, cb?: Function): Promise<unknown>;
    /**
     * Sends simple text message.
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} text
     * @param {string} personaId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendTextMessage(id: string, text: string, personaId?: string, cb?: Function): Promise<unknown>;
    /**
     * imageUrlOrId can be either URL to Image or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} imageUrlOrId
     * @param {string} personaId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendImageMessage(id: string, imageUrlOrId: string, personaId?: string, cb?: Function): Promise<unknown>;
    /**
     * audioUrlOrId can be either URL to audio clip or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} audioUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendAudioMessage(id: string, audioUrlOrId: string, cb?: Function): Promise<unknown>;
    /**
     * videoUrlOrId can be either URL to video clip or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} videoUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendVideoMessage(id: string, videoUrlOrId: string, cb?: Function): Promise<unknown>;
    /**
     * fileUrlOrId can be either URL to video clip or ID of previously uploaded one
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} fileUrlOrId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendFileMessage(id: string, fileUrlOrId: string, cb?: Function): Promise<unknown>;
    /**
     * Sends any of the Button message types: https://developers.facebook.com/docs/messenger-platform/send-messages/buttons
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string} text
     * @param {IButton[]} buttons
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendButtonsMessage(id: string, text: string, buttons: IButton[], cb?: Function): Promise<unknown>;
    /**
     * Sends any template message type: https://developers.facebook.com/docs/messenger-platform/send-messages/templates
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {IMessageTemplate} templatePayload
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendTemplateMessage(id: string, templatePayload: IMessageTemplate, cb?: Function): Promise<unknown>;
    /**
     * Sends Quick Reply message:
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string | AttachmentPayload} textOrAttachment
     * @param {IQuickReply[]} quickReplies
     * @param {string} personaId
     * @param {Function} cb
     * @return {Promise<any>}
     */
    sendQuickReplyMessage(id: string, textOrAttachment: string | AttachmentPayload, quickReplies: IQuickReply[], personaId?: string, cb?: Function): Promise<unknown>;
    /**
     *
     * Optional cb, otherwise returns promise
     * @param {string} id
     * @param {string[]} fieldsArray
     * @param {Function} cb
     * @return {Promise<any>}
     */
    getUserProfile(id: string, fieldsArray: string[], cb?: Function): Promise<unknown>;
    private sendUrlOrIdBasedMessage;
    private sendAttachmentMessage;
    private sendDisplayMessage;
    private sendAction;
    private generateBasicRequestPayload;
    private toggleAction;
}
