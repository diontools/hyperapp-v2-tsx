import { h, SubscriptionEffectRunner, SubscriptionEffect, VNode, DispatchType, Effect, Action } from "hyperapp";

export interface RouterProps {
    routes: Route[],
    matched: (route: Route | undefined, dispatch: DispatchType<any, any, any>) => void,
}

export interface Route {
    path: string;
    view: (state: any) => VNode;
}

const routerRunner: SubscriptionEffectRunner<RouterProps> = (props, dispatch) => {
    console.log('routing');
    function onLocationChanged() {
        console.log(window.location.pathname);
        for (const r of props.routes) {
            if (r.path === window.location.pathname) {
                props.matched(r, dispatch);
                return;
            }
        }
        props.matched(undefined, dispatch);
    }

    const push = window.history.pushState;
    const replace = window.history.replaceState;
    window.history.pushState = function (data, title, url) {
        push.call(this, data, title, url);
        onLocationChanged();
    }
    window.history.replaceState = function (data, title, url) {
        replace.call(this, data, title, url);
        onLocationChanged();
    }
    window.addEventListener("popstate", onLocationChanged);

    onLocationChanged();

    return () => {
        console.log('unrouting');
        window.history.pushState = push;
        window.history.replaceState = replace;
        window.removeEventListener("popstate", onLocationChanged);
    };
}

export const createRouter: SubscriptionEffect<RouterProps> = props => ({
    effect: routerRunner,
    ...props,
});

export const pushHistory: Effect<{ pathname: string }> = props => ({
    effect: (props, dispatch) => {
        window.history.pushState(null, '', props.pathname);
    },
    ...props,
});

export interface LinkProps {
    to: string;
}

export function Link(props: LinkProps, children: any) {
    return h('a', { onClick: [MoveTo, props.to], href: props.to }, children);
}

const MoveTo: Action<any, string, Event> = (state, to, ev) => {
    ev.preventDefault();
    return [state, pushHistory({ pathname: to })]
}