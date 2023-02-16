import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RemoteAutocomplete, StaticAutocomplete } from '@/Autocomplete';

function Root() {
  const [activeRemote, setActiveRemote] = useState(null);
  const [activeStatic, setActiveStatic] = useState(null);
  console.log({ activeRemote, activeStatic });

  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <RemoteAutocomplete
        placeholder="REMOTE"
        urn="anime"
        idKey="mal_id"
        nameKey="title"
        dataKey="data"
        onSelect={setActiveRemote}
      />
      <StaticAutocomplete
        placeholder="STATIC"
        suggestions={['foo', 'bar', 'xzc', 'zox', 'asd', 'qwe', 'lkg'].map((i) => ({ id: i, name: i }))}
        onSelect={setActiveStatic}
      />
    </div>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Root />);
