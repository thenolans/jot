import Note from "components/Note";
import Masonry from "react-masonry-css";

const NOTES = [
  `# Emergency preparedness

**Water**
- 1 gallon per person per day
- For at least 3 days for evacuating
- 2 week supply for home

**Food**
- 3 days supply for evacuating
- 2 week supply for home

**Gear**
- Flashlight
- First aid kit
- Multi tool with manual can opener
- Battery bank
- Generator
- Candles


 **Other**
- Same supplies for dogs
- Know how to hook up to heat
- Know how to hook up to water pump
- Bug out bag for each family member

https://theprepared.com/bug-out-bags/guides/bug-out-bag-list/
`,
  `
# Home Build Ideas

- Fish tank (octopus, stingray, Nemo)
- epoxy garage floors
- Board game room and offices inside of the hobbit house with a view.
- master light switches to turn off entire rooms from bed and by the door
- Light switch to turn on bathroom light from bed 
- European windows that open 2 ways
- Let as much light and outdoors in (as many windows as reasonably possible)
- Black out curtains in bedroom
- Seating area in bedroom (Ironworks/Forestis)
- Gear room for camping/hiking/airstream
`,
  `
# Pinball records

**Medieval Madness**
- 60,???,??? (Jimmy)
- 40,098,550 (Tom) 
- 34,401,180 (Tom)
- 31,310,010 (Tom) 
- 21,703,110 (Dacey)

**Indiana Jones**
- 500,???,??? (Jimmy)
- 272,922,750 (Jimmy)
- 235,231,310 (Tom) 
- 115,818,960 (Dacey)   

**Cactus Canyon**
- 42,222,840 (Tom)
- 24,587,910 (Tom) 

**Addams Family**
- 227,121,560 (Jimmy)
- 175,017,110 (Tom)
`,
  `# Jot v2

- Quick notes are notes without folders
- Templates for things like recipes?
- Attachments in notes 
- Folders 
- Nested folders 
- Shared folders and notes
- Full screen editing
- Soft delete / trash
`,
  `# Disney Favorites

**Drinks**
- Trader Sam's Grotto 
- Oga's Cantina 
- Boathouse
- Nomad Lounge 
- Dockside 


**Food**
- Egg roll cart in MK
- Steakhouse 71 Brunch
`,
  `# Baking ideas

- Vol-au-vent
- Danish kransekake (🎄)
- Bake Icelandic laffa bread (🎄)
- Mochatine
- Jalapeno cheddar bread loaf
- Lace pancakes
- Churros
- Walnut whirls
- Stroop waffles
- Swiss mini rolls 
- Fortune cookies 
- Cannoli 
`,
  `# Halloween Headstone Phrases

Hap A Rition
Manny Festation
Metta Fisiks
Clare Voince
Wee G Bord
Paul Tergyst

---

Rest in peace
Cousin Hewitt
We all know
He didn't do it

---

Here lies
Good ol Fred
A great big rock fell on his head

---

A train made a stain
Of absent minded uncle Blaine
Rest in pieces
`,
  `# Board Game House Rules and Clarifications

**Wingspan**
- "Tits" in a bird's name is considered anatomy for all purposes of the game

**Munchkin**
- Wizards must discard at least 3 cards to tame a monster
- Kneepads of Allure is only one time use and sell for only 200 gold
- Help me out here is permanently kept, not a one time use 

**Forbidden Desert**
- [Navigators can move the explorer diagonally](https://boardgames.stackexchange.com/questions/5933/in-forbidden-island-can-a-navigator-move-an-explorer-diagonally)
- Game does not end when a player dies, but all parts they collected are dropped and play continues normally omitting the dead player. Other players must retrieve any dropped parts by moving to them and picking up each using an action 
- Draft roles by divvying the roles up as evenly as possible based on the number of players and select one
`,
  `# Star Wars Watch Order

1. Episode I: Phantom Menace
1. Episode II: Attack of the Clones
1. The Clone Wars Film
1. The Clone Wars Seasons
1. Episode III: Revenge of the Sith
1. Solo: A Star Wars Story
1. Star Wars Rebels Seasons 1-4
1. Rogue One: A Star Wars Story
1. Episode IV: A new Hope
1. Episode V: The Empire Strikes Back
1. Episode VI: Return of the Jedi
1. The Mandalorian
1. Star Wars Resistance
1. Episode VII: The Force Awakens
1. Episode VIII: The Last Jedi
1. Episode IX: The Rise of Skywalker
`,
];

export default function NoteGrid() {
  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1024: 2,
        512: 1,
      }}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {NOTES.map((note, index) => (
        // TODO Fix index
        <Note key={index} content={note} />
      ))}
    </Masonry>
  );
}
