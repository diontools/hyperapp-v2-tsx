import { SubscriptionEffectRunner, SubscriptionEffect, VNode, SubscriptionObject, Action } from "hyperapp";

export interface RouteSetting<S> {
    routes: Route<S>[],
}

export interface Route<S> {
    path: string;
    view: (state: S) => VNode;
}

export interface Location<S> {
    route: Route<S>;
}

const SetLocation: Action<{}, Location<{}>, {}> = (state, args) => ({
    ...state,
    location: args,
})

const routerRunner: SubscriptionEffectRunner<RouteSetting<any>> = (props, dispatch) => {
    console.log('routing');
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function (data, title, url) {
        push.call(this, data, title, url);
        console.log(location.pathname);
        dispatch([SetLocation, { route: props.routes[0] }]);
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

export function router<S>(props: RouteSetting<S>): SubscriptionObject<RouteSetting<S>> {
    return {
        effect: routerRunner,
        ...props,
    }
}

export const routingUtil = {
    go: (pathname: string) => history.pushState(null, undefined, pathname),
}