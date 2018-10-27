import { SubscriptionEffectRunner, SubscriptionEffect, VNode, SubscriptionObject, Action } from "hyperapp";

export interface RouteSetting {
    routes: Route[],
}

export interface Route {
    path: string;
    view: (state: any) => VNode;
}

export interface Location {
    route: Route;
}

const SetLocation: Action<{}, Location, {}> = (state, args) => ({
    ...state,
    location: args,
})

const routerRunner: SubscriptionEffectRunner<RouteSetting> = (props, dispatch) => {
    console.log('routing');
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function (data, title, url) {
        push.call(this, data, title, url);
        console.log(location.pathname);
        for (const r of props.routes) {
            if (r.path === location.pathname) {
                dispatch([SetLocation, { route: r }]);
                break;
            }
        }
    }
    history.replaceState = function(data, title, url) {
        replace.call(this, data, title, url);
        console.log(location.pathname);
    }
    return () => {
        console.log('unrouting');
        history.pushState = push;
        history.replaceState = replace;
    };
}

export function router(props: RouteSetting): SubscriptionObject<RouteSetting> {
    return {
        effect: routerRunner,
        ...props,
    }
}

export const routingUtil = {
    go: (pathname: string) => history.pushState(null, '', pathname),
}