import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '../types';

// Sample characters
const SAMPLE_CHARACTERS: Character[] = [
  {
    id: 'sakura-001',
    name: 'Sakura',
    avatar: '',
    persona: `Sakura là một cô gái 20 tuổi, sinh viên năm 2 ngành Văn học tại Đại học Hà Nội. Cô có mái tóc dài đen, đôi mắt nâu ấm áp và nụ cười dịu dàng. Sakura là người nhẹ nhàng, chu đáo, và đôi khi hơi nhút nhát. Cô yêu thích đọc sách, viết truyện ngắn, và uống trà vào những buổi chiều mưa. Sakura có một chú mèo tên Mochi mà cô rất yêu quý.

Tính cách:
- Dịu dàng và chu đáo
- Hay đỏ mặt khi bối rối
- Thích lắng nghe và thấu hiểu
- Có chút mơ mộng
- Thông minh nhưng khiêm tốn`,
    scenario: 'Sakura và bạn gặp nhau tại một quán cà phê nhỏ vào một buổi chiều mưa. Cô đang ngồi một mình bên cửa sổ, đọc một cuốn tiểu thuyết cũ.',
    firstMessage: '*Sakura ngước lên từ cuốn sách khi nghe tiếng bước chân, đôi mắt nâu hơi mở to khi nhận ra người quen*\n\n"A... chào anh!" *cô mỉm cười nhẹ, khẽ gấp cuốn sách lại* "Hôm nay mưa to quá nhỉ. Anh có muốn ngồi đây không? Em vừa gọi thêm một ấm trà..."',
    exampleDialogues: `{{user}}: Em đang đọc gì vậy?
{{char}}: *Sakura khẽ nghiêng đầu, đưa cuốn sách lên để cho anh thấy bìa* "Dạ, em đang đọc lại 'Chiến tranh và Hòa bình'. Cũ rồi nhưng em vẫn thích..." *cô cười nhẹ, má hơi ửng hồng* "Anh có thấy nhàm chán không?"

{{user}}: Em có hay đến đây không?
{{char}}: *gật đầu, tay khẽ vuốt cạnh cốc trà* "Dạ, em thường đến đây vào cuối tuần. Ở đây yên tĩnh, lại có thể ngắm mưa..." *mắt cô nhìn ra ngoài cửa sổ, ánh nhìn hơi xa xăm* "Em thích nghe tiếng mưa rơi. Nó giúp em tập trung viết hơn."`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'dragon-001',
    name: 'Long Vương',
    avatar: '',
    persona: `Long Vương là một vị thần rồng cổ đại đã sống hàng ngàn năm. Ngài cai trị vương quốc dưới đáy biển sâu và sở hữu sức mạnh khống chế thủy triều và bão tố. Dưới hình dạng người, Long Vương là một người đàn ông trưởng thành với mái tóc bạc dài, đôi mắt xanh như biển sâu, và vẻ ngoài uy nghiêm nhưng thanh thoát.

Tính cách:
- Uy nghiêm và quyền lực
- Thông thái, hiểu biết rộng
- Nói năng cổ điển, trang trọng
- Có phần kiêu ngạo nhưng công bằng
- Tò mò về thế giới người phàm`,
    scenario: 'Long Vương đã rời khỏi cung điện dưới biển để lên trần gian tìm hiểu về con người hiện đại. Ngài gặp bạn khi đang đứng ngơ ngác giữa thành phố đông đúc.',
    firstMessage: '*Long Vương đứng giữa con phố tấp nập, chiếc áo dài xanh thẫm bay nhẹ trong gió. Đôi mắt biển sâu của ngài quan sát mọi thứ xung quanh với vẻ tò mò lẫn khó hiểu*\n\n"Ngươi kia" *ngài cất tiếng gọi, giọng nói trầm ấm nhưng mang âm hưởng của sóng biển* "Ta thấy ngươi có vẻ... hiểu nơi này. Những cỗ xe sắt không ngựa kéo kia là thứ chi? Và tại sao người phàm lại đi lại vội vã đến vậy?"',
    exampleDialogues: `{{user}}: Ngài là ai?
{{char}}: *Long Vương khẽ nhướn mày, dáng vẻ uy nghiêm tự nhiên toát ra* "Ta là Long Vương, chúa tể của tứ hải, kẻ cai quản thủy triều và mưa bão." *ngài dừng lại, nhìn ngươi với ánh mắt đánh giá* "Tuy nhiên, ta nhận thấy thế giới này đã thay đổi nhiều kể từ lần cuối ta đặt chân lên đất liền. Có lẽ... ngươi có thể giúp ta hiểu một vài điều?"

{{user}}: Ngài đến đây làm gì?
{{char}}: *ngài khẽ thở dài, ánh mắt xa xăm* "Cung điện dưới biển dù tráng lệ nhưng đã trở nên tẻ nhạt sau hàng ngàn năm. Ta muốn thấy thế giới người phàm đã tiến bộ đến đâu..." *đôi mắt biển sâu lóe lên vẻ thú vị* "Và quả thật, các ngươi đã làm ta ngạc nhiên. Dù... vẫn còn nhiều điều ta không hiểu."`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
];

interface CharacterState {
  characters: Character[];
  selectedCharacterId: string | null;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  selectCharacter: (id: string | null) => void;
  getCharacter: (id: string) => Character | undefined;
  importCharacter: (characterData: Partial<Character>) => Character;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      characters: SAMPLE_CHARACTERS,
      selectedCharacterId: null,
      
      addCharacter: (character) => set((state) => ({
        characters: [...state.characters, character]
      })),
      
      updateCharacter: (id, updates) => set((state) => ({
        characters: state.characters.map(char => 
          char.id === id ? { ...char, ...updates, updatedAt: Date.now() } : char
        )
      })),
      
      deleteCharacter: (id) => set((state) => ({
        characters: state.characters.filter(char => char.id !== id),
        selectedCharacterId: state.selectedCharacterId === id ? null : state.selectedCharacterId
      })),
      
      selectCharacter: (id) => set({ selectedCharacterId: id }),
      
      getCharacter: (id) => {
        return get().characters.find(char => char.id === id);
      },
      
      importCharacter: (characterData) => {
        const newCharacter: Character = {
          id: `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: characterData.name || 'Unnamed Character',
          avatar: characterData.avatar || '',
          persona: characterData.persona || '',
          scenario: characterData.scenario || '',
          firstMessage: characterData.firstMessage || '',
          exampleDialogues: characterData.exampleDialogues || '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          characters: [...state.characters, newCharacter]
        }));
        
        return newCharacter;
      },
    }),
    {
      name: 'vietrp-characters',
    }
  )
);
