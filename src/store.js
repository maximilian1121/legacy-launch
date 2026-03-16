import { app } from "electron";
import Store from "electron-store";

const schema = {
    profiles: {
        type: "object",
        additionalProperties: {
            type: "object",
            properties: {
                name: { type: "string" },
                source: { type: "string" },
                args: {
                    type: "object",
                    properties: {},
                    additionalProperties: true,
                },
                flags: {
                    type: "object",
                    properties: {},
                    additionalProperties: true,
                },
            },
            required: ["name", "source"],
        },
        default: {},
    },
    winepath: {
        type: "string",
        default: "",
    },
    // skin: {
    //     type: "string",
    //     default: "",
    // },
    settings: {
        type: "object",
        properties: {
            sfx: { type: "boolean" },
            system_frame: { type: "boolean" },
            pano: { type: "string" },
        },
        default: { sfx: true, system_frame: false, pano: "TU46_D" },
    },
};

export const store = new Store({ schema });
export const app_dir = app.getPath("userData");
