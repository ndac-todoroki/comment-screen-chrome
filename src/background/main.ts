// eslint-disable-next-line import/no-unassigned-import
import { browser } from "webextension-polyfill-ts";
// import '../options-storage/main';
import { decode, decodeAsync } from "@msgpack/msgpack";
import { v4 as uuid } from "uuid";
import WebSocket from 'reconnecting-websocket';

class Comment {
    readonly id: string;
    readonly text: string;

    constructor(text: string) {
        this.text = text;
        this.id = uuid();
    }

    toData = (): object => ({
        id: this.id,
        text: this.text,
    })
}

class WSClient {
    readonly socket: WebSocket;

    constructor(url: string) {
        this.socket = new WebSocket(url)

        this.socket.onmessage = this.recieveAction;
        this.socket.onclose = function (e) {
            console.log("Connection closed. " + e.reason);
        }
    }

    recieveAction = (e: MessageEvent) => {
        const data = e.data;
        typecheck: {
            if (data instanceof Blob) {
                this.sendToPages(data);
                break typecheck;
            }
            if (typeof data === "string") {
                console.info("from server: " + data);
                break typecheck;
            }
        }
    }

    sendToPages = async (blob: Blob) => {
        const data: unknown = await this.decodeFromBlob(blob);
        // console.log(data);

        if (typeof data === "object" && "comment" in data) {
            const comment: Comment = new Comment(data["comment"]);

            browser.storage.local.set({
                newComment: comment
            });
        }
    }

    decodeFromBlob = async (blob: Blob): Promise<unknown> => {
        if (blob.stream) {
            // Blob#stream(): ReadableStream<Uint8Array> (recommended)
            return await decodeAsync(blob.stream());
        } else {
            // Blob#arrayBuffer(): Promise<ArrayBuffer> (if stream() is not available)
            return decode(await blob.arrayBuffer());
        }
    }
}

const client = new WSClient("wss://slack-streamer.gigalixirapp.com/ws");
