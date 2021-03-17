import React, { useRef, useEffect, useState } from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import '../styles/EnvVisualizer.css';
import { EnvVisualiser } from './EnvVisualiser';
import useForceUpdate from '../utils/forceUpdate';
import { Sample } from '../samples';
import { Libraries } from '../libraries';
import { loadingVisualizerText } from '../configs';
import { Context } from 'js-slang';

interface Props {
  samples: Sample[];
  renderLibButton: () => JSX.Element;
  selectedLib: Libraries;
  setUpLib: (
    envVisContainer: React.RefObject<HTMLDivElement>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    forceUpdate: () => void
  ) => void;
  context: Context<any> | undefined;
  setContext: React.Dispatch<React.SetStateAction<Context<any> | undefined>>;
}

export const Samples: React.FC<Props> = ({
  samples,
  renderLibButton,
  selectedLib,
  setUpLib,
  context,
  setContext
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const envVisContainer = useRef<HTMLDivElement>(null);
  const forceUpdate = useForceUpdate();
  const { path } = useRouteMatch();

  useEffect(() => {
    setUpLib(envVisContainer, setLoading, forceUpdate);
  }, [forceUpdate, selectedLib, setUpLib]);

  useEffect(() => {
    setContext(undefined);
  }, [path, setContext]);

  const renderContainer = (): JSX.Element | null => {
    switch (selectedLib) {
      case Libraries.ConcreteJs:
        return <div ref={envVisContainer} className="sa-env-visualizer"></div>;

      case Libraries.KonvaJs:
        // no container to be rendered for this lib
        return null;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="ui horizontal list">
        {renderLibButton()}
        {samples.map(({ id, name }) => (
          <Link
            key={id}
            to={`${path}/${id}`}
            className="ui button"
            onClick={() => setContext(undefined)}
          >
            {name}
          </Link>
        ))}
      </div>
      {loading && <p>{loadingVisualizerText}</p>}
      {renderContainer()}
      <Switch>
        <Redirect exact from={`${path}`} to={`${path}/0`} />
        <Route
          exact
          path={`${path}/:id`}
          render={({
            match: {
              params: { id }
            }
          }) =>
            loading || (
              <EnvVisualiser
                sample={samples[id]}
                selectedLib={selectedLib}
                context={context}
                setContext={setContext}
              />
            )
          }
        />
      </Switch>
    </>
  );
};
