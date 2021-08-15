import GlassX from "..";
import { State } from "../@types/store";

const key = "glassx";

class PersistedState {
    public storage = window.localStorage;

    retrieveState() {
        const value: string|null = this.storage.getItem(key);

        if (!value) {
            return undefined;
        }

        try {
            return (typeof value !== "undefined")
                ? JSON.parse(value)
                : undefined;
        } catch (err) {}

        return undefined;
    }

    setState(state: State) {
        let globalState = GlassX.get();

        state = {
            ...globalState,
            ...state,
        };

        this.saveState(state);
    }

    saveState(state: State) {
        return this.storage.setItem(key, JSON.stringify(state));
    }

    compareState(state: State|string) {
        state = JSON.stringify(state);
        const cache = this.storage.getItem(key);

        return (state === cache);
    }

    refresh() {
        const globalState = GlassX.get();

        this.saveState(globalState);
    }

    onSave(state: State) {
        if (!this.compareState(state)) {
            this.setState(state);
        }
    }

    onReady(state: State) {
        if (!this.compareState(state)) {
            const cache = this.retrieveState();
        
            if (cache) {
                GlassX.set(cache);
                return true;
            }

            this.saveState(state);

            return false;
        }

        return false;
    }
}

export default PersistedState;
