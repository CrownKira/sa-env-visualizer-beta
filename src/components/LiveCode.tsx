import LZString from 'lz-string';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { loadingVisualizerText } from '../configs';
import { Libraries } from '../libraries';
import { Sample } from '../samples';
import { Container } from './Container';
import { EnvVisualizer } from './EnvVisualizer';

type Props = {
  selectedLib: Libraries;
  renderLibButton: () => JSX.Element;
};

export const LiveCode: React.FC<Props> = ({ selectedLib, renderLibButton }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { code: encodedCode } = useParams<{ code: string }>();

  const initSample = (code: string): Sample => ({
    description: 'Test your code live here!',
    code,
    link: `https://sourceacademy.nus.edu.sg/playground#chap=4&exec=1000&ext=NONE&prgrm=
        ${LZString.compressToEncodedURIComponent(code)}&variant=default`
  });

  const defaultCode = 'const hello="world";\ndebugger;';
  const [sample, setSample] = useState<Sample>(initSample(defaultCode));
  const [code, setCode] = useState<string>(
    encodedCode ? LZString.decompressFromEncodedURIComponent(encodedCode) || '' : defaultCode
  );

  return (
    <>
      <textarea
        style={{ resize: 'none', fontFamily: 'Courier New, monospace' }}
        wrap="off"
        rows={15}
        cols={100}
        autoFocus
        value={code}
        onChange={e => setCode(e.currentTarget.value)}
      />
      <div style={{ marginBottom: 50 }}>
        <div className="ui horizontal list">
          {renderLibButton()}
          <button className="ui button" onClick={() => setSample({ ...sample, code })}>
            Run
          </button>
          <button
            className="ui button"
            onClick={e =>
              window.alert(`${window.location.href.match(/.*\/live-code/g)}
                                /${LZString.compressToEncodedURIComponent(code)}`)
            }
          >
            Get link
          </button>
        </div>
      </div>
      <Container selectedLib={selectedLib} setLoading={setLoading} />
      {loading ? (
        <p>{loadingVisualizerText}</p>
      ) : (
        <EnvVisualizer sample={sample} selectedLib={selectedLib} />
      )}
    </>
  );
};
