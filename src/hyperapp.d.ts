export as namespace hyperapp;

export type Children = VNode | string | number | null;

export enum VNodeType {
  DEFAULT = 0,
  RECYCLED_NODE,
  TEXT_NODE
}

export interface VNode<Props = {}> {
  name: string;
  props: Props;
  children: Array<VNode>;
  element: Element;
  key: string;
  type: VNodeType;
}

/**
 * Create a new virtual DOM node. A virtual DOM is a description of what a DOM should look like using a tree of virtual nodes.
 * @param name The name of an Element or a function that returns a virtual DOM node.
 * @param props HTML props, SVG props, DOM events, Lifecycle Events, and Keys.
 * @param children The element's child nodes.
 */
export function h<Props>(
  name: string,
  props?: Props | null,
  ...children: Array<Children | Children[]>
): VNode<Props>;

export type EffectRunner<P> = (
  props: P,
  dispatch: DispatchType<any, any, any>
) => void;
export type EffectObject<P> = { [X in keyof P]: P[X] } & {
  effect: EffectRunner<P>;
};
export type Effect<Props, RunnerProps> = (
  props: Props
) => EffectObject<RunnerProps>;
export type EffectType<P> = EffectObject<P> | boolean;

export type ActionResult<S> = void | S | [S, object | object[]];
export type Action<S, P, D> = (state: S, props: P, data: D) => ActionResult<S>;

export type SubscriptionEffectRunner<P> = (
  props: P,
  dispatch: DispatchType<any, any, any>
) => () => void;
export type SubscriptionObject<P> = { [X in keyof P]: P[X] } & {
  effect: SubscriptionEffectRunner<P>;
};
export type SubscriptionEffect<Props, RunnerProps> = (
  props: Props
) => SubscriptionObject<RunnerProps>;
export type SubscriptionType<P> = SubscriptionObject<P> | boolean;

export type DispatchableType<S, P, D> =
  | Action<S, {}, {}>
  | [Action<S, P, D>, P]
  | ActionResult<S>;

export type DispatchType<S, P, D> = (
  obj: DispatchableType<S, P, D>,
  data?: any
) => void;

export type SubscriptionsResult<P1> =
  | void
  | SubscriptionType<P1>
  | SubscriptionType<P1>[];

export function app<State, Props>(props: {
  init: DispatchableType<State, Props, undefined>;
  view: (state: State) => VNode;
  container: Element;
  subscriptions?: (state: State) => SubscriptionsResult<any>;
}): void;

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
