import {
  h,
  app,
  Effect,
  DispatchableType,
  Action,
  SubscriptionEffectRunner,
  SubscriptionEffect
} from "hyperapp";

function act<S extends object, P, D>(value: DispatchableType<S, P, D>) {
  return value;
}

const mainState = {
  count: 0,
  auto: false,
};

type MainState = typeof mainState;

type MainAction<P = {}, D = {}> = Action<MainState, P, D>;

const SetCount: MainAction<{ count: number }> = (state, props) => ({ ...state, count: props.count });
const SetAuto: MainAction<{ auto: boolean }> = (state, props) => ({ ...state, auto: props.auto });

const CountUp: MainAction = (state) => ({ ...state, count: state.count + 1 });

const DelayCountUp: MainAction<{ timeout: number }> = (state, props) => [
  state,
  delay({ action: CountUp, timeout: props.timeout })
];

interface DelayProps {
  action: DispatchableType<any, any, any>;
  timeout: number;
}

const delay: Effect<DelayProps> = (props) => ({
  effect: (props, dispatch) => {
    setTimeout(() => dispatch(props.action), props.timeout);
  },
  ...props
});

interface TickProps {
  action: DispatchableType<any, any, any>;
  interval: number;
}

const tickRunner: SubscriptionEffectRunner<TickProps> = (props, dispatch) => {
  console.log("scribe");
  const id = setInterval(() => dispatch(props.action), props.interval);
  return () => {
    console.log("unscribe");
    clearInterval(id);
  };
};

const tick: SubscriptionEffect<TickProps> = (props) => ({
  effect: tickRunner,
  ...props
});

app({
  init: [mainState, delay({ action: CountUp, timeout: 1000 })],
  view: state => (
    <div>
      <button onClick={act([SetCount, { count: 0 }])}>Reset to 0</button>
      <button onClick={act(CountUp)}>increment</button>
      <button onClick={act([DelayCountUp, { timeout: 1000 }])}>
        increment with delay
      </button>
      <button onClick={act([SetAuto, { auto: !state.auto }])}>
        auto: {state.auto ? "enabled" : "disabled"}
      </button>
      <div>count: {state.count}</div>
    </div>
  ),
  subscriptions: state => [state.auto && tick({ action: CountUp, interval: 1000 })],
  container: document.body
});
