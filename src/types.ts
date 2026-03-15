export type Profile = {
    name: string;
    source: string;
    flags: Record<string, boolean>;
    args: Record<string, any>;
};
