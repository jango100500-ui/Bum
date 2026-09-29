import { EmojiPhysics } from '../features/physics/EmojiPhysics';
import { SearchBar } from '../features/search/SearchBar';

export const App = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#f2f2f7' }}>
      <EmojiPhysics />
      <SearchBar />
    </div>
  );
};
